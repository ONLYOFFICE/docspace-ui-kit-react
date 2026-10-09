import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{S as i,d as a,n as o,u as s}from"./enums-DzcBu485.js";import{a as ee,i as te,n as ne,o as c,s as re,t as l}from"./filter-CMzyi46r.js";import{n as ie,t as u}from"./view-tiles.react-CcY0t-5f.js";var d,f,p,m,h,g,_,v,y,ae,oe,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,se;function ce(){return(ce=e((()=>{d=t(n()),re(),ie(),i(),ne(),ee(),f=r(),{fn:p}=__STORYBOOK_MODULE_TEST__,m=[{key:`AZ`,label:`Name`,isSelected:!1,id:`1`,className:``,sortDirection:`asc`,sortId:`1`},{key:`DateAndTime`,label:`Modified`,isSelected:!1,id:`2`,className:``,sortDirection:`asc`,sortId:`1`},{key:`Size`,label:`Size`,isSelected:!1,id:`3`,className:``,sortDirection:`asc`,sortId:`1`}],h=[{id:`1`,label:`List`,value:`row`,icon:(0,f.jsx)(c,{})},{id:`2`,label:`Grid`,value:`tile`,icon:(0,f.jsx)(u,{})}],g=[{id:`row-view`,value:`row`,icon:(0,f.jsx)(c,{})},{id:`tile-view`,value:`tile`,icon:(0,f.jsx)(u,{})}],_=()=>m,v=()=>({sortDirection:`asc`,sortId:`AZ`}),y=()=>h,ae=()=>Promise.resolve([]),oe=()=>``,b=[{key:s.filterType,group:s.filterType,label:`Type`,isHeader:!0,isLast:!0},{id:`filter_type-documents`,key:`documents`,group:s.filterType,label:`Documents`},{id:`filter_type-spreadsheets`,key:`spreadsheets`,group:s.filterType,label:`Spreadsheets`},{id:`filter_type-presentations`,key:`presentations`,group:s.filterType,label:`Presentations`},{id:`filter_type-images`,key:`images`,group:s.filterType,label:`Images`,isLast:!0}],x=[{id:`filter_type-documents`,key:`documents`,group:s.filterType,label:`Documents`,isSelected:!0}],S=[{key:`documents`,group:s.filterType,label:`Documents`},{key:`me`,group:s.filterAuthor,label:`Me`},{key:a.excludeSubfolders,group:s.filterFolders,label:`Exclude subfolders`}],C=[{key:s.filterType,group:s.filterType,label:`Type`,isHeader:!0},{id:`filter_type-documents`,key:`documents`,group:s.filterType,label:`Documents`},{id:`filter_type-spreadsheets`,key:`spreadsheets`,group:s.filterType,label:`Spreadsheets`},{key:s.filterLocation,group:s.filterLocation,label:`Location`,isHeader:!0},{id:`filter_location`,key:`filter_location`,group:s.filterLocation,withOptions:!0,options:[{key:`anywhere`,label:`Anywhere`},{key:`my-documents`,label:`My documents`},{key:`shared`,label:`Shared with me`}]},{key:s.filterFolders,group:s.filterFolders,label:`Search`,isHeader:!0,withoutHeader:!0,isLast:!0},{id:`filter_folders`,key:a.excludeSubfolders,group:s.filterFolders,label:`Exclude subfolders`,isCheckbox:!0}],w={id:`folder`,data:{small:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.4l1.5 1.5h6.1A1.5 1.5 0 0 1 15 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5z" fill="#657077"/></svg>`,default:``}},T=[`Projects`,`Clients`,`Contracts`,`Invoices`,`Reports`,`Templates`,`Drafts`,`Research`,`Design`,`Legal`,`Partners`,`Training`,`Events`,`Archive`].map((e,t)=>({id:String(t+1),name:e,icon:w,userId:`1`,totalRooms:3})),E=()=>Promise.resolve(T),D={viewAs:`row`,view:`View`,getSortData:_,getSelectedSortData:v,getViewSettingsData:y,getSelectedFilterData:ae,getSelectedInputValue:oe,getFilterData:()=>Promise.resolve(b),onSearch:p(),onClearFilter:p(),onChangeViewAs:p(),onSort:p(),onFilter:p(),onSortButtonClick:p(),removeSelectedItem:p(),clearAll:p(),setClearSearch:p(),clearSearch:!1,filterTitle:`Filter`,sortByTitle:`Sort by`,filterHeader:`Filter`,selectorLabel:`Select`,viewSelectorVisible:!0,placeholder:`Search...`,userId:`1`,currentDeviceType:o.desktop,initSelectedFilterData:[],isRooms:!1,isContactsPage:!1,isContactsPeoplePage:!1,isContactsGroupsPage:!1,isContactsInsideGroupPage:!1,isContactsGuestsPage:!1,isIndexing:!1,isIndexEditingMode:!1,isRecentFolder:!1},O={title:`UI/Navigation/Filter`,component:l,parameters:{},args:D,argTypes:{placeholder:{control:`text`,description:`Placeholder of the search box; nothing translates it for you`},onSearch:{action:`onSearch`,description:`Called with the search string itself on every keystroke, and with an empty string when the cross in the box is clicked`},onClearFilter:{action:`onClearFilter`,description:"Called when the search box is emptied because `clearSearch` was raised"},clearSearch:{control:`boolean`,description:"Raise it to empty the search box; the component clears the field, calls `onClearFilter` and lowers it again through `setClearSearch(false)`"},setClearSearch:{action:`setClearSearch`,description:"Called with `false` once a requested clear is carried out"},getSelectedInputValue:{control:!1,description:`Returns the text the search box shows; give it a stable identity, because the component focuses the field each time the function changes`},initSearchValue:{control:`text`,description:`Text the search box starts with, read once`},showMainButton:{control:`boolean`,description:"Shows a main button inside the search box, to the left of the field; it needs `mainButtonProps` as well"},mainButtonProps:{control:!1,description:`Props of the main button, such as its text and the items of its menu`},mainButtonIcon:{control:!1,description:`Icon shown at 12 by 12 pixels inside the main button; a plus when omitted`},isIndexEditingMode:{control:`boolean`,description:`Disables the search box and removes the filter button while the listing is being reordered`},isIndexing:{control:`boolean`,description:`Removes the sort button and the view switch while the listing is being reordered`},getFilterData:{control:!1,description:`Loads the groups of the filter panel: each group is a header item followed by its options, awaited every time the panel opens`},onFilter:{action:`onFilter`,description:`Called with the whole new selection when Apply is pressed, and with an empty list when the panel's clear button empties a selection that was in force`},getSelectedFilterData:{control:!1,description:`Returns the filters in force, which become the chips under the bar; give it a stable identity, because it is read again whenever the function changes`},initSelectedFilterData:{control:`object`,description:"The filters in force at the first render, so the chips are right before `getSelectedFilterData` resolves"},removeSelectedItem:{action:`removeSelectedItem`,description:`Called with the key and group of a chip when it is clicked; the chip leaves the bar at once, without waiting for the host`},clearAll:{action:`clearAll`,description:`Called by the "Clear all" link, which appears once more than one chip carries a label`},filterHeader:{control:`text`,description:`Heading of the filter panel; nothing translates it for you`},filterTitle:{control:`text`,description:`Tooltip of the filter button`},selectorLabel:{control:`text`,description:"Heading handed to `renderSelector` for the step where a group picks a person or a room"},renderSelector:{control:!1,description:`Renders the step the panel opens when a group picks a person or a room; without it that step stays empty`},userId:{control:`text`,description:"Id of the signed-in person, handed to `renderSelector`"},disableThirdParty:{control:`boolean`,description:"Handed to `renderSelector` as it is"},isRooms:{control:`boolean`,description:"Shows a loading skeleton in the filter panel for half a second before its options, and is handed to `renderSelector`"},isContactsPage:{control:`boolean`,description:"Shapes the filter panel's loading skeleton for a contacts listing; the skeleton appears only while `isRooms` is set"},isContactsPeoplePage:{control:`boolean`,description:`Shapes the filter panel's loading skeleton for a listing of people`},isContactsGroupsPage:{control:`boolean`,description:`Shapes the filter panel's loading skeleton for a listing of groups`},isContactsInsideGroupPage:{control:`boolean`,description:`Shapes the filter panel's loading skeleton for the members of one group`},isContactsGuestsPage:{control:`boolean`,description:`Shapes the filter panel's loading skeleton for a listing of guests`},isFlowsPage:{control:`boolean`,description:`Leaves only the search box: removes the filter button, the sort button and the view switch`},isRecentFolder:{control:`boolean`,description:`Removes the sort button and keeps the view switch on the bar on every device`},getSortData:{control:!1,description:`Returns the sort fields, read on mount and again whenever the listing's columns change`},getSelectedSortData:{control:!1,description:"Returns the sort in force as a field key and a direction, `asc` or `desc`"},onSort:{action:`onSort`,description:`Called with the chosen field's key and the direction; picking the current field again reverses the direction`},onSortButtonClick:{action:`onSortButtonClick`,description:"Called with `false` when the sort menu opens and with `true` when it closes, and once with `true` on mount"},sortByTitle:{control:`text`,description:`Tooltip of the sort button`},view:{control:`text`,description:`Label of the row that holds the view switch inside the sort menu, shown below the desktop layout`},viewAs:{control:`select`,options:[`row`,`table`,`tile`],description:'The listing\'s current view; `"table"` is shown as `"row"`, and the switch offers the other one'},viewSelectorVisible:{control:`boolean`,description:`Whether the view switch is shown at all: beside the sort button on a desktop, inside the sort menu on smaller screens`},getViewSettingsData:{control:!1,description:`Returns the views the switch offers, each with a value and an icon; give it a stable identity`},onChangeViewAs:{action:`onChangeViewAs`,description:"Called when the view switch is clicked; the component keeps no view of its own, so `viewAs` has to change"},currentDeviceType:{control:`select`,options:Object.values(o),description:`Picks the layout: on a desktop the view switch sits on the bar, on other devices it moves into the sort menu; nothing here measures the window`},withRoomGroups:{control:`boolean`,description:"Allows the grouping row under the bar; it shows only together with `organizeRoomsGrouping`"},organizeRoomsGrouping:{control:`boolean`,description:`Turns grouping on; without it the grouping row never shows`},roomGroups:{control:`object`,description:"The groups shown as chips in the grouping row; a group whose `icon` is not an object is left out"},getAllRoomGroups:{control:!1,description:"Awaited once when grouping turns on, and the grouping row waits for it; the chips themselves come from `roomGroups`"},onFilterByGroup:{action:`onFilterByGroup`,description:'Called with a group\'s id when its chip is clicked, and with `null` for the "all" chip'},currentGroupId:{control:`text`,description:`Id of the group whose chip is highlighted; the "all" chip is highlighted when it is empty`},isFormsSection:{control:`boolean`,description:`Words the grouping row for spaces rather than rooms: "All spaces" instead of "All rooms"`},isFilterOrSearchActive:{control:`boolean`,description:"Hides the grouping row and, if a group was chosen, calls `onFilterByGroup(null)`"},setEditRoomGroupsDialogVisible:{action:`setEditRoomGroupsDialogVisible`,description:`Called by the management button at the end of the grouping row, and by the create chip shown when there are no groups`}}},k=e=>(0,f.jsx)(`div`,{style:{height:`140px`},children:e.children}),A=e=>{let t=d.useRef(null);return d.useEffect(()=>{let n=setTimeout(()=>{(t.current?.querySelector(`[data-testid="${e.testId}"]`))?.click()},100);return()=>clearTimeout(n)},[e.testId]),(0,f.jsx)(`div`,{ref:t,children:e.children})},j=e=>(0,f.jsx)(k,{children:(0,f.jsx)(l,{...e})}),M=e=>(0,f.jsx)(k,{children:(0,f.jsx)(A,{testId:`filter_icon_button`,children:(0,f.jsx)(l,{...e})})}),N={inline:!1,height:`480px`},P={render:e=>(0,f.jsx)(j,{...e}),parameters:{docs:{description:{story:`The bar as a desktop listing shows it: the search box, the filter button, the sort button and the button that switches to the other view. Change any prop live in the Controls panel below.`},source:{code:`<Filter
  placeholder="Search..."
  onSearch={setSearch}
  getFilterData={getFilterData}
  getSelectedFilterData={getSelectedFilterData}
  onFilter={applyFilter}
  getSortData={getSortData}
  getSelectedSortData={getSelectedSortData}
  onSort={applySort}
  getViewSettingsData={getViewSettingsData}
  viewAs="row"
  viewSelectorVisible
  onChangeViewAs={switchView}
  currentDeviceType={DeviceType.desktop}
  {...requiredProps}
/>`}}}},F={render:e=>(0,f.jsx)(M,{...e}),args:{getFilterData:()=>Promise.resolve(b)},parameters:{docs:{story:N,description:{story:"The filter panel with one group of options, opened for you when the story loads. Pick a type and press Apply to see the selection reach `onFilter` in the Actions panel."},source:{code:`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true, isLast: true },
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { id: "filter_type-spreadsheets", key: "spreadsheets", group: FilterGroups.filterType, label: "Spreadsheets" },
    { id: "filter_type-presentations", key: "presentations", group: FilterGroups.filterType, label: "Presentations" },
    { id: "filter_type-images", key: "images", group: FilterGroups.filterType, label: "Images", isLast: true },
  ])}
  {...props}
/>`}}}},I={render:e=>(0,f.jsx)(M,{...e}),args:{getFilterData:()=>Promise.resolve(b),initSelectedFilterData:x},parameters:{docs:{story:N,description:{story:"A filter already in force when the bar mounts: its chip is under the search box and its option is highlighted in the panel, opened for you when the story loads (`initSelectedFilterData`). Apply stays disabled until the selection changes."},source:{code:`<Filter
  initSelectedFilterData={[
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents", isSelected: true },
  ]}
  {...props}
/>`}}}},L={render:e=>(0,f.jsx)(M,{...e}),args:{getFilterData:()=>Promise.resolve([{key:s.filterType,group:s.filterType,label:`Type`,isHeader:!0},{id:`filter_type-documents`,key:`documents`,group:s.filterType,label:`Documents`},{id:`filter_type-spreadsheets`,key:`spreadsheets`,group:s.filterType,label:`Spreadsheets`},{key:s.filterStatus,group:s.filterStatus,label:`Status`,isHeader:!0},{id:`filter_status-active`,key:`active`,group:s.filterStatus,label:`Active`},{id:`filter_status-archived`,key:`archived`,group:s.filterStatus,label:`Archived`},{key:s.filterAuthor,group:s.filterAuthor,label:`Author`,isHeader:!0,isLast:!0},{id:`filter_author-me`,key:`me`,group:s.filterAuthor,label:`Me`},{id:`filter_author-shared`,key:`shared`,group:s.filterAuthor,label:`Shared with me`}])},parameters:{docs:{story:N,description:{story:`Several groups in one panel, each under its heading and divided by a line, so a listing can be narrowed by type, status and author at once. The panel opens for you when the story loads; one option can be picked per group.`},source:{code:`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterStatus, group: FilterGroups.filterStatus, label: "Status", isHeader: true },
    { key: "active", group: FilterGroups.filterStatus, label: "Active" },
    { key: FilterGroups.filterAuthor, group: FilterGroups.filterAuthor, label: "Author", isHeader: true, isLast: true },
    { key: "me", group: FilterGroups.filterAuthor, label: "Me" },
  ])}
  {...props}
