import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEventListener } from './index';
import { useRef } from 'react';

describe('useEventListener', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should attach event listener to window by default', () => {
    const handler = vi.fn();

    renderHook(() => useEventListener('click', handler));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined
    );
  });

  it('should call handler when window event is triggered', () => {
    const handler = vi.fn();

    renderHook(() => useEventListener('click', handler));

    const clickEvent = new MouseEvent('click');
    window.dispatchEvent(clickEvent);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(clickEvent);
  });

  it('should attach event listener to element ref', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    const elementAddSpy = vi.spyOn(element, 'addEventListener');

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(element);
      useEventListener('click', handler, ref);
      return ref;
    });

    expect(elementAddSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined
    );
  });

  it('should call handler when element event is triggered', () => {
    const handler = vi.fn();
    const element = document.createElement('button');

    renderHook(() => {
      const ref = useRef<HTMLButtonElement>(element);
      useEventListener('click', handler, ref);
      return ref;
    });

    const clickEvent = new MouseEvent('click');
    element.dispatchEvent(clickEvent);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener on unmount', () => {
    const handler = vi.fn();

    const { unmount } = renderHook(() => useEventListener('click', handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined
    );
  });

  it('should update handler without re-subscribing', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useEventListener('click', handler),
      {
        initialProps: { handler: handler1 },
      }
    );

    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender({ handler: handler2 });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(initialCallCount);

    const clickEvent = new MouseEvent('click');
    window.dispatchEvent(clickEvent);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should re-subscribe when event name changes', () => {
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ eventName }: { eventName: keyof WindowEventMap }) => useEventListener(eventName, handler),
      {
        initialProps: { eventName: 'click' as keyof WindowEventMap },
      }
    );

    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender({ eventName: 'mousedown' as keyof WindowEventMap });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      undefined
    );
    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(
      initialCallCount
    );
    expect(addEventListenerSpy).toHaveBeenLastCalledWith(
      'mousedown',
      expect.any(Function),
      undefined
    );
  });

  it('should pass options to addEventListener', () => {
    const handler = vi.fn();
    const options = { passive: true, capture: true };

    renderHook(() => useEventListener('scroll', handler, undefined, options));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      options
    );
  });

  it('should handle custom events', () => {
    const handler = vi.fn();
    const element = document.createElement('div');

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(element);
      useEventListener('myCustomEvent', handler, ref);
      return ref;
    });

    const customEvent = new CustomEvent('myCustomEvent', {
      detail: { data: 'test' },
    });
    element.dispatchEvent(customEvent);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(customEvent);
  });

  it('should not attach listener if element ref is null', () => {
    const handler = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener('click', handler, ref);
      return ref;
    });

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should handle document events', () => {
    const handler = vi.fn();
    const documentAddSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => {
      const ref = useRef<Document>(document);
      useEventListener('keydown', handler, ref);
      return ref;
    });

    expect(documentAddSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      undefined
    );

    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(keyEvent);

    expect(handler).toHaveBeenCalledWith(keyEvent);
  });

  it('should handle multiple event types on same element', () => {
    const clickHandler = vi.fn();
    const mouseEnterHandler = vi.fn();
    const element = document.createElement('button');

    renderHook(() => {
      const ref = useRef<HTMLButtonElement>(element);
      useEventListener('click', clickHandler, ref);
      useEventListener('mouseenter', mouseEnterHandler, ref);
      return ref;
    });

    element.dispatchEvent(new MouseEvent('click'));
    element.dispatchEvent(new MouseEvent('mouseenter'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(mouseEnterHandler).toHaveBeenCalledTimes(1);
  });

  it('should re-subscribe when element ref changes', () => {
    const handler = vi.fn();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element1AddSpy = vi.spyOn(element1, 'addEventListener');
    const element2AddSpy = vi.spyOn(element2, 'addEventListener');
    const element1RemoveSpy = vi.spyOn(element1, 'removeEventListener');

    const { rerender } = renderHook(
      ({ element }) => {
        const ref = useRef<HTMLDivElement>(element);
        useEventListener('click', handler, ref);
        return ref;
      },
      {
        initialProps: { element: element1 },
      }
    );

    expect(element1AddSpy).toHaveBeenCalled();

    rerender({ element: element2 });

    expect(element1RemoveSpy).toHaveBeenCalled();
    expect(element2AddSpy).toHaveBeenCalled();
  });

  it('should handle boolean options parameter', () => {
    const handler = vi.fn();

    renderHook(() => useEventListener('click', handler, undefined, true));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      true
    );
  });

  it('should not throw error if element does not support addEventListener', () => {
    const handler = vi.fn();
    const invalidElement = {} as HTMLDivElement;

    expect(() => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(invalidElement);
        useEventListener('click', handler, ref);
        return ref;
      });
    }).not.toThrow();
  });
});
