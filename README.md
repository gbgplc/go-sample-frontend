# Market onboarding applications

Three standalone, independently deployable customer-facing onboarding apps —
**Northbank** (banking), **Meridian Health** (healthcare) and **Ridgeline
Play** (online gaming) — each driving a GBG Go journey through a thin backend
proxy, per `project/Front-end Handoff.dc.html`. Screens, copy and responsive
behaviour follow `project/Market Onboarding Journeys.dc.html`.

No backend microservice exists yet, so every app runs against a mock
transport that implements the same REST contract a real Java or TypeScript
service would (`packages/onboarding-core`) — flip one env var to point an app
at a live service instead.

## Layout

```
packages/
  design-system/     Button, Chip, IconButton, Link, StatusBadge, TextField
                      + design tokens — ported from the GBG Go Platform UI bundle
  onboarding-core/    Types, the REST contract (RestTransport), the mock
                      transport + fixture schema, and the 7-state session hook
  onboarding-ui/      The 8 screen-kind renderers, the responsive shell
                      (mobile app bar vs. web stage rail), OnboardingApp
apps/
  northbank/          Banking — straight-through and address-referral scenarios
  meridian-health/    Healthcare — patient and carer scenarios
  ridgeline-play/     Gaming — instant pass, step-up and jurisdiction-block
```

## Running an app

```
npm install
npm run dev:northbank        # or dev:meridian-health / dev:ridgeline-play
```

Each app defaults to mock mode. To reach a specific designed outcome, add
`?mock_scenario=<id>` to the URL — e.g. `?mock_scenario=refer` on Northbank,
`?mock_scenario=carer` on Meridian Health, `?mock_scenario=stepup` or
`?mock_scenario=blocked` on Ridgeline Play. (See each app's
`onboarding.config.ts` for the full scenario list.)

To point an app at a real backend once one exists:

```
NEXT_PUBLIC_ONBOARDING_TRANSPORT=rest
NEXT_PUBLIC_API_BASE_URL=https://your-onboarding-service
```

## Build / typecheck everything

```
npm run build
npm run typecheck
```

## Known simplifications

- Document and selfie capture are placeholders (front-end handoff, section 6)
  — swap `CaptureScreen` for GBG's Web SDK once that decision lands.
- The stage rail only ever shows stages already visited plus the current one,
  never the full journey ahead — the client doesn't know the total step count
  up front, by design (screen order comes from the interaction response, not
  a client-side route table).
- `ProcessingScreen` resolves on a fixed timer against the mock transport; a
  live `RestTransport` would instead poll `GET /state` until the status
  leaves `InProgress`.