/>`}}}},R={render:e=>(0,f.jsx)(M,{...e}),args:{isRooms:!0,getFilterData:()=>Promise.resolve([{key:s.filterRoom,group:s.filterRoom,label:`Room`,isHeader:!0,isLast:!0},{id:`filter_room-all`,key:a.withContent,group:s.filterRoom,label:`All Rooms`},{id:`filter_room-marketing`,key:`room-1`,group:s.filterRoom,label:`Marketing Room`},{id:`filter_room-development`,key:`room-2`,group:s.filterRoom,label:`Development Room`},{id:`filter_room-sales`,key:`room-3`,group:s.filterRoom,label:`Sales Room`,isLast:!0}])},parameters:{docs:{story:N,description:{story:"The panel of a listing of rooms: it shows a loading skeleton for half a second before the options appear, and passes the rooms flag on to `renderSelector` (`isRooms`). The panel opens for you when the story loads."},source:{code:`<Filter
  isRooms
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterRoom, group: FilterGroups.filterRoom, label: "Room", isHeader: true, isLast: true },
    { key: FilterKeys.withContent, group: FilterGroups.filterRoom, label: "All Rooms" },
    { key: "room-1", group: FilterGroups.filterRoom, label: "Marketing Room" },
    { key: "room-2", group: FilterGroups.filterRoom, label: "Development Room" },
  ])}
  {...props}
