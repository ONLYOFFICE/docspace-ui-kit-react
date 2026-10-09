import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{n,t as r}from"./SectionList-CzsAPity.js";import{a as i,r as a}from"./PortalGate-ByWqEVNV.js";var o=t({Default:()=>c,WithFolderPicker:()=>l,__namedExportsOrder:()=>u,default:()=>s}),s,c,l,u;function d(){return(d=e((()=>{a(),n(),s={title:`Components/Files`,component:r,tags:[`!autodocs`],decorators:[i],parameters:{controls:{disable:!0},actions:{disable:!0},docs:{description:{component:`The Files section: the caller's personal folder, with search, a sort order and a type filter, folders that open in place, and no create button.

### Features

- **Read-only** — the filter bar is \`FilterInput\` without \`showMainButton\`, and a row's context menu only opens it or copies its link, so nothing here writes to a portal
- **Folders open in place** — a click on a folder, or **Open** in its menu, lists it; the breadcrumb and its back arrow lead out again
- **Type filter** — Folders, Documents, Spreadsheets, Presentations, PDF; sent to the portal as \`filterType\`
- **Search and sort** — by name or last modified, both applied by the portal
- **Demo or portal** — with no portal in the API Config toolbar the list runs on in-memory data; pick one there and the same screen reads that portal's My documents through \`foldersApi.getMyFolder\`, as whoever the key belongs to

### Usage

\`\`\`tsx
const { foldersApi } = useApi();
const response = await foldersApi.getMyFolder({
  filterType: FilterType.DocumentsOnly,
  filterValue: "report",
  sortBy: "AZ",
  sortOrder: SortOrder.Ascending,
});
const { folders, files, total } = response.data.response;
\`\`\``}}},args:{kind:`files`}},c={},l={args:{withFolderPicker:!0},parameters:{docs:{description:{story:`**Select folder** opens a picker whose root holds Files and nothing else. Go into it and press **Open** to show Files itself, or go further into a folder first; the list then opens there.`}}}},u=[`Default`,`WithFolderPicker`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    withFolderPicker: true
  },
  parameters: {
    docs: {
      description: {
        story: "**Select folder** opens a picker whose root holds Files and nothing else. Go into it and press **Open** to show Files itself, or go further into a folder first; the list then opens there."
      }
    }
  }
}`,...l.parameters?.docs?.source}}}})))()}export{d as i,o as n,l as r,c as t};