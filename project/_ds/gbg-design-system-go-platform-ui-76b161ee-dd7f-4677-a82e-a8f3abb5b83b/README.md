# GBG Go — Design System

A design system for **Go**, GBG's identity verification and case-management platform for compliance, risk and fraud operators.

This system was built from the `GBG Go/` proof-of-concept codebase — an MUI-themed React app derived directly from two Figma files via the Figma MCP. Every colour, type token, spacing value and component override in this system traces back to one of those sources.

## Product context

**Go** is a desktop SaaS console. It is used by compliance, risk and fraud operators at financial-services and regulated organisations to:

- **Build and publish verification Journeys** — configurable flows (data checks, document authentication, biometrics, sanctions screening, routing) expressed as a linear chain of Modules on a React-Flow canvas.
- **Investigate cases** — drill into an individual customer's verification record and its audit trail.
- **Manage their organisation** — settings, API keys, webhooks, team members, audit log.

Tone of voice is **plain-English, verb-led, British-spelt, trust-forward**. It never performs; it informs. Numbers beat adjectives, errors explain what to do next.

## Sources

All tokens and patterns in this system derive from:

| Source | Notes |
|---|---|
| Codebase `GBG Go/` | Vite + MUI + Phosphor + React Flow proof-of-concept. `src/theme.ts` and `src/copy.ts` are canonical. |
| Figma: *Go — Platform components* (`vtytte416MmKWGTrwfRbSU`) | Form controls |
| Figma: *Go — Platform* (`WiN1nucWIO9VcghYRTP4lo`) | Tables, nav, app shell |
| Figma: *GO Brand System* | Typography scale |
| Figma: *GBG Brand* | Label & paragraph styles |

The reader may not have access to the Figma files — they are listed so an authorised viewer can cross-reference.

## Products represented

The POC covers **one** product surface: the Go web console (desktop SaaS). There is no mobile app, no marketing site, no docs site in the source material — so this design system scope is the console only.

Four key screens carry the system:

1. **`/sign-in`** — single-column login card
2. **`/journeys`** — filterable, sortable, paginated Journeys table (the default landing)
3. **`/journeys/:id`** — the Journey builder: React Flow canvas + left icon rail + right modules aside + top inline-editable title
4. **`/settings`** — form-heavy account / API keys / webhooks

## Content fundamentals

**Voice.** Plain English. Trust-forward, unshowy. We are talking to compliance, fraud and risk operators — clarity and evidence win over superlatives.

**Vocabulary.**
- "Use", never "utilise". "Stop", never "cease".
- Verb-led actions: **"Verify a customer"**, **"Create a new journey"**, **"Create a key"** — not "Customer verification", "New journey", "New key".
- Trust-forward: avoid *seamless*, *powerful*, *revolutionary*.
- Numbers beat adjectives: *"Decision reached in 4 seconds"* beats *"Fast decisions"*.

**Casing.**
- **Sentence case** for buttons, headings, menu items. *Not* Title Case, *not* ALL CAPS.
- ALL CAPS only for explicit `eyebrow` / `overline` type styles.

**Person.** Mostly impersonal / second-person where needed: *"Use your work email to access identity verification."* Never "please". Never blame the user in errors.

**Spelling.** British English, always. *Organisation*, *behaviour*, *authorised*, *centre*, *analyse*, *licence* (noun) vs *license* (verb).

**Numbers & dates.**
- Thousands separator: comma. *"of 10,000 results"*.
- Decimal numbers everywhere (*"1"*, not *"One"*).
- Dates: `4 Jan 2024 21:12:01` to avoid DD/MM vs MM/DD confusion across the European/American user base. Numbers-only only when necessary.
- Pagination string: `Page 1 of 1000` · `of 10,000 results`.

**Errors.** Say what happened and what to do next. Never blame, never "please". Example:
> "We couldn't save your changes. Check your connection and try again."

**Empty states.** Tell the user what they're looking at and what to do next. *"Create your first journey"*, not *"No journeys"*.

**Emoji / decorative glyphs.** Not used in product. The visual system uses Phosphor icons for meaning; never emoji.

**Example copy — full register:**

> **Sign in to Go**
> Use your work email to access identity verification and case management.
>
> **Create a new journey**
> • API + hosted (latest) — Our latest API, with optional hosted screens
> • Use a template — Browse and pick a pre-built journey

## Visual foundations

**Overall mood.** Calm, clinical, decisive. White page, tinted sidebar, one strong blue as the accent. The aesthetic is closer to an enterprise admin console (think Stripe Dashboard) than a consumer app — deliberate and unshowy.