/>`}}}},z={render:e=>(0,f.jsx)(j,{...e}),args:{isIndexEditingMode:!0,isIndexing:!0,getFilterData:()=>Promise.resolve([])},parameters:{docs:{description:{story:"The bar while the listing is being reordered, when searching, filtering and sorting would fight the new order: the search box is disabled and the filter button is gone (`isIndexEditingMode`), and so are the sort button and the view switch (`isIndexing`)."},source:{code:`<Filter isIndexEditingMode isIndexing {...props} />`}}}},B=({viewAs:e,onChangeView:t,...n})=>{let[r,i]=(0,d.useState)(e);return(0,d.useEffect)(()=>{i(e)},[e]),(0,f.jsx)(te,{...n,viewAs:r,onChangeView:e=>i(e)})},V=()=>(0,f.jsx)(B,{viewSettings:g,viewAs:`row`,isDisabled:!1,isFilter:!1,onChangeView:()=>{}}),H={render:()=>(0,f.jsx)(V,{}),parameters:{docs:{description:{story:`The view switch the sort menu holds on smaller screens: one button per view, the current one filled. Click the other icon to switch views.`},source:{code:`<ViewSelector
  viewSettings={[
    { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
    { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
  ]}
  viewAs="row"
  onChangeView={(view) => setViewAs(view)}
/>`}}}},U=()=>(0,f.jsx)(B,{viewSettings:g,viewAs:`row`,isDisabled:!0,isFilter:!1,onChangeView:()=>{}}),W={render:()=>(0,f.jsx)(U,{}),parameters:{docs:{description:{story:"The view switch greyed out while switching views is not possible; clicks on its icons do nothing (`isDisabled`)."},source:{code:`<ViewSelector viewSettings={viewSettings} viewAs="row" isDisabled />`}}}},G=()=>(0,f.jsx)(B,{viewSettings:g,viewAs:`row`,isDisabled:!1,isFilter:!0,onChangeView:()=>{}}),K={render:()=>(0,f.jsx)(G,{}),parameters:{docs:{description:{story:"The single button the bar shows on a desktop: it carries the icon of the view you would switch to, not the current one, and turns into the other icon when clicked (`isFilter`)."},source:{code:`<ViewSelector viewSettings={viewSettings} viewAs="row" isFilter />`}}}},q={render:e=>(0,f.jsx)(j,{...e}),args:{initSelectedFilterData:S,getSelectedFilterData:()=>S},parameters:{docs:{description:{story:'The filters in force as chips under the bar, so the reader sees what narrows the listing and can drop any of it in one click. Click a chip to remove it (`removeSelectedItem`); the "Clear all" link appears once more than one chip is shown (`clearAll`).'},source:{code:`<Filter
  initSelectedFilterData={selected}
  getSelectedFilterData={getSelectedFilterData}
  removeSelectedItem={({ key, group }) => removeFilter(key, group)}
  clearAll={clearFilters}
  {...props}
/>`}}}},J={render:e=>(0,f.jsx)(M,{...e}),args:{getFilterData:()=>Promise.resolve(C)},parameters:{docs:{story:N,description:{story:"The kinds of option a group can hold besides tags, for filters that are not a choice among a few words. The panel opens for you when the story loads:\n\n- **Documents**, **Spreadsheets** — tags, one of which can be picked\n- **Anywhere** — a drop-down list of values (`withOptions` with `options`)\n- **Exclude subfolders** — a checkbox, in a group without a heading (`isCheckbox`, `withoutHeader`)"},source:{code:`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterLocation, group: FilterGroups.filterLocation, label: "Location", isHeader: true },
    { key: "filter_location", group: FilterGroups.filterLocation, withOptions: true, options: [
      { key: "anywhere", label: "Anywhere" },
      { key: "my-documents", label: "My documents" },
    ] },
    { key: FilterGroups.filterFolders, group: FilterGroups.filterFolders, label: "Search", isHeader: true, withoutHeader: true, isLast: true },
    { key: FilterKeys.excludeSubfolders, group: FilterGroups.filterFolders, label: "Exclude subfolders", isCheckbox: true },
  ])}
  {...props}
