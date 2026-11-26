# Lluna Plena Flors — website

Static, server-rendered site for the florist Lluna Plena Flors, Carrer de l'Aigua, 38,
08800 Vilanova i la Geltrú. Three locales: Catalan (default, at the root), Spanish at
`/es/`, English at `/en/`.

Served at <https://llunaplenaflors.vilanovailageltru.info/>.

## Build

```bash
ln -sfn /home/davidoc/.openclaw/workspace/node_modules node_modules
node scripts/build.mjs     # emits index.html, es/index.html, en/index.html, sitemap, robots
node scripts/verify.mjs    # headless checks over a throwaway local server
node scripts/assets.mjs    # og-image.jpg, icon PNGs from the default dictionary
node scripts/brand.mjs     # favicon.svg + icon PNGs in the shop's own mark (run after assets.mjs)
node scripts/card.mjs      # assets/photos/handover.png, 10.5 x 14.5 cm at 300 dpi with the QR
```

`build.mjs` fails on an unresolved `{{hole}}`, an empty `href`/`src`, or a JSON-LD block
that does not parse. `verify.mjs` starts its own static server on a random port and checks
per locale in a fresh browser context.

## Structure

```
src/data.json             business facts (address, coordinates, phone, rating, reviews)
src/locales.json          locale list: code, name, dir, default, hreflang
src/i18n/<code>.json      copy per locale
src/template.html         the page, one template for all three locales
assets/css/styles.css     styles; palette and typography tokens live in :root
assets/js/main.js         progressive enhancement only (nav, reveal, consent, map)
assets/fonts/             self-hosted Fraunces + Inter (woff2, latin and latin-ext)
assets/img/               hero photo, OG image, icons
assets/photos/            handover card and the source photo
scripts/                  build, verify, asset and card generators
```

Every asset path is relative so the site also works from an S3 prefix.

## Page structure

1. Top bar (address, language switch) and sticky header with a call button.
2. Hero: headline, phone-first call to action, rating proof, the shop photo, and an
   order strip (phone, address, delivery area).
3. Occasions — weddings, funerals, birthdays, season, events and businesses, care advice.
4. The shop — who makes the flowers, what leaves the counter each week, key figures.
5. How to order — three steps plus delivery area and same-day cut-off.
6. Reviews, drawn from the Google listing.
7. Contact — a large call card, address, listing link, and a map that waits for consent.

## Notes

- Canonical, `og:url`, hreflang, `sitemap.xml`, the OG image URL and the handover QR are all
  derived from `slug` + `siteDomain` in `src/data.json`. Nothing hardcodes a host.
- The phone number is a landline, so the site uses `tel:` links only and shows no WhatsApp
  action.
- Opening hours and price-per-person are deliberately not published.
- The review count is shown because it is above 50; the rating badge appears because it is
  above 4.
- The map loads only after cookie consent. Analytics uses the same decision: nothing is
  requested from Google before acceptance, and `window.__analyticsConsent(ok)` is the single
  switch.
- The hero photo is the shop's own Google listing photo, credited in the caption.
- `verify.mjs` is the gate: it asserts the layout tokens resolve (a `0px` `.wrap` padding
  means `:root` was overwritten wholesale), no horizontal overflow at 360/768/1920, the
  drawer opens and closes on Escape, and the map appears only after consent.
