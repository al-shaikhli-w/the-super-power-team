# Multi-ticket Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let `/team-work` run several tickets at once, like a real team: planners prepare tickets, then a developer pool and a QA pool that grow and shrink by themselves (max 3 each) take them, each instance isolated on its own ticket and worktree, with cheaper models for simple jobs.

**Architecture:** The plugin is markdown skills + agent definitions + one static dashboard page. The coordinator (main session running `skills/work/SKILL.md`) gains a "several tickets" mode: a ticket queue, auto-scaled developer/QA slots, a file-overlap check from each plan's `Files / area` column, one git worktree per ticket (commands handed to the developer), and approvals tagged by ticket. Every agent stays a subagent started in the background, so the coordinator's context only holds paths and short results. A `## Models` table in `team.md` picks a model per agent job.

**Tech Stack:** Markdown (Claude Code skills/agents), bash hook, vanilla JS/HTML dashboard, Node 18 (syntax check only).

## Global Constraints

- Max developers: 3. Max QA engineers: 3. Max tickets in planning: 3. Defaults written into `team.md`; the developer may lower or raise them.
- Pools scale automatically: a slot opens when a ticket is ready and no conflict exists; it closes when the ticket leaves that stage. The developer never sets a pool size by hand.
- File overlap → the later ticket **waits** until the earlier ticket's PR is merged (decision "A"). The developer can override per ticket with `<ticket> go anyway`.
- No git writes by the crew — `git worktree add/remove` are commands handed to the developer, like today's branch commands.
- Approvals never run in parallel: one question at a time to the developer, each tagged `[<ticket>]`.
- Every agent is a subagent; the coordinator passes paths, never pasted file contents.
- Cheap models only for simple jobs: `haiku` for reply-writer and agent-maintainer; `sonnet` for researcher and QA's CI / local-review checks; everything else `inherit`.
- One-ticket mode (`/team-work RB-12`) must behave exactly as today.
- README.md stays npm-safe (absolute links, no Mermaid, no `<picture>`); run `node scripts/build-npm-readme.js` after editing it.
- Version: 0.14.0.

## File map

| File | Change |
|---|---|
| `plugins/team/agents/*.md` | `model:` defaults per the table above |
| `plugins/team/skills/setup/team-template.md` | `## Team size`, `## Worktrees`, `## Models` sections |
| `plugins/team/skills/setup/SKILL.md` | one question: worktree setup command; write the new sections |
| `plugins/team/skills/work/SKILL.md` | rule 12 (models), new section "Several tickets — the team" |
| `plugins/team/agents/developer-lead.md`, `qa-engineer.md`, `reviewer.md` | "Work only inside the worktree path you are given" |
| `plugins/team/skills/dashboard/status-format.md` | `now` may be a list; new `crew` field |
| `plugins/team/skills/dashboard/dashboard.html` | "Team" card rendering `crew` |
| `plugins/team/skills/update/SKILL.md`, `doctor/SKILL.md` | add / check the new `team.md` sections |
| `README.md`, `CHANGELOG.md`, `plugins/team/package.json`, `plugins/team/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | docs + version |

---

### Task 1: Model per agent job

**Files:**
- Modify: `plugins/team/agents/reply-writer.md`, `agent-maintainer.md`, `researcher.md`, `qa-engineer.md` (frontmatter `model:` line)
- Modify: `plugins/team/skills/setup/team-template.md` (append section)
- Modify: `plugins/team/skills/work/SKILL.md` (add rule 12 after rule 11)

**Interfaces:**
- Produces: `## Models` table in `team.md` with columns `Agent | Job | Model`; rule 12 in work skill that reads it.

- [ ] **Step 1: Set frontmatter defaults**

```bash
cd plugins/team/agents
sed -i '' 's/^model: inherit$/model: haiku/' reply-writer.md agent-maintainer.md
sed -i '' 's/^model: inherit$/model: sonnet/' researcher.md qa-engineer.md
grep -H '^model:' *.md
```
Expected: reply-writer/agent-maintainer `haiku`, researcher/qa-engineer `sonnet`, the other four `inherit`.

