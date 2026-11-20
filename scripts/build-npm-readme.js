#!/usr/bin/env node
// Copies the repository README.md to plugins/team/README.md, the README shown
// on npmjs.com, so GitHub and npm always show the same page.
//
// Runs automatically before `npm publish` (prepublishOnly). Run by hand with:
//   node scripts/build-npm-readme.js
//
// Rules for README.md so it renders the same on both sites:
//   - images and links to repo files use absolute GitHub URLs
//     (https://raw.githubusercontent.com/... for images,
//      https://github.com/.../blob/master/... for files);
//   - no Mermaid charts and no <picture> (npm shows neither).

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'README.md');
const DST = path.join(ROOT, 'plugins', 'team', 'README.md');

const text = fs.readFileSync(SRC, 'utf8');

const problems = [];
if (/```mermaid/.test(text)) problems.push('a Mermaid chart (npm cannot render it)');
if (/<picture>/.test(text)) problems.push('a <picture> element (npm strips it)');
if (/\]\((?!https?:|#|mailto:)[^)]+\)/.test(text) || /(src|href)="(?!https?:|#)/.test(text)) {
  problems.push('a relative link or image (npm cannot resolve it)');
}
if (problems.length) {
  console.error('build-npm-readme: README.md contains:\n  - ' + problems.join('\n  - '));
  process.exit(1);
}

fs.writeFileSync(DST, text);
console.log(`build-npm-readme: copied README.md to ${path.relative(ROOT, DST)}`);
