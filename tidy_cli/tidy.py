#!/usr/bin/env python3
"""
tidy.py — Safe file tidying CLI

Capabilities (all safe by default, dry-run unless --apply):
- Dedupe: find duplicate files by content hash; optionally move or delete duplicates
- Organize: move files into folders by extension or by modified date (YYYY/MM)
- Encrypt: optional symmetric encryption to an output directory with key file management

Examples:
  python tidy.py --root /path/to/files --dedupe report
  python tidy.py --root /path/to/files --organize ext --apply
  python tidy.py --root /path --dedupe move --duplicates-dir /path/_dups --apply
  python tidy.py --root /path --encrypt --key-file /path/_key.fernet --apply

Notes:
- Encryption uses Fernet (cryptography). Imported lazily; install when needed.
- Hidden files/dirs are skipped unless --include-hidden is provided.
"""

from __future__ import annotations

import argparse
import base64
import fnmatch
import hashlib
import os
import shutil
import sys
import time
from dataclasses import dataclass
import json
import csv
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple


def print_action(message: str, dry_run: bool) -> None:
    prefix = "[DRY-RUN] " if dry_run else ""
    print(f"{prefix}{message}")


def is_hidden(path: Path) -> bool:
    try:
        return any(part.startswith('.') for part in path.parts)
    except Exception:
        return False


def should_skip(path: Path, include_hidden: bool, exclude_globs: Sequence[str]) -> bool:
    if not include_hidden and is_hidden(path):
        return True
    for pattern in exclude_globs:
        if fnmatch.fnmatch(str(path), pattern):
            return True
    return False


def iter_files(root_dir: Path, include_hidden: bool, exclude_globs: Sequence[str]) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        current_dir = Path(dirpath)
        # Optionally prune hidden directories for performance
        if not include_hidden:
            dirnames[:] = [d for d in dirnames if not d.startswith('.')]
        for filename in filenames:
            file_path = current_dir / filename
            if file_path.is_file() and not should_skip(file_path, include_hidden, exclude_globs):
                yield file_path