- [ ] **Step 2: Add `## Models` to `team-template.md`** (after `## Custom agents`)

```markdown
## Models
Which model each job runs on. `inherit` = the model of your session. Cheaper models for simple jobs save tokens.
| Agent | Job | Model |
|---|---|---|
| reply-writer | all | haiku |
| agent-maintainer | all | haiku |
| researcher | all | sonnet |
| qa-engineer | CI gate, local review, PR round check | sonnet |
| qa-engineer | code review, security review | inherit |
| product-manager, project-manager, developer-lead, reviewer | all | inherit |
```

- [ ] **Step 3: Add rule 12 to `work/SKILL.md`** (after rule 11's last bullet)

```markdown
12. **Models.** Before you start an agent, look up its agent and job in `## Models` in `team.md` and pass that model when you start it (`inherit` or no row: pass none). A job that turns out harder than its model (the agent reports it cannot finish, or QA output is unclear): run it once more with `inherit` and say so.
```

- [ ] **Step 4: Verify**

Run: `grep -n "^12\. \*\*Models" plugins/team/skills/work/SKILL.md && grep -n "^## Models" plugins/team/skills/setup/team-template.md`
Expected: one hit each.

- [ ] **Step 5: Commit**

```bash
git add plugins/team/agents plugins/team/skills/setup/team-template.md plugins/team/skills/work/SKILL.md
git commit -m "Pick a model per agent job: haiku and sonnet for simple jobs"
```

---

### Task 2: Team size and worktrees in the profile

**Files:**
- Modify: `plugins/team/skills/setup/team-template.md` (two sections after `## Developer`)
- Modify: `plugins/team/skills/setup/SKILL.md` step 11 (one more question) and step 10 (write sections)

**Interfaces:**
- Produces: `team.md` keys read by Task 3 — `Max developers`, `Max QA engineers`, `Max tickets in planning`, `Worktree folder`, `Worktree setup`.

- [ ] **Step 1: Add to `team-template.md`** (after the `## Developer` list)

```markdown
## Team size
Several tickets at once (`/team-work RB-12 RB-13`): the team grows and shrinks by itself up to these limits.
- Max tickets in planning: 3
- Max developers: 3
- Max QA engineers: 3

## Worktrees
Each ticket worked next to others gets its own git worktree, so developers never touch each other's files.
- Worktree folder: <../<repo>-worktrees> — where the developer creates them
- Worktree setup: <command a fresh worktree needs before it builds, e.g. `npm ci`, or "none">
```

- [ ] **Step 2: Setup asks for the setup command** — in `setup/SKILL.md` step 11, add a bullet after "Full CI gate":

```markdown
    - **Worktree setup** (code only): what a fresh checkout needs before the gate runs — suggest the install command from the lockfile (`npm ci`, `pnpm install --frozen-lockfile`, `uv sync`, …) or `none`. `Worktree folder` defaults to `../<repo folder>-worktrees`.
```

- [ ] **Step 3: Verify**

Run: `grep -n "Max developers: 3\|Worktree setup" plugins/team/skills/setup/*.md`
Expected: template and SKILL.md both hit.

- [ ] **Step 4: Commit**

```bash
git add plugins/team/skills/setup
git commit -m "Profile: team size limits and worktree settings"
```

---

### Task 3: Several tickets — the coordinator

**Files:**
- Modify: `plugins/team/skills/work/SKILL.md` — frontmatter `argument-hint`, and a new section inserted before `## No argument, \`week\` or \`sprint\``

**Interfaces:**
- Consumes: `## Team size`, `## Worktrees`, `## Models` (Tasks 1–2); `Files / area` column of `03-plan.md`.
- Produces: `crew` object in `status.js` (shape defined in Task 5); `00-brief.md` line `**Worktree:** <path>`.

- [ ] **Step 1: argument-hint**

Change to:
```yaml
argument-hint: "[ticket id or idea …] | week | sprint | review | pr | status | sync"
```

- [ ] **Step 2: Insert the section**

````markdown
## Several tickets — the team
`/team-work RB-12 RB-13 …`, or "start the next three" from the todo list, or a new ticket named while others are active. Works like a real team: planners prepare tickets, then a developer pool and a QA pool take them. One ticket alone runs exactly as in "A ticket or idea" below.

### Stages and limits
| Stage | Steps | Limit (from `## Team size`) |
|---|---|---|
| Planning | 1 Requirements, 2 Feasibility, 3 Plan | Max tickets in planning |
| Ready | plan approved, waiting for a developer | — |
| Building | 4 Build | Max developers |
| Checking | 5 QA, 5b Independent review | Max QA engineers |
| Hand-over | 6 PR, 7 PR rounds | — |

**The team grows and shrinks by itself.** After every agent report and every approval, fill free places in order: Checking first, then Building, then Planning — each from the oldest waiting ticket. A ticket that leaves a stage frees its place at once. Never start more than the limit; with no limit in `team.md` use 3.

### Who is who
Each ticket in Building has its own developer, each in Checking its own QA engineer. A developer or QA engineer works on one ticket only and never sees another ticket: its prompt names only its own work folder and worktree. With `## Team names`, give the pool members the names in order (a developer-lead row may list several, e.g. "Omar, Sami, Lina"); otherwise "Developer 1/2/3", "QA 1/2/3". Keep the same member on a ticket until it leaves the stage (a QA FAIL goes back to the same developer).

### Overlap check — before a ticket enters Building
Compare the `Files / area` cells of its `03-plan.md` with every ticket in Building, Checking or Hand-over whose PR is not merged yet. Two entries overlap when they are the same path, or one is a folder holding the other.
- Overlap: the ticket **waits**. Tell the developer once: "`[RB-14]` waits for RB-12 — both change `src/lib/search.ts`." It enters Building when RB-12's PR is merged (`/team-work pr` or the developer says so), from the updated default branch.
- An entry that is not a path ("auth flow"): ask the developer whether it overlaps; their answer goes under Decisions in the brief.
- `RB-14 go anyway`: start it now, note under Decisions that a merge conflict is expected.

### Worktrees
Every ticket that enters Building gets its own worktree. Give the developer the commands for their shell and wait until they say it is done:
```bash
git fetch origin
git worktree add -b <branch> "<Worktree folder>/<ticket>" origin/<default branch>
cd "<Worktree folder>/<ticket>" && <Worktree setup>
```
Branch name as in step 4. Add `**Worktree:** <absolute path>` to the brief's header line. The work folder stays in the main checkout's `.claude/team/work/active/<ticket>/`. Every developer, QA and reviewer prompt starts with: "Read `<absolute work folder>/00-brief.md` first. Work only inside `<worktree path>`; run every command there." After the PR is merged, archive as in `pr` and give `git worktree remove "<path>"`.

### Running and asking
- Start every agent in the background and keep working on other tickets while it runs. Never wait on one ticket when another one can move.
- Several answers can be pending, but ask **one question at a time**, oldest first, each starting with `[<ticket>]`. The developer may answer any pending ticket by naming it ("RB-13 approve"); an answer without a ticket goes to the question shown last.
- Rule 1 still holds per ticket: a yes covers one step of one ticket.
- Keep your own context small: never read a step file or a diff yourself unless an agent's report is unclear; show each result as the agent wrote it.
- Dashboard on: `now` lists every running agent with its ticket; `crew` shows the pools and the waiting list (`../dashboard/status-format.md`).
- `stop RB-13` stops that ticket only (its agents finish their current job, nothing new starts); `stop` alone stops all and asks which ticket to resume later.
````

- [ ] **Step 3: Agents per ticket note** — in `## Agents per ticket`, add a last bullet:

```markdown
- With several tickets, "several in parallel" applies inside each ticket; the stage limits in `## Team size` count tickets, not agents.
```

- [ ] **Step 4: Verify**

Run: `grep -n "^## Several tickets\|^### Overlap check\|^### Worktrees\|stage limits" plugins/team/skills/work/SKILL.md`
Expected: four hits; the section sits before `## No argument`.

- [ ] **Step 5: Dry-run review** — read the new section next to steps 4–7 and confirm no step contradicts it (step 4's branch commands are replaced by the worktree commands in several-ticket mode — add "(several tickets: see Worktrees)" at the end of step 4's first sentence).

- [ ] **Step 6: Commit**

```bash
git add plugins/team/skills/work/SKILL.md
git commit -m "team-work: several tickets at once with auto-scaling developer and QA pools"
```

---

### Task 4: Agents stay inside their worktree

**Files:**
- Modify: `plugins/team/agents/developer-lead.md`, `qa-engineer.md`, `reviewer.md` — the limits list (next to "Read-only git")

- [ ] **Step 1: Add the line to each limits list**

```markdown
- **Worktree.** When the prompt names a worktree path, read, edit and run commands only inside it (`cd "<path>" && …` for every command). Never open another ticket's work folder or worktree.
```

- [ ] **Step 2: Verify**

Run: `grep -c "\*\*Worktree.\*\*" plugins/team/agents/{developer-lead,qa-engineer,reviewer}.md`
Expected: `1` for each file.

- [ ] **Step 3: Commit**

```bash
git add plugins/team/agents
git commit -m "Agents stay inside the worktree they are given"
```

---

### Task 5: Dashboard data and Team card

**Files:**
- Modify: `plugins/team/skills/dashboard/status-format.md`
- Modify: `plugins/team/skills/dashboard/dashboard.html` (CSS block, a `<section>` before the Tickets section, `renderCrew`, call in `render`)
- Create: `/tmp/team-fixture/status.js` (test fixture, not committed)

**Interfaces:**
- Produces: `crew` shape:
```js
"crew": {
  "developers": [ { "name": "Omar", "ticket": "RB-12", "step": "Build 2/4" } ],
  "qa":         [ { "name": "QA 1", "ticket": "RB-9", "step": "QA" } ],
  "max":        { "developers": 3, "qa": 3, "planning": 3 },
  "waiting":    [ { "ticket": "RB-14", "for": "RB-12", "why": "both change src/lib/search.ts" } ]
}
```
and `now` as either one object (old) or a list of `{ agent, task, since, ticket }`.

- [ ] **Step 1: Document it in `status-format.md`** — add `crew` to the example after `"names"`, and these bullets:

```markdown
- **`now`:** one object, or with several tickets a list — one entry per running agent, with `ticket`.
- **`crew`:** only while several tickets run (`/team-work` "Several tickets"), else leave it out. `developers` and `qa`: one entry per busy member — name, ticket, current step; `max` the limits from `## Team size`; `waiting`: tickets held by the overlap check, with the ticket they wait for and why (one line, reply language). Labels: `crew`, `developers`, `qaPool`, `free`, `waitsFor` in `labels`.
```

- [ ] **Step 2: Write the fixture**

```bash
mkdir -p /tmp/team-fixture
cp plugins/team/skills/dashboard/dashboard.html /tmp/team-fixture/
cat > /tmp/team-fixture/status.js <<'EOF'
window.TEAM_STATUS = {
  "updated": "2026-11-20T14:05:12+01:00", "project": "Fixture", "dir": "ltr", "labels": {},
  "now": [ { "agent": "team:developer-lead", "task": "RB-12 — task 2", "since": "2026-11-20T14:01:40+01:00", "ticket": "RB-12" } ],
  "tickets": [ { "id": "RB-12", "title": "Search", "steps": ["done","done","done","current","todo","todo"], "build": {"done":1,"total":4}, "waiting": null, "pr": null } ],
  "crew": {
    "developers": [ { "name": "Omar", "ticket": "RB-12", "step": "Build 2/4" }, { "name": "Sami", "ticket": "RB-13", "step": "Build 1/2" } ],
    "qa": [ { "name": "QA 1", "ticket": "RB-9", "step": "QA" } ],
    "max": { "developers": 3, "qa": 3, "planning": 3 },
    "waiting": [ { "ticket": "RB-14", "for": "RB-12", "why": "both change src/lib/search.ts" } ]
  },
  "pending": [], "activity": []
};
EOF
```

- [ ] **Step 3: Add English fallbacks to `EN`** (next to `tickets:` in the `EN` object)

```js
    crew: 'Team', developers: 'Developers', qaPool: 'QA', free: 'free', waitsFor: 'waits for',
```

- [ ] **Step 4: Add the section markup** — directly before the `<section class="section">` that holds `id="h-tickets"`:

```html
  <section class="section" id="crew-section" hidden>
    <div class="section-head"><h2 id="h-crew"></h2></div>
    <div class="card crew" id="crew"></div>
  </section>
```

- [ ] **Step 5: Add CSS** (end of the `<style>` block)

```css
.crew { padding: 16px 18px; display: grid; gap: 14px; }
.crew-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.crew-row > b { min-width: 110px; }
.crew-slot { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--line-2); border-radius: 8px; }
.crew-slot.free { opacity: .5; border-style: dashed; }
.crew-wait { color: var(--muted, inherit); }
```

- [ ] **Step 6: Add `renderCrew`** (right after `renderTickets`)

```js
  function renderCrew(d, L) {
    var sec = $('crew-section'), box = $('crew');
    var c = d.crew;
    sec.hidden = !c;
    if (!c) return;
    clear(box);
    $('h-crew').textContent = L.crew;
    var max = c.max || {};
    [['developers', L.developers, max.developers || 3], ['qa', L.qaPool, max.qa || 3]].forEach(function (p) {
      var row = el('div', 'crew-row');
      row.appendChild(el('b', '', p[1]));
      var busy = Array.isArray(c[p[0]]) ? c[p[0]] : [];
      busy.forEach(function (m) {
        var s = el('span', 'crew-slot');
        s.appendChild(el('b', '', m.name || ''));
        s.appendChild(el('span', 'tid', m.ticket || ''));
        if (m.step) s.appendChild(el('span', '', m.step));
        row.appendChild(s);
      });
      for (var i = busy.length; i < p[2]; i++) row.appendChild(el('span', 'crew-slot free', L.free));
      box.appendChild(row);
    });
    (Array.isArray(c.waiting) ? c.waiting : []).forEach(function (w) {
      var row = el('div', 'crew-row crew-wait');
      row.appendChild(icon('clock'));
      row.appendChild(el('span', 'tid', w.ticket || ''));
      row.appendChild(el('span', '', L.waitsFor + ' ' + (w.for || '') + (w.why ? ' — ' + w.why : '')));
      box.appendChild(row);
    });
  }