/>`}}}},Y={render:e=>(0,f.jsx)(`div`,{style:{height:`300px`},children:(0,f.jsx)(A,{testId:`filter_sort_button`,children:(0,f.jsx)(l,{...e})})}),args:{currentDeviceType:o.tablet},parameters:{docs:{story:{inline:!1,height:`326px`},description:{story:"The sort menu on a device narrower than a desktop, opened for you when the story loads: the view switch has left the bar and heads the menu, above the sort fields (`currentDeviceType`). The current field carries an arrow for its direction; pick it again to reverse it (`onSort`)."},source:{code:`<Filter currentDeviceType={DeviceType.tablet} viewSelectorVisible {...props} />`}}}},X={render:e=>(0,f.jsx)(`div`,{style:{height:`180px`},children:(0,f.jsx)(l,{...e})}),args:{withRoomGroups:!0,organizeRoomsGrouping:!0,roomGroups:T,getAllRoomGroups:E,currentGroupId:`2`},parameters:{docs:{description:{story:'A row of group chips under the bar, for a listing its host has sorted into groups: "All rooms" first, the chosen group highlighted (`currentGroupId`), and the groups that do not fit behind the "..." button. Click a chip to choose it (`onFilterByGroup`); the button at the end of the row opens the host\'s group management (`setEditRoomGroupsDialogVisible`).'},source:{code:`<Filter
  withRoomGroups
  organizeRoomsGrouping
  roomGroups={groups}
  getAllRoomGroups={loadGroups}
  currentGroupId="2"
  onFilterByGroup={filterByGroup}
  setEditRoomGroupsDialogVisible={openGroupManagement}
  {...props}
