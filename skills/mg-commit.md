> Generates Conventional Commits messages from staged changes. --human flag removes AI tells.

# Safe Human Commit

Generates terse, noise-free commit messages in Conventional Commits format.

**Output is the message only — no git operations are performed.**

## Trigger

`/mg-safe-human-commit [--human] [--scope <scope>] [--breaking]`

---

## Rules

**Subject line:**
- ≤50 characters (hard max 72)
- Imperative mood: "add", "fix", "remove", "move", "update", "use", "change"
- No period at the end
- Lowercase after the type prefix

**Body:**
- Included only when the *why* isn't self-evident from the diff
- Always include for: breaking changes, security fixes, data migrations, non-obvious decisions
- Wrapped at 72 characters
- Issue references at the end: `Closes #42` or `Refs #17`

**Never include:**
- "This commit does X"
- First-person pronouns
- "Generated with Claude Code" or any attribution
- Padding phrases: "in order to", "so that we can", "this change"

---

## Types

| Type | Use when |
|------|----------|
| `feat` | New capability |
| `fix` | Bug fix |
| `refactor` | No behavior change |
| `test` | Tests only |
| `chore` | Build, deps, tooling, config |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `style` | Formatting, no logic change |

---

## Format

```
type(scope): short summary

Optional body explaining WHY — not what, the diff shows that.

Closes #N
```

---

## --human Flag

With `--human`: write as a developer explaining a change to a teammate, not as a report.

Avoid: "implement", "utilize", "leverage", "facilitate", "streamline", "enhance", "ensure"
Use: "add", "fix", "stop", "move", "drop", "use", "change", "skip"

The body should read like a Slack message, not a PR description template.

```
# Standard
feat(auth): add refresh token rotation on login

Prevents token reuse attacks by invalidating previous refresh token
on each successful exchange. Tokens now use a 30-minute sliding window.

Closes #142

# --human
fix(users): stop password reset from clobbering active sessions

Reset flow was logging out online users during the request window.
Now only the token used for reset gets invalidated.

Closes #89
```

---

## Breaking Changes

With `--breaking`, or when the diff modifies a public contract:

```
feat(api)!: change pagination from offset to cursor-based

BREAKING CHANGE: `page` and `limit` params replaced by `cursor`.
Clients must update to use the new cursor response field.

Refs #201
```

---

## Step-by-Step

1. Read `git diff --cached` and `git status`
2. If nothing staged: show what's unstaged and suggest what to stage
3. Classify the change (type + scope)
4. Draft the message following the rules above
5. Output **only** the message as a code block — ready to copy-paste

Do not run `git commit`. Do not stage files. Do not amend unless explicitly asked.
