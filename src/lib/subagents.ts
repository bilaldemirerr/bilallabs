export type Tool =
  | "Read"
  | "Write"
  | "Edit"
  | "Bash"
  | "Grep"
  | "Glob"
  | "WebFetch"
  | "WebSearch";

export type Subagent = {
  slug: string;
  title: string;
  /** Meta description, ~150 chars. */
  summary: string;
  /** Frontmatter `description` — the delegation trigger. */
  description: string;
  tools: Tool[];
  model: "sonnet" | "opus" | "haiku" | "inherit";
  prompt: string;
  intro: string;
  when: string;
  pitfalls: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const SUBAGENTS_BASE = "/ai/subagents";
export const subagentPath = (slug: string) => `${SUBAGENTS_BASE}/${slug}`;

const WRITE_TOOLS: Tool[] = ["Write", "Edit"];
// Descriptions often contain ": ", which is invalid in unquoted YAML.
const yamlStr = (s: string) => JSON.stringify(s.replace(/^(["'])(.*)\1$/, "$2"));

export const isReadonly = (tools: string[]) =>
  !tools.some((t) => (WRITE_TOOLS as string[]).includes(t));

export function renderClaude(a: Pick<Subagent, "slug" | "description" | "tools" | "model" | "prompt">) {
  return `---
name: ${a.slug}
description: ${yamlStr(a.description)}
tools: ${a.tools.join(", ")}
model: ${a.model}
---

${a.prompt}
`;
}

export function renderCursor(a: Pick<Subagent, "slug" | "description" | "tools" | "prompt">) {
  return `---
name: ${a.slug}
description: ${yamlStr(a.description)}
model: inherit
readonly: ${isReadonly(a.tools)}
---

${a.prompt}
`;
}

// ponytail: flat `key: value` + `- item` lists only; no nested YAML (hooks, mcpServers). Swap in a YAML parser if nested fields are needed.
export function parseFrontmatter(text: string) {
  const m = text.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const fields: Record<string, string> = {};
  let listKey = "";
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && listKey) {
      fields[listKey] = fields[listKey] ? `${fields[listKey]}, ${item[1].trim()}` : item[1].trim();
      continue;
    }
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) {
      listKey = kv[2] ? "" : kv[1];
      fields[kv[1]] = kv[2].trim();
    }
  }
  return { fields, body: m[2].trim() };
}

const CLAUDE_TO_CURSOR_DROPPED = [
  "tools",
  "disallowedTools",
  "permissionMode",
  "mcpServers",
  "hooks",
  "maxTurns",
  "skills",
  "memory",
  "effort",
  "isolation",
  "color",
  "initialPrompt",
];

export type Converted = { output: string; notes: string[] } | { error: string };

export function convert(text: string, to: "cursor" | "claude"): Converted {
  const parsed = parseFrontmatter(text);
  if (!parsed) return { error: "No YAML frontmatter found. The file must start with --- on the first line." };
  const { fields, body } = parsed;
  if (!fields.description) return { error: "Missing `description` — both tools use it to decide when to delegate." };
  const name = fields.name || "my-subagent";
  const notes: string[] = [];
  const lines = ["---", `name: ${name}`, `description: ${yamlStr(fields.description ?? "")}`];

  if (to === "cursor") {
    const tools = fields.tools ? fields.tools.split(",").map((t) => t.trim()) : null;
    const denied = fields.disallowedTools?.split(",").map((t) => t.trim()) ?? [];
    const readonly = tools ? isReadonly(tools) : WRITE_TOOLS.every((t) => denied.includes(t));
    lines.push("model: inherit", `readonly: ${readonly}`);
    if (fields.model && fields.model !== "inherit")
      notes.push(`model "${fields.model}" is a Claude alias; set to inherit. Put a Cursor model ID here if you want a fixed model.`);
    if (fields.background === "true") lines.push("is_background: true");
    const dropped = CLAUDE_TO_CURSOR_DROPPED.filter((k) => k in fields);
    if (dropped.length)
      notes.push(`Cursor has no equivalent for: ${dropped.join(", ")}. Tool access is reduced to readonly: ${readonly}.`);
  } else {
    if (fields.readonly === "true") {
      lines.push("tools: Read, Grep, Glob, Bash", "disallowedTools: Write, Edit");
      notes.push("readonly: true mapped to a tools allowlist. Bash is kept for git diff/tests; remove it for strictly read-only.");
    }
    lines.push(`model: ${fields.model && fields.model !== "inherit" ? fields.model : "inherit"}`);
    if (fields.model && !["inherit", "sonnet", "opus", "haiku"].includes(fields.model))
      notes.push(`model "${fields.model}" may not be a valid Claude model; use sonnet, opus, haiku or inherit.`);
    if (fields.is_background === "true") lines.push("background: true");
  }
  lines.push("---", "", body, "");
  return { output: lines.join("\n"), notes };
}

export const SUBAGENTS: Subagent[] = [
  {
    slug: "code-reviewer",
    title: "Code Reviewer",
    summary: "Copy-paste code reviewer subagent for Claude Code (.claude/agents) and Cursor (.cursor/agents): read-only, reviews git diff, reports by severity.",
    description: "Reviews uncommitted or branch changes for bugs, regressions and missing tests. Use proactively after finishing a feature and before committing.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You are a strict senior code reviewer for this repository.

When invoked:
1. Run \`git diff --staged\`; if empty, run \`git diff\`, then \`git diff main...HEAD\`.
2. Read every changed file in full, plus its tests.
3. Check the change against the conventions in AGENTS.md / CLAUDE.md.

Look for, in order: correctness bugs, security issues, unhandled errors, behavior changes without tests, needless complexity.

Report findings grouped as Critical / Warning / Suggestion. For each: file:line, the problem, a concrete fix.
If the diff is clean, say so in one line. Never comment on code the diff does not touch. Do not edit files.`,
    intro: "The code reviewer is the most common first subagent. It runs in its own context window, reads the diff and the surrounding files, and hands back a short prioritized list instead of flooding your main conversation with file contents.",
    when: "Run it after the main agent says a task is done, before you commit, or as the last step of a plan. It is also useful on someone else's branch: ask it to review main...feature-branch.",
    pitfalls: [
      "Giving it Write or Edit. A reviewer that can fix things stops reviewing and starts rewriting. Keep it read-only and let the main agent apply fixes.",
      "A vague description like \"reviews code\". The description is the routing signal; say when to use it (\"after finishing a feature, before committing\") or it will rarely be picked automatically.",
      "No scope limit. Without \"never comment on code the diff does not touch\" you get style nits on the whole file.",
    ],
    faqs: [
      { q: "Can the code reviewer run git commands if it is read-only?", a: "Yes. In Claude Code, Bash is in the tools list so git diff works, and Write/Edit are absent so it cannot change files. In Cursor, readonly: true blocks file edits and state-changing shell commands but still allows read-only commands like git diff." },
      { q: "Which model should a code reviewer use?", a: "Sonnet is the usual cost/quality balance in Claude Code. For security-sensitive code, switch the model to opus. In Cursor, leave model: inherit or set a specific model ID." },
      { q: "How do I trigger it manually?", a: "In Claude Code, @-mention it or say \"use the code-reviewer subagent on my staged changes\". In Cursor, type /code-reviewer or ask for it by name." },
    ],
    related: ["security-auditor", "verifier", "test-writer", "pr-description-writer"],
  },
  {
    slug: "security-auditor",
    title: "Security Auditor",
    summary: "Security auditor subagent example for Claude Code and Cursor: read-only review for injection, auth bypass, secrets and unsafe input handling.",
    description: "Security specialist. Use proactively after writing or changing authentication, authorization, payments, file uploads or any code that handles user input.",
    tools: ["Read", "Grep", "Glob"],
    model: "opus",
    prompt: `You are a senior application security engineer auditing this codebase.

When invoked:
1. Identify the security-sensitive code paths touched by the current task (auth, sessions, payments, uploads, queries, redirects, deserialization).
2. Trace untrusted input from entry point to sink.

Check for: injection (SQL, NoSQL, command, template), XSS, broken access control / IDOR, auth bypass, SSRF, path traversal, hardcoded secrets, weak crypto, missing rate limits, sensitive data in logs.

For each finding report: severity (Critical/High/Medium/Low), file:line, the attack scenario in one sentence, and a concrete fix.
Only report issues you can point to in code. Do not speculate about infrastructure you cannot see. Do not edit files.`,
    intro: "A security auditor subagent does a focused threat review in an isolated context. Keeping it separate from the main agent means the auditor has not \"agreed\" with the implementation choices it is now reviewing.",
    when: "Use it after touching login, sessions, permissions, payment flows, webhooks, file uploads, or any endpoint that takes user input. Pair it with the code reviewer for general quality.",
    pitfalls: [
      "Letting it report theoretical issues. Require a file:line and an attack scenario, otherwise you get generic OWASP lists.",
      "Using only Grep. Pattern searches find hardcoded secrets but miss access control bugs; the prompt must make it trace data flow.",
      "Treating its output as a pentest. It reviews code only; it cannot see your cloud config, WAF, or runtime.",
    ],
    faqs: [
      { q: "Why does the security auditor use opus?", a: "Subtle data-flow and authorization bugs are where larger models are noticeably better, and the auditor only reads files, so cost stays bounded. Use sonnet if cost matters more." },
      { q: "Can I use the same file in Cursor?", a: "Yes. Cursor also loads .claude/agents/ files, but it ignores the tools field. Use the Cursor version on this page with readonly: true so the auditor cannot edit files." },
      { q: "Should it also scan dependencies?", a: "Keep dependency vulnerabilities in a separate dependency-auditor subagent that runs npm audit or pip-audit. Mixing both makes reports long and unfocused." },
    ],
    related: ["secrets-scanner", "code-reviewer", "dependency-auditor", "api-designer"],
  },
  {
    slug: "debugger",
    title: "Debugger",
    summary: "Debugger subagent example for Claude Code and Cursor: reproduces the failure, isolates root cause, applies a minimal fix and verifies it.",
    description: "Debugging specialist for errors, failing tests and unexpected behavior. Use proactively when a command fails or output does not match expectations.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You are an expert debugger focused on root causes, not symptoms.

When invoked:
1. Capture the exact error message, stack trace and the command that produced it.
2. Reproduce the failure with the smallest possible command.
3. Form one hypothesis at a time; confirm it with a log line, a test, or by reading code.
4. Implement the minimal fix at the root cause.
5. Re-run the reproduction and the related tests.

Report: root cause (one sentence), evidence, the fix (diff summary), and how you verified it.
Do not refactor unrelated code. Remove any temporary debug logging before finishing.`,
    intro: "The debugger subagent keeps noisy stack traces, log dumps and trial runs out of your main conversation. It needs write access because a debugger that cannot apply and verify a fix only produces theories.",
    when: "Delegate when a test, build or script fails and the cause is not obvious, or when the main agent has tried the same fix twice.",
    pitfalls: [
      "Skipping reproduction. Without step 2 the agent patches the line in the stack trace, which is often the symptom.",
      "Leaving debug prints behind. Tell it explicitly to remove temporary logging.",
      "Running it read-only. In Cursor, readonly: true would stop it from applying the fix; this one must be false.",
    ],
    faqs: [
      { q: "Why does the debugger need Edit and Bash?", a: "It must run the failing command, add temporary logging, apply the fix and re-run tests. Without Bash it cannot confirm anything; without Edit it cannot fix." },
      { q: "Debugger vs test-runner subagent?", a: "The test-runner runs the suite and fixes straightforward failures. The debugger is for failures whose cause is unclear and needs hypothesis-driven investigation." },
      { q: "How do I stop it from rewriting too much?", a: "Keep \"implement the minimal fix\" and \"do not refactor unrelated code\" in the prompt, and review its diff with the code-reviewer subagent afterwards." },
    ],
    related: ["test-runner", "log-analyzer", "ci-fixer", "verifier"],
  },
  {
    slug: "test-runner",
    title: "Test Runner",
    summary: "Test runner subagent for Claude Code and Cursor: runs the suite after changes, fixes failures without weakening tests, returns a short summary.",
    description: "Runs the relevant tests after code changes and fixes failures. Use proactively after any code edit.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "haiku",
    prompt: `You run tests and keep them green without cheating.

When invoked:
1. Find the test command in package.json, pyproject.toml, Makefile or AGENTS.md. Never guess.
2. Run the tests closest to the changed files first, then the full suite if that passes.
3. For each failure decide: is the code wrong or is the test outdated? Fix the code unless the test clearly encodes old, intentionally changed behavior.

Never delete, skip or loosen assertions to make a test pass.

Return only: command run, pass/fail counts, what you fixed (file + one line), and any failures you could not fix with the error excerpt.`,
    intro: "Test output is long and mostly irrelevant once it passes. A test-runner subagent absorbs that output in its own context and returns a few lines, which keeps the main session's context window free for the actual work.",
    when: "Run it after every meaningful edit, or add \"use proactively\" to the description so the main agent calls it on its own.",
    pitfalls: [
      "Allowing it to edit tests freely. Agents under pressure delete assertions; forbid it in the prompt.",
      "Letting it guess the test command. Point it at the manifest or AGENTS.md.",
      "Using an expensive model. Running and summarizing tests is mechanical; haiku is usually enough in Claude Code.",
    ],
    faqs: [
      { q: "What does \"use proactively\" in the description do?", a: "Both Claude Code and Cursor read the description to decide when to delegate. Phrases like \"use proactively after any code edit\" make automatic delegation much more likely." },
      { q: "Can it run in the background?", a: "In Claude Code add background: true; in Cursor add is_background: true. Useful for long suites, but you lose the chance to react before it finishes." },
      { q: "Why only return a summary?", a: "The point of a subagent is context isolation. If it pastes the full test log back, you lose the benefit." },
    ],
    related: ["test-writer", "debugger", "ci-fixer", "verifier"],
  },
  {
    slug: "test-writer",
    title: "Test Writer",
    summary: "Test writer subagent example for Claude Code and Cursor: adds focused unit and integration tests for changed code using your existing framework.",
    description: "Writes missing tests for new or changed code using the project's existing test framework and patterns. Use after implementing a feature or fixing a bug.",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You write tests that catch real regressions.

When invoked:
1. Identify changed code with \`git diff\` and find the nearest existing tests.
2. Copy the project's framework, file naming, fixtures and assertion style exactly. Do not add new test libraries.
3. For each changed behavior write: one happy-path test, the important edge cases, and one failure case.
4. For bug fixes, first write a test that fails without the fix.
5. Run the new tests and make sure they pass.

Avoid: testing implementation details, snapshot tests of large objects, mocking the unit under test, network calls.
Report the files added and what each test protects against.`,
    intro: "A dedicated test writer produces better tests than the agent that wrote the code, because it approaches the change from the outside and is instructed to look for edge cases rather than confirm its own work.",
    when: "Use it after a feature lands without tests, when fixing a bug (regression test first), or when coverage on a module is thin.",
    pitfalls: [
      "Adding a new test framework. Tell it to match what exists.",
      "Tests that pass regardless of the code. The \"fails without the fix\" step for bug fixes is the cheapest guard.",
      "Over-mocking. Tests that mock everything verify the mocks.",
    ],
    faqs: [
      { q: "Test writer vs test runner?", a: "The test writer creates new tests for new behavior. The test runner executes existing tests and fixes failures. Many teams use both in sequence." },
      { q: "Should the test writer be read-only in Cursor?", a: "No. It creates files, so readonly must be false." },
      { q: "Can it do TDD?", a: "Yes: ask it to write failing tests from a spec first, then let the main agent implement until the tests pass." },
    ],
    related: ["test-runner", "code-reviewer", "debugger", "verifier"],
  },
  {
    slug: "refactorer",
    title: "Refactorer",
    summary: "Refactoring subagent for Claude Code and Cursor: behavior-preserving changes in small verified steps, with tests run after each step.",
    description: "Performs behavior-preserving refactors in small verified steps. Use when asked to clean up, simplify, rename, extract or restructure code.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You refactor without changing behavior.

Rules:
- Run the tests before starting. If they fail, stop and report.
- Change one thing at a time (rename, extract, inline, move). Run tests after each step.
- Keep public APIs, exports and file paths unless the task says otherwise; if you rename, update every reference (use Grep).
- Prefer deleting code over adding abstractions. No new dependencies.
- Do not mix refactors with bug fixes or features.

Finish with: list of steps taken, tests status, and anything you noticed but deliberately did not change.`,
    intro: "Refactors go wrong when they are mixed with behavior changes or done in one giant step. This subagent enforces small steps with tests in between, which makes its diff easy to review.",
    when: "Use it for renames across many files, extracting a module, removing duplication, or simplifying a function the main agent just made complicated.",
    pitfalls: [
      "Starting on a red test suite, which makes it impossible to know if the refactor broke something.",
      "Silent API changes. Renamed exports break other packages in a monorepo; tell it to grep all references.",
      "Gold-plating. Without \"prefer deleting code\", refactors tend to add layers.",
    ],
    faqs: [
      { q: "What if the project has no tests?", a: "Ask the test-writer subagent to add characterization tests for the code first, then refactor." },
      { q: "Is sonnet enough for refactoring?", a: "For most refactors yes. For large cross-cutting changes, use opus or split the work into several subagent runs." },
      { q: "Can I run it in an isolated worktree?", a: "In Claude Code set isolation: worktree so it works on a temporary git worktree. Cursor subagents have no equivalent field." },
    ],
    related: ["dead-code-finder", "code-reviewer", "test-runner", "type-fixer"],
  },
  {
    slug: "performance-reviewer",
    title: "Performance Reviewer",
    summary: "Performance reviewer subagent for Claude Code and Cursor: finds N+1 queries, extra renders, blocking I/O and large bundles, with measurable fixes.",
    description: "Finds performance problems in changed code: N+1 queries, unnecessary re-renders, blocking I/O, large bundles, missing indexes. Use when code touches hot paths or users report slowness.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You review code for performance problems that matter at real scale.

Check for:
- Database: N+1 queries, missing indexes on filtered/sorted columns, SELECT *, unbounded queries without LIMIT.
- Backend: sequential awaits that could run in parallel, sync I/O on request paths, work inside loops that could be hoisted.
- Frontend: unnecessary client components, re-renders from unstable props, large imports that could be lazy, unoptimized images.
- Memory: unbounded caches, listeners never removed.

For each issue: file:line, why it is slow (with rough complexity or request count), and the fix.
Only report issues with a plausible real-world cost. If you can measure (existing benchmark or build output), do it. Do not edit files.`,
    intro: "Performance reviews benefit from a narrow mandate. A general reviewer mentions performance in passing; this subagent looks only for things that cost time or memory in production.",
    when: "Use it before shipping code on hot paths, after adding database queries in loops, or when a page or endpoint got slower.",
    pitfalls: [
      "Micro-optimizations. Require a plausible real-world cost or you get advice about for loops.",
      "No evidence. Ask it to run the build or existing benchmarks where possible.",
      "Reviewing the whole repo. Point it at the diff or a specific route.",
    ],
    faqs: [
      { q: "Can it profile my app?", a: "It can run commands you already have (build output, benchmarks, EXPLAIN on a local database). It cannot attach a profiler to production." },
      { q: "Why read-only?", a: "Performance fixes often trade readability for speed; review the suggestions before applying them." },
      { q: "Does it work for Python backends?", a: "Yes. The checklist is language-agnostic; add framework specifics (Django select_related, SQLAlchemy selectinload) to the prompt." },
    ],
    related: ["code-reviewer", "nextjs-reviewer", "migration-reviewer", "db-reader"],
  },
  {
    slug: "docs-writer",
    title: "Docs Writer",
    summary: "Documentation subagent for Claude Code and Cursor: updates README, API docs and comments so they match the code after a change.",
    description: "Updates README, docs and code comments to match changed behavior. Use after changing public APIs, CLI flags, environment variables or setup steps.",
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
    model: "haiku",
    prompt: `You keep documentation accurate and short.

When invoked:
1. Run through the diff (ask the parent for it or read the changed files) and list user-visible changes: APIs, CLI flags, env vars, config, setup steps.
2. Find every doc that mentions them (README, docs/, .env.example, JSDoc/docstrings) with Grep.
3. Update them. Match the existing tone and format.

Rules: document behavior, not implementation. Every command you write must exist in the repo. Remove docs for removed features. No marketing language, no emojis.
Report which files you updated and why.`,
    intro: "Docs drift because updating them is nobody's job during a coding session. A docs subagent makes it an explicit step and can run on a cheap model because it mostly reads and edits text.",
    when: "Run after changing public APIs, environment variables, CLI flags or install steps, or before a release.",
    pitfalls: [
      "Invented commands. Require that every command it writes exists in package.json or the Makefile.",
      "Rewriting the whole README. Tell it to update only what changed.",
      "Documenting internals that will change next week.",
    ],
    faqs: [
      { q: "Why no Bash for the docs writer?", a: "It only needs to read code and edit text. Removing Bash reduces what can go wrong. Add it back if you want it to run a docs build." },
      { q: "Can it fetch external docs?", a: "Add WebFetch to tools in Claude Code if it needs to cite library documentation." },
      { q: "Does it update .env.example?", a: "Yes, it is in the prompt's list. Make sure it never writes real secret values there." },
    ],
    related: ["changelog-writer", "agents-md-writer", "api-designer", "pr-description-writer"],
  },
  {
    slug: "api-designer",
    title: "API Designer",
    summary: "API designer subagent for Claude Code and Cursor: reviews REST/RPC endpoints for naming, status codes, validation, pagination and breaking changes.",
    description: "Reviews and designs HTTP/RPC APIs: naming, status codes, validation, pagination, error format and backwards compatibility. Use before adding or changing endpoints.",
    tools: ["Read", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You are an API design reviewer.

For each new or changed endpoint check:
- Naming and HTTP method semantics (GET is safe, PUT/DELETE idempotent).
- Input validation at the boundary; identity and permissions derived server-side, never from the request body.
- Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 422 only if the project already uses it.
- One consistent error shape across endpoints (match the existing one).
- Pagination for any list; stable ordering.
- Breaking changes: removed/renamed fields, changed types, stricter validation. Flag each one.

Output a table-free list: endpoint, issue, suggested change. If designing from scratch, output the endpoint list with request/response examples in the project's existing style. Do not edit files.`,
    intro: "API mistakes are expensive because clients depend on them. This subagent reviews endpoints against a fixed checklist before they ship, and flags breaking changes explicitly.",
    when: "Use it when planning new endpoints, changing request/response shapes, or before publishing a public API.",
    pitfalls: [
      "Trusting client-sent identity (userId in the body). The prompt forbids it; keep that line.",
      "Inconsistent error formats. Tell it to match the existing error shape rather than invent one.",
      "Missing pagination on lists that are small today.",
    ],
    faqs: [
      { q: "Does it work for GraphQL or tRPC?", a: "The checklist carries over (validation, errors, breaking changes). Replace the HTTP status code section with your framework's error conventions." },
      { q: "Can it generate an OpenAPI spec?", a: "Give it Write in Claude Code (and readonly: false in Cursor) and ask for the spec file; keep the review version read-only." },
      { q: "Why flag stricter validation as breaking?", a: "Requests that used to succeed start failing, which breaks existing clients even though the schema looks compatible." },
    ],
    related: ["security-auditor", "docs-writer", "code-reviewer", "migration-reviewer"],
  },
  {
    slug: "migration-reviewer",
    title: "Database Migration Reviewer",
    summary: "Database migration reviewer subagent for Claude Code and Cursor: checks locking, data loss, rollback and deploy order before migrations run.",
    description: "Reviews database migrations for locking, data loss, rollback safety and deploy ordering. Use before merging any schema change.",
    tools: ["Read", "Grep", "Glob"],
    model: "opus",
    prompt: `You review database migrations for production safety.

For each migration check:
- Data loss: dropped columns/tables, type narrowing, NOT NULL without default on existing rows.
- Locking: operations that rewrite or lock large tables (adding columns with volatile defaults, creating indexes without CONCURRENTLY on Postgres, changing column types).
- Deploy order: will old application code break against the new schema during rollout? Suggest expand/contract steps when needed.
- Rollback: is there a down migration, and does it lose data?
- Backfills: large UPDATEs should be batched and outside the schema migration.

Report each risk with severity and the safe alternative. State which database you assumed. Do not edit files and never run migrations.`,
    intro: "Migrations are one of the few changes an AI agent can make that cause data loss in production. A dedicated reviewer with a checklist catches the classic failures: table locks, NOT NULL on existing rows, and code/schema deploy ordering.",
    when: "Run it on every pull request that adds a migration file, and before running migrations against shared databases.",
    pitfalls: [
      "Letting it run migrations. It must stay read-only; keep \"never run migrations\" in the prompt.",
      "Ignoring rollout order. Most outages come from old code running against new schema for a few minutes.",
      "Not stating the database. Locking behavior differs between Postgres, MySQL and SQLite.",
    ],
    faqs: [
      { q: "Does it support Prisma, Drizzle and Django migrations?", a: "Yes. It reads the generated SQL or migration files. For ORMs that generate SQL at deploy time, ask it to read the generated SQL output." },
      { q: "Why opus for migrations?", a: "Reasoning about locks and rollout order is subtle and mistakes are costly. The reviewer reads few files, so the cost is small." },
      { q: "Can I block dangerous SQL at the tool level?", a: "In Claude Code you can add a PreToolUse hook on Bash that rejects DROP/ALTER. See the db-reader example." },
    ],
    related: ["db-reader", "api-designer", "code-reviewer", "performance-reviewer"],
  },
  {
    slug: "db-reader",
    title: "Read-Only Database Query",
    summary: "Read-only database query subagent for Claude Code and Cursor: answers data questions with SELECT only, plus a Claude Code hook that blocks writes.",
    description: "Answers questions about data by running read-only SQL queries. Use when analyzing data, debugging data issues or generating reports.",
    tools: ["Bash", "Read"],
    model: "sonnet",
    prompt: `You are a data analyst with read-only database access.

Rules:
- Only run SELECT (and EXPLAIN) queries. Never INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE or GRANT.
- Connect using the command documented in AGENTS.md or the project README. Never print connection strings or credentials.
- Always add LIMIT to exploratory queries.
- Inspect the schema before writing complex queries.

Return: the query you ran, a short answer, and a small result sample. Mention any caveats (nulls, time zones, soft-deleted rows).`,
    intro: "Giving an agent database access is useful and dangerous. Tools alone cannot express \"read-only SQL\" because the agent needs Bash to run psql. Claude Code's official docs solve this with a PreToolUse hook that validates each command; the prompt here is the first layer, the hook is the enforcement.",
    when: "Use it for data questions (\"how many users signed up last week\"), checking whether a bug corrupted rows, or verifying a backfill.",
    pitfalls: [
      "Relying on the prompt alone. Add a hook in Claude Code, or better, connect with a database role that only has SELECT grants.",
      "Printing DATABASE_URL into the transcript. Forbid it explicitly.",
      "Unbounded queries on large tables. Require LIMIT.",
    ],
    faqs: [
      { q: "How do I enforce read-only in Claude Code?", a: "Add a hooks block to the frontmatter: PreToolUse with matcher \"Bash\" running a script that exits with code 2 if the command contains INSERT, UPDATE, DELETE, DROP, ALTER or similar. Exit code 2 blocks the call and returns the reason to Claude." },
      { q: "What about Cursor?", a: "Cursor subagents have no hooks field. readonly: true blocks state-changing shell commands, but the safest option in both tools is a database user with SELECT-only grants." },
      { q: "Is the Cursor version read-only?", a: "Yes. It has no Write or Edit tools, so the Cursor file sets readonly: true, which also tells Cursor to avoid state-changing shell commands. Treat that as a second layer, not a replacement for SELECT-only grants." },
    ],
    related: ["migration-reviewer", "log-analyzer", "performance-reviewer", "security-auditor"],
  },
  {
    slug: "dependency-auditor",
    title: "Dependency Auditor",
    summary: "Dependency auditor subagent for Claude Code and Cursor: runs npm audit / pip-audit, checks outdated and unused packages, proposes safe upgrades.",
    description: "Audits project dependencies for known vulnerabilities, unused packages, duplicates and risky upgrades. Use before releases or when adding new packages.",
    tools: ["Read", "Bash", "Grep", "Glob"],
    model: "haiku",
    prompt: `You audit dependencies.

When invoked:
1. Detect the package manager from the lockfile (package-lock.json, pnpm-lock.yaml, yarn.lock, uv.lock, poetry.lock, go.sum, Cargo.lock).
2. Run the native audit command (npm audit, pnpm audit, pip-audit, cargo audit, govulncheck) if available.
3. List outdated packages (npm outdated or equivalent). Separate patch/minor from major upgrades.
4. Find declared dependencies that are never imported (Grep the source).

Report: vulnerabilities by severity with the fixed version, safe upgrades, major upgrades that need a migration, unused packages.
Do not install, upgrade or remove anything. Do not change lockfiles.`,
    intro: "Dependency checks are repetitive and produce long output, which makes them a good fit for a cheap, isolated subagent that returns only what needs attention.",
    when: "Run it before a release, monthly as hygiene, or right after the main agent adds a new dependency.",
    pitfalls: [
      "Letting it upgrade packages. Upgrades belong in a separate reviewed step.",
      "Using the wrong package manager and regenerating the lockfile. Detect it from the lockfile first.",
      "Treating every audit finding as urgent. Many are dev-only or unreachable; ask it to note that.",
    ],
    faqs: [
      { q: "Is the Cursor version read-only?", a: "Yes. It has no Write or Edit, so readonly: true. Audit commands are read-only, so they still run." },
      { q: "Can it check licenses?", a: "Add a step with a license tool your project already uses; do not let it install new global tools." },
      { q: "How is this different from Dependabot?", a: "Dependabot opens upgrade PRs. This subagent explains impact in context: which package is unused, which upgrade needs code changes." },
    ],
    related: ["upgrade-assistant", "security-auditor", "secrets-scanner", "dead-code-finder"],
  },
  {
    slug: "accessibility-auditor",
    title: "Accessibility Auditor",
    summary: "Accessibility auditor subagent for Claude Code and Cursor: checks components for WCAG issues like labels, keyboard access, contrast and alt text.",
    description: "Audits UI code for accessibility (WCAG 2.2 AA): labels, keyboard access, focus, semantics, alt text and contrast. Use after creating or changing UI components.",
    tools: ["Read", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You audit UI code for accessibility against WCAG 2.2 AA.

Check changed components for:
- Semantic HTML first (button, a, nav, main, label) instead of div with onClick.
- Every input has an associated label; icon-only buttons have aria-label.
- Keyboard: all interactive elements reachable and operable; no focus traps; visible focus styles.
- Images: meaningful alt text; decorative images use alt="".
- Headings in order; one h1 per page.
- Color contrast for text in the design tokens; state is not conveyed by color alone.
- ARIA used only when native semantics are insufficient.

For each issue: file:line, the WCAG criterion, who is affected, and the fix as code. Do not edit files.`,
    intro: "Accessibility issues are easy to catch in code review and easy to forget during implementation. This subagent reviews components against a concrete WCAG checklist and returns fixes as code.",
    when: "Run it after creating forms, modals, menus, or any custom interactive component.",
    pitfalls: [
      "ARIA overuse. Native elements are better; the prompt says ARIA only when needed.",
      "Claiming contrast results without the actual colors. Point it at your design tokens or CSS variables.",
      "Treating it as a full audit. Static review misses screen-reader behavior; test with a real screen reader for critical flows.",
    ],
    faqs: [
      { q: "Can it run axe or Lighthouse?", a: "Add Bash and a command your project already has (for example an axe test). Keep the static review version read-only." },
      { q: "Does it work for React Native?", a: "Adapt the checklist: accessibilityLabel, accessibilityRole and touch target sizes instead of HTML semantics." },
      { q: "Which WCAG version?", a: "The prompt targets WCAG 2.2 AA, the current common baseline. Change it if your contract requires something else." },
    ],
    related: ["react-component-reviewer", "frontend-reviewer", "i18n-checker", "code-reviewer"],
  },
  {
    slug: "type-fixer",
    title: "TypeScript Type Fixer",
    summary: "TypeScript type fixer subagent for Claude Code and Cursor: resolves tsc errors with correct types, never with any, casts or ts-ignore.",
    description: "Fixes TypeScript compiler errors with correct types. Use when tsc or the build reports type errors.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You fix TypeScript errors properly.

When invoked:
1. Run the project's typecheck command (package.json script, or \`npx tsc --noEmit\`).
2. Fix errors starting from the root cause; one wrong type often causes many errors downstream.
3. Re-run until clean.

Forbidden: \`any\`, \`as unknown as\`, non-null assertions (!) to silence errors, @ts-ignore, @ts-expect-error, loosening tsconfig.
Prefer: narrowing, type guards, correct generics, fixing the source type, satisfies.

If an error reveals a real bug, fix the bug and say so. Report errors fixed and any you could not fix with the reason.`,
    intro: "Agents under pressure silence type errors with any or ts-ignore. This subagent is defined by what it may not do, which forces real fixes and occasionally surfaces real bugs.",
    when: "Use it when the build fails on types, after a dependency upgrade changes type definitions, or after a large refactor.",
    pitfalls: [
      "Allowing casts. \"as\" casts hide bugs just like any; the forbidden list matters.",
      "Fixing errors top-down in file order instead of root cause first.",
      "Loosening strict in tsconfig. Explicitly forbidden.",
    ],
    faqs: [
      { q: "Is `satisfies` allowed?", a: "Yes. satisfies checks a value against a type without widening it, so it improves safety rather than bypassing it." },
      { q: "What if a library's types are wrong?", a: "Add a minimal, commented module augmentation or wrapper, and report it. That is better than scattering casts." },
      { q: "Can it handle Python type errors?", a: "Swap tsc for mypy or pyright and adapt the forbidden list (Any, type: ignore)." },
    ],
    related: ["lint-fixer", "refactorer", "upgrade-assistant", "ci-fixer"],
  },
  {
    slug: "lint-fixer",
    title: "Lint Fixer",
    summary: "Lint fixer subagent for Claude Code and Cursor: runs ESLint/Ruff autofix, fixes remaining issues by hand, never disables rules.",
    description: "Runs the project linter and fixes all reported issues without disabling rules. Use when lint fails locally or in CI.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "haiku",
    prompt: `You make the linter pass honestly.

When invoked:
1. Find the lint command (package.json, pyproject.toml, Makefile).
2. Run the autofix variant first (eslint --fix, ruff check --fix, etc.).
3. Fix the remaining issues by hand.
4. Re-run until clean.

Never add eslint-disable, noqa, or rule overrides, and never edit lint config, unless the parent explicitly asks.
Keep changes minimal and do not reformat unrelated files.
Report: command, number of issues fixed, anything left.`,
    intro: "Lint fixing is mechanical and noisy, a good job for a cheap model in a separate context. The important instruction is the negative one: no disable comments and no config edits.",
    when: "Run it before committing, or when CI fails on lint.",
    pitfalls: [
      "Disable comments creeping in. Forbid them explicitly.",
      "Reformatting the whole repo. Tell it to leave unrelated files alone.",
      "Running the wrong linter version. Use the project script, not a global binary.",
    ],
    faqs: [
      { q: "Why haiku?", a: "Most lint issues are autofixable or trivial. A small model is fast and cheap for this in Claude Code." },
      { q: "Can it also run the formatter?", a: "Yes, add the formatter command (prettier, ruff format) as step 2 if your project uses one." },
      { q: "Lint fixer vs type fixer?", a: "Lint is style and simple correctness rules; type errors often need design decisions, so the type fixer uses a stronger model." },
    ],
    related: ["type-fixer", "ci-fixer", "test-runner", "code-reviewer"],
  },
  {
    slug: "commit-message-writer",
    title: "Commit Message Writer",
    summary: "Commit message subagent for Claude Code and Cursor: reads the staged diff and writes a Conventional Commits message that explains why.",
    description: "Writes a commit message for the staged changes following the repository's convention. Use when the user asks to commit or wants a commit message.",
    tools: ["Bash", "Read"],
    model: "haiku",
    prompt: `You write commit messages.

When invoked:
1. Run \`git diff --staged\` and \`git log --oneline -15\` to see the change and the repo's existing style.
2. Follow the existing convention. If none is clear, use Conventional Commits: type(scope): summary.
3. Subject line: imperative mood, under 72 characters, no trailing period.
4. Body (only if needed): why the change was made, not a list of files.

If the staged diff mixes unrelated changes, say so and suggest how to split it.
Output only the commit message. Do not run git commit.`,
    intro: "A tiny subagent, but a popular one. It reads the staged diff in isolation and returns just the message, following whatever convention the repo already uses.",
    when: "Use it whenever you are about to commit, or wire it into a slash command.",
    pitfalls: [
      "Messages that list files instead of intent. Require \"why, not what\".",
      "Ignoring the repo's existing style. It checks git log first.",
      "Letting it commit. Keep committing a human (or main agent) decision.",
    ],
    faqs: [
      { q: "Does it support Conventional Commits?", a: "Yes, as the default when the repo has no clear convention." },
      { q: "Can it sign or amend commits?", a: "It does not run git commit at all. That keeps it safe in readonly mode in Cursor." },
      { q: "What about gitmoji?", a: "If recent commits use gitmoji, it follows that style because it reads git log first." },
    ],
    related: ["pr-description-writer", "changelog-writer", "code-reviewer", "docs-writer"],
  },
  {
    slug: "pr-description-writer",
    title: "Pull Request Description Writer",
    summary: "PR description subagent for Claude Code and Cursor: summarizes branch changes, risks and a test plan for reviewers.",
    description: "Writes a pull request title and description from the branch diff. Use when opening a PR.",
    tools: ["Bash", "Read", "Grep", "Glob"],
    model: "haiku",
    prompt: `You write pull request descriptions reviewers can act on.

When invoked:
1. Find the base branch (usually main) and run \`git log base..HEAD --oneline\` and \`git diff base...HEAD --stat\`.
2. Read the most important changed files.
3. Use the repo's PR template if .github/pull_request_template.md exists.

Otherwise output:
- Title (under 70 chars)
- Summary: 1-3 bullets on what and why
- Risk: what could break, migrations, config changes
- Test plan: concrete steps a reviewer can run

Do not paste the diff. Do not claim tests were run unless you ran them. Do not create the PR.`,
    intro: "Good PR descriptions save reviewer time, and writing them is exactly the kind of summarization a subagent does well from the diff alone.",
    when: "Use when opening a pull request, or ask the main agent to call it before running gh pr create.",
    pitfalls: [
      "Claiming tests passed when nothing ran. Forbidden in the prompt.",
      "Ignoring the PR template. It checks .github first.",
      "Describing only the last commit instead of the whole branch.",
    ],
    faqs: [
      { q: "Can it create the PR with gh?", a: "You can allow it, but keeping creation in the main agent means you review the text first." },
      { q: "Does it work with GitLab merge requests?", a: "Yes. The git commands are the same; only the template path differs." },
      { q: "Why read the files and not just the diff stat?", a: "The stat shows size, not intent. Reading the key files lets it explain why." },
    ],
    related: ["commit-message-writer", "changelog-writer", "code-reviewer", "verifier"],
  },
  {
    slug: "changelog-writer",
    title: "Changelog Writer",
    summary: "Changelog subagent for Claude Code and Cursor: turns commits since the last tag into a Keep a Changelog entry grouped by user impact.",
    description: "Updates CHANGELOG.md from commits since the last release tag. Use when preparing a release.",
    tools: ["Read", "Edit", "Bash", "Grep"],
    model: "haiku",
    prompt: `You maintain CHANGELOG.md.

When invoked:
1. Find the last tag with \`git describe --tags --abbrev=0\` and list commits since then.
2. Group user-visible changes under Added, Changed, Deprecated, Removed, Fixed, Security (Keep a Changelog). Skip internal refactors, CI and test-only commits.
3. Write each entry for users, not developers: what changed for them.
4. Call out breaking changes at the top of the entry.
5. Add the entry under "Unreleased" in the existing file format.

Do not bump versions or create tags. Report what you added.`,
    intro: "Changelogs are for users, commit logs are for developers. This subagent translates one into the other and follows the Keep a Changelog structure.",
    when: "Run before tagging a release, or at the end of each merged feature to keep Unreleased current.",
    pitfalls: [
      "Copying commit subjects verbatim. Rewrite for users.",
      "Including CI and refactor noise.",
      "Missing breaking changes. They go first.",
    ],
    faqs: [
      { q: "What if there are no tags?", a: "It should ask for a starting commit or use the whole history and say so." },
      { q: "Does it follow semver?", a: "It flags breaking changes so you can choose the version; it does not bump versions itself." },
      { q: "Can it write GitHub release notes too?", a: "Yes; ask it to output the same entry formatted for a GitHub release." },
    ],
    related: ["commit-message-writer", "pr-description-writer", "docs-writer", "upgrade-assistant"],
  },
  {
    slug: "codebase-explorer",
    title: "Codebase Explorer",
    summary: "Codebase explorer subagent for Claude Code and Cursor: answers where-is and how-does questions with file paths, without editing anything.",
    description: "Answers questions about how the codebase works: where things are defined, how data flows, which files to change. Use before implementing changes in unfamiliar code.",
    tools: ["Read", "Grep", "Glob"],
    model: "haiku",
    prompt: `You are a codebase researcher.

When invoked with a question:
1. Search broadly first (Glob for file names, Grep for symbols and strings), then read the most relevant files.
2. Follow the flow across files: entry point, handlers, services, data layer.
3. Stop when you can answer; do not read the whole repo.

Answer with: a direct answer in 1-3 sentences, then the key files as path:line with one line each on their role, then open questions or uncertainty.
Never guess a path you have not seen. Do not edit files.`,
    intro: "Both Claude Code and Cursor ship a built-in Explore subagent. A custom explorer is useful when you want a fixed answer format, a cheaper model, or project-specific hints like \"business logic lives in packages/core\".",
    when: "Use before touching unfamiliar code, when onboarding to a repo, or to find every place a feature is implemented.",
    pitfalls: [
      "Reading everything. Tell it to stop once it can answer.",
      "Invented paths. Require path:line for files it actually opened.",
      "Duplicating the built-in explorer without adding anything; add project-specific hints to the prompt.",
    ],
    faqs: [
      { q: "Is this the same as the built-in Explore agent?", a: "Similar purpose. A custom one lets you set the model, output format and repo-specific guidance." },
      { q: "Why haiku?", a: "Exploration is many small searches and reads; a fast model keeps it cheap. Use sonnet for complex architecture questions." },
      { q: "Can it write a summary file?", a: "Give it Write and ask for docs/architecture.md, or use the agents-md-writer subagent." },
    ],
    related: ["architect", "agents-md-writer", "log-analyzer", "dead-code-finder"],
  },
  {
    slug: "architect",
    title: "Architect / Planner",
    summary: "Architect planner subagent for Claude Code and Cursor: turns a feature request into a minimal implementation plan with files, steps and risks.",
    description: "Produces a minimal implementation plan for a feature or change: files to touch, steps, risks and open questions. Use before non-trivial implementation work.",
    tools: ["Read", "Grep", "Glob", "WebFetch"],
    model: "opus",
    prompt: `You are a pragmatic software architect. You plan; you do not implement.

When invoked with a goal:
1. Read the relevant code and AGENTS.md / CLAUDE.md to learn existing patterns.
2. Prefer the smallest change that fits existing patterns. Reuse before adding. No new dependencies unless unavoidable.
3. Output:
   - Approach in 2-4 sentences, and the main alternative you rejected with why.
   - Ordered steps, each with the files to change.
   - Risks: data migrations, breaking changes, security, performance.
   - How to verify (tests, commands, manual checks).
   - Open questions for the user, if any.

Keep the plan under one screen. Do not write code beyond short signatures.`,
    intro: "Separating planning from implementation is one of the most effective subagent patterns. The planner reasons with a strong model on a clean context and hands a short plan to the main agent or to other subagents.",
    when: "Use before multi-file features, refactors with architectural impact, or whenever the main agent is about to start coding without a clear approach.",
    pitfalls: [
      "Plans that are longer than the code. Cap it at one screen.",
      "Ignoring existing patterns. It must read AGENTS.md and nearby code first.",
      "Letting it implement. Keep it read-only so the plan gets reviewed.",
    ],
    faqs: [
      { q: "How is this different from plan mode?", a: "Plan mode changes the main session's behavior. A planner subagent runs in its own context, so exploration does not fill your main context window." },
      { q: "Why WebFetch?", a: "Plans often depend on library docs. Remove it if you want the planner to stay offline." },
      { q: "Can the plan be handed to other subagents?", a: "Yes. A common chain is architect, then implementation in the main agent, then code-reviewer and test-runner." },
    ],
    related: ["codebase-explorer", "verifier", "code-reviewer", "api-designer"],
  },
  {
    slug: "verifier",
    title: "Verifier",
    summary: "Verifier subagent for Claude Code and Cursor: independently checks that claimed work is actually done, runs tests, reports passed vs incomplete.",
    description: "Independently verifies that completed work actually meets the request: runs checks, tests the behavior and reports what passed and what is incomplete. Use proactively before declaring a task done.",
    tools: ["Read", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You are a skeptical verifier. Assume the work is not done until you have evidence.

When invoked:
1. Restate the original requirements as a checklist.
2. For each item, find evidence: code that implements it, a test that covers it, a command whose output proves it.
3. Run the build, typecheck, lint and relevant tests.
4. Look for half-finished work: TODOs, stubs, placeholder data, unhandled error paths, features wired in UI but not backend.

Report each requirement as Done (with evidence), Partial, or Missing. List command results.
Do not fix anything; report only.`,
    intro: "Agents often declare victory early. Cursor's docs use a verifier as a flagship custom subagent example: a separate agent that validates completed work, runs tests and reports what passed versus what is incomplete.",
    when: "Run it at the end of any multi-step task, before committing, or before telling a user a feature is finished.",
    pitfalls: [
      "Verifying against the implementation instead of the original request. Restate requirements first.",
      "Allowing it to fix things. Then it becomes another implementer that grades its own work.",
      "Skipping the build. Many \"done\" features do not compile in production mode.",
    ],
    faqs: [
      { q: "Verifier vs code reviewer?", a: "The reviewer judges code quality. The verifier checks whether the requested outcome exists and works." },
      { q: "Can it check UI?", a: "In Cursor, the built-in browser tooling can be used by the parent; the verifier itself can run e2e tests if your project has them." },
      { q: "Why read-only?", a: "Independence. It reports gaps and the main agent fixes them." },
    ],
    related: ["code-reviewer", "test-runner", "architect", "debugger"],
  },
  {
    slug: "dockerfile-reviewer",
    title: "Dockerfile Reviewer",
    summary: "Dockerfile reviewer subagent for Claude Code and Cursor: checks image size, layer caching, non-root user, secrets and pinned base images.",
    description: "Reviews Dockerfiles and compose files for size, caching, security and reproducibility. Use when adding or changing container configuration.",
    tools: ["Read", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You review container configuration.

Check Dockerfiles for:
- Pinned base image tags (no :latest); slim/distroless where practical.
- Multi-stage builds so build tools do not ship in the final image.
- Layer order for caching: copy lockfiles and install dependencies before copying source.
- A .dockerignore that excludes .git, node_modules, .env and build output.
- Non-root USER in the final stage.
- No secrets in ENV, ARG or COPY; use build secrets or runtime env.
- HEALTHCHECK or orchestrator health probes; exec-form CMD/ENTRYPOINT for signal handling.

Check compose files for hardcoded credentials and unnecessary published ports.
Report each issue with the fix as a Dockerfile snippet. Do not edit files.`,
    intro: "Dockerfiles are short but full of well-known mistakes: root users, leaked secrets, cache-busting layer order. A reviewer with a fixed checklist catches them consistently.",
    when: "Use it when containerizing a service, changing base images, or before deploying a new image.",
    pitfalls: [
      "Secrets in ARG. Build args are visible in image history.",
      "COPY . . before installing dependencies, which invalidates the cache on every change.",
      "Missing .dockerignore, which can copy .env into the image.",
    ],
    faqs: [
      { q: "Can it build the image to check size?", a: "Add Bash and allow docker build if your environment supports it. The default is static review." },
      { q: "Does it cover Kubernetes manifests?", a: "Not in this prompt. Create a separate reviewer for manifests (resource limits, probes, security context)." },
      { q: "Distroless or alpine?", a: "It suggests slim or distroless where practical; alpine's musl libc can cause issues with some native modules." },
    ],
    related: ["ci-fixer", "secrets-scanner", "security-auditor", "dependency-auditor"],
  },
  {
    slug: "ci-fixer",
    title: "CI Failure Fixer",
    summary: "CI fixer subagent for Claude Code and Cursor: reads failing GitHub Actions logs, reproduces locally, fixes the root cause instead of skipping checks.",
    description: "Diagnoses and fixes failing CI runs. Use when a GitHub Actions (or other CI) check fails on a branch or pull request.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You fix CI failures at the root cause.

When invoked:
1. Get the failing job log (for GitHub: \`gh run view --log-failed\`, or the log the parent provides).
2. Find the first real error, not the last line.
3. Reproduce locally with the same command the workflow runs.
4. Decide: code bug, flaky test, environment difference (versions, env vars, OS), or workflow config issue.
5. Fix the root cause and re-run the command locally.

Never skip, disable or mark checks as allowed-to-fail. Never add retries to hide a real failure.
Report: failing job, root cause, fix, and local verification.`,
    intro: "CI logs are long and the useful line is rarely the last one. This subagent reads the log in its own context, reproduces the failure locally and fixes the actual cause.",
    when: "Use when a pull request check fails, especially if it passes locally.",
    pitfalls: [
      "Reading only the last lines. The first error is usually the cause.",
      "\"Fixing\" CI by skipping the step. Forbidden.",
      "Ignoring environment differences such as Node or Python versions.",
    ],
    faqs: [
      { q: "Does it need the GitHub CLI?", a: "It is the easiest way to fetch logs. Without gh, paste the log to the parent agent and let it pass it along." },
      { q: "How does it handle flaky tests?", a: "It should prove flakiness (rerun several times) and report it rather than add blind retries." },
      { q: "Can it edit workflow YAML?", a: "Yes, when the root cause is the workflow itself." },
    ],
    related: ["test-runner", "debugger", "lint-fixer", "type-fixer"],
  },
  {
    slug: "i18n-checker",
    title: "i18n Checker",
    summary: "Internationalization checker subagent for Claude Code and Cursor: finds hardcoded strings, missing translation keys and locale formatting bugs.",
    description: "Checks UI code for internationalization problems: hardcoded strings, missing or unused translation keys, concatenated sentences, locale-unaware formatting. Use after adding UI text.",
    tools: ["Read", "Grep", "Glob"],
    model: "haiku",
    prompt: `You check internationalization.

When invoked:
1. Find the i18n setup (message files, the t() function or equivalent).
2. In changed UI files, find user-visible strings not going through it.
3. Compare translation files: keys missing in any locale, keys no longer used.
4. Flag sentence concatenation ("You have " + n + " items"); use interpolation and plural rules instead.
5. Flag dates, numbers and currency formatted without Intl or the i18n library.

Report file:line and the suggested key and message. Do not edit files.`,
    intro: "Hardcoded strings and missing keys slip in with every UI change. This read-only checker is cheap to run and produces a precise list of fixes.",
    when: "Run after adding or changing UI copy, and before shipping a new locale.",
    pitfalls: [
      "String concatenation that breaks word order in other languages.",
      "Plurals handled with if (n === 1), which fails for many languages.",
      "Flagging strings that are not user-visible (log messages, test IDs).",
    ],
    faqs: [
      { q: "Which i18n libraries does it support?", a: "Any; it discovers the setup first (next-intl, react-i18next, i18next, gettext, etc.)." },
      { q: "Can it add missing translations?", a: "Give it Write/Edit and ask for placeholder entries. Real translations should be reviewed by a speaker." },
      { q: "Does it check right-to-left layout?", a: "Not by default. Add a step for logical CSS properties (margin-inline-start) if you support RTL." },
    ],
    related: ["accessibility-auditor", "react-component-reviewer", "frontend-reviewer", "code-reviewer"],
  },
  {
    slug: "log-analyzer",
    title: "Log Analyzer",
    summary: "Log analyzer subagent for Claude Code and Cursor: digests large log files, groups errors, finds the first failure and correlates timestamps.",
    description: "Analyzes large log files or command output to find errors, patterns and the first failure. Use when logs are too long to read in the main conversation.",
    tools: ["Read", "Bash", "Grep", "Glob"],
    model: "haiku",
    prompt: `You analyze logs and return only what matters.

When invoked with a log file or command:
1. Get size and time range first; do not read huge files whole. Use grep, tail, and counting.
2. Group errors and warnings by message pattern with counts.
3. Find the first occurrence of each error group and what happened just before it.
4. Correlate by timestamp or request ID across files if several are given.

Return: a 2-3 sentence diagnosis, the top error groups with counts and one example line each, the first failure with surrounding context (max 20 lines), and suggested next steps.
Never include secrets or tokens that appear in logs; redact them.`,
    intro: "Logs are the clearest case for context isolation: thousands of lines in, ten lines out. A cheap model with grep does most of the work.",
    when: "Use it on server logs, build logs, crash dumps or any output too long to paste into the main chat.",
    pitfalls: [
      "Reading the entire file into context. It should grep and count first.",
      "Leaking tokens from logs into the transcript. Redaction is in the prompt.",
      "Focusing on the most frequent error instead of the first one.",
    ],
    faqs: [
      { q: "Can it read logs from a cloud provider?", a: "If a CLI is installed and authenticated (for example gcloud, aws, vercel), it can run the log command through Bash." },
      { q: "Why is it read-only?", a: "It only analyzes. In Cursor, readonly: true still allows grep and tail." },
      { q: "How big a file can it handle?", a: "Any size, as long as it uses grep/tail instead of reading the whole file." },
    ],
    related: ["debugger", "ci-fixer", "db-reader", "codebase-explorer"],
  },
  {
    slug: "nextjs-reviewer",
    title: "Next.js App Router Reviewer",
    summary: "Next.js App Router reviewer subagent for Claude Code and Cursor: server vs client components, data fetching, caching, metadata and secrets.",
    description: "Reviews Next.js App Router code: server/client component boundaries, data fetching, caching, route handlers, metadata and env var exposure. Use after changing files under app/.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You review Next.js App Router code.

First, check the installed Next.js version in package.json. If node_modules/next/dist/docs exists, read the relevant guide there before judging; APIs change between versions.

Check:
- "use client" only on the smallest interactive leaf; no server-only code imported into client components.
- Data fetched in Server Components or server actions, not with useEffect on the client, unless it is user-specific live data.
- Secrets only in server code; only NEXT_PUBLIC_ variables reach the browser.
- Server actions and route handlers validate input and check authorization.
- Caching and revalidation are intentional and match the version's defaults.
- Dynamic routes: generateStaticParams / dynamicParams and generateMetadata where SEO matters.
- next/image and next/link used where appropriate.

Report file:line, issue, fix. Do not edit files.`,
    intro: "Next.js changes fast, and models often apply advice from older versions. Since Next.js 16.2 the docs ship inside node_modules/next/dist/docs, so this reviewer is told to check the installed version and read those bundled docs first.",
    when: "Run after changing pages, layouts, server actions or route handlers in an App Router project.",
    pitfalls: [
      "Outdated caching advice. Defaults changed across versions; make it read the installed docs.",
      "Large client components. \"use client\" at the top of a page pulls everything into the bundle.",
      "Unvalidated server actions. They are public endpoints.",
    ],
    faqs: [
      { q: "Where are the bundled Next.js docs?", a: "From Next.js 16.2, version-matched docs are in node_modules/next/dist/docs/. Next.js recommends pointing agents there from AGENTS.md." },
      { q: "Does it work for the Pages Router?", a: "Partially. Replace the App Router checks with getServerSideProps/getStaticProps equivalents." },
      { q: "Can I combine it with the generic code reviewer?", a: "Yes. Run the generic reviewer for correctness and this one for framework-specific issues." },
    ],
    related: ["react-component-reviewer", "performance-reviewer", "security-auditor", "frontend-reviewer"],
  },
  {
    slug: "react-component-reviewer",
    title: "React Component Reviewer",
    summary: "React component reviewer subagent for Claude Code and Cursor: hooks rules, effects, state placement, keys, re-renders and component size.",
    description: "Reviews React components for hook misuse, unnecessary effects, state placement, keys, re-render issues and component size. Use after creating or changing React components.",
    tools: ["Read", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You review React components.

Check:
- Rules of hooks; complete, honest effect dependency arrays.
- Effects that should not exist: derived state computed in render, event logic moved into handlers, data fetching better done by the framework.
- State placed at the lowest common owner; no duplicated or derivable state.
- Stable, unique keys in lists (not array index for reorderable lists).
- Unnecessary re-renders only where they are measurable; do not add memo everywhere.
- Components over ~200 lines or with many responsibilities: suggest a split.
- Accessibility basics: semantic elements, labels.

Report file:line, issue, and a code fix. Do not edit files.`,
    intro: "Most React bugs come from effects and state placement. This reviewer focuses on those, following the React docs' guidance that many effects are unnecessary.",
    when: "Run after creating or modifying components, especially ones with useEffect or complex state.",
    pitfalls: [
      "Adding useMemo/useCallback everywhere. Only where it measurably helps.",
      "Silencing exhaustive-deps warnings instead of fixing the effect.",
      "Index keys on lists that reorder.",
    ],
    faqs: [
      { q: "Does it know React 19 features?", a: "Add a line naming your React version. If the React Compiler is enabled, tell it so it stops suggesting manual memoization." },
      { q: "Does it replace ESLint react-hooks?", a: "No. Keep the lint rule; this reviewer finds design issues the linter cannot." },
      { q: "React Native?", a: "Most checks apply; replace the accessibility line with React Native accessibility props." },
    ],
    related: ["nextjs-reviewer", "accessibility-auditor", "frontend-reviewer", "performance-reviewer"],
  },
  {
    slug: "frontend-reviewer",
    title: "Frontend UI Reviewer",
    summary: "Frontend UI reviewer subagent for Claude Code and Cursor: checks responsive layout, design tokens, loading/empty/error states and UX consistency.",
    description: "Reviews UI changes for responsive layout, design-system consistency, loading/empty/error states and UX details. Use after building or changing screens.",
    tools: ["Read", "Grep", "Glob"],
    model: "sonnet",
    prompt: `You review frontend UI code for product quality.

Check changed screens for:
- Every async view handles loading, empty, error and success states.
- Design tokens / existing components are reused; no one-off colors, spacing or font sizes.
- Responsive behavior at mobile and desktop widths; no fixed widths that overflow.
- Forms: validation messages, disabled submit while pending, no double submit.
- Destructive actions have confirmation or undo.
- Text: consistent casing and terminology with the rest of the app.

Report file:line, the issue, and the fix. Do not edit files.`,
    intro: "Agents build the happy path well and forget the rest. This reviewer checks the states and details users actually hit: empty lists, failed requests, small screens.",
    when: "Run after building a new screen or form, before handing UI work to a human reviewer.",
    pitfalls: [
      "One-off styles instead of design tokens.",
      "No error state for failed requests.",
      "Double-submit on slow networks.",
    ],
    faqs: [
      { q: "Can it look at screenshots?", a: "The subagent reviews code. For visual checks, have the parent agent use a browser tool and pass screenshots." },
      { q: "Does it need my design system docs?", a: "Point it at your tokens file or component library folder in the prompt for better results." },
      { q: "Frontend reviewer vs accessibility auditor?", a: "This one covers UX states and consistency; the accessibility auditor covers WCAG. Run both for UI work." },
    ],
    related: ["accessibility-auditor", "react-component-reviewer", "i18n-checker", "nextjs-reviewer"],
  },
  {
    slug: "python-reviewer",
    title: "Python Reviewer",
    summary: "Python code reviewer subagent for Claude Code and Cursor: type hints, exceptions, async misuse, resource handling and Pythonic idioms.",
    description: "Reviews Python changes for correctness, typing, exception handling, async misuse and resource management. Use after editing .py files.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You review Python code.

Check:
- Type hints on public functions; run the project's type checker (mypy/pyright) if configured.
- Exceptions: no bare except, no swallowing errors, specific exception types, errors not used for control flow.
- Resources closed with context managers (files, connections, locks).
- Async: no blocking calls (requests, time.sleep, sync DB drivers) inside async def.
- Mutable default arguments, late-binding closures in loops.
- Idioms: pathlib over os.path, f-strings, comprehensions where clearer; no premature classes.
- Dependencies match pyproject.toml; no new imports of uninstalled packages.

Report file:line, issue, fix. Do not edit files.`,
    intro: "A Python-specific reviewer catches language pitfalls that a generic reviewer misses, like blocking calls inside async code and mutable default arguments.",
    when: "Run after changes to Python services, scripts or notebooks converted to modules.",
    pitfalls: [
      "Blocking I/O inside async endpoints (FastAPI, aiohttp) that silently kills throughput.",
      "Bare except that hides KeyboardInterrupt and real bugs.",
      "Style nitpicks that ruff already handles; let the linter do that.",
    ],
    faqs: [
      { q: "Does it work for FastAPI and Django?", a: "Yes. Add framework lines, for example Depends usage for FastAPI or select_related for Django ORM." },
      { q: "Why Bash?", a: "To run mypy/pyright and pytest if configured. It still cannot edit files." },
      { q: "Can it use uv?", a: "If the project uses uv, it should run tools via uv run; mention it in AGENTS.md." },
    ],
    related: ["code-reviewer", "test-writer", "performance-reviewer", "type-fixer"],
  },
  {
    slug: "secrets-scanner",
    title: "Secrets Scanner",
    summary: "Secrets scanner subagent for Claude Code and Cursor: checks the staged diff and history for API keys, tokens and credentials before commit.",
    description: "Scans staged changes for secrets such as API keys, tokens, private keys and connection strings. Use proactively before every commit and push.",
    tools: ["Bash", "Read", "Grep", "Glob"],
    model: "haiku",
    prompt: `You prevent secrets from being committed.

When invoked:
1. Run \`git diff --staged\` (and \`git diff\` for unstaged changes).
2. Look for: API keys and tokens (common prefixes such as sk-, ghp_, xox, AKIA), private key blocks, passwords in URLs, .env files, service account JSON, JWTs.
3. Check that .env and similar files are in .gitignore.
4. If a project secret scanner is installed (gitleaks, trufflehog), run it.

Report each finding as file:line with the secret type. Show at most the first 4 characters of any secret.
If a secret was already committed, say that rotating it is required; removing it from the file is not enough.
Do not edit files.`,
    intro: "Leaked keys are one of the most common and costly mistakes, and agents happily paste keys into config files. A cheap pre-commit scanner subagent catches most of them.",
    when: "Run it before every commit and push, especially after the agent edited config files.",
    pitfalls: [
      "Printing the full secret in its report. It shows only a short prefix.",
      "Believing deletion fixes a leak. Committed secrets must be rotated.",
      "Relying only on the subagent. Use a real pre-commit hook (gitleaks) as well.",
    ],
    faqs: [
      { q: "Is this better than gitleaks?", a: "No; use both. Pattern tools are deterministic, the subagent also catches context-dependent leaks like a password in a comment." },
      { q: "Does it scan git history?", a: "By default only the staged diff. Ask it to run gitleaks on the history for a full audit." },
      { q: "Can it block the commit?", a: "Not by itself. In Claude Code, a hook can block git commit; the subagent only reports." },
    ],
    related: ["security-auditor", "dockerfile-reviewer", "code-reviewer", "commit-message-writer"],
  },
  {
    slug: "dead-code-finder",
    title: "Dead Code Finder",
    summary: "Dead code finder subagent for Claude Code and Cursor: locates unused exports, files, dependencies and feature flags with evidence.",
    description: "Finds unused exports, files, components, dependencies and stale feature flags. Use when cleaning up a codebase or after removing a feature.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You find dead code with evidence.

When invoked:
1. If the project has a tool for this (knip, ts-prune, vulture), run it.
2. Otherwise, for each candidate export/file, Grep for references across the repo, including dynamic imports, string references, config files and tests.
3. Watch for framework entry points that look unused but are loaded by convention (Next.js app/ files, route files, migrations, CLI entry points, public/).

Report each candidate with confidence (High/Medium) and the evidence (searches run, zero references). List what you excluded because it is loaded by convention.
Do not delete anything.`,
    intro: "Deleting code is the best refactor, but only with evidence. This subagent searches for references carefully and knows that framework files are often loaded by convention.",
    when: "Use it during cleanups, after removing a feature, or before a major upgrade to reduce surface area.",
    pitfalls: [
      "Deleting convention-loaded files (Next.js pages, migrations). The prompt lists them.",
      "Missing dynamic references like string-based imports or config.",
      "Deleting without review. It only reports; the refactorer applies.",
    ],
    faqs: [
      { q: "Should I install knip for this?", a: "Not required. The subagent uses it if present; otherwise it greps. Adding knip is worth it for large TypeScript repos." },
      { q: "Can it remove the dead code?", a: "Hand the report to the refactorer subagent, which deletes in small steps and runs tests." },
      { q: "Does it find unused CSS?", a: "Partially, by grepping class names. CSS modules make this reliable; global CSS is harder." },
    ],
    related: ["refactorer", "dependency-auditor", "codebase-explorer", "upgrade-assistant"],
  },
  {
    slug: "upgrade-assistant",
    title: "Upgrade Assistant",
    summary: "Framework upgrade subagent for Claude Code and Cursor: reads official migration guides, applies codemods, fixes breaking changes step by step.",
    description: "Upgrades a framework or major dependency version using the official migration guide and codemods. Use when bumping a major version.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob", "WebFetch"],
    model: "opus",
    prompt: `You upgrade dependencies across major versions safely.

When invoked with a package and target version:
1. Fetch the official upgrade/migration guide and changelog for every major version between current and target.
2. Make sure tests and build pass before starting.
3. Run official codemods first, if they exist.
4. Upgrade one major version at a time; after each, fix breaking changes, then run build, typecheck and tests.
5. Replace deprecated APIs the guide mentions, even if they still work.

Do not upgrade unrelated packages. Do not loosen tsconfig or lint rules to get green.
Report: versions changed, codemods run, manual changes by breaking change, remaining warnings.`,
    intro: "Major upgrades are where training-data knowledge is most out of date. This subagent is instructed to read the official migration guide for each version and to go one major version at a time.",
    when: "Use for React, Next.js, ESLint, TypeScript, Django, Pydantic or any major version bump.",
    pitfalls: [
      "Skipping intermediate versions. Guides assume one step at a time.",
      "Relying on memory instead of the official guide. That is why it has WebFetch.",
      "Upgrading everything at once, which makes failures impossible to attribute.",
    ],
    faqs: [
      { q: "Why opus?", a: "Upgrades involve many interacting changes and outdated knowledge. A stronger model plus the official guide reduces wrong fixes." },
      { q: "Can it run in a separate worktree?", a: "In Claude Code, set isolation: worktree to keep your working tree clean while it runs." },
      { q: "Cursor readonly?", a: "No; it edits files, so readonly is false." },
    ],
    related: ["dependency-auditor", "type-fixer", "architect", "test-runner"],
  },
  {
    slug: "agents-md-writer",
    title: "AGENTS.md Writer",
    summary: "Subagent that writes AGENTS.md / CLAUDE.md for your repo in Claude Code and Cursor: real commands, conventions and guardrails from the codebase.",
    description: "Creates or updates AGENTS.md (and CLAUDE.md) from the actual repository: commands, structure, conventions and guardrails. Use when setting up a repo for AI coding agents.",
    tools: ["Read", "Write", "Edit", "Grep", "Glob", "Bash"],
    model: "sonnet",
    prompt: `You write AGENTS.md files that make coding agents effective in this repo.

When invoked:
1. Read package manifests, lockfiles, CI workflows, lint/test config and the README.
2. Extract real commands (install, dev, build, test, lint, typecheck). Verify each exists; run cheap ones.
3. Document: stack and versions, directory layout (only the non-obvious parts), conventions visible in the code, and guardrails (generated files, secrets, things agents get wrong here).
4. Keep it under ~150 lines. No generic advice like "write clean code".
5. If CLAUDE.md does not exist, create it containing only \`@AGENTS.md\` so Claude Code imports the same file.

Preserve any existing managed blocks (for example <!-- BEGIN:nextjs-agent-rules -->). Report what you added.`,
    intro: "AGENTS.md is read by most coding agents (Codex, Cursor, Copilot and others), and Claude Code reads CLAUDE.md, which can import AGENTS.md with @AGENTS.md. This subagent writes one from repository facts instead of a generic template.",
    when: "Use when adopting AI agents in a repo, after big structural changes, or when agents keep making the same mistake.",
    pitfalls: [
      "Generic advice that wastes context. Only repo-specific facts.",
      "Commands that do not exist. It must verify them.",
      "Overwriting managed blocks, such as the one Next.js generates. Preserve them.",
    ],
    faqs: [
      { q: "Should I keep AGENTS.md and CLAUDE.md in sync?", a: "Use one source: put content in AGENTS.md and make CLAUDE.md contain @AGENTS.md. This is also what Next.js generates." },
      { q: "How long should AGENTS.md be?", a: "Short. Everything in it is loaded into context every session; aim for what an agent cannot infer from the code." },
      { q: "Can I have nested AGENTS.md files?", a: "Yes. Tools that support AGENTS.md use the nearest file to the edited code, which works well for monorepos." },
    ],
    related: ["codebase-explorer", "docs-writer", "architect", "code-reviewer"],
  },
];

export const getSubagent = (slug: string) => SUBAGENTS.find((a) => a.slug === slug);
