# `status.js` — what the dashboard shows

File: `.claude/team/status.js`. One JavaScript assignment, rewritten whole on every update — never appended. A browser opens the dashboard straight from disk, where it cannot read JSON files, so the data is a script.

```js
window.TEAM_STATUS = {
  "updated": "2026-11-20T14:05:12+01:00",
  "project": "Recipe box",
  "dir": "ltr",
  "lang": "en",
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
    "roles": { "product-manager": "Product Manager", "researcher": "Researcher", "project-manager": "Project Manager", "developer-lead": "Developer Lead", "qa-engineer": "QA Engineer", "reply-writer": "Reply Writer", "agent-maintainer": "Agent Maintainer", "reviewer": "Independent Reviewer", "security-engineer": "Security Engineer", "social-media": "Social Media", "designer": "Designer" },
    "crew": "Team", "developers": "Developers", "qaPool": "QA", "free": "free", "waitsFor": "waits for",
    "kpiSecurity": "Security to-dos", "kpiSecuritySub": "{high} high",
    "security": "Security", "secOpen": "Open", "secFixed": "Fixed", "secAccepted": "Accepted risk", "secScan": "Scan again", "secFix": "Fix", "secNone": "No security list yet", "secAllDone": "Nothing open — well done",
    "design": "Design", "desOpen": "Open", "desFixed": "Fixed", "desSkipped": "Skipped", "desScan": "Scan again", "desFix": "Fix", "desNone": "No design list yet", "desAllDone": "Nothing open — looks great", "prototype": "prototype", "visualCheck": "visual check", "openPrototype": "Open prototype", "kpiDesign": "Design to-dos",
    "marketing": "Marketing", "mkPlan": "Marketing plan", "mkDrafts": "Post drafts", "mkCalendar": "Next on the calendar", "mkNoPlan": "No marketing plan yet", "mkMake": "Make the plan", "mkWeek": "Weekly round-up",
    "draft": "draft", "posted": "posted", "approved": "approved", "threatCheck": "threat check", "securityReview": "security review", "posts": "posts",
    "tabAgents": "Agents", "tabSecurity": "Security", "tabIdeas": "Ideas", "close": "Close", "details": "Details",
    "coordinator": "Coordinator", "coordinatorRole": "Claude Code — hands out the work", "helper": "helper", "subAgents": "sub-agents", "whoWorks": "Who is working", "whoWorksSub": "The coordinator, the agents it started and their helpers", "allAgents": "All agents",
    "idleAgent": "Idle", "lastSeen": "Last run", "neverRan": "Has not worked yet", "runsToday": "Runs today", "actionsToday": "Actions today", "timeToday": "Time today", "whatDoes": "What this agent does", "runsH": "Runs", "startedBy": "Started by", "helpers": "Helpers it started",
    "status": "Status", "priority": "Priority", "source": "Source", "created": "Created", "updatedOn": "Updated", "branch": "Branch", "what": "What", "criteria": "Acceptance criteria", "notes": "Notes", "agentsOnTicket": "Agents on this ticket", "step": "Step", "link": "Link", "build": "Build", "openTicket": "Show ticket", "prio_normal": "normal",
    "ideas": "Ideas", "openIdeas": "Open ideas", "allIdeas": "All ideas", "newIdea": "New idea", "reviewIdeas": "Review ideas", "idea_new": "new", "idea_question": "question", "idea_planned": "planned", "idea_later": "later", "idea_dropped": "dropped",
    "askedBy": "Asked by", "size": "Size", "why": "Why / for whom", "decision": "Decision", "noIdeas": "No ideas yet — add one with /team-new-idea", "workOnIt": "Work on it", "file": "File", "searchIdeas": "Search ideas…",
    "owaspTitle": "OWASP Top 10:2025", "owaspSub": "findings by category", "owaspNone": "Not mapped", "owaspLink": "Read on owasp.org", "risk": "What can go wrong", "where": "Where", "fixLine": "How to fix", "found": "Found", "category": "OWASP category", "severity": "Severity", "effort": "Effort",
    "accept": "Accept risk", "secAll": "All details", "secFindings": "Findings", "searchSec": "Search findings…", "sev_high": "high", "sev_medium": "medium", "sev_low": "low", "st_open": "open", "st_fixed": "fixed", "st_accepted": "accepted", "allCats": "All categories",
    "roleDesc": { "developer-lead": "Builds the approved plan with tests and fixes what QA or review finds.", "_coordinator": "The main Claude Code session — starts each agent and asks you before every next step." }
  },
  "now": { "agent": "team:developer-lead", "task": "RB-7 — task 3, validation", "since": "2026-11-20T14:01:40+01:00" },
  "tickets": [
    {
      "id": "RB-7", "title": "Save a recipe",
      "steps": ["done", "done", "done", "current", "todo", "todo"],
      "build": { "done": 2, "total": 4 },
      "waiting": "you — approve task 3",
      "pr": null,
      "prototype": "file:///Users/<you>/recipe-box/.claude/team/work/active/rb-7/02b-prototype/index.html",
      "what": "Signed-in users save a recipe to their box and find it again later.",
      "criteria": [ { "text": "A Save button on every recipe", "done": true }, { "text": "Saved recipes appear in My box", "done": false } ],
      "owasp": {
        "A01": { "why": "New delete route", "checks": [ { "text": "Users reach only their own data", "status": "fail", "sec": "SEC-2" } ] },
        "A05": { "why": "Search input reaches the database", "checks": [ { "text": "Database queries use parameters", "status": "pass" } ] }
      }
    }
  ],
  "plan": { "done": 0, "total": 2, "next": "Save a recipe",
    "items": [ { "n": 2, "feature": "Search recipes", "status": "next", "ticket": null, "why": "Users asked for it" } ] },
  "sprint": { "name": "Sprint 14", "start": "2026-11-16", "end": "2026-11-29" },
  "historyAll": "file:///C:/Users/<you>/.claude/team/history.js",
  "ideas": { "file": "idea-v2.md", "new": 1, "question": 1,
    "items": [
      { "n": 1, "file": "idea-v2.md", "idea": "Weekly meal planner", "why": "Families plan a whole week at once", "by": "you", "size": "L", "status": "new", "date": "2026-11-20", "decision": null, "ticket": null, "notes": ["Start with drag-and-drop days"] },
      { "n": 2, "file": "idea-v2.md", "idea": "Share a recipe by link", "why": "Send to friends", "by": "you", "size": "S", "status": "question", "notes": [ { "date": "2026-11-21", "text": "Public, or signed-in users only?" } ] },
      { "n": 1, "file": "idea-v1.md", "idea": "Import from URL", "size": "M", "status": "planned", "decision": "2026-11-10 — into the plan as #4", "ticket": "RB-12" }
    ] },
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
  "security": { "open": 2, "high": 1, "medium": 1, "low": 0, "file": "project/security.md",
    "items": [
      { "id": "SEC-1", "severity": "high", "title": "Payment key in the repository", "effort": "S", "status": "open",
        "owasp": "A04", "cwe": "CWE-798", "where": "payments config", "found": "2026-11-20", "ticket": null,
        "detail": "Anyone who can read the repository can charge cards with the live key.", "fix": "Move the key to an environment variable and rotate it." },
      { "id": "SEC-2", "severity": "medium", "title": "Any signed-in user can delete any recipe", "effort": "S", "status": "open", "owasp": "A01", "cwe": "CWE-639", "where": "recipes API", "detail": "The delete route checks the login but not who owns the recipe." },
      { "id": "SEC-3", "severity": "low", "title": "No rate limit on login", "status": "fixed", "owasp": "A07", "note": "2026-11-22 · PR #41" }
    ],
    "checks": {
      "A01": { "status": "checked", "checks": [
        { "text": "The server checks who may do what on every route", "status": "pass" },
        { "text": "Users reach only their own data", "status": "fail", "sec": "SEC-2" },
        { "text": "The server never fetches a user-given URL", "status": "na", "note": "no outgoing requests" } ] },
      "A08": { "status": "na", "checks": [ { "text": "No deserialisation of user data", "status": "na" } ] }
    } },
  "design": { "open": 2, "high": 1, "medium": 1, "low": 0, "file": "project/design.md",
    "items": [
      { "id": "DES-1", "priority": "high", "title": "Five different button styles", "effort": "M", "status": "open" },
      { "id": "DES-2", "priority": "medium", "title": "Hard-coded colours in the recipe card", "effort": "S", "status": "open" }
    ] },
  "marketing": { "plan": "approved", "message": "Plan a week of meals in five minutes.",
    "calendar": [ { "day": "2026-11-21", "channel": "X", "idea": "Before/after of the meal planner", "goal": "awareness" } ],
    "posts": [ { "date": "2026-11-20", "ticket": "RB-9", "title": "Search by ingredient", "status": "draft", "channels": ["X", "LinkedIn"], "file": "2026-11-20-rb-9.md" } ] },
  "crew": {
    "developers": [ { "name": "Omar", "ticket": "RB-7", "step": "Build 3/4" }, { "name": "Sami", "ticket": "RB-8", "step": "Build 1/2" } ],
    "qa": [ { "name": "QA 1", "ticket": "RB-6", "step": "QA" } ],
    "max": { "developers": 3, "qa": 3, "planning": 3 },
    "waiting": [ { "ticket": "RB-9", "for": "RB-7", "why": "both change src/lib/search.ts" } ]
  },
  "customAgents": [ { "agent": "team-a11y", "name": "Accessibility Reviewer", "joins": "qa" } ],
  "todo": {
    "updated": "2026-11-20T08:55:00+01:00",
    "today": [ { "ticket": "RB-12", "title": "Weekly meal planner", "why": "Sprint goal, unblocked", "next": "Requirements", "start": "/team-work RB-12" } ],
    "week": [],
    "sprint": []
  },
  "board": [
    { "id": "RB-12", "title": "Weekly meal planner", "status": "do", "waiting": "you — approve task 2", "priority": "high", "due": "2026-11-27", "step": "Build 1/4", "source": null,
      "created": "2026-11-18", "updated": "2026-11-23", "branch": "jane/rb-12-planner", "pr": null,
      "what": "Plan the week's meals on one screen and get one shopping list.",
      "criteria": [ { "text": "Drag a recipe onto a day", "done": true }, { "text": "One shopping list for the week", "done": false } ],
      "notes": [ { "date": "2026-11-19", "text": "Plan approved — four tasks" } ] },
    { "id": "ABC-41", "title": "Fix login timeout", "status": "plan", "waiting": null, "priority": "normal", "due": null, "step": null, "source": "Linear", "sourceId": "ABC-41", "link": "https://linear.app/acme/issue/ABC-41" }
  ],
  "archive": [
    { "date": "2026-11-18", "id": "RB-5", "title": "Recipe list with filters", "pr": 38, "result": "merged", "days": 3, "summary": "Filters by cuisine and time" }
  ]
}
```

