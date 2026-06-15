const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function getAvailableSkills() {
  return fs.readdirSync(SKILLS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

function getSkillMeta(skillName) {
  const file = path.join(SKILLS_DIR, `${skillName}.md`);
  if (!fs.existsSync(file)) return null;
  const content = fs.readFileSync(file, 'utf8');
  const descMatch = content.match(/^>\s*(.+)$/m);
  return {
    name: skillName,
    description: descMatch ? descMatch[1] : '—',
    file,
  };
}

function ensureDir(dir) {
  if (fs.existsSync(dir)) return;
  ensureDir(path.dirname(dir));
  fs.mkdirSync(dir);
}

function copyFile(src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(src));
}

function installSkills(targetDir, skillNames, options) {
  options = options || {};
  const commandsDir = path.join(targetDir, '.claude', 'commands');
  ensureDir(commandsDir);

  const results = [];
  for (var i = 0; i < skillNames.length; i++) {
    var name = skillNames[i];
    var src = path.join(SKILLS_DIR, name + '.md');
    if (!fs.existsSync(src)) {
      results.push({ name: name, status: 'not-found' });
      continue;
    }
    var dest = path.join(commandsDir, name + '.md');
    var existed = fs.existsSync(dest);
    if (existed && !options.overwrite) {
      results.push({ name: name, status: 'skipped' });
      continue;
    }
    copyFile(src, dest);
    results.push({ name: name, status: existed ? 'updated' : 'installed' });
  }
  return results;
}

function installClaudeMd(targetDir, options) {
  options = options || {};
  var dest = path.join(targetDir, 'CLAUDE.md');
  var existed = fs.existsSync(dest);
  if (existed && !options.overwrite) return 'skipped';
  var src = path.join(TEMPLATES_DIR, 'CLAUDE.md');
  copyFile(src, dest);
  return existed ? 'updated' : 'installed';
}

function installSettings(targetDir, options) {
  options = options || {};
  var dir = path.join(targetDir, '.claude');
  ensureDir(dir);
  var dest = path.join(dir, 'settings.json');
  if (fs.existsSync(dest) && !options.overwrite) return 'skipped';
  var src = path.join(TEMPLATES_DIR, 'settings.json');
  copyFile(src, dest);
  return 'installed';
}

module.exports = { getAvailableSkills, getSkillMeta, installSkills, installClaudeMd, installSettings };
