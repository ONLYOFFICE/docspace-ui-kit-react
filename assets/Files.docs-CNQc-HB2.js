import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{i as s,n as c,r as l,t as u}from"./Files.stories-DpUeQhvL.js";function d(e){let t={code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`files`,children:`Files`}),`
`,(0,p.jsx)(t.p,{children:`The Files section as the portal draws it: a header, the filter bar and the rows of the caller's
personal folder. Search, a sort order and a type filter narrow the list, and a folder opens in
place. There is nothing to create — the filter bar has no main button, and a row's context menu
only opens it or copies its link, so this screen never writes to a portal.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Type filter`}),` — Folders, Documents, Spreadsheets, Presentations, PDF. One type at a time, as in the portal`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search`}),` — debounced by 300 ms, because each keystroke is a request to the portal`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Sort`}),` — by name or last modified, either direction. Folders always come before files`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Folders open in place`}),` — see below`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Demo or portal`}),` — the same screen on in-memory data or on a real portal, with nothing to switch in the code`]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`opening-folders-and-the-context-menu`,children:`Opening folders, and the context menu`}),`
`,(0,p.jsxs)(t.p,{children:[`A click on a folder's name, or `,(0,p.jsx)(t.strong,{children:`Open`}),` in its context menu, lists that folder. The header
becomes the kit's `,(0,p.jsx)(t.code,{children:`Navigation`}),`: the folder's title, a breadcrumb back to Files, and a
back arrow to the parent. Search and filters start empty at every level — a filter belongs to
the list it was set on.`]}),`
`,(0,p.jsx)(t.p,{children:`Each row has a context menu with the minimum a read-only list needs:`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Item`}),(0,p.jsx)(t.th,{children:`Shown for`}),(0,p.jsx)(t.th,{children:`Does`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Open`})}),(0,p.jsx)(t.td,{children:`folders`}),(0,p.jsx)(t.td,{children:`lists the folder in place`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Open in ONLYOFFICE`})}),(0,p.jsx)(t.td,{children:`files`}),(0,p.jsx)(t.td,{children:`opens the file in the portal's editor in a new tab; a toast in the demo`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Copy link`})}),(0,p.jsx)(t.td,{children:`files, on a real portal`}),(0,p.jsx)(t.td,{children:`copies the editor link`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Inside a folder the list is `,(0,p.jsx)(t.code,{children:`foldersApi.getFolderByFolderId({ folderId, ... })`}),`, with the same
search, sort and type parameters; its `,(0,p.jsx)(t.code,{children:`pathParts`}),` become the breadcrumb.`]}),`
`,(0,p.jsx)(t.h3,{id:`choosing-a-folder-in-a-picker`,children:`Choosing a folder in a picker`}),`
`,(0,p.jsx)(r,{of:l}),`
`,(0,p.jsxs)(t.p,{children:[`With `,(0,p.jsx)(t.code,{children:`withFolderPicker`}),`, the header carries `,(0,p.jsx)(t.strong,{children:`Select folder`}),`, which opens a picker over the
same source the list reads. Its root holds `,(0,p.jsx)(t.strong,{children:`Files`}),` and nothing else — no Rooms, no Forms. Go
into Files and press `,(0,p.jsx)(t.strong,{children:`Open`}),` to show Files itself, or go further into a folder first; the list
then opens there, with its breadcrumb. Files are left out of the picker, since a file is not
somewhere to go, and `,(0,p.jsx)(t.strong,{children:`Open`}),` stays disabled at the root, where there is nothing chosen yet.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The picker is the kit's `,(0,p.jsx)(t.code,{children:`Selector`}),` (`,(0,p.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/components/selector`}),`), not
`,(0,p.jsx)(t.code,{children:`FilesSelector`}),`: that one cannot narrow its root to a single section — My documents is always
kept beside Rooms — and it has no demo data, so with no portal it would open empty. The source
is `,(0,p.jsx)(t.code,{children:`docs/sections/FolderPicker.tsx`}),`.`]}),`
`,(0,p.jsx)(t.h3,{id:`where-the-rows-come-from`,children:`Where the rows come from`}),`
`,(0,p.jsxs)(t.p,{children:[`The header says which source answered: `,(0,p.jsx)(t.code,{children:`Demo data`}),`, or the host of the connected portal.`]}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`No portal.`}),` Until one is picked in the `,(0,p.jsx)(t.strong,{children:`API Config`}),` toolbar (or `,(0,p.jsx)(t.code,{children:`.env`}),` is filled in),
`,(0,p.jsx)(t.code,{children:`useApi().baseUrl`}),` is empty and the list runs on `,(0,p.jsx)(t.code,{children:`demoSource("files")`}),` from `,(0,p.jsx)(t.code,{children:`demo.ts`}),`: eight
entries — two folders and a file of every type — so each filter has something to show. This
is what CI and the published Storybook render.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`A portal.`}),` Pick one in the toolbar and the story reads that portal's My documents, as
whoever the key belongs to — their folder, not the reader's.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`Every filter is sent to the portal rather than applied to a page it already returned:`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Control`}),(0,p.jsx)(t.th,{children:`Request parameter`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Search`}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`filterValue`})})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Type`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`filterType`}),` — `,(0,p.jsx)(t.code,{children:`FoldersOnly`}),`, `,(0,p.jsx)(t.code,{children:`DocumentsOnly`}),`, `,(0,p.jsx)(t.code,{children:`SpreadsheetsOnly`}),`, `,(0,p.jsx)(t.code,{children:`PresentationsOnly`}),`, `,(0,p.jsx)(t.code,{children:`Pdf`})]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Sort`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`sortBy`}),` (`,(0,p.jsx)(t.code,{children:`"AZ"`}),`, `,(0,p.jsx)(t.code,{children:`"DateAndTime"`}),`) and `,(0,p.jsx)(t.code,{children:`sortOrder`})]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`The first 100 entries are shown; when there are more, the count above the rows says
`,(0,p.jsx)(t.code,{children:`First 100 of N`}),`.`]}),`
`,(0,p.jsx)(t.h3,{id:`usage`,children:`Usage`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FilterType, SortOrder } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "@onlyoffice/apps-ui-kit/providers/api";

const { foldersApi } = useApi();

const response = await foldersApi.getMyFolder({
  filterType: FilterType.DocumentsOnly,
  filterValue: "report",
  sortBy: "AZ",
  sortOrder: SortOrder.Ascending,
  count: 100,
});

// The portal's envelope: the payload is two levels down.
const { folders, files, total } = response.data.response;
`})}),`
`,(0,p.jsxs)(t.p,{children:[`The filter bar is `,(0,p.jsx)(t.code,{children:`FilterInput`}),` from `,(0,p.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/components/filter`}),`, left without
`,(0,p.jsx)(t.code,{children:`showMainButton`}),` — that prop is the only thing that puts a create button beside the search box.
The source of the whole screen is `,(0,p.jsx)(t.code,{children:`docs/sections/SectionList.tsx`}),`; the requests are in
`,(0,p.jsx)(t.code,{children:`docs/sections/source.ts`}),`.`]})]})}function f(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=i(),o(),t(),s()})))()}m();export{f as default};