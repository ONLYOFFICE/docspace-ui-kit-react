import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./Groups.stories-DFZpwnb7.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`groupsselector`,children:`GroupsSelector`}),`
`,(0,p.jsx)(t.p,{children:`GroupsSelector is a searchable, paginated selector panel for choosing a user group.`}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Live API mode`}),` — Fetches groups from the ONLYOFFICE Apps Groups API in batches of 100 with infinite scroll`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Single-select`}),` — The user can pick exactly one group at a time`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search`}),` — Filters groups by name; resets and re-fetches the list automatically`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Header`}),` — Optional configurable header with a close button via `,(0,p.jsx)(t.code,{children:`withHeader`}),` / `,(0,p.jsx)(t.code,{children:`headerProps`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Aside mode`}),` — Can render inside an Aside panel with backdrop and optional blur via `,(0,p.jsx)(t.code,{children:`useAside`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Callbacks`}),` — `,(0,p.jsx)(t.code,{children:`onSubmit`}),` and `,(0,p.jsx)(t.code,{children:`onClose`}),` hooks`]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsx)(t.p,{children:`A basic GroupsSelector with default settings.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import GroupsSelector from "@onlyoffice/apps-ui-kit/selectors/Groups";

<GroupsSelector
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log(items[0])}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};