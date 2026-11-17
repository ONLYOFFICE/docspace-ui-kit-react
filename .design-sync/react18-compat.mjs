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
// - memo(type, compare): React 18 elements carry their fiber; see below.
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
    // React 18 also makes the context its own Consumer (`Context.Consumer
    // === Context` in production), so only an element given a `value` is a
    // provider; mapping `<Consumer>{fn}</Consumer>` too renders nothing
    // (Navigation's header vanished that way).
    const props = rest[0];
    if (
      type &&
      type.$$typeof === CONTEXT &&
      type.Provider &&
      type.Provider !== type &&
      props &&
      Object.prototype.hasOwnProperty.call(props, "value")
    ) {
      return createElement.call(this, type.Provider, ...rest);
    }
    return createElement.call(this, type, ...rest);
  };
  R.__dsContextAsProvider = true;
}

// React 18 puts an enumerable `_owner` - the fiber that created it - on every
// element; React 19 production leaves it null. A few kit components are
// memoised with plain fast-deep-equal (TableRow, TableGroupMenu), which then
// walks from an element into its fiber, round a cycle, and fails with
// "Maximum call stack size exceeded" on the first re-render. Give such
// comparators props whose elements carry no `_owner` - the one field
// fast-deep-equal/react skips for the same reason.
const ELEMENT = Symbol.for("react.element");
const ownerlessProps = (props, depth) => {
  if (!props || typeof props !== "object" || depth > 200) return props;
  const out = {};
  for (const key of Object.keys(props))
    out[key] = ownerless(props[key], depth + 1);
  return out;
};
const ownerless = (value, depth) => {
  if (Array.isArray(value)) return value.map((v) => ownerless(v, depth + 1));
  if (value && value.$$typeof === ELEMENT)
    return {
      $$typeof: value.$$typeof,
      type: value.type,
      key: value.key,
      ref: value.ref,
      props: ownerlessProps(value.props, depth + 1),
    };
  return value;
};
if (R && !R.__dsOwnerlessMemo && !/^19\./.test(String(R.version))) {
  const memo = R.memo;
  R.memo = function patchedMemo(type, compare) {
    if (typeof compare !== "function") return memo.call(this, type, compare);
    return memo.call(this, type, (prev, next) =>
      compare(ownerlessProps(prev, 0), ownerlessProps(next, 0)),
    );
  };
  R.__dsOwnerlessMemo = true;
}

export const __dsReact18Compat = patched;
