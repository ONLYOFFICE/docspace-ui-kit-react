# Tags Component

The `Tags` component is used to display a collection of tags with automatic overflow handling.

## Usage

```tsx
import { Tags } from "@docspace/ui-kit";

function MyComponent() {
  const handleTagSelect = (tag) => {
    console.log("Selected tag:", tag);
  };

  return (
    <Tags
      tags={["Design", "Development", "Marketing", "Sales"]}
      columnCount={3}
      onSelectTag={handleTagSelect}
    />
  );
}
```

## Properties

| Property          | Type                              | Required | Default | Description                                              |
| ----------------- | --------------------------------- | -------- | ------- | -------------------------------------------------------- |
| `id`              | `string`                          | No       | -       | Accepts id                                               |
| `tags`            | `Array<TagType \| string>`        | Yes      | -       | Array of tags to display                                 |
| `className`       | `string`                          | No       | -       | Accepts class                                            |
| `columnCount`     | `number`                          | Yes      | -       | Number of tags to display before showing overflow        |
| `style`           | `React.CSSProperties`             | No       | -       | Accepts css style                                        |
| `onSelectTag`     | `(tag: TagClickEvent) => void`    | Yes      | -       | Function called when a tag is selected                   |
| `onMouseEnter`    | `() => void`                      | No       | -       | Mouse enter event handler                                |
| `onMouseLeave`    | `() => void`                      | No       | -       | Mouse leave event handler                                |
| `optionTagRef`    | `RefObject<HTMLDivElement>`       | No       | -       | Reference to the option tag element                      |
| `onOptionTagClick`| `VoidFunction`                    | No       | -       | Callback when the option tag is clicked                  |
| `showCreateTag`   | `boolean`                         | No       | -       | Controls visibility of the create tag button             |
| `removeTagIcon`   | `boolean`                         | No       | `false` | Determines whether to show a remove icon for the tag     |

## Examples

### Basic Usage

```tsx
<Tags
  tags={["React", "TypeScript", "Node.js"]}
  columnCount={3}
  onSelectTag={(tag) => console.log(tag)}
/>
```

### With Overflow Dropdown

```tsx
<Tags
  tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]}
  columnCount={3}
  onSelectTag={(tag) => console.log(tag)}
  style={{ width: "300px" }}
/>
```

### With Custom Option Tag Handler

```tsx
const optionRef = useRef<HTMLDivElement>(null);

<Tags
  tags={["Design", "Development"]}
  columnCount={2}
  onSelectTag={(tag) => console.log(tag)}
  optionTagRef={optionRef}
  onOptionTagClick={() => console.log("Option tag clicked")}
  showCreateTag
/>
```
