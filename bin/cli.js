#!/usr/bin/env node
'use strict';

const path = require('path');
const { getAvailableSkills, getSkillMeta, installSkills, installClaudeMd, installSettings } = require('../lib/installer');

const BOLD = (s) => `\x1b[1m${s}\x1b[0m`;
const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const CYAN = (s) => `\x1b[36m${s}\x1b[0m`;
const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;

const STATUS_ICON = {
  installed: GREEN('✔'),
  updated: YELLOW('↑'),
  skipped: DIM('–'),
  'not-found': RED('✖'),
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const [key, val] = args[i].slice(2).split('=');
      flags[key] = val !== undefined ? val : (args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true);
    } else {
      positional.push(args[i]);
    }
  }
  return { command: positional[0], rest: positional.slice(1), flags };
}

function printHelp() {
  console.log(`
${BOLD('mg-dev-skills')} — Claude Code skill pack for NestJS/TypeScript projects

${BOLD('USAGE')}
  npx mg-dev-skills <command> [options]

${BOLD('COMMANDS')}
  ${CYAN('init')}          Install all skills + CLAUDE.md + settings into current project
  ${CYAN('add')} <skill>   Install one or more specific skills (comma-separated)
  ${CYAN('list')}          List all available skills
  ${CYAN('help')}          Show this help

${BOLD('OPTIONS')}
  --skills <names>   Comma-separated skills to install (used with init)
  --overwrite        Overwrite existing files
  --no-claude-md     Skip CLAUDE.md template
  --no-settings      Skip .claude/settings.json template
  --target <dir>     Target directory (default: current directory)

${BOLD('EXAMPLES')}
  npx mg-dev-skills init
  npx mg-dev-skills init --skills deep-grill,tdd-master
  npx mg-dev-skills add safe-human-commit
  npx mg-dev-skills list
`);
}

function printList() {
  const skills = getAvailableSkills();
  console.log(`\n${BOLD('Available skills')} (${skills.length})\n`);
  for (const name of skills) {
    const meta = getSkillMeta(name);
    console.log(`  ${CYAN('/' + name.padEnd(22))} ${meta.description}`);
  }
  console.log(`\n${DIM('Install with: npx mg-dev-skills add <skill>')}\n`);
}

function runInit({ target, skillNames, overwrite, claudeMd, settings }) {
  console.log(`\n${BOLD('mg-dev-skills')} › installing into ${CYAN(target)}\n`);

  if (claudeMd) {
    const r = installClaudeMd(target, { overwrite });
    console.log(`  ${STATUS_ICON[r] || STATUS_ICON.skipped} CLAUDE.md`);
  }

  if (settings) {
    const r = installSettings(target, { overwrite });
    console.log(`  ${STATUS_ICON[r] || STATUS_ICON.skipped} .claude/settings.json`);
  }

  if (skillNames.length) {
    console.log();
    const results = installSkills(target, skillNames, { overwrite });
    for (const r of results) {
      console.log(`  ${STATUS_ICON[r.status]} .claude/commands/${r.name}.md`);
    }
  }

  console.log(`\n${GREEN('Done!')} Invoke skills in Claude Code with ${CYAN('/skill-name')}\n`);
}

function runAdd({ target, names, overwrite }) {
  if (!names.length) {
    console.error(RED('Error: specify at least one skill name'));
    process.exit(1);
  }
  console.log(`\n${BOLD('mg-dev-skills')} › adding skills to ${CYAN(target)}\n`);
  const results = installSkills(target, names, { overwrite });
  for (const r of results) {
    console.log(`  ${STATUS_ICON[r.status]} .claude/commands/${r.name}.md`);
  }
  const missing = results.filter(r => r.status === 'not-found');
  if (missing.length) {
    console.log(`\n${YELLOW('Not found:')} ${missing.map(r => r.name).join(', ')}`);
    console.log(`Run ${CYAN('npx mg-dev-skills list')} to see available skills.\n`);
  } else {
    console.log();
  }
}

function main() {
  const { command, rest, flags } = parseArgs(process.argv);
  const target = path.resolve(flags.target || process.cwd());
  const overwrite = !!flags.overwrite;

  switch (command) {
    case 'list':
      printList();
      break;

    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      break;

    case 'init': {
      const all = getAvailableSkills();
      const skillNames = flags.skills
        ? flags.skills.split(',').map(s => s.trim())
        : all;
      runInit({
        target,
        skillNames,
        overwrite,
        claudeMd: flags['claude-md'] !== false && flags['no-claude-md'] !== true,
        settings: flags['settings'] !== false && flags['no-settings'] !== true,
      });
      break;
    }

    case 'add': {
      const names = rest.length
        ? rest.reduce((acc, n) => acc.concat(n.split(',')), [])
        : (flags.skills ? flags.skills.split(',').map(s => s.trim()) : []);
      runAdd({ target, names, overwrite });
      break;
    }

    default:
      console.error(RED(`Unknown command: ${command}`));
      printHelp();
      process.exit(1);
  }
}

main();
