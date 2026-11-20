---
name: team-setup
description: Sets up the team in the current project — asks the reply language and how many agents to use, reads the code or interviews the developer when there is no code yet, writes the project profile and the project documents (info, tech, plan) under `.claude/team/`, and asks whether they belong in git. Use when the developer types /team-setup, or asks to onboard or install the team in a project.
---

# team — setup

Templates in this skill's folder: `team-template.md`, `project-info-template.md`, `project-tech-template.md`, `project-plan-template.md`.

Everything you create goes under `.claude/team/`. You run no git command that writes, install nothing, and change no project file outside `.claude/team/` without asking.

## Rules
- **One question at a time**, with numbered choices where they exist. The developer can always answer in their own words.
- **From step 2 on, speak only the reply language.** Write the project documents in the document language.
- **Never guess.** Unknown stays `<…>` or goes into "Open questions".
- **Show every document before saving it as approved.** Ask: approve, change (say what), or start again.

## Steps

1. **Reply language.** Ask first, in English, with each choice in its own language:

   > Which language should the team answer in?
   > 1. English  2. Deutsch  3. العربية (Arabic)  4. Other — name it

   Then: "Write the project documents in the same language?" — yes, or name another. Code, commits and PR titles always follow the project.

2. **Agents per ticket.**
   1. **One at a time** — cheaper, easy to follow (default).
   2. **Several in parallel** — faster on big tickets, uses more tokens.

   `/team-work` asks again per ticket with this as the default.

   Then the **ticket system** — where the work comes from:

   > Where do you manage tickets?
   > 1. Linear  2. Jira  3. Notion  4. GitHub Issues  5. Another tool with a connector — name it
   > 6. **Only here** — local tickets on the team's own board
   > 7. None — I name the work myself

   1–5: ask where the tickets are (Linear team, Jira project key, Notion database, GitHub repository) and note it under `## Tracker`. The team only reads it. Then: "Also keep a **local board** — Plan · Do · Check · Done on the dashboard — for tickets written here and tickets taken from <tracker>?" yes or no.
   6: `Tracker: none` and the local board on.
   Local board on: `Local tickets: on`; ask the ticket prefix for tickets written here (suggest two to four capital letters from the project name, e.g. `RB`), create `.claude/team/tickets/`, and offer to add the first tickets after setup with `/team-ticket new` — each one asks whether it is new or comes from a platform.
   Note `Tracker` and `Local tickets` in `team.md`.

   Then: "After QA passes, should a fresh reviewer — one who sees only the requirements and the diff — check the work again?" — 1. **always** (`after QA`), 2. **ask each time** (`ask`, default), 3. **never** (`off`). Note it as `Independent review` in `team.md`.

   Then: "Do you want a live dashboard in your browser? Agents appear live by themselves; each step update is one more approval prompt." — yes or no. Note it as `Dashboard` in `team.md`.

3. **Look.** Is this a git repository? Is there a `CLAUDE.md`? Does `.claude/team/` exist?
   - `.claude/team/team.md` or `.claude/team/project/` exists: show what is there and ask — keep, or write again. Never overwrite without a yes. Never touch `.claude/team/work/`.
   - Create `.claude/team/work/active/` and `.claude/team/work/history/INDEX.md` with the header `| Date | Ticket | Title | PR | Result | Days | Summary |`.

4. **Code or not?** Look for a manifest (`package.json`, `pyproject.toml`, `*.csproj`, `go.mod`, `Cargo.toml`, `pom.xml`, …) and source files. Say what you found in one line and let the developer confirm, e.g. "I see a SvelteKit app with about 240 source files — right?" Then follow **A** or **B**.

### A — the project has code

5. **No `CLAUDE.md`?** Say the agents take the project rules from it, suggest `/init`, and ask whether to continue without it.
6. **Project scan.** Start `team:researcher`, job **Project scan**. Fill `project-tech.md` from its report — every fact with its evidence.
7. **Profile facts**, from the repository only: OS and shell; commands (manifest scripts, CI workflow files, rules files); test folders; repository and default branch (`git remote -v`, `git symbolic-ref refs/remotes/origin/HEAD`); a local review tool on the path; the ticket id pattern (recent `git log` subjects).
8. **What the code cannot show** — ask, one at a time, only what is still open: the idea in two sentences, the users, the goals, what comes next, rules the code cannot show. Write `project-info.md`.
9. **Plan.** Draft `project-plan.md`: what already works goes under "Done" without tickets; what the developer named as next goes into "Features in order".

### B — no code yet

5. **Interview**, one question at a time, in the reply language. Ask a short follow-up when an answer is vague; skip a question the developer already answered.
   1. What is the idea, in one or two sentences?
   2. Who uses it, and what problem does it solve for them?
   3. What must version 1 do? (three to seven things)
   4. What is deliberately not in version 1?
   5. Technology you want or must use — or "suggest one"?
   6. Where will it run, and who maintains it?
   7. Languages, accessibility, legal or brand rules?
   8. Any deadline or budget?
6. **Write `project-info.md`** from the answers: clear, well-structured, in the developer's meaning — tighten the wording, add nothing they did not say. Unclear points go into "Open questions". Show it; approve, change, or start again.
7. **Write `project-tech.md` as a proposal** (`Source: proposal — no code yet`): stack, folder layout, test setup, commands. If the developer asked for a suggestion, start `team:researcher` for current versions and at most three options with one recommendation. Show it; approve or change.
8. **Write `project-plan.md`**: the version 1 capabilities as features in order, the first one small — usually the project skeleton with one working page or endpoint and its first test. Show it; approve or change.
   Things the developer named as "not in version 1": offer to keep them in `.claude/team/ideas/idea-v1.md` (template: `../new-idea/idea-template.md`) with status `later`.
9. **Profile facts**: commands come from the approved tech proposal, marked `(planned)` until they exist.

### Both

10. **Write `.claude/team/team.md`** from the template with every answer and fact so far. `Team version` is the `version` in this plugin's `.claude-plugin/plugin.json` (two folders up from this skill).
11. **Ask for the rest**, one at a time, only what is still `<…>`:
    - **Branch name:** the tracker's own branch name for the ticket, or `<user>/<ticket>-<slug>`, or `<user>/<feature>` — show the developer's `git config user.name`, made lower case with dashes.
    - **Full CI gate** (code only), **review tool** or `none`, **product notes**.
12. **Tracker tools.** `none`: skip. A tracker with a connector (Linear, Jira, Notion, another): check that its read tools are available in this session. Not connected: say that `team:product-manager`, `team:project-manager` and `team:reply-writer` cannot read tickets until it is connected (`/mcp`).
13. **Git.** Ask, and note the answer under `Git` in `team.md`:
    1. **Local only** — add `.claude/team/` to `.git/info/exclude` (local, never committed).
    2. **Share the profile and project documents, keep work local** (recommended for teams) — add `.claude/team/work/` to `.git/info/exclude`.
    3. **Commit all of `.claude/team/`** — exclude nothing.

    No git repository yet: note the choice and give the commands for later. Write only the exclude lines; never stage or commit. For 2 and 3, give the `git add` and `git commit` commands in a block for the developer's shell.
14. **Dashboard** `on`: run the `team-dashboard` skill.
15. **Doctor.** Run the `team-doctor` skill. Any ✘ or ⚠: offer to fix them now, one at a time (its `fix` part).
16. **Report**, short, in the reply language: files written, the doctor's result line, and the next command — `/team-work`, or for a new project `/team-work "<first feature from the plan>"`. New wishes any time: `/team-new-idea`; personal names for the agents: `/team-names`.
