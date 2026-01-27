# Tabs

### Usage

```js
import { Tabs } from "@docspace/ui-kit/components/tabs";
```

```js
const array_items = [
  {
    id: "0",
    name: "Title1",
    content: (
      <div>
        <div>
          <button>BUTTON</button>
        </div>
        <div>
          <button>BUTTON</button>
        </div>
        <div>
          <button>BUTTON</button>
        </div>
      </div>
    ),
  },
  {
    id: "1",
    name: "Title2",
    content: (
      <div>
        <div>
          <label>LABEL</label>
        </div>
        <div>
          <label>LABEL</label>
        </div>
        <div>
          <label>LABEL</label>
        </div>
      </div>
    ),
  },
  {
    id: "2",
    name: "Title3",
    isDisabled: true,
    content: (
      <div>
        <div>
          <input></input>
        </div>
        <div>
          <input></input>
        </div>
        <div>
          <input></input>
        </div>
      </div>
    ),
  },
];
```

```jsx
<Tabs items={array_items} />
```

### Tabs Properties

| Props                  |          Type          | Required | Values |  Default  | Description                                                                                                                                                   |
| ---------------------- | :--------------------: | :------: | :----: | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                |        `array`         |    ✅    |   -    |     -     | Child elements                                                                                                                                                |
| `selectedItemId`       |   `number`, `string`   |    ✅    |   -    |     -     | Selected item id of tabs                                                                                                                                      |
| `type`                 | `primary`, `secondary` |    -     |   -    | `primary` | Theme for displaying tabs                                                                                                                                     |
| `stickyTop`            |        `string`        |    -     |   -    |     -     | Tab indentation for sticky positioning                                                                                                                        |
| `className`            |        `string`        |    -     |   -    |     -     | Sets a tab class name                                                                                                                                         |
| `onSelect`             |         `func`         |    -     |   -    |     -     | Sets a callback function that is triggered when the tab is selected                                                                                           |
| `withoutStickyIntend`  |       `boolean`        |    -     |   -    |     -     | Disables sticky indent                                                                                                                                        |
| `style`                |        `object`        |    -     |   -    |     -     | Accepts css style                                                                                                                                             |
| `layoutId`             |        `string`        |    -     |   -    |     -     | If set, this component will animate changes to its layout. Additionally, when a new element enters the DOM and an element already exists with a matching layoutId, it will animate out from the previous element's size/position |
| `isLoading`            |       `boolean`        |    -     |   -    |     -     | Is loading                                                                                                                                                    |
| `scaled`               |       `boolean`        |    -     |   -    |     -     | Scales tabs to container width                                                                                                                                |
| `hotkeysId`            |        `string`        |    -     |   -    |     -     | Unique identifier for hotkey functionality                                                                                                                    |
| `id`                   |        `string`        |    -     |   -    |     -     | Element id                                                                                                                                                    |
| `withAnimation`        |       `boolean`        |    -     |   -    |     -     | Enables animation                                                                                                                                             |

### Array Items Properties

| Props        |         Type          | Required | Values | Default | Description                                                              |
| ------------ | :-------------------: | :------: | :----: | :-----: | ------------------------------------------------------------------------ |
| `id`         |       `string`        |    ✅    |   -    |    -    | Index of object array                                                    |
| `name`       | `string`, `ReactNode` |    ✅    |   -    |    -    | Tab text                                                                 |
| `content`    |      `ReactNode`      |    ✅    |   -    |    -    | Content in Tab                                                           |
| `isDisabled` |       `boolean`       |    -     |   -    |    -    | State of tab inclusion. State only works for tabs with a secondary theme |
| `onClick`    |        `func`         |    -     |   -    |    -    | Triggered when a title is selected                                       |
| `badge`      |      `ReactNode`      |    -     |   -    |    -    | Badge shown after tab. Only for primary tabs type                        |
| `value`      |       `number`        |    -     |   -    |    -    | Numeric value                                                            |
| `iconName`   |       `string`        |    -     |   -    |    -    | Icon name. Only for secondary tabs type                                  |
