# Fikri Store — Design Direction

## Brief
- **Audience:** people in Indonesia comparing laptops for study, work, and creative tasks.
- **Job:** help visitors understand the store's offer, browse current units, and start a useful WhatsApp conversation.
- **Language:** Indonesian, conversational and direct.
- **Constraints:** keep React + Vite + Tailwind + Supabase; preserve the live catalog, admin, and WhatsApp flows. Do not invent stock, prices, warranties, customer counts, or delivery promises beyond what the product data already states.

## Concept exploration

| Territory | Concept | Signature / emotion | Anchor | Scores (originality, fit, feasibility, portability) |
|---|---|---|---|---|
| Product material | **The Open Laptop** — the laptop screen becomes a window into the work it enables | Three distinct workspaces; practical optimism | The catalog is laptop-led and already illustrates study, work, and creative use | 4, 5, 5, 2 |
| Decision metaphor | **Choose by Your Day** — start with the task, then compare the machine | A calm path from need to product | Buyers need a laptop that fits their actual daily work | 4, 5, 5, 2 |
| Brand identity | **Fikri Desk** — a compact, dependable desk for choosing technology | Clear, warm, considered | The brand name and existing Fikri / Desk hero language | 3, 4, 5, 3 |

**Chosen direction:** The Open Laptop, supported by Choose by Your Day. It turns the existing laptop visual into a clear three-scene story instead of adding spectacle unrelated to the buying decision.

## Concept card
- **Idea:** Fikri Store helps people picture the work they will do on a laptop before choosing a unit.
- **Metaphor:** one open laptop, three windows into everyday use.
- **Signature:** the hero's workspace / study / creative scenes, with direct controls to switch scenes.
- **Emotion:** capable, focused, and reassured — premium without feeling intimidating.
- **Motion verb:** reveal; each scene settles into view, then waits when a visitor engages with it.
- **Screenshot:** the hero headline beside the laptop screen showing one of the three work contexts.

## Art direction
- **Ground:** near-black charcoal already used by the storefront.
- **Ink:** warm off-white for high-contrast reading.
- **Muted:** restrained cool gray for supporting copy.
- **Line:** low-contrast charcoal borders to separate product surfaces.
- **Accent:** the existing electric-lime brand accent; reserve it for actions, selected states, and small signals.
- **Secondary scene colors:** deep green for work, blue-green for study, muted plum / warm coral for creative work.
- **Type:** retain the project's existing heading and body font configuration; use tight display tracking and readable 15–18px body copy.
- **Grid:** existing centered 6xl container; two-column hero on desktop, single-column flow on mobile; consistent 4px spacing rhythm.
- **Shape:** rounded pills for actions, medium radii for product surfaces, larger radius only for hero / closing panels.
- **Motion:** one restrained easing family; transform and opacity only for scene changes. No forced auto-motion under reduced-motion preference. Pause autoplay while a visitor hovers or focuses the scene controls, and while the tab is hidden.

## Composition plan
1. **Hero:** editorial copy left, open-laptop scene right; direct scene selector beneath.
2. **Catalog:** search and stock filter first; category tabs next; product cards remain the primary content.
3. **Use cases:** image-led use-case cards; each explains a real buyer context.
4. **Value:** concise proof points; no invented metrics or guarantees.
5. **Story:** short brand explanation with a route back to products.
6. **FAQ:** direct answers to stock, condition, price, and ordering questions.
7. **Closing CTA:** one focused WhatsApp action.

## Implementation notes
- Keep the current Vite / React / Tailwind / Supabase stack; a framework migration would add risk without helping this commerce flow.
- The hero scene selector is now keyboard-operable and has accessible names and pressed states.
- Autoplay pauses for pointer / keyboard engagement, hidden tabs, and prefers-reduced-motion: reduce.
- No new runtime dependencies.

## QA status
- Branch: pr/awwwards-jury-redesign
- Production build, Playwright screenshots, axe, keyboard, responsive, and performance checks still need to run in CI or a local project checkout. Do not treat this design note as evidence that those checks passed.
