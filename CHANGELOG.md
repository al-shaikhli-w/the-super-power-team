# Changelog

## 0.17.0

- **`/team-doctor` check 20 — skills and updates:** the team's commands and every skill named under `## Design tools` or in a custom agent are loaded (with the claude.ai skill-sync needs: Claude Code 2.1.273+, the same signed-in account, `syncClaudeAiSkills` not off, the skill toggled on); every skill in `.claude/skills/` and `~/.claude/skills/` has a `SKILL.md` with `name` (matching its folder, lowercase letters, digits, hyphens) and a `description` that says when to use it; skills from outside the plugin that bundle scripts or reach other servers get a review warning; a newer plugin release on npm points to `npx the-super-power-team@latest`, a new session and `/team-update`, which `fix` offers to run.
- **New look: black, white and red.** The whole dashboard (light and dark) uses three colours: black and white for everything, red only for what is working now or waits for you. New logo — black tile, white bolt, red-and-white kerb stripe. The workflow is a pit lane: asphalt band with a kerb, each step a stall, a red line up to the step at work, characters red while working, white when done, grey asleep. A live ticker under the lane types what the working agent does this second. Header tabs are quiet links. The "Needs you" card carries the kerb stripe.
- **Plan window** on the Live view: how far the project plan is (done / total with a meter), what is next, and every open row with its status and a Start button. Plan rows moved out of the Tickets card into it.
- Prototype of a simpler one-screen layout in `docs/prototypes/dashboard-simple.html`.
- **Compact text at every step:** new `team.md` field `Agent talk` — `compact full` (default), `compact lite`, `compact ultra`, `normal`; setup asks, `/team-update` adds it. Every step is short: coordinator messages, agent reports, step files, plans, requirements, `security.md`, `design.md`; findings one line each, commit messages Conventional Commits. Normal sentences for security warnings, irreversible steps, code, commands, the PR description, drafted replies and posts. Built into every agent's `## Talk` section; ideas from caveman by Julius Brussee (MIT).
- **Compact between steps:** after each approved step (2–5, long reports, QA FAIL rounds) `/team-work` offers `/compact` with the exact text to keep — ticket, next step, work folder, worktree — also as a dashboard button. Everything lives in the step files, so `/team-work <ticket>` resumes after compacting. Only the developer can run `/compact`.
- **Working habits in every agent:** a `## Habits` section per role — pick the habit first, understand before building, plans a stranger could follow, test first, root cause before any fix, evidence before "done", asking for and taking a review, finishing the branch, writing agent and skill files. The coordinator names the fitting habit in every agent prompt; `/team-new-agent` adds them to new agents. Ideas from superpowers by Jesse Vincent (MIT).
- **Dashboard: details for everything.** Tickets, ideas, security findings and agents open in a side panel with a click — from the Board, the Live view, the Archive and the new tabs. Escape or the backdrop closes it.
- **Agents tab — the pit wall:** one lane per agent instead of cards. Working agents on top with a speech bubble (task, the step it is on now, its last steps) and a live timer; helpers sit under the agent that started them. Every lane has a strip of the day (00:00–24:00) showing when that agent worked. Click a lane for every run with each step, files, helpers it started and the final report.
- **Livelier characters:** a pose for what each one does right now (reading, typing, running, searching, browsing), a ring of light while working, eyes that follow your pointer, sleepers that peek when you come close, a squish and hearts when you tap one, a wake-up jump when a step starts, confetti when it finishes, dizzy stars when QA fails, and a pulse when it waits for you. Reduced motion turns all of it off.
- **Who is working:** a live tree of the coordinator, the agents it started and their helper sub-agents (`Explore`, `general-purpose`, …). Helpers also appear in the Workflow under the agent that started them. The hook now records every sub-agent (`"h":1` for helpers) and the parent agent of a task (`"p"`); `history.js` stays team-only.
- **Security tab, built on OWASP:** findings grouped by the OWASP Top 10:2025 — one tile per category, filters, search and a details panel with the category, what can go wrong, the fix, CWE and where in the app. The security engineer now maps every finding to an OWASP category (and CWE) with the ASVS as its checklist; `security.md` lines carry the category and a Risk line.
- **Security tab — OWASP check cards:** a posture bar of the ten OWASP Top 10:2025 categories (high risk open, needs work, passed, not checked, does not apply), then one card per category with its checks ticked or crossed, the SEC item behind each failed check, and a progress meter. `security.md` gains an `## OWASP checks` section the security engineer fills with evidence; before the first scan each card shows a built-in list as not checked yet.
- **OWASP checks reused in QA:** the threat check (step 2) assigns the OWASP categories a ticket touches; the security review (step 5) runs those categories' checks from `security.md` — the same lines — and skips every category not assigned. The ticket's details show the OWASP review with the skipped categories crossed out, the Security tab marks a category while a review is checking it, and the workflow's security node lists the assigned categories.
- Security tab animations: the category bar fills in, cards rise in order, each card's code has a progress ring, checks tick in one by one, failed checks pulse. Replays when you open the tab; reduced motion turns it off.
- Live view: the Timeline no longer shows "last 30 min".
- **Ideas tab:** every idea from every idea file with filters, search and details; the open ones also show on the Live view.
- `status.js` gains `ideas.items`, ticket `what`, `criteria`, `notes`, `branch`, `link`, security `owasp`, `cwe`, `detail`, `fix`, `where`, `found`, and optional `labels.roleDesc` (see `status-format.md`).

