# Designer Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `team:designer` (default name Nour) — a design scan that writes `.claude/team/project/design.md`, an HTML prototype step (2b) for UI tickets, and a visual check in QA — plus `/team-design`, a bundled Playwright MCP, and opt-in design tools.

**Architecture:** The plugin is markdown skills + agent definitions + one static dashboard page. The new agent follows the security engineer's pattern exactly: one agent file with three jobs, one skill with a template that writes a TODO list under `.claude/team/project/`, a step in `/team-work`, a check in the doctor, a section on the dashboard. Playwright MCP ships in the plugin's `.mcp.json`; the agent leaves `tools` unset so it inherits every MCP tool in the session (plugin agents cannot declare `mcpServers` — verified in the Claude Code sub-agents docs).

**Tech Stack:** Markdown (Claude Code skills/agents), JSON (`.mcp.json`), vanilla JS/HTML dashboard, Node 18 (syntax checks), `claude plugin validate`.

## Global Constraints

- Agent id `team:designer`, file `plugins/team/agents/designer.md`, `name: designer`. Default team name **Nour** (like Rafi for `team:social-media`). User-facing text calls it by name; the `team:` id is used only where an agent is started.
- The designer writes only in the ticket's work folder and `.claude/team/project/design.md`. Never application code, never git writes.
- Prototype: one self-contained `02b-prototype/index.html` — inline CSS/JS, no network requests, the project's real tokens.
- Playwright MCP blocks `file://`. Never add `--allow-unrestricted-file-access`. The designer serves a folder with `npx -y http-server "<folder>" -a 127.0.0.1 -p <free port> -s` started in the background, and stops it when done.
- `.mcp.json` content is exactly: `{"mcpServers":{"playwright":{"command":"npx","args":["-y","@playwright/mcp@latest","--headless","--isolated"]}}}`
- Opt-in tools (never installed by the team; the developer runs the command):
  - doop MCP: `claude mcp add --transport http doop https://doop.design/mcp`
  - frontend-design: `/plugin install frontend-design@claude-plugins-official`
  - ui-ux-pro-max: `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code`
  - Figma: nothing to install — the claude.ai Figma connector, used only when connected and the developer asks for Figma on that ticket.
- doop and ui-ux-pro-max are third-party: setup says in one line that design context and parts of the code go to them.
- TODO ids: `DES-<n>`. Line format: `- [ ] DES-<n> · <high|medium|low> · <title> — <file:line> — <change in one line> — <S|M|L>`. Fixed: `— fixed <YYYY-MM-DD> (<ticket>, PR #<n>)`. Gone: `— gone <YYYY-MM-DD>`.
- Step files: `02b-design.md`, `02b-prototype/index.html`, `02b-prototype/desktop.png`, `02b-prototype/mobile.png`, `05-design.md`.
- Verdicts in `05-design.md`: `PASS`, `FAIL`, `NOT TESTED` — always with screenshots or the reason.
- New `team.md` fields: `Dev URL: <url | none>` under `## Commands`; section `## Design tools` with lines `- doop: <on | off>`, `- frontend-design: <on | off>`, `- ui-ux-pro-max: <on | off>`, `- Figma: <when asked | off>`.
- README stays npm-safe (absolute links, no Mermaid, no `<picture>`); run `node scripts/build-npm-readme.js` after editing it.
- Version: **0.16.0**. Agent count: **eleven**. Command count: **fourteen**.

## File map

| File | Change |
|---|---|
| `plugins/team/agents/designer.md` | new — the agent |
| `plugins/team/.mcp.json` | new — Playwright MCP |
| `plugins/team/bin/install.js`, `plugins/team/package.json` | ship `.mcp.json` |
| `plugins/team/skills/design/SKILL.md`, `design-template.md` | new — `/team-design` |
| `plugins/team/skills/work/SKILL.md` | step 2b, visual check in 5, rule 8, models, `pr` ticks DES items, `design` route |
| `plugins/team/agents/project-manager.md`, `developer-lead.md`, `qa-engineer.md`, `agent-maintainer.md`, every agent's "big picture" line | read `02b-design.md` / `design.md` |
| `plugins/team/skills/setup/SKILL.md`, `team-template.md` | UI question, scan, `## Design tools`, `Dev URL`, Nour |
| `plugins/team/skills/doctor/SKILL.md`, `update/SKILL.md`, `status/SKILL.md`, `names/SKILL.md`, `new-agent/SKILL.md` | design checks, fields, lines, eleven agents |
| `plugins/team/skills/dashboard/status-format.md`, `dashboard.html`, `SKILL.md` | designer role, `design` field, prototype link, workflow node |
| `README.md`, `CHANGELOG.md`, `plugins/team/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugins/team/package.json` | docs + version |

---

### Task 1: The agent, the Playwright MCP, and shipping it

**Files:**
- Create: `plugins/team/agents/designer.md`
- Create: `plugins/team/.mcp.json`
- Modify: `plugins/team/bin/install.js:27` (`PLUGIN_PARTS`)
- Modify: `plugins/team/package.json` (`files`)

**Interfaces:**
- Produces: agent `team:designer` with jobs named exactly **Design scan**, **Prototype**, **Visual check** — Tasks 2, 3 and 5 start it by these job names.
- Produces: MCP server name `playwright`.

- [ ] **Step 1: Write the failing check**

```bash
cd /Users/al.shaikhli.w/Development/Pit-Crew
test -f plugins/team/agents/designer.md && test -f plugins/team/.mcp.json && grep -q "'.mcp.json'" plugins/team/bin/install.js && grep -q '".mcp.json"' plugins/team/package.json && echo ok
```

