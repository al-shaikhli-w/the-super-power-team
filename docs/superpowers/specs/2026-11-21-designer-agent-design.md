# Designer agent — design

Date: 2026-11-21
Status: approved in brainstorming, waiting for spec review

## Goal

Add an 11th plugin agent, `team:designer`, that:

1. scans a project's UI once and keeps a design picture with a redesign TODO list,
2. makes a clickable HTML prototype for every ticket that touches UI, before the plan,
3. checks in QA that the built UI matches the approved prototype.

The developer approves every step, as with every other agent.

## Decisions taken

| Question | Decision |
|---|---|
| What does the designer hand over? | A self-contained HTML prototype in the ticket's work folder, with Playwright screenshots |
| When does it join `/team-work`? | Only for tickets that touch UI, as a new step **2b** after Research and before Plan |
| Project scan? | Yes — `.claude/team/project/design.md` with tokens, components, inconsistencies and a `DES-<n>` TODO list, like `security.md` |
| Tools | Playwright MCP bundled with the plugin; doop MCP, frontend-design, ui-ux-pro-max opt-in; Figma only when already connected and asked for |

## New files

| File | Purpose |
|---|---|
| `plugins/team/agents/designer.md` | The agent: Job 1 scan, Job 2 prototype, Job 3 visual check |
| `plugins/team/skills/design/SKILL.md` | `/team-design` — runs the scan, or refreshes `design.md`; `/team-design <DES-n>` explains one item |
| `plugins/team/skills/design/design-template.md` | Template for `design.md` |
| `plugins/team/.mcp.json` | Starts Playwright MCP: `npx @playwright/mcp@latest` |

## Job 1 — Design scan

Runs from `/team-design`, and from `/team-setup` when the project has a UI (setup asks; "no UI" skips it).

Reads the code without changing it and writes `.claude/team/project/design.md`:

- **Tokens** — colours, fonts, sizes, spacing, radius, shadows, breakpoints, each with `file:line`. Where none exist, list the hard-coded values found most often.
- **Components** — every reusable UI component with path, variants and where it is used.
- **Inconsistencies** — duplicates and drift (e.g. five button styles, hard-coded colours next to tokens, missing focus states, broken RTL), each with evidence.
- **Redesign TODO** — `- [ ] DES-<n> — <title> (<priority>) — <files>`, highest priority first. A fixed item is ticked with `— fixed <YYYY-MM-DD> (<ticket>, PR #<n>)`, the same way `security.md` items are.

A `DES-<n>` item can be worked as a ticket: `/team-work des-<n>`.

Re-running `/team-design` updates the file: new items get new numbers, ticked items stay ticked, and items no longer found are marked `— gone <date>`, never deleted.

## Job 2 — Prototype (step 2b)

**When:** after step 2 is approved, the coordinator decides whether the ticket touches UI, from `01-requirements.md` and `02-research.md` (new or changed screens, components, styles, text a user sees). If it does not, step 2b is skipped and noted under Decisions in the brief. The developer can always force it ("design it") or skip it ("no design").

**Reads:** `00-brief.md`, `01-requirements.md`, `02-research.md`, `design.md` (when present), and the components it will reuse.

**Writes** in the work folder:

- `02b-design.md` — the components to reuse, the ones to change and why, new components, every state (empty, loading, error, long text, right-to-left, mobile), and the tokens used. It ends with Team notes for the brief.
- `02b-prototype/index.html` — one self-contained page (inline CSS and JS, no network), using the project's real tokens, clickable between states.
- `02b-prototype/desktop.png`, `02b-prototype/mobile.png` — Playwright screenshots of the prototype. If Playwright MCP is not available, the screenshots are skipped and the report says so.

**Approval:** the coordinator shows `02b-design.md` and the path to open `index.html`. Approve → step 3; change → the designer redoes it as a new dated section. The project manager plans from the approved design, and the developer-lead builds from it.

**Optional tools, when enabled in `team.md`:** frontend-design and ui-ux-pro-max guide the visual direction; doop MCP for design generation; Figma MCP only when the developer asks for Figma frames on this ticket. The agent never needs them: HTML plus Playwright is the baseline.

## Job 3 — Visual check (step 5)

Only for tickets that had step 2b. Runs next to `team:qa-engineer` and `team:security-engineer`, and its verdict is shown with theirs.

