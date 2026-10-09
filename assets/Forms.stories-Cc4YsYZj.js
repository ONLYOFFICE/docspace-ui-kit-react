import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{n,t as r}from"./SectionList-CzsAPity.js";import{a as i,r as a}from"./PortalGate-ByWqEVNV.js";var o=t({Default:()=>c,WithFolderPicker:()=>l,__namedExportsOrder:()=>u,default:()=>s}),s,c,l,u;function d(){return(d=e((()=>{a(),n(),s={title:`Components/Forms`,component:r,tags:[`!autodocs`],decorators:[i],parameters:{controls:{disable:!0},actions:{disable:!0},docs:{description:{component:`The Forms section: the form-filling rooms the caller can see, with search, a sort order and a filter, rooms that open in place, and no create button.

### Features

- **Read-only** — the filter bar is \`FilterInput\` without \`showMainButton\`, and a row's context menu only opens it or copies its link, so nothing here writes to a portal
- **Rooms open in place** — a form room lists its forms and its Complete / In process folders, with a file-type filter; the breadcrumb and its back arrow lead out again
- **Owner filter** — "Me" is \`subjectId\` with \`SubjectFilter.Owner\`. There is no room-type group: the section holds one type only, which is how the portal's own filter behaves there
- **Scoped by the server** — the list is \`getRoomsFolder\` with \`searchArea=Forms\`, which returns form-filling rooms and nothing else. The SDK's \`SearchArea\` has no \`Forms\` member yet; the server reads the area by name, so the story passes the string. A portal that predates the Forms section does not know the name, and the list shows its error
- **Demo or portal** — with no portal in the API Config toolbar the list runs on in-memory data; pick one there and the same screen reads that portal, as whoever the key belongs to

### Usage

\`\`\`tsx
const { roomsApi } = useApi();
const response = await roomsApi.getRoomsFolder({
  // Not in the SDK's SearchArea yet; the server takes the name.
  searchArea: "Forms" as unknown as SearchArea,
  filterValue: "survey",
  sortBy: "DateAndTime",
  sortOrder: SortOrder.Descending,
});
const { folders: formRooms, total } = response.data.response;
\`\`\``}}},args:{kind:`forms`}},c={},l={args:{withFolderPicker:!0},parameters:{docs:{description:{story:`**Select folder** opens a picker whose root holds Forms and nothing else. Press **Open** inside it to show the form rooms, or go into a room, or its Complete or In process folder, first; the list then opens there.`}}}},u=[`Default`,`WithFolderPicker`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    withFolderPicker: true
  },
  parameters: {
    docs: {
      description: {
        story: "**Select folder** opens a picker whose root holds Forms and nothing else. Press **Open** inside it to show the form rooms, or go into a room, or its Complete or In process folder, first; the list then opens there."
      }
    }
  }
}`,...l.parameters?.docs?.source}}}})))()}export{d as i,o as n,l as r,c as t};