import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,r as c,t as l}from"./ApiProvider.stories-Db2Fb-IX.js";function u(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...a(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(n,{of:l}),`
`,(0,f.jsx)(t.h1,{id:`apiprovider`,children:`ApiProvider`}),`
`,(0,f.jsx)(t.p,{children:`Provides API client context to all child components using the ONLYOFFICE Apps API SDK.`}),`
`,(0,f.jsx)(t.h2,{id:`features`,children:`Features`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`API Client Instances`}),` — Creates and manages the SDK clients: Profiles, Settings, Folders, Rooms, Files, File settings, Operations, Group, People search, Group search, AI, Third-party, Payment and Portal quota`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Bearer Token Auth`}),` — Configures axios instances with Bearer token authentication`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`React Context`}),` — Exposes API clients via `,(0,f.jsx)(t.code,{children:`useApi()`}),` hook`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Memoized Initialization`}),` — API clients are memoized based on URL and API key changes`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.strong,{children:`Socket Connection`}),` — Connects the portal WebSocket on mount unless `,(0,f.jsx)(t.code,{children:`initSocket`}),` is `,(0,f.jsx)(t.code,{children:`false`})]}),`
`]}),`
`,(0,f.jsx)(r,{of:s}),`
`,(0,f.jsx)(t.h2,{id:`usage`,children:`Usage`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-tsx`,children:`import { ApiProvider, useApi } from "@onlyoffice/apps-ui-kit/providers/api";

<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>

const MyComponent = () => {
  const { profilesApi, foldersApi } = useApi();
};
`})})]})}function d(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=i(),o(),t(),c()})))()}p();export{d as default};