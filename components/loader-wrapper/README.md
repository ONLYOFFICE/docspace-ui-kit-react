# LoaderWrapper

Wrapper component that dims its children and blocks pointer events while an async flow is running.

## Features

- **Soft overlay**: Reduces opacity instead of hiding content.
- **Interaction lock**: Automatically disables pointer events to prevent accidental clicks.
- **Plug-and-play**: Works with any child tree and keeps layout intact.

## Usage

```tsx
import { LoaderWrapper } from "@docspace/ui-kit/components/loader-wrapper";

<LoaderWrapper isLoading>
  <SectionContent />
</LoaderWrapper>
```

## Props

| Prop       | Type              | Default             | Description                                   |
|------------|-------------------|---------------------|-----------------------------------------------|
| `children` | `React.ReactNode` | —                   | Content rendered inside the wrapper           |
| `isLoading`| `boolean`         | —                   | Toggles dimming and pointer-event blocking    |
| `testId`   | `string`          | `"loader-wrapper"` | `data-testid` override for automated testing  |
