#!/usr/bin/env node
// Builds plugins/team/README.md (the README shown on npmjs.com) from the
// repository's README.md.
//
// npm cannot load relative images or links and does not render Mermaid, so
// this script:
//   - points images and links at GitHub with absolute URLs;
//   - replaces <picture> with a single <img>;
//   - replaces the Mermaid workflow chart with a compact text chart that fits
//     npm's code-block width.
//
// Runs automatically before `npm publish` (prepublishOnly). Run by hand with:
//   node scripts/build-npm-readme.js

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'README.md');
const DST = path.join(ROOT, 'plugins', 'team', 'README.md');

const REPO = 'al-shaikhli-w/Pit-Crew';
const BRANCH = 'master';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
const BLOB = `https://github.com/${REPO}/blob/${BRANCH}/`;

const WORKFLOW = `\`\`\`text
/team-work ABC-123
 │
 ▼
1  product-manager   requirements         ✋ approve
 │
2  researcher        feasibility          ✋ approve
 │                   not feasible → 1
3  project-manager   plan                 ✋ approve
 │
 ├─ you create the branch
 │
4  developer-lead    one task at a time   ✋ each task
 │
5  qa-engineer       CI, reviews, security
 │                   FAIL → 4
5b reviewer          requirements + diff
 │                   changes → 4
6  hand-over         PR title + commit
 │
 ▼
you commit, push and open the PR
\`\`\``;

let text = fs.readFileSync(SRC, 'utf8');

const replaceOnce = (pattern, replacement, what) => {
  if (!pattern.test(text)) throw new Error(`build-npm-readme: could not find ${what} in README.md`);
  text = text.replace(pattern, replacement);
};

replaceOnce(
  /<picture>[\s\S]*?<\/picture>/,
  `<img src="${RAW}assets/mark-light.svg" alt="The Super Power Team" width="64" height="64">`,
  'the <picture> logo'
);
replaceOnce(/```mermaid[\s\S]*?```/, WORKFLOW, 'the Mermaid workflow chart');
replaceOnce(/Every diamond is a stop\./, 'Every ✋ is a stop: nothing moves on until you approve.', 'the workflow caption');

text = text
  .replace(/\]\(assets\//g, `](${RAW}assets/`)
  .replace(/(src|srcset)="assets\//g, `$1="${RAW}assets/`)
  .replace(/href="(LICENSE|CHANGELOG\.md)"/g, `href="${BLOB}$1"`)
  .replace(/\]\((LICENSE|CHANGELOG\.md)\)/g, `](${BLOB}$1)`);

const header =
  '<!-- Generated from the repository README by scripts/build-npm-readme.js. Edit README.md, not this file. -->\n';
fs.writeFileSync(DST, header + text);
console.log(`build-npm-readme: wrote ${path.relative(ROOT, DST)}`);
