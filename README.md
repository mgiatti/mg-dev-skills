# mg-dev-skills

Claude Code skill pack for NestJS/TypeScript projects. Install a curated set of AI development skills into any project in one command.

```bash
npx mg-dev-skills init
```

---

## Skills

| Command | Description |
|---------|-------------|
| `/deep-grill` | Deep technical discussion → PRD.md, SPEC.md, ARCHITECTURE.md, GitHub issues |
| `/tdd-master` | Strict Red-Green-Refactor TDD workflow |
| `/safe-human-commit` | Conventional Commits with `--human` mode |
| `/ralph-setup` | AFK autonomous development loop with TDD + GitHub |
| `/best-practices` | Clean Architecture, SOLID, NestJS, security, performance review |
| `/caveman-lite` | Token-optimized mode for long autonomous loops |

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
npx mg-dev-skills init --skills deep-grill,tdd-master,safe-human-commit
```

### Add a single skill

```bash
npx mg-dev-skills add best-practices
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

### `/deep-grill`

Runs a structured discovery session on a feature or problem. Works through four question groups (problem, scope, technical reality, dependencies), then generates:

- **PRD.md** — problem statement, user stories, success metrics
- **SPEC.md** — API contract, data model, sequence diagram, rollout plan
- **ARCHITECTURE.md** — component diagram, tech decisions, risks

Then optionally breaks work into GitHub issues with estimates, labels, and dependency ordering.

```
/deep-grill user authentication with SSO
```

---

### `/tdd-master`

Enforces the three laws of TDD throughout the session:

1. No production code without a failing test
2. No more test code than needed to fail
3. No more production code than needed to pass

Reports each cycle: `[RED] → [GREEN] → [REFACTOR]`. Includes NestJS/Jest boilerplate and naming conventions.

```
/tdd-master UserService.getUser()
```

---

### `/safe-human-commit`

Analyzes staged changes and generates a Conventional Commits message. With `--human`:

- Uses natural developer language
- Avoids AI vocabulary ("leverage", "utilize", "implement", "streamline")
- Confirms before committing

```
/safe-human-commit --human
/safe-human-commit --breaking --scope auth
```

---

### `/ralph-setup`

Configures the Ralph Wiggum Loop — an autonomous AFK development cycle that:

1. Fetches the next GitHub issue labeled `ralph:ready`
2. Implements it using TDD
3. Commits with `--human` flag
4. Opens a PR and moves to the next issue
5. Stops cleanly if blocked (never fakes progress)

```
/ralph-setup
/ralph-setup --dry-run
```

---

### `/best-practices`

Reviews code across five dimensions with `[CRITICAL]` / `[HIGH]` / `[MEDIUM]` / `[LOW]` severity:

1. Clean Architecture boundaries
2. SOLID principles
3. NestJS patterns (modules, guards, pipes, config)
4. Security (validation, auth, injection, secrets, rate limiting)
5. Performance (N+1, missing indexes, queue candidates)

```
/best-practices src/orders/
/best-practices                  # reviews files changed since last commit
```

---

### `/caveman-lite`

Activates token-saving mode for the session:

- No prose — code blocks only
- No summaries of what was done
- No alternatives considered
- Deactivate with `/caveman-off`

```
/caveman-lite
```

---

## What Gets Installed

```
your-project/
├── CLAUDE.md                        ← project instructions for Claude
├── .claude/
│   ├── settings.json                ← pre-approved bash commands
│   └── commands/
│       ├── deep-grill.md
│       ├── tdd-master.md
│       ├── safe-human-commit.md
│       ├── ralph-setup.md
│       ├── best-practices.md
│       └── caveman-lite.md
```

Skills in `.claude/commands/` are automatically available as slash commands in Claude Code.

---

## Requirements

- Node.js 18+
- Claude Code CLI
- `gh` CLI (for `/ralph-setup` and GitHub issue features)

---

## License

MIT