```

And in `render(d, live, actions)` add `renderCrew(d, L);` on the line before `renderTickets(d, L);`.

- [ ] **Step 7: Syntax check**

```bash
cp plugins/team/skills/dashboard/dashboard.html /tmp/team-fixture/
node -e "const h=require('fs').readFileSync('/tmp/team-fixture/dashboard.html','utf8');const m=h.match(/<script>([\s\S]*?)<\/script>/g);m.forEach(s=>new Function(s.replace(/<\/?script>/g,'')));console.log('ok',m.length)"
```
Expected: `ok <n>` with no SyntaxError.

- [ ] **Step 8: Visual check** — use the `webapp-testing` skill (Playwright) to open `file:///tmp/team-fixture/dashboard.html`, screenshot, and confirm: Team card shows "Developers: Omar RB-12 Build 2/4 · Sami RB-13 Build 1/2 · free", "QA: QA 1 RB-9 QA · free · free", and the waiting line for RB-14. Then remove `crew` from the fixture, reload, confirm the Team section is hidden and nothing else changed. Also set `"dir": "rtl"` with Arabic labels once and confirm layout mirrors.

- [ ] **Step 9: Commit**

```bash
git add plugins/team/skills/dashboard
git commit -m "Dashboard: Team card with developer and QA pools and waiting tickets"
```