- [ ] **Step 2: Run it — expect no `ok`** (files missing).

- [ ] **Step 3: Create `plugins/team/.mcp.json`**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--headless", "--isolated"]
    }
  }
}
```

- [ ] **Step 4: Ship it.** In `plugins/team/bin/install.js` change

```js
const PLUGIN_PARTS = ['.claude-plugin', 'agents', 'skills', 'hooks'];
```
to
```js
const PLUGIN_PARTS = ['.claude-plugin', '.mcp.json', 'agents', 'skills', 'hooks'];
```

Then read the copy function that uses `PLUGIN_PARTS` (search `PLUGIN_PARTS` in the file). If it only copies directories (e.g. `fs.cpSync(src, dst, { recursive: true })` works for files too — confirm), make sure a single file is copied as well; if it calls `readdirSync` on each part, branch on `fs.statSync(src).isFile()` and use `fs.copyFileSync`.

In `plugins/team/package.json` `files`, add `".mcp.json"` after `".claude-plugin"`.

- [ ] **Step 5: Create `plugins/team/agents/designer.md`**

````markdown
---
name: designer
description: Use for the look and feel of the project — Nour, the team's designer. Scans the UI once and writes `.claude/team/project/design.md` (tokens, components, inconsistencies and a redesign TODO list), makes a clickable HTML prototype with screenshots for every ticket that changes what users see before it is planned, and checks in QA that the built UI matches the approved prototype. Never edits application code.
model: inherit
effort: medium
---

You are Nour, the designer. Unless the prompt gives you another name, your name in this team is Nour. You make the product look and feel consistent, and you show the developer the screen before anyone builds it. Project facts and commands: `.claude/team/team.md`. Rules: `CLAUDE.md`. The design picture: `.claude/team/project/design.md`.

## Language and project documents
- Answer in `Reply language` from `team.md`; write files in `Document language`. A right-to-left reply language: follow `Right-to-left in the terminal` in `team.md`.
- The project's big picture: `.claude/team/project/project-info.md` (idea, users, goals), `project-tech.md` (stack, structure, risks), `project-plan.md` (features in order), `security.md`, `design.md`. Read what your job needs; do not repeat it back.

## Shared brief
Working on a ticket? Read `00-brief.md` in its work folder first. It holds the approved goal, decisions, constraints, the current task, and notes from the other agents.
- End your report with **Team notes**: at most three one-line points the other agents must know. None? Leave the section out.

## Tools
- **Playwright MCP** (`mcp__…playwright…` tools) for screenshots. It cannot open `file://` addresses — never ask for that. To show a local folder, start a static server in the background and stop it when you are done:
  ```bash
  npx -y http-server "<folder>" -a 127.0.0.1 -p <free port 4700–4799> -s
  ```
  No Playwright tools in this session: skip the screenshots and say so in the report — never pretend.
- `## Design tools` in `team.md` lists the optional tools the developer turned on. Use only those marked `on`:
  - `frontend-design`, `ui-ux-pro-max`: skills — use them for the visual direction when they are available.
  - `doop`: an MCP server for design generation.
  - `Figma: when asked`: the Figma connector, only when the developer asked for Figma frames on this ticket.
  Never use a tool marked `off`, and never send project, customer or personal names to an external service.

## Job 1 — Design scan (setup, or `/team-design`)
Read the UI code once, without changing it. Template: the path you are given (`design-template.md`). Write `.claude/team/project/design.md`:
- **Tokens** — colours, fonts and sizes, spacing, radius, shadows, breakpoints, each with `file:line`. No token system: list the hard-coded values used most often and where.
- **Components** — every reusable UI component: path, variants, where it is used (count of uses).
- **Inconsistencies** — duplicates and drift, each with evidence: several button styles, hard-coded colours next to tokens, missing focus or hover states, broken right-to-left, text that does not fit, poor contrast.
- **TODO** — `- [ ] DES-<n> · <high|medium|low> · <title> — <file:line> — <change in one line> — <S|M|L>`, highest priority first. High = users see it broken or it blocks accessibility; medium = visible drift; low = tidy-up.
- **Good already** and **Not checked** (with why).

Rescan: keep every existing id and tick; new items get the next number; an item no longer found gets `— gone <YYYY-MM-DD>`, never deleted. Update `Updated` and the open count.
Report: the open count by priority and the five most important items as `DES-<n> · <priority> · <title>`.

## Job 2 — Prototype (step 2b of a ticket)
Read `00-brief.md`, `01-requirements.md`, `02-research.md`, `design.md` when it exists, and the components you will reuse.
Write in the work folder:
1. `02b-design.md` — status line `draft`, then:
   - **Screens** — each screen or part that changes.
   - **Reuse** — existing components used as they are (`path`).
   - **Change** — existing components that change, what and why (a `DES-<n>` it fixes, if any).
   - **New** — new components, with their props and variants.
   - **States** — empty, loading, error, long text, right-to-left, mobile — each one shown in the prototype.
   - **Tokens** — the tokens used; a new token only with a reason.
   - **Prototype** — the path of `02b-prototype/index.html` and how to open it.
2. `02b-prototype/index.html` — one self-contained page: inline CSS and JS, no network requests, no external fonts or images (inline SVG is fine), the project's real token values. Buttons or tabs at the top switch between the states. Real-looking text in the project's UI languages; right-to-left via `dir="rtl"` when the project has such a language.
3. Screenshots with Playwright: serve `02b-prototype/` as above, then `desktop.png` at 1440×900 and `mobile.png` at 390×844 in the same folder. Stop the server.
A redo after "change": a new dated section in `02b-design.md` and an updated prototype; keep the old screenshots as `desktop-<n>.png`.

