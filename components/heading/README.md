# Heading

Heading text structured in levels.

## Usage

```js
import { Heading, HeadingLevel, HeadingSize } from "@docspace/ui-kit/components/heading";
```

```jsx
<Heading level={HeadingLevel.h1} size={HeadingSize.large} title="Some title">
  Some text
</Heading>
```

### Custom element rendering

You can override the rendered element using the `as` prop:

```jsx
<Heading level={HeadingLevel.h1} as="div">
  Rendered as div but styled as h1
</Heading>
```

## Properties

### Main Props

| Props      |      Type       | Required |                     Values                     |   Default   | Description                                                                                                                           |
| ---------- | :-------------: | :------: | :--------------------------------------------: | :---------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| `level`    | `HeadingLevel`  |    -     |        `h1`, `h2`, `h3`, `h4`, `h5`, `h6`      | `HeadingLevel.h1` | The heading level. It corresponds to the number after the 'H' for the DOM tag. Sets the level for semantic accuracy and accessibility. |
| `size`     | `HeadingSize`   |    -     | `xsmall`, `small`, `medium`, `large`, `xlarge` | `HeadingSize.medium` | Sets the size of headline                                                                                                             |
| `type`     | `HeadingType`   |    -     |       `header`, `menu`, `content`              |      -      | Sets the type of headline                                                                                                             |
| `children` | `React.ReactNode` |    -     |                       -                        |      -      | Content of the heading                                                                                                                |

### Style Props

| Props        |      Type       | Required | Default | Description                           |
| ------------ | :-------------: | :------: | :-----: | ------------------------------------- |
| `color`      |    `string`     |    -     |    -    | Specifies the headline color          |
| `fontSize`   |    `string`     |    -     |    -    | Sets the font size                    |
| `fontWeight` | `number \| string` |    -     |    -    | Sets the font weight                  |
| `lineHeight` |    `string`     |    -     |    -    | Sets the line height                  |
| `isInline`   |    `boolean`    |    -     | `false` | Sets the 'display: inline-block' property |
| `truncate`   |    `boolean`    |    -     | `false` | Disables word wrapping                |
| `className`  |    `string`     |    -     |    -    | Sets the class name                   |
| `style`      | `React.CSSProperties` |    -     |    -    | Additional inline styles              |

### HTML Props

| Props   |   Type   | Required | Default | Description                        |
| ------- | :------: | :------: | :-----: | ---------------------------------- |
| `id`    | `string` |    -     |    -    | HTML id attribute                  |
| `title` | `string` |    -     |    -    | Title attribute for hover tooltip  |
| `as`    | `React.ElementType` |    -     |    -    | Sets the tag through which the component is rendered |

The component also supports all standard HTML attributes for heading elements and ARIA attributes.
