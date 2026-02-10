import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAnimation, AnimationEvents } from './index';

describe('useAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAnimation(true));

    expect(result.current.animationPhase).toBe('none');
    expect(result.current.isAnimationReady).toBe(false);
    expect(result.current.endWidth).toBe(90);
    expect(result.current.animationElementRef.current).toBeNull();
    expect(result.current.parentElementRef.current).toBeNull();
    expect(typeof result.current.triggerAnimation).toBe('function');
  });

  it('should trigger animation and change phase to progress', () => {
    const { result } = renderHook(() => useAnimation(true));

    act(() => {
      result.current.triggerAnimation();
    });

    expect(result.current.isAnimationReady).toBe(true);
    expect(result.current.animationPhase).toBe('progress');
  });

  it('should dispatch ANIMATION_STARTED event when animation starts', () => {
    const eventSpy = vi.fn();
    window.addEventListener(AnimationEvents.ANIMATION_STARTED, eventSpy);

    const { result } = renderHook(() => useAnimation(true));

    act(() => {
      result.current.triggerAnimation();
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener(AnimationEvents.ANIMATION_STARTED, eventSpy);
  });

  it('should handle END_ANIMATION event and transition to finish phase', async () => {
    const { result } = renderHook(() => useAnimation(true));

    // Mock refs with dimensions
    const mockAnimationElement = {
      offsetWidth: 180,
    } as HTMLDivElement;
    const mockParentElement = {
      offsetWidth: 200,
    } as HTMLDivElement;

    Object.defineProperty(result.current.animationElementRef, 'current', {
      writable: true,
      value: mockAnimationElement,
    });
    Object.defineProperty(result.current.parentElementRef, 'current', {
      writable: true,
      value: mockParentElement,
    });

    act(() => {
      result.current.triggerAnimation();
    });

    expect(result.current.animationPhase).toBe('progress');

    // Dispatch END_ANIMATION event
    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('finish');
    });

    // Check calculated endWidth (180/200 * 100 = 90)
    expect(result.current.endWidth).toBe(90);
  });

  it('should reset to none after finish phase timeout', async () => {
    const { result } = renderHook(() => useAnimation(true));

    const mockAnimationElement = {
      offsetWidth: 180,
    } as HTMLDivElement;
    const mockParentElement = {
      offsetWidth: 200,
    } as HTMLDivElement;

    Object.defineProperty(result.current.animationElementRef, 'current', {
      writable: true,
      value: mockAnimationElement,
    });
    Object.defineProperty(result.current.parentElementRef, 'current', {
      writable: true,
      value: mockParentElement,
    });

    act(() => {
      result.current.triggerAnimation();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('finish');
    });

    // Fast-forward 400ms
    act(() => {
      vi.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('none');
      expect(result.current.isAnimationReady).toBe(false);
    });
  });

  it('should dispatch ANIMATION_ENDED event after reset', async () => {
    const eventSpy = vi.fn();
    window.addEventListener(AnimationEvents.ANIMATION_ENDED, eventSpy);

    const { result } = renderHook(() => useAnimation(true));

    const mockAnimationElement = {
      offsetWidth: 180,
    } as HTMLDivElement;
    const mockParentElement = {
      offsetWidth: 200,
    } as HTMLDivElement;

    Object.defineProperty(result.current.animationElementRef, 'current', {
      writable: true,
      value: mockAnimationElement,
    });
    Object.defineProperty(result.current.parentElementRef, 'current', {
      writable: true,
      value: mockParentElement,
    });

    act(() => {
      result.current.triggerAnimation();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('finish');
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    window.removeEventListener(AnimationEvents.ANIMATION_ENDED, eventSpy);
  });

  it('should reset animation when isActive becomes false', () => {
    const { result, rerender } = renderHook(
      ({ isActive }) => useAnimation(isActive),
      {
        initialProps: { isActive: true },
      }
    );

    act(() => {
      result.current.triggerAnimation();
    });

    expect(result.current.animationPhase).toBe('progress');
    expect(result.current.isAnimationReady).toBe(true);

    // Change isActive to false
    rerender({ isActive: false });

    expect(result.current.animationPhase).toBe('none');
    expect(result.current.isAnimationReady).toBe(false);
  });

  it('should not transition to finish if not in progress phase', async () => {
    const { result } = renderHook(() => useAnimation(true));

    // Don't trigger animation, phase is 'none'
    expect(result.current.animationPhase).toBe('none');

    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    // Should remain in 'none' phase
    await waitFor(() => {
      expect(result.current.animationPhase).toBe('none');
    });
  });

  it('should calculate endWidth correctly based on element dimensions', async () => {
    const { result } = renderHook(() => useAnimation(true));

    const mockAnimationElement = {
      offsetWidth: 150,
    } as HTMLDivElement;
    const mockParentElement = {
      offsetWidth: 300,
    } as HTMLDivElement;

    Object.defineProperty(result.current.animationElementRef, 'current', {
      writable: true,
      value: mockAnimationElement,
    });
    Object.defineProperty(result.current.parentElementRef, 'current', {
      writable: true,
      value: mockParentElement,
    });

    act(() => {
      result.current.triggerAnimation();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('finish');
    });

    // 150/300 * 100 = 50
    expect(result.current.endWidth).toBe(50);
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useAnimation(true));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      AnimationEvents.END_ANIMATION,
      expect.any(Function)
    );
  });

  it('should handle multiple animation triggers correctly', () => {
    const { result } = renderHook(() => useAnimation(true));

    // First trigger
    act(() => {
      result.current.triggerAnimation();
    });

    expect(result.current.animationPhase).toBe('progress');

    // Second trigger while in progress
    act(() => {
      result.current.triggerAnimation();
    });

    // Should still be in progress, ready state reset and set again
    expect(result.current.animationPhase).toBe('progress');
    expect(result.current.isAnimationReady).toBe(true);
  });

  it('should maintain default endWidth when refs are not set', async () => {
    const { result } = renderHook(() => useAnimation(true));

    // Don't set refs, they remain null
    act(() => {
      result.current.triggerAnimation();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AnimationEvents.END_ANIMATION));
    });

    await waitFor(() => {
      expect(result.current.animationPhase).toBe('finish');
    });

    // Should keep default value of 90
    expect(result.current.endWidth).toBe(90);
  });
});
