# Day 0 Gateway Prewarm Notes

## Goal

Tonight is not Day 1. The goal is to build a lightweight mental map so Day 1 can start cleanly.

## Current Understanding

OpenClaw Gateway is not the business feature itself. It is the control plane that starts and coordinates configuration, authentication, plugin runtime, HTTP/WebSocket surfaces, channels, and background sidecars.

## Startup Chain

```text
entry.ts
  -> runCli(...)
  -> gateway command
  -> gateway/server.ts
      lazy-loads server.impl.ts
  -> server.impl.ts:startGatewayServer(...)
      1. bootstrap network runtime
      2. load config snapshot
      3. prepare auth, secrets, runtime config
      4. bootstrap plugins
      5. create channel manager and readiness checker
      6. create HTTP/WebSocket runtime state
      7. start early runtime services
      8. create gateway request context
      9. attach WebSocket handlers
      10. start listening
      11. start post-attach runtime: plugins, channels, sidecars
      12. mark ready
      13. start config reloader
```

## Important Files Read

- `openclaw/src/entry.ts`: CLI entrypoint and environment/bootstrap guard.
- `openclaw/src/gateway/server.ts`: thin lazy-loading wrapper around the real server implementation.
- `openclaw/src/gateway/server.impl.ts`: real Gateway startup orchestration.
- `openclaw/src/gateway/server-request-context.ts`: dependency/context object passed into Gateway handlers.
- `openclaw/src/gateway/protocol/schema/logs-chat.ts`: WebChat and chat.send protocol schemas.
- `openclaw/src/gateway/protocol/schema/sessions.ts`: session RPC schemas.
- `openclaw/src/channels/message/types.ts`: channel message delivery and capability contracts.

## Key Architecture Takeaways

1. `server.ts` is intentionally small. It delays importing the heavy implementation and can emit startup timing.
2. `server.impl.ts` is orchestration-heavy. It wires subsystems together rather than owning every business rule directly.
3. `GatewayRequestContext` is a dependency bundle. In Python, this maps naturally to FastAPI dependencies and service objects.
4. OpenClaw validates transport payloads with TypeBox/AJV schemas. In Python, our equivalent is Pydantic v2.
5. OpenClaw's real message model is rich: session key, delivery route, attachments, idempotency, streaming, transcript persistence, and channel metadata. Day 1 should intentionally model only the durable core.

## Day 1 Python Mapping

For the first implementation pass, do not clone the full Gateway.

Map the concepts like this:

```text
OpenClaw config/runtime bootstrap
  -> app/core/config.py

OpenClaw gateway startup orchestration
  -> app/main.py

OpenClaw TypeBox/AJV schemas
  -> app/schemas/*.py with Pydantic

OpenClaw GatewayRequestContext
  -> FastAPI dependencies + app/services/*.py

OpenClaw session store/transcript files
  -> SQLAlchemy models + repositories/services

OpenClaw chat.send/message pipeline
  -> POST /sessions/{session_id}/messages
```

## Day 1 Minimal Schemas

Suggested `Session` fields:

- `id`: UUID
- `user_id`: UUID
- `title`: optional string
- `status`: enum, `active` or `archived`
- `created_at`: datetime
- `updated_at`: datetime

Suggested `Message` fields:

- `id`: UUID
- `session_id`: UUID
- `role`: enum, `user`, `assistant`, `system`, or `tool`
- `content`: non-empty string
- `metadata`: dict
- `created_at`: datetime

## Questions To Start Day 1

1. Where does OpenClaw create and start the Gateway?
2. Which startup responsibilities belong in Python `main.py`, and which belong in `core/` helpers?
3. What is the smallest useful Session contract?
4. What is the smallest useful Message contract?
5. Which invalid payloads should Pydantic reject first?

