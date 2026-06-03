# HarnessLens Agent Operating Guide

## 1. First Context Rule

Every agent must read `MIGRATION_PLAN.md` before changing code.

The active workspace follows the Browser + VS Code + Core classification MVP. Do not restore removed metadata or relationship prototype behavior.

Screenshot smoke note: Harness files define review intent and agent operating
rules for the project.

## 2. Roles

Main agent:

- Maintains product and migration intent.
- Updates harness docs and task status.
- Splits work into narrow migration tasks.
- Assigns test and implementation workers.
- Integrates outputs and runs final verification.
- Prevents workers from continuing deprecated MVP paths.

Worker agents:

- Execute assigned task only.
- Stay inside owned files.
- Follow MIGRATION_PLAN.md, CONTRACT.md, and TEST_PLAN.md.
- Stop if required edits exceed owned scope.

QA agent:

- Validates independently.
- Reports findings first.
- Confirms deprecated MVP behavior is not active.
- Does not edit files unless explicitly asked.

## 3. Available Agent Roles

Preferred roles:

- `core-test`
- `core-impl`
- `browser-test`
- `browser-impl`
- `vscode-test`
- `vscode-impl`
- `design`
- `qa`

If named custom agents are unavailable, spawn a generic `worker` and paste the relevant role instructions into the prompt.

## 4. Dispatch Prompt Requirements

Every worker prompt must include:

- Task ID from TASKS.md.
- Owned write scope.
- Files/sections to read first.
- Files/directories not to edit.
- Explicit note to read `MIGRATION_PLAN.md`.
- Exit criteria and retry limit.
- Handoff format.

## 5. TDD Flow

1. Confirm migration direction and contract.
2. Test worker writes failing tests.
3. Implementation worker makes tests pass.
4. QA validates independently.

Test author and implementation worker must differ for Core, Browser, and VS Code tasks unless the user explicitly overrides.

## 6. Parallelism Rules

Can run in parallel:

- Core tests and Browser test planning after CONTRACT.md v0.2 is stable.
- Browser tests and VS Code tests after core contract is stable.
- Design documentation and implementation work if write scopes do not overlap.

Must be sequenced:

- Core implementation waits for core tests.
- Browser and VS Code implementation wait for core implementation.
- Root workspace cleanup must be coordinated before integration QA.
- QA waits for an implementation slice.

Do not run in parallel:

- Two workers editing the same files.
- A worker changing CONTRACT.md while another implements against it.
- Test and implementation worker for the same task.

## 7. Context Loading

Load lazily.

Required first reads:

- `MIGRATION_PLAN.md`
- Relevant TASKS.md entry
- Relevant CONTRACT.md section
- Relevant TEST_PLAN.md section

Only expand to full files when blocked or debugging a mismatch.

## 8. Loop Control

- One bounded task per worker.
- Stop after two failed attempts for the same blocker.
- Stop when scope expansion is needed.
- Do not keep improving after acceptance criteria are met.

## 9. Handoff Format

Each worker handoff must include:

- Agent identity.
- Task ID.
- Files changed.
- Tests added or run.
- Commands run.
- Assumptions.
- Risks or follow-up needed.