- **Language:** every `labels` value (all of them — the page falls back to English for a missing one), `task`, `waiting` and `text` in `Reply language`. `dir` is `rtl` for Arabic, Hebrew, Persian and Urdu, else `ltr`. `lang` is the reply language's code (`ar`, `fr`, `en`, …). The page opens in English and has a switch for English, German and the reply language — `labels` are what it shows when the developer picks the reply language.
- **`steps`:** six values in the order of `labels.steps`: `done`, `current`, `fail` (QA FAIL, back to build) or `todo`.
- **`now`:** the agent running right now, or `null` while the team waits for the developer. With several tickets: a list, one `{ agent, task, since, ticket }` per running agent.
- **`security`:** from `.claude/team/project/security.md`, or `null` when the file does not exist. `open`, `high`, `medium`, `low`: open items by severity (accepted risks do not count); `updated`: the file's Updated date. `items`: every item — `id`, `severity`, the short `title` from its line, `effort`, `status` (`open`, `fixed`, `accepted`), a `note` (the fixed date and PR, or the accepted reason), `owasp` (the OWASP Top 10:2025 code from the line, `A01`…`A10`, or `null`), `cwe` (`CWE-<n>` or `null`), `where` (the part of the app in plain words, e.g. "recipes API" — never a path or `file:line`), `detail` (the item's Risk line: who can do what, one or two sentences), `fix` (its one-line fix), `found` (date) and `ticket` (the ticket fixing it, or `null`) — open ones first, most dangerous first, at most 30. `checks`: the `## OWASP checks` section of `security.md`, keyed by category `A01`…`A10` — `status` (`checked`, or `na` when the whole category does not apply) and `checks`, one per line: `text` (the check in plain words, in the reply language), `status` (`pass`, `fail`, `todo`, `na`), `sec` (the `SEC-<n>` a failed check belongs to) and an optional short `note`. A category missing from `checks` shows the page's built-in list as not checked yet; every open finding shows as a failed check and every fixed one as passed. Never a file path, a line number or any secret value. The Security tab shows a bar of the ten categories, one card per category with its checks, and groups the items by OWASP category, opens each in a details panel, and has Fix and Accept buttons that copy `/team-security fix <id>` and `/team-security accept <id> `.
- **`design`:** from `.claude/team/project/design.md`, or `null` when the file does not exist. `open`, `high`, `medium`, `low`: open items by priority (skipped items do not count). `items`: every item — `id`, `priority`, the short `title`, `effort`, `status` (`open`, `fixed`, `skipped`) and a `note` — open ones first, most important first, at most 30. The Design section has a Fix button that copies `/team-design fix <id>`.
- **`tickets[].prototype`:** the `file:///` address of the ticket's `02b-prototype/index.html` once step 2b is approved, else `null`. Local only. The ticket card shows an "Open prototype" link.
- **`marketing`:** from `.claude/team/marketing/`, or `null` when `Social posts` is `off` and the folder does not exist. `plan`: the status of `marketing-plan.md` (`draft`, `approved`) or `null`; `message`: its one-sentence message; `calendar`: the next five calendar rows from today — `day`, `channel`, `idea`, `goal`; `posts`: the drafts in `posts/`, newest first, at most 20 — `date`, `ticket` (or `week`), `title`, `status` (`draft`, `posted`), `channels`, `file`. The Marketing section shows them with buttons for `/team-social` and `/team-social week`.
- **`crew`:** only while several tickets run (`/team-work` "Several tickets — the team"); leave it out otherwise and the Team card stays hidden. `developers` and `qa`: one entry per busy member — name, ticket, current step. `max`: the limits from `## Team size`. `waiting`: tickets held by the overlap check, with the ticket they wait for and why, one line in the reply language.
- **`build`:** from the Tasks table of `03-plan.md`; `null` before the plan exists. **`pr`:** a number once open, `"merged"` when merged.
- **`activity`:** newest first, at most 15 entries. One per approval, step change, and idea added — agent starts and stops come from `live.js`. One line each — no file contents, no secrets.
- **`tickets`:** the folders in `.claude/team/work/active/`, oldest first.
- **`pending`:** what waits for the developer's answer right now — one entry per question, `[]` when nothing waits. `question` and every `label` in the reply language; `reply` is exactly what the developer would type to you, so the page can copy it. `change: ` ends with a space for them to finish typing.
- **`commands`:** the hand-over commands from `06-pr.md` for the developer's shell, one block per command, or `null`. The page shows them in full with a copy button; the developer runs them. Never put a secret in them.
- **`names`:** the `## Team names` table, keyed by role without `team:` / `team-`. The page shows the name everywhere, with the role beside it.
- **`customAgents`:** the `## Custom agents` table — `joins` is the step it joins at (`requirements`, `research`, `plan`, `build`, `qa`, `pr`, or `request`). The workflow canvas draws each one under its step.
- **`ideas`:** `file` is the open idea file, `new` and `question` its counts. `items`: every row of the open and closed idea files, open file first — `n`, `file`, `idea`, `why`, `by` (Asked by), `size`, `status` (`new`, `question`, `planned`, `later`, `dropped`), `date`, `decision`, `ticket` (from the plan row it became, or `null`) and `notes` (its lines under Notes — strings or `{ date, text }`), at most 60. The Live view lists the open ones; the Ideas tab shows all with filters and a details panel.
- **`tickets[].owasp`:** the categories assigned under **OWASP** in the ticket's `02-security.md`, keyed `A01`…`A10` — `why` (one line) and `checks`: the same lines as `security.checks` for that category, marked by the security review in `05-security.md` (`pass`, `fail` with `sec`, `todo` until it runs). Leave out every category not assigned — the page shows those as skipped and they are not checked. Missing before step 2. The ticket's details show the OWASP review; the Security tab marks the categories a running review is checking.
- **Ticket details:** `tickets[]` and `board[]` may add `what` (the ticket's What, two to five lines), `criteria` (its acceptance criteria — `{ text, done }`), `notes` (`{ date, text }`, newest last, at most 15), `created`, `updated`, `branch`, `pr`, `prUrl`, `sourceId` and `link` (the platform's `https://` address). The page merges `board`, `tickets` and `archive` entries with the same `id` and opens them in a details panel from the Board, the Live tickets and the Archive. One line each — no code, no secrets.
- **`labels.roleDesc`:** optional — what each agent does, one sentence in the reply language, keyed by role (and `_coordinator`, `_helper`). The page has English and German built in. A custom agent's line can also come from `customAgents[].does`.
- **`plan.items`:** the rows of `project-plan.md` that are not done — `n`, `feature`, `status` (`next`, `later`, `in progress`), `ticket` or `null`, `why`. The Tickets card lists them under "On the plan".
- **`sprint`:** the tracker's current cycle, or `null`. The timeline's Sprint view uses its dates; without it, the last 14 days.
- **`historyAll`:** the `file:///` address of `~/.claude/team/history.js` on this machine, for the timeline's "All projects" view. Local only — never commit it.
- **`todo`:** the product manager's lists from `/team-work`, `/team-work week` and `/team-work sprint` — keep the other horizons when you write one. `why` and `next` one short line each in the reply language; `start` is the exact command to type.
- **`board`:** only with `Local tickets: on` — every file in `.claude/team/tickets/`, Done only from the last 30 days. `status` is `plan`, `do`, `check` or `done`; `waiting` the ticket's Waiting line or `null`; `priority` `high`, `normal` or `low`; `due` a date or `null`; `step` the current `/team-work` step when a work folder is active, else `null`; `source` the platform's name for a ticket taken from one (`Linear`, `Jira`, `Notion`, `GitHub`), `null` for one written here. Leave `board` out for any other tracker: the Board tab then stays hidden.
- **`archive`:** the rows of `.claude/team/work/history/INDEX.md`, newest first, at most 100. `result` is `merged` or `closed` (in the reply language is fine); `days` a number or `null`; `summary` one line or empty. The page's Archive tab shows them with search and filters.
- **Custom agents** (`team-<slug>`): add their role name to `labels.roles` under the slug, e.g. `"a11y": "Accessibility Reviewer"`.

