# useAnimation Hook

React hook for managing CSS-based animation states with custom event dispatching.

## Overview

`useAnimation` provides a state machine for controlling animation phases (none → progress → finish) with refs for DOM elements and custom event dispatching for animation lifecycle management.

## Usage

```tsx
import { useAnimation, AnimationEvents } from '@docspace/ui-kit/hooks/useAnimation';

function AnimatedComponent({ isActive }: { isActive: boolean }) {
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(isActive);

  // Trigger animation when needed
  const handleClick = () => {
    triggerAnimation();
  };

  // Listen for animation end event
  useEffect(() => {
    const handleAnimationEnd = () => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    };

    // Dispatch when your CSS animation completes
    animationElementRef.current?.addEventListener('animationend', handleAnimationEnd);

    return () => {
      animationElementRef.current?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <div ref={parentElementRef}>
      <div
        ref={animationElementRef}
        style={{
          width: animationPhase === 'finish' ? `${endWidth}%` : undefined,
        }}
        className={`animation-${animationPhase}`}
      >
        {isAnimationReady && 'Animating...'}
      </div>
      <button onClick={handleClick}>Start Animation</button>
    </div>
  );
}
```

## API

### Parameters

- **`isActive`** (`boolean`): Controls whether the animation system is active. When `false`, resets all animation states.

### Return Value

Returns an object with the following properties:

- **`animationPhase`** (`'none' | 'start' | 'progress' | 'finish'`): Current animation phase
  - `'none'`: No animation running
  - `'start'`: Animation initialized (not currently used)
  - `'progress'`: Animation in progress (CSS handles the animation)
  - `'finish'`: Animation completing, calculates final width

- **`isAnimationReady`** (`boolean`): Indicates if animation is ready to start

- **`animationElementRef`** (`React.RefObject<HTMLDivElement | null>`): Ref to attach to the animated element

- **`parentElementRef`** (`React.RefObject<HTMLDivElement | null>`): Ref to attach to the parent container element

- **`endWidth`** (`number`): Final width percentage (0-100) calculated when animation finishes

- **`triggerAnimation`** (`() => void`): Function to start the animation sequence

## Animation Events

The hook dispatches and listens to custom window events:

```typescript
export const AnimationEvents = {
  END_ANIMATION: "ANIMATION_END",           // Dispatch this to end the animation
  ANIMATION_STARTED: "ANIMATION_STARTED",   // Dispatched when animation starts
  ANIMATION_ENDED: "ANIMATION_ENDED",       // Dispatched when animation fully completes
  Forced_Animation: "FORCED_ANIMATION",     // Reserved for forced animations
};
```

### Event Flow

1. Call `triggerAnimation()` → sets `isAnimationReady` to `true`
2. Hook dispatches `ANIMATION_STARTED` event
3. Animation phase changes to `'progress'`
4. Your CSS animation runs (10% to 90% typically)
5. Dispatch `END_ANIMATION` event when CSS animation completes
6. Hook calculates `endWidth` based on element dimensions
7. Animation phase changes to `'finish'`
8. After 400ms, resets to `'none'` and dispatches `ANIMATION_ENDED`

## Example with CSS

```css
.animation-progress {
  animation: progressAnimation 2s ease-in-out;
}

@keyframes progressAnimation {
  from {
    width: 10%;
  }
  to {
    width: 90%;
  }
}

.animation-finish {
  transition: width 0.4s ease-out;
}
```

## Notes

- The hook automatically cleans up intervals and event listeners on unmount
- When `isActive` becomes `false`, all animation states are reset
- The `endWidth` is calculated as a percentage relative to the parent element
- CSS animations are preferred over JavaScript intervals for smooth performance
