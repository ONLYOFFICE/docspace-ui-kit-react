---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "test/**"
  - "vitest.config.mts"
---

# Unit tests: every state update inside `act()`

A test has to cause each React state update inside `act()`. Outside it, React logs
`An update to X inside a test was not wrapped in act(...)`. The assertion that follows may then
run before the update lands, and an update still pending at the end can land in the next test.
A green run with that warning is not done.

## What already wraps, and what does not

`render`, `rerender`, `fireEvent.*`, `userEvent` and `waitFor` wrap their own work. These do
not, and each needs its own `act`:

- **A direct DOM call on an element React listens to**: `el.focus()`, `el.blur()`,
  `el.click()`, `window.dispatchEvent(...)`. `focus()` runs the element's `onFocus`, and a roving
  tab stop or a listbox sets state there. Write `act(() => el.focus())`.
- **A callback a mocked child captured, called by hand**: `mockStore.onConfirm?.()` runs the
  component's handler, and the handler sets state. Use `act(() => { cb(); })`, or
  `await act(async () => { await cb(); })` when the callback is async.
- **An async handler reached through `fireEvent`**: `fireEvent`'s `act` is synchronous and closes
  before the handler's `await` resumes. A `setIsLoading(false)` after `await onAccept(value)` or
  `await onSubmit(...)` lands outside it. Wrap the event in an async `act` and await it; the test
  becomes `async`:

  ```tsx
  await act(async () => {
    fireEvent.keyDown(accept, { key: " " });
  });
  ```

A missing `act` can stay quiet for a while. React drops a `setState` to the value it already
holds without scheduling anything. The same call starts warning once an earlier update leaves the
component with pending work, so wrap the call even when the test is quiet today.

Fix the test, not the component. Change the component only when its update outlives it, because
it schedules a timer or a frame it never cancels; that is a bug of its own.

## Mocking a module that `React.lazy` loads

`vi.mock` on the module itself does not hold for the `import()` React calls. Vitest takes the
importer from the stack, and under `React.lazy` the top frame is React's, in `node_modules`. The
same `import()` called from the component's own code (a prefetch in an effect) gets the mock;
the one from the lazy initializer gets the real module. Mock what the lazy module imports
statically instead, so either path renders the stub. `useAiChatPanel.test.tsx` mocks `new-chat`
and the header's children rather than `ai-chat-panel-body` and
`ai-chat-panel-header-container`. A test that needs a fresh `React.lazy` (one that resolves, then
one that fails) takes the hook through `vi.resetModules()` and `vi.doMock` per test, because a
lazy component keeps the first outcome of its load.

## Seeing the warnings

Vitest 4 switches to its agent reporter when an AI agent runs it. That reporter hides what
passing tests print, so a quiet run there proves nothing. Ask for the default reporter and
search the output:

```bash
pnpm exec vitest run <files> --reporter=default 2>&1 | grep -B1 "not wrapped in act"
```

In a person's terminal, `pnpm test` and the pre-push `test:changed` print them as they are.
