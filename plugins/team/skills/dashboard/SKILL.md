---
name: team-dashboard
description: Sets up and refreshes the team's local dashboard — a single page in `.claude/team/dashboard.html` that the developer opens in a browser to watch which agent is working and what it does step by step, the coordinator with the agents and helper sub-agents it started, each ticket's waterfall and details, the team pools, the security findings grouped by OWASP Top 10:2025, Nour's design to-do list, Rafi's marketing plan and post drafts, the plan and every idea with its details, refreshing itself every few seconds. With `off`, stops the updates. Use when the developer types /team-dashboard, or asks to see or watch the team working.
argument-hint: "[off]"
---

# team — dashboard

Request: `$ARGUMENTS`

Files in this skill's folder: `dashboard.html` (the page) and `status-format.md` (the data it reads). Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop.

## On (no argument)
1. **The page.** Copy `dashboard.html` to `.claude/team/dashboard.html` unless an identical copy is already there. Never edit the page per project — everything it shows comes from `status.js`.
2. **The data.** Write `.claude/team/status.js` exactly as `status-format.md` says — every label in the reply language — from what `team-status` reads: the active work folders, `project-plan.md`, the idea files (`ideas.items` from every row, open file first) — `archive` from `.claude/team/work/history/INDEX.md`, `plan.items` from `project-plan.md`, `sprint` from the tracker's current cycle, and `historyAll` as the `file:///` address of `~/.claude/team/history.js`, the details of each ticket (`what`, `criteria`, `notes`) from its ticket file or `01-requirements.md`, and — with `Local tickets: on` — `board` from `.claude/team/tickets/`, `security` from `.claude/team/project/security.md` (counts, titles, OWASP category, CWE, risk and fix lines — never paths or secrets), `design` from `.claude/team/project/design.md` (counts and item titles), `tickets[].prototype` as the `file:///` address of each approved `02b-prototype/index.html`, and `marketing` from `.claude/team/marketing/`. `now` is `null`; `activity` keeps the entries of an existing `status.js`, or starts with one line "Dashboard started".
3. **Turn it on.** Set `Dashboard: on` in `team.md`. From now on `/team-work` and `/team-new-idea` rewrite `status.js` after each approval, and the plugin's hook writes agent starts and stops to `live.js`.
4. **Open it.** Give the command for the developer's shell, with the absolute path:
   - Windows: `start "" "<project>\.claude\team\dashboard.html"`
   - macOS: `open "<project>/.claude/team/dashboard.html"`
   - Linux: `xdg-open "<project>/.claude/team/dashboard.html"`
5. **Say**, in one line each: the tabs are Live, Agents, Board, Security, Ideas and Archive, and every ticket, idea, finding and agent opens its details with a click; agents, their helpers, what each is doing right now and the timeline appear live by themselves; the step and ticket view updates after each approval, which is a write under `.claude/` that Claude Code asks to approve.
6. **Live events need bash** (Git Bash on Windows). `bash --version` fails: say the page still works but shows agents only at each approval.

## `off`
Set `Dashboard: off` in `team.md`. Write `status.js` once more with `now: null` and an activity line "Dashboard stopped". The page stays; `/team-dashboard` turns it on again.

## Git
`dashboard.html` and `status.js` are local: when `Git` in `team.md` is "share" or "commit all", add `.claude/team/dashboard.html`, `.claude/team/status.js`, `.claude/team/live.js`, `.claude/team/actions.js`, `.claude/team/history.js` and `.claude/team/.run/` to `.git/info/exclude` and say so.
