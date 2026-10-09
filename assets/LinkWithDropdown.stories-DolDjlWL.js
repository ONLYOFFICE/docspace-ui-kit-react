import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,n as a,r as ee,t as te}from"./drop-down-H7nHxgOI.js";import{t as o}from"./classnames-CfLRLWYq.js";import{t as s}from"./lib-pfr_EXpQ.js";import{r as c,t as ne}from"./text-Cz_cI6Yf.js";import{n as l,t as re}from"./Scrollbar-Tkb6Sv30.js";import{n as u,t as ie}from"./expander-down.react-CtlTnAfF.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{d=`_span_3eabo_1`,f=`_dropDownItem_3eabo_57`,p=`_fixedMaxWidth_3eabo_60`,m=`_expander_3eabo_63`,h=`_isOpen_3eabo_73`,g=`_text_3eabo_77`,_=`_textOverflow_3eabo_80`,v=`_linkWithDropdown_3eabo_84`,y=`_disabled_3eabo_92`,b=`_semitransparent_3eabo_96`,x=`_alwaysDashed_3eabo_99`,S=`_appearDashedAfterHover_3eabo_114`,C=`_textWithExpander_3eabo_121`,w={span:d,dropDownItem:f,fixedMaxWidth:p,expander:m,isOpen:h,text:g,textOverflow:_,linkWithDropdown:v,disabled:y,semitransparent:b,alwaysDashed:x,appearDashedAfterHover:S,textWithExpander:C}})))()}var E,D,O,k,A;function j(){return(j=e((()=>{E=t(n()),D=s(),O=t(o()),u(),a(),i(),l(),c(),T(),k=r(),A=({isSemitransparent:e=!1,dropdownType:t=`alwaysDashed`,isTextOverflow:n=!1,fontSize:r=`13px`,fontWeight:i,color:a,isBold:o=!1,title:s,className:c=``,data:l,id:u,style:d,isDisabled:f=!1,directionX:p,directionY:m,hasScroll:h=!1,withExpander:g=!1,dropDownClassName:_,isOpen:v=!1,children:y,manualWidth:b,isAside:x,withoutBackground:S,fixedDirection:C=!1,isDefaultMode:T=!0,topSpace:A,bottomSpace:j,withDynamicScrollbar:M,...N})=>{let P=(0,E.useRef)(null),[F,I]=(0,E.useState)({isOpen:v,orientation:window.orientation}),L=e=>I(t=>({...t,isOpen:e})),R=()=>{I(e=>({...e,orientation:window.orientation}))},z=()=>{f||L(!F.isOpen)},B=()=>{if(P.current){let e=P.current.querySelector(`.text`)?.getBoundingClientRect().width;if(e)return`${e+32}px`}},V=e=>{let t=e.target;P.current&&P.current.contains(t)||L(!F.isOpen)},H=e=>{let{key:t}=e.currentTarget.dataset,n=l?.find(e=>e.key===t);L(!F.isOpen),n&&`onClick`in n&&n.onClick?.(e)};(0,E.useEffect)(()=>(window.addEventListener(`orientationchange`,R),()=>{window.removeEventListener(`orientationchange`,R)}),[]),(0,E.useEffect)(()=>{L(v)},[t,v]);let U=h&&D.isMobileOnly,W=F.orientation===90?100:250,G=l?.map(e=>{let{key:t,...r}=e;return(0,k.jsx)(ee,{...r,className:(0,O.default)(w.dropDownItem,`drop-down-item`),id:`${e.key}`,onClick:H,testId:`link_with_drop_down_${e.key}`,"data-key":e.key,textOverflow:n},t)}),K=(0,k.jsx)(ne,{as:`span`,className:(0,O.default)(w.text,{[w.textOverflow]:n}),truncate:n,fontSize:r,fontWeight:i,color:a,isBold:o,title:s,children:y});return(0,k.jsxs)(`span`,{id:u,style:d,className:(0,O.default)(w.span,{[w.isOpen]:F.isOpen},c),"data-test-id":`link-dropdown`,ref:P,children:[(0,k.jsx)(`span`,{onClick:z,children:(0,k.jsx)(`a`,{className:(0,O.default)(w.linkWithDropdown,{[w.disabled]:f,[w.semitransparent]:e,[w.alwaysDashed]:t===`alwaysDashed`,[w.appearDashedAfterHover]:t===`appearDashedAfterHover`},c),style:{color:a},role:`button`,"aria-haspopup":`true`,"aria-expanded":F.isOpen,"aria-disabled":f,...N,children:g?(0,k.jsxs)(`div`,{className:(0,O.default)(w.textWithExpander,{[w.isOpen]:F.isOpen},c),children:[K,(0,k.jsx)(ie,{className:w.expander})]}):K})}),(0,k.jsx)(te,{className:(0,O.default)(`fixed-max-width`,_||``,w.fixedMaxWidth)||``,manualWidth:b||(U?B():void 0),open:F.isOpen,fixedDirection:C,isDefaultMode:T,forwardedRef:P,directionX:p,directionY:m,clickOutsideAction:V,isAside:x,withoutBackground:S,topSpace:A,bottomSpace:j,withDynamicScrollbar:M,...N,children:U?(0,k.jsx)(re,{className:`scroll-drop-down-item`,style:{height:W},children:G}):G})]})};try{A.displayName=`LinkWithDropdown`,A.__docgenInfo={description:``,displayName:`LinkWithDropdown`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.tsx`,methods:[],props:{isBold:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the text is bold.`,name:`isBold`,required:!1,tags:{},type:{name:`boolean | undefined`}},fontSize:{defaultValue:{value:`13px`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Font size of the text, as a CSS length.`,name:`fontSize`,required:!1,tags:{},type:{name:`string | undefined`}},fontWeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Font weight of the text.`,name:`fontWeight`,required:!1,tags:{},type:{name:`number | undefined`}},isTextOverflow:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the text is truncated with an ellipsis at 200px instead of wrapping.`,name:`isTextOverflow`,required:!1,tags:{},type:{name:`boolean | undefined`}},isHovered:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Ignored. Nothing reads this prop; the hover state comes from CSS.`,name:`isHovered`,required:!1,tags:{},type:{name:`boolean | undefined`}},isSemitransparent:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the link is drawn at half opacity, the portal's "pending" look.`,name:`isSemitransparent`,required:!1,tags:{},type:{name:`boolean | undefined`}},color:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`CSS colour of the text.`,name:`color`,required:!1,tags:{},type:{name:`string | undefined`}},title:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"`title` attribute of the text — the browser's own tooltip for a truncated label.",name:`title`,required:!1,tags:{},type:{name:`string | undefined`}},isDisabled:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the link is inert: it greys out and clicking no longer opens the menu.`,name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},dropdownType:{defaultValue:{value:`alwaysDashed`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the dashed underline is always drawn or appears on hover.`,name:`dropdownType`,required:!1,tags:{},type:{name:`TDropdownType | undefined`}},data:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"Entries of the menu. Each is a `DropDownItem`'s props; `key` is required, and `onClick` is called with the event.",name:`data`,required:!1,tags:{},type:{name:`ContextMenuModel[] | undefined`}},children:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Text of the link.`,name:`children`,required:!1,tags:{},type:{name:`ReactNode`}},withExpander:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether a chevron is drawn after the text, which turns over while the menu is open.`,name:`withExpander`,required:!1,tags:{},type:{name:`boolean | undefined`}},isOpen:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the menu starts open. The component then keeps that state itself; changing this prop re-syncs it.`,name:`isOpen`,required:!1,tags:{},type:{name:`boolean | undefined`}},className:{defaultValue:{value:``},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element, and to the link inside it.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},dropDownClassName:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Applied to the menu.`,name:`dropDownClassName`,required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element.`,name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element as inline style.`,name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},directionX:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:'Which side of the link the menu is aligned to. Passed straight to `DropDown`, which defaults to `"right"`.',name:`directionX`,required:!1,tags:{},type:{name:`TDirectionX | undefined`}},directionY:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:'Whether the menu opens above or below the link. Passed straight to `DropDown`, which defaults to `"bottom"`.',name:`directionY`,required:!1,tags:{},type:{name:`TDirectionY | undefined`}},hasScroll:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the menu is wrapped in a scrollbar of its own. It only takes effect on a phone.`,name:`hasScroll`,required:!1,tags:{},type:{name:`boolean | undefined`}},manualWidth:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry.`,name:`manualWidth`,required:!1,tags:{},type:{name:`string | undefined`}},isAside:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Passed to the menu's backdrop, which then keeps an aside panel above itself.`,name:`isAside`,required:!1,tags:{},type:{name:`boolean | undefined`}},withoutBackground:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Passed to the menu's backdrop: makes it transparent.`,name:`withoutBackground`,required:!1,tags:{},type:{name:`boolean | undefined`}},fixedDirection:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"Whether the menu keeps `directionX` and `directionY` even when it does not fit there.",name:`fixedDirection`,required:!1,tags:{},type:{name:`boolean | undefined`}},isDefaultMode:{defaultValue:{value:`true`},declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place.",name:`isDefaultMode`,required:!1,tags:{},type:{name:`boolean | undefined`}},topSpace:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"(`withDynamicScrollbar` only) Space to leave above the menu, in pixels.",name:`topSpace`,required:!1,tags:{},type:{name:`number | undefined`}},bottomSpace:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:"(`withDynamicScrollbar` only) Space to leave below the menu, in pixels.",name:`bottomSpace`,required:!1,tags:{},type:{name:`number | undefined`}},withDynamicScrollbar:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/link-with-dropdown/LinkWithDropdown.types.ts`,name:`TypeLiteral`}],description:`Whether the menu measures the room around the link on every open and scrolls inside what is left.`,name:`withDynamicScrollbar`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}})))()}var M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{j(),M=r(),{fn:N}=__STORYBOOK_MODULE_TEST__,P={title:`UI/Interactive elements/LinkWithDropdown`,component:A,parameters:{},argTypes:{children:{control:`text`,description:`Text of the link`},data:{control:`object`,description:"Entries of the menu, each with the props of a `DropDownItem`: a required `key`, a `label`, an `onClick` called with the click event, or `isSeparator` for a divider line"},fontSize:{control:`text`,description:`Font size of the link text`,table:{defaultValue:{summary:`13px`}}},fontWeight:{control:`number`,description:`Font weight of the text, as a number`},isBold:{control:`boolean`,description:`Quick way to make text bold`,table:{defaultValue:{summary:`false`}}},color:{control:`color`,description:`Text color of the link`},isDisabled:{control:`boolean`,description:`Makes the link inert: clicking no longer opens the menu and the cursor stays an arrow`,table:{defaultValue:{summary:`false`}}},withExpander:{control:`boolean`,description:`Draws a chevron after the text, which turns over while the menu is open`,table:{defaultValue:{summary:`false`}}},isSemitransparent:{control:`boolean`,description:`Draws the link at half opacity`,table:{defaultValue:{summary:`false`}}},isTextOverflow:{control:`boolean`,description:`Truncates the text with an ellipsis at 200px instead of wrapping it`,table:{defaultValue:{summary:`false`}}},dropdownType:{control:`select`,options:[`alwaysDashed`,`appearDashedAfterHover`],description:`Whether the dashed underline is always drawn or appears on hover. Currently neither value draws an underline`,table:{defaultValue:{summary:`alwaysDashed`}}},manualWidth:{control:`text`,description:`Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry`},directionY:{control:`select`,options:[`top`,`bottom`,`both`],description:"Whether the menu opens above or below the link; `both` opens it below unless it would run off the bottom of the window",table:{defaultValue:{summary:`bottom`}}},fixedDirection:{control:`boolean`,description:`Keeps the menu on the chosen sides even when it does not fit there, instead of flipping it`,table:{defaultValue:{summary:`false`}}},directionX:{control:`select`,options:[`left`,`right`],description:`Which side of the link the menu is aligned to`,table:{defaultValue:{summary:`right`}}},isOpen:{control:`boolean`,description:`Whether the menu starts open. The link then keeps that state itself; changing this prop re-syncs it`,table:{defaultValue:{summary:`false`}}},isDefaultMode:{control:`boolean`,description:"Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place",table:{defaultValue:{summary:`true`}}},title:{control:`text`,description:"Tooltip text for the label. It opens the kit's shared tooltip, which appears only where the page mounts `RootTooltip`; no native `title` attribute is set"},hasScroll:{control:`boolean`,description:`Wraps the menu in a scrollbar of its own, 250px tall (100px in landscape). It only takes effect on a phone`,table:{defaultValue:{summary:`false`}}},withDynamicScrollbar:{control:`boolean`,description:`Measures the room around the link on every open and scrolls the menu inside what is left`},topSpace:{control:`number`,description:"(`withDynamicScrollbar` only) Space to leave above the menu, in pixels"},bottomSpace:{control:`number`,description:"(`withDynamicScrollbar` only) Space to leave below the menu, in pixels"},isAside:{control:`boolean`,description:`Passed to the menu's backdrop, which then keeps an aside panel above itself`},withoutBackground:{control:`boolean`,description:`Passed to the menu's backdrop: makes it transparent`},className:{control:`text`,description:`Class added to the outermost element and to the link inside it`},dropDownClassName:{control:`text`,description:`Class added to the menu`},id:{control:`text`,description:"`id` of the outermost element"},style:{control:`object`,description:`Inline style of the outermost element`},isHovered:{control:!1,description:`Ignored. Nothing reads this prop; the hover look comes from CSS`}},decorators:[e=>(0,M.jsx)(`div`,{style:{padding:`20px`,marginBottom:`200px`},children:(0,M.jsx)(e,{})})]},F=[{key:`key1`,label:`Button 1`,onClick:N().mockName(`Button 1`)},{key:`key2`,label:`Button 2`,onClick:N().mockName(`Button 2`)},{key:`key3`,isSeparator:!0},{key:`key4`,label:`Button 3`,onClick:N().mockName(`Button 3`)}],I={render:e=>(0,M.jsx)(A,{...e}),args:{children:`Default Link`,data:F,fontSize:`13px`,fontWeight:400,isBold:!1,isTextOverflow:!1,isSemitransparent:!1,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1},parameters:{docs:{description:{story:"The link with a three-item menu; click it to open the menu, pick an entry to see its `onClick` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<LinkWithDropdown
  data={[
    { key: "key1", label: "Button 1", onClick: handleClick },
    { key: "key2", label: "Button 2", onClick: handleClick },
    { key: "key3", isSeparator: true },
    { key: "key4", label: "Button 3", onClick: handleClick },
  ]}
>
  Default Link
</LinkWithDropdown>`}}}},L=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,withExpander:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Link with Expander`}),R={render:()=>(0,M.jsx)(L,{}),parameters:{docs:{description:{story:`Link with an expander arrow icon that indicates the presence of a dropdown menu.`},source:{code:`<LinkWithDropdown data={items} withExpander>Link with Expander</LinkWithDropdown>`}}}},z=()=>(0,M.jsx)(A,{data:F,fontSize:`16px`,fontWeight:600,isBold:!0,color:`#4781d1`,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Custom Styled Link`}),B={render:()=>(0,M.jsx)(z,{}),parameters:{docs:{description:{story:`Link with custom font size, weight, and color for styled appearance.`},source:{code:`<LinkWithDropdown data={items} fontSize="16px" fontWeight={600} isBold color="#4781d1">
  Custom Styled Link
