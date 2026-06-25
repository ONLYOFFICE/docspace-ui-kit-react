# StatusMessage Component

A component for displaying animated status messages with error and warning styles.

## Installation

```js
import { StatusMessage } from "@docspace/ui-kit";
```

## Basic Usage

```jsx
<StatusMessage message="This is a status message" />
```

## Component Properties

| Props       |             Type              | Required | Default | Description                                    |
| ----------- | :---------------------------: | :------: | :-----: | ---------------------------------------------- |
| `message`   | `string \| React.ReactNode`   |    ✓     |    -    | Message content to display                     |
| `isWarning` |           `boolean`           |    -     | `false` | Whether to display as warning style            |

## Examples

### Default Status Message

```jsx
<StatusMessage message="This is a status message" />
```

### Warning Message

```jsx
<StatusMessage message="This is a warning message" isWarning />
```