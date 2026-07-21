# Photo-grade content workflow

How the real-photo Reception pieces get made. Repeatable for any future batch, any format (single, carousel, reel). The point: break the all-typographic look with real imagery, without ever looking like a stock template.

## The 6 steps

1. **Concept** — pick one emotional beat and one line per format. Reception's richest territory is the after-hours / night / missed-lead feeling. One idea per piece, never two.

2. **Source (free + vetted)** — pull real media from Pexels (free license, hotlink-open CDN: `images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg`). Then **look at every image before using it**:
   - Does it carry the beat? (mood, light, framing)
   - Is there dark negative space for text?
   - SG-recognisability rule: only call something "Singapore" if it genuinely is. (A Marina Bay skyline is fine; a random Asian skyline passed off as SG is not.)
   - Faces are illustrative personas, never a real named agent or client.

3. **Treat + compose** — never drop raw stock in. Over the photo:
   - a **warm layer** (`rgba(184,83,42,.14-.3)`, soft-light or multiply) to pull it into Reception's palette
   - a **gradient scrim** (to deep warm-black) behind text for legibility
   - brand type on top: bell mark, terracotta accent word, mono kicker, Bricolage headline, Hedvig serif support. Same DNA as every other piece.

4. **Render** — stills via `node carousels/render.js <dir>` (screenshots each `.slide` at 1080x1350). Reels via hyperframes with a Ken Burns transform on the photo.

5. **Vet loop** — render, screenshot, critique against: legibility over the photo, framing/crop (incl. the 1:1 grid crop), reel safe-zones, brand consistency, and compliance (never valuation/advice/premium; "in your name"). Fix and re-render until right.

6. **Ship** — copy to the deck `media/`, add a deck item + caption + exactly 5 hashtags, sync POST-KIT, deploy.

## On variety (keeping the feed interesting)

The engine is not autonomous; each batch is crafted. Variety is a deliberate rule, not luck: constant DNA (bell, terracotta, three fonts, grain) + a different ground/type-role/motif every time. Rotate the dominant treatment so no two consecutive posts share a look:

- typographic poster (cream) · statement (ink) · editorial serif · chat mockup · **real photo** · price/number

The photo layer is the newest register. Others to add over time: a founder-POV piece, a real-results proof (once there's a client), a per-trade photo set (adviser at a desk, agent at a viewing).