</LinkWithDropdown>`}}}},V=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,isDisabled:!0,children:`Disabled Link`}),H={render:()=>(0,M.jsx)(V,{}),parameters:{docs:{description:{story:"Use it while the options do not apply yet: clicking no longer opens the menu and the cursor stays an arrow (`isDisabled`). In the light theme the text keeps the default grey, so the state is not visible until the link is clicked."},source:{code:`<LinkWithDropdown data={items} isDisabled>Disabled Link</LinkWithDropdown>`}}}},U=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,isSemitransparent:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Semi-transparent Link`}),W={render:()=>(0,M.jsx)(U,{}),parameters:{docs:{description:{story:`Link with reduced opacity for a subtle, secondary appearance.`},source:{code:`<LinkWithDropdown data={items} isSemitransparent>Semi-transparent Link</LinkWithDropdown>`}}}},G=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,manualWidth:`300px`,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Custom Width Link`}),K={render:()=>(0,M.jsx)(G,{}),parameters:{docs:{description:{story:`Link with a manually set dropdown width for controlling the menu size.`},source:{code:`<LinkWithDropdown data={items} manualWidth="300px">Custom Width Link</LinkWithDropdown>`}}}},q=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,isTextOverflow:!0,withExpander:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`A long link label that does not fit in the available width`}),J={render:()=>(0,M.jsx)(q,{}),parameters:{docs:{description:{story:"Use it where a label can be longer than its place: the text stops at 200px with an ellipsis and the chevron stays beside it (`isTextOverflow`)."},source:{code:`<LinkWithDropdown
  data={items}
  isTextOverflow
  withExpander
