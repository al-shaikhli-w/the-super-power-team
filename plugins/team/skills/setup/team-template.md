# Team profile — <project name>

Project facts for the `team` agents. Rules live in `CLAUDE.md` (and `AGENTS.md`); this file only adds what they do not say.

Team version: <plugin version> — `/team-update` brings this project up to the installed plugin

## Developer
- Reply language: <English | Deutsch | العربية | …> — every message to the developer
- Document language: <language> — the files under `.claude/team/`; code, commits and PR titles follow the project
- Agents per ticket: <one at a time | several in parallel> — the default; `/team-work` asks per ticket
- Dashboard: <on | off> — `/team-dashboard`
- Social posts: <after merge | ask | off> — Rafi (`team:social-media`) drafts posts for every merged feature; `/team-social`
- Independent review: <after QA | ask | off> — a fresh `team:reviewer` after QA passes; `/team-work review` runs it any time
- Shell: <PowerShell | bash | zsh>
- Git: <local only | share .claude/team except work/ | commit all of .claude/team>

## Team size
Several tickets at once (`/team-work RB-12 RB-13`): the team grows and shrinks by itself, up to these limits.
- Max tickets in planning: 3
- Max developers: 3
- Max QA engineers: 3

## Worktrees
Each ticket worked next to others gets its own git worktree, so developers never touch each other's files.
- Worktree folder: <../<repo folder>-worktrees>
- Worktree setup: <the command a fresh checkout needs before the gate runs, e.g. `npm ci`, or "none">

## Project documents
- `.claude/team/project/project-info.md` — the idea, users and goals (the developer's words)
- `.claude/team/project/project-tech.md` — stack, structure, commands, risks (read from the code, or proposed)
- `.claude/team/project/project-plan.md` — the features in order
- `.claude/team/project/security.md` — the security picture and to-do list (`/team-security`)
- `.claude/team/marketing/marketing-plan.md` and `marketing/posts/` — the marketing plan and post drafts (`/team-social`)
- `.claude/team/ideas/idea-v<N>.md` — wishes not planned yet (`/team-new-idea`)

## Project
- <what it is, one line>
- Stack: <languages, frameworks, package manager>
- Users: <who uses it>
- Languages: <UI languages, or "one">

## Commands
- Full gate: `<the command CI runs>`
- Quick checks: `<lint / type check / format check>`
- Unit tests: `<command>`
- Build: `<command>`

## Tests
- <where tests live, and any list or registry that must be kept in sync>

## Tracker
- Tracker: <Linear | Jira | Notion | GitHub Issues | Other: <connector> | none>
- Where: <Linear team, Jira project key, Notion database, GitHub repository>
- Local tickets: <on | off> — the board in `.claude/team/tickets/` (`/team-ticket`): tickets written here, and tickets taken from a platform
- Ticket prefix: <PREFIX> — tickets written here look like `<PREFIX-123>`; tickets from a platform keep their own id
- Platforms are read-only. Local tickets are the team's own files: `/team-ticket` and `/team-work` keep their status.
- Today's list: issues assigned to "me" that are started or planned for the current cycle; for local tickets, everything in Do and Check, then Plan by priority.

## Repository and review
- GitHub: `<owner/repo>`, default branch `<main>`, one branch per ticket.
- Branch name: <the tracker's own branch name for the ticket, or a pattern>
- Local review: `<command, or "none">`. Review bot on PRs: `<name, or "none">`.
- Commit style: <the project's rule>

## Team names
| Agent | Name |
|---|---|
| team:social-media | Rafi |

## Custom agents
| Agent | Role | Joins at | May touch | Where |
|---|---|---|---|---|

## Models
Which model each job runs on. `inherit` = your session's model. Cheaper models for simple jobs save tokens.
| Agent | Job | Model |
|---|---|---|
| reply-writer | all | haiku |
| agent-maintainer | all | haiku |
| researcher | all | sonnet |
| qa-engineer | CI gate, local review, PR round check | sonnet |
| qa-engineer | code review | inherit |
| security-engineer | all | inherit |
| social-media | all | sonnet |
| product-manager, project-manager, developer-lead, reviewer | all | inherit |

## Product notes
- <rules about the product that the code cannot show>
