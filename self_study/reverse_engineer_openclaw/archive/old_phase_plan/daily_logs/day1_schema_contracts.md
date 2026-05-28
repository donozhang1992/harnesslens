# Day 1 Schema Contracts Notes

Date: 2026-05-15

## Goal

Day 1 focused on turning the Day 0 Gateway mental map into a small Python contract layer. The goal was not to clone OpenClaw's full Gateway, but to extract one stable backend slice:

```text
HTTP request
  -> FastAPI route
  -> Pydantic schema validation
  -> service logic
  -> persistence later
  -> HTTP response
```

## Gateway Lifecycle Understanding

The refined lifecycle model:

```text
1. bootstrap network runtime
2. load config snapshot + prepare auth/secrets
3. bootstrap plugins: discover, plan, register plugin capability
4. create runtime foundations: channel manager, readiness, HTTP/WS runtime state, live state
5. start pre-listen internal runtime: early runtime, event subscriptions, runtime services
6. create gateway request context
7. attach WS/HTTP handlers
8. start listening
9. start post-attach runtime: channels, plugin services, Tailscale/discovery, sidecars readiness
10. start config reloader
```

Key distinction:

```text
listen before:
  control-plane preparation and internal runtime startup

listen after:
  external side effects that need the Gateway HTTP/WS surface to exist
```

## Python Mapping

`openclaw_python` is the Python backend root, not a one-to-one translation of `openclaw/src/gateway`.

```text
main.py:
  application composition, config/logging setup, router registration, lifecycle hooks

core/:
  config, structured logging, future auth/security/observability helpers

api/:
  HTTP/WS protocol boundary; Day 1 only uses HTTP REST

schemas/:
  Pydantic request/response contracts

services/:
  business use cases such as creating sessions and appending messages

db/:
  engine, async session factory, Base, database lifecycle

models/:
  SQLAlchemy persistence shape: tables, columns, relationships
```

## Day 1 REST Scope

WebSocket is intentionally out of scope for Day 1.

The minimum REST slice:

```text
POST /sessions
POST /sessions/{session_id}/messages
GET /sessions/{session_id}/messages
```

## Schema Decisions

### SessionCreate

```text
user_id: request body UUID
title: optional request body string, stripped, non-empty if present, max 200
metadata: optional request body dict, default {}
```

### SessionRead

```text
id: response UUID, server generated
user_id: response UUID
title: optional response string
status: response enum active/archived
created_at: response datetime, server generated
updated_at: response datetime, server generated
metadata: response dict
```

### MessageCreate

```text
session_id: URL path UUID, not in request body
role: request body enum user/assistant/system/tool
content: request body string, stripped, non-empty
metadata: optional request body dict, default {}
```

### MessageRead

```text
id: response UUID, server generated
session_id: response UUID
role: response enum user/assistant/system/tool
content: response string
metadata: response dict
created_at: response datetime, server generated
```

## Current Status

`openclaw_python` has been initialized with:

```text
app/main.py
app/schemas/session.py
app/schemas/message.py
tests/test_schemas.py
pyproject.toml
```

Schema implementation is in draft state. `TitleStr` and `ContentStr` now use `Annotated[str, StringConstraints(...)]`. Tests are the next priority.

## Next Session

Start with schema tests:

```text
- valid SessionCreate
- blank title rejected
- invalid user_id rejected
- valid MessageCreate
- invalid role rejected
- blank content rejected
- metadata must be dict
```

Then verify whether Pydantic `Annotated[str, StringConstraints(...)]` strips whitespace and rejects empty strings as expected. If not, add focused `field_validator` checks.