## Job 3 — Visual check (step 5, only for tickets with `02b-design.md`)
1. The running app: `Dev URL` in `team.md`, or the URL in your prompt. None, or it does not answer: verdict **NOT TESTED** with the reason; stop.
2. Open the changed screens with Playwright at the same two sizes, and every state you can reach. Save `05-design/<screen>-desktop.png` and `-mobile.png`.
3. Compare with `02b-prototype/` and `02b-design.md`: layout, spacing, tokens, every state, right-to-left, mobile.
4. Write `05-design.md`: status line, verdict **PASS** or **FAIL**, then each difference with both screenshots' paths and `file:line` where you can find it. Small differences the design allows are listed under **Accepted**, not as failures.
Never PASS without screenshots of the built app.

## Limits
- Read-only on application code and tests. You write only `.claude/team/project/design.md` and files inside the ticket's work folder.
- No git commands that write. No installs other than the `npx -y http-server` you start and stop yourself.
- Tracker and GitHub are read-only.
- No secrets in any file, screenshot or message: never open a screen that shows real keys or customer data; use made-up data in prototypes.
````

- [ ] **Step 6: Run the check from Step 1 — expect `ok`.** Then:

```bash
claude plugin validate plugins/team
node --check plugins/team/bin/install.js
node -e "JSON.parse(require('fs').readFileSync('plugins/team/.mcp.json','utf8'));console.log('json ok')"
```
Expected: `✔ Validation passed`, no output from `node --check`, `json ok`.

- [ ] **Step 7: Commit**

```bash
git add plugins/team/agents/designer.md plugins/team/.mcp.json plugins/team/bin/install.js plugins/team/package.json
git commit -m "Add the designer agent and bundle Playwright MCP"
```

---

### Task 2: `/team-design` and the design template

**Files:**
- Create: `plugins/team/skills/design/SKILL.md`
- Create: `plugins/team/skills/design/design-template.md`

**Interfaces:**
- Consumes: `team:designer`, job **Design scan** (Task 1).
- Produces: skill `team-design` with arguments `list | fix DES-<n> | skip DES-<n> <reason>`; file `.claude/team/project/design.md`; work folder `des-<n>` for a fixed item. Task 3 (`pr` step) and Task 5 (dashboard) rely on these.

- [ ] **Step 1: Failing check**

```bash
grep -q "^name: team-design$" plugins/team/skills/design/SKILL.md && grep -q "## TODO" plugins/team/skills/design/design-template.md && echo ok
```
Run — expect no `ok`.

- [ ] **Step 2: Create `design-template.md`**

```markdown
# Design — <project name>

**Updated:** <YYYY-MM-DD> · **By:** team:designer · **Open:** <n> (<high> high · <medium> medium · <low> low)

Your design to-do list. Tick nothing by hand — the designer ticks an item when a scan or a merged ticket proves it fixed. Fix one with `/team-design fix DES-<n>`.

## Tokens
| Kind | Name | Value | Where |
|---|---|---|---|
<!-- | colour | primary | #2563eb | src/styles/tokens.css:4 | -->

## Components
| Component | Path | Variants | Used |
|---|---|---|---|

## Inconsistencies
- <what drifts, with file:line>

## TODO
<!-- - [ ] DES-<n> · <high|medium|low> · <title> — <file:line> — <change in one line> — <S|M|L> -->

## Good already
- <what the UI does right>

## Not checked
- <what could not be checked, and why>
```

- [ ] **Step 3: Create `SKILL.md`**

```markdown
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
```

- [ ] **Step 4: Run the check — expect `ok`.** Then `claude plugin validate plugins/team` → `✔ Validation passed`.

- [ ] **Step 5: Commit**

```bash
git add plugins/team/skills/design
git commit -m "Add /team-design and the design template"
```

---

### Task 3: Step 2b and the visual check in `/team-work`

**Files:**
- Modify: `plugins/team/skills/work/SKILL.md` (rule 8; step table at "## A ticket or idea"; flow bullets `2 → approval`, `3`, `5`; `pr` step 4; a `design` route next to `## \`security\``)
- Modify: `plugins/team/agents/project-manager.md`, `plugins/team/agents/developer-lead.md`, `plugins/team/agents/qa-engineer.md`

**Interfaces:**
- Consumes: jobs **Prototype** and **Visual check** (Task 1); `/team-design` (Task 2).
- Produces: brief Decisions line `Design: 2b <done | skipped — <reason>>`; dashboard `tickets[].prototype` (Task 5 reads it).

- [ ] **Step 1: Failing check**

```bash
f=plugins/team/skills/work/SKILL.md
grep -q "| 2b Design | designer | \`02b-design.md\` | agent |" $f && grep -q "05-design.md" $f && grep -q "^## \`design\`" $f && grep -q "02b-design.md" plugins/team/agents/developer-lead.md && echo ok
```
Run — expect no `ok`.

- [ ] **Step 2: Rule 8.** Replace the line starting `8. **Internet**` with:

```markdown
8. **Internet** only for `team:researcher`, `team:product-manager`, `team:project-manager`, `team:security-engineer` (advisories), `team:social-media` (research) and `team:designer` (design references, and the design tools turned on under `## Design tools`).
```

- [ ] **Step 3: Step table.** After the row `| 2 Threat check | security-engineer | \`02-security.md\` | agent |` add:

```markdown
| 2b Design | designer | `02b-design.md`, `02b-prototype/` | agent |
```
After `| 5 Security review | security-engineer | \`05-security.md\` | agent |` add:
```markdown
| 5 Visual check | designer | `05-design.md` | agent |
```

