# TabItem

A component used for creating tab navigation interfaces with support for active states and custom styling.

## Installation

```bash
import { TabItem } from "@docspace/ui-kit/components/tab-item";
```

## Usage

```jsx
// Basic usage
<TabItem
  label="Tab Label"
  isActive={false}
  onSelect={() => console.log("Tab selected")}
/>

// Active tab
<TabItem
  label="Active Tab"
  isActive={true}
  onSelect={handleTabSelect}
/>

// With custom class
<TabItem
  label="Custom Tab"
  isActive={false}
  className="custom-tab-class"
  onSelect={handleTabSelect}
/>

// With React node as label
<TabItem
  label={
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#2DA7DB" }}>●</span>
      <span>Tab with Icon</span>
    </div>
  }
  isActive={false}
  onSelect={handleTabSelect}
/>

// Disabled tab
<TabItem
  label="Disabled Tab"
  isActive={false}
  isDisabled={true}
  onSelect={handleTabSelect}
/>

// With custom data-testid
<TabItem
  label="Custom Test ID"
  isActive={false}
  dataTestId="custom-tab-item"
  onSelect={handleTabSelect}
/>

// With multi-select enabled
<TabItem
  label="Multi-select Tab"
  isActive={false}
  withMultiSelect={true}
  onSelect={handleTabSelect}
/>

// With lock last selection (prevents deselecting when active)
<TabItem
  label="Locked Tab"
  isActive={true}
  lockLastSelection={true}
  onSelect={handleTabSelect}
/>

// Tab group example
const TabGroup = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <TabItem
        label="First Tab"
        isActive={activeTab === "tab1"}
        onSelect={() => setActiveTab("tab1")}
      />
      <TabItem
        label="Second Tab"
        isActive={activeTab === "tab2"}
        onSelect={() => setActiveTab("tab2")}
      />
      <TabItem
        label="Third Tab"
        isActive={activeTab === "tab3"}
        onSelect={() => setActiveTab("tab3")}
      />
    </div>
  );
};
```

## Properties

| Prop                | Type                                | Default | Description                                                      |
| ------------------- | ----------------------------------- | ------- | ---------------------------------------------------------------- |
| `label`             | `string` \| `React.ReactNode`       | -       | Text or React node to display as the tab label                   |
| `isActive`          | `boolean`                           | `false` | When true, applies active styling to the tab                     |
| `onSelect`          | `(event: React.MouseEvent) => void` | -       | Callback function triggered when the tab is clicked              |
| `isDisabled`        | `boolean`                           | -       | When true, disables the tab and prevents interaction             |
| `className`         | `string`                            | -       | Optional CSS class name for custom styling                       |
| `allowNoSelection`  | `boolean`                           | -       | Allows the tab to be deselected, resulting in no active tab      |
| `withMultiSelect`   | `boolean`                           | `false` | Enables multi-select functionality                               |
| `dataTestId`        | `string`                            | -       | Custom data-testid attribute for testing                         |
| `lockLastSelection` | `boolean`                           | `false` | Prevents deselecting the tab when it's the last selected one     |

## Accessibility

The TabItem component includes the following accessibility features:

- `aria-selected` attribute to indicate the selected state of the tab
- Data attributes (`data-testid="tab-item"` and `data-testid="tab-item-text"`) for testing

## Testing

The TabItem component has comprehensive unit tests covering:

- Rendering with default and active states
- Click event handling
- Toggling active state
- Custom className support
- Rendering with React node as label

## Storybook

The TabItem component includes Storybook stories that demonstrate:

- Default state
- Active state
- Custom class usage
- React node as label
- Interactive tab group
