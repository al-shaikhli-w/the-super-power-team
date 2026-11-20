---
name: team-rollback
description: Plans and prepares a safe reversal of a shipped ticket — finds its merged commit from the archive and the PR, checks what changed since and what depends on it, and after approval applies the reverse change in the working tree on a new branch, then runs QA, the independent review and the normal PR hand-over. Never reverts, commits or pushes with git itself, and keeps the ticket's history. Use when the developer types /team-rollback, or asks to undo, revert or remove a finished ticket.
argument-hint: "<ticket id> | <PR number> | <commit>"
---

# team — rollback

Request: `$ARGUMENTS`

Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop. No argument: show the last ten rows of `.claude/team/work/history/INDEX.md` and ask which one; stop.

Every rule of `/team-work` holds here: one step, then stop; save before asking; no git writes by anyone; tracker and GitHub read-only; no "passed" without output; dashboard updates when it is on.

Work folder: `.claude/team/work/active/rollback-<ticket>/`. It exists: continue from the first step that is not approved.

## 1. Find what shipped
Read only.
1. The ticket's line in `history/INDEX.md` and its folder `work/history/<date>-<ticket>/` (`06-pr.md` has the PR number).
2. With a PR number: `gh pr view <n> --json number,title,state,mergeCommit,mergedAt,baseRefName,files`. Not merged: say so — there is nothing to roll back; a closed PR shipped nothing. Stop.
3. Without `gh` or a PR: `git log --oneline -i --grep "<ticket>" origin/<default branch>`, and show what you found.
4. The change to reverse is one range, `<base> <tip>`. Squash merge or merge commit: `<sha>^1 <sha>`. Rebase merge: `<first commit>^ <last commit>` of the PR's commits — list them.

Show the commit(s), date, title and changed files, and ask the developer to confirm it is the right change. Several candidates: numbered choice. Save `01-requirements.md`:
- Goal: "Remove <ticket> <title> — the app behaves as before it shipped; everything shipped since keeps working."
- Acceptance criteria: the ticket's own criteria from its archived `01-requirements.md`, each turned into "no longer happens", plus "every check of the full gate passes".
- The commit(s), the PR, and why the developer wants it rolled back (ask in one question).

Status `approved` after the developer's yes. Create `00-brief.md` as `/team-work` does, with the commit(s) under Constraints.

## 2. Risk check
`team:researcher`, feasibility job with this brief: read `01-requirements.md`, then check, read only:
- **Later changes to the same files:** `git log --oneline <tip>..origin/<default branch> -- <files>` — each one: does it build on this ticket?
- **Dependents:** other archived tickets, open work folders and `project-plan.md` rows that use what this ticket added.
- **Data and outside effects:** migrations, stored data, config, public URLs or APIs, translations, feature flags. A reverse patch does not undo data that already exists.
- **Dry run:** the reverse patch against the current checkout — `git diff <base> <tip> | git apply -R --check`. Report clean, or the files that conflict. It writes nothing.

Verdict: **Safe to roll back**, **Roll back with conditions** (each condition), or **Do not roll back** (why, and the safer option — e.g. a new ticket that turns the feature off). Save `02-research.md`. Approval; "Do not roll back" stops here unless the developer overrides it in their own words.

## 3. Plan
`team:project-manager` writes `03-plan.md`:
- **Branch:** `revert/<ticket>` — or the project's `Branch name` pattern with `revert-` before the slug. It is named in the plan, so `/team-work` uses it as it is.
- **Task 1 — apply the reverse change** in the working tree only, with the exact commands: `git diff <base> <tip> | git apply -R --check`, then `git diff <base> <tip> | git apply -R --reject`. Never `git revert`, `git reset`, `git checkout --` or `--index`/`--3way`: they write to git. Each `*.rej` file is a conflict the developer-lead resolves by hand and then deletes.
- **One task per condition** from step 2 (data clean-up, a later change to keep, a translation to remove), and one for tests: the ticket's tests go with it; a test that proves the old behaviour is back is added.
- **Project plan:** the ticket's row in `project-plan.md` moves from "Done" back to "Features in order" as `later`, or out — ask the developer which.

Approval. Status `approved`.

## 4. Build, QA, review, PR
Continue with `/team-work rollback-<ticket>` from step 4: the branch commands, then the tasks, QA, the independent review (always run for a rollback, whatever `Independent review` says), and the hand-over. The commit message follows the project's style with the word revert, e.g. `revert: <title> (<ticket>)`, and the PR body names the original PR.

## 5. Archive
When the rollback PR is merged, `/team-work pr` archives it as usual, with result `rolled back`. Also add one line at the top of the original ticket's archived `06-pr.md`: `Rolled back on <date> — PR #<n>`. Nothing else in the original history changes; it is never deleted.
