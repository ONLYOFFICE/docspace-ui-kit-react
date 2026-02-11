# Snackbar

A notification bar component displayed at the top of a section. Supports timed auto-dismiss, action buttons, background images, HTML content, and campaign/maintenance banner modes.

## Usage

```tsx
import { Snackbar } from "@docspace/ui-kit/components/snackbar";

<Snackbar
  headerText="Update Available"
  text="A new version is ready to install."
  btnText="Update Now"
  onAction={handleUpdate}
  countDownTime={10}
  sectionWidth={800}
/>
```

## Features

- **Auto-dismiss**: Countdown timer that automatically hides the snackbar
- **Action button**: Optional button with click handler
- **Background image**: Custom background for campaign banners
- **HTML content**: Render rich HTML inside the snackbar
- **Campaign mode**: Special styling for promotional banners
- **Maintenance mode**: Special styling for maintenance notifications
- **Close button**: Optional close callback
- **Customizable typography**: Font size, weight, and text alignment

## Properties

| Prop                   | Type                              | Default | Description                                          |
|------------------------|-----------------------------------|---------|------------------------------------------------------|
| `text`                 | `string \| ReactNode`             | —       | Main snackbar text content                           |
| `headerText`           | `string`                          | —       | Header text displayed above the main text            |
| `additionalHeaderText` | `string`                          | —       | Additional info text next to the header              |
| `btnText`              | `string`                          | —       | Action button label                                  |
| `onAction`             | `(e?: MouseEvent) => void`        | —       | Callback when the action button is clicked           |
| `onClose`              | `() => void`                      | —       | Callback when the close button is clicked            |
| `countDownTime`        | `number`                          | —       | Auto-dismiss countdown in seconds                    |
| `sectionWidth`         | `number`                          | —       | Width of the parent section in pixels                |
| `backgroundImg`        | `string`                          | —       | URL for the background image                         |
| `showIcon`             | `boolean`                         | —       | Whether to display the snackbar icon                 |
| `fontSize`             | `string`                          | —       | Custom font size                                     |
| `fontWeight`           | `number`                          | —       | Custom font weight                                   |
| `textAlign`            | `TextAlignValue`                  | —       | Text alignment                                       |
| `htmlContent`          | `string`                          | —       | HTML string rendered inside the snackbar             |
| `style`                | `React.CSSProperties`             | —       | Custom inline styles                                 |
| `opacity`              | `number`                          | —       | Custom opacity value                                 |
| `isCampaigns`          | `boolean`                         | —       | Enables campaign banner styling                      |
| `isMaintenance`        | `boolean`                         | —       | Enables maintenance banner styling                   |
| `onLoad`               | `() => void`                      | —       | Callback when the snackbar content is fully loaded   |

## Examples

### Campaign Banner

```tsx
<Snackbar
  isCampaigns
  headerText="Special Offer"
  text="Upgrade to Pro and save 50%"
  btnText="Learn More"
  onAction={handleLearnMore}
  backgroundImg="/images/campaign-bg.png"
  countDownTime={0}
  sectionWidth={800}
/>
```

### Maintenance Notice

```tsx
<Snackbar
  isMaintenance
  headerText="Scheduled Maintenance"
  text="The system will be unavailable on Sunday from 2:00 to 4:00 AM."
  countDownTime={0}
  sectionWidth={800}
  onClose={handleDismiss}
/>
```
