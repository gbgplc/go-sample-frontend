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

## Running against the Java backend

Copy `apps/<market>/.env.example` to `.env.local` in the same folder:

```
NEXT_PUBLIC_ONBOARDING_TRANSPORT=rest
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082
```

Then restart that app's dev server. Without this file the app runs its own
in-browser mock and never reaches the backend — which looks like it is
working, so it is worth checking first when a change to the service seems to
have no effect.

The backend ports are 8081 / 8082 / 8083, in the same market order as above.
`.env.local` is gitignored; delete it when you are done, or the app keeps
using the backend for anyone running it on that machine.

## Meridian Health against a live GBG Go journey

Meridian is wired to a published journey on the `gbggo4-demo` tenant and is
the only market with one — Northbank and Ridgeline still carry placeholder
resource IDs and must stay in mock mode. See the backend README for
credentials and `./run.sh`.

What the live journey does *not* have, which the mock does:

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
