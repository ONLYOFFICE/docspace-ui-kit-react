# FormWrapper

A styled container component that wraps form content with consistent padding, background, and border-radius. Typically used on login and registration pages.

## Usage

```tsx
import { FormWrapper } from "@docspace/ui-kit/components/form-wrapper";

<FormWrapper>
  <Input placeholder="Email" />
  <Input placeholder="Password" type="password" />
  <Button primary label="Sign In" />
</FormWrapper>
```

## Properties

| Prop        | Type                | Default | Description                          |
|-------------|---------------------|---------|--------------------------------------|
| `children`  | `React.ReactNode`   | —       | Content rendered inside the wrapper  |
| `id`        | `string`            | —       | HTML id attribute                    |
| `className` | `string`            | —       | Additional CSS class names           |
| `style`     | `React.CSSProperties` | —    | Custom inline styles                 |
