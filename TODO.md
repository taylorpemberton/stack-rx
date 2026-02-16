# peptide-finder — TODO

## Domain & Launch
- [ ] Check availability: peptide.fyi, peptides.fyi, peptides.io
- [ ] Check availability: peptidefile.com, everypeptide.com, peptide101.com
- [ ] Buy domain
- [ ] Set up hosting (Vercel / Netlify / Cloudflare Pages)
- [ ] Connect custom domain
- [ ] Set up Google Analytics — add `VITE_GA_MEASUREMENT_ID` to production env

## Design
- [ ] Finish background color (got cut off — revisit)
- [ ] Add favicon / OG image for social sharing
- [ ] Dark mode toggle
- [ ] Add logo (replace diamond placeholder)

## Features — v1
- [ ] Calculator page: compare 2-3 peptides side by side (radar chart or stat overlay)
- [ ] Sort options (alphabetical, by top stat, by category)
- [ ] URL params for filters so filtered views are shareable/bookmarkable
- [ ] Expand peptide database (Melanotan II, Hexarelin, Tesamorelin, NAD+, GHK, etc.)
- [ ] Add dosage / protocol info per peptide (general ranges, not medical advice)

## Features — v2
- [ ] Peptide stack builder (combine peptides, see combined stat profile)
- [ ] "Compare" mode: select 2 cards, see stats side by side
- [ ] User favorites / saved list (localStorage)
- [ ] Sitemap.xml generation for SEO (one URL per peptide detail page)
- [ ] RSS or blog section for content marketing / SEO juice
- [ ] Structured data (JSON-LD) on detail pages for Google rich results

## Monetization
- [ ] Per-page GA tracking is wired — build traffic report template for sponsors
- [ ] Add subtle "sponsored" card slot in grid
- [ ] Affiliate link slots on detail pages (supplier links)
- [ ] Ad slot zones (header, between grid rows)

## Tech Debt
- [ ] Upgrade Node to 20+ (currently 18, Vite 5 works but newer tooling won't)
- [ ] Add tests (at least filter logic + route rendering)
- [ ] Extract CSS into component-scoped modules or Tailwind
- [ ] Verify all PubMed source links are live and correct
