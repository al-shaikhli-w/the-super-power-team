---
name: team-status
description: Shows where the team stands as a waterfall — each active ticket's steps from requirements to PR with the current step and what it waits on, then the project plan's progress and the open ideas. Read-only and fast. Use when the developer types /team-status, or asks where things stand, what the team is doing, or what is waiting on them.
argument-hint: "[ticket id]"
---

# team — status

Request: `$ARGUMENTS`

Read-only: you change no file and start no agent. Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Say so and suggest `/team-setup`; stop.

## Read
- `.claude/team/work/active/*/` — the status line of each step file (`draft`, `approved`, `done`), the Tasks table of `03-plan.md`, the verdict in `05-qa.md`, the PR number in `06-pr.md`, and `00-brief.md` → **Now**.
- `.claude/team/project/project-plan.md` — rows by status.
- The open `.claude/team/ideas/idea-v<N>.md` — rows with `new` or `question`.

A ticket id as argument: show only that ticket, plus its open questions and team notes from the brief. Nothing else is read.

## The waterfall
One block per active ticket, oldest first:

```text
ABC-123  Add login
  ✔ Requirements ─ ✔ Research ─ ✔ Plan ─ ● Build 3/5 ─ ○ QA ─ ○ PR
  waiting for: you — approve task 3
```

| Mark | Meaning |
|---|---|
| ✔ | approved or done |
| ● | the current step |
| ✘ | QA FAIL, back to build |
| ○ | not started |

- **Build** shows `done/total` tasks from `03-plan.md`.
- **QA** is ✔ only when `05-qa.md` passed and `05b-review.md` passed or does not exist; a `CHANGES` review is ✘.
- **PR** shows `#<n>` once it is open, and `merged` when it is.
- **waiting for:** `you — <the decision>`, or `<agent> — <task>`, or `blocked — <blocker>`. One line.

## Then
```text
Plan:   7 of 12 features done · next: Search recipes
Ideas:  idea-v3.md — 4 new, 1 question → /team-new-idea review
```

Nothing active: say so in one line, then the plan and ideas lines and the next `next` row as `/team-work "<feature>"`.

## Output
The blocks and the two lines, nothing else. Step names in the reply language; marks, ticket ids and file names stay as they are.
