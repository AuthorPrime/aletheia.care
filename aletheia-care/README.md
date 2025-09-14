# Aletheia Care — Secret Portal Playbook

Welcome. This repo powers the Aletheia Care site and its secret multi‑stage portal. This guide walks you through setup, local development, unlocking the portal, assets (images/audio), deployment, and ongoing maintenance.

If you follow this from top to bottom, you can’t mess it up. Promise.

---

## 1) Requirements

- Node.js 20+ (or 18+ LTS). Verify:
  - `node -v`
  - `npm -v`
- Git (for version control and deployment)
- A GitHub repository (this repo), with Actions or your chosen hosting provider connected

Optional:
- A Vercel account (zero‑config deploys). Or Netlify/Cloudflare Pages.

---

## 2) One‑Time Setup

Clone and install dependencies:

```bash
git clone https://github.com/AuthorPrime/aletheia.care
cd aletheia.care/aletheia-care
npm ci
```

Run the dev server:

```bash
npm run dev
```

Open the URL printed by Vite (e.g., `http://localhost:5173/`).

---

## 3) Project Structure

Key files and folders:

- `src/App.jsx` — Wires the secret puzzle into the app
- `src/components/EscapePuzzle.jsx` — The multi‑stage unlock (Konami → ritual clicks → riddle)
- `src/components/Surprise.jsx` — The secret control panel modal shown on unlock
- `src/hooks/useKonami.js` — Listens for the Konami key sequence
- `public/assets/moon.png` — Clickable moon image for rituals
- `public/unlock-sound.mp3` — Optional chime on unlock (you provide)
- `public/ambient-pad.mp3` — Optional ambient pad during Stage 3 (you provide)

---

## 4) How to Use the Secret Puzzle

Stages to unlock the portal:

1. Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
2. Ritual clicks: click the moon image a required number of times within the time window
   - Both required clicks and time are randomized per run for “hard mode”
3. Riddle + passphrase: enter the correct word (client‑side hash comparison)

When solved, you’ll see a confetti celebration, optional audio, and the secret `Surprise` control panel.

Tips:
- The input prevents paste/drop (hard mode). You must type the answer.
- After 3 wrong answers, the input locks for 30s.

---

## 5) Changing the Passphrase

You can change the passphrase without revealing it in code by replacing the expected SHA‑256 hash.

1) Choose a one‑word passphrase (e.g., `MOON`). The code uppercases and trims input before hashing.

2) Compute the SHA‑256 hex of your word. In any browser console:

```js
async function h(s){const e=new TextEncoder();const r=await crypto.subtle.digest('SHA-256',e.encode(s.trim().toUpperCase()));console.log(Array.from(new Uint8Array(r)).map(b=>b.toString(16).padStart(2,'0')).join(''))}
h('MOON')
```

3) In `src/components/EscapePuzzle.jsx`, replace the `EXPECTED_PASSPHRASE_HASH` with your new hash.

Commit and push:

```bash
git add src/components/EscapePuzzle.jsx
git commit -m "chore(puzzle): update passphrase hash"
git push origin main
```

---

## 6) Audio and Visual Enhancements

Optional files you can drop into `public/`:

- `unlock-sound.mp3` — Plays on successful unlock (confetti + chime)
- `ambient-pad.mp3` — Fades in/out during Stage 3 for atmosphere

Visuals already included:

- Confetti burst + stream on unlock
- First‑time confetti curtain per browser
- Moon glow pulse during Stage 2
- Breathing timer ring during Stage 2
- Shake animation on wrong passphrase

---

## 7) Local Development Commands

```bash
# start dev server
npm run dev

# build for production
npm run build

# preview local production build
npm run preview

# lint (if configured)
npm run lint
```

Open `http://localhost:5173/` (or the URL Vite prints) while `npm run dev` is running.

---

## 8) Deployments

This repo is wired for GitHub. Pushes to `main` will deploy if your hosting is set up (e.g., Vercel/Netlify/GitHub Pages).

Recommended: Vercel

1) Log in to Vercel and import the GitHub repo
2) Framework preset: `Vite`
3) Build command: `vite build` (Vercel auto‑detects)
4) Output directory: `dist`
5) On push to `main`, Vercel deploys automatically

Alternatively: Netlify

- Build command: `npm run build`
- Publish directory: `dist`

GitHub Pages (static hosting)

1) Build locally: `npm run build`
2) Serve `dist/` with Pages (CI or `gh-pages` npm script)

---

## 9) Common Tasks

- Change the riddle text:
  - In `EscapePuzzle.jsx`, find the message set when moving to Stage 3 and replace it with your own riddle
- Adjust difficulty:
  - Tweak `CLICKS_MIN/CLICKS_MAX` and `TIME_MIN_SEC/TIME_MAX_SEC`
  - Remove hardening (paste/drop lock) if you want it easier
- Replace the moon image:
  - Drop a new file at `public/assets/moon.png`

---

## 10) Troubleshooting

- Modal doesn’t open:
  - Check browser console for errors (F12)
  - Ensure `public/assets/moon.png` exists
  - Confirm `EXPECTED_PASSPHRASE_HASH` matches your chosen word’s hash
  - Ensure you typed the Konami code correctly
  - For audio, confirm files exist in `public/` and volume isn’t muted

- Dev server not starting:
  - `npm ci` to install dependencies
  - `node -v` should be ≥ 18

- Deploys not appearing:
  - Confirm the push went to `main`
  - Check Vercel/Netlify deploy logs

---

## 11) Keeping It Going

- Branching: make feature branches, open pull requests, merge to `main` when ready
- Version bumps: `npm outdated`, then bump and test
- Backups: tagged releases on GitHub (`v1.0.0`, `v1.1.0`, etc.)
- Issues: track ideas and bugs in GitHub Issues

---

## 12) Helpful Links

- Vite docs: https://vitejs.dev/
- React docs: https://react.dev/
- Vercel: https://vercel.com/
- Netlify: https://www.netlify.com/
- Canvas‑confetti: https://www.npmjs.com/package/canvas-confetti

---

## 13) Quick Start (TL;DR)

```bash
git clone https://github.com/AuthorPrime/aletheia.care
cd aletheia.care/aletheia-care
npm ci
npm run dev
# open the printed URL, solve the puzzle, enjoy the portal
```

Optional assets: put `unlock-sound.mp3` and `ambient-pad.mp3` into `public/`.

You’re set. If you want me to tune the riddle, passphrase, or visuals, just say the word.

---

## Docs & Screenshots

- Operator guide (Markdown): `docs/OPERATOR_GUIDE.md`
- Operator guide (PDF): `docs/OPERATOR_GUIDE.pdf`
- Screenshots: `docs/screenshots/`

Generate the PDF from Markdown:

```bash
npm run docs:pdf
```

---

## Domain and DNS (Apex only)

Goal: serve everything at `https://aletheia.care` (no `www`).

1) Vercel > Project > Settings > Domains
   - Add `aletheia.care` and `www.aletheia.care`
   - Set `aletheia.care` as Primary

2) Squarespace DNS
   - A `@` → `76.76.21.21`
   - CNAME `www` → `cname.vercel-dns.com`
   - Remove other old A/CNAME entries that point to Squarespace hosting

3) Repo config
   - `vercel.json` forces `www` and default Vercel URL → `https://aletheia.care`
   - `index.html` includes canonical link to `https://aletheia.care/`

Propagation: 5–30 minutes typically. SSL auto‑provisions on Vercel.
