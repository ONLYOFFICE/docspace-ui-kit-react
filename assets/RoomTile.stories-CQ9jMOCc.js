import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{r as a,t as o}from"./text-Cz_cI6Yf.js";import{n as s,t as c}from"./common-icons-style-Dik-NKVV.js";import{n as ee,t as l}from"./useCommonTranslation-CxhIMPGu.js";import{n as u,t as d}from"./icon-button-CrT9MlQO.js";import{n as f,t as p}from"./link-C_nB54e7.js";import{S as m,g as h}from"./enums-DzcBu485.js";import{n as g,t as _}from"./public-sTzh8Ldy.js";import{n as v,t as y}from"./catalog.folder.react-VUpu0ofJ.js";import{n as b,t as te}from"./tags-9ikQWVg3.js";import{n as x,t as ne}from"./base-tile-80NBnHCx.js";import{n as re,t as S}from"./tile-content-BziW1hzz.js";var C,w,T,E,D;function O(){return(O=e((()=>{C=`_roomTile_1lq9i_1`,w=`_checked_1lq9i_41`,T=`_isActive_1lq9i_42`,E=`_isEdit_1lq9i_43`,D={roomTile:C,checked:w,isActive:T,isEdit:E}})))()}var k,ie,A,j;function ae(){return(ae=e((()=>{k=t(n()),b(),ie=t(i()),x(),O(),l(),A=r(),j=({item:e,checked:t,isActive:n,isEdit:r,children:i,columnCount:a,selectTag:o,selectOption:s,getRoomTypeName:c,thumbnailClick:l,badges:u,onSelect:d,customBottomContent:f,...p})=>{let m=ee(),[h]=k.Children.toArray(i),g=(0,k.useRef)(null),[_,v]=(0,k.useState)(!1),y=(e.tags?.length??0)>0,b=(0,k.useCallback)(()=>{v(!0)},[]),x=(0,k.useCallback)(()=>{v(!1)},[]),re=(0,k.useCallback)(e=>{(!e.target||!(e.target instanceof Element)||!e.target.closest(`.checkbox`)&&!e.target.closest(`.tags`)&&!e.target.closest(`.advanced-tag`)&&!e.target.closest(`.badges`)&&!e.target.closest(`#modal-dialog`)&&!g.current?.contains(e.target)&&!e.target.closest(`.expandButton`)&&!e.target.closest(`.p-contextmenu`))&&l?.(e)},[l,g]),S=(0,k.useMemo)(()=>{let t=[];return e.providerType&&t.push({isThirdParty:!0,icon:e.thirdPartyIcon,label:e.providerKey||e.providerType,roomType:Number(e.roomType),providerType:Number(e.providerType),onClick:()=>s({option:`typeProvider`,value:e.providerType})}),e.tags&&e.tags.length>0?t.push(...e.tags):e.isAIAgent?t.push({isDefault:!0,label:m(`NoTags`)??``}):t.push({isDefault:!0,label:c(e.roomType,m),roomType:Number(e.roomType),onClick:()=>s({option:`defaultTypeRoom`,value:e.roomType})}),t},[e,s,c,m]),C=(0,A.jsxs)(A.Fragment,{children:[h,(0,A.jsx)(`div`,{className:`tile-badges`,children:u})]}),w=(0,k.useCallback)(t=>{(!e.isAIAgent||y)&&`label`in t&&`roomType`in t&&o(t)},[e.isAIAgent,y,o]),T=f?f(_,S):(0,A.jsx)(te,{columnCount:a,onSelectTag:w,onMouseEnter:b,onMouseLeave:x,tags:S,className:`room-tags`}),E=(0,k.useCallback)((e,t)=>{d?.(e,t)},[d]),O=d?E:void 0,j=(0,k.useMemo)(()=>(0,ie.default)(D.roomTile,{[D.checked]:t,[D.isActive]:n,[D.isEdit]:r}),[t,n,r]);return(0,A.jsx)(ne,{...p,checked:t,isActive:n,isEdit:r,item:e,onSelect:O,onHover:b,onLeave:x,topContent:C,bottomContent:T,className:j,checkboxContainerRef:g,onRoomClick:re})};try{j.displayName=`RoomTile`,j.__docgenInfo={description:``,displayName:`RoomTile`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/tiles/room-tile/index.tsx`,methods:[],props:{checked:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Whether the tile is selected.`,name:`checked`,required:!1,tags:{},type:{name:`boolean | undefined`}},isActive:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Whether the tile is the one being acted on, which keeps its hover background.`,name:`isActive`,required:!1,tags:{},type:{name:`boolean | undefined`}},isBlockingOperation:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Turns the pointer off while an operation is running over the tile: hover, clicks and right-clicks stop reaching it. It does not change how the tile looks.`,name:`isBlockingOperation`,required:!1,tags:{},type:{name:`boolean | undefined`}},item:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:"The room this tile stands for. Its `tags`, `providerType` and `isAIAgent` decide what the bottom row shows, and its `contextOptions` key decides whether the three-dot button appears.",name:`item`,required:!0,tags:{},type:{name:`RoomItem`}},onSelect:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:"Called with the new checked state and the `item` when the checkbox changes, or when the logo is tapped on a screen narrower than 600px.",name:`onSelect`,required:!1,tags:{},type:{name:`((checked: boolean, item: RoomItem) => void) | undefined`}},thumbnailClick:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Called with the event on a click anywhere on the tile except the checkbox, the tags, the badges, an open dialog, the three-dot button and the menu. It is the tile's open handler, not a thumbnail's.`,name:`thumbnailClick`,required:!1,tags:{},type:{name:`((e: MouseEvent<Element, MouseEvent>) => void) | undefined`}},getContextModel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Builds the menu shown on right-click. Without it the right-click menu never opens.`,name:`getContextModel`,required:!1,tags:{},type:{name:`(() => ContextMenuModel[]) | undefined`}},children:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`The tile's content. Only the first element is rendered, above the tags.`,name:`children`,required:!1,tags:{},type:{name:`ReactNode`}},indeterminate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Draws the checkbox in its indeterminate state.`,name:`indeterminate`,required:!1,tags:{},type:{name:`boolean | undefined`}},element:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`The room logo beside the checkbox. Without it neither the logo nor the checkbox is rendered at all.`,name:`element`,required:!1,tags:{},type:{name:`ReactNode`}},contextOptions:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:"The menu's entries. Required — but see `item`.",name:`contextOptions`,required:!0,tags:{},type:{name:`ContextMenuModel[]`}},columnCount:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`How many columns the tag row is laid out in. Required.`,name:`columnCount`,required:!0,tags:{},type:{name:`number`}},selectTag:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Called with a clicked tag, but only one that carries both a label and a room type — a plain string tag never reaches it, and neither does any tag on an AI agent that has none of its own.`,name:`selectTag`,required:!0,tags:{},type:{name:`(tag: TagClickEvent) => void`}},selectOption:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Called when the generated third-party or room-type tag is clicked, with which of the two it was. Required.`,name:`selectOption`,required:!0,tags:{},type:{name:`(option: SelectOption) => void`}},getRoomTypeName:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Turns a room type into the label of the tag shown when the room has no tags of its own. It is handed the kit's own translation function. Required.`,name:`getRoomTypeName`,required:!0,tags:{},type:{name:`(type: string, t: TFunction<"translation", undefined> | ((key: string, interpolation?: Record<string, string | number> | undefined) => string)) => string`}},badges:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Badges drawn beside the content, in the upper half.`,name:`badges`,required:!1,tags:{},type:{name:`ReactNode`}},inProgress:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Replaces the logo and the checkbox with the kit's track loader.`,name:`inProgress`,required:!1,tags:{},type:{name:`boolean | undefined`}},showHotkeyBorder:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Draws the accent outline that marks the tile the keyboard is on.`,name:`showHotkeyBorder`,required:!1,tags:{},type:{name:`boolean | undefined`}},isEdit:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Renaming state: it removes the logo and the checkbox.`,name:`isEdit`,required:!1,tags:{},type:{name:`boolean | undefined`}},dataTestId:{defaultValue:{value:`"tile"`},declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:"Value of `data-testid` on the outer element.",name:`dataTestId`,required:!1,tags:{default:`"tile"`},type:{name:`string | undefined`}},customBottomContent:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/room-tile/RoomTile.types.tsx`,name:`TypeLiteral`}],description:`Replaces the whole tag row. It is called on every render with the hover state and the tags the component worked out.`,name:`customBottomContent`,required:!1,tags:{},type:{name:`((isHovered: boolean, tags: (string | TagType)[]) => ReactNode) | undefined`}}},tags:{}}}catch{}})))()}var M,N,P,F;function I(){return(I=e((()=>{n(),M=n(),N=r(),P=({title:e,titleId:t,...n},r)=>(0,N.jsxs)(`svg`,{width:16,height:16,viewBox:`0 0 16 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,ref:r,"aria-labelledby":t,...n,children:[e?(0,N.jsx)(`title`,{id:t,children:e}):null,(0,N.jsx)(`g`,{clipPath:`url(#clip0_2308_53266)`,children:(0,N.jsx)(`path`,{fillRule:`evenodd`,clipRule:`evenodd`,d:`M11.5765 -0.000242493L4.41753 -0.000241966C4.15897 -0.000374434 3.94915 0.209442 3.94928 0.468004L3.94928 0.498338C3.94922 0.937244 4.12016 1.35006 4.43051 1.66041C4.63046 1.86036 4.87313 2.00143 5.13765 2.07719L4.60668 7.27556C4.06386 7.30602 3.5578 7.53167 3.17029 7.91918C2.75271 8.33676 2.52275 8.8919 2.52282 9.48234L2.52282 9.52725C2.52276 9.78587 2.73244 9.99556 2.99107 9.99549L6.99754 9.99549L6.99747 13.5101C6.99867 13.5949 7.16833 15.0259 7.18954 15.2188C7.21075 15.4118 7.36141 15.5487 7.36233 15.5624C7.3783 15.8082 7.75338 15.9992 7.99995 15.9998C8.1291 16 8.4148 15.9478 8.50004 15.8625C8.57773 15.7848 8.62846 15.6798 8.63634 15.5624C8.63707 15.5521 8.79254 15.3697 8.80914 15.2188C8.82574 15.068 8.99981 13.595 9.00101 13.5036V9.99562L13.0031 9.99562C13.1324 9.99569 13.2495 9.94324 13.3342 9.85853C13.4189 9.77382 13.4714 9.65666 13.4713 9.52738V9.48247C13.4714 8.89203 13.2414 8.33683 12.8238 7.91931C12.4363 7.5318 11.9302 7.30622 11.3874 7.27569L10.8565 2.07733C11.121 2.00156 11.3637 1.86049 11.5636 1.66054C11.874 1.35012 12.045 0.937442 12.0448 0.49847L12.0448 0.468136C12.0448 0.209376 11.8351 -0.000308727 11.5765 -0.000242493Z`,fill:`#3B72A7`})}),(0,N.jsx)(`defs`,{children:(0,N.jsx)(`clipPath`,{id:`clip0_2308_53266`,children:(0,N.jsx)(`rect`,{width:16,height:16,fill:`white`})})})]}),F=(0,M.forwardRef)(P)})))()}var L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,oe;function se(){return(se=e((()=>{L=n(),g(),I(),v(),m(),f(),a(),u(),s(),ae(),re(),R=r(),{fn:z}=__STORYBOOK_MODULE_TEST__,B=(0,R.jsx)(_,{}),V=(0,R.jsx)(`div`,{className:`badges`,children:(0,R.jsx)(d,{onClick:()=>{},className:`badge icons-group is-pinned tablet-badge tablet-pinned`,iconNode:(0,R.jsx)(F,{}),size:c.medium})}),H=[{id:`option_edit`,key:`edit`,label:`Edit`,onClick:()=>{},disabled:!1},{id:`option_delete`,key:`delete`,label:`Delete`,onClick:()=>{},disabled:!1}],U={title:`UI/Tiles/RoomTile`,component:j,parameters:{},argTypes:{checked:{control:`boolean`,description:`Ticks the checkbox and keeps it in place of the logo, and tints the tile and its tags`,table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Keeps the hover background and the tag tint on the tile being acted on`,table:{defaultValue:{summary:`false`}}},isBlockingOperation:{control:`boolean`,description:`Stops the tile answering hover, clicks and right-clicks; it looks the same as an idle tile`,table:{defaultValue:{summary:`false`}}},indeterminate:{control:`boolean`,description:`Draws the checkbox half-filled; it shows while the checkbox does, that is on hover or when the tile is checked`,table:{defaultValue:{summary:`false`}}},inProgress:{control:`boolean`,description:`Replaces the logo and the checkbox with a small loader`,table:{defaultValue:{summary:`false`}}},showHotkeyBorder:{control:`boolean`,description:`Turns the tile's border the accent colour, to mark the one the keyboard is on`,table:{defaultValue:{summary:`false`}}},isEdit:{control:`boolean`,description:`Removes the logo and the checkbox while the room is renamed, and stops hovering from tinting the tile`,table:{defaultValue:{summary:`false`}}},item:{control:!1,description:"The room the tile stands for, passed back through the callbacks. Its `tags`, `providerType` and `isAIAgent` decide the tag row; a `contextOptions` key on it is what draws the three-dot button"},children:{control:!1,description:"The name beside the logo, usually a `TileContent`; only the first element is shown"},element:{control:!1,description:`The room logo beside the name; without it the tile has neither the logo nor the checkbox`},badges:{control:!1,description:"Badges after the name; give their wrapper the class `badges` so clicking them does not open the room"},columnCount:{control:`number`,description:`How many columns the tag row has to fit into; the row shows as many tags as the width allows and folds the rest`},contextOptions:{control:`object`,description:`Entries of the menu opened by the three-dot button`},getContextModel:{control:!1,description:`Returns the entries of the menu opened by a right-click; without it a right-click opens nothing`},getRoomTypeName:{control:!1,description:`Turns the room type into the label of the tag shown when the room has no tags of its own`},customBottomContent:{control:!1,description:`Draws the bottom row instead of the tags; called on every render with the hover state and the tags the tile worked out`},onSelect:{description:`Called with the new checked state and the item from the checkbox, and when the logo is tapped on a phone`},thumbnailClick:{description:`Called with the event on a click anywhere on the tile except the checkbox, the tags, the badges and the menu; it is the room's open handler`},selectTag:{description:`Called with a clicked tag that carries a label and a room type; a plain text tag never reaches it`},selectOption:{description:`Called when the type tag or the third-party tag is clicked, with which of the two it was`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"tile"`}}}},args:{onSelect:z(),thumbnailClick:z(),selectTag:z(),selectOption:z()}},W=({checked:e,onSelect:t,...n})=>{let[r,i]=(0,L.useState)(e),a=(e,n)=>{i(e),t?.(e,n)};return(0,R.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,R.jsx)(j,{...n,checked:r,onSelect:a,children:(0,R.jsx)(S,{children:(0,R.jsx)(p,{children:`Room Content`})})})})},G={render:W,args:{item:{id:`room-1`,title:`Sample Room`,roomType:`collaboration`,tags:[{label:`Collaboration`,roomType:h.EditingRoom}],contextOptions:H},element:B,contextOptions:H,badges:V,getContextModel:()=>H,getRoomTypeName:e=>e,columnCount:1},parameters:{docs:{description:{story:`A room with one tag: the logo, the name with a pin badge, the menu, and the tag row below. Hover the logo and tick the checkbox to select the room, click anywhere else or on the tag to see the callbacks in the Actions panel, and change any other prop live in the Controls panel below.`},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  getContextModel={() => contextOptions}
  getRoomTypeName={getRoomTypeName}
  columnCount={1}
  thumbnailClick={openRoom}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},K={render:W,args:{...G.args,checked:!0},parameters:{docs:{description:{story:"A selected room, as it looks among others the reader has picked: the checkbox stays ticked in place of the logo and the tile and its tags are tinted (`checked`)."},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},q={render:W,args:{...G.args,inProgress:!0},parameters:{docs:{description:{story:"A room that is busy, being created or copied: a small loader stands where the logo and the checkbox were (`inProgress`)."},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},J={render:W,args:{...G.args,isBlockingOperation:!0},parameters:{docs:{description:{story:"A room an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle room, so show the operation somewhere else."},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},Y={render:W,args:{...G.args,item:{id:`room-2`,title:`Shared storage`,roomType:String(h.EditingRoom),providerType:`1`,thirdPartyIcon:y,contextOptions:H},getRoomTypeName:()=>`Collaboration`},parameters:{docs:{description:{story:"A room with no tags of its own, kept on a connected storage: the tile makes two tags for it: first the storage, drawn as its icon alone (`providerType`, `thirdPartyIcon`), then the room type (`getRoomTypeName`). Click either to see `selectOption` in the Actions panel."},source:{code:`<RoomTile
  item={{ id: "room-2", title: "Shared storage", roomType: "2", providerType: "1", thirdPartyIcon: storageIconUrl, contextOptions }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  getRoomTypeName={() => "Collaboration"}
  selectOption={filterByOption}
  columnCount={1}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},X={render:W,args:{...G.args,showHotkeyBorder:!0},parameters:{docs:{description:{story:"The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself."},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},Z={render:W,args:{...G.args,isEdit:!0},parameters:{docs:{description:{story:"A room whose name is being edited: the logo and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (`isEdit`)."},source:{code:`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},Q={render:W,args:{...G.args,customBottomContent:(e,t)=>(0,R.jsx)(o,{fontSize:`12px`,children:e?`Open room`:`${t.length} tag`})},parameters:{docs:{description:{story:"A room whose bottom row is the host's own: here a line of text that counts the tags and changes when the pointer is over the tile (`customBottomContent`). The tile no longer draws its tags."},source:{code:`<RoomTile
  item={room}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  customBottomContent={(isHovered, tags) => (
    <Text fontSize="12px">{isHovered ? "Open room" : \`\${tags.length} tag\`}</Text>
  )}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>`}}}},$={render:()=>(0,R.jsx)(`div`,{style:{"--tile-bg":`#f4f9fd`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`,"--tile-icon-color":`#0082c9`,"--tile-tag-hover-bg":`#e6f3fb`,"--tile-hotkey-color":`#e0662e`,"--tile-padding":`12px 0`,"--tile-row-gap":`12px`},children:[{id:`room-1`,title:`Sample Room`,showHotkeyBorder:!1},{id:`room-2`,title:`Team Room`,showHotkeyBorder:!0}].map(({id:e,title:t,showHotkeyBorder:n})=>(0,R.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,R.jsx)(j,{item:{id:e,title:t,roomType:`collaboration`,tags:[{label:`Collaboration`,roomType:h.EditingRoom}],contextOptions:H},element:B,contextOptions:H,badges:V,showHotkeyBorder:n,getContextModel:()=>H,selectTag:()=>{},selectOption:()=>{},getRoomTypeName:e=>e,columnCount:1,children:(0,R.jsx)(S,{children:(0,R.jsx)(p,{children:t})})})},e))}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page.\n\nTwo instances:\n- **Sample Room** — for every variable but the hotkey colour; hover it for `--tile-hover-bg` and `--tile-tag-hover-bg`.\n- **Team Room** — `showHotkeyBorder`, for `--tile-hotkey-color`."},source:{code:`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-tag-hover-bg": "#e6f3fb",
  "--tile-hotkey-color": "#e0662e",
  "--tile-padding": "12px 0",
  "--tile-row-gap": "12px",
}}>
  <RoomTile item={room} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1}>
    <TileContent><Link>Sample Room</Link></TileContent>
  </RoomTile>
  <RoomTile item={teamRoom} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1} showHotkeyBorder>
    <TileContent><Link>Team Room</Link></TileContent>
  </RoomTile>
</div>`}}}},oe=[`Default`,`Checked`,`InProgress`,`BlockingOperation`,`GeneratedTags`,`WithHotkeyBorder`,`RenamingState`,`CustomBottomRow`,`CssCustomization`],G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: {
      id: "room-1",
      title: "Sample Room",
      roomType: "collaboration",
      tags: [{
        label: "Collaboration",
        roomType: RoomsType.EditingRoom
      }],
      contextOptions
    },
    element,
    contextOptions,
    badges,
    getContextModel: () => contextOptions,
    getRoomTypeName: (type: string) => type,
    columnCount: 1
  },
  parameters: {
    docs: {
      description: {
        story: "A room with one tag: the logo, the name with a pin badge, the menu, and the tag row below. Hover the logo and tick the checkbox to select the room, click anywhere else or on the tag to see the callbacks in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  getContextModel={() => contextOptions}
  getRoomTypeName={getRoomTypeName}
  columnCount={1}
  thumbnailClick={openRoom}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "A selected room, as it looks among others the reader has picked: the checkbox stays ticked in place of the logo and the tile and its tags are tinted (\`checked\`)."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "A room that is busy, being created or copied: a small loader stands where the logo and the checkbox were (\`inProgress\`)."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true
  },
  parameters: {
    docs: {
      description: {
        story: "A room an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (\`isBlockingOperation\`). It looks the same as an idle room, so show the operation somewhere else."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    item: {
      id: "room-2",
      title: "Shared storage",
      roomType: String(RoomsType.EditingRoom),
      providerType: "1",
      thirdPartyIcon: CatalogFolderReactSvgUrl,
      contextOptions
    },
    getRoomTypeName: () => "Collaboration"
  },
  parameters: {
    docs: {
      description: {
        story: "A room with no tags of its own, kept on a connected storage: the tile makes two tags for it: first the storage, drawn as its icon alone (\`providerType\`, \`thirdPartyIcon\`), then the room type (\`getRoomTypeName\`). Click either to see \`selectOption\` in the Actions panel."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-2", title: "Shared storage", roomType: "2", providerType: "1", thirdPartyIcon: storageIconUrl, contextOptions }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  getRoomTypeName={() => "Collaboration"}
  selectOption={filterByOption}
  columnCount={1}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true
  },
  parameters: {
    docs: {
      description: {
        story: "The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (\`showHotkeyBorder\`). The tile does not handle the keys itself."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: "A room whose name is being edited: the logo and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (\`isEdit\`)."
      },
      source: {
        code: \`<RoomTile
  item={{ id: "room-1", title: "Sample Room", roomType: "collaboration", tags: [...] }}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    customBottomContent: (isHovered, tags) => <Text fontSize="12px">
        {isHovered ? "Open room" : \`\${tags.length} tag\`}
      </Text>
  },
  parameters: {
    docs: {
      description: {
        story: "A room whose bottom row is the host's own: here a line of text that counts the tags and changes when the pointer is over the tile (\`customBottomContent\`). The tile no longer draws its tags."
      },
      source: {
        code: \`<RoomTile
  item={room}
  element={<PublicRoomIconReactSvg />}
  contextOptions={contextOptions}
  customBottomContent={(isHovered, tags) => (
    <Text fontSize="12px">{isHovered ? "Open room" : \\\`\\\${tags.length} tag\\\`}</Text>
  )}
>
  <TileContent><Link>Room Content</Link></TileContent>
</RoomTile>\`
      }
    }
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#f4f9fd",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-icon-color": "#0082c9",
    "--tile-tag-hover-bg": "#e6f3fb",
    "--tile-hotkey-color": "#e0662e",
    "--tile-padding": "12px 0",
    "--tile-row-gap": "12px"
  } as CSSProperties}>
      {[{
      id: "room-1",
      title: "Sample Room",
      showHotkeyBorder: false
    }, {
      id: "room-2",
      title: "Team Room",
      showHotkeyBorder: true
    }].map(({
      id,
      title,
      showHotkeyBorder
    }) => <div key={id} style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
          <RoomTile item={{
        id,
        title,
        roomType: "collaboration",
        tags: [{
          label: "Collaboration",
          roomType: RoomsType.EditingRoom
        }],
        contextOptions
      }} element={element} contextOptions={contextOptions} badges={badges} showHotkeyBorder={showHotkeyBorder} getContextModel={() => contextOptions} selectTag={() => {}} selectOption={() => {}} getRoomTypeName={(type: string) => type} columnCount={1}>
            <TileContent>
              <Link>{title}</Link>
            </TileContent>
          </RoomTile>
        </div>)}
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page.

Two instances:
- **Sample Room** — for every variable but the hotkey colour; hover it for \\\`--tile-hover-bg\\\` and \\\`--tile-tag-hover-bg\\\`.
- **Team Room** — \\\`showHotkeyBorder\\\`, for \\\`--tile-hotkey-color\\\`.\`
      },
      source: {
        code: \`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-tag-hover-bg": "#e6f3fb",
  "--tile-hotkey-color": "#e0662e",
  "--tile-padding": "12px 0",
  "--tile-row-gap": "12px",
}}>
  <RoomTile item={room} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1}>
    <TileContent><Link>Sample Room</Link></TileContent>
  </RoomTile>
  <RoomTile item={teamRoom} element={<RoomLogo />} contextOptions={options} badges={badges} columnCount={1} showHotkeyBorder>
    <TileContent><Link>Team Room</Link></TileContent>
  </RoomTile>
</div>\`
      }
    }
  }
}`,...$.parameters?.docs?.source}}}})))()}se();export{J as BlockingOperation,K as Checked,$ as CssCustomization,Q as CustomBottomRow,G as Default,Y as GeneratedTags,q as InProgress,Z as RenamingState,X as WithHotkeyBorder,oe as __namedExportsOrder,U as default};