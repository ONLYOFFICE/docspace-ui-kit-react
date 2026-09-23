# AvatarEditorDialog

A modal dialog for cropping and zooming an avatar or cover image before saving it. It wraps `ImageEditor` in a `ModalDialog` with a title, Save and Cancel buttons, and a body that shrinks to fit short viewports. It is fully controlled: the caller owns `visible` and the `image` value, handles the file input, and receives the image and the cropped preview in `onSave`.

## Usage

```jsx
import { AvatarEditorDialog } from "@onlyoffice/apps-ui-kit/components/avatar-editor-dialog";

const MyComponent = () => {
  const [image, setImage] = useState({ zoom: 1, x: 0.5, y: 0.5 });

  return (
    <AvatarEditorDialog
      t={t}
      visible={visible}
      title="Change avatar"
      image={image}
      onChangeImage={setImage}
      onChangeFile={(e) => {
        const file = e.target.files?.[0];
        if (file) setImage((prev) => ({ ...prev, uploadedFile: file }));
      }}
      onClose={() => setVisible(false)}
      onSave={(image, preview) => uploadAvatar(image, preview)}
    />
  );
};
```

## Properties

| Name               | Type                                                        | Default | Description                                                                                                      |
| ------------------ | ----------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| t                  | TTranslation                                                | -       | Translator for the button labels (`Common:SaveButton`, `Common:CancelButton`) and the image editor's own strings |
| visible            | boolean                                                     | -       | Whether the dialog is open                                                                                       |
| title              | string                                                      | -       | Heading shown in the dialog header                                                                               |
| image              | TImage                                                      | -       | Current image, zoom and crop position; controlled by the caller                                                  |
| isLoading          | boolean                                                     | false   | Shows a loader on the save button and disables cancel and the editor                                             |
| editorBorderRadius | number                                                      | 110     | Border radius of the crop mask, in pixels; `0` gives a square crop                                               |
| maxImageSize       | number                                                      | -       | Maximum allowed image size, forwarded to the image editor (which does not currently use it)                      |
| dataTestId         | string                                                      | -       | Test id forwarded to the underlying modal dialog                                                                 |
| onClose            | () => void                                                  | -       | Called when the dialog is closed or cancelled, after the image is reset                                          |
| onSave             | (image: TImage, preview: string) => void \| Promise\<void\> | -       | Called by the save button with the current image and the cropped preview as a data URL                           |
| onChangeImage      | (image: TImage) => void                                     | -       | Called whenever the image, zoom or crop position changes                                                         |
| onChangeFile       | (e: ChangeEvent\<HTMLInputElement\>) => void                | -       | Change handler for the editor's file input ("Choose another")                                                    |

`TImage` is `{ uploadedFile?: string | File; zoom: number; x: number; y: number }`, exported from `components/image-editor`.

## Behaviour notes

- **Needs an image to show anything.** The body renders the cropper only when `image.uploadedFile` is set and is not the portal's default avatar (a string containing `default_user_photo`). With no file the dialog opens with an empty body; the only file input lives inside the cropper ("Choose another"), so the first file has to be picked outside the dialog.
- **Translator is a prop.** The dialog does not use the translation hook; pass a `t` that resolves the `Common:` keys above plus `Common:ChooseAnother` and `Common:Delete` used by the image editor.
- **Closing resets the image.** Cancel and the modal's close both call `onChangeImage({ x: 0.5, y: 0.5, zoom: 1, uploadedFile: undefined })` before `onClose`. Saving does not close the dialog — do that in `onSave`.
- **Short viewports.** When the viewport is shorter than 590px (a 448px cropper plus header and footer), the body gets a fixed height and scrolls; the height is recomputed on window resize.
- **Theme.** The crop overlay colour follows `isBase` from `ThemeContext`; outside a provider it uses the context's default.

## Styling

The body height is driven by a component-level variable, set inline by the dialog itself on short viewports:

```css
--modal-body-height /* fallback: auto */
```
