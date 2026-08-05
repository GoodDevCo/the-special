# The Special — Roadmap

## Phase 1 — MVP (this repo) ✅
Static, zero-dependency PWA. Local-only votes (localStorage), seed deals, Android share_target for Instagram Reels, clipboard fallback, offline app shell, GitHub Pages deploy.

## Phase 2 — Real backend
- Shared deals + votes across users. Candidates: **Supabase** (Postgres, RLS, generous free tier) vs **Firebase** (Firestore). Decision open.
- Anonymous-first identity (device ID), optional accounts later.
- Vote integrity: one vote per device per deal; rate limits.
- Server-side deal lifecycle (verified / stale / expired) using the formalized rule: expired at 3+ downvotes AND downvotes > 30% of upvotes.

## Phase 3 — Deal ingestion pipeline
- Scraper for chain deal pages + aggregator sites (seed source: EatDrinkDeals).
- Instagram oEmbed for proper Reel embeds/thumbnails on deal cards.
- Dedup + normalization (chain names, day parsing, price extraction).
- Moderation queue before scraped deals go live.

## Phase 4 — Location & personalization
- Geolocation: local restaurants, not just national chains.
- Follow chains; push notifications for followed-chain drops (needs backend + web push).

## Phase 5 — Growth
- Poster reputation (accurate finds → trust weight in verification).
- Weekly "best specials near you" digest.
- Branding decision ("The Special" is a working title), custom domain.

## Known constraints
- Real Instagram share-sheet capture on iOS needs a native wrapper; PWA share_target is Android-only.
- No backend/auth in MVP; votes are per-device only.
