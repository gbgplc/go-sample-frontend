# New design mockups

_Started 2026-08-26 12:51 UTC_

---

## User

Make UI mockups for

## Assistant



## Assistant

Your message got cut off — "Make UI mockups for..." what? A quick form so I can start from the right place:

_[tool: ask_user]_

Waiting on your answers — the key one is just what to design.

## User

Answered — what: I am designing 3 front-end sample applications that represent our 3 main markets; Banking/finance, Healthcare and Online gaming/gambling. These applications should show what an onboarding journey for…; surface: Something new; scope: A full flow; fidelity: Clickable prototype; variations: 2–3 layout options; code: identity-gbggo-docs

## Assistant

_[tool: local_ls]_

_[tool: local_ls]_

_[tool: local_read]_

_[tool: local_ls]_

_[tool: local_ls]_

_[tool: local_read]_

_[tool: local_ls]_

_[tool: local_read]_

_[tool: local_read]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

Design system and Go module set understood. Building a workbench: three sample market apps × three layout shells, with a live GBG Go module/decision panel.

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

Built as one clickable workbench — **Market Onboarding Journeys.dc.html**.

Three sample customer apps (Northbank / Meridian Health / Ridgeline Play), each with its own scenario branches: banking straight-through vs. address referral, healthcare patient vs. carer proxy, gaming instant pass vs. document step-up vs. jurisdiction block. Every step is clickable and the right panel shows the Go module chain lighting up as you advance.

The **three layout options** are the header toggle — Stepper (progress always visible), Split rail (desktop, named stages), Focus (one task, no chrome). Same content in all three so you can compare directly.

Open questions in the panel at top: hosted journey vs. SDK build (hosted caps a page at five fields, which changes the Details step), which regions per app, and whether brands stay neutral. Tell me which layout wins and I'll drop the other two.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed — market tabs and scenario chips now sit on one line.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Dropped the duplicate counter from the phone chrome — the app's own step numbering in the eyebrow is now the only progress claim inside the mock.

## User

I would also like the last page to show information about the Go journey that took place

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Every final page now carries a "Your verification record" panel: journey and version, reference, start/decision timestamps, total time, modules run, the deciding module where relevant, and a retention line. Module rows on result pages also show per-module timings alongside their outcome.

Each scenario gets its own record — the blocked gaming attempt, for instance, reports which module declined it and that no documents were collected.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed the Focus shell centring (tall pages now scroll from the top instead of clipping), and reconciled every record's module count with the journey panel — banking 10 of 10, referral 11 of 12, gaming step-up 9 of 9.

## User

I would like 2 layouts. One for web and one for mobile.

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Now two layouts: **Mobile** (390px app shell, progress bar in the chrome) and **Web** (1000px, named stages in a left rail). The third Focus variant is gone.

## User

Are these 2 layouts reactive? For example if I reduce the screen size it will automatically transition into the mobile view.

## Assistant

No. Right now they're two fixed-size frames you switch between with the toggle — a 390px phone shell and a 1000px desktop shell, both hard-coded widths inside the workbench. Shrinking the browser window won't flip one into the other.

That was deliberate for a review artefact: both frames stay at their true dimensions side by side so you can compare them at a fixed scale. But it's not what a real build would do.

I can make it genuinely responsive instead, two ways:

**Resizable frame** — replace the toggle with a drag handle (or width presets: 390 / 768 / 1200), and have the shell switch from left-rail to stacked-mobile at a breakpoint as you drag. Best for demoing the transition itself.

**Full-bleed responsive page** — drop the device frames entirely; the prototype fills the browser and responds to the actual window. Truest to production, but you lose the side-by-side comparison.

Which would you rather have? I'd suggest the resizable frame — you keep the review view and gain the real breakpoint behaviour.

## User

Resizable Frame please

## Assistant

_[tool: dc_html_str_replace]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

The two layouts are now one responsive frame.

Drag the handle on its right edge, or use the presets (390 / 768 / 1024 / 1280). At 768px it crosses the breakpoint: the mobile app bar and progress bar give way to the left stage rail, and the content column caps at 440px. The rail also narrows to 260px between 768 and 1000. Range is 320–1280px, and the label under the frame tells you which chrome is active and what the breakpoint does.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the logic side — converting those prop objects to scalars.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed — the frame now actually sizes and resizes, and the active states are back (market tabs, scenario chips, width presets, stage rail, journey-panel rows). The stage column also scrolls horizontally at 1280px instead of colliding with the journey panel.

## User

What are the next steps into turning this into a running application?

## Assistant

Two routes, and the choice drives everything else.

