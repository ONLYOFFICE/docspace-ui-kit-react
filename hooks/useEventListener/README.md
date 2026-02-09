# useEventListener Hook

React hook for declaratively managing event listeners with automatic cleanup and type safety.

## Overview

`useEventListener` provides a type-safe way to attach event listeners to DOM elements, the window, document, or MediaQueryList objects. It handles cleanup automatically and keeps the handler reference stable to prevent unnecessary re-subscriptions.

## Usage

### Window Events

```tsx
import { useEventListener } from '@docspace/ui-kit/hooks/useEventListener';

function ScrollTracker() {
  useEventListener('scroll', (event) => {
    console.log('Window scrolled:', window.scrollY);
  });

  return <div>Scroll the page...</div>;
}
```

### Element Events

```tsx
import { useEventListener } from '@docspace/ui-kit/hooks/useEventListener';
import { useRef } from 'react';

function ClickableBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEventListener(
    'click',
    (event) => {
      console.log('Box clicked!', event);
    },
    boxRef
  );

  return <div ref={boxRef}>Click me!</div>;
}
```

### Document Events

```tsx
import { useEventListener } from '@docspace/ui-kit/hooks/useEventListener';
import { useRef } from 'react';

function KeyboardHandler() {
  const documentRef = useRef<Document>(document);

  useEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        console.log('Escape pressed!');
      }
    },
    documentRef
  );

  return <div>Press Escape key...</div>;
}
```

### MediaQueryList Events

```tsx
import { useEventListener } from '@docspace/ui-kit/hooks/useEventListener';
import { useRef, useEffect, useState } from 'react';

function DarkModeDetector() {
  const [isDark, setIsDark] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    mediaQueryRef.current = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQueryRef.current.matches);
  }, []);

  useEventListener(
    'change',
    (event) => {
      setIsDark(event.matches);
    },
    mediaQueryRef
  );

  return <div>Dark mode: {isDark ? 'Yes' : 'No'}</div>;
}
```

### Custom Events

```tsx
import { useEventListener } from '@docspace/ui-kit/hooks/useEventListener';
import { useRef } from 'react';

function CustomEventHandler() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEventListener(
    'myCustomEvent',
    (event: CustomEvent) => {
      console.log('Custom event received:', event.detail);
    },
    elementRef
  );

  const triggerEvent = () => {
    elementRef.current?.dispatchEvent(
      new CustomEvent('myCustomEvent', { detail: { data: 'Hello!' } })
    );
  };

  return (
    <div ref={elementRef}>
      <button onClick={triggerEvent}>Trigger Custom Event</button>
    </div>
  );
}
```

## API

### Parameters

- **`eventName`** (`string`): The name of the event to listen for (e.g., 'click', 'scroll', 'keydown')
- **`handler`** (`(event: Event) => void`): The event handler function
- **`element`** (`RefObject<Element | null>`, optional): Reference to the target element. If omitted, defaults to `window`
- **`options`** (`boolean | AddEventListenerOptions`, optional): Options to pass to `addEventListener` (e.g., `{ passive: true, capture: true }`)

### Type Safety

The hook provides full TypeScript support with overloads for:
- **WindowEventMap**: Window events (e.g., 'resize', 'scroll')
- **HTMLElementEventMap**: HTML element events (e.g., 'click', 'input')
- **SVGElementEventMap**: SVG element events
- **DocumentEventMap**: Document events (e.g., 'DOMContentLoaded')
- **MediaQueryListEventMap**: Media query events (e.g., 'change')
- **CustomEvent**: Custom events with any name

## Advanced Examples

### With Event Options

```tsx
function PassiveScrollHandler() {
  useEventListener(
    'scroll',
    (event) => {
      console.log('Scrolling...');
    },
    undefined,
    { passive: true } // Improves scroll performance
  );

  return <div>Scroll with passive listener</div>;
}
```

### Multiple Event Listeners

```tsx
function MultiEventComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEventListener('click', () => console.log('Clicked'), buttonRef);
  useEventListener('mouseenter', () => console.log('Mouse entered'), buttonRef);
  useEventListener('mouseleave', () => console.log('Mouse left'), buttonRef);

  return <button ref={buttonRef}>Hover and click me</button>;
}
```

### Conditional Event Listener

```tsx
function ConditionalListener({ enabled }: { enabled: boolean }) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEventListener(
    'click',
    (event) => {
      if (enabled) {
        console.log('Click handled');
      }
    },
    elementRef
  );

  return <div ref={elementRef}>Click me (enabled: {String(enabled)})</div>;
}
```

## How It Works

1. The handler function is stored in a ref to maintain a stable reference
2. The ref is updated via `useIsomorphicLayoutEffect` when the handler changes
3. Event listener is attached in `useEffect` to the target element (or window if no element provided)
4. When the component unmounts or dependencies change, the event listener is automatically removed
5. Handler updates don't cause re-subscription, only dependency changes do

## Notes

- Event listeners are automatically cleaned up on unmount
- The handler reference is kept stable using `useRef` to avoid unnecessary re-subscriptions
- Uses `useIsomorphicLayoutEffect` for SSR compatibility
- If the target element doesn't exist or doesn't support `addEventListener`, the hook safely returns without error
- Supports all standard DOM events plus custom events
