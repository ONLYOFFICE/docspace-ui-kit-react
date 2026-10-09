import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./Room.stories-e5ZJ5Vdb.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`roomselector`,children:`RoomSelector`}),`
`,(0,p.jsx)(t.p,{children:`RoomSelector is a searchable, paginated selector for choosing rooms from the ONLYOFFICE Apps system.`}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Live API mode`}),` — Fetches rooms from the ONLYOFFICE Apps API with infinite scroll`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Single / multi-select`}),` — Controlled by `,(0,p.jsx)(t.code,{children:`isMultiSelect`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Room type filter`}),` — Pass `,(0,p.jsx)(t.code,{children:`roomType`}),` to restrict the list to specific room types`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search`}),` — Enable with `,(0,p.jsx)(t.code,{children:`withSearch`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Third-party rooms`}),` — Optionally hide third-party storage rooms via `,(0,p.jsx)(t.code,{children:`disableThirdParty`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Room creation`}),` — Show a create-room button via `,(0,p.jsx)(t.code,{children:`withCreate`}),` + `,(0,p.jsx)(t.code,{children:`createDefineRoomLabel`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Pre-selection`}),` — Pass `,(0,p.jsx)(t.code,{children:`selectedItems`}),` with `,(0,p.jsx)(t.code,{children:`sortSelectedFirst`}),` to float already-selected rooms to the top`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Header / aside / cancel`}),` — Fully composable via `,(0,p.jsx)(t.code,{children:`withHeader`}),`, `,(0,p.jsx)(t.code,{children:`useAside`}),`, `,(0,p.jsx)(t.code,{children:`withCancelButton`})]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsx)(t.p,{children:`A basic RoomSelector with default settings.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import RoomSelector from "@onlyoffice/apps-ui-kit/selectors/Room";

<RoomSelector
  isMultiSelect={false}
  withSearch
  withHeader
  headerProps={{ headerLabel: "Select Room", onCloseClick: () => setOpen(false) }}
  onSubmit={(items) => console.log(items[0])}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};