**Colour.**
- One brand accent: **Hyacinth B400 (`#4D4DFF`)** — used for primary buttons, links, active nav, tooltips, the outline on the row-actions kebab, focus rings. Used sparingly as a single attention colour.
- Neutrals: **Charcoal** ramp C50→C700. Body text is C500; primary text C700; borders C200; muted zones C50.
- Functional: **UIGreen** (pass / success), **UIRed** (fail / destructive), **UIOrange** (warning / review). Each has a 100/500/700 split used for badge bg / dot+label / dark text.
- Accent: **Hot Peach HP100→HP700**. Reserved for charts, callouts, or peach-toned module icons on the canvas (Start / End bookends).
- Eight fixed **outcome swatches** (red/orange/yellow/grey/green/lightGreen/blue/purple) for outcome cards on the Journey builder — these are a product concept, not a theme colour.

**Type.** **DM Sans** across the whole system (self-hosted variable font — `fonts/DMSans-VariableFont_opsz_wght.ttf`, wired via `@font-face` in `colors_and_type.css`). One typeface, weights 400/500/600/800. Tight type scale from the Figma GO Brand file — h1 32, h2 28, h3 22, h4 18, h5 16, h6 14 ExtraBold, body1 14, body2 12. `eyebrow` and `overline` are 11px uppercase with 0.08em tracking.

**Spacing.** MUI 8px base (`spacing(1) = 8px`). Figma tokens `Spacing/S` (8), `Spacing/M` (16), `spacing/md` (24). Page gutter is 40px (`paddingInline: 5`). No half-steps — stay on the 8 grid.

**Radii.** Tiny and consistent. `sm = 4px` (buttons, inputs, badges, most cards). `md = 8px` (nav items, surface cards, the modal-adjacent panels). `lg = 12px` (dialogs). `pill = 999px` (rare).

**Backgrounds.** Flat white page. No gradients. No hero images, no illustrations, no textures. The only tinted surface is the sidebar (Hyacinth B50 — `#F5F5FC`); the active row / nav item uses Hyacinth B100 (`#E5E5FF`). Empty-state icon wells are a 48×48 circle filled Charcoal C50 with a C400 icon inside.

**Animation.** Minimal and fast. Transitions are `120–180ms ease` on colour, border, and opacity. There are no entrance animations, no bounces, no springs. The only motion is:
- `+` edge-insert button fade (180ms opacity + pointer-events toggle)
- Button colour/border transitions on hover/focus (120ms)
- Toast appearance (MUI default Snackbar)
- Selected-node border tint (160ms ease)

**Hover state.** Lighter background tint (`surface.selected` = B100 for nav/menu; `C50` for generic hover rows; `hyacinth.B50` for button hover). Text weight does not change on hover. No underline on hover — links are underlined by default (`MuiLink` `underline: 'always'`).

**Focus state.** Keyboard focus is opt-in via `:focus-visible` — MUI's default ring is preserved, never suppressed. Explicit focus rings in `SubTabItem` use `outline: 2px solid B400`, `outlineOffset: 2`.

**Press / active state.** No shrink, no colour bloom. Buttons have `disableRipple` globally — the feel is deliberate and flat, not Material-elastic. Active sort labels switch to the primary colour; active nav items switch to primary text + `surface.selected` background + bold weight.

**Borders.** `1px` solid, almost always in **Charcoal C200 (`#E3E3E8`)**. Dividers in tables drop to `C100` for the lighter row separator. Input borders are **C300** by default, **C400** on hover, **B400** when focused. Selected module cards on the canvas switch their border from C300 to the primary blue.

**Shadows.** Almost none. The only real shadow is the canvas module card: `boxShadow: '2px 4px 10px 0 rgba(0, 0, 0, 0.10)'`. Dialogs, menus and cards otherwise rely on a `1px C200` border.

**Protection gradients vs capsules.** Not used — the system doesn't overlay content on imagery.

**Transparency / blur.** Not used. Every surface is a solid colour.

**Cards.** White fill, `1px C200` border, `8px` radius, no shadow. `Paper` and `Card` share the same override — one card primitive.

**Chips / filter pills.** `20px` height, `4px` radius, `1px C200` border, white fill, 12px caption with 500 weight, delete icon 12×12 in C400. Small and pencil-like, not pill-shaped.

**Status badges.** Tinted background + coloured dot + coloured bold caption. Never full-row colouring. The dot is 6×6 `borderRadius: 50%`. See `StatusBadge.tsx`.

**Buttons.** Three variants: `contained` (brand blue), `outlined` (blue on white), `text` (inline blue). Two sizes: 48px default, 32px small. Text is 600-weight sentence-case. No elevation, no ripple. Destructive uses `error` colour with the `contained` or `outlined` treatment.

**Inputs.** 40px default height (`8px 12px` padding), white fill, 4px radius, 1px C300 border, 12px 600-weight C500 label sitting 4px above the field. 14px input text, placeholder in C300.

