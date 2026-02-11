# CategoryItem

A navigation card component used in settings pages to represent a category with a title, description, link, and optional paid badge.

## Usage

```tsx
import { CategoryItem } from "@docspace/ui-kit/components/category-item";

<CategoryItem
  title="General"
  subtitle="Language, time zone, and other settings"
  url="/settings/general"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel="Paid"
/>
```

## Properties

| Prop            | Type                                  | Default | Description                                      |
|-----------------|---------------------------------------|---------|--------------------------------------------------|
| `title`         | `string`                              | —       | Category heading text displayed as a link        |
| `subtitle`      | `string`                              | —       | Description text below the title                 |
| `url`           | `string`                              | —       | Navigation URL for the category link             |
| `onClickLink`   | `(e: MouseEvent) => void`            | —       | Click handler for the category link              |
| `isDisabled`    | `boolean`                             | `false` | Disables the link and dims the description       |
| `withPaidBadge` | `boolean`                             | —       | Shows a "Paid" badge next to the title           |
| `badgeLabel`    | `string`                              | —       | Text displayed inside the paid badge             |
| `dataTestId`    | `string`                              | —       | Test ID for automated testing                    |

## Examples

### Basic Category

```tsx
<CategoryItem
  title="Security"
  subtitle="Password strength, two-factor authentication"
  url="/settings/security"
  onClickLink={() => navigate("/settings/security")}
  withPaidBadge={false}
  badgeLabel=""
/>
```

### Disabled Category with Paid Badge

```tsx
<CategoryItem
  title="SSO"
  subtitle="Single sign-on configuration"
  url="/settings/sso"
  onClickLink={() => {}}
  isDisabled
  withPaidBadge
  badgeLabel="Pro"
/>
```
