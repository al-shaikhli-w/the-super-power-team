---
name: team-security
description: The project's security to-do list. With no argument, runs the security engineer's scan and writes or refreshes `.claude/team/project/security.md`; `list` shows the open items; `fix SEC-<n>` works one item as a ticket; `accept SEC-<n>` records an accepted risk. Use when the developer types /team-security, or asks how secure the project is, for a security check, or what security work is open.
argument-hint: "[list | fix SEC-<n> | accept SEC-<n> <reason>]"
---

# team — security

Request: `$ARGUMENTS`

Template: `security-template.md` in this skill's folder. File: `.claude/team/project/security.md`. Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop.

## No argument — scan
1. The project has no code yet: say a scan needs code, and that the security engineer joins every ticket anyway. Stop.
2. Start `team:security-engineer`, job **Security scan** (a rescan when `security.md` exists). Pass the template's path.
3. Show its summary: the open count by severity and the five most dangerous items, each as `SEC-<n> · <severity> · <title>`. Then the file's path, so the developer can open the whole list.
4. Dashboard on: update `security` in `status.js` — counts and items (`../dashboard/status-format.md`). Do the same after `accept` and whenever an item is ticked.
5. Offer the next step once: `/team-security fix SEC-<first high item>`.

## `list`
Read-only. Print the open items, most dangerous first, then one line: `<n> open · <n> fixed · <n> accepted`. No file yet: suggest `/team-security`.

## `fix SEC-<n>`
Read the item. Start `/team-work` with it as an idea named `SEC-<n> <title>` — the work folder is `sec-<n>`. The item's line goes into the requirements as the problem to solve, and its fix as the first acceptance criterion. When the ticket's PR is merged, the coordinator ticks the item.

## `accept SEC-<n> <reason>`
Only on the developer's own words. Add `— accepted risk: <reason> (<YYYY-MM-DD>)` to the item's line and leave it unticked. It no longer counts as open.

## Rules
- Only the security engineer writes the findings; you only add the "accepted risk" note and tick items after a merge.
- Never put a secret's value in a message, the file or the dashboard.
- `Git` in `team.md` is "share" or "commit all": remind once that `security.md` lists weaknesses, and offer to add `.claude/team/project/security.md` to `.git/info/exclude` if the repository is public.
