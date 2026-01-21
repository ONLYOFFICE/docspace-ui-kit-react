# @docspace/ui-kit

UI component library for DocSpace.

## Requirements

- React >= 18.0.0
- React DOM >= 18.0.0

## Installation

```bash
pnpm add @docspace/ui-kit
```

## Usage

### Import from main entry

```js
import { Label, Text, Link, Portal, Tooltip } from "@docspace/ui-kit";
```

### Import specific components

```js
import { Label } from "@docspace/ui-kit/components/label";
import { Text } from "@docspace/ui-kit/components/text";
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";
import { Portal } from "@docspace/ui-kit/components/portal";
import { Tooltip, TooltipContainer, withTooltip } from "@docspace/ui-kit/components/tooltip";
```

### Import utilities

```js
import { isMobile, isTablet, isDesktop, checkIsSSR } from "@docspace/ui-kit/utils";
```

## Components

| Component | Description |
|-----------|-------------|
| [Label](./components/label/README.md) | Form label with required indicator and tooltip support |
| [Text](./components/text/README.md) | Typography component with various styling options |
| [Link](./components/link/README.md) | Hyperlink component with page and action types |
| [Portal](./components/portal/README.md) | Renders children into a different DOM node |
| [Tooltip](./components/tooltip/README.md) | Customizable tooltip with multiple trigger options |