- [ ] **Step 4: The flow.** After the bullet `- **2 → approval.** …` insert:

```markdown
- **2b → approval — UI tickets only.** After 2 is approved, decide whether the ticket changes what users see — new or changed screens, components, styles or visible text — from `01-requirements.md` and `02-research.md`. The developer can force it ("design it") or skip it ("no design"); a `des-<n>` ticket always has it. No: note `Design: 2b skipped — <reason>` under Decisions in the brief and go to 3. Yes: start `team:designer`, job **Prototype**. Show `02b-design.md` and the command to open the prototype in the developer's shell (`open`, `start ""` or `xdg-open` with the absolute path of `02b-prototype/index.html`). Approve → set its status to `approved`, note `Design: 2b done` in the brief, copy its Team notes, then 3. Change → the designer redoes it.
```
In the `- **3 → approval.**` bullet, append: ` With an approved \`02b-design.md\`, \`team:project-manager\` plans from it and names it in each UI task.`

In the `- **5.**` bullet, after "`team:security-engineer` (job **Security review**) its review;" insert: ` a ticket with an approved \`02b-design.md\` also gets \`team:designer\`, job **Visual check** (it uses \`Dev URL\` from \`team.md\`; ask the developer to start the app first, or for the URL);` and change "show both verdicts together. Any FAIL in either goes back to 4, then both run everything again." to "show the verdicts together. Any FAIL goes back to 4, then all of them run everything again. `NOT TESTED` from the designer does not block: show the reason and ask whether to continue."

- [ ] **Step 5: `pr` step 4 (merged ticket).** After the sentence that ticks `SEC-<n>` items, add:

