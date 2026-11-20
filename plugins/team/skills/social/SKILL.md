---
name: team-social
description: Rafi, the team's social media manager. With no argument, writes or refreshes the marketing plan in `.claude/team/marketing/marketing-plan.md`; `post <ticket>` drafts social media posts for a shipped feature; `week` drafts a round-up of the last seven days; `list` shows the drafts. Drafts only — the developer publishes. Use when the developer types /team-social, or asks for a marketing plan, social media posts, an announcement, or how to market the project.
argument-hint: "[post <ticket> | week | list]"
---

# team — social

Request: `$ARGUMENTS`

Folder: `.claude/team/marketing/` (`marketing-plan.md`, `posts/`). Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop. Create the folder when it is missing.

The agent is `team:social-media`. Its name comes from `## Team names`; none there means **Rafi**. Begin its prompt with "Your name in this team is <name>." and title its result "<name> (Social Media)".

## No argument — the marketing plan
1. `.claude/team/project/project-info.md` missing or still `draft`: say Rafi needs to know the idea and the users first, suggest `/team-setup`; stop.
2. Start `team:social-media`, job **Marketing plan**.
3. Show its result. Ask: approve, change, or stop. On approval set the plan's status to `approved`.

## `post <ticket>`
The ticket must be merged — in `.claude/team/work/history/INDEX.md` with result `merged`. Not merged: say the post waits for the merge; stop. Start `team:social-media`, job **Feature posts**, with the ticket's history folder. Show the drafts; approve, change, or stop.

## `week`
Start `team:social-media`, job **Weekly round-up**. Show the drafts; approve, change, or stop.

## `list`
Read-only. The files in `posts/` with their status (`draft`, `posted`), newest first, and the next three calendar rows from the marketing plan.

## Dashboard
`Dashboard: on` in `team.md`: after every approval here, and after Rafi's drafts after a merge, rewrite `marketing` in `status.js` (`../dashboard/status-format.md`). Set `now` before Rafi starts so the page shows the task.

## Rules
- Nobody posts. Drafts go to the developer; they publish and set `posted`.
- Posts never mention security findings, open tickets, unmerged work, internal links or names — see the agent's "Never share".
- `Git` in `team.md` is "share" or "commit all": the marketing folder is shared like the project documents; say once that unposted drafts are visible to everyone with the repository.
