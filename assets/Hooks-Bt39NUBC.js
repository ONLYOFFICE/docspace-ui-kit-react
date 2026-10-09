import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/Hooks`}),`
`,(0,c.jsx)(t.h1,{id:`hooks`,children:`Hooks`}),`
`,(0,c.jsxs)(t.p,{children:[`Eleven hooks, barrelled in `,(0,c.jsx)(t.code,{children:`hooks/index.ts`}),` and re-exported from the package root. They are
the behaviours the components needed often enough to extract — responsive breakpoints,
event subscription, animation phases and the virtual-keyboard handling mobile Safari makes
necessary.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useIsMobile } from "@onlyoffice/apps-ui-kit/hooks/use-is-mobile";

// or, and the only form an ONLYOFFICE Apps plugin can use:
import { useIsMobile } from "@onlyoffice/apps-ui-kit";
`})}),`
`,(0,c.jsx)(t.h2,{id:`responsive`,children:`Responsive`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Hook`}),(0,c.jsx)(t.th,{children:`Returns`}),(0,c.jsx)(t.th,{children:`Notes`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`useIsMobile`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`boolean`})}),(0,c.jsxs)(t.td,{children:[`Subscribes to the `,(0,c.jsx)(t.code,{children:`mobile`}),` media query`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`useIsDesktop`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`boolean`})}),(0,c.jsxs)(t.td,{children:[`Subscribes to the `,(0,c.jsx)(t.code,{children:`desktop`}),` media query`]})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Both seed their state synchronously, so the first render is already correct rather than
flashing the desktop layout. Use these instead of calling `,(0,c.jsx)(t.code,{children:`isMobile()`}),` from
`,(0,c.jsx)(t.code,{children:`utils/device`}),` inside a component: the utility reads the viewport once and never tells you
when it changes.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useIsMobile } from "@onlyoffice/apps-ui-kit/hooks/use-is-mobile";

