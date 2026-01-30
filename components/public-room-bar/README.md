# PublicRoomBar

Information bar component for displaying public room notifications with header text, body text, and an optional close button.

## Features

- **Header and Body Text**: Supports both string and React components
- **Custom Icon**: Optional custom icon in the header
- **Dismissible**: Optional close button with callback
- **Theme Support**: Adapts to light and dark themes
- **Visibility State**: Control margin based on bar visibility

## Installation

```tsx
import { PublicRoomBar } from "@docspace/ui-kit";
```

## Usage

```tsx
// Basic usage
<PublicRoomBar
  headerText="Public Room"
  bodyText="This room is accessible to anyone with the link"
  onClose={() => console.log("Closed")}
/>

// Without close button
<PublicRoomBar
  headerText="Information"
  bodyText="Some important information here"
/>

// With custom components
<PublicRoomBar
  headerText={<span style={{ color: "blue" }}>Custom Header</span>}
  bodyText={<em>Custom body content</em>}
  onClose={handleClose}
/>

// With custom icon (URL string)
<PublicRoomBar
  headerText="Custom Icon"
  bodyText="Using a custom icon"
  iconName="/path/to/icon.svg"
/>

// With visibility state
<PublicRoomBar
  headerText="Visible Bar"
  bodyText="This bar is visible"
  barIsVisible={true}
/>
```

## Properties

| Prop           | Type                       | Required | Default | Description                                    |
| -------------- | -------------------------- | :------: | ------- | ---------------------------------------------- |
| `headerText`   | `string \| ReactNode`      |    Yes   | -       | Header text or component                       |
| `bodyText`     | `string \| ReactNode`      |    Yes   | -       | Body text or component                         |
| `iconName`     | `string`                   |    -     | -       | Custom icon URL path                           |
| `onClose`      | `() => void`               |    -     | -       | Callback when close button clicked             |
| `barIsVisible` | `boolean`                  |    -     | `false` | Controls top margin based on visibility        |
| `className`    | `string`                   |    -     | -       | Additional CSS class name                      |
| `style`        | `CSSProperties`            |    -     | -       | Custom inline styles                           |
| `dataTestId`   | `string`                   |    -     | -       | Test ID for testing                            |
| `ref`          | `RefObject<HTMLDivElement>`|    -     | -       | Ref to the container element                   |

## Examples

### Notification Bar

```tsx
const NotificationBar = ({ message, onDismiss }) => (
  <PublicRoomBar
    headerText="Notice"
    bodyText={message}
    onClose={onDismiss}
  />
);
```

### Public Room Indicator

```tsx
const PublicRoomIndicator = ({ roomName, description }) => (
  <PublicRoomBar
    headerText={roomName}
    bodyText={description}
    barIsVisible={true}
  />
);
```

## Styling

The component uses CSS modules with theme support. Available CSS classes:

- `.container` - Main container with theme variables
- `.textContainer` - Text content wrapper
- `.headerBody` - Header row with icon and text
- `.headerIcon` - Icon container
- `.header` - Header text
- `.body` - Body text
- `.closeIcon` - Close button icon
- `.barVisible` - Applied when `barIsVisible` is true

### Theme Variables

The component defines CSS variables for light and dark themes:

```scss
// Light theme
--info-block-background: gray-light
--info-block-header-color: black
--info-block-description-color: gray-text
--icon-button-color: gray

// Dark theme
--info-block-background: dark-gray-light
--info-block-header-color: white
--info-block-description-color: dark-gray-dark
--icon-button-color: gray-dark
```

```tsx
<PublicRoomBar
  headerText="Styled Bar"
  bodyText="With custom styling"
  className="my-custom-bar"
  style={{ maxWidth: "400px" }}
/>
```