**Hosted journeys** — you configure the journey in Go, enable hosted pages, and Go generates and serves the screens. Your backend makes one call to start a journey and gets a short-lived URL to send the user to. Fastest path: no front-end verification code, no SDK, no schema handling. The cost is control — the platform decides page composition (max five fields per page), and you shape the look through the branding and translations settings plus the Interaction Group panel, which is where you'd move fields between pages to get closer to these mockups.

**API-first** — you build the front end and call Go directly. Authenticate, start a journey, then loop: fetch the current interaction to see what it collects, render your own form, submit the data, repeat until the journey status leaves `InProgress`. The Core SDK (TypeScript, server-side) handles auth and the boilerplate; the Web/iOS/Android SDKs handle document capture and biometrics, which you should not attempt to build yourself. This is what these mockups actually imply — the layouts, copy and record page here are more opinionated than hosted pages will give you.

Either way, the work in rough order:

1. **Build the three journeys in the Go builder.** Each mockup's module chain is the spec — the journey panel on the right of the prototype lists them per step. Configure each module's outcomes and the evaluation nodes that produce the branches (referral, step-up, jurisdiction block). Publish, and note the resource ID.
2. **Decide prefill vs non-prefill.** If your app already holds name, DOB and address, send them in `context.subject` at start and pull those domain elements out of the interaction group — that removes the Details step from the flow entirely, which changes the mockups materially.
3. **Server-side plumbing.** Token handling and refresh, start-journey endpoint, and a webhook or state-polling path to receive the decision. Map Go's outcomes onto your own account states.
4. **Front end, if API-first.** Build these screens, wire the capture SDKs, and drive the sequence from the interaction loop rather than a hard-coded step list — the flow order comes from the journey, not the client.
5. **The record page needs a data source.** The "Your verification record" panel is invented here. Some of it exists (instance ID, timings, module outcomes, decision); the rest needs deciding — what you're willing to show an end user versus what stays in Investigate for your analysts. Worth settling early with compliance.
6. **Test the unhappy paths first.** The referral, step-up and blocked scenarios are where real onboarding leaks users. Go's Analytics gives you drop-off by module once you're live.

Two open questions I'd resolve before any of it: which route per market (gaming's speed story argues for API-first; healthcare could probably live on hosted pages), and whether the sample brands stay fictional or get replaced with real prospects.

Want me to turn this into a written handoff document for your engineers, with the module chain and screen inventory per market?

## User

I want to have these 3 front-end applications to run separately of one another. The idea is to connect it to a backend microservice that will communicate with the Go platform either via API to start and SDK later. We will have 2 backend microservices that serve the same function but coded in 2 different languages; Java and Typescript. The front-end should communication with the back end using REST.

## Assistant



## Assistant

Before I split this up — the REST contract shape is the decision that changes everything else, so a few questions:

_[tool: ask_user]_

Waiting on the form — mainly the API shape and whether I'm defining the contract. Once you answer I'll split the workbench into three standalone apps and write the REST contract both services implement.

## User

Answered — api_shape: Thin proxy — FE drives Go's interaction loop (start, fetch interaction, submit, poll state); microservice just adds auth and forwards; contract_exists: Nothing yet — define it as part of this work; deliverable: A handoff document for engineers — screen inventory, module chain and state machine per market; mock_mode: Yes, mock/live toggle; auth: Not decided yet; capture: Keep as placeholders for now

## Assistant

_[tool: read_skill_prompt]_

_[tool: copy_starter_component]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

**Front-end Handoff.dc.html** — printable, seven sections: architecture and the thin-proxy split, the full REST contract (seven endpoints plus a single error envelope with five codes), the shared seven-state machine, screen inventories per market with domain elements and modules, mock-mode requirements, six open decisions, and the not-yet-designed list.

Two things I decided for you, both flagged in the doc as decisions rather than facts:

**Auth** — recommended a first-party HTTP-only session cookie set on session creation. Keeps the session ID out of URLs, needs no IdP for an anonymous flow, identical in both implementations. Change it if cross-device resume matters.

**The eight screen kinds** — intro, form, choice, capture, upload, consent, processing, result. Every screen in all three apps is one of these, so that's the whole render surface each front end needs, and it's what makes three apps from one component set viable.

The point I'd push hardest in review: with a thin proxy, screen order comes from the interaction response, not a route table in the client. The step sequences in section 4 are expected output from today's published journeys, not a spec to hard-code — otherwise a journey edit in Go silently breaks the apps.

I didn't build the three standalone front ends, since you only picked the handoff doc. Say the word if you want them split out.

