# SearchInput

A customizable search input component that provides various features like auto-refresh, clear button, and different sizes.

## Usage

```js
import { SearchInput } from "@docspace/ui-kit/components/search-input";
```

### Basic Example

```jsx
<SearchInput
  size="base"
  value={searchValue}
  onChange={handleSearch}
  placeholder="Search..."
  showClearButton
/>
```

### With Auto-refresh

```jsx
<SearchInput
  size="base"
  value={searchValue}
  onChange={handleSearch}
  autoRefresh
  refreshTimeout={1000}
  showClearButton
/>
```

## Component Properties

The properties are organized into four categories:

### Base Props

| Props          |          Type           | Required | Description                  |
| -------------- | :---------------------: | :------: | ---------------------------- |
| `id`           |        `string`         |    -     | Used as HTML `id` property   |
| `forwardedRef` | `Ref<HTMLInputElement>` |    -     | Forwarded ref                |
| `name`         |        `string`         |    -     | Sets the unique element name |
| `className`    |        `string`         |    -     | Accepts class                |
| `style`        |     `CSSProperties`     |    -     | Accepts css style            |
| `children`     |       `ReactNode`       |    -     | Child elements               |
| `tabIndex`     |        `number`         |    -     | HTML tabindex property       |
| `dataTestId`   |        `string`         |    -     | Added data-testid for testing |

### State Props

| Props        |    Type     | Required |             Values              | Default | Description                              |
| ------------ | :---------: | :------: | :-----------------------------: | :-----: | ---------------------------------------- |
| `value`      |  `string`   |    ✓     |                -                |    -    | Input value                              |
| `isDisabled` |  `boolean`  |    -     |                -                | `false` | Indicates that the field cannot be used  |
| `scale`      |  `boolean`  |    -     |                -                | `false` | Indicates that the input field has scale |
| `size`       | `InputSize` |    ✓     | `base`, `middle`, `large` | `base`  | Supported size of the input fields       |

### Behavior Props

| Props             |   Type    | Required | Default | Description                             |
| ----------------- | :-------: | :------: | :-----: | --------------------------------------- |
| `refreshTimeout`  | `number`  |    -     | `1000`  | Sets the refresh timeout of the input   |
| `autoRefresh`     | `boolean` |    -     | `true`  | Sets the input to refresh automatically |
| `showClearButton` | `boolean` |    -     | `false` | Displays the Clear Button               |
| `placeholder`     | `string`  |    -     |    -    | Placeholder text for the input          |

### Event Props

| Props           |           Type            | Required | Description                         |
| --------------- | :-----------------------: | :------: | ----------------------------------- |
| `onChange`      | `(value: string) => void` |    -     | Called when input value changes     |
| `onClearSearch` |       `() => void`        |    -     | Called when clear button is clicked |
| `onFocus`       | `(e: FocusEvent) => void` |    -     | Called when input is focused        |
| `onClick`       | `(e: MouseEvent) => void` |    -     | Called when input is clicked        |

## Sizes

The component supports three different sizes:

- `base`: Default size
- `middle`: Medium size
- `large`: Large size

## Features

- **Auto-refresh**: Automatically triggers search after a specified timeout
- **Clear Button**: Optional clear button to reset the input
- **Scalable**: Can be scaled to fit different layouts
- **Disabled State**: Can be disabled when needed
- **Custom Styling**: Supports custom CSS and className

## Examples

### With Different Sizes

```jsx
<SearchInput size="base" value="Base size" onChange={handleChange} />
<SearchInput size="middle" value="Middle size" onChange={handleChange} />
<SearchInput size="large" value="Large size" onChange={handleChange} />
```

### With Auto-refresh and Clear Button

```jsx
<SearchInput
  size="base"
  value={searchValue}
  onChange={handleSearch}
  autoRefresh
  refreshTimeout={1000}
  showClearButton
/>
```

### Disabled State

```jsx
<SearchInput size="base" value="Disabled input" isDisabled />
```

For more examples, check the component's stories in Storybook.
