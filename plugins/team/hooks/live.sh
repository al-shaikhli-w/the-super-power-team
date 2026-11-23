#!/usr/bin/env bash
event="$1"
input="$(cat)"

project="${CLAUDE_PROJECT_DIR:-}"
if [ -z "$project" ]; then
  project="$(printf '%s' "$input" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
fi
project="$(printf '%s' "$project" | tr '\\' '/' | tr -s '/')"
team="$project/.claude/team"

[ -f "$team/team.md" ] || exit 0
grep -Eiq '^[-*[:space:]]*Dashboard:[[:space:]]*on' "$team/team.md" || exit 0

field() {
  printf '%s' "$input" | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -n 1
}
text() {
  printf '%s' "$input" | sed -nE "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"(([^\"\\\\]|\\\\.)*)\".*/\\1/p" | head -n 1 | sed -E 's/\\[nrt]/ /g'
}
# Values end up inside a JavaScript string: drop quotes, backslashes and control characters.
clean() {
  printf '%s' "$1" | tr -d '"\\\000-\037' | tr -s ' ' | LC_ALL=C.UTF-8 awk -v n="${2:-90}" '{ printf "%s", substr($0, 1, n) }'
}
name_only() {
  printf '%s' "$1" | tr '\\' '/' | sed 's#.*/##'
}

agent="$(field agent_type | tr -cd 'A-Za-z0-9:_.-' | cut -c1-80)"
id="$(field agent_id | tr -cd 'A-Za-z0-9_.-' | cut -c1-80)"
now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

append() {
  file="$1"
  var="$2"
  line="$3"
  max="$4"
  [ -f "$file" ] || printf 'window.%s = [];\n' "$var" > "$file" || return 0
  printf '%s\n' "$line" >> "$file" || return 0
  if [ "$(wc -l < "$file")" -gt "$max" ]; then
    { printf 'window.%s = [];\n' "$var"; tail -n $((max / 2)) "$file" | grep "^$var.push"; } > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

is_team() {
  case "$1" in team:*|team-*) return 0 ;; *) return 1 ;; esac
}
# Sub-agents outside the team (Explore, general-purpose, …) show as helpers: "h":1.
helper=""
[ -n "$agent" ] && ! is_team "$agent" && helper=',"h":1'

case "$event" in
  start)
    [ -n "$agent" ] || exit 0
    append "$team/live.js" TEAM_LIVE "TEAM_LIVE.push({\"t\":\"$now\",\"e\":\"start\",\"a\":\"$agent\",\"id\":\"$id\"$helper});" 400
    mkdir -p "$team/.run" && [ -n "$id" ] && printf '%s' "$now" > "$team/.run/$id"
    ;;
  stop)
    [ -n "$agent" ] || exit 0
    report="$(clean "$(text last_assistant_message)" 600)"
    [ -n "$report" ] && append "$team/live.js" TEAM_LIVE "TEAM_LIVE.push({\"t\":\"$now\",\"e\":\"report\",\"a\":\"$agent\",\"id\":\"$id\",\"r\":\"$report\"$helper});" 400
    append "$team/live.js" TEAM_LIVE "TEAM_LIVE.push({\"t\":\"$now\",\"e\":\"stop\",\"a\":\"$agent\",\"id\":\"$id\"$helper});" 400
    start=""
    [ -n "$id" ] && [ -f "$team/.run/$id" ] && start="$(tr -cd '0-9TZ:-' < "$team/.run/$id")" && rm -f "$team/.run/$id"
    # history.js keeps team agents only
    [ -n "$start" ] && is_team "$agent" || exit 0
    count=0
    [ -f "$team/actions.js" ] && count="$(grep -c "\"id\":\"$id\"" "$team/actions.js")"
    append "$team/history.js" TEAM_HISTORY "TEAM_HISTORY.push({\"s\":\"$start\",\"e\":\"$now\",\"a\":\"$agent\",\"n\":${count:-0}});" 6000
    name="$(clean "$(basename "$project")" 60)"
    if [ -n "$HOME" ]; then
      mkdir -p "$HOME/.claude/team" && append "$HOME/.claude/team/history.js" TEAM_HISTORY_ALL "TEAM_HISTORY_ALL.push({\"p\":\"$name\",\"s\":\"$start\",\"e\":\"$now\",\"a\":\"$agent\",\"n\":${count:-0}});" 20000
    fi
    ;;
  tool)
    tool="$(field tool_name | tr -cd 'A-Za-z0-9_-' | cut -c1-80)"
    if [ "$tool" = "Agent" ] || [ "$tool" = "Task" ]; then
      # The coordinator (no agent) or an agent starts a sub-agent: record its task, and who started it.
      sub="$(field subagent_type | tr -cd 'A-Za-z0-9:_.-' | cut -c1-80)"
      [ -n "$sub" ] || sub="general-purpose"
      task="$(clean "$(field description)")"
      parent=""
      [ -n "$agent" ] && [ -n "$id" ] && parent=",\"p\":\"$id\""
      subh=""
      is_team "$sub" || subh=',"h":1'
      append "$team/live.js" TEAM_LIVE "TEAM_LIVE.push({\"t\":\"$now\",\"e\":\"task\",\"a\":\"$sub\",\"d\":\"$task\"$parent$subh});" 400
      [ -n "$agent" ] || exit 0
    fi
    [ -n "$agent" ] || exit 0
    if [ "$tool" = "SubagentHandback" ]; then
      report="$(clean "$(text message)" 600)"
      [ -n "$report" ] && append "$team/live.js" TEAM_LIVE "TEAM_LIVE.push({\"t\":\"$now\",\"e\":\"report\",\"a\":\"$agent\",\"id\":\"$id\",\"r\":\"$report\",\"full\":true});" 400
      exit 0
    fi
    case "$tool" in
      Read) kind=read; target="$(name_only "$(field file_path)")" ;;
      Edit|Write|MultiEdit|NotebookEdit) kind=edit; target="$(name_only "$(field file_path)$(field notebook_path)")" ;;
      Grep|Glob) kind=search; target="" ;;
      Bash|PowerShell) kind=run; target="$(field description)"; [ -n "$target" ] || target="$(field command | cut -d' ' -f1)" ;;
      WebFetch) kind=web; target="$(field url | sed -n 's#^[a-z]*://\([^/]*\).*#\1#p')" ;;
      WebSearch) kind=web; target="" ;;
      mcp__*) kind=tracker; target="${tool##*__}" ;;
      *) kind=tool; target="$tool" ;;
    esac
    target="$(clean "$target")"
    append "$team/actions.js" TEAM_ACTIONS "TEAM_ACTIONS.push({\"t\":\"$now\",\"a\":\"$agent\",\"id\":\"$id\",\"k\":\"$kind\",\"x\":\"$target\"$helper});" 600
    ;;
esac
exit 0
