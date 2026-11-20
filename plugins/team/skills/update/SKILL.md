---
name: team-update
description: Brings this project's team files up to the installed plugin version — new profile fields, the dashboard page, the history index, custom agents' shared sections — shows every change first and applies only what the developer approves, then runs the doctor. Never touches the project's code, project documents or ticket work. Use when the developer types /team-update, after updating the plugin, or when the doctor says the team files are older than the plugin.
argument-hint: "[check]"
---

# team — update

Request: `$ARGUMENTS`

Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop.

The plugin itself is updated by Claude Code, not by this skill. This skill only updates what `/team-setup` once wrote into this project.

## 1. Versions
- **Installed:** `version` in this plugin's `.claude-plugin/plugin.json`, two folders up from this skill.
- **Project:** `Team version` in `team.md`. Missing means the project was set up before 0.11.0.
- Same version and argument is not `check`: still run the comparison below — files can drift by hand — but say the versions match.
- Project newer than installed: say the plugin is older than this project's files, give the command to update it, and stop:

  ```text
  npx the-super-power-team@latest
  ```

  If `claude plugin list` shows `team@my-super-team` (the older GitHub install) instead, the commands are `claude plugin marketplace update my-super-team` and `claude plugin update team@my-super-team`.

  Then a new session, so Claude Code loads the new agents and skills.

## 2. Compare — read only
Build one numbered table: `# | File | Change | Why`. Compare against the templates in `../setup/`, `../new-agent/` and `../dashboard/`.

| What | Compare with | A change when |
|---|---|---|
| `team.md` fields | `../setup/team-template.md` | a field or `##` section of the template is missing. Never rewrite a field that has a value. New fields get their default: `Independent review: ask`, `Agents per ticket: one at a time`, `Dashboard: off`, `Social posts: ask`, `Right-to-left in the terminal` the template's lines; a `team:social-media | Rafi` row in `## Team names` unless the developer named it; `## Team size` and `## Models` the template's values; `Worktree folder` `../<repo folder>-worktrees`. A missing `## Models` row for an agent gets the template's row; rows the developer changed stay. A field that needs the developer's answer stays `<…>` and becomes a question in step 3. |
| `Team version` | the installed version | it differs or is missing |
| `.claude/team/dashboard.html` | `../dashboard/dashboard.html` | `Dashboard: on` and the copy is not identical |
| `.claude/team/status.js` | `../dashboard/status-format.md` | `Dashboard: on` and a label from the format is missing, e.g. a new role in `labels.roles` |
| `work/history/INDEX.md` | header `\| Date \| Ticket \| Title \| PR \| Result \| Days \| Summary \|` | the header has fewer columns: add the missing ones, existing rows get `—` |
| Folders | `work/active/`, `work/history/`, `project/`, `ideas/`, and `tickets/` when `Local tickets` is `on` | one is missing |
| `## Tracker` | the template's `Tracker`, `Where`, `Local tickets`, `Ticket prefix` lines | one is missing: keep the old one-line value as `Tracker`, ask for the rest. `Tracker: Local tickets` (0.12.0) becomes `Tracker: none` and `Local tickets: on`. |
| Ticket files | `../ticket/ticket-template.md` | a ticket file has no `Source` line: add `Source: here` |
| Custom agents | `../new-agent/agent-template.md` | a `team-*.md` listed under `## Custom agents` lacks a section the template has ("Language and project documents", "Shared brief", "Limits"): add the section, never change its job |
| Folders: `marketing/` | — | `Social posts` is not `off` and `.claude/team/marketing/` is missing: create it |
| `security.md` | `../security/security-template.md` | the project has code and `.claude/team/project/security.md` is missing: offer `/team-security` after the update — the security engineer writes it, not you |
| Git excludes | `../dashboard/SKILL.md`, section Git | `Git` is "share" or "commit all" and a local dashboard file is not in `.git/info/exclude` |

Nothing to change: print one line, e.g. `✔ Team files are up to date — 0.11.0.`, and stop.

Show the table. With `check`: stop here.

## 3. Apply
Ask once: apply all, pick numbers, or stop. Then, one change at a time, only the approved numbers:
- A field that needs an answer: ask it with numbered choices (as `/team-setup` would), then write it.
- Write only under `.claude/team/`, `.claude/agents/team-*.md` and `.git/info/exclude`.
- Last: set `Team version` to the installed version — only if every approved change was written.

Never touch: the project's code, `CLAUDE.md`, the project documents' content (`project-info.md`, `project-tech.md`, `project-plan.md`), idea files, or anything inside `work/active/` and `work/history/` other than the `INDEX.md` header. No git writes; files to commit go to the developer as commands in a block for their shell when `Git` is "share" or "commit all".

## 4. Doctor
Run the `team-doctor` skill and print its result line. Then one line on what is new for the developer in this version, from the changes you applied — e.g. "New: `/team-work review` and `/team-rollback`."
