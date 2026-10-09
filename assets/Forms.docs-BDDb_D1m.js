import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{i as s,n as c,r as l,t as u}from"./Forms.stories-Cc4YsYZj.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`forms`,children:`Forms`}),`
`,(0,p.jsx)(t.p,{children:`The Forms section: the form-filling rooms the caller can see, with a header, the filter bar and
the rows. Search, a sort order and an owner filter narrow the list, and a form room opens in
place. There is nothing to create — the filter bar has no main button, and a row's context menu
only opens it or copies its link, so this screen never writes to a portal.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Owner filter`}),` — `,(0,p.jsx)(t.code,{children:`Me`}),`: only the form rooms the caller owns`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`No room type filter`}),` — the section holds one type only, which is how the portal's own filter behaves there`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search and sort`}),` — by name or last modified, newest first by default`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Rooms open in place`}),` — see below`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Demo or portal`}),` — the same screen on in-memory data or on a real portal`]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`opening-a-form-room-and-the-context-menu`,children:`Opening a form room, and the context menu`}),`
`,(0,p.jsxs)(t.p,{children:[`A click on a room's name, or `,(0,p.jsx)(t.strong,{children:`Open`}),` in its context menu, lists what is inside: its PDF forms
and the two folders the portal keeps a form room's submissions in, `,(0,p.jsx)(t.strong,{children:`Complete`}),` and `,(0,p.jsx)(t.strong,{children:`In
process`}),`, which open the same way. The header becomes the kit's `,(0,p.jsx)(t.code,{children:`Navigation`}),`, with a
breadcrumb back to Forms and a back arrow to the parent.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Inside a room the filter becomes the file-type one — Folders, Documents, Spreadsheets,
Presentations, PDF — sent as `,(0,p.jsx)(t.code,{children:`filterType`}),`, and every level starts with no filter and an empty
search. The list is `,(0,p.jsx)(t.code,{children:`foldersApi.getFolderByFolderId({ folderId, ... })`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The context menu is the same as on `,(0,p.jsx)(t.a,{href:`?path=/docs/components-rooms--docs`,children:`Rooms`}),`: `,(0,p.jsx)(t.strong,{children:`Open`}),` for
rooms and folders, `,(0,p.jsx)(t.strong,{children:`Open in ONLYOFFICE`}),` for a file (a toast in the demo), and `,(0,p.jsx)(t.strong,{children:`Copy link`}),`
for a file on a real portal.`]}),`
`,(0,p.jsx)(t.h3,{id:`choosing-a-form-room-or-folder-in-a-picker`,children:`Choosing a form room or folder in a picker`}),`
`,(0,p.jsx)(r,{of:l}),`
`,(0,p.jsxs)(t.p,{children:[`With `,(0,p.jsx)(t.code,{children:`withFolderPicker`}),`, the header carries `,(0,p.jsx)(t.strong,{children:`Select folder`}),`, which opens a picker whose root
holds `,(0,p.jsx)(t.strong,{children:`Forms`}),` and nothing else. Inside it are the form rooms, then a room's `,(0,p.jsx)(t.strong,{children:`Complete`}),` and
`,(0,p.jsx)(t.strong,{children:`In process`}),` folders. `,(0,p.jsx)(t.strong,{children:`Open`}),` takes wherever the picker stands — Forms itself, a room or one
of its folders — and the list opens there. At the picker's root `,(0,p.jsx)(t.strong,{children:`Open`}),` is disabled.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FilesSelector`}),` has no way to show the Forms section alone, and on the way back out of a form
room it falls through to Rooms; the picker here is the kit's `,(0,p.jsx)(t.code,{children:`Selector`}),` over the list's own
source, which keeps the section fixed.`]}),`
`,(0,p.jsx)(t.h3,{id:`where-the-rows-come-from`,children:`Where the rows come from`}),`
`,(0,p.jsxs)(t.p,{children:[`The header says which source answered: `,(0,p.jsx)(t.code,{children:`Demo data`}),`, or the host of the connected portal.`]}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`No portal.`}),` With nothing picked in the `,(0,p.jsx)(t.strong,{children:`API Config`}),` toolbar the list runs on
`,(0,p.jsx)(t.code,{children:`demoSource("forms")`}),`: four form-filling rooms, two of them owned by `,(0,p.jsx)(t.code,{children:`You`}),`, which is who `,(0,p.jsx)(t.code,{children:`Me`}),`
means in the demo.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`A portal.`}),` Pick one in the toolbar and the story reads that portal's Forms section, as
whoever the key belongs to.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`The list is the same call as `,(0,p.jsx)(t.a,{href:`?path=/docs/components-rooms--docs`,children:`Rooms`}),` with a different search
area:`]}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Control`}),(0,p.jsx)(t.th,{children:`Request parameter`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Search`}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`filterValue`})})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Owner: Me`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`subjectId`}),` (the caller's id) with `,(0,p.jsx)(t.code,{children:`subjectFilter: SubjectFilter.Owner`})]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Sort`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`sortBy`}),` (`,(0,p.jsx)(t.code,{children:`"AZ"`}),`, `,(0,p.jsx)(t.code,{children:`"DateAndTime"`}),`) and `,(0,p.jsx)(t.code,{children:`sortOrder`})]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`—`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`searchArea=Forms`}),`, always`]})]})]})]}),`
`,(0,p.jsxs)(t.h3,{id:`searchareaforms-is-not-in-the-sdk-yet`,children:[(0,p.jsx)(t.code,{children:`searchArea=Forms`}),` is not in the SDK yet`]}),`
`,(0,p.jsxs)(t.p,{children:[`The server splits rooms between the two sections by search area: `,(0,p.jsx)(t.code,{children:`Forms`}),` returns form-filling
rooms and nothing else, `,(0,p.jsx)(t.code,{children:`Active`}),` returns everything but them (`,(0,p.jsx)(t.code,{children:`SearchArea.cs`}),` in the ASC.Files
server). `,(0,p.jsx)(t.code,{children:`@onlyoffice/docspace-api-sdk`}),` predates that split — its `,(0,p.jsx)(t.code,{children:`SearchArea`}),` stops at
`,(0,p.jsx)(t.code,{children:`AiAgents`}),` — but the server reads the area by name from the query string, so the story passes
the string with a cast:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`const FORMS_SEARCH_AREA = "Forms" as unknown as SearchArea;
`})}),`
`,(0,p.jsxs)(t.p,{children:[`A portal that predates the Forms section does not know the name; the list then shows the error
it answered instead of rows. Drop the cast once the SDK carries `,(0,p.jsx)(t.code,{children:`SearchArea.Forms`}),`.`]}),`
`,(0,p.jsx)(t.h3,{id:`usage`,children:`Usage`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { SearchArea, SortOrder } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "@onlyoffice/apps-ui-kit/providers/api";

const { roomsApi } = useApi();

const response = await roomsApi.getRoomsFolder({
  // Not in the SDK's SearchArea yet; the server takes the name.
  searchArea: "Forms" as unknown as SearchArea,
  filterValue: "survey",
  sortBy: "DateAndTime",
  sortOrder: SortOrder.Descending,
  count: 100,
});

const { folders: formRooms, total } = response.data.response;
`})}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Owner`}),` here is a plain tag group rather than the portal's `,(0,p.jsx)(t.code,{children:`roomFilterOwner`}),`, for the reason
given on the `,(0,p.jsx)(t.a,{href:`?path=/docs/components-rooms--docs`,children:`Rooms`}),` page.`]})]})}function f(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=i(),o(),t(),s()})))()}m();export{f as default};