---

### Task 6: Update, doctor, docs, version

**Files:**
- Modify: `plugins/team/skills/update/SKILL.md` (comparison table rows)
- Modify: `plugins/team/skills/doctor/SKILL.md` (one check row)
- Modify: `README.md` (`## Parallel work`), `CHANGELOG.md`
- Modify: version in `plugins/team/package.json`, `plugins/team/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, README badge

- [ ] **Step 1: Update skill** — add rows to its comparison table:

```markdown
| `## Team size` | the three limits, 3 each | it is missing |
| `## Worktrees` | `Worktree folder` default, `Worktree setup` asked once | it is missing |
| `## Models` | the template's table | it is missing; never change rows the developer edited |
```

- [ ] **Step 2: Doctor** — add a row after check 15:

```markdown
| 16 | Worktrees | ⚠ a ticket's brief names a `**Worktree:**` path that does not exist, or `git worktree list` shows a worktree under `Worktree folder` with no active ticket → give the `git worktree add` / `remove` command |
```

- [ ] **Step 3: README `## Parallel work`** — keep the existing paragraph and append:

```markdown
**Several tickets at once.** `/team-work RB-12 RB-13 RB-14` works like a real
team: the product manager, researcher and project manager prepare each ticket,
then a pool of developers and a pool of QA engineers take them — up to three of
each, growing and shrinking by itself. Every ticket gets its own git worktree,
so developers never see or touch each other's work. Two tickets that change the
same file never build at the same time: the second waits until the first is
merged. You still approve every step, one question at a time, each tagged with
its ticket.

**Cheaper where it is safe.** Simple jobs — drafting replies, checking agents,
running the CI gate — run on a smaller model; planning, building and reviewing
use yours. Change it in `## Models` in `team.md`.
```

Then: `node scripts/build-npm-readme.js` → expect `copied README.md to plugins/team/README.md`.

- [ ] **Step 4: CHANGELOG** — under `## Unreleased` → rename to `## 0.14.0` and add:

```markdown
- Several tickets at once: `/team-work RB-12 RB-13` runs a developer pool and a QA pool that grow and shrink by themselves (up to 3 each, `## Team size` in `team.md`).
- One git worktree per ticket; tickets that change the same files wait for each other.
- Approvals stay one at a time, tagged with their ticket.
- `## Models` in `team.md`: haiku and sonnet for simple jobs, your model for the rest.
- Dashboard: a Team card with who works on which ticket and what waits.
```

- [ ] **Step 5: Bump version to 0.14.0**

```bash
grep -rln '0\.13\.0' plugins/team/package.json plugins/team/.claude-plugin/plugin.json .claude-plugin/marketplace.json README.md
sed -i '' 's/0\.13\.0/0.14.0/g' plugins/team/package.json plugins/team/.claude-plugin/plugin.json .claude-plugin/marketplace.json
sed -i '' 's/version-0\.13\.0/version-0.14.0/; s/version 0\.13\.0/version 0.14.0/' README.md
node scripts/build-npm-readme.js
grep -rn '0\.13\.0' plugins/team/package.json plugins/team/.claude-plugin/plugin.json .claude-plugin/marketplace.json README.md
```
Expected: last grep prints nothing.

- [ ] **Step 6: Commit**

```bash
git add README.md CHANGELOG.md plugins .claude-plugin
git commit -m "Release 0.14.0: several tickets at once, worktrees, models per job"
```

---

### Task 7: End-to-end acceptance (manual, in a sample project)

- [ ] **Step 1:** In a throwaway git repo with a `package.json` and two tiny local tickets (`Local tickets: on`) that touch different files and a third that touches the same file as the first, run `/team-setup`, then `/team-update` → confirm `## Team size`, `## Worktrees`, `## Models` appear.
- [ ] **Step 2:** `/team-work T-1 T-2 T-3`. Confirm: planning runs for three tickets in the background; questions come one at a time tagged `[T-n]`; T-1 and T-2 get worktree commands and two developers; T-3 is reported as waiting for T-1 with the shared file named; the dashboard Team card shows two developers, one free slot and the waiting line.
- [ ] **Step 3:** Confirm `/team-work T-9` alone (single ticket) asks no worktree commands and behaves as in 0.13.0.
- [ ] **Step 4:** Confirm the reply-writer and QA CI-gate runs show the cheaper model in the agent start (dashboard side panel or `/agents` output).

