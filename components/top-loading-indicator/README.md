# TopLoadingIndicator

A service class that controls a thin progress bar at the very top of the page (similar to NProgress/nprogress). It animates from 0% to 100% width on a DOM element with the id `ipl-progress-indicator`.

## Usage

```ts
import { TopLoaderService } from "@docspace/ui-kit/components/top-loading-indicator";

// Start the progress bar (e.g., on route change)
TopLoaderService.start();

// Complete the progress bar
TopLoaderService.end();

// Cancel and reset the progress bar
TopLoaderService.cancel();
```

## Features

- **Smooth animation**: Updates every 50ms for fluid visual progress
- **Automatic pacing**: Reaches 50% in the first second, then adds 10% per second up to 90%
- **Fast completion**: Fills to 100% in ~100ms when `end()` is called
- **Cancel support**: Instantly resets the bar to 0%
- **ARIA attributes**: Sets `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`
- **No React dependency**: Pure DOM manipulation — works outside the React tree

## API

| Method                    | Description                                              |
|---------------------------|----------------------------------------------------------|
| `TopLoaderService.start()`  | Starts or restarts the progress animation from 0%      |
| `TopLoaderService.end()`    | Triggers the completion animation to 100%              |
| `TopLoaderService.cancel()` | Immediately resets the bar to 0% and stops the timer   |

## Prerequisites

The page must contain an element with `id="ipl-progress-indicator"`:

```html
<div id="ipl-progress-indicator"></div>
```
