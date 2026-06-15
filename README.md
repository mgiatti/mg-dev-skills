# mg-dev-skills

Claude Code skill pack for any software project. Install a curated set of AI development skills into any project in one command.

```bash
npx mg-dev-skills init
```

---

## Skills

| Command | Description |
|---------|-------------|
| `/mg-grill` | Deep technical discussion → PRD.md, SPEC.md, ARCHITECTURE.md, GitHub issues |
| `/mg-tdd` | Strict Red-Green-Refactor TDD workflow |
| `/mg-commit` | Conventional Commits with `--human` mode |
| `/mg-ralph` | AFK autonomous development loop with TDD + GitHub |
| `/mg-practices` | Architecture, SOLID, security, and performance review |
| `/mg-caveman` | Token-optimized mode for long autonomous loops |

---

## Installation

### Install all skills into a project

```bash
cd my-project
npx mg-dev-skills init
```

This copies all skills to `.claude/commands/`, adds a `CLAUDE.md` template, and sets up `.claude/settings.json`.

### Install specific skills only

```bash
npx mg-dev-skills init --skills mg-grill,mg-tdd,mg-commit
```

### Add a single skill

```bash
npx mg-dev-skills add mg-practices
```

### List available skills

```bash
npx mg-dev-skills list
```

### Options

| Flag | Description |
|------|-------------|
| `--skills <names>` | Comma-separated skills to install (with `init`) |
| `--overwrite` | Overwrite existing skill files |
| `--no-claude-md` | Skip CLAUDE.md template |
| `--no-settings` | Skip `.claude/settings.json` |
| `--target <dir>` | Install into a specific directory |

---

## Skills in Detail

### `/mg-grill`

Runs a structured discovery session on a feature or problem. Works through domain terminology, edge cases, and technical reality, then generates:

- **PRD.md** — problem statement, user stories, success metrics
- **SPEC.md** — API contract, data model, sequence diagram, rollout plan
- **ARCHITECTURE.md** — component diagram, tech decisions, risks

Then optionally breaks work into GitHub issues with estimates, labels, and dependency ordering.

```
/mg-grill user authentication with SSO
```

---

### `/mg-tdd`

Enforces the three laws of TDD throughout the session:

1. No production code without a failing test
2. No more test code than needed to fail
3. No more production code than needed to pass

Reports each cycle: `[RED] → [GREEN] → [REFACTOR]`. Language and framework agnostic — uses pseudocode examples.

```
/mg-tdd UserService.getUser()
```

---

### `/mg-commit`

Analyzes staged changes and generates a Conventional Commits message. With `--human`:

- Uses natural developer language
- Avoids AI vocabulary ("leverage", "utilize", "implement", "streamline")
- Confirms before committing

```
/mg-commit --human
/mg-commit --breaking --scope auth
```

---

### `/mg-ralph`

Configures the Ralph Wiggum Loop — an autonomous AFK development cycle that:

1. Fetches the next GitHub issue labeled `ralph:ready`
2. Implements it using TDD
3. Commits with `--human` flag
4. Opens a PR and moves to the next issue
5. Stops cleanly if blocked (never fakes progress)

```
/mg-ralph
/mg-ralph --dry-run
```

---

### `/mg-practices`

Reviews code across five dimensions with `[CRITICAL]` / `[HIGH]` / `[MEDIUM]` / `[LOW]` severity:

1. Architectural boundaries (Clean Architecture / Hexagonal)
2. Design principles (SOLID, cohesion, coupling)
3. Development lifecycle (testability, observability, error handling, config)
4. Security (input validation, auth, injection, secrets, least privilege)
5. Performance and reliability (algorithmic cost, I/O patterns, failure modes)

Language and framework agnostic.

```
/mg-practices src/orders/
/mg-practices                  # reviews files changed since last commit
```

---

### `/mg-caveman`

Activates token-saving mode for the session:

- No prose — code blocks only
- No summaries of what was done
- No alternatives considered
- Deactivate with `/mg-caveman-off`

```
/mg-caveman
```

---

## What Gets Installed

```
your-project/
├── CLAUDE.md                        ← project instructions for Claude
├── .claude/
│   ├── settings.json                ← pre-approved bash commands
│   └── commands/
│       ├── mg-grill.md
│       ├── mg-tdd.md
│       ├── mg-commit.md
│       ├── mg-ralph.md
│       ├── mg-practices.md
│       └── mg-caveman.md
```

Skills in `.claude/commands/` are automatically available as slash commands in Claude Code.

---

## Requirements

- Node.js 18+
- Claude Code CLI
- `gh` CLI (for `/mg-ralph` and GitHub issue features)

---

## License

MIT
