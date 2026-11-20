# `status.js` — what the dashboard shows

File: `.claude/team/status.js`. One JavaScript assignment, rewritten whole on every update — never appended. A browser opens the dashboard straight from disk, where it cannot read JSON files, so the data is a script.

```js
window.TEAM_STATUS = {
  "updated": "2026-11-20T14:05:12+01:00",
  "project": "Recipe box",
  "dir": "ltr",
  "labels": {
    "now": "Working now", "idle": "Nobody is working — waiting for you",
    "tickets": "Tickets", "plan": "Plan", "ideas": "Ideas", "activity": "Activity",
    "waiting": "Waiting for", "updated": "Updated", "stale": "No update for a while",
    "started": "started", "finished": "finished",
    "steps": ["Requirements", "Research", "Plan", "Build", "QA", "PR"],
    "subtitle": "Agent dashboard", "live": "Live", "kpiAgents": "Agents working", "kpiAgentsSub": "right now",
    "kpiTickets": "Active tickets", "kpiPlan": "Plan", "kpiIdeas": "Open ideas", "agents": "Agents",
    "timeline": "Timeline", "lastMinutes": "last {n} min", "task": "Task", "working": "Working",
    "allQuiet": "All quiet", "allQuietSub": "No agent is working — the team is waiting for you.",
    "none": "Nothing yet", "actions": "actions", "next": "Next",
    "footer": "Refreshes every 4 seconds · reads status.js, live.js, actions.js and history.js",
    "kinds": { "read": "Reading", "edit": "Editing", "run": "Running", "search": "Searching", "web": "Browsing", "tracker": "Tracker", "tool": "Tool" },
    "tabLive": "Live", "tabArchive": "Archive", "archive": "Finished tickets", "searchPlaceholder": "Search tickets…",
    "all": "All", "merged": "Merged", "closed": "Closed", "done": "Finished", "last30": "Last 30 days", "avgDays": "Average time",
    "days": "days", "date": "Date", "ticket": "Ticket", "titleCol": "Title", "result": "Result", "pr": "PR", "noArchive": "No finished tickets yet",
    "todo": "Todo", "today": "Today", "week": "Week", "sprint": "Sprint", "refresh": "Refresh", "startNext": "Start next", "start": "Start", "copiedStart": "Copied — paste it into Claude Code to start", "notLoaded": "Not loaded yet — refresh it", "workflow": "Workflow", "needsYouShort": "Waiting for you",
    "needsYou": "Needs you", "copy": "Copy", "copyFailed": "Your browser blocked copying — type:", "copied": "Copied — paste it into Claude Code", "copiedCmd": "Copied — run it in your terminal", "commitMessage": "Commit message",
    "tabBoard": "Board", "board": "Tickets board", "newTicket": "New ticket", "open": "Open", "due": "due",
    "col_plan": "Plan", "col_do": "Do", "col_check": "Check", "col_done": "Done", "prio_high": "high", "prio_low": "low",
    "kindsShort": { "read": "Read", "edit": "Edit", "run": "Run", "search": "Search", "web": "Web", "tracker": "Tracker", "tool": "Other" },
    "roles": { "product-manager": "Product Manager", "researcher": "Researcher", "project-manager": "Project Manager", "developer-lead": "Developer Lead", "qa-engineer": "QA Engineer", "reply-writer": "Reply Writer", "agent-maintainer": "Agent Maintainer", "reviewer": "Independent Reviewer" }
  },
  "now": { "agent": "team:developer-lead", "task": "RB-7 — task 3, validation", "since": "2026-11-20T14:01:40+01:00" },
  "tickets": [
    {
      "id": "RB-7", "title": "Save a recipe",
      "steps": ["done", "done", "done", "current", "todo", "todo"],
      "build": { "done": 2, "total": 4 },
      "waiting": "you — approve task 3",
      "pr": null
    }
  ],
  "plan": { "done": 0, "total": 2, "next": "Save a recipe",
    "items": [ { "n": 2, "feature": "Search recipes", "status": "next", "ticket": null, "why": "Users asked for it" } ] },
  "sprint": { "name": "Sprint 14", "start": "2026-11-16", "end": "2026-11-29" },
  "historyAll": "file:///C:/Users/<you>/.claude/team/history.js",
  "ideas": { "file": "idea-v1.md", "new": 1, "question": 0 },
  "activity": [
    { "time": "2026-11-20T14:01:40+01:00", "who": "team:developer-lead", "text": "Started task 3" }
  ],
  "pending": [
    {
      "ticket": "RB-7", "question": "Task 3 is done — approve it?",
      "options": [
        { "label": "Approve", "reply": "approve", "primary": true },
        { "label": "Change", "reply": "change: " },
        { "label": "Stop", "reply": "stop" }
      ]
    }
  ],
  "commands": {
    "ticket": "RB-9", "title": "Ready to commit",
    "message": "feat(search): search recipes by ingredient",
    "blocks": [
      { "label": "Stage", "text": "git add src/lib/search.ts tests/unit/search.spec.ts" },
      { "label": "Commit", "text": "git commit -m \"feat(search): search recipes by ingredient\"" },
      { "label": "Push", "text": "git push -u origin jane/rb-9-search" }
    ]
  },
  "names": { "project-manager": "Maya", "developer-lead": "Omar" },
  "customAgents": [ { "agent": "team-designer", "name": "Design Reviewer", "joins": "plan" } ],
  "todo": {
    "updated": "2026-11-20T08:55:00+01:00",
    "today": [ { "ticket": "RB-12", "title": "Weekly meal planner", "why": "Sprint goal, unblocked", "next": "Requirements", "start": "/team-work RB-12" } ],
    "week": [],
    "sprint": []
  },
  "board": [
    { "id": "RB-12", "title": "Weekly meal planner", "status": "do", "waiting": "you — approve task 2", "priority": "high", "due": "2026-11-27", "step": "Build 1/4", "source": null },
    { "id": "ABC-41", "title": "Fix login timeout", "status": "plan", "waiting": null, "priority": "normal", "due": null, "step": null, "source": "Linear" }
  ],
  "archive": [
    { "date": "2026-11-18", "id": "RB-5", "title": "Recipe list with filters", "pr": 38, "result": "merged", "days": 3, "summary": "Filters by cuisine and time" }
  ]
}
```

