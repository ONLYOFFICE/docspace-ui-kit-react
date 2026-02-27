# context

React context providing section dimensions (width and height) to child components.

## What It Does

- Creates a `Context` with `sectionWidth` and `sectionHeight` values
- Exports `Provider` and `Consumer` for use in component trees
- Used by components that need to adapt layout based on the available section size

## Import

```ts
import { Context, Provider, Consumer } from "../../utils/context";
```

## Usage

```tsx
import { Provider } from "../../utils/context";

const Layout = ({ children }) => {
  const [dimensions, setDimensions] = useState({ sectionWidth: 800, sectionHeight: 600 });

  return (
    <Provider value={dimensions}>
      {children}
    </Provider>
  );
};
```

```tsx
import { Context } from "../../utils/context";

const MyComponent = () => {
  const { sectionWidth } = useContext(Context);
  return <div style={{ maxWidth: sectionWidth }} />;
};
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Context creation and Provider/Consumer exports |
