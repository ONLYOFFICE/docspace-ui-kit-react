import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{r,t as i}from"./text-Cz_cI6Yf.js";import{S as ee,n as a,u as o,v as s}from"./enums-DzcBu485.js";import{n as te,t as ne}from"./Navigation-CMyNHB04.js";import{n as re,t as c}from"./tabs-CkUaQ4gz.js";import{n as ie,o as l,s as ae,t as oe}from"./filter-CMzyi46r.js";import{n as u,t as se}from"./view-tiles.react-CcY0t-5f.js";import{n as d,t as f}from"./section-DZqcSeia.js";import{i as ce,n as le,r as ue,t as de}from"./TableBody-BXi4vyQf.js";import{n as p,t as m}from"./TableCell-7C_VA9gK.js";import{n as h,t as fe}from"./TableRow-JzNOco51.js";import{n as pe,t as me}from"./TableHeader-CXsmwfmK.js";var g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{g=t(),ae(),u(),ee(),ie(),te(),le(),p(),ce(),pe(),h(),re(),r(),d(),_=n(),{useArgs:v}=__STORYBOOK_MODULE_PREVIEW_API__,{fn:y}=__STORYBOOK_MODULE_TEST__,b={title:`UI/Layout/Section`,component:f,parameters:{},args:{onDrop:y(),onDragOverEmpty:y(),onDragLeaveEmpty:y(),setIsInfoPanelVisible:y(),setIsChatPanelVisible:y(),setChatPanelWidth:y(),onOpenUploadPanel:y(),cancelUpload:y(),clearSecondaryProgressData:y(),clearPrimaryProgressData:y(),cancelSecondaryOperationById:y(),clearDropPreviewLocation:y()},argTypes:{currentDeviceType:{control:`select`,options:Object.values(a),description:`Which layout to render: where the header and the filter go, whether the body scrolls itself and whether the info panel sits beside the body or covers the page. Nothing measures the window, so the host passes the value that fits it`,table:{defaultValue:{summary:`undefined`}}},withBodyScroll:{control:`boolean`,description:`Gives the body a scroller of its own under the pinned header; off, the page scrolls instead and the section takes a 20px inline-start padding. On a phone the page always scrolls`,table:{defaultValue:{summary:`true`}}},settingsStudio:{control:`boolean`,description:`Applies the settings pages' narrower body padding`,table:{defaultValue:{summary:`false`}}},viewAs:{control:`select`,options:[`row`,`table`,`tile`,`tileDynamicHeight`,`settings`,`profile`],description:"Which listing the body holds. `settings` and `profile` drop the body's top padding"},isInfoPanelAvailable:{control:`boolean`,description:"Whether the info panel region exists at all; off, it is never rendered whatever `isInfoPanelVisible` says",table:{defaultValue:{summary:`true`}}},isInfoPanelVisible:{control:`boolean`,description:"Whether the info panel is open. It shows only while `canDisplay` is set as well"},canDisplay:{control:`boolean`,description:"Allows the info panel to be shown. Without it the panel stays hidden even while `isInfoPanelVisible` is set"},setIsInfoPanelVisible:{control:!1,description:"Called with `false` when the info panel closes itself on a device below desktop: a click on the dimmed page around it, or the browser going back"},isMobileHidden:{control:`boolean`,description:`Hides the info panel on any device below desktop`},anotherDialogOpen:{control:`boolean`,description:`Hides the info panel below desktop while another dialog is open, so the two do not stack`},infoPanelWithoutScroll:{control:`boolean`,description:`Removes the info panel body's own scroller, for panel content that scrolls its own regions`},isInfoPanelScrollLocked:{control:`boolean`,description:`Freezes the info panel's scroller, for a drag or a menu that must not scroll the panel under it`},isChatPanelAvailable:{control:`boolean`,description:`Whether the chat panel region exists at all; off, it is never rendered`,table:{defaultValue:{summary:`false`}}},isChatPanelVisible:{control:`boolean`,description:`Whether the chat panel is open. On tablet and phone it covers the whole page`},setIsChatPanelVisible:{control:!1,description:"Called with `false` when the browser goes back while the chat panel is open on a device below desktop"},chatPanelDropTargetLabel:{control:`text`,description:`Text of a dashed "drop here" frame drawn over the chat panel; set it while the host drags its own items over the panel and clear it afterwards`},isChatPanelResizable:{control:`boolean`,description:`Adds a drag handle on the chat panel's inner edge that changes its width, on desktop only`},chatPanelWidth:{control:`number`,description:`Width of the docked chat panel in pixels while the handle is on; without it the panel is 400px wide`},setChatPanelWidth:{control:!1,description:`Called once per handle drag, when the mouse is released, with the new width in pixels`},setChatPanelFullscreen:{control:!1,description:`Called when the handle is dragged past the widest width the page allows; the host is expected to turn fullscreen on. Without it the drag stops at that width`},unsetChatPanelFullscreen:{control:!1,description:`Called when the handle is dragged back inwards in fullscreen; the host turns fullscreen off and the same drag goes on resizing the panel`},isChatPanelFullscreen:{control:`boolean`,description:`Whether the host renders the chat panel fullscreen right now; the handle then only listens for the drag back inwards`},scrollableBanner:{control:`boolean`,description:`Puts the banner at the top of the scrolling body, so it scrolls away under the header, instead of pinning it above the scroller`,table:{defaultValue:{summary:`false`}}},stickyTableHeader:{control:`boolean`,description:`Moves the desktop filter into the scrolling body, where it sticks under the header, and lets a table header stick under the filter instead of being fixed. The host gives the resting offsets in CSS variables`,table:{defaultValue:{summary:`false`}}},inert:{control:`boolean`,description:`Makes the whole section unfocusable and unclickable and hides it from assistive technology, for a section kept mounted behind a fullscreen panel`},withTabs:{control:`boolean`,description:`Marks the filter below desktop as sitting under tabs. No style reads the mark any more, so it changes nothing on screen`},withoutFooter:{control:`boolean`,description:`Drops the footer slot and the empty space under the body`,table:{defaultValue:{summary:`false`}}},fullHeightBody:{control:`boolean`,description:`Makes the body fill the height below the header rather than its content's, for a page whose inner regions scroll instead`},getContextModel:{control:!1,description:`Returns the items of the menu that opens on a right click anywhere in the body. Without it no menu is mounted`},isIndexEditingMode:{control:`boolean`,description:`Turns the body's right-click menu off while the listing is being reordered`},pathname:{control:`text`,description:`The current route; changing it asks the body to take the focus again on desktop`},onDrop:{control:!1,description:`Called with the files dropped anywhere on the body. Nothing is filtered and nothing is highlighted`},onDragOverEmpty:{control:!1,description:`Called on every drag over the body, with a flag saying whether a drag was already active`},onDragLeaveEmpty:{control:!1,description:`Called when a drag leaves the body`},secondaryActiveOperations:{control:`object`,description:`Background operations (copy, move, delete…) shown in the floating progress button. Any non-empty list makes the button appear`,table:{defaultValue:{summary:`[]`}}},primaryOperationsArray:{control:`object`,description:`Upload operations shown in the progress button's own panel. Any non-empty list makes the button appear`,table:{defaultValue:{summary:`[]`}}},pluginOperations:{control:`object`,description:`Operations contributed by plugins, listed with the background ones. Any non-empty list makes the button appear`,table:{defaultValue:{summary:`[]`}}},secondaryOperationsCompleted:{control:`boolean`,description:`Whether the background operations have finished, for the button's completed look`},primaryOperationsCompleted:{control:`boolean`,description:`Whether the uploads have finished`},pluginOperationsCompleted:{control:`boolean`,description:`Whether the plugin operations have finished`},secondaryOperationsStopped:{control:`boolean`,description:`Whether the background operations were stopped rather than finished`},secondaryOperationsAlert:{control:`boolean`,description:`Puts the progress button in its alert look for a failed background operation`},primaryOperationsAlert:{control:`boolean`,description:`Puts the progress button in its alert look for a failed upload`},pluginOperationsAlert:{control:`boolean`,description:`Puts the progress button in its alert look for a failed plugin operation`},primaryOperationsCanceled:{control:`boolean`,description:`Whether the uploads were cancelled`},needErrorChecking:{control:`boolean`,description:`Makes the progress button check its operations for errors before showing them as complete`},pluginShowCancelButton:{control:`boolean`,description:`Shows the progress button's cancel control whatever the operations say`},mainButtonVisible:{control:`boolean`,description:`Whether a main action button is on screen, which moves the progress button clear of it`},onOpenUploadPanel:{control:!1,description:`Called when the progress button asks to open the upload panel`},cancelUpload:{control:!1,description:`Called by the progress button's cancel control while an upload is running`},clearSecondaryProgressData:{control:!1,description:`Called to clear a finished background operation`},clearPrimaryProgressData:{control:!1,description:`Called to clear a finished upload`},cancelSecondaryOperationById:{control:!1,description:`Called with an operation type and id to cancel one background operation`},dragging:{control:`boolean`,description:`Whether the host is dragging its own items, which switches the progress button to a drop preview`},dropTargetPreview:{control:`text`,description:`Name of the folder a dragged item would land in, shown by the progress button's drop preview`},clearDropPreviewLocation:{control:!1,description:`Called to clear that drop preview`},startDropPreview:{control:!1,description:`Passing it at all makes the progress button appear even with no operations, so a drag can show its drop preview`}}},x=`section-story-columns`,S=`section-story-columns-info`,C=()=>{},w=[{id:`1`,title:`Documents`,isRootRoom:!1},{id:`2`,title:`Shared with me`,isRootRoom:!1},{id:`3`,title:`Project files`,isRootRoom:!0}],T=[{key:`name`,label:`Name`,isSelected:!1,id:`1`,className:``,sortDirection:`asc`,sortId:`1`},{key:`modified`,label:`Modified`,isSelected:!1,id:`2`,className:``,sortDirection:`asc`,sortId:`1`},{key:`size`,label:`Size`,isSelected:!1,id:`3`,className:``,sortDirection:`asc`,sortId:`1`}],E=[{id:`1`,label:`Grid`,value:`tile`,icon:(0,_.jsx)(se,{})},{id:`2`,label:`List`,value:`row`,icon:(0,_.jsx)(l,{})}],D=[{key:`name`,title:`Name`,resizable:!0,enable:!0,default:!0,sortBy:s.Name,minWidth:210,onChange:C,onClick:C},{key:`type`,title:`Type`,enable:!0,resizable:!0,sortBy:s.Type,onChange:C,onClick:C},{key:`tags`,title:`Tags`,enable:!0,resizable:!0,sortBy:s.Tags,withTagRef:!0,onChange:C,onClick:C}],O=[{name:`Annual Report 2025.docx`,type:`Document`,tags:`Finance`},{name:`Q4 Budget.xlsx`,type:`Spreadsheet`,tags:`Finance`},{name:`Team Presentation.pptx`,type:`Presentation`,tags:`Marketing`},{name:`Logo Design.png`,type:`Image`,tags:`Design`},{name:`Meeting Notes.docx`,type:`Document`,tags:`General`},{name:`Product Roadmap.pdf`,type:`PDF`,tags:`Product`},{name:`User Research.docx`,type:`Document`,tags:`UX`},{name:`Sprint Backlog.xlsx`,type:`Spreadsheet`,tags:`Engineering`},{name:`Brand Guidelines.pdf`,type:`PDF`,tags:`Marketing`},{name:`Architecture Diagram.png`,type:`Image`,tags:`Engineering`}],k=({device:e=a.desktop})=>(0,_.jsx)(ne,{title:`My Documents`,isRootFolder:!1,canCreate:!0,showText:!0,isDesktop:e===a.desktop,isRoom:!1,withMenu:!0,showTitle:!0,showRootFolderTitle:!0,showNavigationButton:!1,isInfoPanelVisible:!1,isCurrentFolderInfo:!1,currentDeviceType:e,navigationItems:w,onClickFolder:C,onBackToParentFolder:C,clearTrash:C,getContextOptionsFolder:()=>[{key:`rename`,label:`Rename`},{key:`delete`,label:`Delete`}],getContextOptionsPlus:()=>[{key:`upload`,label:`Upload file`},{key:`create`,label:`Create folder`}],toggleInfoPanel:C,hideInfoPanel:C,showFolderInfo:C,onPlusClick:C,withLogo:!1,burgerLogo:``,titleIcon:``,rootRoomTitle:``}),A=({device:e=a.desktop})=>(0,_.jsx)(oe,{viewAs:`row`,view:`row`,placeholder:`Search...`,filterTitle:`Filter`,sortByTitle:`Sort by`,filterHeader:`Filter`,selectorLabel:`Select`,userId:`1`,currentDeviceType:e,viewSelectorVisible:!0,isRooms:!1,isContactsPage:!1,isContactsPeoplePage:!1,isContactsGroupsPage:!1,isContactsInsideGroupPage:!1,isContactsGuestsPage:!1,isIndexing:!1,isIndexEditingMode:!1,isRecentFolder:!1,clearSearch:!1,setClearSearch:C,onSearch:C,onClearFilter:C,onChangeViewAs:C,onSort:C,onFilter:C,onSortButtonClick:C,removeSelectedItem:C,clearAll:C,getSelectedInputValue:()=>``,getSortData:()=>T,getSelectedSortData:()=>({sortDirection:`asc`,sortId:`AZ`}),getViewSettingsData:()=>E,getFilterData:()=>Promise.resolve([{key:o.filterType,group:o.filterType,label:`Type`,isHeader:!0,isLast:!0},{id:`filter_type-documents`,key:`documents`,group:o.filterType,label:`Documents`},{id:`filter_type-spreadsheets`,key:`spreadsheets`,group:o.filterType,label:`Spreadsheets`}]),getSelectedFilterData:()=>Promise.resolve([])}),j=()=>{let e=(0,g.useRef)(null),t=O.map(e=>(0,_.jsxs)(fe,{children:[(0,_.jsx)(m,{children:e.name}),(0,_.jsx)(m,{children:e.type}),(0,_.jsx)(m,{children:e.tags})]},`row-${e.name}`));return(0,_.jsxs)(ue,{forwardedRef:e,useReactWindow:!1,children:[(0,_.jsx)(me,{containerRef:e,columns:D,columnStorageName:x,columnInfoPanelStorageName:S,sectionWidth:800,useReactWindow:!1,showSettings:!0,sortingVisible:!0,sorted:!0}),(0,_.jsx)(de,{columnStorageName:x,columnInfoPanelStorageName:S,fetchMoreFiles:async()=>{},filesLength:O.length,hasMoreFiles:!1,itemCount:O.length,itemHeight:50,useReactWindow:!1,children:t})]})},M={position:`absolute`,top:`2px`,insetInlineEnd:`4px`,fontSize:`10px`,fontWeight:600,textTransform:`uppercase`,letterSpacing:`0.5px`,padding:`1px 6px`,borderRadius:`3px`,zIndex:300,pointerEvents:`none`},N={render:e=>(0,_.jsx)(`div`,{style:{width:`100%`,height:`600px`},children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsxs)(`div`,{style:{paddingBottom:`12px`,border:`2px dashed #2196F3`,borderRadius:`4px`,position:`relative`,background:`white`,zIndex:202},children:[(0,_.jsx)(`span`,{style:{...M,color:`#2196F3`,backgroundColor:`#E3F2FD`},children:`Header`}),(0,_.jsx)(k,{})]})}),(0,_.jsx)(f.SectionFilter,{children:(0,_.jsxs)(`div`,{style:{padding:`8px 0`,border:`2px dashed #FF9800`,borderRadius:`4px`,position:`relative`,background:`white`,zIndex:202},children:[(0,_.jsx)(`span`,{style:{...M,color:`#FF9800`,backgroundColor:`#FFF3E0`},children:`Filter`}),(0,_.jsx)(A,{})]})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsxs)(`div`,{style:{marginLeft:`-20px`,marginTop:`8px`,border:`2px dashed #4CAF50`,borderRadius:`4px`,position:`relative`},children:[(0,_.jsx)(`span`,{style:{...M,color:`#4CAF50`,backgroundColor:`#E8F5E9`},children:`Body`}),(0,_.jsx)(j,{})]})}),(0,_.jsx)(f.SectionFooter,{children:null})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,isInfoPanelAvailable:!1},parameters:{docs:{description:{story:`A whole page: breadcrumbs in the header, a search and filter bar under it and a table in the body, each outlined and labelled so you can see where the section puts its slots. Scroll the table to see the header and the filter stay pinned; change any other prop live in the Controls panel below.`},source:{code:`<Section currentDeviceType={DeviceType.desktop} withBodyScroll settingsStudio={false}>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
  <Section.SectionFooter>{null}</Section.SectionFooter>
</Section>`}}}},P=({children:e,height:t=600})=>(0,_.jsx)(`div`,{style:{display:`flex`,width:`100%`,height:t},children:e}),F=(e,t)=>(n,r)=>r.viewMode===`docs`?(0,_.jsx)(`iframe`,{title:r.name,src:`iframe.html?viewMode=story&id=${r.id}`,style:{width:e,height:t,border:0}}):(0,_.jsx)(n,{}),I=()=>(0,_.jsx)(`div`,{children:O.map(e=>(0,_.jsxs)(`div`,{style:{padding:`12px 0`},children:[(0,_.jsx)(i,{fontWeight:600,children:e.name}),(0,_.jsx)(i,{fontSize:`12px`,children:e.type})]},e.name))}),L=[(0,_.jsx)(f.InfoPanelHeader,{children:(0,_.jsx)(`div`,{style:{padding:`20px`},children:(0,_.jsx)(i,{fontSize:`16px`,fontWeight:700,children:`Annual Report 2025.docx`})})},`info-header`),(0,_.jsx)(f.InfoPanelBody,{children:(0,_.jsx)(`div`,{style:{padding:`0 20px`},children:(0,_.jsx)(i,{children:`Document · 42 KB · modified yesterday`})})},`info-body`)],R=[{id:`op-1`,operation:`copy`,label:`Copying 3 items`,alert:!1,completed:!1,percent:40}],z={render:e=>(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})}),L]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,canDisplay:!0,isInfoPanelVisible:!0},parameters:{docs:{description:{story:"A details panel beside the listing, for the properties of the selected item without leaving the page. It shows only while both `canDisplay` and `isInfoPanelVisible` are on; switch either off in the Controls panel below to close it."},source:{code:`<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.InfoPanelHeader>
      <Text fontSize="16px" fontWeight={700}>Annual Report 2025.docx</Text>
    </Section.InfoPanelHeader>
    <Section.InfoPanelBody>
      <Text>Document · 42 KB · modified yesterday</Text>
    </Section.InfoPanelBody>
  </Section>
</div>`}}}},B=e=>{let[,t]=v();return(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,setChatPanelWidth:n=>{e.setChatPanelWidth?.(n),t({chatPanelWidth:n})},children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})}),(0,_.jsx)(f.ChatPanel,{children:(0,_.jsxs)(`div`,{style:{padding:`20px`},children:[(0,_.jsx)(i,{fontSize:`16px`,fontWeight:700,children:`Chat`}),(0,_.jsx)(i,{children:`Ask a question about the files on the left.`})]})})]})})},V={render:B,args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,isChatPanelAvailable:!0,isChatPanelVisible:!0,isChatPanelResizable:!0,chatPanelWidth:400},parameters:{docs:{description:{story:"A chat docked beside the listing, so a conversation about the files stays open while you work with them. Drag its inner edge to make it wider or narrower (`isChatPanelResizable`); the new width arrives when you release the mouse (`setChatPanelWidth`)."},source:{code:`const [width, setWidth] = useState(400);

<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    isChatPanelAvailable
    isChatPanelVisible
    isChatPanelResizable
    chatPanelWidth={width}
    setChatPanelWidth={setWidth}
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.ChatPanel>
      <ChatContent />
    </Section.ChatPanel>
  </Section>
</div>`}}}},H={render:e=>(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBanner,{children:(0,_.jsx)(`div`,{style:{padding:`12px 16px`,borderRadius:`6px`,backgroundColor:`rgba(66, 133, 244, 0.12)`},children:(0,_.jsx)(i,{children:`Scheduled maintenance tonight from 22:00 to 23:00.`})})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,scrollableBanner:!1},parameters:{docs:{description:{story:"A notice above the header that stays in view while the table scrolls (`Section.SectionBanner`). Switch `scrollableBanner` on in the Controls panel below to put it at the top of the listing instead, where it scrolls away under the header."},source:{code:`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBanner>
    <Text>Scheduled maintenance tonight from 22:00 to 23:00.</Text>
  </Section.SectionBanner>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`}}}},U=[{id:`all`,name:`All files`,content:null},{id:`recent`,name:`Recent`,content:null},{id:`favorites`,name:`Favorites`,content:null}],W={render:e=>(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionSubmenu,{children:(0,_.jsx)(c,{items:U,selectedItemId:`all`})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1},parameters:{docs:{description:{story:"Tabs under the header that switch between views of the same page and stay pinned with it while the listing scrolls (`Section.SectionSubmenu`)."},source:{code:`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionSubmenu>
    <Tabs items={tabs} selectedItemId="all" />
  </Section.SectionSubmenu>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`}}}},G={render:e=>(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,secondaryActiveOperations:R,secondaryOperationsCompleted:!1},parameters:{docs:{description:{story:"A round progress button in the bottom corner, so a long copy or upload stays visible while the user goes on working (`secondaryActiveOperations`). Hover it to read what is running; an empty list hides it again."},source:{code:`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  secondaryActiveOperations={[
    { id: "op-1", operation: "copy", label: "Copying 3 items", alert: false, completed: false, percent: 40 },
  ]}
  secondaryOperationsCompleted={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>`}}}},K=()=>[{key:`upload`,label:`Upload file`,onClick:y()},{key:`create`,label:`New folder`,onClick:y()}],q={render:e=>(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(I,{})})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,getContextModel:K},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`626px`},description:{story:"A menu of page-wide actions on a right click anywhere in the body, for what applies to the folder rather than to one file (`getContextModel`). Right click the list to open it."},source:{code:`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  getContextModel={() => [
    { key: "upload", label: "Upload file", onClick: onUpload },
    { key: "create", label: "New folder", onClick: onCreate },
  ]}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`}}}},J={render:e=>(0,_.jsx)(P,{height:640,children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{device:a.tablet})}),(0,_.jsx)(f.SectionFilter,{children:(0,_.jsx)(A,{device:a.tablet})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(I,{})})]})}),decorators:[F(834,680)],globals:{viewport:{value:`tablet`,isRotated:!1}},args:{currentDeviceType:a.tablet,withBodyScroll:!0,settingsStudio:!1},parameters:{noPadding:!0,docs:{description:{story:"The page in a tablet-width window: the header stays pinned, while the filter bar moves into the listing and scrolls with it, leaving more room for the rows (`currentDeviceType`)."},source:{code:`<Section
  currentDeviceType={DeviceType.tablet}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`}}}},Y={render:e=>(0,_.jsx)(P,{height:640,children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{device:a.mobile})}),(0,_.jsx)(f.SectionFilter,{children:(0,_.jsx)(A,{device:a.mobile})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(I,{})})]})}),decorators:[F(414,680)],globals:{viewport:{value:`mobile2`,isRotated:!1}},args:{currentDeviceType:a.mobile,withBodyScroll:!0,settingsStudio:!1},parameters:{noPadding:!0,docs:{description:{story:"The page on a phone: the header and the filter bar both move into the listing and the whole page scrolls, so the rows get the full height of the screen (`currentDeviceType`)."},source:{code:`<Section
  currentDeviceType={DeviceType.mobile}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>`}}}},X={render:e=>(0,_.jsx)(`div`,{dir:`rtl`,children:(0,_.jsx)(P,{children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})}),(0,_.jsx)(f.InfoPanelHeader,{children:(0,_.jsx)(`div`,{style:{padding:`20px`},children:(0,_.jsx)(i,{fontSize:`16px`,fontWeight:700,children:`تقرير سنوي`})})}),(0,_.jsx)(f.InfoPanelBody,{children:(0,_.jsx)(`div`,{style:{padding:`0 20px`},children:(0,_.jsx)(i,{children:`مستند`})})})]})})}),globals:{direction:`rtl`},args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,canDisplay:!0,isInfoPanelVisible:!0},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`626px`},description:{story:`The page in a right-to-left interface: the info panel opens on the left, its border moves to its right edge, and the table's columns run from the right.`},source:{code:`<div dir="rtl">
  <div style={{ display: "flex", height: 600 }}>
    <Section
      currentDeviceType={DeviceType.desktop}
      withBodyScroll
      settingsStudio={false}
      canDisplay
      isInfoPanelVisible
    >
      <Section.SectionHeader>
        <Navigation title="My Documents" />
      </Section.SectionHeader>
      <Section.SectionBody>
        <TableContent />
      </Section.SectionBody>
      <Section.InfoPanelHeader>
        <Text fontSize="16px" fontWeight={700}>تقرير سنوي</Text>
      </Section.InfoPanelHeader>
      <Section.InfoPanelBody>
        <Text>مستند</Text>
      </Section.InfoPanelBody>
    </Section>
  </div>
</div>`}}}},Z={render:e=>(0,_.jsx)(`div`,{style:{display:`flex`,width:`100%`,height:`600px`,"--section-bg":`#e6f3fb`,"--section-header-size":`56px`,"--section-footer-margin":`24px`,"--info-panel-background":`#f5fbff`,"--info-panel-border-color":`#0082c9`,"--info-panel-width":`300px`,"--chat-panel-background":`#fff8e6`,"--chat-panel-border-color":`#c98a00`,"--chat-panel-width":`300px`,"--chat-panel-drop-overlay-background":`#fff1cc`,"--chat-panel-drop-border-color":`#c98a00`,"--chat-panel-drop-inset-top":`72px`},children:(0,_.jsxs)(f,{...e,children:[(0,_.jsx)(f.SectionHeader,{children:(0,_.jsx)(k,{})}),(0,_.jsx)(f.SectionFilter,{children:(0,_.jsx)(A,{})}),(0,_.jsx)(f.SectionBody,{children:(0,_.jsx)(j,{})}),L,(0,_.jsx)(f.ChatPanel,{children:(0,_.jsx)(`div`,{style:{padding:`20px`},children:(0,_.jsx)(i,{fontSize:`16px`,fontWeight:700,children:`Chat`})})}),(0,_.jsx)(f.SectionFooter,{children:null})]})}),args:{currentDeviceType:a.desktop,withBodyScroll:!0,settingsStudio:!1,isInfoPanelAvailable:!0,canDisplay:!0,isInfoPanelVisible:!0,isChatPanelAvailable:!0,isChatPanelVisible:!0,chatPanelDropTargetLabel:`Drop here to attach`},parameters:{docs:{description:{story:`The variables are listed under CSS variables on this page. The example sets every desktop one on a wrapper around one section with both panels open: the blue strip is the pinned header, the pale blue column is the info panel and the yellow one is the chat panel, with its drop frame on. Navigation, Filter and the table have variables of their own, documented in their stories and set on the same wrapper.`},source:{code:`<div
  style={{
    display: "flex",
    height: 600,
    "--section-bg": "#e6f3fb",
    "--section-header-size": "56px",
    "--section-footer-margin": "24px",
    "--info-panel-background": "#f5fbff",
    "--info-panel-border-color": "#0082c9",
    "--info-panel-width": "300px",
    "--chat-panel-background": "#fff8e6",
    "--chat-panel-border-color": "#c98a00",
    "--chat-panel-width": "300px",
    "--chat-panel-drop-overlay-background": "#fff1cc",
    "--chat-panel-drop-border-color": "#c98a00",
    "--chat-panel-drop-inset-top": "72px",
  }}
>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
    isChatPanelAvailable
    isChatPanelVisible
    chatPanelDropTargetLabel="Drop here to attach"
  >
    {/* header, filter, body, info panel and chat panel slots */}
  </Section>
</div>`}}}},Q=[`Default`,`WithInfoPanel`,`WithChatPanel`,`WithBanner`,`WithSubmenu`,`WithOperationsProgress`,`WithContextMenu`,`OnTablet`,`OnPhone`,`RightToLeft`,`CssCustomization`],N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "100%",
    height: "600px"
  }}>
      <Section {...args}>
        <Section.SectionHeader>
          <div style={{
          paddingBottom: "12px",
          border: "2px dashed #2196F3",
          borderRadius: "4px",
          position: "relative",
          background: "white",
          zIndex: 202
        }}>
            <span style={{
            ...sectionLabelStyle,
            color: "#2196F3",
            backgroundColor: "#E3F2FD"
          }}>
              Header
            </span>
            <NavigationHeader />
          </div>
        </Section.SectionHeader>
        <Section.SectionFilter>
          <div style={{
          padding: "8px 0",
          border: "2px dashed #FF9800",
          borderRadius: "4px",
          position: "relative",
          background: "white",
          zIndex: 202
        }}>
            <span style={{
            ...sectionLabelStyle,
            color: "#FF9800",
            backgroundColor: "#FFF3E0"
          }}>
              Filter
            </span>
            <FilterContent />
          </div>
        </Section.SectionFilter>
        <Section.SectionBody>
          <div style={{
          marginLeft: "-20px",
          marginTop: "8px",
          border: "2px dashed #4CAF50",
          borderRadius: "4px",
          position: "relative"
        }}>
            <span style={{
            ...sectionLabelStyle,
            color: "#4CAF50",
            backgroundColor: "#E8F5E9"
          }}>
              Body
            </span>
            <TableContent />
          </div>
        </Section.SectionBody>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isInfoPanelAvailable: false
  },
  parameters: {
    docs: {
      description: {
        story: "A whole page: breadcrumbs in the header, a search and filter bar under it and a table in the body, each outlined and labelled so you can see where the section puts its slots. Scroll the table to see the header and the filter stay pinned; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Section currentDeviceType={DeviceType.desktop} withBodyScroll settingsStudio={false}>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
  <Section.SectionFooter>{null}</Section.SectionFooter>
</Section>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        {infoPanelSlots}
      </Section>
    </PageFrame>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    canDisplay: true,
    isInfoPanelVisible: true
  },
  parameters: {
    docs: {
      description: {
        story: "A details panel beside the listing, for the properties of the selected item without leaving the page. It shows only while both \`canDisplay\` and \`isInfoPanelVisible\` are on; switch either off in the Controls panel below to close it."
      },
      source: {
        code: \`<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.InfoPanelHeader>
      <Text fontSize="16px" fontWeight={700}>Annual Report 2025.docx</Text>
    </Section.InfoPanelHeader>
    <Section.InfoPanelBody>
      <Text>Document · 42 KB · modified yesterday</Text>
    </Section.InfoPanelBody>
  </Section>
</div>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: renderChatPanel,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isChatPanelAvailable: true,
    isChatPanelVisible: true,
    isChatPanelResizable: true,
    chatPanelWidth: 400
  },
  parameters: {
    docs: {
      description: {
        story: "A chat docked beside the listing, so a conversation about the files stays open while you work with them. Drag its inner edge to make it wider or narrower (\`isChatPanelResizable\`); the new width arrives when you release the mouse (\`setChatPanelWidth\`)."
      },
      source: {
        code: \`const [width, setWidth] = useState(400);

<div style={{ display: "flex", height: 600 }}>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    isChatPanelAvailable
    isChatPanelVisible
    isChatPanelResizable
    chatPanelWidth={width}
    setChatPanelWidth={setWidth}
  >
    <Section.SectionHeader>
      <Navigation title="My Documents" />
    </Section.SectionHeader>
    <Section.SectionBody>
      <TableContent />
    </Section.SectionBody>
    <Section.ChatPanel>
      <ChatContent />
    </Section.ChatPanel>
  </Section>
</div>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBanner>
          <div style={{
          padding: "12px 16px",
          borderRadius: "6px",
          backgroundColor: "rgba(66, 133, 244, 0.12)"
        }}>
            <Text>Scheduled maintenance tonight from 22:00 to 23:00.</Text>
          </div>
        </Section.SectionBanner>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    scrollableBanner: false
  },
  parameters: {
    docs: {
      description: {
        story: "A notice above the header that stays in view while the table scrolls (\`Section.SectionBanner\`). Switch \`scrollableBanner\` on in the Controls panel below to put it at the top of the listing instead, where it scrolls away under the header."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBanner>
    <Text>Scheduled maintenance tonight from 22:00 to 23:00.</Text>
  </Section.SectionBanner>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionSubmenu>
          <Tabs items={submenuItems} selectedItemId="all" />
        </Section.SectionSubmenu>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false
  },
  parameters: {
    docs: {
      description: {
        story: "Tabs under the header that switch between views of the same page and stay pinned with it while the listing scrolls (\`Section.SectionSubmenu\`)."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionSubmenu>
    <Tabs items={tabs} selectedItemId="all" />
  </Section.SectionSubmenu>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    secondaryActiveOperations: runningOperation,
    secondaryOperationsCompleted: false
  },
  parameters: {
    docs: {
      description: {
        story: "A round progress button in the bottom corner, so a long copy or upload stays visible while the user goes on working (\`secondaryActiveOperations\`). Hover it to read what is running; an empty list hides it again."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  secondaryActiveOperations={[
    { id: "op-1", operation: "copy", label: "Copying 3 items", alert: false, completed: false, percent: 40 },
  ]}
  secondaryOperationsCompleted={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    getContextModel: getBodyContextModel
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because the menu listens for right clicks on the whole document.
      story: {
        inline: false,
        height: "626px"
      },
      description: {
        story: "A menu of page-wide actions on a right click anywhere in the body, for what applies to the folder rather than to one file (\`getContextModel\`). Right click the list to open it."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.desktop}
  withBodyScroll
  settingsStudio={false}
  getContextModel={() => [
    { key: "upload", label: "Upload file", onClick: onUpload },
    { key: "create", label: "New folder", onClick: onCreate },
  ]}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame height={640}>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader device={DeviceType.tablet} />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent device={DeviceType.tablet} />
        </Section.SectionFilter>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  decorators: [withFrame(834, 680)],
  globals: {
    viewport: {
      value: "tablet",
      isRotated: false
    }
  },
  args: {
    currentDeviceType: DeviceType.tablet,
    withBodyScroll: true,
    settingsStudio: false
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "The page in a tablet-width window: the header stays pinned, while the filter bar moves into the listing and scrolls with it, leaving more room for the rows (\`currentDeviceType\`)."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.tablet}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <PageFrame height={640}>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader device={DeviceType.mobile} />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent device={DeviceType.mobile} />
        </Section.SectionFilter>
        <Section.SectionBody>
          <ListContent />
        </Section.SectionBody>
      </Section>
    </PageFrame>,
  decorators: [withFrame(414, 680)],
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  },
  args: {
    currentDeviceType: DeviceType.mobile,
    withBodyScroll: true,
    settingsStudio: false
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "The page on a phone: the header and the filter bar both move into the listing and the whole page scrolls, so the rows get the full height of the screen (\`currentDeviceType\`)."
      },
      source: {
        code: \`<Section
  currentDeviceType={DeviceType.mobile}
  withBodyScroll
  settingsStudio={false}
>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <RowList />
  </Section.SectionBody>
</Section>\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <PageFrame>
        <Section {...args}>
          <Section.SectionHeader>
            <NavigationHeader />
          </Section.SectionHeader>
          <Section.SectionBody>
            <TableContent />
          </Section.SectionBody>
          <Section.InfoPanelHeader>
            <div style={{
            padding: "20px"
          }}>
              <Text fontSize="16px" fontWeight={700}>
                تقرير سنوي
              </Text>
            </div>
          </Section.InfoPanelHeader>
          <Section.InfoPanelBody>
            <div style={{
            padding: "0 20px"
          }}>
              <Text>مستند</Text>
            </div>
          </Section.InfoPanelBody>
        </Section>
      </PageFrame>
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    canDisplay: true,
    isInfoPanelVisible: true
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "626px"
      },
      description: {
        story: "The page in a right-to-left interface: the info panel opens on the left, its border moves to its right edge, and the table's columns run from the right."
      },
      source: {
        code: \`<div dir="rtl">
  <div style={{ display: "flex", height: 600 }}>
    <Section
      currentDeviceType={DeviceType.desktop}
      withBodyScroll
      settingsStudio={false}
      canDisplay
      isInfoPanelVisible
    >
      <Section.SectionHeader>
        <Navigation title="My Documents" />
      </Section.SectionHeader>
      <Section.SectionBody>
        <TableContent />
      </Section.SectionBody>
      <Section.InfoPanelHeader>
        <Text fontSize="16px" fontWeight={700}>تقرير سنوي</Text>
      </Section.InfoPanelHeader>
      <Section.InfoPanelBody>
        <Text>مستند</Text>
      </Section.InfoPanelBody>
    </Section>
  </div>
</div>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    width: "100%",
    height: "600px",
    // === Section — pinned header strip ===
    "--section-bg": "#e6f3fb",
    "--section-header-size": "56px",
    "--section-footer-margin": "24px",
    // === Info panel ===
    "--info-panel-background": "#f5fbff",
    "--info-panel-border-color": "#0082c9",
    "--info-panel-width": "300px",
    // === Chat panel ===
    "--chat-panel-background": "#fff8e6",
    "--chat-panel-border-color": "#c98a00",
    "--chat-panel-width": "300px",
    "--chat-panel-drop-overlay-background": "#fff1cc",
    "--chat-panel-drop-border-color": "#c98a00",
    "--chat-panel-drop-inset-top": "72px"
  } as React.CSSProperties}>
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent />
        </Section.SectionFilter>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        {infoPanelSlots}
        <Section.ChatPanel>
          <div style={{
          padding: "20px"
        }}>
            <Text fontSize="16px" fontWeight={700}>
              Chat
            </Text>
          </div>
        </Section.ChatPanel>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>,
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    settingsStudio: false,
    isInfoPanelAvailable: true,
    canDisplay: true,
    isInfoPanelVisible: true,
    isChatPanelAvailable: true,
    isChatPanelVisible: true,
    chatPanelDropTargetLabel: "Drop here to attach"
  },
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The example sets every desktop one on a wrapper around one section with both panels open: the blue strip is the pinned header, the pale blue column is the info panel and the yellow one is the chat panel, with its drop frame on. Navigation, Filter and the table have variables of their own, documented in their stories and set on the same wrapper.\`
      },
      source: {
        code: \`<div
  style={{
    display: "flex",
    height: 600,
    "--section-bg": "#e6f3fb",
    "--section-header-size": "56px",
    "--section-footer-margin": "24px",
    "--info-panel-background": "#f5fbff",
    "--info-panel-border-color": "#0082c9",
    "--info-panel-width": "300px",
    "--chat-panel-background": "#fff8e6",
    "--chat-panel-border-color": "#c98a00",
    "--chat-panel-width": "300px",
    "--chat-panel-drop-overlay-background": "#fff1cc",
    "--chat-panel-drop-border-color": "#c98a00",
    "--chat-panel-drop-inset-top": "72px",
  }}
>
  <Section
    currentDeviceType={DeviceType.desktop}
    withBodyScroll
    settingsStudio={false}
    canDisplay
    isInfoPanelVisible
    isChatPanelAvailable
    isChatPanelVisible
    chatPanelDropTargetLabel="Drop here to attach"
  >
    {/* header, filter, body, info panel and chat panel slots */}
  </Section>
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Z as CssCustomization,N as Default,Y as OnPhone,J as OnTablet,X as RightToLeft,H as WithBanner,V as WithChatPanel,q as WithContextMenu,z as WithInfoPanel,G as WithOperationsProgress,W as WithSubmenu,Q as __namedExportsOrder,b as default};