- **Language:** every `labels` value (all of them — the page falls back to English for a missing one), `task`, `waiting` and `text` in `Reply language`. `dir` is `rtl` for Arabic, Hebrew, Persian and Urdu, else `ltr`.
- **`steps`:** six values in the order of `labels.steps`: `done`, `current`, `fail` (QA FAIL, back to build) or `todo`.
- **`now`:** the agent running right now, or `null` while the team waits for the developer.
- **`build`:** from the Tasks table of `03-plan.md`; `null` before the plan exists. **`pr`:** a number once open, `"merged"` when merged.
- **`activity`:** newest first, at most 15 entries. One per approval, step change, and idea added — agent starts and stops come from `live.js`. One line each — no file contents, no secrets.
- **`tickets`:** the folders in `.claude/team/work/active/`, oldest first.
- **`pending`:** what waits for the developer's answer right now — one entry per question, `[]` when nothing waits. `question` and every `label` in the reply language; `reply` is exactly what the developer would type to you, so the page can copy it. `change: ` ends with a space for them to finish typing.
- **`commands`:** the hand-over commands from `06-pr.md` for the developer's shell, one block per command, or `null`. The page shows them in full with a copy button; the developer runs them. Never put a secret in them.
- **`names`:** the `## Team names` table, keyed by role without `team:` / `team-`. The page shows the name everywhere, with the role beside it.
- **`customAgents`:** the `## Custom agents` table — `joins` is the step it joins at (`requirements`, `research`, `plan`, `build`, `qa`, `pr`, or `request`). The workflow canvas draws each one under its step.
- **`plan.items`:** the rows of `project-plan.md` that are not done — `n`, `feature`, `status` (`next`, `later`, `in progress`), `ticket` or `null`, `why`. The Tickets card lists them under "On the plan".
- **`sprint`:** the tracker's current cycle, or `null`. The timeline's Sprint view uses its dates; without it, the last 14 days.
- **`historyAll`:** the `file:///` address of `~/.claude/team/history.js` on this machine, for the timeline's "All projects" view. Local only — never commit it.
- **`todo`:** the product manager's lists from `/team-work`, `/team-work week` and `/team-work sprint` — keep the other horizons when you write one. `why` and `next` one short line each in the reply language; `start` is the exact command to type.
- **`board`:** only with `Local tickets: on` — every file in `.claude/team/tickets/`, Done only from the last 30 days. `status` is `plan`, `do`, `check` or `done`; `waiting` the ticket's Waiting line or `null`; `priority` `high`, `normal` or `low`; `due` a date or `null`; `step` the current `/team-work` step when a work folder is active, else `null`; `source` the platform's name for a ticket taken from one (`Linear`, `Jira`, `Notion`, `GitHub`), `null` for one written here. Leave `board` out for any other tracker: the Board tab then stays hidden.
- **`archive`:** the rows of `.claude/team/work/history/INDEX.md`, newest first, at most 100. `result` is `merged` or `closed` (in the reply language is fine); `days` a number or `null`; `summary` one line or empty. The page's Archive tab shows them with search and filters.
- **Custom agents** (`team-<slug>`): add their role name to `labels.roles` under the slug, e.g. `"designer": "Design Reviewer"`.

