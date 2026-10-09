import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{i as s,n as c,r as l,t as u}from"./Rooms.stories-Bxw3Wwm4.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`rooms`,children:`Rooms`}),`
`,(0,p.jsx)(t.p,{children:`The Rooms section: the active rooms the caller can see, with a header, the filter bar and the
rows. Search, a sort order and two filter groups narrow the list, and a room — then a folder in
it — opens in place. There is nothing to create — the filter bar has no main button, and a
row's context menu only opens it or copies its link, so this screen never writes to a portal.`}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.h3,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Room type filter`}),` — Collaboration, Public, Custom, Virtual data room`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Owner filter`}),` — `,(0,p.jsx)(t.code,{children:`Me`}),`: only the rooms the caller owns. It combines with the room type`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search and sort`}),` — by name or last modified, newest first by default`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`No form rooms`}),` — form-filling rooms live in the `,(0,p.jsx)(t.a,{href:`?path=/docs/components-forms--docs`,children:`Forms`}),` section, as in the portal`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Rooms open in place`}),` — see below`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Demo or portal`}),` — the same screen on in-memory data or on a real portal`]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`opening-rooms-and-folders-and-the-context-menu`,children:`Opening rooms and folders, and the context menu`}),`
`,(0,p.jsxs)(t.p,{children:[`A click on a room's name, or `,(0,p.jsx)(t.strong,{children:`Open`}),` in its context menu, lists what is inside; a folder in it
opens the same way. The header becomes the kit's `,(0,p.jsx)(t.code,{children:`Navigation`}),`: the title, a breadcrumb back to
Rooms (the room itself drawn with the room's mark), and a back arrow to the parent.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Inside a room the filter changes to what the portal offers there: `,(0,p.jsx)(t.strong,{children:`Type`}),` — Folders,
Documents, Spreadsheets, Presentations, PDF — sent as `,(0,p.jsx)(t.code,{children:`filterType`}),`. Room type and owner mean
nothing inside a room, so every level starts with no filter and an empty search. The list is
`,(0,p.jsx)(t.code,{children:`foldersApi.getFolderByFolderId({ folderId, ... })`}),`, and its `,(0,p.jsx)(t.code,{children:`pathParts`}),` become the breadcrumb.`]}),`
`,(0,p.jsx)(t.p,{children:`Each row has a context menu with the minimum a read-only list needs:`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Item`}),(0,p.jsx)(t.th,{children:`Shown for`}),(0,p.jsx)(t.th,{children:`Does`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Open`})}),(0,p.jsx)(t.td,{children:`rooms and folders`}),(0,p.jsx)(t.td,{children:`lists it in place`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Open in ONLYOFFICE`})}),(0,p.jsx)(t.td,{children:`files`}),(0,p.jsx)(t.td,{children:`opens the file in the portal's editor in a new tab; a toast in the demo`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.strong,{children:`Copy link`})}),(0,p.jsx)(t.td,{children:`files, on a real portal`}),(0,p.jsx)(t.td,{children:`copies the editor link`})]})]})]}),`
`,(0,p.jsx)(t.h3,{id:`choosing-a-room-or-folder-in-a-picker`,children:`Choosing a room or folder in a picker`}),`
`,(0,p.jsx)(r,{of:l}),`
`,(0,p.jsxs)(t.p,{children:[`With `,(0,p.jsx)(t.code,{children:`withFolderPicker`}),`, the header carries `,(0,p.jsx)(t.strong,{children:`Select folder`}),`, which opens a picker whose root
holds `,(0,p.jsx)(t.strong,{children:`Rooms`}),` and nothing else. Inside it are the rooms, then a room's folders — never its
files. `,(0,p.jsx)(t.strong,{children:`Open`}),` takes wherever the picker stands: inside Rooms it shows the rooms list, inside a
room or a folder it opens that one in the list. At the picker's root `,(0,p.jsx)(t.strong,{children:`Open`}),` is disabled.`]}),`
`,(0,p.jsxs)(t.p,{children:[`It is the kit's `,(0,p.jsx)(t.code,{children:`Selector`}),` over the same source as the list; see the
`,(0,p.jsx)(t.a,{href:`?path=/docs/components-files--docs`,children:`Files`}),` page for why it is not `,(0,p.jsx)(t.code,{children:`FilesSelector`}),`, which cannot
show Rooms alone.`]}),`
`,(0,p.jsx)(t.h3,{id:`where-the-rows-come-from`,children:`Where the rows come from`}),`
`,(0,p.jsxs)(t.p,{children:[`The header says which source answered: `,(0,p.jsx)(t.code,{children:`Demo data`}),`, or the host of the connected portal.`]}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`No portal.`}),` With nothing picked in the `,(0,p.jsx)(t.strong,{children:`API Config`}),` toolbar the list runs on
`,(0,p.jsx)(t.code,{children:`demoSource("rooms")`}),`: six rooms covering every type, three of them owned by `,(0,p.jsx)(t.code,{children:`You`}),`, which is
who `,(0,p.jsx)(t.code,{children:`Me`}),` means in the demo.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`A portal.`}),` Pick one in the toolbar and the story reads that portal's rooms, as whoever the
key belongs to — `,(0,p.jsx)(t.code,{children:`Me`}),` is the key's owner, not the reader.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`Every filter goes to the portal in the request:`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Control`}),(0,p.jsx)(t.th,{children:`Request parameter`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Search`}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`filterValue`})})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Room type`}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`type: [RoomType.EditingRoom | PublicRoom | CustomRoom | VirtualDataRoom]`})})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Owner: Me`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`subjectId`}),` (the caller's id) with `,(0,p.jsx)(t.code,{children:`subjectFilter: SubjectFilter.Owner`})]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Sort`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`sortBy`}),` (`,(0,p.jsx)(t.code,{children:`"AZ"`}),`, `,(0,p.jsx)(t.code,{children:`"DateAndTime"`}),`) and `,(0,p.jsx)(t.code,{children:`sortOrder`})]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`—`}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`searchArea: SearchArea.Active`}),`, always`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Me`}),` needs the caller's own id, which the story asks for once, with
`,(0,p.jsx)(t.code,{children:`profilesApi.getSelfProfile()`}),`, the first time the filter is applied.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The split between Rooms and Forms is made by the server, not here: `,(0,p.jsx)(t.code,{children:`SearchArea.Active`}),` never
returns a form-filling room.`]}),`
`,(0,p.jsx)(t.h3,{id:`usage`,children:`Usage`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  RoomType,
  SearchArea,
  SortOrder,
  SubjectFilter,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "@onlyoffice/apps-ui-kit/providers/api";

const { roomsApi, profilesApi } = useApi();
const me = (await profilesApi.getSelfProfile()).data.response?.id;

const response = await roomsApi.getRoomsFolder({
  searchArea: SearchArea.Active,
  type: [RoomType.PublicRoom],
  subjectId: me,
  subjectFilter: SubjectFilter.Owner,
  sortBy: "DateAndTime",
  sortOrder: SortOrder.Descending,
  count: 100,
});

const { folders: rooms, total } = response.data.response;
`})}),`
`,(0,p.jsxs)(t.h3,{id:`why-owner-is-a-plain-tag-group`,children:[`Why `,(0,p.jsx)(t.code,{children:`Owner`}),` is a plain tag group`]}),`
`,(0,p.jsxs)(t.p,{children:[`The portal's own owner filter is `,(0,p.jsx)(t.code,{children:`FilterGroups.roomFilterOwner`}),`, and `,(0,p.jsx)(t.code,{children:`FilterInput`}),` treats that
group specially: it expects exactly three entries — `,(0,p.jsx)(t.code,{children:`Me`}),`, `,(0,p.jsx)(t.code,{children:`Other`}),` and a people selector — reads
the second one unconditionally, and will not deselect an entry the usual way. With `,(0,p.jsx)(t.code,{children:`Me`}),` alone
the panel throws on open. `,(0,p.jsx)(t.code,{children:`Other`}),` needs a people selector mounted through `,(0,p.jsx)(t.code,{children:`renderSelector`}),`,
which a read-only list has no use for, so the story puts `,(0,p.jsx)(t.code,{children:`Me`}),` in a plain tag group
(`,(0,p.jsx)(t.code,{children:`FilterGroups.filterOther`}),`) under the same `,(0,p.jsx)(t.code,{children:`Owner`}),` heading. A host that wants the full
`,(0,p.jsx)(t.code,{children:`Me / Other`}),` choice has to supply all three entries and the selector.`]})]})}function f(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=i(),o(),t(),s()})))()}m();export{f as default};