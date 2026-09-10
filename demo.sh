#!/usr/bin/env bash
#
# Start the Meridian Health demo: Java backend against the live GBG Go
# journey, plus the Next.js app in front of it.
#
#   ./demo.sh          start both, wait until they answer, print the URL
#   ./demo.sh stop     stop both
#
# Expects the backend checked out beside this repo. Override with:
#   BACKEND=/path/to/go-sample-backend-main ./demo.sh

set -uo pipefail
cd "$(dirname "$0")"

BACKEND="${BACKEND:-../go-sample-backend-main}"
BACKEND_LOG=/tmp/meridian-backend.log
FRONTEND_LOG=/tmp/meridian-frontend.log

stop() {
  pkill -f "spring-boot:run" 2>/dev/null
  pkill -f "next dev" 2>/dev/null
  echo "Stopped."
}

if [ "${1:-}" = "stop" ]; then
  stop
  exit 0
fi

# A leftover process from an earlier run holds the port and the new one dies
# on startup, which reads as "the demo is broken" at the worst moment.
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

if [ ! -d "$BACKEND" ]; then
  echo "No backend at $BACKEND — set BACKEND=/path/to/go-sample-backend-main" >&2
  exit 1
fi
if [ ! -f "$BACKEND/.env.local" ]; then
  echo "No $BACKEND/.env.local — copy .env.example there and fill in the four values." >&2
  exit 1
fi

echo "Starting backend (live GBG Go)…"
( cd "$BACKEND" && ./run.sh meridian-health live > "$BACKEND_LOG" 2>&1 & )

echo "Starting front end…"
npm run dev:meridian-health > "$FRONTEND_LOG" 2>&1 &

# Wait for both to actually answer rather than guessing at a sleep. Maven
# resolving dependencies on a cold cache is slow the first time.
printf "Waiting"
for i in $(seq 1 90); do
  BE=$(curl -s -o /dev/null -w '%{http_code}' -m 2 http://localhost:8082/v1/config 2>/dev/null)
  FE=$(curl -s -o /dev/null -w '%{http_code}' -m 2 http://localhost:3001 2>/dev/null)
  if [ "$BE" = "200" ] && [ "$FE" = "200" ]; then
    echo
    echo
    echo "  Ready:  http://localhost:3001"
    echo
    echo "  Use Chrome — its camera works on localhost where Safari's may not."
    echo "  Logs: $BACKEND_LOG  $FRONTEND_LOG"
    echo "  Stop: ./demo.sh stop"
    echo
    exit 0
  fi
  printf "."
  sleep 2
done

echo
echo "Timed out. backend=$BE frontend=$FE" >&2
echo "Check $BACKEND_LOG and $FRONTEND_LOG." >&2
exit 1
