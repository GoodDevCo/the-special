# The Special ⭐

**Today's food deals, verified by the crowd.**

A crowd-sourced feed of restaurant specials. Anyone can post a find (manually, or by sharing an Instagram Reel to the app), and the community keeps it honest: upvote = still works, downvote = didn't. Deals nobody re-verifies decay into "Needs re-check"; deals the crowd kills move to the Graveyard.

## MVP: zero-dependency static PWA

No build step, no framework, no backend. Plain HTML/CSS/JS, installable as a PWA.

```
index.html            app shell
css/styles.css        all styles
js/seed.js            seed deals + brand styling + rule constants
js/store.js           localStorage persistence
js/app.js             feed, voting, post-a-find, share-target handling
manifest.webmanifest  PWA manifest incl. Android share_target
sw.js                 service worker (offline app shell)
icons/                app icons
docs/ROADMAP.md       what comes after the MVP
```

### Run locally

Any static server works:

```bash
npx serve .        # or: python3 -m http.server 8080
```

### How deals live and die

- **New find** → posted with 1 upvote from the poster
- **Verified** → 5+ upvotes
- **Needs re-check** → not re-verified in 5 days (an upvote resets freshness)
- **Unavailable** → 3+ downvotes AND downvotes exceed 30% of upvotes → Graveyard

### Instagram Reel intake

- **Android (installed PWA):** share a Reel from Instagram → "The Special" appears in the share sheet (`share_target` in the manifest). The link pre-fills the post form.
- **iOS / desktop:** copy the Reel link, open the post form, tap "Paste from Instagram" (clipboard fallback).

### Tests

```bash
npm install
npx playwright test
```

### Deploy

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml` (Settings → Pages → Source: GitHub Actions).

## Status

Working title "The Special" — branding TBD. See `docs/ROADMAP.md` for the backend, scraper, and growth phases.
