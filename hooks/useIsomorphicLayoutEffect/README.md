# useIsomorphicLayoutEffect Hook

React hook that uses `useLayoutEffect` on the client and `useEffect` on the server for SSR compatibility.

## Overview

`useIsomorphicLayoutEffect` is a drop-in replacement for `useLayoutEffect` that safely handles server-side rendering (SSR) environments. It automatically switches between `useLayoutEffect` (client-side) and `useEffect` (server-side) based on the environment.

## Problem It Solves

Using `useLayoutEffect` directly in SSR environments causes warnings:
```
Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format.
```

This hook eliminates that warning by using `useEffect` during SSR and `useLayoutEffect` in the browser.

## Usage

```tsx
import { useIsomorphicLayoutEffect } from '@docspace/ui-kit/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';

function Component() {
  const elementRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // This runs synchronously after DOM mutations in the browser
    // and as a regular effect during SSR
    if (elementRef.current) {
      const height = elementRef.current.offsetHeight;
      console.log('Element height:', height);
    }
  }, []);

  return <div ref={elementRef}>Content</div>;
}
```

## API

### Signature

```typescript
useIsomorphicLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void
```

### Parameters

Same as `useLayoutEffect` and `useEffect`:
- **`effect`** (`EffectCallback`): The effect function to run. Can return a cleanup function.
- **`deps`** (`DependencyList`, optional): Array of dependencies that trigger the effect when changed.

## When to Use

Use `useIsomorphicLayoutEffect` when you need:

### 1. DOM Measurements Before Paint

```tsx
function MeasureComponent() {
  const [height, setHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={divRef}>Content to measure</div>
      <p>Height: {height}px</p>
    </div>
  );
}
```

### 2. Synchronous DOM Updates

```tsx
function ScrollToTop() {
  useIsomorphicLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>Page content</div>;
}
```

### 3. Preventing Visual Flicker

```tsx
function ThemeApplier({ theme }: { theme: 'light' | 'dark' }) {
  useIsomorphicLayoutEffect(() => {
    // Apply theme before paint to prevent flicker
    document.body.className = theme;
  }, [theme]);

  return <div>Themed content</div>;
}
```

### 4. Updating Refs Before Render

```tsx
function RefUpdater() {
  const previousValue = useRef<string>();
  const [value, setValue] = useState('initial');

  useIsomorphicLayoutEffect(() => {
    previousValue.current = value;
  });

  return (
    <div>
      <p>Current: {value}</p>
      <p>Previous: {previousValue.current}</p>
      <button onClick={() => setValue('new')}>Update</button>
    </div>
  );
}
```

## Comparison

| Hook | Client (Browser) | Server (SSR) | Use Case |
|------|------------------|--------------|----------|
| `useEffect` | Runs after paint | Runs after render | Async operations, subscriptions |
| `useLayoutEffect` | Runs before paint | ⚠️ Warning | DOM measurements, synchronous updates |
| `useIsomorphicLayoutEffect` | Runs before paint | Runs after render | SSR-safe DOM operations |

## Implementation

```typescript
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

## Notes

- On the client, behaves exactly like `useLayoutEffect` (synchronous, before paint)
- On the server, behaves like `useEffect` (no warnings, no DOM access)
- Perfect for libraries and components that need to support both CSR and SSR
- No performance overhead - it's just a conditional export
- Use regular `useEffect` if you don't need synchronous DOM access
- Use this hook when you specifically need `useLayoutEffect` behavior but also support SSR

## Common Patterns

### Measuring and Positioning

```tsx
function Tooltip() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top - rect.height,
      });
    }
  }, []);

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'absolute', left: position.x, top: position.y }}
    >
      Tooltip
    </div>
  );
}
```

### Synchronizing with External Libraries

```tsx
function ChartComponent({ data }: { data: number[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (chartRef.current) {
      const chart = new ExternalChart(chartRef.current);
      chart.render(data);

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} />;
}
```
