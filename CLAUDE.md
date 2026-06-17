# AusTradie — Claude Code Instructions

## Project
Vite + React + TypeScript SPA. Supabase backend. Tailwind CSS.
Live at: https://www.austradie.com.au
GitHub: https://github.com/trueozmart/austradie
Deployed via Vercel (auto-deploys from main).

## Branch workflow
**Always commit directly to main.** No feature branches, no PRs.
Vercel auto-deploys to production on every push to main.

```bash
git checkout main && git pull origin main
# make changes, then:
git add <files> && git commit -m "..." && git push origin main
```

## Key env vars (in .env)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — for admin scripts only, never exposed to frontend

## Colors
- Navy: `#0f1f3d`
- Gold: `#f4b400`

## SEO rules
- `SITE_URL = 'https://www.austradie.com.au'` (www is canonical — Vercel redirects non-www to www)
- All canonical URLs, sitemap, and JSON-LD must use www
- Listing pages use trade-specific schema.org types (HousePainter, Plumber, Electrician etc.)
- Visit Website links use `rel="noopener"` only — NOT noreferrer (preserves link equity)

## Admin scripts
One-off `.mjs` scripts (import scripts, DB updates) go in the project root.
They are gitignored — do not commit them.
Run from the project root: `node script_name.mjs`

## Images
- Client (premium) listings: `/public/images/clients/{slug}/hero.jpg` + `gallery/project-N.jpg`
- Trade pool (all other listings): `/public/images/trade-pool/{trade}/{file}.jpg`
- Stock images: `/public/images/stock/` (legacy — replaced by trade-pool)

## Premium listings (is_corepages_client = true)
These are CorePages clients. They get:
- Real hero + 4 gallery images in `/public/images/clients/{slug}/`
- Full summary, services[], testimonials[], gallery_images[], website_url
- Enhanced listing badge + Visit Website CTA on their listing page
- Appear in Featured Listings on homepage
