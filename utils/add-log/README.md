# add-log

Conditionally logs a message to the console or accumulates it in `window.logs`, gated by `window.ClientConfig`.

## What It Does

- `addLog(log, category)` — no-op unless `window.ClientConfig.logs.enableLogs` is set
  - If `logsToConsole` is on, logs to `console.log`
  - Otherwise pushes the message onto `window.logs[category]` (creating the array as needed)

## Import

```ts
import { addLog } from "../../utils/add-log";
```

## Usage

```ts
addLog("socket connected", "socket");
```

## API

```ts
addLog(log: string, category: "socket"): void
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `addLog` function |