## 0.16.0

- **New role: `team:designer` — Nour.** On a project with UI, setup scans it and writes `.claude/team/project/design.md` — tokens, components, inconsistencies and a redesign to-do list (`DES-1 · high · …`).
- **Prototype first:** every ticket that changes what users see gets step 2b — a clickable HTML prototype with every state and Playwright screenshots in `02b-prototype/`, approved before the plan. The project manager plans from it and the developer lead builds from it.
- **Visual check in QA:** Nour compares the running app (`Dev URL` in `team.md`) with the prototype — `05-design.md` with PASS, FAIL or NOT TESTED.
- **`/team-design`**: scan or rescan, `list`, `fix DES-<n>` (works the item as a ticket and ticks it on merge), `skip DES-<n> <reason>`.
- Playwright MCP (`@playwright/mcp@0.0.86`, uses Google Chrome) now comes with the plugin (`.mcp.json`). Optional design tools in `## Design tools`: doop MCP, frontend-design, ui-ux-pro-max, Figma when asked — setup asks; you install.
- Dashboard: a Design section with Fix buttons, a design to-dos counter, Nour in the Workflow, and an "Open prototype" link on each ticket.
- Doctor checks `design.md`, Playwright and the design tools; `/team-update` adds `## Design tools`, `Dev URL` and Nour's name.

## 0.15.0

- Dashboard in your language: a switch in the header for English (the default), German and the team's reply language. The page remembers the choice. `status.js` gains an optional `lang` code so the switch shows the reply language by its own name (`العربية`, `Français`).
- Workflow characters: every step is now a small animated character in its role's colour with its own hat — a light bulb for the product manager, glasses for the researcher, a hard hat for the project manager, headphones for the developer lead, a detective cap for QA, a party hat for Rafi. It sleeps until its step starts, thinks when it is its turn, works when its agent runs, waves when it waits for you, is happy when done and dizzy when QA fails. A sheet of paper travels along the line when one step hands work to the next. Reduced motion stops every animation.
- New dashboard screenshots in the README.

## 0.14.1

- Arabic in the terminal: the setup language question lists one choice per line with no brackets (it showed `)Arabic( العربية`), and a new `Right-to-left in the terminal` rule in `team.md` keeps every reply readable — one direction per line, commands and ids on their own line. `/team-update` adds the rule to existing projects.
- Arabic on the dashboard: an Arabic font first, no letter spacing (it broke the joins), taller lines for diacritics, the workflow canvas runs right to left, and English labels, ticket ids and times no longer flip (`30 min`, `11:43 PM`).