**Tooltips.** Inverted — brand-blue fill with white 12px text, 4px radius. Small and distinctive.

**Tables.** 51px head & body row heights, 8px vertical cell padding, C100 row dividers, C200 header divider. Primary-name column is a charcoal-underlined link (overriding the default blue Link) to match Figma. Row actions: right-aligned outlined-blue kebab `IconButton` (`DotsThree`).

**Layout rules.**
- 280px fixed sidebar (compact mode: 68px icon rail + 212px context pane, same total width).
- Main content has 40px top + side gutters (`paddingInline: 5`, `paddingBlock: 5`). In builder mode (`/journeys/:id`) gutters are dropped because the builder supplies its own chrome.
- Page header: `h3` heading on the left (H1-in-document-order), actions at far right *or* inline next to the heading. 32px margin below.
- Responsive / mobile is **not a design goal** — Go is a desktop console.

**Iconography.** Phosphor Icons (see ICONOGRAPHY section below).

## Iconography

**Library: Phosphor Icons** (`@phosphor-icons/react`, v2.1.7). Chosen over Feather/Lucide because Phosphor has the wider set Go needs (`Path`, `TreeStructure`, `CaretDoubleLeft`, etc.) and a consistent `regular` / `bold` weight system that Figma also uses.

**Rules.**
- **Don't mix icon libraries.** Phosphor is the only icon set.
- **Sizes.** 20 in the sidebar nav, 24 inline (page headers, list rows, canvas modules, buttons), 16 on inline chevrons / micro-controls, 14 on in-chip delete / trend arrows, 12 on the `+` edge button.
- **Weights.** `regular` by default. `bold` for: active nav items, carets / chevrons, and anything indicating structural action (the edge `+`, the page-header `PencilSimple`).
- **Colour.** Icons inherit text colour. Active nav uses primary blue; otherwise charcoal C500. Status-badge dots use the status colour.
- **Sidebar icon choice follows function, not decoration.** Journeys → `Path` (users follow a path through checks). Investigation → `Users`. Analytics → `ChartLineUp`. Account management → `UsersThree`. Administration → `ShieldStar`. Sub-organisations → `TreeStructure`. Settings → `Gear`. Audit → `ClipboardText`. Docs → `BookOpen`. Privacy → `ShieldCheck`. Sign out → `SignOut`.

**No emoji. No unicode icon characters.** The favicon and brand glyph are the only in-house SVGs — see `assets/logo-mark.svg` / `assets/logo-full.svg`. CDN-loaded Phosphor covers the rest.

**Brand marks.** Two variants in `assets/`:
- `logo-mark.svg` — the blue arrow-square glyph. Use for narrow / compact sidebars, favicons.
- `logo-full.svg` — horizontal lockup (mark + "GBG" wordmark). Default.

## Index — what's in this folder

- `README.md` — this file
- `colors_and_type.css` — CSS custom properties for every token (brand ramps, semantic aliases, surfaces, radii, shadow, type scale, semantic heading/body selectors)
- `components/core/` — the reusable React UI primitives compiled into the design-system bundle: `Button`, `IconButton`, `TextField`, `Link`, `StatusBadge`, `Chip`. Each is a self-contained `.jsx` (named export) with a sibling `.d.ts` props contract; `core.card.html` mounts them all from the compiled bundle. Consume via `window.GBGDesignSystemGoPlatformUI_76b161.<Name>`.
- `fonts/` — the self-hosted DM Sans variable font (`DMSans-VariableFont_opsz_wght.ttf`), wired via `@font-face` in `colors_and_type.css`.
- `assets/` — logos (mark + full lockup), favicon
- `preview/` — HTML cards shown in the Design System tab
- `ui_kits/go-console/` — the UI kit for the Go web console: JSX components + an interactive `index.html` demo. (The UI kit is a Babel-in-browser demo that mirrors these primitives via `window` globals; the canonical, compiled components live in `components/core/`.)
- `SKILL.md` — Agent Skill wrapper for Claude Code / CLI usage

## Caveats

- **DM Sans** is now self-hosted from `fonts/DMSans-VariableFont_opsz_wght.ttf` (the licensed variable font, axes `opsz` + `wght`). The `@font-face` in `colors_and_type.css` declares `font-weight: 100 1000`, so every weight the system uses (400/500/600/700/800) is covered by the single file. No CDN dependency.
- **UI Green / UI Orange ramps** are partly inferred. UIG700 (`#219C4C`) is Figma-canonical; the other green stops and all orange stops were extrapolated by the upstream team. Revisit when the design system exports official Functional Green / Functional Orange ramps.
- **Dashboard / investigation layouts** in the upstream POC are "reasoned extrapolations" of the form + table patterns, not pulled from Figma frames — this system inherits that caveat.
- **No mobile / responsive** patterns — by design.
