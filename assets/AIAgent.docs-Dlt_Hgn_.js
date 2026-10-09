import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./AIAgent.stories-D8t1W6Tl.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:u}),`
`,(0,p.jsx)(t.h1,{id:`aiagentselector`,children:`AIAgentSelector`}),`
`,(0,p.jsx)(t.p,{children:`AIAgentSelector is a selector panel for choosing an AI agent room.`}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Live API mode`}),` — Fetches AI agent rooms from the ONLYOFFICE Apps API with infinite scroll`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Init data mode`}),` — Accepts pre-loaded items for SSR or offline scenarios via `,(0,p.jsx)(t.code,{children:`withInit`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Security filtering`}),` — Disable items that lack the `,(0,p.jsx)(t.code,{children:`UseChat`}),` permission via `,(0,p.jsx)(t.code,{children:`disableBySecurity`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Exclusion list`}),` — Skip already-selected agents via `,(0,p.jsx)(t.code,{children:`excludeItems`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Padding control`}),` — Toggle inner padding with `,(0,p.jsx)(t.code,{children:`withPadding`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Callbacks`}),` — `,(0,p.jsx)(t.code,{children:`onSubmit`}),`, `,(0,p.jsx)(t.code,{children:`onClose`}),`, and `,(0,p.jsx)(t.code,{children:`setIsDataReady`}),` hooks`]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsx)(t.p,{children:`A basic AIAgentSelector with default settings.`}),`
`,(0,p.jsx)(r,{of:c}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import AIAgentSelector from "@onlyoffice/apps-ui-kit/selectors/AIAgent";

<AIAgentSelector
  withPadding
  onSubmit={(items) => console.log(items)}
  onClose={() => setOpen(false)}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};