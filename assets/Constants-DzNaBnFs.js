import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/Constants`}),`
`,(0,c.jsx)(t.h1,{id:`constants-enums-and-types`,children:`Constants, enums and types`}),`
`,(0,c.jsx)(t.p,{children:`Three small modules carry the values and the vocabulary the rest of the library is written
in. All three are in the root barrel, so a plugin reaches them the same way an application
does.`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { EMPTY_ARRAY, OPERATIONS_NAME } from "@onlyoffice/apps-ui-kit/constants";
import { DeviceType, RoomsType } from "@onlyoffice/apps-ui-kit/enums";
import type { TFile, TFolder, Nullable } from "@onlyoffice/apps-ui-kit/types";
`})}),`
`,(0,c.jsx)(t.h2,{id:`constants`,children:`Constants`}),`
`,(0,c.jsx)(t.h3,{id:`frozen-empties`,children:`Frozen empties`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`EMPTY_ARRAY`}),`, `,(0,c.jsx)(t.code,{children:`EMPTY_OBJECT`}),` and `,(0,c.jsx)(t.code,{children:`FUNCTION_EMPTY`}),` are shared, frozen singletons. Use them
instead of a fresh `,(0,c.jsx)(t.code,{children:`[]`}),`, `,(0,c.jsx)(t.code,{children:`{}`}),` or `,(0,c.jsx)(t.code,{children:`() => {}`}),` in a default prop or a selector return: a new
literal is a new reference on every render, and that alone re-renders every memoized child
downstream.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { EMPTY_ARRAY } from "@onlyoffice/apps-ui-kit/constants";

const items = data?.items ?? EMPTY_ARRAY;
`})}),`
`,(0,c.jsx)(t.h3,{id:`file-formats-and-validation`,children:`File formats and validation`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Constant`}),(0,c.jsx)(t.th,{children:`Value`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`TEMPLATE_GALLERY_FORMATS`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`.docx`}),`, `,(0,c.jsx)(t.code,{children:`.xlsx`}),`, `,(0,c.jsx)(t.code,{children:`.pptx`}),`, `,(0,c.jsx)(t.code,{children:`.pdf`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`HTML_EXST`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`.htm`}),`, `,(0,c.jsx)(t.code,{children:`.mht`}),`, `,(0,c.jsx)(t.code,{children:`.html`}),`, `,(0,c.jsx)(t.code,{children:`.mhtml`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`EBOOK_EXST`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`.fb2`}),`, `,(0,c.jsx)(t.code,{children:`.pb2`}),`, `,(0,c.jsx)(t.code,{children:`.ibk`}),`, `,(0,c.jsx)(t.code,{children:`.prc`}),`, `,(0,c.jsx)(t.code,{children:`.epub`}),`, `,(0,c.jsx)(t.code,{children:`.djvu`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`CHAT_SUPPORTED_FORMATS`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`doc,docx,txt,pdf,xls,xlsx`}),` — what the AI chat accepts as an attachment`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`FOLDER_FORM_VALIDATION`})}),(0,c.jsx)(t.td,{children:`The regex of characters a folder name may not contain`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`MAX_VISIBLE_EXTENSIONS`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`5`}),` — how many extensions a format list shows before collapsing`]})]})]})]}),`
`,(0,c.jsx)(t.h3,{id:`uploads`,children:`Uploads`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`DEFAULT_CHUNK_UPLOAD_SIZE`}),` (5 MB), `,(0,c.jsx)(t.code,{children:`DEFAULT_MAX_UPLOAD_THREAD_COUNT`}),` (3) and
`,(0,c.jsx)(t.code,{children:`DEFAULT_MAX_UPLOAD_FILES_COUNT`}),` (2) are the uploader's defaults; the portal overrides them
from its own settings where it has them.`]}),`
`,(0,c.jsx)(t.h3,{id:`everything-else`,children:`Everything else`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Constant`}),(0,c.jsx)(t.th,{children:`What it is`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`OPERATIONS_NAME`})}),(0,c.jsxs)(t.td,{children:[`The file-operation names the progress UI keys off (`,(0,c.jsx)(t.code,{children:`trash`}),`, `,(0,c.jsx)(t.code,{children:`download`}),`, `,(0,c.jsx)(t.code,{children:`copy`}),`, `,(0,c.jsx)(t.code,{children:`move`}),`, `,(0,c.jsx)(t.code,{children:`convert`}),`, `,(0,c.jsx)(t.code,{children:`upload`}),`, `,(0,c.jsx)(t.code,{children:`backup`}),`, …)`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ROOM_ACTION_KEYS`})}),(0,c.jsx)(t.td,{children:`Action keys for the create/edit room flow`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`LOADER_STYLE`})}),(0,c.jsxs)(t.td,{children:[`The shared `,(0,c.jsx)(t.code,{children:`react-content-loader`}),` styling every skeleton starts from`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`LANGUAGE`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`asc_language`}),` — the name of the portal's language cookie`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`LIVE_CHAT_LOCAL_STORAGE_KEY`})}),(0,c.jsx)(t.td,{children:`Deprecated — the live chat no longer stores its open/closed state; nothing reads it`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ASIDE_PADDING_AFTER_LAST_ITEM`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`12px`}),` — bottom padding an aside leaves under its last row`]})]})]})]}),`
`,(0,c.jsx)(t.h3,{id:`brand-and-constant-lookups`,children:`Brand and constant lookups`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`getBrandName`}),` and `,(0,c.jsx)(t.code,{children:`getConstName`}),` resolve a key — `,(0,c.jsx)(t.code,{children:`"ProductName"`}),`, `,(0,c.jsx)(t.code,{children:`"BetaLabel"`}),`, `,(0,c.jsx)(t.code,{children:`"SSO"`}),` —
to the name the current deployment uses. The library ships an identity lookup, so a key
resolves to itself until an application registers a real one:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  getBrandName,
  setBrandLookup,
} from "@onlyoffice/apps-ui-kit/constants";

getBrandName("ProductName"); // "ProductName" — nothing registered yet

setBrandLookup((key, locale) => myTranslations[locale ?? "en"][key] ?? key);

getBrandName("ProductName"); // "ONLYOFFICE Apps"
`})}),`
`,(0,c.jsxs)(t.p,{children:[`The portal's own applications register theirs as a side effect of importing
`,(0,c.jsx)(t.code,{children:`@docspace/shared/constants/brands`}),`, so in the portal this is already done.`]}),`
`,(0,c.jsxs)(t.p,{children:[`The lookup is held on `,(0,c.jsx)(t.code,{children:`globalThis`}),` under a `,(0,c.jsx)(t.code,{children:`Symbol.for`}),` key rather than in a module-scope
variable, and that is deliberate. A module-scope variable is only shared by code that
loaded the `,(0,c.jsx)(t.em,{children:`same copy`}),` of the package, and pnpm's isolated layout installs one copy per
distinct peer-resolution set. Those sets diverge easily — which once meant `,(0,c.jsx)(t.code,{children:`setBrandLookup`}),`
ran against one copy while the selectors read another, and every breadcrumb rendered the
literal key `,(0,c.jsx)(t.code,{children:`ProductName`}),`. A realm-global slot survives that.`]}),`
`,(0,c.jsx)(t.h2,{id:`enums`,children:`Enums`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`enums/`}),` re-exports 38 enumerations. The ones you will reach for most:`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Enum`}),(0,c.jsx)(t.th,{children:`Covers`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`DeviceType`})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`mobile`}),`, `,(0,c.jsx)(t.code,{children:`tablet`}),`, `,(0,c.jsx)(t.code,{children:`desktop`}),` — the value the layout branches on`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ThemeKeys`})}),(0,c.jsx)(t.td,{children:`Light, dark and system theme selection`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`RoomsType`}),`, `,(0,c.jsx)(t.code,{children:`RoleType`})]}),(0,c.jsx)(t.td,{children:`ONLYOFFICE Apps room kinds and member roles`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`FolderType`}),`, `,(0,c.jsx)(t.code,{children:`FileType`}),`, `,(0,c.jsx)(t.code,{children:`FileStatus`}),`, `,(0,c.jsx)(t.code,{children:`ContentType`})]}),(0,c.jsx)(t.td,{children:`What an item is and what state it is in`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`EmployeeType`}),`, `,(0,c.jsx)(t.code,{children:`EmployeeStatus`}),`, `,(0,c.jsx)(t.code,{children:`EmployeeActivationStatus`})]}),(0,c.jsx)(t.td,{children:`User classification and account state`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`ShareAccessRights`}),`, `,(0,c.jsx)(t.code,{children:`ShareRights`})]}),(0,c.jsx)(t.td,{children:`Access levels on a shared item`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`FilterGroups`}),`, `,(0,c.jsx)(t.code,{children:`FilterKeys`}),`, `,(0,c.jsx)(t.code,{children:`SortByFieldName`}),`, `,(0,c.jsx)(t.code,{children:`FilterSelectorTypes`})]}),(0,c.jsx)(t.td,{children:`Filter and sort vocabulary the filter components speak`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`ButtonKeys`}),`, `,(0,c.jsx)(t.code,{children:`Events`}),`, `,(0,c.jsx)(t.code,{children:`EventType`}),`, `,(0,c.jsx)(t.code,{children:`AnalyticsEvents`})]}),(0,c.jsx)(t.td,{children:`Keyboard keys, DOM custom events and analytics event names`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`ServerType`}),`, `,(0,c.jsx)(t.code,{children:`ToolsPermission`}),`, `,(0,c.jsx)(t.code,{children:`ChatReasoningEffort`}),`, `,(0,c.jsx)(t.code,{children:`VectorizationStatus`})]}),(0,c.jsx)(t.td,{children:`AI agent and MCP server concepts`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`ErrorKeys`}),`, `,(0,c.jsx)(t.code,{children:`ParseErrorTypes`})]}),(0,c.jsx)(t.td,{children:`Error identifiers, including the email parser's`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Six of these — `,(0,c.jsx)(t.code,{children:`SdkDateToAutoCleanUp`}),`, `,(0,c.jsx)(t.code,{children:`SdkSortedByType`}),`,
`,(0,c.jsx)(t.code,{children:`SdkFilesSettingsDtoDefaultSharingAccessRightsEnum`}),` and the `,(0,c.jsx)(t.code,{children:`EmployeeFullDto`}),`,
`,(0,c.jsx)(t.code,{children:`FileDtoInteger`}),`, `,(0,c.jsx)(t.code,{children:`GroupDto`}),` types below — come from `,(0,c.jsx)(t.code,{children:`@onlyoffice/docspace-api-sdk`}),` and are
re-exported as they are. They move when that dependency is upgraded, so treat them as less
stable than the kit's own.`]}),`
`,(0,c.jsx)(t.h2,{id:`types`,children:`Types`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`types/`}),` holds the shared type vocabulary — 31 exports. The portal entity shapes are
`,(0,c.jsx)(t.code,{children:`TFile`}),`, `,(0,c.jsx)(t.code,{children:`TFolder`}),`, `,(0,c.jsx)(t.code,{children:`TUser`}),`, `,(0,c.jsx)(t.code,{children:`TUserGroup`}),`, `,(0,c.jsx)(t.code,{children:`TLogo`}),`, `,(0,c.jsx)(t.code,{children:`TCreatedBy`}),`, `,(0,c.jsx)(t.code,{children:`ICover`}),` and the
`,(0,c.jsx)(t.code,{children:`TFileSecurity`}),` / `,(0,c.jsx)(t.code,{children:`TFolderSecurity`}),` / `,(0,c.jsx)(t.code,{children:`TRoomSecurity`}),` permission sets. The UI vocabulary is
`,(0,c.jsx)(t.code,{children:`TViewAs`}),`, `,(0,c.jsx)(t.code,{children:`TSortBy`}),`, `,(0,c.jsx)(t.code,{children:`TSortOrder`}),`, `,(0,c.jsx)(t.code,{children:`TDirectionX`}),`, `,(0,c.jsx)(t.code,{children:`TDirectionY`}),`, `,(0,c.jsx)(t.code,{children:`TPathParts`}),`,
`,(0,c.jsx)(t.code,{children:`PathObject`}),`, `,(0,c.jsx)(t.code,{children:`TGetIcon`}),`, `,(0,c.jsx)(t.code,{children:`LinkRouterProps`}),` and `,(0,c.jsx)(t.code,{children:`To`}),`.`]}),`
`,(0,c.jsx)(t.p,{children:`Four are general-purpose TypeScript helpers worth knowing about:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import type {
  Nullable,
  ValueOf,
  MergeTypes,
  WithFlag,
} from "@onlyoffice/apps-ui-kit/types";

type MaybeUser = Nullable<TUser>;        // TUser | null
type Device = ValueOf<typeof DeviceType>; // the union of an object's value types
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};