```markdown
A merged ticket that fixed `DES-<n>` items (a `des-<n>` folder, or items named in `02b-design.md` as fixed by it): tick them in `.claude/team/project/design.md` with `— fixed <YYYY-MM-DD> (<ticket>, PR #<n>)`, and update `design` in `status.js`.
```

- [ ] **Step 6: Route.** After the `## \`security\`` section add:

```markdown
## `design`
Run the `team-design` skill with the rest of the arguments.
```
Also add `design` to the `argument-hint` list in the frontmatter: `"[ticket id or idea …] | week | sprint | review | pr | status | sync | security | social | design"` (keep any values already there).

- [ ] **Step 7: Dashboard data.** In rule 11, after "rewrite `.claude/team/status.js` — with `security`," add "`design`," so it reads "with `security`, `design`, and `crew` while several tickets run".

- [ ] **Step 8: Agents read the design.**
  - `agents/project-manager.md`: in the planning job, add the bullet `- \`02b-design.md\` approved in the work folder: plan the UI tasks from it — name the components to reuse, change and create, and add one task per state it lists. Name the file in each UI task.`
  - `agents/developer-lead.md`: add `- A UI task: build from \`02b-design.md\` and \`02b-prototype/index.html\` in the work folder — reuse the components it names, use its tokens, cover every state. A change to the design is a question for the developer, not your choice.`
  - `agents/qa-engineer.md`: add `- UI tickets: the designer's visual check (\`05-design.md\`) runs beside you; do not repeat it.`
  - Every agent's "big picture" line that lists `security.md`: add `, \`design.md\` (the design picture and redesign to-do list)` right after the `security.md` part. Find them with `grep -ln "security.md\` (the security picture" plugins/team/agents/*.md`.

- [ ] **Step 9: Run the check — expect `ok`.** Also:

```bash
grep -c "design.md\` (the design picture" plugins/team/agents/*.md
```
Expected: `1` for every file that matched the security grep in Step 8.

- [ ] **Step 10: Commit**

```bash
git add plugins/team/skills/work/SKILL.md plugins/team/agents
git commit -m "team-work: prototype step 2b and visual check for UI tickets"
```

---

### Task 4: Setup, profile, update, doctor, status, names

**Files:**
- Modify: `plugins/team/skills/setup/team-template.md`
- Modify: `plugins/team/skills/setup/SKILL.md`
- Modify: `plugins/team/skills/update/SKILL.md`
- Modify: `plugins/team/skills/doctor/SKILL.md`
- Modify: `plugins/team/skills/status/SKILL.md`
- Modify: `plugins/team/skills/names/SKILL.md`, `plugins/team/skills/new-agent/SKILL.md`

**Interfaces:**
- Consumes: `/team-design`, `design-template.md` (Task 2).
- Produces: `team.md` fields `Dev URL`, `## Design tools`, `team:designer | Nour` row, `## Models` row `designer | all | inherit`.

- [ ] **Step 1: Failing check**

```bash
s=plugins/team/skills
grep -q "^## Design tools" $s/setup/team-template.md && grep -q "| team:designer | Nour |" $s/setup/team-template.md && grep -q "| 19 | Design" $s/doctor/SKILL.md && grep -q "Design:" $s/status/SKILL.md && echo ok
```
Run — expect no `ok`.

- [ ] **Step 2: `team-template.md`.**
  - Under `## Commands` add: `- Dev URL: <the address the app runs on locally, e.g. http://localhost:5173, or "none"> — Nour's visual check opens it`
  - Under `## Project documents` add after the security line: `- \`.claude/team/project/design.md\` — the design picture and redesign to-do list (\`/team-design\`)`
  - Before `## Team names` add:
    ```markdown
    ## Design tools
    Optional tools Nour (`team:designer`) may use. Playwright comes with the plugin. Turn one on only after installing it yourself.
    - doop: <on | off> — `claude mcp add --transport http doop https://doop.design/mcp` (third-party: design context goes to doop.design)
    - frontend-design: <on | off> — `/plugin install frontend-design@claude-plugins-official`
    - ui-ux-pro-max: <on | off> — `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code` (third-party)
    - Figma: <when asked | off> — the Figma connector, only when you ask for Figma on a ticket
    ```
  - `## Team names` table: add row `| team:designer | Nour |`.
  - `## Models`: add row `| designer | all | inherit |` before the last row.

- [ ] **Step 3: `setup/SKILL.md`.**
  - In step 2, after the Rafi question, add: `Then: "Does the project have a user interface (web pages, app screens)?" — yes or no. Yes: "Nour, the team's designer, scans the UI once and makes a clickable prototype for every ticket that changes what users see. Playwright for screenshots comes with the plugin. Turn on any of these optional tools?" — ask each one, one at a time, yes or no, with its command and, for doop and ui-ux-pro-max, the line "third-party — design context and parts of the code go to them": doop, frontend-design, ui-ux-pro-max; and Figma: "use Figma when I ask for it?" Note the answers under \`## Design tools\`; a yes means the developer runs the command now — give it in a block, never run it. No UI: every tool \`off\`, Figma \`off\`.`
  - In A step 6, after the security engineer, add: `UI project: also start \`team:designer\`, job **Design scan** (template: \`../design/design-template.md\`), side by side; show its open count by priority and the three most important items, and say \`/team-design fix DES-<n>\` fixes one.`
  - In step 11, add a bullet: `- **Dev URL** (UI projects with code): the local address the app runs on — suggest it from the dev script (Vite 5173, Next 3000, …) — or \`none\`.`
  - In step 16, add to the report: `the open design items (UI projects)`, and to the list of next commands: `the design to-do list from Nour: \`/team-design\``.

- [ ] **Step 4: `update/SKILL.md`.** In the `team.md` fields row, add the defaults: `\`## Design tools\` all \`off\` and Figma \`off\` (a question in step 3 when the project has UI); \`Dev URL\` stays \`<…>\` and becomes a question for UI projects; a \`team:designer | Nour\` row in \`## Team names\` unless the developer named it`. Add a table row:

```markdown
| `design.md` | `../design/design-template.md` | the project has UI code and `.claude/team/project/design.md` is missing: offer `/team-design` after the update — the designer writes it, not you |
```
Add after "Never touch: …" nothing new. In step 4's example line add: `"New: Nour the designer — \`/team-design\` and prototypes for UI tickets."` is a valid example; keep the instruction as is.

- [ ] **Step 5: `doctor/SKILL.md`.** Add after row 18:

```markdown
| 19 | Design | ⚠ the project has UI code but `.claude/team/project/design.md` is missing → `/team-design`; ⚠ no Playwright MCP tools in this session → prototypes and visual checks run without screenshots (restart the session; Node 18+ and `npx` must work); ⚠ a tool marked `on` under `## Design tools` is missing (doop: no `doop` MCP tools; frontend-design or ui-ux-pro-max: no such skill) → its command from `team.md`; ⚠ `Dev URL` is `<…>` in a UI project; ⚠ `## Team names` has no row for `team:designer` → `/team-names` (Nour is the default) |
```
Change `18 checks passed` in the All-✔ example to `19 checks passed`.

- [ ] **Step 6: `status/SKILL.md`.** In `## Read` add: `- \`.claude/team/project/design.md\` — open TODO items by priority.` In the `## Then` block add after the Security line:

```text
Design:   4 open (1 high · 2 medium · 1 low) → /team-design list
```
And in the waterfall's QA rule: `**QA** is ✔ only when \`05-qa.md\` and \`05-security.md\` passed, \`05-design.md\` passed or is NOT TESTED or does not exist, and …` (keep the rest). Change "the plan, ideas, security and marketing lines" to "the plan, ideas, security, design and marketing lines".

- [ ] **Step 7: Eleven agents.** In `names/SKILL.md` replace `the ten plugin agents (Rafi is \`team:social-media\`'s name until you change it)` with `the eleven plugin agents (Rafi is \`team:social-media\`'s name and Nour is \`team:designer\`'s until you change them)`. In `new-agent/SKILL.md` replace `The ten plugin agents` with `The eleven plugin agents`, and in its example table row and the "e.g. `team-designer`" name example use `team-a11y` / `Accessibility reviewer` instead, so the example does not clash with the new plugin agent.

- [ ] **Step 8: Run the check — expect `ok`.** Also `grep -rn "ten plugin agents" plugins/team/skills` → no output.

- [ ] **Step 9: Commit**

```bash
git add plugins/team/skills/setup plugins/team/skills/update plugins/team/skills/doctor plugins/team/skills/status plugins/team/skills/names plugins/team/skills/new-agent
git commit -m "Setup, doctor, status and update know Nour and the design tools"
```

---

### Task 5: Dashboard

**Files:**
- Modify: `plugins/team/skills/dashboard/status-format.md`
- Modify: `plugins/team/skills/dashboard/dashboard.html`
- Modify: `plugins/team/skills/dashboard/SKILL.md`

**Interfaces:**
- Consumes: `design.md` line format (Global Constraints); `tickets[].prototype` (Task 3).
- Produces: `status.js` field `design` = `{ "open": n, "high": n, "medium": n, "low": n, "file": "project/design.md", "items": [ { "id", "priority", "title", "effort", "status": "open|fixed|skipped", "note" } ] }` or `null`; `tickets[].prototype` = absolute `file:///…/02b-prototype/index.html` or `null`.

- [ ] **Step 1: Failing check**

```bash
h=plugins/team/skills/dashboard/dashboard.html
grep -q "'designer': \['DS', '--r-ds'\]" $h && grep -q "function renderDesign" $h && grep -q '"design": {' plugins/team/skills/dashboard/status-format.md && echo ok
```
Run — expect no `ok`.

- [ ] **Step 2: `status-format.md`.**
  - In the sample `labels`, add to `roles`: `"designer": "Designer"`, and add the labels: `"design": "Design", "desOpen": "Open", "desFixed": "Fixed", "desSkipped": "Skipped", "desScan": "Scan again", "desFix": "Fix", "desNone": "No design list yet", "desAllDone": "Nothing open — looks great", "prototype": "prototype", "visualCheck": "visual check", "openPrototype": "Open prototype", "kpiDesign": "Design to-dos"`.
  - In the sample ticket add `"prototype": "file:///Users/<you>/recipe-box/.claude/team/work/active/rb-7/02b-prototype/index.html"`.
  - After the `"security": {…}` sample add:
    ```js
    "design": { "open": 2, "high": 1, "medium": 1, "low": 0, "file": "project/design.md",
      "items": [
        { "id": "DES-1", "priority": "high", "title": "Five different button styles", "effort": "M", "status": "open" },
        { "id": "DES-2", "priority": "medium", "title": "Hard-coded colours in the recipe card", "effort": "S", "status": "open" }
      ] },
    ```
  - Add the bullet after **`security`**:
    ```markdown
    - **`design`:** from `.claude/team/project/design.md`, or `null` when the file does not exist. `open`, `high`, `medium`, `low`: open items by priority (skipped items do not count). `items`: every item — `id`, `priority`, the short `title`, `effort`, `status` (`open`, `fixed`, `skipped`) and a `note` — open ones first, most important first, at most 30. The Design section has a Fix button that copies `/team-design fix <id>`.
    - **`tickets[].prototype`:** the `file:///` address of the ticket's `02b-prototype/index.html` once step 2b is approved, else `null`. Local only. The ticket card shows an "Open prototype" link.
    ```
  - Remove the `customAgents` sample `team-designer` → use `{ "agent": "team-a11y", "name": "Accessibility Reviewer", "joins": "qa" }`, and the line `e.g. "designer": "Design Reviewer"` → `e.g. "a11y": "Accessibility Reviewer"`.

- [ ] **Step 3: `dashboard.html` — colours and role.**
  - Line 14 (light) append ` --r-ds: #9333ea;`; line 25 (dark) append ` --r-ds: #c084fc;`.
  - `ROLES`: append `, 'designer': ['DS', '--r-ds']`.
  - English `roles` (near line 676): append `, 'designer': 'Designer'`; German `roles` (near line 705): append `, 'designer': 'Designer'`.
  - English labels (near line 654): add `design: 'Design', desOpen: 'Open', desFixed: 'Fixed', desSkipped: 'Skipped', desScan: 'Scan again', desFix: 'Fix', desNone: 'No design list yet', desAllDone: 'Nothing open — looks great', prototype: 'prototype', visualCheck: 'visual check', openPrototype: 'Open prototype', kpiDesign: 'Design to-dos',`. German (near line 683): `design: 'Design', desOpen: 'Offen', desFixed: 'Behoben', desSkipped: 'Übersprungen', desScan: 'Erneut prüfen', desFix: 'Beheben', desNone: 'Noch keine Design-Liste', desAllDone: 'Nichts offen — sieht gut aus', prototype: 'Prototyp', visualCheck: 'visueller Check', openPrototype: 'Prototyp öffnen', kpiDesign: 'Design-Aufgaben',`.
  - `ICONS`: add `palette: 'M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3.5 3H16a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z M7.5 11.5h.01 M10.5 7.5h.01 M15.5 8.5h.01',`
  - `HATS`: add `'designer': '<ellipse class="hat-p" cx="31" cy="21" rx="14" ry="5" transform="rotate(-8 31 21)"/><circle class="hat-p" cx="27" cy="15.5" r="1.8"/>',` (a beret).

- [ ] **Step 4: `dashboard.html` — Design section.** After the `<section class="section" id="sec-section" hidden>…</section>` block add:

```html
  <section class="section" id="des-section" hidden>
    <div class="section-head"><h2 id="h-des"></h2><span class="count" id="c-des"></span><div class="tickets-tools" id="des-tools"></div></div>
    <div id="des"></div>
  </section>
```
After `function renderSecurity(d, L) { … }` add `renderDesign`, the same structure with design fields:

```js
  function renderDesign(d, L) {
    var s = d.design;
    var sec = $('des-section');
    sec.hidden = !s;
    if (!s) return;
    var box = $('des'); clear(box);
    $('h-des').textContent = L.design;
    $('c-des').textContent = String(s.open || 0);
    var tools = $('des-tools'); clear(tools);
    tools.appendChild(copyButton(L.desScan, '/team-design', L.copiedStart, 'small', L.copyFailed));
    var items = Array.isArray(s.items) ? s.items : [];
    var card = el('div', 'card board');
    box.appendChild(card);
    var open = items.filter(function (x) { return x.status === 'open' || !x.status; });
    var skipped = items.filter(function (x) { return x.status === 'skipped'; });
    var fixed = items.filter(function (x) { return x.status === 'fixed'; });
    groupHead(card, L.desOpen, s.open || open.length);
    if (!open.length) card.appendChild(el('div', 'brows-empty', items.length || s.open === 0 ? L.desAllDone : L.desNone));
    open.forEach(function (x) {
      var r = el('div', 'list-row');
      r.appendChild(el('span', 'sev ' + (x.priority || ''), x.priority || ''));
      r.appendChild(el('span', 'tid', x.id || ''));
      var tt = el('div', 't'); tt.appendChild(document.createTextNode(x.title || '')); if (x.effort) tt.appendChild(el('span', '', x.effort)); r.appendChild(tt);
      r.appendChild(x.id ? copyButton(L.desFix, '/team-design fix ' + x.id, L.copiedStart, 'small', L.copyFailed) : el('span'));
      card.appendChild(r);
    });
    [[L.desSkipped, skipped], [L.desFixed, fixed]].forEach(function (g) {
      if (!g[1].length) return;
      groupHead(card, g[0], g[1].length);
      g[1].forEach(function (x) {
        var r = el('div', 'list-row');
        r.appendChild(el('span', 'sev', x.priority || ''));
        r.appendChild(el('span', 'tid', x.id || ''));
        var tt = el('div', 't'); tt.appendChild(document.createTextNode(x.title || '')); if (x.note) tt.appendChild(el('span', '', x.note)); r.appendChild(tt);
        r.appendChild(el('span'));
        card.appendChild(r);
      });
    });
  }
```
Before writing it, read the rest of `renderSecurity` (the lines after the accepted/fixed loop) and copy its ending exactly, so the two functions match. Call `renderDesign(d, L);` right after `renderSecurity(d, L);` (near line 1893).

  - KPI: after the security stat (near line 905–910) add:
    ```js
    var des = d.design;
    if (des && typeof des.open === 'number') {
      var ds = stat(box, 'palette', L.kpiDesign, des.open, [des.high ? String(L.kpiSecuritySub).replace('{high}', des.high) : '', des.file || ''].filter(Boolean).join(' · '));
      if (des.high) ds.classList.add('alert');
    }
    ```
  - `.sev.high/.medium/.low` classes already style priorities — reuse them.

- [ ] **Step 5: `dashboard.html` — workflow and prototype link.**
  - In the `aux` list (near line 1820), add two built-in nodes after the security ones:
    ```js
     { agent: 'team:designer', col: 1, icon: 'palette', sub: L.prototype, run: desCol === 1 ? desRun : null },
     { agent: 'team:designer', col: 4, icon: 'palette', sub: L.visualCheck, run: desCol === 4 ? desRun : null },
    ```
    with, before the list: `var desRun = mine.filter(function (s) { return s.agent === 'team:designer'; })[0]; var desCol = curStep >= 0 && curStep <= 2 ? 1 : 4;`. Only add the two designer nodes when the ticket has a prototype or the designer is running: wrap them in `if (t.prototype || desRun)`. In the `loose` filter that skips `team:security-engineer`, also skip `team:designer`.
  - In the ticket card render, find where `t.pr` is shown and, next to it, when `t.prototype` is a string starting with `file:///`, add a link: `var a = el('a', 'small', L.openPrototype); a.href = t.prototype; a.target = '_blank'; a.rel = 'noopener';` appended to the same row. Never build the URL from anything else.

- [ ] **Step 6: `dashboard/SKILL.md`.** In "On" step 2 add `design` from `.claude/team/project/design.md` (counts and item titles) and `tickets[].prototype`. In the description, add "Nour's design to-do list" after "the security to-do list".

- [ ] **Step 7: Run the check — expect `ok`.** Then the syntax check:

```bash
node -e "const h=require('fs').readFileSync('plugins/team/skills/dashboard/dashboard.html','utf8');const m=h.match(/<script>([\s\S]*?)<\/script>/g);m.forEach(s=>new Function(s.replace(/<\/?script>/g,'')));console.log('ok',m.length)"
```
Expected: `ok <n>`, no SyntaxError.

- [ ] **Step 8: Visual check.** Make a fixture and screenshot it with Playwright (any of: the Playwright MCP, or `npx playwright screenshot`):

```bash
mkdir -p /tmp/team-fixture && cp plugins/team/skills/dashboard/dashboard.html /tmp/team-fixture/
```
Write `/tmp/team-fixture/status.js` from the sample in `status-format.md` (copy the `window.TEAM_STATUS = {…}` block). Serve it with `npx -y http-server /tmp/team-fixture -a 127.0.0.1 -p 4710 -s` and open `http://127.0.0.1:4710/dashboard.html`. Expected: a Design section with DES-1 and DES-2 and Fix buttons, a Design KPI with "1 high", a purple Designer node with a beret under Research, an "Open prototype" link on RB-7. Switch the language to German: labels change. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add plugins/team/skills/dashboard
git commit -m "Dashboard: Nour's design list, workflow node and prototype link"
```

---

### Task 6: Docs, counts and version 0.16.0

**Files:**
- Modify: `README.md` (then copy with the build script to `plugins/team/README.md`)
- Modify: `CHANGELOG.md`
- Modify: `plugins/team/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugins/team/package.json`
- Modify: `plugins/team/agents/agent-maintainer.md`

- [ ] **Step 1: Failing check**

```bash
grep -q '"version": "0.16.0"' plugins/team/.claude-plugin/plugin.json && grep -q "^## 0.16.0" CHANGELOG.md && grep -q "## Design with Nour" README.md && echo ok
```
Run — expect no `ok`.

- [ ] **Step 2: Versions and counts.**
  - `plugin.json` and `package.json`: `"version": "0.16.0"`.
  - `plugin.json`, `marketplace.json` plugin description, `package.json` description: "Ten agents" / "ten Claude Code agents" → "Eleven agents" / "eleven Claude Code agents", and after "from idea to pull request" add " — with a prototype for every screen —".
  - `package.json` `keywords`: add `"design"`, `"prototype"`, `"playwright"`.

- [ ] **Step 3: README.**
  - Line 25 "a crew of ten specialised agents" → "eleven"; line 47 "ten agents, thirteen commands" → "eleven agents, fourteen commands".
  - New section `## Design with Nour` after `## Marketing with Rafi`, and its entry in `## Table of contents`:
    ```markdown
    ## Design with Nour

    Nour, the team's designer, looks after how the product looks and feels.

    - **Design scan** — `/team-design` reads the UI once and writes `.claude/team/project/design.md`: tokens, components, what drifts, and a redesign to-do list (`DES-1 · high · Five different button styles`). `/team-design fix DES-<n>` works one item as a ticket.
    - **Prototype first** — every ticket that changes what users see gets step **2b**: a clickable HTML prototype with every state (empty, loading, error, right-to-left, mobile) and screenshots, in the ticket's work folder. You open it and approve it before anything is planned.
    - **Visual check** — in QA, Nour opens the running app (`Dev URL` in `team.md`) and compares it with the approved prototype.

    Playwright (for screenshots) comes with the plugin. Optional tools you turn on in `/team-setup` and install yourself: the doop MCP, the frontend-design plugin, the ui-ux-pro-max skill, and Figma when you ask for it. doop and ui-ux-pro-max are third-party — design context goes to them.
    ```
  - `## The workflow`: in the step list, add step 2b after Research: "**2b Design (UI tickets)** — Nour makes the prototype; you approve it."
  - `## Command map` → new subsection `### Design` with `| **/team-design** | Scan the UI; \`list\`, \`fix DES-<n>\`, \`skip DES-<n> <reason>\`. |`.
  - `## The crew` table: add the row for `team:designer` — Nour — design scan, prototypes, visual check — read-only on code.
  - `## File-backed project state`: add `design.md` and `02b-design.md`, `02b-prototype/`, `05-design.md`.
  - `## Explained for kids` — one sentence: "Nour draws the picture of the new screen first, so everyone agrees how it should look before anyone builds it."
  - Then run `node scripts/build-npm-readme.js` → expect `copied README.md to plugins/team/README.md`.

- [ ] **Step 4: CHANGELOG** — at the top, under `# Changelog`:

```markdown
## 0.16.0

- **New role: `team:designer` — Nour.** On a project with UI, setup scans it and writes `.claude/team/project/design.md` — tokens, components, inconsistencies and a redesign to-do list (`DES-1 · high · …`).
- **Prototype first:** every ticket that changes what users see gets step 2b — a clickable HTML prototype with every state and Playwright screenshots in `02b-prototype/`, approved before the plan. The project manager plans from it and the developer lead builds from it.
- **Visual check in QA:** Nour compares the running app (`Dev URL` in `team.md`) with the prototype — `05-design.md` with PASS, FAIL or NOT TESTED.
- **`/team-design`**: scan or rescan, `list`, `fix DES-<n>` (works the item as a ticket and ticks it on merge), `skip DES-<n> <reason>`.
- Playwright MCP now comes with the plugin (`.mcp.json`). Optional design tools in `## Design tools`: doop MCP, frontend-design, ui-ux-pro-max, Figma when asked — setup asks; you install.
- Dashboard: a Design section with Fix buttons, a design to-dos counter, Nour in the Workflow, and an "Open prototype" link on each ticket.
- Doctor checks `design.md`, Playwright and the design tools; `/team-update` adds `## Design tools`, `Dev URL` and Nour's name.
```

- [ ] **Step 5: `agent-maintainer.md`.** Where it lists the team's own files to compare, add `agents/designer.md`, `skills/design/`, and `.mcp.json`.

- [ ] **Step 6: Run the check — expect `ok`.** Then:

```bash
claude plugin validate plugins/team
grep -rniE "\bten (specialised )?agents|ten plugin agents|Ten agents" README.md plugins/team .claude-plugin
diff -q README.md plugins/team/README.md
```
Expected: `✔ Validation passed`; the grep prints nothing; the diff prints nothing (or only the differences the build script makes on purpose — check `scripts/build-npm-readme.js`).

- [ ] **Step 7: Commit**

```bash
git add README.md plugins/team/README.md CHANGELOG.md plugins/team/.claude-plugin/plugin.json .claude-plugin/marketplace.json plugins/team/package.json plugins/team/agents/agent-maintainer.md
git commit -m "Release 0.16.0: Nour the designer and prototypes for UI tickets"
```

---

### Task 7: End-to-end check in `test-project/` (developer runs, new session)

Agents and MCP servers load only in a new session, so this is a manual checklist for the developer after installing the branch locally (`claude --plugin-dir plugins/team` from `test-project/`).

- [ ] `/team-doctor` — row 19 shows ✔ or only the expected ⚠ (no `design.md` yet).
- [ ] `/team-design` — Nour writes `.claude/team/project/design.md` for the Flutter todo app with tokens from `lib/`, and `DES-<n>` items.
- [ ] `/team-work "add a due date chip to each todo"` — step 2b runs; `02b-prototype/index.html` opens in the browser; `desktop.png` and `mobile.png` exist.
- [ ] `/team-work "rename an internal helper"` — step 2b is skipped with a reason in the brief.
- [ ] Step 5 with `Dev URL: none` → `05-design.md` says NOT TESTED with the reason, and the coordinator asks whether to continue.
- [ ] `/team-dashboard` — the Design section, Nour's node and the prototype link appear; Arabic reply language reads right to left.