/>`}}}},Z={render:e=>(0,f.jsx)(j,{...e}),args:{showMainButton:!0,mainButtonProps:{text:`New`,model:[]}},parameters:{docs:{description:{story:"A main button inside the search box, for a listing that has no room for one of its own beside the bar (`showMainButton`, `mainButtonProps`)."},source:{code:`<Filter
  showMainButton
  mainButtonProps={{ text: "New", model: menuItems }}
  {...props}
/>`}}}},Q={render:e=>(0,f.jsx)(`div`,{dir:`rtl`,children:(0,f.jsx)(j,{...e})}),globals:{direction:`rtl`},args:{placeholder:`بحث`,initSelectedFilterData:S,getSelectedFilterData:()=>S},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`166px`},description:{story:`The bar in a right-to-left interface: the search box starts at the right edge, the filter, sort and view buttons line up at the left, and the chips and the "Clear all" link run from right to left.`},source:{code:`<div dir="rtl">
  <Filter placeholder="بحث" {...props} />
</div>`}}}},$={render:e=>(0,f.jsx)(`div`,{style:{height:`140px`,"--filter-btn-border":`1px solid #0082c9`,"--filter-btn-hover-border":`1px solid #004f7a`,"--filter-btn-open-fill":`#0082c9`,"--filter-btn-radius":`6px`,"--filter-sort-bg":`#e6f3fb`,"--filter-sort-selected-bg":`#cce5f6`,"--filter-sort-fill":`#0082c9`,"--filter-view-fill":`#e6f3fb`,"--filter-view-checked":`#0082c9`,"--filter-view-border":`#0082c9`,"--filter-view-hover-border":`#004f7a`,"--filter-view-hover-icon":`#004f7a`},children:(0,f.jsx)(l,{...e})}),args:{getFilterData:()=>Promise.resolve([])},parameters:{docs:{description:{story:"The variables of the bar set on one wrapper -- the variables are listed under CSS variables on this page. Hover the filter and view buttons, and open the sort menu, to see the hover and menu values. The sort menu's view icons appear only below the desktop layout, so set those two with `currentDeviceType` in the Controls panel; the panel's variables apply only on `:root` or `body`, because it renders in a portal."},source:{code:`<div style={{
  "--filter-btn-border": "1px solid #0082c9",
  "--filter-btn-hover-border": "1px solid #004f7a",
  "--filter-btn-open-fill": "#0082c9",
  "--filter-btn-radius": "6px",
  "--filter-sort-bg": "#e6f3fb",
  "--filter-sort-selected-bg": "#cce5f6",
  "--filter-sort-fill": "#0082c9",
  "--filter-view-fill": "#e6f3fb",
  "--filter-view-checked": "#0082c9",
  "--filter-view-border": "#0082c9",
  "--filter-view-hover-border": "#004f7a",
  "--filter-view-hover-icon": "#004f7a",
}}>
  <Filter {...props} />