## `live.js` — written by the plugin's hook, never by you

When any sub-agent starts or stops, the plugin's hook appends one line to `.claude/team/live.js`. Sub-agents outside the team (`Explore`, `general-purpose`, …) carry `"h":1` and show as helpers:

```js
TEAM_LIVE.push({"t":"2026-11-20T13:01:40Z","e":"start","a":"team:developer-lead","id":"agent-a1"});
```

When the coordinator — or an agent — starts a sub-agent, the hook also records the task description it gave: `{"e":"task","a":"team:researcher","d":"RB-11 feasibility"}`. When an agent started it, `p` is that agent's id, so the page draws the helper under its parent: `{"e":"task","a":"Explore","d":"Find auth code","p":"agent-a1","h":1}`. The Live view's "Who is working" tree and the Agents tab show the coordinator, every running agent and the helpers each one started.

## `history.js` — written by the plugin's hook, never by you

One line per finished team agent run (helpers are not kept) — start, end, agent and number of steps — kept for months: `TEAM_HISTORY.push({"s":"…","e":"…","a":"team:qa-engineer","n":14});`. The hook also adds the same line, with the project folder's name as `p`, to `~/.claude/team/history.js`, shared by all projects. The timeline's Today, Week, Sprint and All projects views read them.

When an agent finishes, the hook also adds its report to `live.js` — `{"e":"report","r":"…"}`, the first 600 characters — which the side panel shows.

## `actions.js` — written by the plugin's hook, never by you

Every tool call inside a sub-agent adds one line (`"h":1` for a helper): the time, the agent, the kind and a short target.

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
