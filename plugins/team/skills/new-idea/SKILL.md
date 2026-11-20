---
name: team-new-idea
description: Collects a new idea or wish for the project into the current `.claude/team/ideas/idea-v<N>.md`, with a few short follow-up questions and a duplicate check; with `review`, has the project manager step back and propose which open ideas go into the project plan, where, and which wait. Use when the developer types /team-new-idea, says they have a new idea, feature wish or change of direction, or asks to review the ideas against the plan.
argument-hint: "[the idea] | review"
---

# team — new idea

Request: `$ARGUMENTS`

Template: `idea-template.md` in this skill's folder. Ideas: `.claude/team/ideas/`. Plan: `.claude/team/project/project-plan.md`.

No `.claude/team/team.md`? Say so and suggest `/team-setup`; stop.

## Rules
- Speak `Reply language` from `team.md`; write the idea files in `Document language`.
- One question at a time. At most three follow-ups — an idea is captured fast, not specified. Requirements come later, in `/team-work`.
- Write the developer's meaning in clear words; add nothing they did not say.
- Ideas never change code, tickets or the tracker.
- `Dashboard: on` in `team.md`: after a row is written or a review is applied, rewrite `.claude/team/status.js` (format: `../dashboard/status-format.md` next to this skill's folder); a question to the developer ("review now or collect more", a review decision) goes into `pending`, cleared when answered.

## The current file
The open file with the highest number, `idea-v<N>.md`. None yet: create `idea-v1.md` from the template.

A file closes after a review leaves none of its rows `new` or `question`: set `Status: closed <date>`. The next idea starts `idea-v<N+1>.md`. Closed files are never edited again — they show how the direction changed.

## An idea (argument given, or none)
1. **The idea.** No argument: ask "What is the idea?"
2. **Follow-ups**, only what is still unclear, one at a time:
   - Who benefits, and what problem does it solve for them?
   - How soon does it matter — now, next, or some day?
   - Is there something it must not do or change?
3. **Duplicate check.** Compare with the open and closed idea files, `project-plan.md`, and the folders in `.claude/team/work/`. Similar? Name it in one line and ask: add anyway, merge into that one, or drop.
4. **Write** one row with status `new`, a first size guess, and details under Notes.
5. **Show** the row. Ask: **review now**, or **collect more** first. Review now → the next section.

## `review` — step back
1. Nothing `new` or `question` in the current file: say so in one line, stop.
2. `team:project-manager`, job **Step back**.
3. Show its table as it is. Ask the developer to approve, change or skip each row — one answer can cover all.
4. **Apply only the approved rows:**
   - `plan` → a new row in `project-plan.md` at the proposed position, `Source: idea-v<N> #<n>`, status `next` or `later`; add a line under "Changes"; set the idea to `planned`.
   - `later` / `drop` → set the idea's status; one line under Decision with the date.
   - `question` → stays `question`, with the question under Notes.
5. Close the file if the rule above says so. Report in two lines: what went into the plan, what waits.
