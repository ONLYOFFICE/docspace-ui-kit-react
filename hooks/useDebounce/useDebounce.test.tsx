import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './index';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return a debounced callback function', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    expect(typeof result.current).toBe('function');
  });

  it('should delay callback execution by specified delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('test');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should reset timer on subsequent calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('first');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current('second');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should only execute callback once after multiple rapid calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('call1');
      result.current('call2');
      result.current('call3');
      result.current('call4');
      result.current('call5');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call5');
  });

  it('should update debounced callback when callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb, delay }) => useDebounce(cb, delay),
      {
        initialProps: { cb: callback1, delay: 500 },
      }
    );

    act(() => {
      result.current('test1');
    });

    rerender({ cb: callback2, delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith('test1');
  });

  it('should update debounced callback when delay changes', () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb, delay }) => useDebounce(cb, delay),
      {
        initialProps: { cb: callback, delay: 500 },
      }
    );

    act(() => {
      result.current('test');
    });

    rerender({ cb: callback, delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should clear pending timers on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('test');
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple debounced calls with different values', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('value1');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith('value1');

    act(() => {
      result.current('value2');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith('value2');
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should work with zero delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 0));

    act(() => {
      result.current('test');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should handle empty string values', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('');
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith('');
  });

  it('should clear previous timer when called again', () => {
    const callback = vi.fn();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('first');
    });

    act(() => {
      result.current('second');
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
