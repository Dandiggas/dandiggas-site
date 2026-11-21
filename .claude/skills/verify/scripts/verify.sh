#!/usr/bin/env bash
# Launch, check and stop one verification instance of the site.
# Usage: .claude/skills/verify/scripts/verify.sh launch|doctor|stop
# The instance is the production build (next build, into .next) served by
# next start on VERIFY_PORT (default 3466), with NO newsletter username, so the
# email form is in its "coming soon" (placeholder) state.
# Run state lives in .agent/verify-run/ (pid, log, build sha). Evidence lives in
# .agent/proof/verify/ and is never touched by stop.
set -euo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$ROOT"
PORT="${VERIFY_PORT:-3466}"
RUN="$ROOT/.agent/verify-run"
PROOF="$ROOT/.agent/proof/verify"
URL="http://localhost:$PORT"

listening_pid() { lsof -nP -t -iTCP:"$1" -sTCP:LISTEN 2>/dev/null | head -1 || true; }

launch() {
  mkdir -p "$RUN" "$PROOF"
  if [ -n "$(listening_pid "$PORT")" ]; then
    echo "REFUSE: port $PORT is already in use (pid $(listening_pid "$PORT")). Run doctor, or stop it if this run started it." >&2; exit 2
  fi
  if [ -n "$(listening_pid 3456)" ]; then
    echo "REFUSE: port 3456 is serving (the e2e server reads the same .next build). Stop it first; a rebuild would change it under that run." >&2; exit 2
  fi
  echo "building at $(git rev-parse --short HEAD) (no newsletter username) ..."
  # Empty username forces the placeholder state, even if a local .env sets one.
  NEXT_PUBLIC_BUTTONDOWN_USERNAME= npm run build > "$RUN/build.log" 2>&1 || { echo "BUILD FAILED, see $RUN/build.log" >&2; tail -30 "$RUN/build.log" >&2; exit 1; }
  git rev-parse HEAD > "$RUN/build.sha"
  git status --porcelain --untracked-files=no > "$RUN/build.dirty"
  NEXT_PUBLIC_BUTTONDOWN_USERNAME= nohup npx next start -p "$PORT" > "$RUN/server.log" 2>&1 &
  echo $! > "$RUN/server.pid"
  for i in $(seq 1 60); do
    if curl -fs -o /dev/null "$URL/tech"; then echo "READY $URL (launcher pid $(cat "$RUN/server.pid"))"; return 0; fi
    sleep 1
  done
  echo "NOT READY after 60s, see $RUN/server.log" >&2; exit 1
}

doctor() {
  local ok=1
  check() { if eval "$2"; then echo "ok   $1"; else echo "FAIL $1"; ok=0; fi; }
  local pid; pid="$(cat "$RUN/server.pid" 2>/dev/null || echo)"
  check "launcher pid recorded and alive ($pid)" '[ -n "$pid" ] && kill -0 "$pid" 2>/dev/null'
  local lp; lp="$(listening_pid "$PORT")"
  # next start forks a child that owns the port; accept the pid or its child.
  check "port $PORT owned by our process tree (listener $lp)" '[ -n "$lp" ] && { [ "$lp" = "$pid" ] || [ "$(ps -o ppid= -p "$lp" | tr -d " ")" = "$pid" ] || pgrep -P "$pid" | grep -qx "$lp"; }'
  check "build sha matches HEAD ($(cut -c1-7 "$RUN/build.sha" 2>/dev/null))" '[ "$(cat "$RUN/build.sha" 2>/dev/null)" = "$(git rev-parse HEAD)" ]'
  check "no tracked changes since build" '[ "$(git status --porcelain --untracked-files=no)" = "$(cat "$RUN/build.dirty" 2>/dev/null)" ]'
  check "GET / is 200" '[ "$(curl -s -o /dev/null -w "%{http_code}" "$URL/")" = 200 ]'
  check "served build id is .next/BUILD_ID" 'curl -s "$URL/" | grep -q "$(cat .next/BUILD_ID)"'
  check "email form is in coming-soon (placeholder) state" 'curl -s "$URL/tech" | grep -q "data-state=\"coming-soon\""'
  check "evidence dir exists ($PROOF)" '[ -d "$PROOF" ]'
  [ "$ok" = 1 ] && echo "DOCTOR OK $URL" || { echo "DOCTOR FAILED"; exit 1; }
}

stop() {
  local pid; pid="$(cat "$RUN/server.pid" 2>/dev/null || echo)"
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    # Kill only what we started: the launcher and its children.
    pkill -TERM -P "$pid" 2>/dev/null || true
    kill -TERM "$pid" 2>/dev/null || true
    for i in $(seq 1 10); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
  fi
  rm -f "$RUN/server.pid"
  if [ -n "$(listening_pid "$PORT")" ]; then echo "WARN: port $PORT still in use by pid $(listening_pid "$PORT"), not ours to kill blindly" >&2; exit 1; fi
  echo "STOPPED. port $PORT free. evidence kept: $(find "$PROOF" -type f 2>/dev/null | wc -l | tr -d ' ') files in $PROOF"
}

case "${1:-}" in launch) launch ;; doctor) doctor ;; stop) stop ;; *) echo "usage: $0 launch|doctor|stop" >&2; exit 64 ;; esac