def compute_file_hash(file_path: Path, hash_name: str = "sha256", chunk_size: int = 1024 * 1024) -> str:
    hasher = hashlib.new(hash_name)
    with file_path.open('rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            hasher.update(chunk)
    return hasher.hexdigest()


def group_files_by_size(files: Iterable[Path]) -> Dict[int, List[Path]]:
    size_to_files: Dict[int, List[Path]] = {}
    for file_path in files:
        try:
            size = file_path.stat().st_size
        except OSError:
            continue
        size_to_files.setdefault(size, []).append(file_path)
    return size_to_files


def find_duplicates(root_dir: Path, include_hidden: bool, exclude_globs: Sequence[str]) -> Dict[str, List[Path]]:
    candidates_by_size = group_files_by_size(iter_files(root_dir, include_hidden, exclude_globs))
    hash_to_files: Dict[str, List[Path]] = {}
    for size, paths in candidates_by_size.items():
        if len(paths) < 2:
            continue
        for path in paths:
            try:
                digest = compute_file_hash(path)
            except (OSError, PermissionError):
                continue
            hash_to_files.setdefault(digest, []).append(path)
    # Only keep true duplicates (2+ files per hash)
    return {h: ps for h, ps in hash_to_files.items() if len(ps) > 1}


def ensure_directory(directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)


def safe_move(src: Path, dest: Path, dry_run: bool) -> None:
    ensure_directory(dest.parent)
    if dest.exists():
        # Add numeric suffix to avoid overwrite
        stem = dest.stem
        suffix = dest.suffix
        parent = dest.parent
        counter = 1
        while True:
            candidate = parent / f"{stem}__{counter}{suffix}"
            if not candidate.exists():
                dest = candidate
                break
            counter += 1
    print_action(f"move {src} -> {dest}", dry_run)
    if not dry_run:
        shutil.move(str(src), str(dest))


def dedupe_action(root_dir: Path, mode: str, duplicates_dir: Path, include_hidden: bool, exclude_globs: Sequence[str], dry_run: bool) -> Tuple[int, int]:
    """Return (num_groups, num_files_moved_or_deleted)."""
    duplicates = find_duplicates(root_dir, include_hidden, exclude_globs)
    if not duplicates:
        print("No duplicates found.")
        return (0, 0)

    print(f"Found {len(duplicates)} duplicate groups.")
    operated_files = 0
    for digest, paths in duplicates.items():
        # Keep the first occurrence, operate on the rest
        original = min(paths, key=lambda p: len(str(p)))
        others = [p for p in paths if p != original]
        print(f"Hash {digest[:12]}… keep: {original}")
        for dup in others:
            if mode == 'report':
                print_action(f"duplicate: {dup}", True)
            elif mode == 'move':
                target = duplicates_dir / dup.name
                safe_move(dup, target, dry_run)
                operated_files += 1
            elif mode == 'delete':
                print_action(f"delete {dup}", dry_run)
                if not dry_run:
                    try:
                        dup.unlink()
                        operated_files += 1
                    except OSError as exc:
                        print(f"Failed to delete {dup}: {exc}")
            else:
                raise ValueError("Invalid dedupe mode")
    return (len(duplicates), operated_files)


def organize_files(root_dir: Path, organize_mode: str, organize_dir: Path, include_hidden: bool, exclude_globs: Sequence[str], dry_run: bool) -> int:
    """Return number of files organized (moved)."""
    count = 0
    for file_path in iter_files(root_dir, include_hidden, exclude_globs):
        try:
            if organize_mode == 'ext':
                ext = file_path.suffix.lower().lstrip('.') or 'noext'
                target_dir = organize_dir / ext
            elif organize_mode == 'date':
                stat = file_path.stat()
                t = time.localtime(stat.st_mtime)
                target_dir = organize_dir / f"{t.tm_year:04d}" / f"{t.tm_mon:02d}"
            else:
                raise ValueError("Invalid organize mode")
        except OSError:
            continue

        target_path = target_dir / file_path.name
        if target_path.resolve() == file_path.resolve():
            continue
        safe_move(file_path, target_path, dry_run)
        count += 1
    if count == 0:
        print("No files to organize or already organized.")
    return count


def inventory_report(
    root_dir: Path,
    include_hidden: bool,
    exclude_globs: Sequence[str],
    top_n: int,
) -> Dict[str, object]:
    total_files = 0
    total_size = 0
    by_extension_count: Dict[str, int] = defaultdict(int)
    by_extension_size: Dict[str, int] = defaultdict(int)
    by_month_count: Dict[str, int] = defaultdict(int)
    by_month_size: Dict[str, int] = defaultdict(int)
    largest: List[Tuple[int, str]] = []  # (size, path)

    for file_path in iter_files(root_dir, include_hidden, exclude_globs):
        try:
            stat = file_path.stat()
        except OSError:
            continue
        size = int(stat.st_size)
        total_files += 1
        total_size += size

        # Extension bucket
        ext = file_path.suffix.lower().lstrip('.') or 'noext'
        by_extension_count[ext] += 1
        by_extension_size[ext] += size

        # Month bucket
        t = time.localtime(stat.st_mtime)
        month_key = f"{t.tm_year:04d}-{t.tm_mon:02d}"
        by_month_count[month_key] += 1
        by_month_size[month_key] += size

        # Track largest
        largest.append((size, str(file_path)))

    largest.sort(reverse=True)
    top_largest = [{"path": p, "size_bytes": s} for s, p in largest[: max(0, top_n)]]

    ext_summary = [
        {"ext": ext, "count": by_extension_count[ext], "size_bytes": by_extension_size[ext]}
        for ext in sorted(by_extension_count.keys())
    ]
    month_summary = [
        {"month": month, "count": by_month_count[month], "size_bytes": by_month_size[month]}
        for month in sorted(by_month_count.keys())
    ]

    return {
        "root": str(root_dir),
        "total_files": total_files,
        "total_size_bytes": total_size,
        "by_extension": ext_summary,
        "by_month": month_summary,
        "top_largest": top_largest,
    }


def emit_report(report: Dict[str, object], fmt: str, output: Optional[Path]) -> None:
    if fmt == 'json':
        text = json.dumps(report, indent=2)
        if output:
            ensure_directory(output.parent)
            output.write_text(text)
            print(f"Wrote JSON report to {output}")
        else:
            print(text)
        return

    if fmt == 'csv':
        # Single CSV with typed rows: section,type/key,count,size
        rows: List[Dict[str, object]] = []
        rows.append({"section": "totals", "key": "total_files", "count": report["total_files"], "size_bytes": report["total_size_bytes"]})
        for item in report.get("by_extension", []):
            rows.append({"section": "by_extension", "key": item["ext"], "count": item["count"], "size_bytes": item["size_bytes"]})
        for item in report.get("by_month", []):
            rows.append({"section": "by_month", "key": item["month"], "count": item["count"], "size_bytes": item["size_bytes"]})
        for item in report.get("top_largest", []):
            rows.append({"section": "top_largest", "key": item["path"], "count": "", "size_bytes": item["size_bytes"]})

        header = ["section", "key", "count", "size_bytes"]
        csv_text_lines: List[str] = []
        csv_buffer_path = None
        # Write to file or stdout
        if output:
            ensure_directory(output.parent)
            with output.open('w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=header)
                writer.writeheader()
                writer.writerows(rows)
            print(f"Wrote CSV report to {output}")
        else:
            writer = csv.DictWriter(sys.stdout, fieldnames=header)
            writer.writeheader()
            writer.writerows(rows)
        return

    # text
    def human(n: int) -> str:
        units = ['B', 'KB', 'MB', 'GB', 'TB']
        size = float(n)
        i = 0
        while size >= 1024 and i < len(units) - 1:
            size /= 1024.0
            i += 1
        return f"{size:.2f} {units[i]}"

    print("Inventory Report")
    print(f"Root: {report['root']}")
    print(f"Total files: {report['total_files']}")
    print(f"Total size: {human(int(report['total_size_bytes']))}")
    print("")
    print("By extension (top 20 by size):")
    by_ext_sorted = sorted(report.get("by_extension", []), key=lambda x: x["size_bytes"], reverse=True)[:20]
    for item in by_ext_sorted:
        print(f"  .{item['ext']:<8} {item['count']:>6} files  {human(int(item['size_bytes'])):>10}")
    print("")
    print("By month (last 12 by date):")
    by_month = list(report.get("by_month", []))
    by_month_sorted = sorted(by_month, key=lambda x: x["month"], reverse=True)[:12]
    for item in by_month_sorted:
        print(f"  {item['month']}: {item['count']:>6} files  {human(int(item['size_bytes'])):>10}")
    print("")
    print("Top largest files:")
    for item in report.get("top_largest", []):
        print(f"  {human(int(item['size_bytes'])):>10}  {item['path']}")


def read_or_create_key(key_file: Path) -> bytes:
    """Read a Fernet key from key_file, or create a new one if missing.

    Uses cryptography.fernet.Fernet.generate_key if available; otherwise, constructs a
    urlsafe base64-encoded 32-byte key compatible with Fernet.
    """
    if key_file.exists():
        data = key_file.read_bytes().strip()
        return data
    # Try to use cryptography to generate a key if present
    try:
        from cryptography.fernet import Fernet  # type: ignore

        key = Fernet.generate_key()
    except Exception:
        # Fallback: generate 32 raw bytes and base64-url encode
        random_bytes = os.urandom(32)
        key = base64.urlsafe_b64encode(random_bytes)
    ensure_directory(key_file.parent)
    key_file.write_bytes(key)
    print(f"Wrote key file: {key_file}")
    return key


def encrypt_file(src: Path, dest: Path, key: bytes, dry_run: bool) -> None:
    try:
        from cryptography.fernet import Fernet  # type: ignore
    except Exception:
        print("Encryption requested but 'cryptography' is not installed.\n"
              "Install with: pip install -r requirements.txt or pip install cryptography")
        sys.exit(2)

    ensure_directory(dest.parent)
    print_action(f"encrypt {src} -> {dest}", dry_run)
    if dry_run:
        return

    fernet = Fernet(key)
    data = src.read_bytes()
    token = fernet.encrypt(data)
    dest.write_bytes(token)


def encrypt_tree(root_dir: Path, output_dir: Path, key_file: Path, include_hidden: bool, exclude_globs: Sequence[str], remove_originals: bool, dry_run: bool) -> int:
    key = read_or_create_key(key_file)
    count = 0
    for file_path in iter_files(root_dir, include_hidden, exclude_globs):
        # Skip already encrypted files
        if file_path.suffix == '.enc':
            continue
        relative = file_path.relative_to(root_dir)
        target_path = output_dir / relative.with_suffix(relative.suffix + '.enc')
        encrypt_file(file_path, target_path, key, dry_run)
        if remove_originals:
            print_action(f"delete original {file_path}", dry_run)
            if not dry_run:
                try:
                    file_path.unlink()
                except OSError as exc:
                    print(f"Failed to delete {file_path}: {exc}")
        count += 1
    if count == 0:
        print("No files encrypted (nothing matched or already encrypted).")
    return count


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Safe file tidying utility (dry-run by default)")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Root directory to operate on")
    parser.add_argument("--include-hidden", action="store_true", help="Include hidden files and directories")
    parser.add_argument("--exclude-glob", action="append", default=[], help="Glob pattern to exclude (can repeat)")

    # Safety
    parser.add_argument("--apply", action="store_true", help="Apply changes (otherwise dry-run)")

    # Inventory/report
    parser.add_argument("--report", action="store_true", help="Inventory report (counts, sizes, largest files)")
    parser.add_argument("--report-format", choices=["text", "json", "csv"], default="text", help="Report output format")
    parser.add_argument("--report-output", type=Path, help="Optional file path to write report to")
    parser.add_argument("--report-top", type=int, default=20, help="Top N largest files to include")

    # Dedupe
    parser.add_argument("--dedupe", choices=["report", "move", "delete"], help="Find duplicates and optionally move/delete them")
    parser.add_argument("--duplicates-dir", type=Path, help="Where to move duplicates when --dedupe move (default: <root>/_duplicates)")

    # Organize
    parser.add_argument("--organize", choices=["ext", "date"], help="Organize files by extension or modified date")
    parser.add_argument("--organize-dir", type=Path, help="Target base directory for organized files (default: <root>/_organized)")

    # Encryption
    parser.add_argument("--encrypt", action="store_true", help="Encrypt files to an output directory (Fernet)")
    parser.add_argument("--encryption-output-dir", type=Path, help="Where encrypted files are written (default: <root>/_encrypted)")
    parser.add_argument("--key-file", type=Path, help="Path to key file (default: <root>/_key.fernet)")
    parser.add_argument("--remove-originals", action="store_true", help="Remove originals after successful encryption")

    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = parse_args(argv)

    root_dir: Path = args.root.resolve()
    include_hidden: bool = bool(args.include_hidden)
    exclude_globs: List[str] = list(args.exclude_glob)
    dry_run: bool = not bool(args.apply)

    if not root_dir.exists() or not root_dir.is_dir():
        print(f"Root directory does not exist or is not a directory: {root_dir}")
        return 2

    # Resolve default directories relative to root
    duplicates_dir = (args.duplicates_dir or (root_dir / "_duplicates")).resolve()
    organize_dir = (args.organize_dir or (root_dir / "_organized")).resolve()
    encryption_output_dir = (args.encryption_output_dir or (root_dir / "_encrypted")).resolve()
    key_file = (args.key_file or (root_dir / "_key.fernet")).resolve()

    any_work = False

    if args.report:
        any_work = True
        report = inventory_report(root_dir, include_hidden, exclude_globs, int(args.report_top))
        emit_report(report, args.report_format, args.report_output)

    if args.dedupe:
        any_work = True
        mode = args.dedupe
        if mode == 'move':
            ensure_directory(duplicates_dir)
        groups, ops = dedupe_action(root_dir, mode, duplicates_dir, include_hidden, exclude_globs, dry_run)
        print(f"Dedupe: {groups} groups; {ops} files {'moved/deleted' if mode != 'report' else 'not changed'}.")

    if args.organize:
        any_work = True
        ensure_directory(organize_dir)
        moved = organize_files(root_dir, args.organize, organize_dir, include_hidden, exclude_globs, dry_run)
        print(f"Organize: {moved} files moved.")

    if args.encrypt:
        any_work = True
        ensure_directory(encryption_output_dir)
        count = encrypt_tree(root_dir, encryption_output_dir, key_file, include_hidden, exclude_globs, bool(args.remove_originals), dry_run)
        print(f"Encrypt: {count} files written to {encryption_output_dir}.")

    if not any_work:
        print("Nothing to do. Pass one or more of --dedupe, --organize, --encrypt.")
        return 0

    if dry_run:
        print("Dry-run complete. Re-run with --apply to make changes.")
    else:
        print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