## `live.js` — written by the plugin's hook, never by you

When any `team:` agent starts or stops, the plugin's hook appends one line to `.claude/team/live.js`:

```js
TEAM_LIVE.push({"t":"2026-11-20T13:01:40Z","e":"start","a":"team:developer-lead","id":"agent-a1"});
```

When the coordinator starts a `team:` agent, the hook also records the task description it gave: `{"e":"task","a":"team:researcher","d":"RB-11 feasibility"}`.

## `history.js` — written by the plugin's hook, never by you

One line per finished agent run — start, end, agent and number of steps — kept for months: `TEAM_HISTORY.push({"s":"…","e":"…","a":"team:qa-engineer","n":14});`. The hook also adds the same line, with the project folder's name as `p`, to `~/.claude/team/history.js`, shared by all projects. The timeline's Today, Week, Sprint and All projects views read them.

When an agent finishes, the hook also adds its report to `live.js` — `{"e":"report","r":"…"}`, the first 600 characters — which the side panel shows.

## `actions.js` — written by the plugin's hook, never by you

Every tool call inside a `team:` agent adds one line: the time, the agent, the kind and a short target.

```js
TEAM_ACTIONS.push({"t":"2026-11-20T13:02:05Z","a":"team:developer-lead","id":"agent-a1","k":"edit","x":"resize.ts"});
```

| Kind | Tools | Target |
|---|---|---|
| `read` | Read | file name only |
| `edit` | Edit, Write, NotebookEdit | file name only |
| `run` | Bash, PowerShell | the command's short description, or only the program name when there is none — never the full command |
| `search` | Grep, Glob | — |
| `web` | WebFetch, WebSearch | the domain only |
| `tracker` | MCP tools | the tool name, e.g. `get_issue` |
| `tool` | anything else | the tool name |

No paths, file contents, command lines, queries or secrets are recorded. The page shows running agents, what each is doing, counts per kind and the timeline from `live.js` and `actions.js`, so `status.js` never needs an update for an agent starting, stopping or working. Do not edit either file; the hook trims them itself.
