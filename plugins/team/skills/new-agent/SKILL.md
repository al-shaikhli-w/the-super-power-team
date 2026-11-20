---
name: team-new-agent
description: Adds a new agent to the team for this project (or for all projects) — asks what it should do, when it joins the ticket workflow and what it may touch, writes the agent file from the team's template with the same safety rules, and registers it in the team profile so /team-work, /team-status and the dashboard use it. With `list`, shows the team's custom agents; with `remove <name>`, takes one out. Use when the developer types /team-new-agent, or asks to add, create, list or remove an agent or team member.
argument-hint: "[what it should do] | list | remove <name>"
---

# team — new agent

Request: `$ARGUMENTS`

Template: `agent-template.md` in this skill's folder. Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop.

## Rules
- One question at a time, with numbered choices.
- The eight plugin agents stay as they are. A new agent never replaces one; it adds a check or a job.
- Every new agent keeps the team's safety rules: read-only git, read-only tracker and GitHub, no PASS without output, the shared brief. Never remove them, whatever the developer asks — say why.
- Name: `team-<slug>`, lower case with dashes, e.g. `team-designer`. It must not match a plugin agent or an existing file.

## New agent
1. **The job.** No argument: ask "What should the new agent do?" Then, one at a time, only what is unclear:
   - What does it read first, and what does it produce?
   - How does a good result look — a table, a list of findings, a file?
2. **When it works** — pick one:
   1. After **Requirements** (step 1)
   2. After **Research** (step 2)
   3. After **Plan** (step 3)
   4. After each **Build** task (step 4)
   5. Before or with **QA** (step 5)
   6. After the **PR** opens (step 7)
   7. **Only on request** — "use team-<slug> for …"
3. **What it may touch:**
   1. **Read only** — `tools: Read, Grep, Glob` (recommended)
   2. **Read and run checks** — `+ Bash`; runs existing tests and tools, changes no files
   3. **Write its own report file** — `+ Write` for one file in the ticket's work folder
   4. **Edit tests** — `+ Write, Edit`, only in the project's test folder
   5. **Edit code** — `+ Write, Edit, Bash` — say this overlaps `team:developer-lead` and ask again
4. **Internet?** No (recommended) or yes (`+ WebSearch, WebFetch`, never sending project, customer or personal names).
5. **Where:** this project only — `.claude/agents/team-<slug>.md` (recommended) — or all projects — `~/.claude/agents/team-<slug>.md`.
6. **Write** the agent from the template. The description must say clearly what it does and when, because Claude chooses agents by it. Show the file; approve, change, or start again.
7. **Register** it in `team.md` under `## Custom agents` (add the section if missing):

   | Agent | Role | Joins at | May touch | Where |
   |---|---|---|---|---|
   | team-designer | Design reviewer | after Plan | read only | project |

   Dashboard on: add the role name to `labels.roles` in `status.js`.
8. **Say**, short: the file, when `/team-work` will use it, and that a **new session** is needed before Claude Code sees a new agent.

## `list`
The `## Custom agents` table from `team.md`, plus any `team-*.md` in `.claude/agents/` or `~/.claude/agents/` missing from it.

## `remove <name>`
Show the file and its row; on a yes, delete the file and the row. Never remove a plugin agent (`team:…`).
