---
name: team-names
description: Gives the team's agents personal names — for example the project manager "Maya" and the developer lead "Omar" — so the developer can address them by name ("Maya, plan RB-12") and the dashboard and reports show them. Without arguments, shows the names and offers to set them; with an agent and a name, sets one; with `reset`, removes them. Use when the developer types /team-names, or asks to name, rename or call an agent something.
argument-hint: "[agent] [name] | reset"
---

# team — names

Request: `$ARGUMENTS`

Speak `Reply language` from `.claude/team/team.md`. No `team.md`? Suggest `/team-setup`; stop.

A name is a nickname for an agent; the agent itself (`team:project-manager`, `team-designer`) stays the same. Names live in `team.md`:

```markdown
## Team names
| Agent | Name |
|---|---|
| team:project-manager | Maya |
| team:developer-lead | Omar |
```

## Rules
- One name per agent, and no two agents with the same name. Pool roles — `developer-lead`, `qa-engineer`, `security-engineer` — may have several names, comma-separated, one per member when several tickets run at once (`Omar, Sami, Lina`). A name is a single word or two, letters only — no `:`, `/`, quotes or brackets.
- Any agent can have one: the ten plugin agents (Rafi is `team:social-media`'s name until you change it) and every custom agent in `## Custom agents`.
- Accept the role in any form: `project-manager`, `project manager`, `team:project-manager`, the role in the reply language, or its current name.

## No argument
Show a table — agent, role in the reply language, name or "—". Ask, one at a time, whether to name each one still without a name; the developer can answer with a name, "skip", or "done".

## `<agent> <name>`
Set or change that agent's name. Show the updated row.

## `reset`
After a yes, remove the `## Team names` section.

## After every change
- Write `team.md`.
- Dashboard on: write the names into `names` in `status.js`, keyed by role without the prefix (`"project-manager": "Maya"`).
- Say in one line how to use them: "Maya, plan RB-12" or "ask Omar to fix the failing test".
