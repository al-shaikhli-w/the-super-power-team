---
name: team-design
description: The project's design picture and redesign to-do list, kept by Nour the designer. With no argument, scans the UI and writes or refreshes `.claude/team/project/design.md` — tokens, components, inconsistencies and `DES-<n>` items; `list` shows the open items; `fix DES-<n>` works one item as a ticket with a prototype; `skip DES-<n>` records a decision not to change it. Use when the developer types /team-design, asks Nour for something, or asks about the design system, redesigning components, or what design work is open.
argument-hint: "[list | fix DES-<n> | skip DES-<n> <reason>]"
---

# team — design

Request: `$ARGUMENTS`

Template: `design-template.md` in this skill's folder. File: `.claude/team/project/design.md`. Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop. Call the agent by its name from `## Team names` (Nour by default).

## No argument — scan
1. The project has no UI code yet (no components, pages, screens or styles): say a scan needs UI code, and that Nour makes a prototype for every UI ticket anyway. Stop.
2. Start `team:designer`, job **Design scan** (a rescan when `design.md` exists). Pass the template's path.
3. Show its summary: the open count by priority and the five most important items, each as `DES-<n> · <priority> · <title>`. Then the file's path.
4. Dashboard on: update `design` in `status.js` (`../dashboard/status-format.md`). Do the same after `skip` and whenever an item is ticked.
5. Offer the next step once: `/team-design fix DES-<first high item>`.

## `list`
Read-only. Print the open items, most important first, then one line: `<n> open · <n> fixed · <n> skipped`. No file yet: suggest `/team-design`.

## `fix DES-<n>`
Read the item. Start `/team-work` with it as an idea named `DES-<n> <title>` — the work folder is `des-<n>`. The item's line goes into the requirements as the problem to solve, and its change as the first acceptance criterion. The ticket always gets step 2b (a prototype). When its PR is merged, the coordinator ticks the item.

## `skip DES-<n> <reason>`
Only on the developer's own words. Add `— skipped: <reason> (<YYYY-MM-DD>)` to the item's line and leave it unticked. It no longer counts as open.

## Rules
- Only the designer writes the findings; you only add the "skipped" note and tick items after a merge.
- The designer never edits application code; a redesign always goes through `/team-work`.
