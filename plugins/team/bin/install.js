#!/usr/bin/env node
// The Super Power Team — npm installer for the Claude Code plugin.
//
//   npx the-super-power-team            install, or update to this version
//   npx the-super-power-team uninstall  remove the plugin and its files
//   npx the-super-power-team help       show this help
//
// Claude Code installs plugins from marketplaces. This script copies the
// plugin from the npm package into a local marketplace folder in
// ~/.claude/the-super-power-team and registers it with the `claude` CLI.
// No git, GitHub account or /plugin commands needed.

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const pkg = require('../package.json');

const MARKETPLACE = 'the-super-power-team';
const PLUGIN = 'team';
const PLUGIN_ID = `${PLUGIN}@${MARKETPLACE}`;
const OLD_PLUGIN_ID = 'team@my-super-team';
const PKG_ROOT = path.resolve(__dirname, '..');
const PLUGIN_PARTS = ['.claude-plugin', '.mcp.json', 'agents', 'skills', 'hooks'];
const HOME_DIR = path.join(os.homedir(), '.claude', MARKETPLACE);
const PLUGIN_DIR = path.join(HOME_DIR, 'plugins', PLUGIN);

const isTTY = process.stdout.isTTY;
const c = (code, s) => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = (s) => c(1, s);
const dim = (s) => c(2, s);
const green = (s) => c(32, s);
const yellow = (s) => c(33, s);
const red = (s) => c(31, s);

const step = (s) => console.log(`${green('›')} ${s}`);
const warn = (s) => console.log(`${yellow('!')} ${s}`);
const fail = (s) => {
  console.error(`${red('✗')} ${s}`);
  process.exit(1);
};

function claude(args, { quiet = false } = {}) {
  const r = spawnSync('claude', args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: quiet ? 'pipe' : ['ignore', 'pipe', 'pipe'],
  });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || r.error?.message || '').trim() };
}

function claudeJson(args) {
  const r = claude([...args, '--json'], { quiet: true });
  if (!r.ok) return [];
  try {
    return JSON.parse(r.out);
  } catch {
    return [];
  }
}

function hasClaude() {
  return claude(['--version'], { quiet: true }).ok;
}

function copyPlugin() {
  fs.rmSync(PLUGIN_DIR, { recursive: true, force: true });
  fs.mkdirSync(PLUGIN_DIR, { recursive: true });
  for (const part of PLUGIN_PARTS) {
    const from = path.join(PKG_ROOT, part);
    if (!fs.existsSync(from)) fail(`Package is incomplete: missing ${part}`);
    fs.cpSync(from, path.join(PLUGIN_DIR, part), { recursive: true });
  }

  const manifest = {
    name: MARKETPLACE,
    owner: { name: typeof pkg.author === 'string' ? pkg.author : 'The Super Power Team' },
    description: 'The Super Power Team, installed from npm.',
    plugins: [
      {
        name: PLUGIN,
        source: `./plugins/${PLUGIN}`,
        version: pkg.version,
        description: pkg.description,
      },
    ],
  };
  fs.mkdirSync(path.join(HOME_DIR, '.claude-plugin'), { recursive: true });
  fs.writeFileSync(
    path.join(HOME_DIR, '.claude-plugin', 'marketplace.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
}

function printManual() {
  console.log(`
${bold('Finish in Claude Code')} ${dim('(the `claude` command was not found on your PATH)')}

  /plugin marketplace add ${HOME_DIR}
  /plugin install ${PLUGIN_ID}

Then start a new session and run ${bold('/team-setup')}.`);
}

function install() {
  console.log(`\n${bold('The Super Power Team')} ${dim('v' + pkg.version)}\n`);

  step(`Copying the plugin to ${HOME_DIR}`);
  copyPlugin();

  if (!hasClaude()) {
    printManual();
    return;
  }

  const marketplaces = claudeJson(['plugin', 'marketplace', 'list']);
  const known = marketplaces.some((m) => m.name === MARKETPLACE);

  if (known) {
    step('Refreshing the marketplace');
    const r = claude(['plugin', 'marketplace', 'update', MARKETPLACE]);
    if (!r.ok) fail(`Could not refresh the marketplace:\n${r.err || r.out}`);
  } else {
    step('Adding the marketplace to Claude Code');
    const r = claude(['plugin', 'marketplace', 'add', HOME_DIR]);
    if (!r.ok) fail(`Could not add the marketplace:\n${r.err || r.out}`);
  }

  const plugins = claudeJson(['plugin', 'list']);
  const installed = plugins.find((p) => p.id === PLUGIN_ID);
  const verb = installed ? 'update' : 'install';

  step(installed ? `Updating ${PLUGIN_ID} (was ${installed.version})` : `Installing ${PLUGIN_ID}`);
  const r = claude(['plugin', verb, PLUGIN_ID]);
  if (!r.ok) fail(`Could not ${verb} the plugin:\n${r.err || r.out}`);

  if (plugins.some((p) => p.id === OLD_PLUGIN_ID)) {
    warn(
      `The GitHub version (${OLD_PLUGIN_ID}) is also installed. Remove it to avoid duplicate commands:\n` +
        `    claude plugin uninstall ${OLD_PLUGIN_ID}`
    );
  }

  console.log(`
${green('✓')} ${bold(installed ? 'Updated.' : 'Installed.')}

Next:
  1. Start a new Claude Code session in your project.
  2. Run ${bold(installed ? '/team-update' : '/team-setup')}${installed ? ' to bring the project files up to date.' : ' once.'}
  3. Run ${bold('/team-work')} to start.
`);
}

function uninstall() {
  console.log(`\n${bold('The Super Power Team')} — uninstall\n`);
  if (hasClaude()) {
    const plugins = claudeJson(['plugin', 'list']);
    if (plugins.some((p) => p.id === PLUGIN_ID)) {
      step(`Uninstalling ${PLUGIN_ID}`);
      const r = claude(['plugin', 'uninstall', PLUGIN_ID]);
      if (!r.ok) warn(r.err || r.out);
    }
    const marketplaces = claudeJson(['plugin', 'marketplace', 'list']);
    if (marketplaces.some((m) => m.name === MARKETPLACE)) {
      step('Removing the marketplace');
      const r = claude(['plugin', 'marketplace', 'remove', MARKETPLACE]);
      if (!r.ok) warn(r.err || r.out);
    }
  } else {
    warn('`claude` not found. In Claude Code, run:');
    console.log(`    /plugin uninstall ${PLUGIN_ID}\n    /plugin marketplace remove ${MARKETPLACE}`);
  }
  step(`Deleting ${HOME_DIR}`);
  fs.rmSync(HOME_DIR, { recursive: true, force: true });
  console.log(`\n${green('✓')} Removed. Your projects' .claude/team/ files were not touched.\n`);
}

function help() {
  console.log(`
${bold('The Super Power Team')} ${dim('v' + pkg.version)}

Usage:
  npx the-super-power-team              Install, or update to this version
  npx the-super-power-team@latest       Update to the newest version
  npx the-super-power-team uninstall    Remove the plugin
  npx the-super-power-team help         Show this help

Plugin files: ${HOME_DIR}
`);
}

const cmd = (process.argv[2] || 'install').toLowerCase();
if (cmd === 'install' || cmd === 'update') install();
else if (cmd === 'uninstall' || cmd === 'remove') uninstall();
else if (cmd === 'help' || cmd === '--help' || cmd === '-h') help();
else fail(`Unknown command "${cmd}". Run: npx the-super-power-team help`);
