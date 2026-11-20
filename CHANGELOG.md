# Changelog

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
