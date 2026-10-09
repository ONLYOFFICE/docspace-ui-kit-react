import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./MCPServers.stories-D1wV9vNw.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`mcpserversselector`,children:`MCPServersSelector`}),`
`,(0,p.jsx)(t.p,{children:`MCPServersSelector is a multi-select panel for choosing available MCP (Model Context Protocol) servers to connect to an AI agent.`}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Live API mode`}),` — Fetches available MCP servers from the API in batches of 100 with infinite scroll`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Multi-select`}),` — Users can select and deselect multiple servers simultaneously`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Pre-selection`}),` — Pass `,(0,p.jsx)(t.code,{children:`initedSelectedServers`}),` with server IDs to restore a previous selection on open`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Disabled items`}),` — Servers with `,(0,p.jsx)(t.code,{children:`needReset: true`}),` are rendered as disabled`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Back navigation`}),` — Separate `,(0,p.jsx)(t.code,{children:`onBackClick`}),` and `,(0,p.jsx)(t.code,{children:`onClose`}),` callbacks for two-level navigation`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Cancel button`}),` — Built-in cancel button that triggers `,(0,p.jsx)(t.code,{children:`onBackClick`})]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsx)(t.p,{children:`A basic MCPServersSelector with default settings.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import MCPServersSelector from "@onlyoffice/apps-ui-kit/selectors/MCPServers";

<MCPServersSelector
  initedSelectedServers={["server-id-1"]}
  onSubmit={(servers) => saveConnectedServers(servers.map((s) => s.id))}
  onClose={() => setOpen(false)}
  onBackClick={() => navigateBack()}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};