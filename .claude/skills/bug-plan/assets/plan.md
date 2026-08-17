# Bug {scope}: {title} — Plan

## Tasks

### T1 · Regression test (RED)
- Write a test that reproduces the bug.
- Verify: {test command} — the test FAILS (proves the bug exists).
- Commit: test({area}): add regression test for {behavior}

### T2 · Fix (GREEN)
- {the specific change}
- Verify: {test command} — the test PASSES.
- Commit: fix({area}): {what changed}

### T3 · Refactor (if needed)
- {cleanup, behavior unchanged}
- Verify: all gates pass.
- Commit: refactor({area}): {what changed}
