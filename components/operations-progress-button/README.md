# OperationsProgressButton

A floating button that displays the progress of background operations (file uploads, copies, moves, etc.). Expands into a list of active operations with individual progress bars and cancel/clear actions.

## Usage

```tsx
import { OperationsProgress } from "@docspace/ui-kit/components/operations-progress-button";

<OperationsProgress
  operations={operations}
  operationsAlert={false}
  operationsCompleted={false}
  clearOperationsData={handleClear}
  percent={45}
  mainButtonVisible={false}
/>
```

## Features

- **Preview button**: Compact floating button showing overall progress percentage
- **Expandable list**: Click to reveal all active operations with individual progress
- **Operation states**: Tracks in-progress, completed, and error states per operation
- **Cancel support**: Optional cancel button for ongoing uploads
- **Alert indicator**: Visual alert when operations encounter errors
- **Panel operations**: Separate track for panel-specific operations
- **Drag indicator**: Shows drop target folder name during drag operations

## Sub-components

- **PreviewButton** — Compact floating progress indicator
- **ProgressBar** — Individual operation progress bar
- **ProgressList** — Expandable list of all operations

## Key Properties

| Prop                       | Type                                          | Default | Description                                          |
|----------------------------|-----------------------------------------------|---------|------------------------------------------------------|
| `operations`               | `Operation[]`                                 | —       | Array of current operations                          |
| `panelOperations`          | `Operation[]`                                 | —       | Array of panel-specific operations                   |
| `operationsAlert`          | `boolean`                                     | —       | Whether any operation has an error                   |
| `operationsCompleted`      | `boolean`                                     | —       | Whether all operations are completed                 |
| `clearOperationsData`      | `(id?, operation?, item?) => void`            | —       | Clears completed/errored operations                  |
| `clearPanelOperationsData` | `(operation?) => void`                        | —       | Clears panel operations                              |
| `cancelUpload`             | `(t) => void`                                 | —       | Cancels the current upload                           |
| `percent`                  | `number`                                      | —       | Overall progress percentage                          |
| `mainButtonVisible`        | `boolean`                                     | —       | Whether the main action button is visible            |
| `showCancelButton`         | `boolean`                                     | —       | Shows a cancel button for operations                 |
| `isInfoPanelVisible`       | `boolean`                                     | —       | Whether the info panel is visible                    |

## Operation Type

```ts
interface Operation {
  id?: string;
  operation: string;
  label: string;
  alert: boolean;
  completed: boolean;
  percent?: number;
  errorCount?: number;
  items?: Array<{ operationId: string; percent: number }>;
}
```
