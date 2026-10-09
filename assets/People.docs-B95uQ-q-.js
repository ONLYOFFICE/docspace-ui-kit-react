import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./People.stories-DZB4lisC.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`peopleselector`,children:`PeopleSelector`}),`
`,(0,p.jsx)(t.p,{children:`PeopleSelector is a searchable, paginated selector for choosing users and groups from the ONLYOFFICE Apps system.`}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Live API mode`}),` — Fetches members, groups, and guests from the ONLYOFFICE Apps Search API with infinite scroll`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Tabs`}),` — Toggle Members, Groups, and Guests tabs via `,(0,p.jsx)(t.code,{children:`withGroups`}),` and `,(0,p.jsx)(t.code,{children:`withGuests`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Single / multi-select`}),` — Controlled by `,(0,p.jsx)(t.code,{children:`isMultiSelect`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Room scope`}),` — Pass `,(0,p.jsx)(t.code,{children:`roomId`}),` to filter users with access to a specific room`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Access rights`}),` — Optional access-right dropdown via `,(0,p.jsx)(t.code,{children:`withAccessRights`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Current user`}),` — Highlights the current user with a "(Me)" label via `,(0,p.jsx)(t.code,{children:`currentUserId`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Exclusions`}),` — Hide or disable specific users via `,(0,p.jsx)(t.code,{children:`excludeItems`}),` / `,(0,p.jsx)(t.code,{children:`disableInvitedUsers`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Header / aside / cancel`}),` — Fully composable via `,(0,p.jsx)(t.code,{children:`withHeader`}),`, `,(0,p.jsx)(t.code,{children:`useAside`}),`, `,(0,p.jsx)(t.code,{children:`withCancelButton`})]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsx)(t.p,{children:`A basic PeopleSelector with default settings.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import PeopleSelector from "@onlyoffice/apps-ui-kit/selectors/People";

<PeopleSelector
  withHeader
  headerProps={{ headerLabel: "Select Member", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log(items[0])}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};