- Uses Playwright to open the built page at the URL from `team.md` (`Dev URL`, new optional field) or the URL the developer gives, takes the same screenshots, and compares them with the prototype: layout, states, tokens, RTL, mobile.
- Writes `05-design.md` with **PASS**, **FAIL** (each difference with a screenshot and `file:line` where possible) or **NOT TESTED** (no running app, no Playwright), always with the reason. Never PASS without screenshots.
- FAIL goes back to step 4 like any QA FAIL.

## Tools and setup

- **Bundled:** `plugins/team/.mcp.json` starts Playwright MCP for every user of the plugin.
- **Opt-in:** `/team-setup` asks yes/no for each of the following, shows the command, and the developer runs it. Answers are saved in `team.md` under `## Design tools`.
  - doop MCP: `claude mcp add --transport http doop https://doop.design/mcp`
  - frontend-design: `/plugin install frontend-design@claude-plugins-official`
  - ui-ux-pro-max: `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code`
  - Figma: nothing to install; used when the claude.ai Figma connector is connected.
- doop and ui-ux-pro-max are third-party. Setup says so in one line: design context and parts of the code go to them.
- **`/team-doctor`** gets a design-tools check: ✔ Playwright available; ⚠ an opted-in tool that is missing, with its command.

## Name

Default team name **Nour**, the same way Rafi is `team:social-media`'s name until changed with `/team-names`. The developer calls the agent by its name ("Nour, design RB-13"); the plugin ID `team:designer` is used only inside the skills.

## Agent rules

- Tools: `Read, Grep, Glob, Bash, Write, Edit` plus the Playwright MCP tools; `WebSearch, WebFetch` for design references.
- Writes only in the ticket's work folder and `.claude/team/project/design.md`. Never edits application code; that belongs to `team:developer-lead`.
- Same team rules as every agent: reads the shared brief first, no git writes, tracker read-only, replies in `Reply language`, step files in `Document language`.
- Never sends project, customer or personal names to an external service that the developer has not enabled.

## Changes to existing files

- `skills/work/SKILL.md` — step 2b in the step table and the flow, the UI decision, Job 3 in step 5, `05-design.md`, and `designer` in the internet rule (rule 8).
- `skills/setup/SKILL.md` and `setup/team-template.md` — the UI question, the scan, `## Design tools`, `Dev URL`.
- `skills/doctor/SKILL.md` — the design-tools check.
- `skills/dashboard/` — the designer role, the `design` section (TODO list from `design.md`), and a link to the ticket's prototype; `status-format.md` documents the new fields.
- `skills/status/SKILL.md` — shows open `DES-<n>` items.
- `skills/work/SKILL.md` `pr` step — a merged ticket that fixed `DES-<n>` items ticks them in `design.md`.
- `agents/project-manager.md` and `agents/developer-lead.md` — read `02b-design.md` and the prototype when present.
- `agents/agent-maintainer.md` — knows the new agent and files.
- `README.md` (root and plugin), `CHANGELOG.md`, `plugin.json` description ("Eleven agents"), version **0.16.0**.

## Verified (2026-11-21)

- Plugin agents ignore `mcpServers` in frontmatter (Claude Code sub-agents docs). The plugin ships Playwright in `.mcp.json`, and the designer leaves `tools` unset so it inherits every MCP tool in the session.
- Playwright MCP blocks `file://` by default. The designer serves a folder on `127.0.0.1` with `npx -y http-server`; `--allow-unrestricted-file-access` is never used.
- `install.js` (`PLUGIN_PARTS`) and `package.json` (`files`) must ship `.mcp.json`.

## Out of scope

- Generating production component code (the developer-lead does that).
- Redesigning all components in one go; `DES-<n>` items are worked one ticket at a time.
- Figma as the default output.

## Testing

- Run `/team-setup` and `/team-design` on `test-project/` and check `design.md` against the template.
- Work one UI ticket and one backend ticket through `/team-work`: 2b runs for the first and is skipped for the second.
- Step 5 with and without a running app: PASS/FAIL with screenshots, and NOT TESTED with a reason.
- `/team-doctor` with Playwright missing and with an opted-in tool missing.
- Dashboard shows the role, the DES list and the prototype link, in English and Arabic.
