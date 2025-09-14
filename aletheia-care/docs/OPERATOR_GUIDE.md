# Aletheia Care — Operator Guide

This is a concise, printable guide for operating the secret portal.

## Routine Ops

- Start local dev: `npm run dev` → open the URL, verify portal unlock flow
- Update passphrase: compute SHA‑256 of your word (uppercased), update `EXPECTED_PASSPHRASE_HASH` in `src/components/EscapePuzzle.jsx`, commit and push
- Audio: place `public/unlock-sound.mp3` and `public/ambient-pad.mp3`
- Image: replace `public/assets/moon.png` if needed

## Unlock Checklist

1) Type Konami: Up Up Down Down Left Right Left Right B A
2) Click moon N times within T seconds (shown on screen)
3) Enter the riddle’s passphrase (case‑insensitive)

On success: confetti + chime + portal opens.

## Troubleshooting

- Portal not opening: check browser console (F12), verify `moon.png` exists, confirm passphrase hash
- Audio not playing: ensure files are in `public/` and volume isn’t muted
- Lockout: 30s cooldown after 3 wrong passphrases

---

Screenshots live in `docs/screenshots/`.

---

## Domain & DNS (Apex only)

- Primary domain: `https://aletheia.care` (no `www`)
- Squarespace DNS:
  - A `@` → `76.76.21.21`
  - CNAME `www` → `cname.vercel-dns.com`
- Repo:
  - `vercel.json` redirects `www` and default Vercel URL → apex
  - `index.html` has canonical to `https://aletheia.care/`