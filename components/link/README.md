# Link

A link component with 2 types:

1. `page` - simple link which refers to other pages and parts of the current page
2. `action` - link which usually doesn't have a hyperlink and performs an action on click (open dropdown, filter data, etc.)

### Usage

```js
import { Link, LinkType, LinkTarget } from "@docspace/ui-kit/components/link";
```

```jsx
<Link type={LinkType.page} color="black" href="https://github.com" isBold>
  Bold page link
</Link>
```

### Properties

| Props              |        Type        | Required |                         Values                          |  Default  | Description                                                                       |
| ------------------ | :----------------: | :------: | :-----------------------------------------------------: | :-------: | --------------------------------------------------------------------------------- |
| `href`             |      `string`      |    -     |                            -                            |     -     | Used as HTML `href` property                                                      |
| `id`               |      `string`      |    -     |                            -                            |     -     | Accepts id                                                                        |
| `isBold`           |     `boolean`      |    -     |                            -                            |  `false`  | Sets font weight to bold                                                          |
| `isHovered`        |     `boolean`      |    -     |                            -                            |  `false`  | Sets hovered state and link effects                                               |
| `isSemitransparent`|     `boolean`      |    -     |                            -                            |  `false`  | Sets css-property 'opacity' to 0.5. Usually applied for users with "pending" status |
| `isTextOverflow`   |     `boolean`      |    -     |                            -                            |  `true`   | Activates or deactivates text-overflow CSS property with ellipsis ('...') value   |
| `noHover`          |     `boolean`      |    -     |                            -                            |  `false`  | Disables hover effect                                                             |
| `enableUserSelect` |     `boolean`      |    -     |                            -                            |  `false`  | Enables user selection                                                            |
| `type`             |     `LinkType`     |    -     |                    `page`, `action`                     |  `page`   | Sets the link type                                                                |
| `target`           |    `LinkTarget`    |    -     |          `_blank`, `_self`, `_parent`, `_top`           |     -     | Sets the target attribute                                                         |
| `label`            |      `string`      |    -     |                            -                            |     -     | Label text                                                                        |
| `textDecoration`   |      `string`      |    -     | `none`, `underline`, `line-through`, `overline`, `underline dotted`, `underline dashed` |     -     | Sets the text decoration style                                                    |
| `ariaLabel`        |      `string`      |    -     |                            -                            |     -     | Accessibility label for the link                                                  |
| `dataTestId`       |      `string`      |    -     |                            -                            |     -     | Data attribute for testing                                                        |
| `onClick`          |     `function`     |    -     |                            -                            |     -     | Callback function triggered when link is clicked. Only for 'action' type          |
| `rel`              |      `string`      |    -     |                            -                            |     -     | Used as HTML `rel` property                                                       |
| `tabIndex`         |      `number`      |    -     |                            -                            |     -     | Used as HTML `tabindex` property                                                  |
| `title`            |      `string`      |    -     |                            -                            |     -     | Used as HTML `title` property                                                     |
| `color`            |      `string`      |    -     |                   `accent` or any CSS color             |     -     | CSS color or accent theme color                                                   |
| `className`        |      `string`      |    -     |                            -                            |     -     | Accepts class                                                                     |
| `style`            | `CSSProperties`    |    -     |                            -                            |     -     | Accepts css style                                                                 |

The Link component also inherits all props from the Text component.