>
  A long link label that does not fit in the available width
</LinkWithDropdown>`}}}},Y=()=>(0,M.jsx)(A,{data:F,fontSize:`13px`,withExpander:!0,isOpen:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Open Link`}),X={render:()=>(0,M.jsx)(Y,{}),parameters:{docs:{description:{story:"The menu shown on first render (`isOpen`): the link keeps its highlighted background and the chevron points up while the menu is open. Clicking outside or picking an entry closes it."},source:{code:`<LinkWithDropdown data={items} withExpander isOpen>
  Open Link
</LinkWithDropdown>`}}}},Z={render:()=>(0,M.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,"--link-with-dropdown-color":`#7c3aed`,"--link-with-dropdown-bg":`#f5f3ff`,"--link-with-dropdown-hover-color":`#5b21b6`,"--link-with-dropdown-hover-bg":`#ddd6fe`,"--link-with-dropdown-disabled-color":`#c4b5fd`,"--link-with-dropdown-radius":`8px`,"--link-with-dropdown-padding":`6px 12px`},children:[(0,M.jsx)(A,{data:F,fontSize:`13px`,withExpander:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,children:`Customized Link`}),(0,M.jsx)(A,{data:F,fontSize:`13px`,isDisabled:!0,children:`Disabled Link`})]}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. The first link shows the text, background, radius and padding variables; hover it or open its menu to see the hover pair. The second, with `isDisabled`, is there for `--link-with-dropdown-disabled-color`."},source:{code:`<div
  style={{
    "--link-with-dropdown-color": "#7c3aed",
    "--link-with-dropdown-bg": "#f5f3ff",
    "--link-with-dropdown-hover-color": "#5b21b6",
    "--link-with-dropdown-hover-bg": "#ddd6fe",
    "--link-with-dropdown-disabled-color": "#c4b5fd",
    "--link-with-dropdown-radius": "8px",
    "--link-with-dropdown-padding": "6px 12px",
  }}