## 0.14.0

- **New role: `team:security-engineer`.** On a project with code, setup scans it and writes `.claude/team/project/security.md` — what the system protects, its entry points, and a security to-do list (`SEC-1 · high · …`). Every ticket gets a threat check at step 2 (`02-security.md`, its rules go into the brief and the plan) and a security review at step 5 (`05-security.md`); QA's own security check moved to it.
- **New role: `team:social-media` — Rafi.** Writes the marketing plan (`.claude/team/marketing/marketing-plan.md`: audience, message, channels, 30-day calendar, launch moments, numbers to watch), drafts social media posts for every merged feature, and a weekly round-up. Drafts only — you publish. `Social posts` in `team.md`: `after merge`, `ask` (default), `off`.
- **`/team-social`**: the marketing plan; `post <ticket>`, `week`, `list`.
- **`/team-security`**: scan or rescan, `list`, `fix SEC-<n>` (works the item as a ticket and ticks it on merge), `accept SEC-<n> <reason>`.
- **Several tickets at once**: `/team-work RB-12 RB-13 RB-14` works like a real team — planners prepare tickets, then a developer pool and a QA pool take them. The pools grow and shrink by themselves, up to 3 each (`## Team size` in `team.md`).
- One git worktree per ticket (`## Worktrees` in `team.md`); the crew hands you the `git worktree` commands. Tickets whose plans change the same files wait for each other; `<ticket> go anyway` overrides.
- Approvals stay one at a time, tagged with their ticket: `[RB-13] … approve?` → `RB-13 approve`.
- **Models per job** (`## Models` in `team.md`): haiku for the reply writer and agent maintainer, sonnet for the researcher and QA's CI and local-review checks, your model for the rest. Every agent stays a sub-agent with a short brief to keep your session small.
- Dashboard: a Team card (who works on which ticket, free places, waiting tickets); a Security section with the to-do list and Fix buttons; a Marketing section with Rafi's plan, calendar and post drafts; the security engineer and Rafi in the Workflow; an open security to-dos counter. Workflow lines are redrawn after the page scrolls, so they no longer drift on long pages.
- Doctor: checks for `security.md`, stale worktrees and Rafi's marketing plan. Every agent now knows where `security.md` and the marketing plan live. `/team-update` adds the new `team.md` sections. `/team-names` accepts several names for the developer, QA and security roles.
- README: a section that explains the team for kids, and sections on several tickets, security, and models.
- README: the workflow and the several-tickets diagrams are now images (`assets/workflow.png`, `assets/several-tickets.png`), with the text version kept under "Text version". Their sources are in `assets/diagrams/` (HTML, rendered with Playwright at 2×).
- GitHub repository renamed to `al-shaikhli-w/the-super-power-team` (old links redirect); marketplace renamed to `the-super-power-team`.
- New logo: a lightning bolt instead of the wrench, in the README, the dashboard header and the dashboard's browser tab.
- One README for GitHub and npm: `scripts/build-npm-readme.js` copies it before every `npm publish`.

## 0.13.0

