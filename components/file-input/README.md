# FileInput

File entry field

### Usage

```js
import { FileInput } from "@docspace/ui-kit/components/file-input";
```

```jsx
<FileInput
  placeholder="Input file"
  accept={[".doc", ".docx"]}
  onInput={(file) => {
    console.log(
      file,
      `name: ${file.name}`,
      `lastModified: ${file.lastModifiedDate}`,
      `size: ${file.size}`,
    );
  }}
/>
```

### Properties

| Props         |      Type      | Required |                  Values                  | Default | Description                                                                        |
| ------------- | :------------: | :------: | :--------------------------------------: | :-----: | ---------------------------------------------------------------------------------- |
| `accept`      |   `string[]`   |    -     |                    -                     |   `[""]` | Specifies files visible for upload                                                 |
| `buttonLabel` |    `string`    |    -     |                    -                     |    -    | Specifies the label for the upload button                                          |
| `className`   |    `string`    |    -     |                    -                     |    -    | Accepts class                                                                      |
| `data-test-id`|    `string`    |    -     |                    -                     |    -    | Data attributes for testing                                                        |
| `hasError`    |     `bool`     |    -     |                    -                     | `false` | Indicates the input field has an error                                             |
| `hasWarning`  |     `bool`     |    -     |                    -                     | `false` | Indicates the input field has a warning                                            |
| `id`          |    `string`    |    -     |                    -                     |    -    | Used as HTML `id` property                                                         |
| `idButton`    |    `string`    |    -     |                    -                     |    -    | ID for the button element                                                          |
| `isDisabled`  |     `bool`     |    -     |                    -                     | `false` | Indicates that the field cannot be used (e.g not authorised, or changes not saved) |
| `isDocumentIcon` |     `bool`     |    -     |                    -                     | `false` | Indicates that icon is document. Otherwise, it is folder icon                      |
| `isMultiple`  |     `bool`     |    -     |                    -                     | `true`  | Indicates that the input may contain multiple files                                 |
| `isLoading`   |     `bool`     |    -     |                    -                     | `false` | Tells when the button should show loader icon                                       |
| `name`        |    `string`    |    -     |                    -                     |    -    | Used as HTML `name` property                                                       |
| `onInput`     |     `func`     |    -     |                    -                     |    -    | Called when a file is selected (File or File[])                                    |
| `placeholder` |    `string`    |    -     |                    -                     |    -    | Placeholder text for the input                                                     |
| `scale`       |     `bool`     |    -     |                    -                     | `false` | Indicates the input field has scale                                                |
| `size`        |    `string`    |    -     | `base`, `middle`, `big`, `huge`, `large` | `base`  | Supported size of the input fields.                                                |
| `style`       | `obj`, `array` |    -     |                    -                     |    -    | Accepts css style                                                                  |
