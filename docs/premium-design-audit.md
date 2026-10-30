# Whole-site source design audit — 2cb6bca

## Evidence and limits

Reviewed the current root/layout, footer, seven style files, and established page/
component structure at the repository baseline. Current source was fetched read-only.
The prior committed gate has 89 unit tests and 82 browser passes, but those are not
visual-quality approvals. No screenshots or hosted preview were supplied for this
request. No rendered inspection is claimed.

The two earlier attempted visual changes mentioned in the request are not visible
as additional commits on main. This delivery is deliberately based on main at
2cb6bca, not on guessed uncommitted local changes.

## Main diagnosis

The problem is not a shortage of animation libraries. It is inconsistent visual
weight: many equally loud panels, oversized tightly wrapped headings, numerous
small technical annotations, pastel sign-diagram cards, and relatively plain
navigation/forms. This can produce an unfinished template impression despite a
working implementation.

Source-specific findings:

1. The hero H1 uses 5.3rem / 13.5ch on desktop, while long copy shares roughly half
   the container with the scene. This encourages excessive wrapping. The revised
   measure/type scale gives the words more horizontal room and reduces vertical bulk.
2. Global heading tracking is -.045em and individual hero tracking -.055em, while
   body and technical labels vary heavily by component. Revised scales separate
   display headings, card headings, body text and small annotations consistently.
3. Manrope/Inter are named in tokens, but there are no supplied font files or
   @font-face rules. This is system fallback in practice. The revision deliberately
   supports Windows variable/system fonts; it does not pretend to load missing fonts.
4. The research board has a 12px/16px hard offset shadow. Replacing it with restrained
   depth makes the document metaphor less like a stacked demo card.
5. Several visual labels are .55rem/.6rem. Those details should support the content,
   not force the reader to decipher it. Most are raised into a more readable band.
6. Cards rely on nearly identical outlines and varying green fills. The revision
   uses neutral white surfaces, a smaller radius family, precise borders, and gentle
   elevation on hover instead of making every block equally decorative.
7. The quote form lacked an outer surface while the auxiliary notice was visually
   dominant. The revision establishes a coherent form panel, clearer field grouping,
   consistent 50px controls, and quieter supporting information.
8. Footer typography and spacing were visually weaker than the opening section.
   The revision gives the brand area and column labels a deliberate hierarchy.

## Direction implemented

Professional architectural consultancy, not gaming/fintech, not luxury-for-luxury's
sake. Preserve forest green and warm paper, temper the bright accent into sage, keep
an ink-dark hero, and use precise technical accents sparingly.

This is a complete replacement styling system across the current website, not an
extra override sheet pasted after the existing cascade. Every existing CSS-module
export used by the current components is retained.

## Route coverage

| Routes | Refinement |
| --- | --- |
| / | Better hero scale, integrated scene frame, consistent section rhythm, calmer cards and CTA |
| /services, /industries | More editorial overview cards, stronger title/body separation |
| 3 service-detail pages | Unified interior hero, scope panels, related links and FAQ rhythm |
| 4 industry-detail pages | Consistent technical illustration framing and reading measure |
| /about | Better two-column reading rhythm and values hierarchy |
| /blog | Clearer article-card hierarchy without fabricated images |
| /contact | More refined contact rows and supporting preparation panel |
| /request-a-quote | Complete form presentation, focus/errors/review surfaces |
| 404 | Consistent typography, warm background and spacing |
| Shared chrome | Compact header, clearer dropdowns/mobile panel, strengthened footer |

## Scope guardrails

- No text or facts changed, no logo/photo/client proof invented.
- Original logo, licensed/local font files, and approved photography remain deferred.
- No new dependencies, remote fonts, image requests, tracking, or network integration.
- No route, metadata, quote validation, test assertion, camera, scene geometry, or
  Anime.js lifecycle changes.
- No CSS transforms on cards/links that compete with Anime.js owning their transforms.
- Reduced motion, poster/canvas visibility, native dialog behavior, hidden notices,
  keyboard focus states, and mobile form readability are retained.

## Visual acceptance is still required

The optional capture utility produces real local full-page screenshots of all 14
routes in desktop and mobile sizes, plus an HTML contact sheet. Static captures use
reduced motion for consistency; inspect the normal desktop hero separately for
actual GPU/motion quality. The script records issues but does not approve its own
appearance.

Do not equate a green test suite with a premium visual result. Review Home, one
service, one industry, and Quote at minimum, then inspect the rest through the
contact sheet. If further changes are needed, use those actual screenshots as
specific evidence rather than requesting another blind palette tweak.
