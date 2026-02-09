import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useIsomorphicLayoutEffect } from './index';
import { useEffect, useLayoutEffect } from 'react';

describe('useIsomorphicLayoutEffect', () => {
  it('should be defined', () => {
    expect(useIsomorphicLayoutEffect).toBeDefined();
    expect(typeof useIsomorphicLayoutEffect).toBe('function');
  });

  it('should use useLayoutEffect in browser environment', () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });

  it('should execute effect callback', () => {
    const effectCallback = vi.fn();

    renderHook(() => {
      useIsomorphicLayoutEffect(effectCallback);
    });

    expect(effectCallback).toHaveBeenCalledTimes(1);
  });

  it('should execute effect callback with dependencies', () => {
    const effectCallback = vi.fn();

    const { rerender } = renderHook(
      ({ dep }) => {
        useIsomorphicLayoutEffect(effectCallback, [dep]);
      },
      {
        initialProps: { dep: 1 },
      }
    );

    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ dep: 1 });
    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    expect(effectCallback).toHaveBeenCalledTimes(2);
  });

  it('should call cleanup function on unmount', () => {
    const cleanup = vi.fn();
    const effectCallback = vi.fn(() => cleanup);

    const { unmount } = renderHook(() => {
      useIsomorphicLayoutEffect(effectCallback);
    });

    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should call cleanup function when dependencies change', () => {
    const cleanup = vi.fn();
    const effectCallback = vi.fn(() => cleanup);

    const { rerender } = renderHook(
      ({ dep }) => {
        useIsomorphicLayoutEffect(effectCallback, [dep]);
      },
      {
        initialProps: { dep: 1 },
      }
    );

    expect(cleanup).not.toHaveBeenCalled();
    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effectCallback).toHaveBeenCalledTimes(2);
  });

  it('should work with empty dependency array', () => {
    const effectCallback = vi.fn();

    const { rerender } = renderHook(() => {
      useIsomorphicLayoutEffect(effectCallback, []);
    });

    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender();
    rerender();

    expect(effectCallback).toHaveBeenCalledTimes(1);
  });

  it('should work without dependency array', () => {
    const effectCallback = vi.fn();

    const { rerender } = renderHook(() => {
      useIsomorphicLayoutEffect(effectCallback);
    });

    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender();

    expect(effectCallback).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple dependencies', () => {
    const effectCallback = vi.fn();

    const { rerender } = renderHook(
      ({ dep1, dep2 }) => {
        useIsomorphicLayoutEffect(effectCallback, [dep1, dep2]);
      },
      {
        initialProps: { dep1: 1, dep2: 'a' },
      }
    );

    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ dep1: 1, dep2: 'a' });
    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ dep1: 2, dep2: 'a' });
    expect(effectCallback).toHaveBeenCalledTimes(2);

    rerender({ dep1: 2, dep2: 'b' });
    expect(effectCallback).toHaveBeenCalledTimes(3);
  });

  it('should handle object and array dependencies correctly', () => {
    const effectCallback = vi.fn();
    const obj = { value: 1 };
    const arr = [1, 2, 3];

    const { rerender } = renderHook(
      ({ objDep, arrDep }) => {
        useIsomorphicLayoutEffect(effectCallback, [objDep, arrDep]);
      },
      {
        initialProps: { objDep: obj, arrDep: arr },
      }
    );

    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ objDep: obj, arrDep: arr });
    expect(effectCallback).toHaveBeenCalledTimes(1);

    rerender({ objDep: { value: 1 }, arrDep: arr });
    expect(effectCallback).toHaveBeenCalledTimes(2);

    rerender({ objDep: { value: 1 }, arrDep: [1, 2, 3] });
    expect(effectCallback).toHaveBeenCalledTimes(3);
  });

  it('should execute synchronously like useLayoutEffect', () => {
    const executionOrder: string[] = [];

    renderHook(() => {
      executionOrder.push('render');

      useIsomorphicLayoutEffect(() => {
        executionOrder.push('effect');
      });

      executionOrder.push('after-hook');
    });

    expect(executionOrder).toEqual(['render', 'after-hook', 'effect']);
  });

  it('should handle errors in effect callback', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => {
        useIsomorphicLayoutEffect(() => {
          throw new Error('Effect error');
        });
      });
    }).toThrow('Effect error');

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors in cleanup function', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { unmount } = renderHook(() => {
      useIsomorphicLayoutEffect(() => {
        return () => {
          throw new Error('Cleanup error');
        };
      });
    });

    expect(() => {
      unmount();
    }).toThrow('Cleanup error');

    consoleErrorSpy.mockRestore();
  });
});
