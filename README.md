# Market onboarding applications

Three standalone, independently deployable customer-facing onboarding apps —
**Northbank** (banking), **Meridian Health** (healthcare) and **Ridgeline
Play** (online gaming) — each driving a GBG Go journey through a thin backend
proxy, per `project/Front-end Handoff.dc.html`. Screens, copy and responsive
behaviour follow `project/Market Onboarding Journeys.dc.html`.

Each app talks to a sample backend, which holds the GBG Go credentials and
calls GBG Go for it. There are two, with the same REST contract:

- [go-sample-backend-java](https://github.com/gbgplc/go-sample-backend-java) (Spring Boot)
- [go-sample-backend-typescript](https://github.com/gbgplc/go-sample-backend-typescript) (Next.js)

Each has an `api-implementation`, which calls the GBG Go REST API directly,
and an `sdk-implementation`, built on the GBG Go Core SDK. Without a backend,
an app runs on its own in-browser mock transport, which implements the same
contract (`packages/onboarding-core`).

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

Each app has a fixed port, matching the CORS origin its backend allows:
Northbank 3000, Meridian Health 3001, Ridgeline Play 3002. An app served
from an unexpected port has every backend request rejected with
`403 Invalid CORS request`, which surfaces as "Something went wrong on our
end" with nothing in the backend log — the browser is turned away before
the request arrives.

Each app defaults to mock mode. To reach a specific designed outcome, add
`?mock_scenario=<id>` to the URL — e.g. `?mock_scenario=refer` on Northbank,
`?mock_scenario=carer` on Meridian Health, `?mock_scenario=stepup` or
`?mock_scenario=blocked` on Ridgeline Play. (See each app's
`onboarding.config.ts` for the full scenario list.)

## Running against a backend

Copy `apps/<market>/.env.example` to `.env.local` in the same folder, then
restart that app's dev server. Copy the file rather than writing it from
Windows PowerShell with `>` or `Out-File`: those save it in an encoding
Next.js ignores. Without a working `.env.local` the app runs its own
in-browser mock and never reaches the backend — which looks like it is
working, so it is worth checking first when a change to the service seems to
have no effect.

The example file points at the market's port on the backends' API
implementation. Each market has its own ports, the same in both languages:

| App | API implementation | SDK implementation |
| --- | --- | --- |
| Northbank | 8081 | 8091 |
| Meridian Health | 8082 | 8092 |
| Ridgeline Play | 8083 | 8093 |

To use an SDK implementation, change `NEXT_PUBLIC_API_BASE_URL` to its port.
`.env.local` is gitignored; delete it when you are done, or the app keeps
using the backend for anyone running it on that machine.

## Live GBG Go journeys

Each market's backend config names a published GBG Go journey, and the
backend READMEs cover credentials and live mode. The GBG Go docs have a
tutorial per app that builds its journey, so you can run an app against your
own: see the
[sample apps overview](https://docs.go.gbgplc.com/docs/go-v2/tutorials/sample-apps-overview).

### Meridian Health's live journey

What Meridian Health's live journey does *not* have, which the mock does:

- **No intro or "who are you registering?" screens.** It opens on document
  capture. The app renders its own welcome first (see below), so the customer
  still gets an introduction.
- **No identity form.** The journey collects a document, a selfie and consent,
  and nothing typed. Data Verification was removed after it proved unable to
  source `FullName` on this tenant — see the backend README.
- **No carer branch.** Patient self-registration only.

### The welcome screen

An app that sets `purpose`, `trustPoints` or `outcomes` in its `AppConfig`
holds on its own welcome screen and starts the journey only when the customer
taps through, rather than on page load. Meridian sets all three; the other two
markets set none and start on mount as before.

That split is deliberate: a journey answers "what do I do next", never "who is
asking and why". It also means no journey instance is created for someone who
opens the link and closes the tab.

## Build / typecheck everything

```
npm run build
npm run typecheck
```

## Known simplifications

- `CaptureScreen` is a real camera surface (`getUserMedia` + shutter, with a
  file-picker fallback), not a production capture SDK: no glare or blur
  detection, and no on-device quality checks before submission. GBG does not
  ship an installable capture component for a fully custom UI, so this is the
  documented DIY pattern rather than a placeholder.
- The stage rail only ever shows stages already visited plus the current one,
  never the full journey ahead — the client doesn't know the total step count
  up front, by design (screen order comes from the interaction response, not
  a client-side route table).
- Against a live journey `ProcessingScreen` is settled by a `GET /state` poll
  in `useOnboardingSession`, once a second until the status leaves
  `InProgress`. Its own 20-second timer is only a backstop for a transport
  that reports no state, which is the sole reason the mock leaves that screen.
  The timer only runs with the in-browser mock, so against a backend in
  mock mode the screen never settles: it waits, then gives up after 90
  seconds.
