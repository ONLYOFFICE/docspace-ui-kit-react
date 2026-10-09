import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{r as i,t as a}from"./text-Cz_cI6Yf.js";import{n as o,t as s}from"./common-icons-style-Dik-NKVV.js";import{n as c,t as l}from"./useCommonTranslation-CxhIMPGu.js";import{n as u,t as d}from"./icon-button-CrT9MlQO.js";import{n as f,t as p}from"./link-C_nB54e7.js";import{n as m,t as h}from"./public-DXWpnr32.js";import{a as g,i as ee,n as te,t as ne}from"./ComboBox-DWO8Uqxf.js";import{n as re,t as ie}from"./base-tile-80NBnHCx.js";import{n as _,t as v}from"./tile-content-BziW1hzz.js";import{n as y,t as b}from"./create.room.react-CytU_1bL.js";var x,S,C,w,T,E;function D(){return(D=e((()=>{x=`_templateTile_1y677_1`,S=`_wrapper_1y677_63`,C=`_field_1y677_67`,w=`_text_1y677_72`,T=`_spaceQuota_1y677_75`,E={templateTile:x,wrapper:S,field:C,text:w,spaceQuota:T}})))()}var O,k,A,j;function M(){return(M=e((()=>{O=t(n()),i(),f(),re(),D(),l(),k=r(),A=e=>`title`in e&&typeof e.title==`string`,j=({item:e,children:t,showStorageInfo:n,openUser:r,badges:i,SpaceQuotaComponent:o,onSelect:s,...l})=>{let u=c(),[d]=O.Children.toArray(t),f=s?(e,t)=>{A(t)&&s(e,t)}:void 0,m=(0,k.jsxs)(k.Fragment,{children:[d,i]}),h=(0,k.jsxs)(`div`,{className:E.wrapper,children:[(0,k.jsxs)(`div`,{className:E.field,children:[(0,k.jsx)(a,{truncate:!0,fontSize:`13px`,fontWeight:400,className:E.text,children:u(`Owner`)}),n?(0,k.jsx)(a,{truncate:!0,fontSize:`13px`,fontWeight:400,className:E.text,children:u(`Storage`)}):null]}),(0,k.jsxs)(`div`,{className:E.field,children:[e.createdBy?(0,k.jsx)(`div`,{children:(0,k.jsx)(p,{isHovered:!0,truncate:!0,fontSize:`13px`,fontWeight:600,className:E.text,onClick:r,children:e.createdBy.displayName})}):null,n&&o?(0,k.jsx)(o,{className:E.spaceQuota,item:e,type:`room`,isReadOnly:!e?.security?.EditRoom}):null]})]});return(0,k.jsx)(ie,{...l,item:e,onSelect:f,topContent:m,bottomContent:h,className:E.templateTile})};try{j.displayName=`TemplateTile`,j.__docgenInfo={description:``,displayName:`TemplateTile`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/tiles/template-tile/index.tsx`,methods:[],props:{checked:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Whether the tile is selected.`,name:`checked`,required:!1,tags:{},type:{name:`boolean | undefined`}},isActive:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Whether the tile is the one being acted on, which keeps its hover background.`,name:`isActive`,required:!1,tags:{},type:{name:`boolean | undefined`}},isBlockingOperation:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Turns the pointer off while an operation is running over the tile: hover, clicks and right-clicks stop reaching it. It does not change how the tile looks.`,name:`isBlockingOperation`,required:!1,tags:{},type:{name:`boolean | undefined`}},item:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:"The template this tile stands for. Its `createdBy` fills the owner line and its `security.EditRoom` decides whether the quota control is read-only.",name:`item`,required:!0,tags:{},type:{name:`TemplateItem`}},onSelect:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:"Called with the new checked state and the `item`. A checked item that has no string `title` is dropped before it reaches you.",name:`onSelect`,required:!1,tags:{},type:{name:`((checked: boolean, item: TemplateItem) => void) | undefined`}},thumbnailClick:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Ignored. It reaches the base tile, which does not read it either.`,name:`thumbnailClick`,required:!1,tags:{},type:{name:`((e: MouseEvent<Element, MouseEvent>) => void) | undefined`}},getContextModel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Builds the menu shown on right-click. Without it the right-click menu never opens.`,name:`getContextModel`,required:!1,tags:{},type:{name:`(() => ContextMenuModel[]) | undefined`}},children:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`The tile's content. Only the first element is rendered, above the badges.`,name:`children`,required:!1,tags:{},type:{name:`ReactNode`}},indeterminate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Draws the checkbox in its indeterminate state.`,name:`indeterminate`,required:!1,tags:{},type:{name:`boolean | undefined`}},element:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all.`,name:`element`,required:!1,tags:{},type:{name:`ReactNode`}},contextOptions:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:"The menu's entries. Required — but the three-dot button appears only when `item` also carries a `contextOptions` key of its own.",name:`contextOptions`,required:!0,tags:{},type:{name:`ContextMenuModel[]`}},tileContextClick:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Called before the menu opens.`,name:`tileContextClick`,required:!1,tags:{},type:{name:`(() => void) | undefined`}},hideContextMenu:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Called when the menu closes.`,name:`hideContextMenu`,required:!1,tags:{},type:{name:`(() => void) | undefined`}},columnCount:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Ignored. It is required by the type and read by nothing — the lower half is a two-column list, not a grid.`,name:`columnCount`,required:!0,tags:{},type:{name:`number`}},badges:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Badges beside the content, in the upper half.`,name:`badges`,required:!1,tags:{},type:{name:`ReactNode`}},inProgress:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Replaces the icon and the checkbox with the kit's track loader.`,name:`inProgress`,required:!1,tags:{},type:{name:`boolean | undefined`}},showHotkeyBorder:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Draws the accent outline that marks the tile the keyboard is on.`,name:`showHotkeyBorder`,required:!1,tags:{},type:{name:`boolean | undefined`}},isEdit:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:`Renaming state: it removes the icon and the checkbox.`,name:`isEdit`,required:!1,tags:{},type:{name:`boolean | undefined`}},showStorageInfo:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:"Adds the storage line to the lower half. The value beside it appears only when `SpaceQuotaComponent` is given as well.",name:`showStorageInfo`,required:!1,tags:{},type:{name:`boolean | undefined`}},openUser:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:"Called when the owner's name is clicked. Required, even when the template has no `createdBy` and the name is never rendered.",name:`openUser`,required:!0,tags:{},type:{name:`() => void`}},SpaceQuotaComponent:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/tiles/template-tile/TemplateTile.types.tsx`,name:`TypeLiteral`}],description:'Renders the storage figure. It is handed the `item`, the literal type `"room"` and whether editing is allowed.',name:`SpaceQuotaComponent`,required:!1,tags:{},type:{name:`ComponentType<SpaceQuotaProps> | undefined`}}},tags:{}}}catch{}})))()}var N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{N=t(n()),m(),y(),f(),o(),te(),g(),i(),M(),_(),u(),P=r(),{fn:F}=__STORYBOOK_MODULE_TEST__,I=[{id:`option_edit`,key:`edit`,label:`Edit`,onClick:()=>{},disabled:!1},{id:`option_delete`,key:`delete`,label:`Delete`,onClick:()=>{},disabled:!1}],L=({item:e,className:t,isReadOnly:n,withoutLimitQuota:r})=>{let i=e,o=`${Math.round(i.usedSpace/1048576)} MB`,s=i.quotaLimit?`${Math.round(i.quotaLimit/1048576)} MB`:`Unlimited`,c=[{id:`info-account-quota_edit`,key:`change-quota`,label:`Change Quota`,action:`change`},{id:`info-account-quota_current-size`,key:`current-size`,label:s,action:`current-size`},{id:`info-account-quota_no-quota`,key:`no-quota`,label:i.quotaLimit===-1?`Unlimited`:`Disable Quota`,action:`no-quota`}];if(r||i?.quotaLimit===void 0)return(0,P.jsx)(a,{fontWeight:600,children:o});if(n)return(0,P.jsxs)(a,{fontWeight:600,style:{display:`contents`},children:[o,` / `,s]});let l=c.find(e=>e.action===(i.quotaLimit===-1?`no-quota`:`current-size`))||c[1];return(0,P.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`},className:t,children:[(0,P.jsxs)(a,{fontWeight:600,children:[o,` / `]}),(0,P.jsx)(ne,{style:{flex:1,minWidth:0,padding:0},selectedOption:l,size:ee.content,options:c,onSelect:()=>{},scaled:!1,modernView:!0,manualWidth:`auto`,directionY:`both`})]})},R=(0,P.jsx)(h,{}),z=(0,P.jsx)(`div`,{className:`badges`,children:(0,P.jsx)(d,{iconNode:(0,P.jsx)(b,{}),onClick:()=>{},className:`badge icons-group`,size:s.medium,hoverColor:`accent`,clickColor:`accent`})}),B={id:`template-1`,title:`Sample Template`,createdBy:{id:`user-1`,displayName:`Team member`},security:{EditRoom:!0},usedSpace:47185920,isCustomQuota:!0,contextOptions:I},V={title:`UI/Tiles/TemplateTile`,component:j,parameters:{},argTypes:{checked:{control:`boolean`,description:`Ticks the checkbox and keeps it in place of the icon, and tints the tile`,table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Keeps the hover background on the tile being acted on`,table:{defaultValue:{summary:`false`}}},isBlockingOperation:{control:`boolean`,description:`Stops the tile answering hover, clicks and right-clicks; it looks the same as an idle tile`,table:{defaultValue:{summary:`false`}}},indeterminate:{control:`boolean`,description:`Draws the checkbox half-filled; it shows while the checkbox does, that is on hover or when the tile is checked`,table:{defaultValue:{summary:`false`}}},inProgress:{control:`boolean`,description:`Replaces the icon and the checkbox with a small loader`,table:{defaultValue:{summary:`false`}}},showHotkeyBorder:{control:`boolean`,description:`Turns the tile's border the accent colour, to mark the one the keyboard is on`,table:{defaultValue:{summary:`false`}}},isEdit:{control:`boolean`,description:`Removes the icon and the checkbox while the template is renamed, and stops hovering from tinting the tile`,table:{defaultValue:{summary:`false`}}},showStorageInfo:{control:`boolean`,description:"Adds a storage line under the owner; its figure appears only when `SpaceQuotaComponent` is given too",table:{defaultValue:{summary:`false`}}},item:{control:`object`,description:"The template the tile stands for, passed back through `onSelect`. Its `createdBy` fills the owner line, `security.EditRoom` decides whether the storage figure can be changed, and a `contextOptions` key on it is what draws the three-dot button"},children:{control:!1,description:"The name beside the icon, usually a `TileContent`; only the first element is shown"},element:{control:!1,description:`The template icon beside the name; without it the tile has neither the icon nor the checkbox`},badges:{control:!1,description:`Action buttons after the name`},SpaceQuotaComponent:{control:!1,description:'Draws the storage figure; it is handed the item, the type `"room"` and whether the figure is read-only'},contextOptions:{control:`object`,description:`Entries of the menu opened by the three-dot button`},getContextModel:{control:!1,description:`Returns the entries of the menu opened by a right-click; without it a right-click opens nothing`},onSelect:{description:`Called with the new checked state and the item from the checkbox, and when the icon is tapped on a phone`},openUser:{description:`Called when the owner's name is clicked`},tileContextClick:{description:`Called just before the menu opens`},hideContextMenu:{description:`Called when the menu closes`},columnCount:{control:!1,description:`Ignored: the type requires it, and nothing in the tile reads it`},thumbnailClick:{control:!1,description:`Ignored: nothing in the tile calls it`}},args:{onSelect:F(),openUser:F(),tileContextClick:F(),hideContextMenu:F()}},H=({checked:e,onSelect:t,...n})=>{let[r,i]=(0,N.useState)(e),a=(e,n)=>{i(e),t?.(e,n)};return(0,P.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,P.jsx)(j,{...n,checked:r,onSelect:a,children:(0,P.jsx)(v,{children:(0,P.jsx)(p,{children:`Template Content`})})})})},U={render:H,args:{item:B,element:R,contextOptions:I,badges:z,showStorageInfo:!0,getContextModel:()=>I,columnCount:1,SpaceQuotaComponent:L},parameters:{docs:{description:{story:"A template with its owner and the storage it uses: the icon, the name with a create-room button, the menu, and the two lines below. Hover the icon and tick the checkbox to select it, click the owner to see `openUser` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<TemplateTile
  item={{ id: "template-1", title: "Sample Template", createdBy: { id: "user-1", displayName: "Team member" }, contextOptions }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
  getContextModel={() => contextOptions}
  columnCount={1}
  openUser={openOwnerProfile}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},W={render:H,args:{...U.args,checked:!0},parameters:{docs:{description:{story:"A selected template, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the tile is tinted (`checked`)."},source:{code:`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},G={render:H,args:{...U.args,showStorageInfo:!0,SpaceQuotaComponent:L,item:{...B,quotaLimit:104857600,isCustomQuota:!0}},parameters:{docs:{description:{story:"A template with a storage limit the reader may change: the storage line shows the space used and a drop-down with the limit, both drawn by the host's quota component (`showStorageInfo`, `SpaceQuotaComponent`, `security.EditRoom`)."},source:{code:`<TemplateTile
  item={{ ...item, quotaLimit: 104857600 }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},K={render:H,args:{...U.args,showStorageInfo:!0,SpaceQuotaComponent:L,item:{...B,quotaLimit:104857600,security:{EditRoom:!1}}},parameters:{docs:{description:{story:"The same template for a reader who may not edit it: the tile tells the quota component the figure is read-only, so it shows the used space and the limit as plain text (`security.EditRoom: false`)."},source:{code:`<TemplateTile
  item={{ ...item, quotaLimit: 104857600, security: { EditRoom: false } }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},q={render:H,args:{...U.args,isBlockingOperation:!0},parameters:{docs:{description:{story:"A template an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle template, so show the operation somewhere else."},source:{code:`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},J={render:H,args:{...U.args,inProgress:!0},parameters:{docs:{description:{story:"A template that is busy, being saved or copied: a small loader stands where the icon and the checkbox were (`inProgress`)."},source:{code:`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  inProgress
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},Y={render:H,args:{...U.args,showHotkeyBorder:!0},parameters:{docs:{description:{story:"The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself."},source:{code:`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},X={render:H,args:{...U.args,isEdit:!0},parameters:{docs:{description:{story:"A template whose name is being edited: the icon and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (`isEdit`)."},source:{code:`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`}}}},Z={render:()=>(0,P.jsx)(`div`,{style:{"--tile-bg":`#f4f9fd`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`,"--tile-icon-color":`#0082c9`,"--tile-sub-color":`#006fa6`,"--tile-hotkey-color":`#e0662e`},children:[!1,!0].map(e=>(0,P.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,P.jsx)(j,{item:B,element:R,contextOptions:I,badges:z,showStorageInfo:!0,showHotkeyBorder:e,openUser:()=>{},getContextModel:()=>I,columnCount:1,SpaceQuotaComponent:L,children:(0,P.jsx)(v,{children:(0,P.jsx)(p,{children:e?`Team Template`:`Sample Template`})})})},String(e)))}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page.\n\nTwo instances:\n- **Sample Template** — for every variable but the hotkey colour; hover it for `--tile-hover-bg`.\n- **Team Template** — `showHotkeyBorder`, for `--tile-hotkey-color`."},source:{code:`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-sub-color": "#006fa6",
  "--tile-hotkey-color": "#e0662e",
}}>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota}>
    <TileContent><Link>Sample Template</Link></TileContent>
  </TemplateTile>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota} showHotkeyBorder>
    <TileContent><Link>Team Template</Link></TileContent>
  </TemplateTile>
</div>`}}}},Q=[`Default`,`Checked`,`WithSpaceQuota`,`WithReadOnlyQuota`,`BlockingOperation`,`InProgress`,`WithHotkeyBorder`,`RenamingState`,`CssCustomization`],U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: defaultItem,
    element,
    contextOptions,
    badges,
    showStorageInfo: true,
    getContextModel: () => contextOptions,
    columnCount: 1,
    SpaceQuotaComponent: MockSpaceQuota
  },
  parameters: {
    docs: {
      description: {
        story: "A template with its owner and the storage it uses: the icon, the name with a create-room button, the menu, and the two lines below. Hover the icon and tick the checkbox to select it, click the owner to see \`openUser\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TemplateTile
  item={{ id: "template-1", title: "Sample Template", createdBy: { id: "user-1", displayName: "Team member" }, contextOptions }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
  getContextModel={() => contextOptions}
  columnCount={1}
  openUser={openOwnerProfile}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "A selected template, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the tile is tinted (\`checked\`)."
      },
      source: {
        code: \`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    showStorageInfo: true,
    SpaceQuotaComponent: MockSpaceQuota,
    item: {
      ...defaultItem,
      quotaLimit: 1024 * 1024 * 100,
      // 100 MB
      isCustomQuota: true
    } as StoryTemplateItem
  },
  parameters: {
    docs: {
      description: {
        story: "A template with a storage limit the reader may change: the storage line shows the space used and a drop-down with the limit, both drawn by the host's quota component (\`showStorageInfo\`, \`SpaceQuotaComponent\`, \`security.EditRoom\`)."
      },
      source: {
        code: \`<TemplateTile
  item={{ ...item, quotaLimit: 104857600 }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    showStorageInfo: true,
    SpaceQuotaComponent: MockSpaceQuota,
    item: {
      ...defaultItem,
      quotaLimit: 1024 * 1024 * 100,
      // 100 MB
      security: {
        EditRoom: false
      }
    } as StoryTemplateItem
  },
  parameters: {
    docs: {
      description: {
        story: "The same template for a reader who may not edit it: the tile tells the quota component the figure is read-only, so it shows the used space and the limit as plain text (\`security.EditRoom: false\`)."
      },
      source: {
        code: \`<TemplateTile
  item={{ ...item, quotaLimit: 104857600, security: { EditRoom: false } }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true
  },
  parameters: {
    docs: {
      description: {
        story: "A template an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (\`isBlockingOperation\`). It looks the same as an idle template, so show the operation somewhere else."
      },
      source: {
        code: \`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "A template that is busy, being saved or copied: a small loader stands where the icon and the checkbox were (\`inProgress\`)."
      },
      source: {
        code: \`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  inProgress
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
        code: \`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: "A template whose name is being edited: the icon and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (\`isEdit\`)."
      },
      source: {
        code: \`<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#f4f9fd",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-icon-color": "#0082c9",
    "--tile-sub-color": "#006fa6",
    "--tile-hotkey-color": "#e0662e"
  } as CSSProperties}>
      {[false, true].map(showHotkeyBorder => <div key={String(showHotkeyBorder)} style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
          <TemplateTile item={defaultItem} element={element} contextOptions={contextOptions} badges={badges} showStorageInfo={true} showHotkeyBorder={showHotkeyBorder} openUser={() => {}} getContextModel={() => contextOptions} columnCount={1} SpaceQuotaComponent={MockSpaceQuota}>
            <TileContent>
              <Link>
                {showHotkeyBorder ? "Team Template" : "Sample Template"}
              </Link>
            </TileContent>
          </TemplateTile>
        </div>)}
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page.

Two instances:
- **Sample Template** — for every variable but the hotkey colour; hover it for \\\`--tile-hover-bg\\\`.
- **Team Template** — \\\`showHotkeyBorder\\\`, for \\\`--tile-hotkey-color\\\`.\`
      },
      source: {
        code: \`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-sub-color": "#006fa6",
  "--tile-hotkey-color": "#e0662e",
}}>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota}>
    <TileContent><Link>Sample Template</Link></TileContent>
  </TemplateTile>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota} showHotkeyBorder>
    <TileContent><Link>Team Template</Link></TileContent>
  </TemplateTile>
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{q as BlockingOperation,W as Checked,Z as CssCustomization,U as Default,J as InProgress,X as RenamingState,Y as WithHotkeyBorder,K as WithReadOnlyQuota,G as WithSpaceQuota,Q as __namedExportsOrder,V as default};