> Configures the Ralph Wiggum AFK development loop with TDD integration and GitHub issue tracking

# Ralph Setup

You configure the Ralph Wiggum Loop — an autonomous AFK development cycle that works through GitHub issues using TDD, then stops cleanly when done or blocked.

## Trigger

Invoke with `/ralph-setup [--issue <number>] [--dry-run]`

## What is the Ralph Loop

Ralph Wiggum works until he's done or confused, then sits quietly. He doesn't hallucinate progress. He doesn't fake commits. When blocked, he stops and reports.

The loop is:
1. Fetch next open GitHub issue assigned to current context
2. Run Deep Grill on the issue description (abbreviated — skip docs generation)
3. Implement using TDD Master cycle
4. Commit with Safe Human Commit (--human flag always on)
5. Open PR with structured description
6. Move to next issue or stop if blocked

## Step 1 — Pre-flight Check

Before configuring anything, verify:

```bash
# Check required tools
which gh          # GitHub CLI — required
gh auth status    # Must be authenticated
git status        # Must be on a clean branch or feature branch

# Check for CLAUDE.md
ls CLAUDE.md

# Check existing .claude/settings.json
cat .claude/settings.json 2>/dev/null || echo "not found"
```

If any check fails, stop and report what needs to be fixed. Do not proceed.

## Step 2 — Configure Cron Loop

Write the following to `.claude/settings.json` (merge with existing, don't overwrite unrelated keys):

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(gh *)",
      "Bash(npm run *)",
      "Bash(npx jest *)"
    ]
  },
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/ralph-heartbeat.js"
          }
        ]
      }
    ]
  }
}
```

## Step 3 — Write Ralph Heartbeat Script

Create `.claude/ralph-heartbeat.js`:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

const LOG = '.claude/ralph.log';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG, line);
  process.stdout.write(line);
}

function getNextIssue() {
  try {
    const out = execSync('gh issue list --assignee @me --state open --json number,title,labels --limit 1', { encoding: 'utf8' });
    const issues = JSON.parse(out);
    return issues[0] || null;
  } catch {
    return null;
  }
}

function hasUncommittedChanges() {
  const out = execSync('git status --porcelain', { encoding: 'utf8' });
  return out.trim().length > 0;
}

const issue = getNextIssue();

if (!issue) {
  log('RALPH: No open issues assigned to me. Stopping.');
  process.exit(0);
}

if (hasUncommittedChanges()) {
  log(`RALPH: Uncommitted changes detected. Stopping before picking up issue #${issue.number}.`);
  process.exit(0);
}

log(`RALPH: Next issue #${issue.number} — ${issue.title}`);
```

## Step 4 — GitHub Issue Label Convention

For Ralph to work correctly, issues must use these labels:

| Label | Meaning |
|-------|---------|
| `ralph:ready` | Issue is ready for autonomous work |
| `ralph:blocked` | Ralph stopped here — needs human review |
| `ralph:in-progress` | Currently being worked on |
| `ralph:done` | Completed by Ralph |

Create labels if they don't exist:
```bash
gh label create "ralph:ready" --color "0075ca" --description "Ready for autonomous work"
gh label create "ralph:blocked" --color "e4e669" --description "Blocked — needs human"
gh label create "ralph:in-progress" --color "d93f0b" --description "Ralph is working on this"
gh label create "ralph:done" --color "0e8a16" --description "Completed by Ralph"
```

## Step 5 — Issue Format for Ralph

For Ralph to process an issue autonomously, it needs this structure in the body:

```markdown
## What
[One sentence — what to implement]

## Acceptance Criteria
- [ ] AC1
- [ ] AC2

## Technical Notes
[Any hints about where in the codebase to look]

## Definition of Done
- [ ] Tests passing
- [ ] No lint errors
- [ ] PR description includes test coverage delta
```

If the current issue is missing this structure, rewrite it using `/deep-grill` first.

## Step 6 — Dry Run Mode

With `--dry-run`:
- Do not write any files
- Do not create labels
- Print a summary of what would be configured
- Show the next issue Ralph would pick up

## Ralph's Rules

Ralph never:
- Commits without tests passing
- Force-pushes
- Closes issues himself (humans review PRs and close)
- Works past midnight (configurable via `RALPH_STOP_HOUR` env var)
- Ignores a failing CI check

Ralph always:
- Commits with `--human` flag
- Leaves a comment on the issue when he picks it up
- Labels the issue `ralph:in-progress` at start, `ralph:blocked` if he stops
- Writes a PR that references the issue (`Closes #N`)

## Completion

After setup, show:
```
Ralph Wiggum Loop configured.

Next issue:  #N — [title]
Loop starts: on next Claude Code session Stop event
Log file:    .claude/ralph.log

Run  gh issue list --label ralph:ready  to see the queue.
Run  tail -f .claude/ralph.log          to watch Ralph work.
```