function Toolbar() {
  const isMobile = useIsMobile();
  return isMobile ? <CompactToolbar /> : <FullToolbar />;
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`events-and-lifecycle`,children:`Events and lifecycle`}),`
`,(0,c.jsx)(t.h3,{id:`useeventlistenereventname-handler-element-options`,children:(0,c.jsx)(t.code,{children:`useEventListener(eventName, handler, element?, options?)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Type-safe event subscription with automatic cleanup, against `,(0,c.jsx)(t.code,{children:`window`}),` by default or any
element, `,(0,c.jsx)(t.code,{children:`document`}),` or `,(0,c.jsx)(t.code,{children:`MediaQueryList`}),` you pass. The handler reference is kept stable, so
an inline arrow function does not re-subscribe on every render.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`useEventListener("scroll", () => console.log(window.scrollY));
useEventListener("click", onClick, buttonRef);
`})}),`
`,(0,c.jsx)(t.h3,{id:`useclickoutsideref-handler-options-deps`,children:(0,c.jsx)(t.code,{children:`useClickOutside(ref, handler, options?, ...deps)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Fires when a click lands outside the referenced element — the standard way to close a
dropdown, popover or modal. It lives in `,(0,c.jsx)(t.code,{children:`utils/use-click-outside`}),` rather than `,(0,c.jsx)(t.code,{children:`hooks/`}),`,
but it is re-exported from the root like the rest.`]}),`
`,(0,c.jsx)(t.h3,{id:`usedebouncecallback-delay`,children:(0,c.jsx)(t.code,{children:`useDebounce(callback, delay)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Returns a debounced version of the callback and clears its timer on unmount. Typed for the
search-input case it was written for: the callback takes a `,(0,c.jsx)(t.code,{children:`string`}),`.`]}),`
`,(0,c.jsx)(t.h3,{id:`useunmountfn`,children:(0,c.jsx)(t.code,{children:`useUnmount(fn)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Runs `,(0,c.jsx)(t.code,{children:`fn`}),` once, on unmount. `,(0,c.jsx)(t.code,{children:`fn`}),` is wrapped in an effect event, so it always sees the
latest props and state without being listed as a dependency.`]}),`
`,(0,c.jsx)(t.h3,{id:`useisomorphiclayouteffect`,children:(0,c.jsx)(t.code,{children:`useIsomorphicLayoutEffect`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`useLayoutEffect`}),` in the browser, `,(0,c.jsx)(t.code,{children:`useEffect`}),` on the server. Use it wherever a layout
effect would otherwise log the SSR warning.`]}),`
`,(0,c.jsx)(t.h3,{id:`usevieweffect-view-setview-currentdevicetype-`,children:(0,c.jsx)(t.code,{children:`useViewEffect({ view, setView, currentDeviceType })`})}),`
`,(0,c.jsxs)(t.p,{children:[`Keeps a row/table view selection in sync with the device: forces `,(0,c.jsx)(t.code,{children:`row`}),` on a mobile or
tablet viewport and `,(0,c.jsx)(t.code,{children:`table`}),` otherwise, re-checking whenever the section width changes. It
reads that width from the `,(0,c.jsx)(t.code,{children:`utils/context`}),` provider, and does nothing while `,(0,c.jsx)(t.code,{children:`view`}),` is
neither `,(0,c.jsx)(t.code,{children:`"row"`}),` nor `,(0,c.jsx)(t.code,{children:`"table"`}),`. A default export, re-exported by name.`]}),`
`,(0,c.jsx)(t.h2,{id:`animation-and-positioning`,children:`Animation and positioning`}),`
`,(0,c.jsx)(t.h3,{id:`useanimationisactive`,children:(0,c.jsx)(t.code,{children:`useAnimation(isActive)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Drives a CSS animation through `,(0,c.jsx)(t.code,{children:`none`}),` → `,(0,c.jsx)(t.code,{children:`start`}),` → `,(0,c.jsx)(t.code,{children:`progress`}),` → `,(0,c.jsx)(t.code,{children:`finish`}),` and dispatches
custom events at each transition, so a progress bar can advance on a timer and still settle
when the real work finishes.`]}),`
`,(0,c.jsx)(t.h3,{id:`usecloseonanchorcovered-anchorref-onclose-iselementcovered-enabled-`,children:(0,c.jsx)(t.code,{children:`useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered?, enabled? })`})}),`
`,(0,c.jsxs)(t.p,{children:[`Closes a popup when its anchor scrolls out of view or is covered by another element. It
runs a `,(0,c.jsx)(t.code,{children:`requestAnimationFrame`}),` loop rather than an `,(0,c.jsx)(t.code,{children:`IntersectionObserver`}),`, because being
covered by an overlay is not an intersection change. `,(0,c.jsx)(t.code,{children:`isElementCovered`}),` is exported
separately if you need the predicate on its own.`]}),`
`,(0,c.jsx)(t.h2,{id:`virtual-keyboard`,children:`Virtual keyboard`}),`
`,(0,c.jsxs)(t.p,{children:[`Two hooks for the mobile case where the on-screen keyboard overlaps the layout viewport.
Both read `,(0,c.jsx)(t.code,{children:`window.visualViewport`}),`, both no-op on a non-touch device, and both treat
sub-pixel deltas as "no keyboard" — those appear mid-animation in some browsers.`]}),`
`,(0,c.jsx)(t.h3,{id:`usevirtualkeyboardinsetenabled`,children:(0,c.jsx)(t.code,{children:`useVirtualKeyboardInset(enabled?)`})}),`
`,(0,c.jsxs)(t.p,{children:[`Returns how many CSS pixels of the viewport's bottom the keyboard covers, so an in-flow
container can reserve that space as `,(0,c.jsx)(t.code,{children:`padding-bottom`}),` and keep its bottom-anchored content
reachable.`]}),`
`,(0,c.jsx)(t.h3,{id:`usekeyboardawaresheetsheetref-enabled`,children:(0,c.jsx)(t.code,{children:`useKeyboardAwareSheet(sheetRef, enabled)`})}),`
`,(0,c.jsxs)(t.p,{children:[`The fixed-position counterpart: offsets a `,(0,c.jsx)(t.code,{children:`ModalDialog`}),` bottom sheet's `,(0,c.jsx)(t.code,{children:`bottom`}),` style so
the sheet rides above the keyboard instead of being hidden behind it.`]})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};