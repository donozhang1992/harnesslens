# Sprint 01: OpenClaw-Kernel

This folder is the active workspace for the first Project-Driven Vibe Coding sprint.

## Draft Scaffold Notice

The markdown files in this folder are initial coaching scaffolds, not final answers.

Week 1 exists partly to revise them. The learner should actively participate in turning backend intuition into:

- stricter SPEC rules;
- clearer AGENT_RULES;
- sharper TEST_PLAN redlines;
- more precise SYSTEM_DESIGN decisions;
- stronger INTERVIEW_NOTES defenses.

The goal is to build a lightweight OpenClaw-inspired AI Gateway kernel:

```text
validated message intake
  -> persisted session/message state
  -> async job dispatch
  -> fake model execution
  -> persisted assistant reply
  -> structured end-to-end trace
```

Start with:

- [PRD.md](./PRD.md)
- [SPEC.md](./SPEC.md)
- [AGENT_RULES.md](./AGENT_RULES.md)
- [TODO.md](./TODO.md)
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)
- [TEST_PLAN.md](./TEST_PLAN.md)
- [INTERVIEW_NOTES.md](./INTERVIEW_NOTES.md)

This project intentionally starts small. It does not implement full OpenClaw, real LLM providers, Redis, Kafka, Celery, or a plugin ecosystem in Sprint 01.