>
  <LinkWithDropdown data={items} withExpander>
    Customized Link
  </LinkWithDropdown>
  <LinkWithDropdown data={items} isDisabled>
    Disabled Link
  </LinkWithDropdown>
</div>`}}}},Q=[`Default`,`WithExpander`,`CustomStyling`,`Disabled`,`SemiTransparent`,`WithCustomWidth`,`TextOverflow`,`OpenMenu`,`CssCustomization`],I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <LinkWithDropdown {...args} />,
  args: {
    children: "Default Link",
    data: dropdownItems,
    fontSize: "13px",
    fontWeight: 400,
    isBold: false,
    isTextOverflow: false,
    isSemitransparent: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false
  },
  parameters: {
    docs: {
      description: {
        story: "The link with a three-item menu; click it to open the menu, pick an entry to see its \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<LinkWithDropdown
  data={[
    { key: "key1", label: "Button 1", onClick: handleClick },
    { key: "key2", label: "Button 2", onClick: handleClick },
    { key: "key3", isSeparator: true },
    { key: "key4", label: "Button 3", onClick: handleClick },
  ]}
>
  Default Link
</LinkWithDropdown>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <WithExpanderTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Link with an expander arrow icon that indicates the presence of a dropdown menu."
      },
      source: {
        code: \`<LinkWithDropdown data={items} withExpander>Link with Expander</LinkWithDropdown>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Link with custom font size, weight, and color for styled appearance."
      },
      source: {
        code: \`<LinkWithDropdown data={items} fontSize="16px" fontWeight={600} isBold color="#4781d1">
  Custom Styled Link
</LinkWithDropdown>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it while the options do not apply yet: clicking no longer opens the menu and the cursor stays an arrow (\`isDisabled\`). In the light theme the text keeps the default grey, so the state is not visible until the link is clicked."
      },
      source: {
        code: \`<LinkWithDropdown data={items} isDisabled>Disabled Link</LinkWithDropdown>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <SemiTransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Link with reduced opacity for a subtle, secondary appearance."
      },
      source: {
        code: \`<LinkWithDropdown data={items} isSemitransparent>Semi-transparent Link</LinkWithDropdown>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <WithCustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Link with a manually set dropdown width for controlling the menu size."
      },
      source: {
        code: \`<LinkWithDropdown data={items} manualWidth="300px">Custom Width Link</LinkWithDropdown>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it where a label can be longer than its place: the text stops at 200px with an ellipsis and the chevron stays beside it (\`isTextOverflow\`)."
      },
      source: {
        code: \`<LinkWithDropdown
  data={items}
  isTextOverflow
  withExpander
>
  A long link label that does not fit in the available width
</LinkWithDropdown>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <OpenMenuTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The menu shown on first render (\`isOpen\`): the link keeps its highlighted background and the chevron points up while the menu is open. Clicking outside or picking an entry closes it."
      },
      source: {
        code: \`<LinkWithDropdown data={items} withExpander isOpen>
  Open Link
</LinkWithDropdown>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "16px",
    "--link-with-dropdown-color": "#7c3aed",
    "--link-with-dropdown-bg": "#f5f3ff",
    "--link-with-dropdown-hover-color": "#5b21b6",
    "--link-with-dropdown-hover-bg": "#ddd6fe",
    "--link-with-dropdown-disabled-color": "#c4b5fd",
    "--link-with-dropdown-radius": "8px",
    "--link-with-dropdown-padding": "6px 12px"
  } as CSSProperties}>
      <LinkWithDropdown data={dropdownItems} fontSize="13px" withExpander directionY="bottom" fixedDirection isDefaultMode={false}>
        Customized Link
      </LinkWithDropdown>
      <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
        Disabled Link
      </LinkWithDropdown>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The first link shows the text, background, radius and padding variables; hover it or open its menu to see the hover pair. The second, with \\\`isDisabled\\\`, is there for \\\`--link-with-dropdown-disabled-color\\\`.\`
      },
      source: {
        code: \`<div
  style={{
    "--link-with-dropdown-color": "#7c3aed",
    "--link-with-dropdown-bg": "#f5f3ff",
    "--link-with-dropdown-hover-color": "#5b21b6",
    "--link-with-dropdown-hover-bg": "#ddd6fe",
    "--link-with-dropdown-disabled-color": "#c4b5fd",
    "--link-with-dropdown-radius": "8px",
    "--link-with-dropdown-padding": "6px 12px",
  }}
>
  <LinkWithDropdown data={items} withExpander>
    Customized Link
  </LinkWithDropdown>
  <LinkWithDropdown data={items} isDisabled>
    Disabled Link
  </LinkWithDropdown>
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Z as CssCustomization,B as CustomStyling,I as Default,H as Disabled,X as OpenMenu,W as SemiTransparent,J as TextOverflow,K as WithCustomWidth,R as WithExpander,Q as __namedExportsOrder,P as default};