---

### Task 8: Security engineer (new role, added 2026-11-20)

**Files:**
- Create: `plugins/team/agents/security-engineer.md`, `plugins/team/skills/security/SKILL.md`, `plugins/team/skills/security/security-template.md`
- Modify: `skills/setup/SKILL.md` (scan after the project scan), `skills/work/SKILL.md` (step 2 threat check, step 5 security review, archive ticks SEC items), `agents/qa-engineer.md` (security check moves out), `skills/status`, `skills/doctor`, `skills/update`, `skills/names`, `skills/new-agent`, dashboard (role colour, `security` KPI), README, descriptions ("nine agents", "twelve commands").

**Behaviour:**
- **Security scan** — `/team-setup` with code, or `/team-security`: reads the whole project (secrets, dependencies with the package manager's own audit command, auth, input handling, data exposure, config, headers, logging) and writes `.claude/team/project/security.md`: a short picture of the system, then a TODO checklist `- [ ] SEC-<n> · <high|medium|low> · <title> — <file:line> — <fix> — <S|M|L>`. A rescan keeps ids, ticks fixed items with the date, adds new ones.
- **Threat check** — step 2, next to the researcher: what this ticket changes for security, and the security requirements the developer must follow (they go under Constraints in the brief).
- **Security review** — step 5, instead of QA's old check 4; writes `05-security.md`; QA is PASS only when it passes too.
- **Fix a TODO** — `/team-security fix SEC-3` starts `/team-work` with the item as an idea; on merge the coordinator ticks it in `security.md`.
- Never attacks a running system, never scans hosts, never prints secret values, edits only `security.md` and its own step files.

---

### Task 9: Social media manager — Rafi (added 2026-11-20)

- Create `plugins/team/agents/social-media.md` (default name Rafi, model sonnet) and `plugins/team/skills/social/SKILL.md` (`/team-social`, `post <ticket>`, `week`, `list`).
- `team.md`: `Social posts: after merge | ask | off`, `team:social-media | Rafi` in `## Team names`, a `## Models` row. The coordinator drafts posts after a merge according to `Social posts`. Drafts only; nobody posts.
- Files: `.claude/team/marketing/marketing-plan.md`, `marketing/posts/<date>-<ticket>.md`.

### Task 10: Dashboard and documents for security and marketing (added 2026-11-20)

- `status.js`: `security.items` (id, severity, title, effort, status, note — never fixes or secrets) and `marketing` (plan, message, calendar, posts).
- `dashboard.html`: Security section (Fix buttons), Marketing section, security engineer and Rafi nodes in the Workflow, edges redrawn after scroll.
- Doctor check 18 (marketing), status lines for security and marketing, every agent's document list names `security.md` and the marketing plan.
- Verified with a Playwright fixture in `/tmp/team-fixture`: no page errors, sections render and hide without data, edges line up.
