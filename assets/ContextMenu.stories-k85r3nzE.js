import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./globalColors-fkBUxSeV.js";import{n as a,t as o}from"./ContextMenu-ClXuntb8.js";import{n as s,t as c}from"./catalog.folder.react-VUpu0ofJ.js";import{n as l,t as u}from"./catalog.folder.react-BLNaFnHq.js";import{n as d,t as f}from"./default_user_photo_size_82-82-BZq-hL9W.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{p=t(),d(),l(),s(),r(),a(),m=n(),h={title:`UI/Overlays/ContextMenu`,component:o,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=52-2358&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{model:{control:!1,description:"The items — actions, separators and submenus — read each time the menu opens; `getContextModel` replaces them when it is given"},getContextModel:{control:!1,description:`Builds the items on every open instead of the static model`},className:{control:`text`,description:`Additional CSS class on the menu element`},withBackdrop:{control:`boolean`,description:`Dims the page behind the open menu while it is a bottom sheet (viewports up to 600px), or on any viewport together with ignoreChangeView`,table:{defaultValue:{summary:`false`}}},header:{control:!1,description:`Mobile-only header above the items: a title with an optional visual — the title's initials on a color, an icon, an avatar, a logo or a cover image`},headerOnlyMobile:{control:`boolean`,description:`Mobile header only: shows the header for an opened submenu (its label and a back button) even when no header is passed`},withoutBackHeaderButton:{control:`boolean`,description:`Mobile header only: removes the back button of an opened submenu and the icon block of the root header`},isRoom:{control:`boolean`,description:`Mobile header only: a 32px icon block instead of the default size`},isArchive:{control:`boolean`,description:`Mobile header only: draws the header icon in its archived state`},badgeUrl:{control:!1,description:`Mobile header only: badge icon on the header's icon block`},badgeIconColor:{control:!1,description:`Mobile header only: color of that badge icon`},ignoreChangeView:{control:`boolean`,description:`Opens the menu as a bottom sheet on a narrow viewport whatever its height, and shows the backdrop on any viewport`,table:{defaultValue:{summary:`false`}}},showDisabledItems:{control:`boolean`,description:`Keeps disabled items in the list instead of dropping them`,table:{defaultValue:{summary:`false`}}},withHotkeys:{control:`boolean`,description:`Keyboard navigation with the arrows, Enter and Escape`,table:{defaultValue:{summary:`true`}}},fillIcon:{control:`boolean`,description:`Fills item icons with the theme text color`,table:{defaultValue:{summary:`true`}}},maxHeight:{control:`number`,description:`Maximum height of the root list in px; the rest scrolls`},maxHeightLowerSubmenu:{control:`number`,description:`Maximum height of a submenu in px; the rest of its items scroll`},containerRef:{control:!1,description:`Element the menu opens under, at its left edge and 4px below it, instead of at the pointer`},scaled:{control:`boolean`,description:"Meant to make the menu as wide as the element in `containerRef`; today the menu keeps the width of its longest item",table:{defaultValue:{summary:`false`}}},leftOffset:{control:`number`,description:"Moves a menu opened under `containerRef` this many pixels to the left"},rightOffset:{control:`number`,description:`Moves that menu further to the left by this many pixels; both offsets add up`},appendTo:{control:!1,description:`Element the menu is rendered into, instead of the end of the page body`},autoZIndex:{control:`boolean`,description:`Puts each opened menu above everything opened before it, so it is never hidden behind another overlay`,table:{defaultValue:{summary:`true`}}},baseZIndex:{control:`number`,description:`Stacking level the menu and its backdrop start from, for a page whose own overlays sit higher`,table:{defaultValue:{summary:`0`}}},style:{control:`object`,description:`Inline styles of the menu element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the menu wrapper",table:{defaultValue:{summary:`context-menu`}}},ref:{control:!1,description:"Handle the menu is opened through: `show(event)`, `hide(event)` and `toggle(event)`; there is no visibility prop"},global:{control:`boolean`,description:`Opens on right-click anywhere in the document instead of through the ref`,table:{defaultValue:{summary:`false`}}},id:{control:`text`,description:`ID attribute for the component`},onHide:{action:`onHide`,description:`Callback when menu is hidden`},onShow:{action:`onShow`,description:`Callback when the menu opens`}}},g=[{key:0,label:`Edit`,icon:c},{key:1,label:`Preview`,icon:c},{key:2,isSeparator:!0,disabled:!1},{key:3,label:`Sharing settings`,icon:c},{key:4,label:`Copy internal link`,icon:c},{key:5,label:`Copy external link`,icon:c},{key:6,label:`Send by e-mail`,icon:c},{key:7,label:`Version history`,icon:c,items:[{key:8,label:`Show version history`},{key:9,label:`Finalize version`},{key:10,label:`Unblock / Check-in`}]},{key:11,isSeparator:!0,disabled:!1},{key:12,label:`Add to favorites`,icon:c},{key:13,label:`Download`,icon:c},{key:14,label:`Download as`,icon:c},{key:15,label:`Move or copy`,icon:c,items:[{key:16,label:`Move to`},{key:17,label:`Copy`},{key:18,label:`Duplicate`}]},{key:19,label:`Rename`,icon:c,disabled:!0},{key:20,isSeparator:!0,disabled:!1},{key:21,label:`Quit`,icon:c}],_=e=>{let t=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{children:[(0,m.jsx)(o,{...e,ref:t}),(0,m.jsx)(`button`,{type:`button`,"data-testid":`trigger`,style:{width:`200px`,height:`200px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,fontSize:`18px`,border:`none`,cursor:`context-menu`},onContextMenu:e=>{t.current?.show(e)},children:`Right click on me`})]})},v={render:e=>(0,m.jsx)(_,{...e}),args:{model:g,showDisabledItems:!0},parameters:{docs:{description:{story:"Full-featured context menu with icons, separators, nested submenus and a disabled item. Disabled items are dropped from the list by default; `showDisabledItems` keeps them greyed out. Right-click the colored area to open."},source:{code:`const cm = useRef<ContextMenuRefType>(null);

<ContextMenu ref={cm} model={menuItems} showDisabledItems />
<div onContextMenu={(e) => cm.current?.show(e)}>
  Right click on me
</div>`}}}},y=()=>{let e=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{children:[(0,m.jsx)(o,{ref:e,model:[{key:0,label:`Cut`,icon:c},{key:1,label:`Copy`,icon:c},{key:2,label:`Paste`,icon:c},{key:3,isSeparator:!0,disabled:!1},{key:4,label:`Delete`,icon:c}]}),(0,m.jsx)(`button`,{type:`button`,style:{width:`200px`,height:`200px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,fontSize:`18px`,border:`none`,cursor:`context-menu`},onContextMenu:t=>{e.current?.show(t)},children:`Right click on me`})]})},b={render:()=>(0,m.jsx)(y,{}),parameters:{docs:{description:{story:"A flat list of actions with one separator and no submenus — the shape most row and card menus need, with nothing but `ref` and `model` set. Right-click the colored area to open."},source:{code:`<ContextMenu
  ref={cm}
  model={[
    { key: 0, label: "Cut", icon: FolderIcon },
    { key: 1, label: "Copy", icon: FolderIcon },
    { key: 2, label: "Paste", icon: FolderIcon },
    { key: 3, isSeparator: true },
    { key: 4, label: "Delete", icon: FolderIcon },
  ]}
/>`}}}},x=()=>{let e=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{children:[(0,m.jsx)(o,{ref:e,model:[{key:0,label:`Option 1`,icon:c},{key:1,label:`Option 2`,icon:c},{key:2,label:`Option 3`,icon:c}],withBackdrop:!0,ignoreChangeView:!0}),(0,m.jsx)(`button`,{type:`button`,style:{width:`200px`,height:`200px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,fontSize:`18px`,border:`none`,cursor:`context-menu`},onContextMenu:t=>{e.current?.show(t)},children:`Right click on me`})]})},S={render:()=>(0,m.jsx)(x,{}),parameters:{docs:{description:{story:"Context menu with a backdrop overlay. `withBackdrop` shows the backdrop only while the menu is a bottom sheet (viewports up to 600px), so on a desktop viewport it also needs `ignoreChangeView`, which this story passes. The mobile stories below set both props too, so the sheet and its backdrop appear however short the menu is."},source:{code:`<ContextMenu ref={cm} model={items} withBackdrop ignoreChangeView />`}}}},C=[{key:`link`,label:`Anyone with the link`,icon:c,description:`Everyone who has the link can open the file, no sign-in needed.`},{key:`workspace`,label:`People in the workspace`,icon:c,description:`Only signed-in members of the workspace can open it.`},{key:`invited`,label:`Invited people only`,icon:c,description:`Only the people you invite by e-mail get access.`}],w={render:e=>(0,m.jsx)(_,{...e}),args:{model:C},parameters:{docs:{description:{story:"Items carrying `description` are laid out as two lines: the label row and an always-visible description under it. The menu grows to the width of its longest description."},source:{code:`<ContextMenu
  ref={cm}
  model={[
    {
      key: "link",
      label: "Anyone with the link",
      icon: FolderIcon,
      description:
        "Everyone who has the link can open the file, no sign-in needed.",
    },
    {
      key: "invited",
      label: "Invited people only",
      icon: FolderIcon,
      description: "Only the people you invite by e-mail get access.",
    },
  ]}
/>`}}}},T=()=>{let[e,t]=(0,p.useState)(!0),[n,r]=(0,p.useState)(!1);return(0,m.jsx)(_,{model:[{key:`notifications`,label:`Notifications`,withToggle:!0,checked:e,onClick:()=>t(e=>!e)},{key:`auto-save`,label:`Auto-save`,withToggle:!0,checked:n,onClick:()=>r(e=>!e),disabled:!0,disabledStylesType:`toggle`,tooltipTarget:`toggle`,getTooltipContent:()=>`Available on the paid plan`},{key:`sep-1`,isSeparator:!0},{key:`share`,label:`Share with people`,iconNode:(0,m.jsx)(u,{})},{key:`mcp`,label:`Ask the MCP server`,withMCPIcon:!0},{key:`sep-2`,isSeparator:!0},{key:`export`,label:`Export to PDF`,icon:c,badgeLabel:`New`},{key:`history`,label:`Version history`,icon:c,badgeLabel:`Paid`,isPaidBadge:!0},{key:`help`,label:`Help Center`,url:`https://example.com/help`,target:`_blank`,isOutsideLink:!0},{key:`sep-3`,isSeparator:!0},{key:`delete`,label:`Delete`,icon:c,disabled:!0,getTooltipContent:()=>`Files shared with you can't be deleted`}],showDisabledItems:!0})},E={render:()=>(0,m.jsx)(T,{}),parameters:{docs:{description:{story:'Every kind of item the model supports, in one menu. From top to bottom:\n\n- **Notifications** — a switch inside the item (`withToggle`, `checked`). Clicking it flips the switch and keeps the menu open.\n- **Auto-save** — the same switch, disabled. The label keeps its color and only the switch is greyed (`disabledStylesType: "toggle"`); hover the switch to read why it is off (`getTooltipContent` anchored with `tooltipTarget: "toggle"`).\n- **Share with people** — the icon is a React element (`iconNode`) instead of an image URL.\n- **Ask the MCP server** — the MCP server icon (`withMCPIcon`): the server logo when `icon` is given, the first letter of the label otherwise.\n- **Export to PDF** — a text badge after the label (`badgeLabel`).\n- **Version history** — the same badge in the paid-feature color (`badgeLabel` + `isPaidBadge`).\n- **Help Center** — an external link that opens in a new tab (`url`, `target`); `isOutsideLink` adds the arrow.\n- **Delete** — a disabled item. It stays in the list only because of `showDisabledItems`; hover it to read the reason (`getTooltipContent`).'},source:{code:`<ContextMenu
  ref={cm}
  showDisabledItems
  model={[
    { key: "notifications", label: "Notifications", withToggle: true, checked, onClick: toggle },
    {
      key: "auto-save",
      label: "Auto-save",
      withToggle: true,
      disabled: true,
      disabledStylesType: "toggle",
      tooltipTarget: "toggle",
      getTooltipContent: () => "Available on the paid plan",
    },
    { key: "share", label: "Share with people", iconNode: <CatalogFolderIcon /> },
    { key: "mcp", label: "Ask the MCP server", withMCPIcon: true },
    { key: "export", label: "Export to PDF", icon: FolderIcon, badgeLabel: "New" },
    { key: "history", label: "Version history", icon: FolderIcon, badgeLabel: "Paid", isPaidBadge: true },
    { key: "help", label: "Help Center", url: "https://example.com/help", target: "_blank", isOutsideLink: true },
    { key: "delete", label: "Delete", icon: FolderIcon, disabled: true, getTooltipContent: () => "..." },
  ]}
/>`}}}},D=()=>{let[e,t]=(0,p.useState)(!1);return(0,m.jsx)(_,{model:[],getContextModel:()=>[{key:`built`,label:`Model built at ${new Date().toLocaleTimeString()}`,icon:c},{key:`sep`,isSeparator:!0},{key:`favorite`,label:e?`Remove from favorites`:`Add to favorites`,icon:c,onClick:()=>t(e=>!e)}]})},O={render:()=>(0,m.jsx)(D,{}),parameters:{docs:{description:{story:"`getContextModel` replaces a static `model`: the getter runs each time the menu opens, so the first item shows the time of that open and the favorite item reads the state changed by its own click. Leading and trailing separators in the result are trimmed."},source:{code:`<ContextMenu
  ref={cm}
  model={[]}
  getContextModel={() => [
    { key: "built", label: \`Model built at \${new Date().toLocaleTimeString()}\` },
    { key: "sep", isSeparator: true },
    {
      key: "favorite",
      label: isFavorite ? "Remove from favorites" : "Add to favorites",
      onClick: toggleFavorite,
    },
  ]}
/>`}}}},k=[{key:0,label:`Cut`,icon:c},{key:1,label:`Copy`,icon:c},{key:2,label:`Paste`,icon:c},{key:3,isSeparator:!0,disabled:!1},{key:4,label:`Delete`,icon:c}],A=e=>(0,m.jsxs)(`div`,{style:{height:`300px`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`24px`,border:`2px dashed ${i.lightSecondMain}`,borderRadius:`6px`,fontSize:`18px`},children:[(0,m.jsx)(o,{...e}),(0,m.jsx)(`div`,{"data-testid":`trigger`,style:{width:`200px`,height:`200px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,cursor:`context-menu`},children:`Right click on me…`}),(0,m.jsx)(`span`,{children:`…or anywhere around: the whole page listens`})]}),j={render:e=>(0,m.jsx)(A,{...e}),args:{model:k,global:!0},parameters:{docs:{story:{inline:!1,iframeHeight:340},description:{story:"The blue square has no handler of its own and nothing calls `show`: with `global` the menu attaches itself to the whole document, so a right-click on the square and one on the empty space around it open the same menu. Use it for a page-level menu that is not tied to one element."},source:{code:`<ContextMenu model={items} global />`}}}},M=Array.from({length:12},(e,t)=>({key:`folder-${t+1}`,label:`Folder ${t+1}`})),N=[{key:`move`,label:`Move to`,icon:c,items:M},...Array.from({length:15},(e,t)=>({key:`option-${t+1}`,label:`Option ${t+1}`,icon:c}))],P={render:e=>(0,m.jsx)(_,{...e}),args:{model:N,maxHeight:240,maxHeightLowerSubmenu:160},parameters:{docs:{description:{story:"The model has sixteen items, but the menu is only 240px tall — about six and a half rows — and the rest scrolls inside it (`maxHeight`). Hover **Move to**: its submenu has twelve folders and is limited the same way, to 160px (`maxHeightLowerSubmenu`)."},source:{code:`<ContextMenu
  ref={cm}
  model={[{ key: "move", label: "Move to", items: twelveFolders }, ...fifteenOptions]}
  maxHeight={240}
  maxHeightLowerSubmenu={160}
/>`}}}},F={width:`100%`,height:`56px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,fontSize:`16px`,border:`none`,cursor:`pointer`},I=e=>{let t=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{children:[(0,m.jsx)(o,{...e,ref:t}),(0,m.jsx)(`button`,{type:`button`,"data-testid":`trigger`,style:F,onClick:e=>{t.current?.show(e)},children:`Tap to open the menu`})]})},L={viewport:{value:`mobile1`,isRotated:!1}},R=(e,t)=>t.viewMode===`docs`?(0,m.jsx)(`iframe`,{title:t.name,src:`iframe.html?viewMode=story&id=${t.id}`,style:{width:320,height:568,border:0}}):(0,m.jsx)(e,{}),z={title:`Contracts 2026`,icon:c,color:`5C6EFF`,original:``,large:``,medium:``,small:``},B=[{key:`edit`,label:`Edit room`,icon:c},{key:`invite`,label:`Invite users`,icon:c},{key:`copy-link`,label:`Copy shared link`,icon:c},{key:`move`,label:`Move or copy`,icon:c,items:[{key:`move-to`,label:`Move to`},{key:`copy`,label:`Copy`},{key:`duplicate`,label:`Duplicate`}]},{key:`download`,label:`Download`,icon:c},{key:`sep`,isSeparator:!0},{key:`archive`,label:`Move to archive`,icon:c}],V={globals:L,decorators:[R],render:e=>(0,m.jsx)(I,{...e}),args:{model:B,header:z,isRoom:!0,withBackdrop:!0,ignoreChangeView:!0},parameters:{docs:{description:{story:"Shown at 320px, where the menu is a bottom sheet with the `header` on top: the title and, in the 32px block that `isRoom` gives it, the title's initials on the header `color` (the block renders only when `icon` is set; `color` then replaces the icon). Tap **Move or copy**: the submenu replaces the list in place and the header turns into a back button. `ignoreChangeView` forces the sheet layout regardless of the menu height."},source:{code:`<ContextMenu
  ref={cm}
  model={roomItems}
  header={{ title: "Contracts 2026", icon: FolderIcon, color: "5C6EFF", original: "", large: "", medium: "", small: "" }}
  isRoom
  withBackdrop
  ignoreChangeView
/>`}}}},H={title:`Team member`,avatar:f,original:``,large:``,medium:``,small:``},U=[{key:`profile`,label:`Open profile`,icon:c},{key:`message`,label:`Send message`,icon:c},{key:`sep`,isSeparator:!0},{key:`remove`,label:`Remove from room`,icon:c}],W={globals:L,decorators:[R],render:e=>(0,m.jsx)(I,{...e}),args:{model:U,header:H,withBackdrop:!0,ignoreChangeView:!0},parameters:{docs:{description:{story:"The same bottom sheet with a person as the subject: `header.avatar` renders an avatar instead of the initials block."},source:{code:`<ContextMenu
  ref={cm}
  model={userItems}
  header={{ title: user.displayName, avatar: user.avatarSmall, original: "", large: "", medium: "", small: "" }}
  withBackdrop
  ignoreChangeView
/>`}}}},G=e=>{let t=(0,p.useRef)(null),n=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{style:{height:`280px`},children:[(0,m.jsx)(`div`,{ref:n,style:{width:`240px`},children:(0,m.jsx)(`button`,{type:`button`,"data-testid":`trigger`,style:{width:`100%`,height:`40px`,backgroundColor:i.lightSecondMain,color:i.white,fontSize:`15px`,border:`none`,cursor:`pointer`},onClick:e=>t.current?.show(e),children:`Actions`})}),(0,m.jsx)(o,{...e,ref:t,containerRef:n})]})},K={render:e=>(0,m.jsx)(G,{...e}),args:{model:[{key:0,label:`Rename`,icon:c},{key:1,label:`Duplicate`,icon:c},{key:2,label:`Download`,icon:c},{key:3,isSeparator:!0},{key:4,label:`Delete`,icon:c}]},parameters:{docs:{description:{story:"Click **Actions**: the menu opens under the button, at its left edge, wherever the pointer was (`containerRef`). Use it for a menu that belongs to a toolbar button or a row's action button rather than to a right-click. `leftOffset` and `rightOffset` move it left from that edge; change them live in the Controls panel below."},source:{code:`const anchorRef = useRef<HTMLDivElement>(null);

<div ref={anchorRef}>
  <button onClick={(e) => cm.current?.show(e)}>Actions</button>
</div>
<ContextMenu ref={cm} model={items} containerRef={anchorRef} />`}}}},q=e=>{let t=(0,p.useRef)(null),[n,r]=(0,p.useState)(null);return(0,m.jsxs)(`div`,{dir:`rtl`,ref:r,style:{height:`300px`},children:[n?(0,m.jsx)(o,{...e,ref:t,appendTo:n}):null,(0,m.jsx)(`button`,{type:`button`,"data-testid":`trigger`,style:{width:`200px`,height:`200px`,marginInlineStart:`260px`,backgroundColor:i.lightSecondMain,color:i.white,fontSize:`18px`,border:`none`,cursor:`context-menu`},onContextMenu:e=>t.current?.show(e),children:`انقر بزر الفأرة الأيمن`})]})},J={render:e=>(0,m.jsx)(q,{...e}),globals:{direction:`rtl`},args:{model:[{key:0,label:`تحرير`,icon:c},{key:1,label:`نسخ`,icon:c},{key:2,label:`نقل إلى`,icon:c,items:[{key:3,label:`المستندات`},{key:4,label:`الأرشيف`}]},{key:5,isSeparator:!0},{key:6,label:`حذف`,icon:c}]},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`326px`},description:{story:"The menu in a right-to-left interface: it opens to the left of the pointer, the icons sit on the right of the labels, and the third item's submenu opens to the left with its arrow pointing left. The menu renders into the right-to-left container (`appendTo`), because on its own it goes to the end of the page body, outside any `dir` wrapper."},source:{code:`<div dir="rtl" ref={setContainer}>
  <ContextMenu ref={cm} model={items} appendTo={container} />
  <div onContextMenu={(e) => cm.current?.show(e)}>انقر بزر الفأرة الأيمن</div>
</div>`}}}},Y=()=>{let e=(0,p.useRef)(null);return(0,m.jsxs)(`div`,{style:{height:`320px`},children:[(0,m.jsx)(o,{ref:e,model:[{key:0,label:`Cut`,icon:c},{key:1,label:`Copy`,icon:c},{key:2,label:`Paste`,icon:c},{key:3,label:`Rename`,icon:c,disabled:!0},{key:4,isSeparator:!0,disabled:!1},{key:5,label:`Delete`,icon:c,description:`Moves the selection to the trash`}],showDisabledItems:!0,style:{"--context-menu-radius":`12px`,"--context-menu-bg":`#1e1b4b`,"--context-menu-border-style":`1px solid #4338ca`,"--context-menu-shadow":`0 12px 24px rgba(30, 27, 75, 0.45)`,"--context-menu-text":`#e0e7ff`,"--context-menu-item-hover-bg":`rgba(255,255,255,0.1)`,"--context-menu-item-disabled-text":`#6366f1`,"--context-menu-item-disabled-bg":`#312e81`,"--context-menu-active-item-bg":`rgba(255,255,255,0.2)`,"--context-menu-header-border-style":`1px solid #4338ca`,"--context-menu-menu-item-padding":`0 20px`,"--context-menu-divider-margin":`6px 20px`,"--context-menu-item-text-size":`14px`,"--context-menu-item-text-weight":`400`,"--context-menu-item-with-description-padding":`8px 20px`,"--context-menu-item-description-width":`220px`,"--context-menu-item-description":`#a5b4fc`}}),(0,m.jsx)(`button`,{type:`button`,"data-testid":`trigger`,style:{width:`200px`,height:`100px`,backgroundColor:i.lightSecondMain,display:`flex`,justifyContent:`center`,alignItems:`center`,color:i.white,border:`none`,cursor:`context-menu`},onContextMenu:t=>e.current?.show(t),children:`Right click to open`})]})},X={render:()=>(0,m.jsx)(Y,{}),parameters:{docs:{description:{story:"Every variable a desktop menu can show, passed through the menu's own `style` prop, since the menu is portalled out of any wrapper -- the variables are listed under CSS variables on this page. Hover **Delete** for the hover background, hover **Rename** for the disabled one, and press Arrow Down for the keyboard highlight. The mobile header rows only apply to the bottom sheet."},source:{code:`<ContextMenu
  ref={cm}
  model={items}
  showDisabledItems
  style={{
    "--context-menu-radius": "12px",
    "--context-menu-bg": "#1e1b4b",
    "--context-menu-border-style": "1px solid #4338ca",
    "--context-menu-shadow": "0 12px 24px rgba(30, 27, 75, 0.45)",
    "--context-menu-text": "#e0e7ff",
    "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
    "--context-menu-item-disabled-text": "#6366f1",
    "--context-menu-item-disabled-bg": "#312e81",
    "--context-menu-active-item-bg": "rgba(255,255,255,0.2)",
    "--context-menu-header-border-style": "1px solid #4338ca",
    "--context-menu-menu-item-padding": "0 20px",
    "--context-menu-divider-margin": "6px 20px",
    "--context-menu-item-text-size": "14px",
    "--context-menu-item-text-weight": "400",
    "--context-menu-item-with-description-padding": "8px 20px",
    "--context-menu-item-description-width": "220px",
    "--context-menu-item-description": "#a5b4fc",
  }}
/>`}}}},Z=[`Default`,`SimpleMenu`,`WithBackdrop`,`WithItemDescriptions`,`ItemVariants`,`DynamicModel`,`AttachedToDocument`,`MaxHeight`,`MobileWithHeader`,`MobileWithAvatarHeader`,`AnchoredToElement`,`RightToLeft`,`CssCustomization`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <MenuTemplate {...args} />,
  args: {
    model: fullMenuItems,
    showDisabledItems: true
  },
  parameters: {
    docs: {
      description: {
        story: "Full-featured context menu with icons, separators, nested submenus and a disabled item. Disabled items are dropped from the list by default; \`showDisabledItems\` keeps them greyed out. Right-click the colored area to open."
      },
      source: {
        code: \`const cm = useRef<ContextMenuRefType>(null);

<ContextMenu ref={cm} model={menuItems} showDisabledItems />
<div onContextMenu={(e) => cm.current?.show(e)}>
  Right click on me
</div>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <SimpleMenuTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A flat list of actions with one separator and no submenus — the shape most row and card menus need, with nothing but \`ref\` and \`model\` set. Right-click the colored area to open."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={[
    { key: 0, label: "Cut", icon: FolderIcon },
    { key: 1, label: "Copy", icon: FolderIcon },
    { key: 2, label: "Paste", icon: FolderIcon },
    { key: 3, isSeparator: true },
    { key: 4, label: "Delete", icon: FolderIcon },
  ]}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <WithBackdropTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Context menu with a backdrop overlay. \`withBackdrop\` shows the backdrop only while the menu is a bottom sheet (viewports up to 600px), so on a desktop viewport it also needs \`ignoreChangeView\`, which this story passes. The mobile stories below set both props too, so the sheet and its backdrop appear however short the menu is."
      },
      source: {
        code: \`<ContextMenu ref={cm} model={items} withBackdrop ignoreChangeView />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <MenuTemplate {...args} />,
  args: {
    model: accessItems
  },
  parameters: {
    docs: {
      description: {
        story: "Items carrying \`description\` are laid out as two lines: the label row and an always-visible description under it. The menu grows to the width of its longest description."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={[
    {
      key: "link",
      label: "Anyone with the link",
      icon: FolderIcon,
      description:
        "Everyone who has the link can open the file, no sign-in needed.",
    },
    {
      key: "invited",
      label: "Invited people only",
      icon: FolderIcon,
      description: "Only the people you invite by e-mail get access.",
    },
  ]}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <ItemVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every kind of item the model supports, in one menu. From top to bottom:

- **Notifications** — a switch inside the item (\\\`withToggle\\\`, \\\`checked\\\`). Clicking it flips the switch and keeps the menu open.
- **Auto-save** — the same switch, disabled. The label keeps its color and only the switch is greyed (\\\`disabledStylesType: "toggle"\\\`); hover the switch to read why it is off (\\\`getTooltipContent\\\` anchored with \\\`tooltipTarget: "toggle"\\\`).
- **Share with people** — the icon is a React element (\\\`iconNode\\\`) instead of an image URL.
- **Ask the MCP server** — the MCP server icon (\\\`withMCPIcon\\\`): the server logo when \\\`icon\\\` is given, the first letter of the label otherwise.
- **Export to PDF** — a text badge after the label (\\\`badgeLabel\\\`).
- **Version history** — the same badge in the paid-feature color (\\\`badgeLabel\\\` + \\\`isPaidBadge\\\`).
- **Help Center** — an external link that opens in a new tab (\\\`url\\\`, \\\`target\\\`); \\\`isOutsideLink\\\` adds the arrow.
- **Delete** — a disabled item. It stays in the list only because of \\\`showDisabledItems\\\`; hover it to read the reason (\\\`getTooltipContent\\\`).\`
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  showDisabledItems
  model={[
    { key: "notifications", label: "Notifications", withToggle: true, checked, onClick: toggle },
    {
      key: "auto-save",
      label: "Auto-save",
      withToggle: true,
      disabled: true,
      disabledStylesType: "toggle",
      tooltipTarget: "toggle",
      getTooltipContent: () => "Available on the paid plan",
    },
    { key: "share", label: "Share with people", iconNode: <CatalogFolderIcon /> },
    { key: "mcp", label: "Ask the MCP server", withMCPIcon: true },
    { key: "export", label: "Export to PDF", icon: FolderIcon, badgeLabel: "New" },
    { key: "history", label: "Version history", icon: FolderIcon, badgeLabel: "Paid", isPaidBadge: true },
    { key: "help", label: "Help Center", url: "https://example.com/help", target: "_blank", isOutsideLink: true },
    { key: "delete", label: "Delete", icon: FolderIcon, disabled: true, getTooltipContent: () => "..." },
  ]}
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <DynamicModelTemplate />,
  parameters: {
    docs: {
      description: {
        story: "\`getContextModel\` replaces a static \`model\`: the getter runs each time the menu opens, so the first item shows the time of that open and the favorite item reads the state changed by its own click. Leading and trailing separators in the result are trimmed."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={[]}
  getContextModel={() => [
    { key: "built", label: \\\`Model built at \\\${new Date().toLocaleTimeString()}\\\` },
    { key: "sep", isSeparator: true },
    {
      key: "favorite",
      label: isFavorite ? "Remove from favorites" : "Add to favorites",
      onClick: toggleFavorite,
    },
  ]}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <GlobalTemplate {...args} />,
  args: {
    model: globalItems,
    global: true
  },
  parameters: {
    docs: {
      // Its document listener would hijack the other stories on the Docs page.
      story: {
        inline: false,
        iframeHeight: 340
      },
      description: {
        story: "The blue square has no handler of its own and nothing calls \`show\`: with \`global\` the menu attaches itself to the whole document, so a right-click on the square and one on the empty space around it open the same menu. Use it for a page-level menu that is not tied to one element."
      },
      source: {
        code: \`<ContextMenu model={items} global />\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <MenuTemplate {...args} />,
  args: {
    model: manyItems,
    maxHeight: 240,
    maxHeightLowerSubmenu: 160
  },
  parameters: {
    docs: {
      description: {
        story: "The model has sixteen items, but the menu is only 240px tall — about six and a half rows — and the rest scrolls inside it (\`maxHeight\`). Hover **Move to**: its submenu has twelve folders and is limited the same way, to 160px (\`maxHeightLowerSubmenu\`)."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={[{ key: "move", label: "Move to", items: twelveFolders }, ...fifteenOptions]}
  maxHeight={240}
  maxHeightLowerSubmenu={160}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  globals: mobileViewport,
  decorators: [withPhoneFrame],
  render: args => <MobileMenuTemplate {...args} />,
  args: {
    model: roomItems,
    header: roomHeader,
    isRoom: true,
    withBackdrop: true,
    ignoreChangeView: true
  },
  parameters: {
    docs: {
      description: {
        story: "Shown at 320px, where the menu is a bottom sheet with the \`header\` on top: the title and, in the 32px block that \`isRoom\` gives it, the title's initials on the header \`color\` (the block renders only when \`icon\` is set; \`color\` then replaces the icon). Tap **Move or copy**: the submenu replaces the list in place and the header turns into a back button. \`ignoreChangeView\` forces the sheet layout regardless of the menu height."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={roomItems}
  header={{ title: "Contracts 2026", icon: FolderIcon, color: "5C6EFF", original: "", large: "", medium: "", small: "" }}
  isRoom
  withBackdrop
  ignoreChangeView
/>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  globals: mobileViewport,
  decorators: [withPhoneFrame],
  render: args => <MobileMenuTemplate {...args} />,
  args: {
    model: userItems,
    header: userHeader,
    withBackdrop: true,
    ignoreChangeView: true
  },
  parameters: {
    docs: {
      description: {
        story: "The same bottom sheet with a person as the subject: \`header.avatar\` renders an avatar instead of the initials block."
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={userItems}
  header={{ title: user.displayName, avatar: user.avatarSmall, original: "", large: "", medium: "", small: "" }}
  withBackdrop
  ignoreChangeView
/>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <AnchoredToElementTemplate {...args} />,
  args: {
    model: [{
      key: 0,
      label: "Rename",
      icon: CatalogFolderReactSvgUrl
    }, {
      key: 1,
      label: "Duplicate",
      icon: CatalogFolderReactSvgUrl
    }, {
      key: 2,
      label: "Download",
      icon: CatalogFolderReactSvgUrl
    }, {
      key: 3,
      isSeparator: true
    }, {
      key: 4,
      label: "Delete",
      icon: CatalogFolderReactSvgUrl
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Click **Actions**: the menu opens under the button, at its left edge, wherever the pointer was (\`containerRef\`). Use it for a menu that belongs to a toolbar button or a row's action button rather than to a right-click. \`leftOffset\` and \`rightOffset\` move it left from that edge; change them live in the Controls panel below."
      },
      source: {
        code: \`const anchorRef = useRef<HTMLDivElement>(null);

<div ref={anchorRef}>
  <button onClick={(e) => cm.current?.show(e)}>Actions</button>
</div>
<ContextMenu ref={cm} model={items} containerRef={anchorRef} />\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <RightToLeftTemplate {...args} />,
  globals: {
    direction: "rtl"
  },
  args: {
    model: [{
      key: 0,
      label: "تحرير",
      icon: CatalogFolderReactSvgUrl
    }, {
      key: 1,
      label: "نسخ",
      icon: CatalogFolderReactSvgUrl
    }, {
      key: 2,
      label: "نقل إلى",
      icon: CatalogFolderReactSvgUrl,
      items: [{
        key: 3,
        label: "المستندات"
      }, {
        key: 4,
        label: "الأرشيف"
      }]
    }, {
      key: 5,
      isSeparator: true
    }, {
      key: 6,
      label: "حذف",
      icon: CatalogFolderReactSvgUrl
    }]
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "326px"
      },
      description: {
        story: "The menu in a right-to-left interface: it opens to the left of the pointer, the icons sit on the right of the labels, and the third item's submenu opens to the left with its arrow pointing left. The menu renders into the right-to-left container (\`appendTo\`), because on its own it goes to the end of the page body, outside any \`dir\` wrapper."
      },
      source: {
        code: \`<div dir="rtl" ref={setContainer}>
  <ContextMenu ref={cm} model={items} appendTo={container} />
  <div onContextMenu={(e) => cm.current?.show(e)}>انقر بزر الفأرة الأيمن</div>
</div>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every variable a desktop menu can show, passed through the menu's own \\\`style\\\` prop, since the menu is portalled out of any wrapper -- the variables are listed under CSS variables on this page. Hover **Delete** for the hover background, hover **Rename** for the disabled one, and press Arrow Down for the keyboard highlight. The mobile header rows only apply to the bottom sheet.\`
      },
      source: {
        code: \`<ContextMenu
  ref={cm}
  model={items}
  showDisabledItems
  style={{
    "--context-menu-radius": "12px",
    "--context-menu-bg": "#1e1b4b",
    "--context-menu-border-style": "1px solid #4338ca",
    "--context-menu-shadow": "0 12px 24px rgba(30, 27, 75, 0.45)",
    "--context-menu-text": "#e0e7ff",
    "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
    "--context-menu-item-disabled-text": "#6366f1",
    "--context-menu-item-disabled-bg": "#312e81",
    "--context-menu-active-item-bg": "rgba(255,255,255,0.2)",
    "--context-menu-header-border-style": "1px solid #4338ca",
    "--context-menu-menu-item-padding": "0 20px",
    "--context-menu-divider-margin": "6px 20px",
    "--context-menu-item-text-size": "14px",
    "--context-menu-item-text-weight": "400",
    "--context-menu-item-with-description-padding": "8px 20px",
    "--context-menu-item-description-width": "220px",
    "--context-menu-item-description": "#a5b4fc",
  }}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}}})))()}Q();export{K as AnchoredToElement,j as AttachedToDocument,X as CssCustomization,v as Default,O as DynamicModel,E as ItemVariants,P as MaxHeight,W as MobileWithAvatarHeader,V as MobileWithHeader,J as RightToLeft,b as SimpleMenu,S as WithBackdrop,w as WithItemDescriptions,Z as __namedExportsOrder,h as default};