</div>`}}}},se=[`Default`,`DocumentTypes`,`WithSelectedFilters`,`MultipleFilterGroups`,`RoomsFilter`,`DisabledFilter`,`ViewSelectorDefault`,`ViewSelectorDisabled`,`ViewSelectorFilterMode`,`WithFilterChips`,`PanelOptionKinds`,`SortMenuOnTablet`,`WithGroupingRow`,`WithMainButton`,`RightToLeft`,`CssCustomization`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <FilterTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story: "The bar as a desktop listing shows it: the search box, the filter button, the sort button and the button that switches to the other view. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<Filter
  placeholder="Search..."
  onSearch={setSearch}
  getFilterData={getFilterData}
  getSelectedFilterData={getSelectedFilterData}
  onFilter={applyFilter}
  getSortData={getSortData}
  getSelectedSortData={getSelectedSortData}
  onSort={applySort}
  getViewSettingsData={getViewSettingsData}
  viewAs="row"
  viewSelectorVisible
  onChangeViewAs={switchView}
  currentDeviceType={DeviceType.desktop}
  {...requiredProps}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(documentTypeItems)
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: "The filter panel with one group of options, opened for you when the story loads. Pick a type and press Apply to see the selection reach \`onFilter\` in the Actions panel."
      },
      source: {
        code: \`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true, isLast: true },
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { id: "filter_type-spreadsheets", key: "spreadsheets", group: FilterGroups.filterType, label: "Spreadsheets" },
    { id: "filter_type-presentations", key: "presentations", group: FilterGroups.filterType, label: "Presentations" },
    { id: "filter_type-images", key: "images", group: FilterGroups.filterType, label: "Images", isLast: true },
  ])}
  {...props}
/>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(documentTypeItems),
    initSelectedFilterData: selectedDocuments
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: "A filter already in force when the bar mounts: its chip is under the search box and its option is highlighted in the panel, opened for you when the story loads (\`initSelectedFilterData\`). Apply stays disabled until the selection changes."
      },
      source: {
        code: \`<Filter
  initSelectedFilterData={[
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents", isSelected: true },
  ]}
  {...props}
/>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve([{
      key: FilterGroups.filterType,
      group: FilterGroups.filterType,
      label: "Type",
      isHeader: true
    }, {
      id: "filter_type-documents",
      key: "documents",
      group: FilterGroups.filterType,
      label: "Documents"
    }, {
      id: "filter_type-spreadsheets",
      key: "spreadsheets",
      group: FilterGroups.filterType,
      label: "Spreadsheets"
    }, {
      key: FilterGroups.filterStatus,
      group: FilterGroups.filterStatus,
      label: "Status",
      isHeader: true
    }, {
      id: "filter_status-active",
      key: "active",
      group: FilterGroups.filterStatus,
      label: "Active"
    }, {
      id: "filter_status-archived",
      key: "archived",
      group: FilterGroups.filterStatus,
      label: "Archived"
    }, {
      key: FilterGroups.filterAuthor,
      group: FilterGroups.filterAuthor,
      label: "Author",
      isHeader: true,
      isLast: true
    }, {
      id: "filter_author-me",
      key: "me",
      group: FilterGroups.filterAuthor,
      label: "Me"
    }, {
      id: "filter_author-shared",
      key: "shared",
      group: FilterGroups.filterAuthor,
      label: "Shared with me"
    }])
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: "Several groups in one panel, each under its heading and divided by a line, so a listing can be narrowed by type, status and author at once. The panel opens for you when the story loads; one option can be picked per group."
      },
      source: {
        code: \`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterStatus, group: FilterGroups.filterStatus, label: "Status", isHeader: true },
    { key: "active", group: FilterGroups.filterStatus, label: "Active" },
    { key: FilterGroups.filterAuthor, group: FilterGroups.filterAuthor, label: "Author", isHeader: true, isLast: true },
    { key: "me", group: FilterGroups.filterAuthor, label: "Me" },
  ])}
  {...props}
/>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <OpenPanelTemplate {...args} />,
  args: {
    isRooms: true,
    getFilterData: () => Promise.resolve([{
      key: FilterGroups.filterRoom,
      group: FilterGroups.filterRoom,
      label: "Room",
      isHeader: true,
      isLast: true
    }, {
      id: "filter_room-all",
      key: FilterKeys.withContent,
      group: FilterGroups.filterRoom,
      label: "All Rooms"
    }, {
      id: "filter_room-marketing",
      key: "room-1",
      group: FilterGroups.filterRoom,
      label: "Marketing Room"
    }, {
      id: "filter_room-development",
      key: "room-2",
      group: FilterGroups.filterRoom,
      label: "Development Room"
    }, {
      id: "filter_room-sales",
      key: "room-3",
      group: FilterGroups.filterRoom,
      label: "Sales Room",
      isLast: true
    }])
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: "The panel of a listing of rooms: it shows a loading skeleton for half a second before the options appear, and passes the rooms flag on to \`renderSelector\` (\`isRooms\`). The panel opens for you when the story loads."
      },
      source: {
        code: \`<Filter
  isRooms
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterRoom, group: FilterGroups.filterRoom, label: "Room", isHeader: true, isLast: true },
    { key: FilterKeys.withContent, group: FilterGroups.filterRoom, label: "All Rooms" },
    { key: "room-1", group: FilterGroups.filterRoom, label: "Marketing Room" },
    { key: "room-2", group: FilterGroups.filterRoom, label: "Development Room" },
  ])}
  {...props}
/>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <FilterTemplate {...args} />,
  args: {
    isIndexEditingMode: true,
    isIndexing: true,
    getFilterData: () => Promise.resolve([])
  },
  parameters: {
    docs: {
      description: {
        story: "The bar while the listing is being reordered, when searching, filtering and sorting would fight the new order: the search box is disabled and the filter button is gone (\`isIndexEditingMode\`), and so are the sort button and the view switch (\`isIndexing\`)."
      },
      source: {
        code: \`<Filter isIndexEditingMode isIndexing {...props} />\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <ViewSelectorDefaultTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The view switch the sort menu holds on smaller screens: one button per view, the current one filled. Click the other icon to switch views."
      },
      source: {
        code: \`<ViewSelector
  viewSettings={[
    { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
    { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
  ]}
  viewAs="row"
  onChangeView={(view) => setViewAs(view)}
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <ViewSelectorDisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The view switch greyed out while switching views is not possible; clicks on its icons do nothing (\`isDisabled\`)."
      },
      source: {
        code: \`<ViewSelector viewSettings={viewSettings} viewAs="row" isDisabled />\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <ViewSelectorFilterModeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The single button the bar shows on a desktop: it carries the icon of the view you would switch to, not the current one, and turns into the other icon when clicked (\`isFilter\`)."
      },
      source: {
        code: \`<ViewSelector viewSettings={viewSettings} viewAs="row" isFilter />\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <FilterTemplate {...args} />,
  args: {
    initSelectedFilterData: selectedChips,
    getSelectedFilterData: () => selectedChips
  },
  parameters: {
    docs: {
      description: {
        story: 'The filters in force as chips under the bar, so the reader sees what narrows the listing and can drop any of it in one click. Click a chip to remove it (\`removeSelectedItem\`); the "Clear all" link appears once more than one chip is shown (\`clearAll\`).'
      },
      source: {
        code: \`<Filter
  initSelectedFilterData={selected}
  getSelectedFilterData={getSelectedFilterData}
  removeSelectedItem={({ key, group }) => removeFilter(key, group)}
  clearAll={clearFilters}
  {...props}
/>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(optionKindItems)
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: \`The kinds of option a group can hold besides tags, for filters that are not a choice among a few words. The panel opens for you when the story loads:

- **Documents**, **Spreadsheets** — tags, one of which can be picked
- **Anywhere** — a drop-down list of values (\\\`withOptions\\\` with \\\`options\\\`)
- **Exclude subfolders** — a checkbox, in a group without a heading (\\\`isCheckbox\\\`, \\\`withoutHeader\\\`)\`
      },
      source: {
        code: \`<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterLocation, group: FilterGroups.filterLocation, label: "Location", isHeader: true },
    { key: "filter_location", group: FilterGroups.filterLocation, withOptions: true, options: [
      { key: "anywhere", label: "Anywhere" },
      { key: "my-documents", label: "My documents" },
    ] },
    { key: FilterGroups.filterFolders, group: FilterGroups.filterFolders, label: "Search", isHeader: true, withoutHeader: true, isLast: true },
    { key: FilterKeys.excludeSubfolders, group: FilterGroups.filterFolders, label: "Exclude subfolders", isCheckbox: true },
  ])}
  {...props}
/>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    height: "300px"
  }}>
      <OpenOnMount testId="filter_sort_button">
        <Filter {...args} />
      </OpenOnMount>
    </div>,
  args: {
    currentDeviceType: DeviceType.tablet
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        height: "326px"
      },
      description: {
        story: "The sort menu on a device narrower than a desktop, opened for you when the story loads: the view switch has left the bar and heads the menu, above the sort fields (\`currentDeviceType\`). The current field carries an arrow for its direction; pick it again to reverse it (\`onSort\`)."
      },
      source: {
        code: \`<Filter currentDeviceType={DeviceType.tablet} viewSelectorVisible {...props} />\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    height: "180px"
  }}>
      <Filter {...args} />
    </div>,
  args: {
    withRoomGroups: true,
    organizeRoomsGrouping: true,
    roomGroups: mockRoomGroups,
    getAllRoomGroups,
    currentGroupId: "2"
  },
  parameters: {
    docs: {
      description: {
        story: 'A row of group chips under the bar, for a listing its host has sorted into groups: "All rooms" first, the chosen group highlighted (\`currentGroupId\`), and the groups that do not fit behind the "..." button. Click a chip to choose it (\`onFilterByGroup\`); the button at the end of the row opens the host\\'s group management (\`setEditRoomGroupsDialogVisible\`).'
      },
      source: {
        code: \`<Filter
  withRoomGroups
  organizeRoomsGrouping
  roomGroups={groups}
  getAllRoomGroups={loadGroups}
  currentGroupId="2"
  onFilterByGroup={filterByGroup}
  setEditRoomGroupsDialogVisible={openGroupManagement}
  {...props}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <FilterTemplate {...args} />,
  args: {
    showMainButton: true,
    mainButtonProps: {
      text: "New",
      model: []
    }
  },
  parameters: {
    docs: {
      description: {
        story: "A main button inside the search box, for a listing that has no room for one of its own beside the bar (\`showMainButton\`, \`mainButtonProps\`)."
      },
      source: {
        code: \`<Filter
  showMainButton
  mainButtonProps={{ text: "New", model: menuItems }}
  {...props}
/>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <FilterTemplate {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    placeholder: "بحث",
    initSelectedFilterData: selectedChips,
    getSelectedFilterData: () => selectedChips
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed so the right-to-left direction does not flip the rest of the Docs page.
      story: {
        inline: false,
        height: "166px"
      },
      description: {
        story: 'The bar in a right-to-left interface: the search box starts at the right edge, the filter, sort and view buttons line up at the left, and the chips and the "Clear all" link run from right to left.'
      },
      source: {
        code: \`<div dir="rtl">
  <Filter placeholder="بحث" {...props} />
</div>\`
      }
    }
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    height: "140px",
    "--filter-btn-border": "1px solid #0082c9",
    "--filter-btn-hover-border": "1px solid #004f7a",
    "--filter-btn-open-fill": "#0082c9",
    "--filter-btn-radius": "6px",
    "--filter-sort-bg": "#e6f3fb",
    "--filter-sort-selected-bg": "#cce5f6",
    "--filter-sort-fill": "#0082c9",
    "--filter-view-fill": "#e6f3fb",
    "--filter-view-checked": "#0082c9",
    "--filter-view-border": "#0082c9",
    "--filter-view-hover-border": "#004f7a",
    "--filter-view-hover-icon": "#004f7a"
  } as React.CSSProperties}>
      <Filter {...args} />
    </div>,
  args: {
    getFilterData: () => Promise.resolve([])
  },
  parameters: {
    docs: {
      description: {
        story: \`The variables of the bar set on one wrapper -- the variables are listed under CSS variables on this page. Hover the filter and view buttons, and open the sort menu, to see the hover and menu values. The sort menu's view icons appear only below the desktop layout, so set those two with \\\`currentDeviceType\\\` in the Controls panel; the panel's variables apply only on \\\`:root\\\` or \\\`body\\\`, because it renders in a portal.\`
      },
      source: {
        code: \`<div style={{
  "--filter-btn-border": "1px solid #0082c9",
  "--filter-btn-hover-border": "1px solid #004f7a",
  "--filter-btn-open-fill": "#0082c9",
  "--filter-btn-radius": "6px",
  "--filter-sort-bg": "#e6f3fb",
  "--filter-sort-selected-bg": "#cce5f6",
  "--filter-sort-fill": "#0082c9",
  "--filter-view-fill": "#e6f3fb",
  "--filter-view-checked": "#0082c9",
  "--filter-view-border": "#0082c9",
  "--filter-view-hover-border": "#004f7a",
  "--filter-view-hover-icon": "#004f7a",
}}>
  <Filter {...props} />
</div>\`
      }
    }
  }
}`,...$.parameters?.docs?.source}}}})))()}ce();export{$ as CssCustomization,P as Default,z as DisabledFilter,F as DocumentTypes,L as MultipleFilterGroups,J as PanelOptionKinds,Q as RightToLeft,R as RoomsFilter,Y as SortMenuOnTablet,H as ViewSelectorDefault,W as ViewSelectorDisabled,K as ViewSelectorFilterMode,q as WithFilterChips,X as WithGroupingRow,Z as WithMainButton,I as WithSelectedFilters,se as __namedExportsOrder,O as default};