# EmptyScreenContainer

A component for displaying empty states in the application. Use it to show informative messages with images, headers, descriptions, and action buttons when no content is available.

## Features

- **Visual Feedback**: Display an image to illustrate the empty state
- **Flexible Text Content**: Support for header, subheading, and description text
- **Action Buttons**: Include interactive elements to guide users
- **Custom Styling**: Apply custom styles to image and buttons container
- **Filter Mode**: Optional styling variant for filter-related empty states

## Installation

```tsx
import { EmptyScreenContainer } from "@docspace/ui-kit";
```

## Usage

```tsx
// Basic empty state
<EmptyScreenContainer
  imageSrc="/images/empty-state.svg"
  imageAlt="No items found"
  headerText="No results found"
/>

// With subheading and description
<EmptyScreenContainer
  imageSrc="/images/empty-filter.svg"
  imageAlt="Empty filter results"
  headerText="No results matching your search"
  subheadingText="No files to display in this section"
  descriptionText="Try adjusting your filters or search terms"
/>

// With action button
<EmptyScreenContainer
  imageSrc="/images/empty-folder.svg"
  imageAlt="Empty folder"
  headerText="This folder is empty"
  descriptionText="Upload files to get started"
  buttons={<Button primary label="Upload Files" onClick={handleUpload} />}
/>

// Without filter styling
<EmptyScreenContainer
  imageSrc="/images/welcome.svg"
  imageAlt="Welcome"
  headerText="Welcome to DocSpace"
  withoutFilter
/>
```

## Properties

| Prop              | Type              | Required | Default | Description                                              |
| ----------------- | ----------------- | :------: | ------- | -------------------------------------------------------- |
| `imageSrc`        | `string`          |    ✓     | -       | URL source for the empty state image                     |
| `imageAlt`        | `string`          |    ✓     | -       | Alternative text for the image for accessibility         |
| `headerText`      | `string`          |    ✓     | -       | Main header text displayed below the image               |
| `subheadingText`  | `string`          |    -     | -       | Optional subheading text displayed below the header      |
| `descriptionText` | `string \| ReactNode` |  -   | -       | Optional description text or element below the subheading |
| `buttons`         | `ReactNode`       |    -     | -       | Optional action buttons or interactive elements          |
| `withoutFilter`   | `boolean`         |    -     | `false` | Whether to display without filter styling                |
| `imageStyle`      | `CSSProperties`   |    -     | -       | Custom CSS styles for the image (desktop only)           |
| `buttonStyle`     | `CSSProperties`   |    -     | -       | Custom CSS styles for the buttons container              |
| `className`       | `string`          |    -     | -       | Additional CSS class name                                |
| `id`              | `string`          |    -     | -       | HTML id attribute                                        |
| `style`           | `CSSProperties`   |    -     | -       | Custom CSS styles for the container                      |

## Examples

### Filter Empty State

```tsx
import { EmptyScreenContainer } from "@docspace/ui-kit";
import { Link, LinkType } from "@docspace/ui-kit";
import CrossIcon from "PUBLIC_DIR/images/icons/12/cross.react.svg";

const FilterEmptyState = () => (
  <EmptyScreenContainer
    imageSrc="/images/empty-filter.svg"
    imageAlt="No filter results"
    headerText="No results matching your search"
    subheadingText="No files to display"
    descriptionText="Try adjusting your filter options or clear the filter to view all items."
    buttons={
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <CrossIcon />
        <Link type={LinkType.action} isHovered>
          Reset filter
        </Link>
      </div>
    }
  />
);
```

### Welcome Empty State

```tsx
import { EmptyScreenContainer } from "@docspace/ui-kit";
import { Button } from "@docspace/ui-kit";

const WelcomeEmptyState = () => (
  <EmptyScreenContainer
    imageSrc="/images/welcome.svg"
    imageAlt="Welcome"
    headerText="Welcome to your new workspace"
    descriptionText="Get started by creating your first document or uploading files."
    withoutFilter
    buttons={
      <>
        <Button primary label="Create Document" onClick={handleCreate} />
        <Button label="Upload Files" onClick={handleUpload} />
      </>
    }
  />
);
```

### Custom Styled Empty State

```tsx
<EmptyScreenContainer
  imageSrc="/images/custom.svg"
  imageAlt="Custom image"
  headerText="Custom styled empty state"
  descriptionText="This example demonstrates custom styling options"
  imageStyle={{ width: "150px", height: "150px" }}
  buttonStyle={{ marginTop: "32px" }}
  buttons={<Link type={LinkType.action}>Learn more</Link>}
/>
```

## Styling

The component uses CSS modules for styling. CSS class names for custom styling:

- `.ec-image` - The image element
- `.ec-header` - The header text
- `.ec-subheading` - The subheading text
- `.ec-desc` - The description text
- `.ec-buttons` - The buttons container

```tsx
<EmptyScreenContainer
  className="my-empty-state"
  imageSrc="/images/empty.svg"
  imageAlt="Empty"
  headerText="No content"
/>
```
