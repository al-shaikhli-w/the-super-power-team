---
name: team-doctor
description: Checks quickly that the team is set up correctly in this project — profile fields, project documents, commands, git choice, GitHub CLI, tracker access, review tool and work folders — and prints one line when all is well or only the problems with their fix. Runs at the end of /team-setup. Use when the developer types /team-doctor, or when the team behaves oddly, an agent cannot read tickets, or a command it names fails.
argument-hint: "[fix]"
---

# team — doctor

Request: `$ARGUMENTS`

Fast and read-only: no builds, no tests, no installs, no internet except one `gh auth status`. Speak `Reply language` from `.claude/team/team.md` (English if there is none).

## Checks
Each check ends as ✔ (fine), ⚠ (works, but should be fixed), ✘ (the team will fail) or ? (could not run — say why, e.g. a declined permission).

| # | Check | ✘ / ⚠ when |
|---|---|---|
| 1 | `.claude/team/team.md` exists | ✘ missing → `/team-setup`, and stop here |
| 2 | Profile filled | ✘ `Reply language`, `Shell` or a command still `<…>`; ⚠ any other `<…>` |
| 3 | Project documents | ⚠ `project-info.md`, `project-tech.md` or `project-plan.md` missing, or still `draft` |
| 4 | Project rules | ⚠ project has code but no `CLAUDE.md` → `/init` |
| 5 | Commands exist | ✘ a command in `team.md` names a script missing from the manifest, or a program not on the path (`command -v` / `Get-Command`). `(planned)` commands: ⚠ until they exist |
| 6 | Repository | ⚠ not a git repository, or `team.md`'s repository or default branch differs from `git remote -v` / `origin/HEAD` |
| 7 | Git choice applied | ⚠ `git check-ignore` does not match the `Git` choice (local only: `.claude/team/team.md` ignored; share: only `.claude/team/work/` ignored; commit all: nothing ignored) |
| 8 | GitHub CLI | ⚠ `gh` missing or `gh auth status` fails → PR rounds will not work |
| 9 | Tracker | ✘ tracker is Linear, Jira, Notion or another connector and none of its read tools (get / list / search) are available in this session → connect it with `/mcp`, or set the tracker to `GitHub Issues` or `none`. `GitHub Issues` needs check 8. `Local tickets: on`: ✘ `.claude/team/tickets/` or `Ticket prefix` missing; ⚠ a ticket file without a `Status` of plan, do, check or done, or two files with the same id. `none`: ✔ |
| 10 | Review tool | ⚠ not `none` and not on the path |
| 11 | Work folders | ✘ `.claude/team/work/active/` or `history/INDEX.md` missing; ⚠ an active folder has step files without a status line |
| 12 | Ideas | ⚠ more than one open `idea-v<N>.md` |
| 13 | Dashboard | ⚠ `Dashboard: on` but `.claude/team/dashboard.html` or `status.js` missing → `/team-dashboard`; ⚠ `Dashboard: on` and `bash` not on the path → no live agent events (install Git for Windows) |
| 14 | Custom agents | ✘ a row under `## Custom agents` has no file in `.claude/agents/` or `~/.claude/agents/`, or the file's frontmatter has no `name` or `description`; ⚠ the file lacks the "Shared brief" or "Limits" section, or a `team-*.md` file is not in the table → `/team-new-agent list` |
| 15 | Team version | ⚠ `Team version` in `team.md` is missing or differs from `version` in this plugin's `.claude-plugin/plugin.json` → `/team-update` |
| 16 | Security list | ⚠ the project has code but `.claude/team/project/security.md` is missing → `/team-security`; ⚠ an item marked `high` has been open for more than 30 days (its line's date or the file's `Updated`) |
| 17 | Worktrees | ⚠ a brief names a `**Worktree:**` path that does not exist, or `git worktree list` shows a worktree under `Worktree folder` with no active ticket → give the `git worktree add` or `remove` command |
| 18 | Marketing | ⚠ `Social posts` is `after merge` or `ask` but `.claude/team/marketing/marketing-plan.md` is missing → `/team-social`; ⚠ `## Team names` has no row for `team:social-media` → `/team-names` (Rafi is the default) |
| 19 | Design | ⚠ the project has UI code but `.claude/team/project/design.md` is missing → `/team-design`; ⚠ no Playwright MCP tools in this session → prototypes and visual checks run without screenshots (restart the session; Node 18+ and `npx` must work); ⚠ a tool marked `on` under `## Design tools` is missing (doop: no `doop` MCP tools; frontend-design or ui-ux-pro-max: no such skill) → its command from `team.md`; ⚠ `Dev URL` is `<…>` in a UI project; ⚠ `## Team names` has no row for `team:designer` → `/team-names` (Nour is the default) |

## Output
All ✔:

```text
✔ Team ready — 19 checks passed.
```

Otherwise only the failing lines, ✘ first, each with its fix in a few words, then one count line:

```text
✘ 5  Full gate `pnpm run ci` — no script "ci" in package.json → name the right command
⚠ 8  gh is not signed in → gh auth login
16 passed · 1 warning · 1 problem
```

Without `fix`, end with one question: fix them now? Stop there.

## `fix`
With the argument `fix`, or after a yes: go through the ✘ and ⚠ lines one at a time. Fix only what lives in `.claude/team/` — ask the developer for the missing value and write it into `team.md`, create a missing folder or `INDEX.md` (header `| Date | Ticket | Title | PR | Result | Days | Summary |`), close a duplicate open idea file after asking which stays open. Anything else (signing in, connecting a tracker, `/init`, git) is the developer's step: give the command in a block for their shell. Then run the checks again and print the result.
