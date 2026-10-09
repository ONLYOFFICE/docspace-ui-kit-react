import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./globalColors-fkBUxSeV.js";import{n as ee,t as te}from"./employee-status-DW3FsOwM.js";import{n as ne}from"./Avatar.enums-D3mbkRzL.js";import{a as o,i as re,n as ie,o as ae,r as s,t as oe}from"./RowLoader-ooTx3rx3.js";import{r as se}from"./avatar-B92H6Cjq.js";import{n as ce,t as c}from"./SearchLoader-TUl_W-lH.js";import{n as le,t as ue}from"./BreadCrumbsLoader-Bl7QhEAh.js";import{i as de,n as fe,r as pe,t as l}from"./empty.filter.rooms.light-BnXLk9h4.js";var me;function he(){return(he=e((()=>{me={All:`All`,RoomAdmin:`RoomAdmin`,Guest:`Guest`,DocSpaceAdmin:`DocSpaceAdmin`,User:`User`}})))()}function ge(e){let t=``,n=(e+1)*2654435761;for(let e=0;e<15;e+=1)n=(n*1103515245+12345)%2147483648,t+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.charAt(n%62);return t}var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,_e,$,ve;function ye(){return(ye=e((()=>{u=t(n()),ee(),he(),de(),fe(),i(),se(),re(),ae(),le(),ie(),ce(),d=r(),f=e=>{let t=[];t.push({key:`create_new`,id:`create_new_item`,label:`New folder`,isCreateNewItem:!0,onCreateClick:()=>{},onBackClick:()=>{}}),t.push({key:`input_item`,id:`input_item`,label:``,isInputItem:!0,icon:pe,defaultInputValue:`New folder`,onAcceptInput:()=>{},onCancelInput:()=>{}});for(let n=0;n<e;n+=1){let e=ge(n);t.push({key:`${e} ${n}`,id:`${e} ${n}`,label:`${e} ${n}`,email:`name@example.com`,isOwner:!1,isAdmin:!1,isVisitor:!1,isCollaborator:!1,isRoomAdmin:!1,avatar:``,role:ne.user,hasAvatar:!1,userType:me.User,status:te.Active})}return t},p=()=>[{key:`editor`,label:`Editor`,description:`Can change the content`,access:1},{key:`reviewer`,label:`Reviewer`,description:`Can suggest changes`,access:3},{key:`commentator`,label:`Commentator`,description:`Can leave comments`,access:4},{key:`viewer`,label:`Viewer`,description:`Can only read`,access:5}],m=f(1e5),h=[m[0],m[3],m[7]],g=p(),_=g[0],v=m.slice(0,100),y=m.length,b=m.slice(2),x={width:`480px`,height:`485px`,border:`1px solid ${a.grayLightMid}`,margin:`auto`,overflow:`hidden`,boxSizing:`border-box`},S=async()=>{},C=({source:e=m,...t})=>{let[n,r]=u.useState(()=>e.slice(0,100)),i=u.useRef(null),a=u.useCallback(async t=>{r(n=>[...n,...e.slice(t,t+100)])},[e]);return u.useEffect(()=>{let e=requestAnimationFrame(()=>{let e=i.current;if(!e)return;let t=e=>{try{e&&typeof e.scrollTop==`number`&&e.scrollTop>0&&(e.scrollTo?.(0,0),e.scrollTop=0)}catch(e){console.log(e)}};t(document.scrollingElement||document.documentElement),[e.querySelector(`.selector-body-scroll`),e.querySelector(`.selector-body-scroll .scrollbar__content`)].forEach(t)});return()=>cancelAnimationFrame(e)},[]),(0,d.jsx)(`div`,{ref:i,style:x,children:(0,d.jsx)(s,{...t,items:n,totalItems:e.length,loadNextPage:a,searchLoader:(0,d.jsx)(`div`,{}),rowLoader:(0,d.jsx)(`div`,{})})})},w=e=>(0,d.jsx)(`div`,{style:x,children:(0,d.jsx)(s,{...e})}),T={title:`UI/Overlays/Selector`,component:s,parameters:{},argTypes:{id:{control:`text`,description:"`id` attribute of the outermost element"},className:{control:`text`,description:`Class added to the outermost element`},style:{control:`object`,description:`Inline styles of the outermost element`},dataTestId:{control:`text`,description:"`data-testid` of the outermost element",table:{defaultValue:{summary:`selector`}}},withHeader:{control:`boolean`,description:"Draws a header bar with a title and a closing cross at the top of the panel; it only accepts `true`"},headerProps:{control:`object`,description:"What the header shows: `headerLabel` as the title, `onCloseClick` for the cross, and a back arrow when `withoutBackButton` is literally `false` with `onBackClick`"},items:{control:!1,description:"The rows loaded so far, in the order they are shown. A row marked `isCreateNewItem` must come first and one marked `isInputItem` second"},onSelect:{action:`onSelect`,description:`Called with the clicked row and whether it was a double click, before Selector updates its own selection; the third argument submits that one row`},isMultiSelect:{control:`boolean`,description:`Puts a checkbox on every row and lets more than one be ticked; the submit button then shows the count`,table:{defaultValue:{summary:`false`}}},forceIsMultiSelect:{control:`boolean`,description:"Gives a checkbox to the rows that ask for single selection with their own `disableMultiSelect`",table:{defaultValue:{summary:`false`}}},selectedItems:{control:!1,description:"Rows to start out ticked in multi-select, matched by `id`. Selector copies them once; later ticks come back through `onSubmit`"},selectedItem:{control:!1,description:"The one row to start out highlighted outside multi-select, matched by `id`"},maxSelectedItems:{control:`number`,description:`Largest number of rows that may be ticked at once; past it the unticked rows go grey and stop responding`},renderCustomItem:{control:!1,description:`Replaces the text of every row with what it returns, keeping the row's avatar, checkbox and height`},displayFileExtension:{control:`boolean`,description:`Draws a file's extension after its name in a dimmer colour`,table:{defaultValue:{summary:`false`}}},loadNextPage:{control:!1,description:"Called with the index to continue from as the list nears its end, and once with 0 on mount; append the next page to `items`"},disableFirstFetch:{control:`boolean`,description:"Skips the `loadNextPage(0)` call on mount, for a list whose first page is already in `items`",table:{defaultValue:{summary:`false`}}},hasNextPage:{control:`boolean`,description:`Indicates more items are available for infinite scrolling`,table:{defaultValue:{summary:`false`}}},isNextPageLoading:{control:`boolean`,description:`Marks a page request as in flight, so scrolling further asks for no other page`,table:{defaultValue:{summary:`false`}}},totalItems:{control:`number`,description:`How many items exist in total, which sets how far the list can be scrolled`},isLoading:{control:`boolean`,description:"Replaces the list with `rowLoader` for the initial load, and hides the tinted note meanwhile",table:{defaultValue:{summary:`false`}}},isContentLoading:{control:`boolean`,description:"Keeps the current list on screen, dimmed and not clickable, while new content loads; wins over `isLoading`",table:{defaultValue:{summary:`false`}}},rowLoader:{control:!1,description:"Skeleton shown for a row that has not arrived yet and for the whole list during `isLoading`"},isSSR:{control:`boolean`,description:`Renders every row as plain markup until the panel has a measured height, for server rendering`,table:{defaultValue:{summary:`false`}}},withPadding:{control:`boolean`,description:`Keeps 16px of space above the first part of the body`,table:{defaultValue:{summary:`true`}}},descriptionText:{control:`text`,description:`A line of bold text above the list`},injectedElement:{control:!1,description:`An element of your own, drawn between the breadcrumbs and the search box; the list is shortened by its height`},withSearch:{control:`boolean`,description:`Shows a search box above the list; it hides itself while the list is empty and no search is running`,table:{defaultValue:{summary:`false`}}},searchPlaceholder:{control:`text`,description:`Placeholder text for the search input`},searchValue:{control:`text`,description:"Text shown in the search box; searching itself is yours to do in `onSearch`"},isSearchLoading:{control:`boolean`,description:"Replaces the search box with `searchLoader`",table:{defaultValue:{summary:`false`}}},searchLoader:{control:!1,description:`Skeleton shown in place of the search box while it loads`},onSearch:{action:`onSearch`,description:"Called with the trimmed query once typing stops; call its callback to show the search empty screen when nothing matches. An empty query calls `onClearSearch` instead"},onClearSearch:{action:`onClearSearch`,description:`Called by the search box's cross and the empty screen's "Clear filter" link; call its callback to leave the searching state`},withSelectAll:{control:`boolean`,description:`Shows a "select all" row above the list that ticks or unticks every enabled loaded row, in multi-select while no search is running`,table:{defaultValue:{summary:`false`}}},selectAllLabel:{control:`text`,description:`Text of the "select all" row`},selectAllIcon:{control:`text`,description:`URL of the avatar beside the "select all" text; an empty string draws the default one`},onSelectAll:{action:`onSelectAll`,description:`Called when the "select all" row is clicked; Selector ticks and unticks the rows itself`},withBreadCrumbs:{control:`boolean`,description:`Shows the folder trail above the list, outermost folder first`,table:{defaultValue:{summary:`false`}}},breadCrumbs:{control:`object`,description:`The trail, outermost first; the last entry is the current folder and is not clickable`},onSelectBreadCrumb:{action:`onSelectBreadCrumb`,description:`Called with the clicked crumb, and by the empty screen's "Back" link with the one before the last; load that folder yourself`},isBreadCrumbsLoading:{control:`boolean`,description:"Replaces the trail with `breadCrumbsLoader`",table:{defaultValue:{summary:`false`}}},breadCrumbsLoader:{control:!1,description:`Skeleton shown in place of the trail while it loads`},withTabs:{control:!1,description:`Shows a tab strip above the list; Selector keeps a separate selection for each tab and adds them up`},tabsData:{control:!1,description:"The tabs, in order; switch `activeTabId` from each tab's `onClick`"},activeTabId:{control:`text`,description:"`id` of the open tab"},withInfo:{control:`boolean`,description:`Shows a tinted note between the search box and the list, hidden during the initial load`,table:{defaultValue:{summary:`false`}}},infoText:{control:`text`,description:`Text of the tinted note`},withInfoBadge:{control:`boolean`,description:`Draws an info icon before the note's text`,table:{defaultValue:{summary:`false`}}},withInfoBar:{control:`boolean`,description:`Shows a bar with a bold title and a description above the list`,table:{defaultValue:{summary:`false`}}},infoBarData:{control:`object`,description:"What that bar says: a `title`, a `description`, an optional icon, and an `onClose` that adds a closing cross"},emptyScreenImage:{control:!1,description:`Picture shown when the folder is empty: an image URL, or an element drawn as it is`},emptyScreenHeader:{control:`text`,description:`Heading shown when the folder is empty`},emptyScreenDescription:{control:`text`,description:`Paragraph under that heading`},searchEmptyScreenImage:{control:!1,description:`Picture shown when a search finds nothing`},searchEmptyScreenHeader:{control:`text`,description:`Heading shown when a search finds nothing`},searchEmptyScreenDescription:{control:`text`,description:`Paragraph under that heading`},hideBackButton:{control:`boolean`,description:`Hides the "Back" link on the empty screen of an empty folder`,table:{defaultValue:{summary:`false`}}},alwaysShowFooter:{control:`boolean`,description:`Shows the footer from the start instead of only once the selection has changed`,table:{defaultValue:{summary:`false`}}},submitButtonLabel:{control:`text`,description:`Text of the primary button; in multi-select the count is added in brackets, so pass "Add", not "Add (3)"`},submitButtonId:{control:`text`,description:"`id` attribute of the primary button"},disableSubmitButton:{control:`boolean`,description:`Disables the primary button and Enter; with a footer input an empty name disables it too`,table:{defaultValue:{summary:`false`}}},onSubmit:{action:`onSubmit`,description:`Called by the primary button and by Enter with the ticked rows, the chosen access, the file name and the checkbox state; a returned promise shows a spinner on the button until it settles`},withCancelButton:{control:`boolean`,description:`Shows a second, non-primary button in the footer`,table:{defaultValue:{summary:`false`}}},cancelButtonLabel:{control:`text`,description:`Text of the cancel button`},cancelButtonId:{control:`text`,description:"`id` attribute of the cancel button"},onCancel:{action:`onCancel`,description:`Called by the cancel button, and by Escape anywhere on the page whether or not the button is shown`},withAccessRights:{control:`boolean`,description:`Adds a drop-down of access levels beside the primary button`,table:{defaultValue:{summary:`false`}}},accessRights:{control:`object`,description:`The access levels in that drop-down`},selectedAccessRight:{control:`object`,description:`The access level chosen at the start, and whenever this changes`},onAccessRightsChange:{action:`onAccessRightsChange`,description:`Called with the access level picked in the drop-down`},accessRightsMode:{control:`select`,options:Object.values(o),description:"`compact` opens a menu sized to its entries; `detailed` opens one as wide as the footer. Both show each level's description under its label",table:{defaultValue:{summary:`compact`}}},withFooterInput:{control:`boolean`,description:`Adds a text field above the footer buttons, for the name to save under`,table:{defaultValue:{summary:`false`}}},footerInputHeader:{control:`text`,description:`Label above the footer text field`},currentFooterInputValue:{control:`text`,description:"Text the footer field starts with; Selector keeps the edited value and hands it to `onSubmit`"},folderFormValidation:{control:!1,description:`A pattern of forbidden characters; a name that matches it marks the field red and shows a warning under it`},withFooterCheckbox:{control:`boolean`,description:`Adds a checkbox above the footer buttons`,table:{defaultValue:{summary:`false`}}},footerCheckboxLabel:{control:`text`,description:`Label beside the footer checkbox`},isChecked:{control:`boolean`,description:"Whether the footer checkbox starts out ticked; Selector keeps its state and hands it to `onSubmit`",table:{defaultValue:{summary:`false`}}},useAside:{control:!1,description:`Wraps the panel in a backdrop and a side panel sliding in from the edge of the window`},onClose:{action:`onClose`,description:"Called by a click on the backdrop and by the side panel's own close; required with `useAside`"},withoutBackground:{control:`boolean`,description:`Makes the backdrop behind the side panel transparent`,table:{defaultValue:{summary:`false`}}},withBlur:{control:!1,description:`Ignored; nothing reads this prop`}}},E={render:e=>(0,d.jsx)(C,{...e}),args:{searchPlaceholder:`Search`,searchValue:``,items:v,onSelect:()=>{},isMultiSelect:!1,selectedItems:h,submitButtonLabel:`Add`,onSubmit:()=>{},withSelectAll:!1,selectAllLabel:`All items`,selectAllIcon:``,onSelectAll:()=>{},withAccessRights:!1,accessRights:g,selectedAccessRight:_,onAccessRightsChange:()=>{},withCancelButton:!1,cancelButtonLabel:`Cancel`,onCancel:()=>{},emptyScreenImage:l,emptyScreenHeader:`This folder is empty`,emptyScreenDescription:`Items you add to this folder will appear here.`,searchEmptyScreenImage:l,searchEmptyScreenHeader:`Nothing found`,searchEmptyScreenDescription:`No item matches your search. Try another word or clear the filter.`,totalItems:y,hasNextPage:!0,isNextPageLoading:!1,isLoading:!1,disableFirstFetch:!0,withBreadCrumbs:!1,breadCrumbs:[],onSelectBreadCrumb:()=>{},breadCrumbsLoader:(0,d.jsx)(`div`,{}),withSearch:!1,isBreadCrumbsLoading:!1,alwaysShowFooter:!1,disableSubmitButton:!1,descriptionText:``},parameters:{docs:{description:{story:'A long list that loads 100 rows at a time as you scroll, with one row picked at a time. The first row opens a "New folder" entry and the second is the inline name field for it (`isCreateNewItem`, `isInputItem`); change any other prop live in the Controls panel below.'},source:{code:`<Selector
  searchPlaceholder="Search"
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`}}}},D={render:e=>(0,d.jsx)(C,{...e}),args:{...E.args,isContentLoading:!0},parameters:{docs:{description:{story:`Content refresh state: while new data is loading (search, tab change or folder navigation), the current list stays on screen dimmed and non-interactive instead of being replaced with a skeleton.`},source:{code:`<Selector
  items={items}
  isContentLoading
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  loadNextPage={loadNextPage}
/>`}}}},O={render:e=>(0,d.jsx)(C,{...e}),args:{...E.args,withBreadCrumbs:!0,breadCrumbs:[{id:1,label:`My documents`},{id:2,label:`Projects`},{id:3,label:`Reports`},{id:4,label:`Quarterly summaries for the whole year`},{id:5,label:`Drafts`}]},parameters:{docs:{description:{story:"Use a folder trail when the list is one level of a folder tree. With more than three folders, the ones between the first and the last two collapse into a menu behind the dots; click an earlier folder and `onSelectBreadCrumb` reports it, so you can load that folder and pass new `items` and `breadCrumbs`."},source:{code:`<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={[
    { id: 1, label: "My documents" },
    { id: 2, label: "Projects" },
    { id: 3, label: "Reports" },
  ]}
  onSelectBreadCrumb={handleBreadCrumb}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>`}}}},k={render:e=>(0,d.jsx)(C,{...e}),args:{...E.args,withBreadCrumbs:!0,breadCrumbs:[{id:1,label:`My documents`},{id:2,label:`Projects`},{id:3,label:`Reports`}],withFooterInput:!0,footerInputHeader:`File name`,currentFooterInputValue:`Report.docx`,withFooterCheckbox:!0,footerCheckboxLabel:`Open saved document in new tab`,isChecked:!1},parameters:{docs:{description:{story:'Use a name field in the footer for a "save as" or copy flow, where the reader picks the destination folder and names the file in one step. The checkbox under the field is a second choice handed to `onSubmit` with the name (`withFooterCheckbox`); clear the field and the Add button goes dead.'},source:{code:`<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={breadCrumbs}
  withFooterInput
  footerInputHeader="File name"
  currentFooterInputValue="Report.docx"
  withFooterCheckbox
  footerCheckboxLabel="Open saved document in new tab"
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>`}}}},A={render:e=>(0,d.jsx)(C,{...e,source:b}),args:{...E.args,withHeader:!0,headerProps:{headerLabel:`Choose a folder`,onCloseClick:()=>{},onBackClick:()=>{},withoutBackButton:!1,withoutBorder:!1},withCancelButton:!0,cancelButtonLabel:`Cancel`},parameters:{docs:{description:{story:"Give the panel a header when it stands on its own, in a dialog or a side panel. The title comes with a closing cross and, here, a back arrow for a step-by-step flow (`headerProps.withoutBackButton: false`); the footer gets a second button that calls `onCancel`, as Escape does."},source:{code:`<Selector
  withHeader
  headerProps={{
    headerLabel: "Choose a folder",
    onCloseClick: handleClose,
    onBackClick: handleBack,
    withoutBackButton: false,
    withoutBorder: false,
  }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`}}}},j=b.slice(0,30),M=e=>{let[t,n]=u.useState(``),r=t?j.filter(e=>e.label.toLowerCase().includes(t.toLowerCase())):j;return(0,d.jsx)(w,{...e,items:r,totalItems:r.length,searchValue:t,onSearch:(e,t)=>{n(e),t?.()},onClearSearch:e=>{n(``),e?.()}})},N={render:e=>(0,d.jsx)(M,{...e}),args:{...E.args,withSearch:!0,searchPlaceholder:`Search`,searchLoader:(0,d.jsx)(c,{}),isSearchLoading:!1,hasNextPage:!1,loadNextPage:S},parameters:{docs:{description:{story:"Add a search box when the reader knows the name they are looking for. Type part of a label to narrow the list; type something no label contains, such as `zzz`, to see the search empty screen (`searchEmptyScreenHeader`), and clear the box with its cross to get the whole list back. The filtering is the story's own: Selector hands over the query in `onSearch` and shows what `items` you give back."},source:{code:`const [query, setQuery] = useState("");

<Selector
  withSearch
  searchPlaceholder="Search"
  searchValue={query}
  searchLoader={<SearchLoader />}
  isSearchLoading={false}
  onSearch={(value, callback) => {
    setQuery(value);
    callback();
  }}
  onClearSearch={(callback) => {
    setQuery("");
    callback();
  }}
  items={filter(items, query)}
  searchEmptyScreenHeader="Nothing found"
  {...otherProps}
/>`}}}},P={render:e=>(0,d.jsx)(C,{...e,source:b}),args:{...E.args,isMultiSelect:!0,withSelectAll:!0,selectAllLabel:`All items`,selectedItems:[b[1],b[3]]},parameters:{docs:{description:{story:'Use multi-select when the reader adds several items in one go, such as people to a share. Every row gets a checkbox, the footer appears with the first tick and its Add button shows how many are ticked, and the "All items" row above the list ticks or unticks every loaded row (`withSelectAll`). Two rows start out ticked (`selectedItems`).'},source:{code:`<Selector
  isMultiSelect
  withSelectAll
  selectAllLabel="All items"
  onSelectAll={handleSelectAll}
  selectedItems={alreadyChosen}
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>`}}}},F=b.slice(0,8),I={render:e=>(0,d.jsx)(w,{...e}),args:{...E.args,items:F,totalItems:F.length,hasNextPage:!1,loadNextPage:S,isMultiSelect:!0,maxSelectedItems:2,selectedItems:[F[0],F[2]],alwaysShowFooter:!0},parameters:{docs:{description:{story:"Cap the selection when the target can take only so many items. Two rows are ticked and the limit is two, so every other row is greyed out and ignores clicks (`maxSelectedItems`); untick one and the rest come back. Selector shows no message of its own, so say what the limit is somewhere near the panel."},source:{code:`<Selector
  isMultiSelect
  maxSelectedItems={2}
  selectedItems={[first, third]}
  alwaysShowFooter
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  {...otherProps}
/>`}}}},L=b.slice(0,8).map((e,t)=>t%3==1?{...e,isDisabled:!0,disabledText:`Added`}:e),R={render:e=>(0,d.jsx)(w,{...e}),args:{...E.args,items:L,totalItems:L.length,hasNextPage:!1,loadNextPage:S,isMultiSelect:!0,selectedItems:[]},parameters:{docs:{description:{story:"Keep an item in the list but out of reach when the reader should see it and know why it cannot be picked. The greyed rows ignore clicks and show a reason in place of their checkbox (`isDisabled`, `disabledText` on the item)."},source:{code:`const items = [
  { id: 1, label: "Report.docx" },
  { id: 2, label: "Budget.xlsx", isDisabled: true, disabledText: "Added" },
];

<Selector isMultiSelect items={items} {...otherProps} />`}}}},z=b.slice(0,20),B={render:e=>(0,d.jsx)(w,{...e}),args:{...E.args,items:z,totalItems:z.length,hasNextPage:!1,loadNextPage:S,isMultiSelect:!0,selectedItems:[z[0]],alwaysShowFooter:!0,withAccessRights:!0,accessRights:g,selectedAccessRight:_,accessRightsMode:o.Compact},parameters:{docs:{description:{story:"Add an access drop-down to the footer when the items being added need a permission as well. Open it beside the Add button to pick one; the choice is handed to `onSubmit` with the ticked items. Switch `accessRightsMode` to `detailed` in the Controls panel below to open the menu as wide as the footer instead."},source:{code:`<Selector
  isMultiSelect
  withAccessRights
  accessRights={[
    { key: "editor", label: "Editor", description: "Can change the content", access: 1 },
    { key: "viewer", label: "Viewer", description: "Can only read", access: 5 },
  ]}
  selectedAccessRight={editor}
  onAccessRightsChange={handleAccessChange}
  accessRightsMode={SelectorAccessRightsMode.Compact}
  items={items}
  submitButtonLabel="Add"
  onSubmit={(items, access) => share(items, access)}
  {...otherProps}
/>`}}}},V={render:e=>(0,d.jsx)(w,{...e}),args:{...E.args,items:[m[0]],totalItems:0,hasNextPage:!1,loadNextPage:S,selectedItems:[]},parameters:{docs:{description:{story:'What the reader sees in a folder with nothing in it: the picture, heading and paragraph you pass (`emptyScreenImage`, `emptyScreenHeader`, `emptyScreenDescription`). The "New folder" link is the list\'s `isCreateNewItem` row turned into a link, and "Back" goes to the previous folder of the trail; `hideBackButton` removes it.'},source:{code:`<Selector
  items={[{ key: "create_new", id: "create_new_item", label: "New folder", isCreateNewItem: true, onCreateClick, onBackClick }]}
  emptyScreenImage={emptyFolderImage}
  emptyScreenHeader="This folder is empty"
  emptyScreenDescription="Items you add to this folder will appear here."
  totalItems={0}
  hasNextPage={false}
  {...otherProps}
/>`}}}},H={render:e=>(0,d.jsx)(w,{...e}),args:{...E.args,items:[],totalItems:0,hasNextPage:!1,loadNextPage:S,selectedItems:[],isLoading:!0,rowLoader:(0,d.jsx)(oe,{isContainer:!0}),withSearch:!0,isSearchLoading:!0,searchLoader:(0,d.jsx)(c,{}),withBreadCrumbs:!0,isBreadCrumbsLoading:!0,breadCrumbsLoader:(0,d.jsx)(ue,{}),breadCrumbs:[{id:1,label:`My documents`}]},parameters:{docs:{description:{story:"Show skeletons while the first page is on its way, so the panel keeps its shape instead of flashing an empty screen. The trail, the search box and the list each have a skeleton of their own, and each is switched on separately (`isBreadCrumbsLoading`, `isSearchLoading`, `isLoading`); the folder exports all three loaders."},source:{code:`import {
  BreadCrumbsLoader,
  RowLoader,
  SearchLoader,
  Selector,
} from "@onlyoffice/apps-ui-kit/components/selector";

<Selector
  isLoading
  rowLoader={<RowLoader isContainer />}
  withSearch
  isSearchLoading
  searchLoader={<SearchLoader />}
  withBreadCrumbs
  isBreadCrumbsLoading
  breadCrumbsLoader={<BreadCrumbsLoader />}
  {...otherProps}
/>`}}}},U={files:b.slice(0,20),shared:b.slice(20,30)},W=e=>{let[t,n]=u.useState(`files`),r=[{id:`files`,name:`My files`,content:null,onClick:()=>n(`files`)},{id:`shared`,name:`Shared with me`,content:null,onClick:()=>n(`shared`)}];return(0,d.jsx)(w,{...e,withTabs:!0,tabsData:r,activeTabId:t,items:U[t],totalItems:U[t].length})},G={render:e=>(0,d.jsx)(W,{...e}),args:{...E.args,hasNextPage:!1,loadNextPage:S,isMultiSelect:!0,selectedItems:[]},parameters:{docs:{description:{story:"Split the list into tabs when the items come from separate sources. Tick a row, switch to the other tab and tick another: the Add button counts both, because Selector keeps a selection per tab (`withTabs`, `tabsData`, `activeTabId`). Switching tabs is yours to do from each tab's `onClick`."},source:{code:`const [activeTabId, setActiveTabId] = useState("files");

<Selector
  withTabs
  tabsData={[
    { id: "files", name: "My files", content: null, onClick: () => setActiveTabId("files") },
    { id: "shared", name: "Shared with me", content: null, onClick: () => setActiveTabId("shared") },
  ]}
  activeTabId={activeTabId}
  items={itemsFor(activeTabId)}
  isMultiSelect
  {...otherProps}
/>`}}}},K={render:e=>(0,d.jsx)(C,{...e,source:b}),args:{...E.args,descriptionText:`Recent items`,withInfo:!0,infoText:`Only items you can edit are listed here.`,withInfoBadge:!0},parameters:{docs:{description:{story:"Two ways to say something about the list before the reader picks from it:\n\n- **Only items you can edit are listed here.** — a tinted note with an info icon, for a condition that explains what the list holds (`withInfo`, `infoText`, `withInfoBadge`)\n- **Recent items** — a bold line right above the rows, for a short heading (`descriptionText`)"},source:{code:`<Selector
  withInfo
  infoText="Only items you can edit are listed here."
  withInfoBadge
  descriptionText="Recent items"
  {...otherProps}
/>`}}}},q=e=>{let[t,n]=u.useState(!0);return(0,d.jsx)(C,{...e,source:b,withInfoBar:t,infoBarData:{...e.infoBarData,onClose:()=>n(!1)}})},J={render:e=>(0,d.jsx)(q,{...e}),args:{...E.args,infoBarData:{title:`Copies keep their links`,description:`Links to the original file keep working after it is copied.`}},parameters:{docs:{description:{story:"Put a dismissable bar above the list for a notice the reader can read once and close. The cross appears because the bar has an `onClose`; hiding the bar when it is clicked is up to you (`withInfoBar`, `infoBarData`)."},source:{code:`const [visible, setVisible] = useState(true);

<Selector
  withInfoBar={visible}
  infoBarData={{
    title: "Copies keep their links",
    description: "Links to the original file keep working after it is copied.",
    onClose: () => setVisible(false),
  }}
  {...otherProps}
/>`}}}},Y=b.slice(0,30),X={render:e=>(0,d.jsx)(s,{...e}),args:{...E.args,items:Y,totalItems:Y.length,hasNextPage:!1,loadNextPage:S,useAside:!0,onClose:()=>{},withHeader:!0,headerProps:{headerLabel:`Choose a folder`,onCloseClick:()=>{}},withCancelButton:!0,cancelButtonLabel:`Cancel`},parameters:{docs:{story:{inline:!1,height:`600px`},description:{story:"Open Selector as a side panel over the page when picking is a step on its own. The panel slides in from the edge of the window over a dimmed backdrop, and a click on the backdrop calls `onClose` (`useAside`); without it, Selector is a plain box that fills its parent."},source:{code:`<Selector
  useAside
  onClose={handleClose}
  withHeader
  headerProps={{ headerLabel: "Choose a folder", onCloseClick: handleClose }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  {...listProps}
/>`}}}},Z={render:e=>(0,d.jsx)(`div`,{dir:`rtl`,children:(0,d.jsx)(C,{...e,source:b})}),globals:{direction:`rtl`},args:{...E.args,withBreadCrumbs:!0,breadCrumbs:[{id:1,label:`المستندات`},{id:2,label:`المشاريع`},{id:3,label:`التقارير`}]},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`511px`},description:{story:`The panel in a right-to-left layout: the folder trail starts at the right edge with its arrows pointing left, and the row labels and the footer button line up from the right.`},source:{code:`<div dir="rtl">
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    onSelectBreadCrumb={openFolder}
    {...listProps}
  />
</div>`}}}},Q=[m[0],m[1],...b.slice(0,2),{...b[3],isDisabled:!0,disabledText:`Added`},...b.slice(4,8)],_e=e=>(0,d.jsx)(`div`,{style:{"--selector-border":`2px solid rgb(37, 99, 235)`,"--selector-body-description-text":`rgb(22, 101, 52)`,"--selector-breadcrumbs-prev-item-color":`rgb(190, 24, 93)`,"--selector-breadcrumbs-arrow-right-color":`rgb(234, 88, 12)`,"--selector-info-background-color":`rgb(254, 243, 199)`,"--selector-info-color":`rgb(146, 64, 14)`,"--selector-item-hover-background":`rgb(219, 234, 254)`,"--selector-item-selected-background":`rgb(220, 252, 231)`,"--selector-item-disabled-text-color":`rgb(248, 113, 113)`,"--selector-item-input-button-border":`1px solid rgb(124, 58, 237)`,"--selector-item-input-button-border-hover":`rgb(46, 16, 101)`,"--selector-empty-screen-description-color":`rgb(190, 24, 93)`,"--selector-empty-screen-pressed-button-color":`rgb(190, 24, 93)`},children:(0,d.jsx)(C,{...e,source:Q})}),$={render:e=>(0,d.jsx)(_e,{...e}),args:{...E.args,items:Q,totalItems:Q.length,hasNextPage:!1,loadNextPage:S,selectedItems:[],selectedItem:b[1],alwaysShowFooter:!0,withBreadCrumbs:!0,breadCrumbs:[{id:1,label:`My documents`},{id:2,label:`Projects`},{id:3,label:`Reports`}],descriptionText:`Recent items`,withInfo:!0,infoText:`Only items you can edit are listed here.`},parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover a row to see the hover background and hover the tick beside the name field to see its hover colour. The two empty-screen variables are set too but show only when the list is empty.`},source:{code:`<div
  style={{
    "--selector-border": "2px solid rgb(37, 99, 235)",
    "--selector-body-description-text": "rgb(22, 101, 52)",
    "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
    "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
    "--selector-info-background-color": "rgb(254, 243, 199)",
    "--selector-info-color": "rgb(146, 64, 14)",
    "--selector-item-hover-background": "rgb(219, 234, 254)",
    "--selector-item-selected-background": "rgb(220, 252, 231)",
    "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
    "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
    "--selector-item-input-button-border-hover": "rgb(46, 16, 101)",
    "--selector-empty-screen-description-color": "rgb(190, 24, 93)",
    "--selector-empty-screen-pressed-button-color": "rgb(190, 24, 93)",
  }}
>
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    withInfo
    infoText="Only items you can edit are listed here."
    descriptionText="Recent items"
    selectedItem={picked}
    alwaysShowFooter
    {...listProps}
  />
</div>`}}}},ve=[`Default`,`ContentLoading`,`BreadCrumbs`,`NewName`,`WithHeader`,`WithSearch`,`MultiSelect`,`SelectionLimit`,`DisabledItems`,`WithAccessRights`,`EmptyFolder`,`LoadingState`,`WithTabs`,`WithInfo`,`WithInfoBar`,`InSidePanel`,`RightToLeft`,`CssCustomization`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    searchPlaceholder: "Search",
    searchValue: "",
    items: renderedItems,
    onSelect: () => {},
    isMultiSelect: false,
    selectedItems,
    submitButtonLabel: "Add",
    onSubmit: () => {},
    withSelectAll: false,
    selectAllLabel: "All items",
    selectAllIcon: "",
    onSelectAll: () => {},
    withAccessRights: false,
    accessRights,
    selectedAccessRight,
    onAccessRightsChange: () => {},
    withCancelButton: false,
    cancelButtonLabel: "Cancel",
    onCancel: () => {},
    emptyScreenImage: EmptyScreenFilter,
    emptyScreenHeader: "This folder is empty",
    emptyScreenDescription: "Items you add to this folder will appear here.",
    searchEmptyScreenImage: EmptyScreenFilter,
    searchEmptyScreenHeader: "Nothing found",
    searchEmptyScreenDescription: "No item matches your search. Try another word or clear the filter.",
    totalItems,
    hasNextPage: true,
    isNextPageLoading: false,
    isLoading: false,
    disableFirstFetch: true,
    withBreadCrumbs: false,
    breadCrumbs: [],
    onSelectBreadCrumb: () => {},
    breadCrumbsLoader: <div />,
    withSearch: false,
    isBreadCrumbsLoading: false,
    alwaysShowFooter: false,
    disableSubmitButton: false,
    descriptionText: ""
  },
  parameters: {
    docs: {
      description: {
        story: 'A long list that loads 100 rows at a time as you scroll, with one row picked at a time. The first row opens a "New folder" entry and the second is the inline name field for it (\`isCreateNewItem\`, \`isInputItem\`); change any other prop live in the Controls panel below.'
      },
      source: {
        code: \`<Selector
  searchPlaceholder="Search"
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...Default.args,
    isContentLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: "Content refresh state: while new data is loading (search, tab change or folder navigation), the current list stays on screen dimmed and non-interactive instead of being replaced with a skeleton."
      },
      source: {
        code: \`<Selector
  items={items}
  isContentLoading
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  loadNextPage={loadNextPage}
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [{
      id: 1,
      label: "My documents"
    }, {
      id: 2,
      label: "Projects"
    }, {
      id: 3,
      label: "Reports"
    }, {
      id: 4,
      label: "Quarterly summaries for the whole year"
    }, {
      id: 5,
      label: "Drafts"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Use a folder trail when the list is one level of a folder tree. With more than three folders, the ones between the first and the last two collapse into a menu behind the dots; click an earlier folder and \`onSelectBreadCrumb\` reports it, so you can load that folder and pass new \`items\` and \`breadCrumbs\`."
      },
      source: {
        code: \`<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={[
    { id: 1, label: "My documents" },
    { id: 2, label: "Projects" },
    { id: 3, label: "Reports" },
  ]}
  onSelectBreadCrumb={handleBreadCrumb}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [{
      id: 1,
      label: "My documents"
    }, {
      id: 2,
      label: "Projects"
    }, {
      id: 3,
      label: "Reports"
    }],
    withFooterInput: true,
    footerInputHeader: "File name",
    currentFooterInputValue: "Report.docx",
    withFooterCheckbox: true,
    footerCheckboxLabel: "Open saved document in new tab",
    isChecked: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Use a name field in the footer for a "save as" or copy flow, where the reader picks the destination folder and names the file in one step. The checkbox under the field is a second choice handed to \`onSubmit\` with the name (\`withFooterCheckbox\`); clear the field and the Add button goes dead.'
      },
      source: {
        code: \`<Selector
  items={items}
  withBreadCrumbs
  breadCrumbs={breadCrumbs}
  withFooterInput
  footerInputHeader="File name"
  currentFooterInputValue="Report.docx"
  withFooterCheckbox
  footerCheckboxLabel="Open saved document in new tab"
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
/>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    withHeader: true,
    headerProps: {
      headerLabel: "Choose a folder",
      onCloseClick: () => {},
      onBackClick: () => {},
      withoutBackButton: false,
      withoutBorder: false
    },
    withCancelButton: true,
    cancelButtonLabel: "Cancel"
  },
  parameters: {
    docs: {
      description: {
        story: "Give the panel a header when it stands on its own, in a dialog or a side panel. The title comes with a closing cross and, here, a back arrow for a step-by-step flow (\`headerProps.withoutBackButton: false\`); the footer gets a second button that calls \`onCancel\`, as Escape does."
      },
      source: {
        code: \`<Selector
  withHeader
  headerProps={{
    headerLabel: "Choose a folder",
    onCloseClick: handleClose,
    onBackClick: handleBack,
    withoutBackButton: false,
    withoutBorder: false,
  }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  items={items}
  onSelect={handleSelect}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <SearchTemplate {...args} />,
  args: {
    ...Default.args,
    withSearch: true,
    searchPlaceholder: "Search",
    searchLoader: <SearchLoader />,
    isSearchLoading: false,
    hasNextPage: false,
    loadNextPage: noop
  },
  parameters: {
    docs: {
      description: {
        story: "Add a search box when the reader knows the name they are looking for. Type part of a label to narrow the list; type something no label contains, such as \`zzz\`, to see the search empty screen (\`searchEmptyScreenHeader\`), and clear the box with its cross to get the whole list back. The filtering is the story's own: Selector hands over the query in \`onSearch\` and shows what \`items\` you give back."
      },
      source: {
        code: \`const [query, setQuery] = useState("");

<Selector
  withSearch
  searchPlaceholder="Search"
  searchValue={query}
  searchLoader={<SearchLoader />}
  isSearchLoading={false}
  onSearch={(value, callback) => {
    setQuery(value);
    callback();
  }}
  onClearSearch={(callback) => {
    setQuery("");
    callback();
  }}
  items={filter(items, query)}
  searchEmptyScreenHeader="Nothing found"
  {...otherProps}
/>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    isMultiSelect: true,
    withSelectAll: true,
    selectAllLabel: "All items",
    selectedItems: [people[1], people[3]]
  },
  parameters: {
    docs: {
      description: {
        story: 'Use multi-select when the reader adds several items in one go, such as people to a share. Every row gets a checkbox, the footer appears with the first tick and its Add button shows how many are ticked, and the "All items" row above the list ticks or unticks every loaded row (\`withSelectAll\`). Two rows start out ticked (\`selectedItems\`).'
      },
      source: {
        code: \`<Selector
  isMultiSelect
  withSelectAll
  selectAllLabel="All items"
  onSelectAll={handleSelectAll}
  selectedItems={alreadyChosen}
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  totalItems={totalItems}
  hasNextPage
  loadNextPage={loadNextPage}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: limitItems,
    totalItems: limitItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    maxSelectedItems: 2,
    selectedItems: [limitItems[0], limitItems[2]],
    alwaysShowFooter: true
  },
  parameters: {
    docs: {
      description: {
        story: "Cap the selection when the target can take only so many items. Two rows are ticked and the limit is two, so every other row is greyed out and ignores clicks (\`maxSelectedItems\`); untick one and the rest come back. Selector shows no message of its own, so say what the limit is somewhere near the panel."
      },
      source: {
        code: \`<Selector
  isMultiSelect
  maxSelectedItems={2}
  selectedItems={[first, third]}
  alwaysShowFooter
  items={items}
  submitButtonLabel="Add"
  onSubmit={handleSubmit}
  {...otherProps}
/>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: disabledItems,
    totalItems: disabledItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: []
  },
  parameters: {
    docs: {
      description: {
        story: "Keep an item in the list but out of reach when the reader should see it and know why it cannot be picked. The greyed rows ignore clicks and show a reason in place of their checkbox (\`isDisabled\`, \`disabledText\` on the item)."
      },
      source: {
        code: \`const items = [
  { id: 1, label: "Report.docx" },
  { id: 2, label: "Budget.xlsx", isDisabled: true, disabledText: "Added" },
];

<Selector isMultiSelect items={items} {...otherProps} />\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: accessItems,
    totalItems: accessItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: [accessItems[0]],
    alwaysShowFooter: true,
    withAccessRights: true,
    accessRights,
    selectedAccessRight,
    accessRightsMode: SelectorAccessRightsMode.Compact
  },
  parameters: {
    docs: {
      description: {
        story: "Add an access drop-down to the footer when the items being added need a permission as well. Open it beside the Add button to pick one; the choice is handed to \`onSubmit\` with the ticked items. Switch \`accessRightsMode\` to \`detailed\` in the Controls panel below to open the menu as wide as the footer instead."
      },
      source: {
        code: \`<Selector
  isMultiSelect
  withAccessRights
  accessRights={[
    { key: "editor", label: "Editor", description: "Can change the content", access: 1 },
    { key: "viewer", label: "Viewer", description: "Can only read", access: 5 },
  ]}
  selectedAccessRight={editor}
  onAccessRightsChange={handleAccessChange}
  accessRightsMode={SelectorAccessRightsMode.Compact}
  items={items}
  submitButtonLabel="Add"
  onSubmit={(items, access) => share(items, access)}
  {...otherProps}
/>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: [items[0]],
    totalItems: 0,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: []
  },
  parameters: {
    docs: {
      description: {
        story: 'What the reader sees in a folder with nothing in it: the picture, heading and paragraph you pass (\`emptyScreenImage\`, \`emptyScreenHeader\`, \`emptyScreenDescription\`). The "New folder" link is the list\\'s \`isCreateNewItem\` row turned into a link, and "Back" goes to the previous folder of the trail; \`hideBackButton\` removes it.'
      },
      source: {
        code: \`<Selector
  items={[{ key: "create_new", id: "create_new_item", label: "New folder", isCreateNewItem: true, onCreateClick, onBackClick }]}
  emptyScreenImage={emptyFolderImage}
  emptyScreenHeader="This folder is empty"
  emptyScreenDescription="Items you add to this folder will appear here."
  totalItems={0}
  hasNextPage={false}
  {...otherProps}
/>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <StaticTemplate {...args} />,
  args: {
    ...Default.args,
    items: [],
    totalItems: 0,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: [],
    isLoading: true,
    rowLoader: <RowLoader isContainer />,
    withSearch: true,
    isSearchLoading: true,
    searchLoader: <SearchLoader />,
    withBreadCrumbs: true,
    isBreadCrumbsLoading: true,
    breadCrumbsLoader: <BreadCrumbsLoader />,
    breadCrumbs: [{
      id: 1,
      label: "My documents"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Show skeletons while the first page is on its way, so the panel keeps its shape instead of flashing an empty screen. The trail, the search box and the list each have a skeleton of their own, and each is switched on separately (\`isBreadCrumbsLoading\`, \`isSearchLoading\`, \`isLoading\`); the folder exports all three loaders."
      },
      source: {
        code: \`import {
  BreadCrumbsLoader,
  RowLoader,
  SearchLoader,
  Selector,
} from "@onlyoffice/apps-ui-kit/components/selector";

<Selector
  isLoading
  rowLoader={<RowLoader isContainer />}
  withSearch
  isSearchLoading
  searchLoader={<SearchLoader />}
  withBreadCrumbs
  isBreadCrumbsLoading
  breadCrumbsLoader={<BreadCrumbsLoader />}
  {...otherProps}
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <TabsTemplate {...args} />,
  args: {
    ...Default.args,
    hasNextPage: false,
    loadNextPage: noop,
    isMultiSelect: true,
    selectedItems: []
  },
  parameters: {
    docs: {
      description: {
        story: "Split the list into tabs when the items come from separate sources. Tick a row, switch to the other tab and tick another: the Add button counts both, because Selector keeps a selection per tab (\`withTabs\`, \`tabsData\`, \`activeTabId\`). Switching tabs is yours to do from each tab's \`onClick\`."
      },
      source: {
        code: \`const [activeTabId, setActiveTabId] = useState("files");

<Selector
  withTabs
  tabsData={[
    { id: "files", name: "My files", content: null, onClick: () => setActiveTabId("files") },
    { id: "shared", name: "Shared with me", content: null, onClick: () => setActiveTabId("shared") },
  ]}
  activeTabId={activeTabId}
  items={itemsFor(activeTabId)}
  isMultiSelect
  {...otherProps}
/>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} source={people} />,
  args: {
    ...Default.args,
    descriptionText: "Recent items",
    withInfo: true,
    infoText: "Only items you can edit are listed here.",
    withInfoBadge: true
  },
  parameters: {
    docs: {
      description: {
        story: "Two ways to say something about the list before the reader picks from it:\\n\\n- **Only items you can edit are listed here.** — a tinted note with an info icon, for a condition that explains what the list holds (\`withInfo\`, \`infoText\`, \`withInfoBadge\`)\\n- **Recent items** — a bold line right above the rows, for a short heading (\`descriptionText\`)"
      },
      source: {
        code: \`<Selector
  withInfo
  infoText="Only items you can edit are listed here."
  withInfoBadge
  descriptionText="Recent items"
  {...otherProps}
/>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <InfoBarTemplate {...args} />,
  args: {
    ...Default.args,
    infoBarData: {
      title: "Copies keep their links",
      description: "Links to the original file keep working after it is copied."
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Put a dismissable bar above the list for a notice the reader can read once and close. The cross appears because the bar has an \`onClose\`; hiding the bar when it is clicked is up to you (\`withInfoBar\`, \`infoBarData\`)."
      },
      source: {
        code: \`const [visible, setVisible] = useState(true);

<Selector
  withInfoBar={visible}
  infoBarData={{
    title: "Copies keep their links",
    description: "Links to the original file keep working after it is copied.",
    onClose: () => setVisible(false),
  }}
  {...otherProps}
/>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <Selector {...args} />,
  args: {
    ...Default.args,
    items: panelItems,
    totalItems: panelItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    useAside: true,
    onClose: () => {},
    withHeader: true,
    headerProps: {
      headerLabel: "Choose a folder",
      onCloseClick: () => {}
    },
    withCancelButton: true,
    cancelButtonLabel: "Cancel"
  },
  parameters: {
    docs: {
      // Framed: the side panel is fixed to the window and would cover the Docs page.
      story: {
        inline: false,
        height: "600px"
      },
      description: {
        story: "Open Selector as a side panel over the page when picking is a step on its own. The panel slides in from the edge of the window over a dimmed backdrop, and a click on the backdrop calls \`onClose\` (\`useAside\`); without it, Selector is a plain box that fills its parent."
      },
      source: {
        code: \`<Selector
  useAside
  onClose={handleClose}
  withHeader
  headerProps={{ headerLabel: "Choose a folder", onCloseClick: handleClose }}
  withCancelButton
  cancelButtonLabel="Cancel"
  onCancel={handleClose}
  {...listProps}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Template {...args} source={people} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...Default.args,
    withBreadCrumbs: true,
    breadCrumbs: [{
      id: 1,
      label: "المستندات"
    }, {
      id: 2,
      label: "المشاريع"
    }, {
      id: 3,
      label: "التقارير"
    }]
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "511px"
      },
      description: {
        story: "The panel in a right-to-left layout: the folder trail starts at the right edge with its arrows pointing left, and the row labels and the footer button line up from the right."
      },
      source: {
        code: \`<div dir="rtl">
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    onSelectBreadCrumb={openFolder}
    {...listProps}
  />
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: args => <CustomizationTemplate {...args} />,
  args: {
    ...Default.args,
    items: cssItems,
    totalItems: cssItems.length,
    hasNextPage: false,
    loadNextPage: noop,
    selectedItems: [],
    selectedItem: people[1],
    alwaysShowFooter: true,
    withBreadCrumbs: true,
    breadCrumbs: [{
      id: 1,
      label: "My documents"
    }, {
      id: 2,
      label: "Projects"
    }, {
      id: 3,
      label: "Reports"
    }],
    descriptionText: "Recent items",
    withInfo: true,
    infoText: "Only items you can edit are listed here."
  },
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover a row to see the hover background and hover the tick beside the name field to see its hover colour. The two empty-screen variables are set too but show only when the list is empty.\`
      },
      source: {
        code: \`<div
  style={{
    "--selector-border": "2px solid rgb(37, 99, 235)",
    "--selector-body-description-text": "rgb(22, 101, 52)",
    "--selector-breadcrumbs-prev-item-color": "rgb(190, 24, 93)",
    "--selector-breadcrumbs-arrow-right-color": "rgb(234, 88, 12)",
    "--selector-info-background-color": "rgb(254, 243, 199)",
    "--selector-info-color": "rgb(146, 64, 14)",
    "--selector-item-hover-background": "rgb(219, 234, 254)",
    "--selector-item-selected-background": "rgb(220, 252, 231)",
    "--selector-item-disabled-text-color": "rgb(248, 113, 113)",
    "--selector-item-input-button-border": "1px solid rgb(124, 58, 237)",
    "--selector-item-input-button-border-hover": "rgb(46, 16, 101)",
    "--selector-empty-screen-description-color": "rgb(190, 24, 93)",
    "--selector-empty-screen-pressed-button-color": "rgb(190, 24, 93)",
  }}
>
  <Selector
    withBreadCrumbs
    breadCrumbs={breadCrumbs}
    withInfo
    infoText="Only items you can edit are listed here."
    descriptionText="Recent items"
    selectedItem={picked}
    alwaysShowFooter
    {...listProps}
  />
</div>\`
      }
    }
  }
}`,...$.parameters?.docs?.source}}}})))()}ye();export{O as BreadCrumbs,D as ContentLoading,$ as CssCustomization,E as Default,R as DisabledItems,V as EmptyFolder,X as InSidePanel,H as LoadingState,P as MultiSelect,k as NewName,Z as RightToLeft,I as SelectionLimit,B as WithAccessRights,A as WithHeader,K as WithInfo,J as WithInfoBar,N as WithSearch,G as WithTabs,ve as __namedExportsOrder,T as default};