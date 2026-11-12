// React 18 compatibility for the synced bundle, bundled through
// cfg.extraEntries.
//
// The kit targets React 19 (peer dependency), and the preview cards load
// React 19 from _vendor/. Claude Design's template runtime, however, loads
// React 18.3.1 from a CDN when the page has no React yet, and every design
// built from a template then fails on the first provider with
// "<x> is not a function". The bundle reads React from window.React at call
// time (the converter's react shim exports that very object), so patching
// the three React 19 features the kit relies on is enough:
//
// - use(context): every call in the kit passes a context, never a promise
//   (context/ThemeContext, context/InterfaceDirectionContext, Selector).
// - useEffectEvent (React 19.2): hooks/useUnmount, useCloseOnAnchorCovered,
//   Selector's VirtualScroll.
// - <Context value> as a provider: Scrollbar and the Selector contexts. In
//   React 18 that renders a Consumer; map it to Context.Provider.
//
// Not covered: `ref` as a plain prop of function components (React 18 drops
// it). Internal refs work; a ref passed in by a design does not reach the DOM.
//
// On React 19 every branch is a no-op.
const R = typeof window !== "undefined" ? window.React : undefined;

let patched = false;

if (R && typeof R.use !== "function") {
  R.use = (usable) => {
    if (usable && typeof usable.then === "function") {
      throw new Error("use(promise) needs React 19");
    }
    return R.useContext(usable);
  };
  patched = true;
}

if (R && typeof R.useEffectEvent !== "function") {
  R.useEffectEvent = (fn) => {
    const ref = R.useRef(fn);
    R.useInsertionEffect(() => {
      ref.current = fn;
    });
    return R.useCallback((...args) => ref.current(...args), []);
  };
  patched = true;
}

const CONTEXT = Symbol.for("react.context");
if (R && !R.__dsContextAsProvider && !/^19\./.test(String(R.version))) {
  const createElement = R.createElement;
  R.createElement = function patchedCreateElement(type, ...rest) {
    // React 18: Context.Provider is a separate object. React 19: the
    // context is its own provider, so Provider === type and nothing changes.
    if (
      type &&
      type.$$typeof === CONTEXT &&
      type.Provider &&
      type.Provider !== type
    ) {
      return createElement.call(this, type.Provider, ...rest);
    }
    return createElement.call(this, type, ...rest);
  };
  R.__dsContextAsProvider = true;
}

export const __dsReact18Compat = patched;