- Renamed to **The Super Power Team**: README, dashboard title and logo labels. Install commands, the `team` plugin and the `/team-*` commands are unchanged.
- Published on npm as [`the-super-power-team`](https://www.npmjs.com/package/the-super-power-team), with its own README.
- Install from npm with one command: `npx the-super-power-team`. It copies the plugin to `~/.claude/the-super-power-team/` and registers it with Claude Code as `team@the-super-power-team` — no git or `/plugin` commands. `npx the-super-power-team@latest` updates, `uninstall` removes it.
- README: an "At a glance" summary, a table of contents and npm install notes.

## 0.12.0

- Setup asks early where tickets live: Linear, Jira, Notion, GitHub Issues, another connector, local tickets, or none.
- Local tickets: markdown files in `.claude/team/tickets/` in four columns — Plan, Do, Check, Done — with a waiting flag; `/team-ticket` creates, lists and moves them, and `/team-work` keeps their status in step.
- Dashboard: a Board tab with the four columns, shown when the project uses local tickets.
- Every new ticket first asks where it comes from: written here, or taken (read-only) from Linear, Jira, Notion, GitHub Issues or another connected tool. The local board works on its own or next to any tracker (`Local tickets: on`), and cards show their source.

## 0.11.0

- Short command names without a colon: `/team-work`, `/team-status`, `/team-setup` and so on.
- `team:reviewer`: an independent review after QA by a fresh agent that sees only the requirements and the diff; `Independent review` in `team.md` (`after QA`, `ask`, `off`) and `/team-work review`.
- `/team-rollback <ticket>`: finds the shipped change, checks the risks, applies the reverse change on a new branch and runs it through QA, review and the PR hand-over; history is kept.
- `/team-update`: brings a project's team files up to the installed plugin version, showing every change first. `team.md` records `Team version`; the doctor warns when it is behind.

## 0.10.0

- Workflow side panel: the agent's final report (with Show all) and the files it changed and read.
- Timeline ranges: 30 min, Today, Week, Sprint and All projects, as a heat map of busy time per agent or per project.
- The hook keeps a long-term history per project and one shared by all projects (`~/.claude/team/history.js`).
- Tickets is one card: In progress, Today and On the plan, each with Start buttons.
- The Activity list is gone.
- The Todo card is gone: Today, Week and Sprint switch inside the Tickets card.

## 0.9.0

- Dashboard "Needs you" card: the team's question with Approve / Change / Stop buttons that copy the answer.
- "Ready to commit" card: commit message and commands with copy buttons; the dashboard never runs them.
- Todo card with Today, Week and Sprint lists and Start buttons; `/team-work week` and `/team-work sprint`.
- Workflow canvas: each ticket's steps as connected nodes, the running agent's live step, custom agents branching off.
- `/team-names`: personal names for agents, usable in requests and shown on the dashboard.
- The agent cards are gone: click a step on the workflow canvas for its agent's details in a side panel.
- The summary tiles are now small stats in the workflow footer.

## 0.8.0

- `/team-new-agent`: add your own agents, with the team's safety rules, joining the workflow at the step you choose; `list` and `remove`.
- Dashboard: Live and Archive tabs; the archive lists finished tickets with search, filters and totals.
- Custom agents appear live on the dashboard with their own colour.

## 0.7.0

- The dashboard shows what every agent is doing right now: its task, a live timer, the current step, counts per kind of work and its last steps.
- A 30-minute timeline chart with one row per agent and a dot per step.
- New design: summary tiles, agent cards, step-by-step ticket progress, activity feed; light and dark, phone to desktop.

## 0.6.0

- Live agent events: a plugin hook writes every `team:` agent start and stop to `.claude/team/live.js`; the dashboard shows running agents and the events without approval prompts.
- The dashboard shows several agents working at once.

## 0.5.0

- `/team-dashboard`: a local page that shows the working agent, each ticket's steps, the plan, the ideas and recent activity; refreshes itself, right to left for Arabic.
- `/team-setup` asks whether to turn it on; `/team-doctor` checks it.

## 0.4.0

- `/team-status`: a waterfall of every active ticket, the plan's progress and the open ideas.
- `/team-doctor`: twelve quick checks with one line when all is well; `fix` walks through the problems. Runs at the end of `/team-setup`.

## 0.3.0

- `/team-new-idea` keeps new wishes in versioned idea files, with a duplicate check.
- `/team-new-idea review`: the project manager steps back and proposes which ideas go into the project plan; only approved ones do.

## 0.2.0

- `/team-setup` asks the reply language and whether to use one agent or several per ticket.
- `/team-setup` reads the code, or interviews you when there is none, and writes `project-info.md`, `project-tech.md` and `project-plan.md`.
- Every agent answers in your language; `/team-work` can run independent steps in parallel.

## 0.1.0

- First public version: seven agents, `/team-setup` and `/team-work`.
- Works with Linear, GitHub Issues or no tracker; Windows, macOS and Linux.
