# TEST_PLAN: OpenClaw-Kernel

> Status: Draft scaffold. The learner should actively add, remove, and sharpen tests during Week 1. Defining the tests is part of the Vibe Coding skill being trained.

## 1. Contract Tests

- valid session creation accepted;
- invalid UUID rejected;
- client message role other than `user` rejected with validation error;
- empty message content rejected;
- request schemas and response schemas are separate where their allowed fields differ;
- response schemas do not leak ORM internals.

## 2. Persistence Tests

- session can be saved and retrieved;
- message can be saved and listed;
- messages are ordered predictably;
- job status can be created and updated;
- transaction failure does not leave inconsistent state.

## 3. HTTP Boundary Tests

- `POST /sessions` returns expected response;
- `POST /sessions/{id}/messages` creates message and job;
- `POST /sessions/{id}/messages` returns `202 Accepted` on successful async submission;
- successful message submission response includes `job_id`, `message_id`, and status fields defined by the response schema;
- missing session returns not found and does not persist a message or job;
- route handler can be exercised with a fake message service and without initializing a real database;
- `GET /jobs/{id}` returns status;
- invalid payload returns validation error.

## 4. Queue Tests

- job can be enqueued and consumed;
- queue full behavior is explicit;
- worker updates status;
- worker failure updates status;
- queue backend can be mocked.

## 5. Resilience Tests

- transient fake error retries within max attempts;
- permanent fake error fails fast;
- final failure is inspectable;
- retry attempts are logged.

## 6. Observability Checks

- route logs include trace_id;
- enqueue/dequeue logs include job_id;
- worker logs include status transitions;
- failures include error type;
- no application `print()` calls.
