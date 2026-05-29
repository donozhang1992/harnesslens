# TEST_PLAN: OpenClaw-Kernel

> Source of truth for Week 2 acceptance. Defining tests is part of the Vibe Coding skill being trained.

## 1. Contract Tests

- valid session creation accepted;
- invalid UUID rejected;
- client message role other than `user` rejected;
- empty message content rejected;
- request schemas and response schemas are separate where contracts differ;
- response schemas do not leak ORM internals;
- provider config validates required provider/model fields;
- token/cost response fields have stable names.

## 2. Persistence Tests

- session can be saved and retrieved;
- message can be saved and listed;
- messages are ordered predictably;
- job status can be created and updated;
- token usage can be saved or attached to message/job;
- transaction failure does not leave inconsistent message/job state;
- Alembic migration creates expected tables.

## 3. HTTP Boundary Tests

- `POST /sessions` returns expected response;
- `POST /sessions/{id}/messages` creates message and job or accepted message state;
- async message submission returns `202 Accepted` when using job path;
- streaming message path returns SSE-compatible response;
- missing session returns not found and does not persist message/job;
- route handler can be tested with fake services where practical;
- `GET /jobs/{id}` returns status;
- invalid payload returns validation error.

## 4. SSE Tests

- fake provider emits multiple chunks;
- streaming endpoint forwards chunks in order;
- final metadata includes trace_id and token/cost fields;
- provider error during stream emits graceful failure behavior;
- frontend contract expects incremental chunks rather than only final text.

## 5. Provider Adapter Tests

- fake provider success returns normalized response;
- fake provider transient error is classified as retryable;
- fake provider rate-limit error is classified as retryable within budget;
- fake provider permanent error fails fast;
- timeout is bounded;
- provider SDK objects do not leak outside adapter boundary.

## 6. Queue Tests

- job can be enqueued and consumed;
- queue full behavior is explicit;
- worker updates status;
- worker failure updates status;
- queue backend can be mocked;
- process restart limitation is documented.

## 7. Resilience Tests

- transient error retries within max attempts;
- rate-limit error retries with bounded backoff;
- permanent error fails fast;
- timeout records visible failure;
- retry attempts are logged;
- final failure is inspectable.

## 8. Observability Checks

- route logs include trace_id;
- provider logs include trace_id, provider, model;
- enqueue/dequeue logs include job_id;
- worker logs include status transitions;
- failures include error type;
- token/cost metadata appears in logs or response;
- no application `print()` calls.

## 9. Frontend Checks

- frontend starts locally;
- user can submit a message;
- streamed response appears incrementally;
- trace_id is visible;
- token/cost metadata is visible after completion;
- frontend build/typecheck passes if configured.

## 10. ADLC Checks

- implementation plan exists before code generation;
- generated code is reviewed against SPEC;
- tests are run before acceptance;
- README records run/test/build commands;
- INTERVIEW_NOTES updated with current trade-offs.

