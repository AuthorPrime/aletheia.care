# tidy_cli — Safe file tidying utility

Safe by default (dry-run) tool to help you clean up a folder tree:

- Dedupe: find duplicate files by content hash; optionally move or delete
- Organize: sort files into folders by extension or by modified date (YYYY/MM)
- Encrypt: optional symmetric encryption (Fernet) to an output directory with key management

## Quick start

```bash
python tidy.py --root /path/to/files --dedupe report
python tidy.py --root /path/to/files --organize ext --apply
python tidy.py --root /path --dedupe move --duplicates-dir /path/_dups --apply
python tidy.py --root /path --encrypt --key-file /path/_key.fernet --apply
```

- Dry-run by default. Use `--apply` to make changes.
- Hidden files are skipped unless you pass `--include-hidden`.

## Install (only if you need encryption)

```bash
pip install -r requirements.txt
```

This installs `cryptography` for Fernet encryption. The script imports it lazily only when `--encrypt` is used.

## Usage

```bash
python tidy.py [--root DIR] [--include-hidden] [--exclude-glob PATTERN ...] \
  [--apply] \
  [--dedupe report|move|delete] [--duplicates-dir DIR] \
  [--organize ext|date] [--organize-dir DIR] \
  [--encrypt] [--encryption-output-dir DIR] [--key-file FILE] [--remove-originals]
```

### Flags

- `--root DIR`: Root directory to operate on (default: current working directory)
- `--include-hidden`: Include hidden files/directories
- `--exclude-glob PATTERN`: Glob to exclude; can be repeated
- `--apply`: Actually perform changes (otherwise prints actions only)

#### Dedupe
- `--dedupe report|move|delete`: Find duplicates. `report` prints; `move` relocates duplicates; `delete` removes them
- `--duplicates-dir DIR`: Destination for moved duplicates (default: `<root>/_duplicates`)

#### Organize
- `--organize ext|date`: Organize by file extension or modified date (YYYY/MM)
- `--organize-dir DIR`: Base directory for organized files (default: `<root>/_organized`)

#### Encrypt
- `--encrypt`: Encrypt files into an output directory using Fernet
- `--encryption-output-dir DIR`: Output base (default: `<root>/_encrypted`)
- `--key-file FILE`: Key file path (default: `<root>/_key.fernet`). Created if missing
- `--remove-originals`: Remove originals after encryption (be careful; consider keeping backups)

## Safety notes

- Always start with a dry-run (default). Confirm actions, then add `--apply`.
- `delete` is destructive. Use backups and/or version control.
- Encryption writes `.enc` files and can remove originals if you pass `--remove-originals`.
- The key file controls decryption. Store it securely and back it up.

## Decryption (manual)

The tool focuses on encryption, but you can decrypt with a short Python snippet:

```python
from pathlib import Path
from cryptography.fernet import Fernet
key = Path("/path/_key.fernet").read_bytes()
fernet = Fernet(key)
enc = Path("/path/_encrypted/example.jpg.enc").read_bytes()
plain = fernet.decrypt(enc)
Path("/tmp/example.jpg").write_bytes(plain)
```

## License

MIT