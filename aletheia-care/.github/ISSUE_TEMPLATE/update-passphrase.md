---
name: Update passphrase
about: Change the riddle passphrase (client hash)
title: "chore(puzzle): update passphrase hash"
labels: chore
assignees: ''
---

Steps:

1. Choose new one‑word passphrase
2. Compute SHA‑256 (uppercased, trimmed) in browser console:

```
async function h(s){const e=new TextEncoder();const r=await crypto.subtle.digest('SHA-256',e.encode(s.trim().toUpperCase()));console.log(Array.from(new Uint8Array(r)).map(b=>b.toString(16).padStart(2,'0')).join(''))}
h('NEWWORD')
```

3. Replace `EXPECTED_PASSPHRASE_HASH` in `src/components/EscapePuzzle.jsx`
4. Commit and push to `main`
