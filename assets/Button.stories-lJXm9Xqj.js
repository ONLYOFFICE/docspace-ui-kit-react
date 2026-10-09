import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,r,t as i}from"./button-DjDXE7uo.js";import{n as a,t as o}from"./catalog.folder.react-BLNaFnHq.js";import{n as s,t as c}from"./button.alert.react-CZQZne9C.js";import{n as l,t as u}from"./article-hide-menu-icon.react-nlNoqVc4.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{s(),l(),a(),n(),d=t(),f={title:`UI/Interactive elements/Button`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-3582&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{size:{control:`select`,options:Object.values(r),description:"Height of the button: 24px for `extraSmall`, 32px for `small`, 40px for `normal`, 44px for `medium`",table:{defaultValue:{summary:`normal`}}},primary:{control:`boolean`,description:`Draws the button in the accent colour, for the main action of a view`,table:{defaultValue:{summary:`false`}}},accent:{control:`boolean`,description:`Draws the button on a light tint of the accent colour, with the text and icon in the accent colour`,table:{defaultValue:{summary:`false`}}},scale:{control:`boolean`,description:`Stretches the button to the full width of its container`,table:{defaultValue:{summary:`false`}}},filled:{control:`boolean`,description:`Draws the button on a neutral grey surface with no border and paints its icon in the text colour`,table:{defaultValue:{summary:`false`}}},filledStroke:{control:`boolean`,description:"Used together with `filled`: outlines the icon's shapes instead of filling them, for outline-style icons; does nothing on its own",table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Greys the button out, takes it out of the tab order and blocks clicks`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:`Hides the content behind a spinner, keeping the button's width, and disables it`,table:{defaultValue:{summary:`false`}}},isHovered:{control:`boolean`,description:`Draws the hover look while the pointer is not over the button`,table:{defaultValue:{summary:`false`}}},isClicked:{control:`boolean`,description:`Draws the pressed look while nothing presses the button`,table:{defaultValue:{summary:`false`}}},label:{control:`text`,description:`Text of the button, which is also its accessible name; when empty, the children are shown instead`},children:{control:!1,description:"Content shown in place of `label` when `label` is empty"},icon:{control:!1,description:`Icon node shown before the label`},minWidth:{control:`text`,description:"Smallest width of the button as a CSS length, such as `120px`"},tooltipText:{control:`text`,description:`Text of a tooltip shown below the button on hover`},title:{control:`text`,description:"Text of a tooltip shown on hover; it never becomes a native `title` attribute"},type:{control:`select`,options:[`button`,`submit`],description:"Native button type: `submit` submits the surrounding form, any other value renders `button`",table:{defaultValue:{summary:`button`}}},onClick:{action:`onClick`,description:`Called with the mouse event when the button is clicked`},tabIndex:{control:`number`,description:`Position of the button in the keyboard tab order`},id:{control:`text`,description:"HTML id of the button; also names its `tooltipText` tooltip"},className:{control:`text`,description:`Class applied to the button after the component's own`},style:{control:`object`,description:`Inline styles of the button`},testId:{control:`text`,description:"Value of the button's `data-testid` attribute",table:{defaultValue:{summary:`button`}}},ref:{control:!1,description:"Ref to the rendered `<button>` element"},"aria-label":{control:!1,description:"Replaced by `label` on every render, so a value passed here never reaches the button"},"aria-disabled":{control:!1,description:"Replaced on every render: set to `true` while `isDisabled`, removed otherwise"},"aria-busy":{control:!1,description:"Replaced on every render: set to `true` while `isLoading`, removed otherwise"}}},p=e=>{let{isScale:t,children:n}=e;return(0,d.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:t?`1fr`:`repeat( auto-fill, minmax(180px, 1fr) )`,gridGap:`16px`,alignItems:`center`},children:n})},m={render:e=>(0,d.jsx)(i,{...e}),args:{size:r.small,label:`Button`},parameters:{docs:{description:{story:"The secondary button, for any action that is not the main one of a view; click it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<Button size={ButtonSize.small} label="Button" onClick={handleClick} />`}}}},h=()=>(0,d.jsx)(p,{isScale:!1,children:Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,scale:!1,size:e,label:`Primary ${e[0].toUpperCase()}${e.slice(1)}`,onClick:()=>{}},`all-primary-${e}`))}),g=()=>(0,d.jsx)(p,{isScale:!1,children:Object.keys(r).map(e=>(0,d.jsx)(i,{scale:!1,size:e,label:`Secondary ${e[0].toUpperCase()}${e.slice(1)}`},`all-secondary-${e}`))}),_=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,icon:(0,d.jsx)(c,{}),label:`With Icon ${e[0].toUpperCase()}${e.slice(1)}`},`all-icon-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,icon:(0,d.jsx)(c,{}),label:`With Icon ${e[0].toUpperCase()}${e.slice(1)}`},`all-icon-sec-${e}`))]}),v=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,isLoading:!0,label:`Loading ${e[0].toUpperCase()}${e.slice(1)}`},`all-load-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,isLoading:!0,label:`Loading ${e[0].toUpperCase()}${e.slice(1)}`},`all-load-sec-${e}`))]}),y=()=>(0,d.jsxs)(p,{isScale:!0,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,label:`Scale ${e[0].toUpperCase()}${e.slice(1)}`},`all-scale-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,label:`Scale ${e[0].toUpperCase()}${e.slice(1)}`},`all-scale-sec-${e}`))]}),b=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,isDisabled:!0,label:`Disabled ${e[0].toUpperCase()}${e.slice(1)}`},`all-disabled-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,isDisabled:!0,label:`Disabled ${e[0].toUpperCase()}${e.slice(1)}`},`all-disabled-sec-${e}`))]}),x=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,isClicked:!0,label:`Clicked ${e[0].toUpperCase()}${e.slice(1)}`},`all-clicked-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,isClicked:!0,label:`Clicked ${e[0].toUpperCase()}${e.slice(1)}`},`all-clicked-sec-${e}`))]}),S=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{primary:!0,size:e,isHovered:!0,label:`Hovered ${e[0].toUpperCase()}${e.slice(1)}`},`all-hovered-prim-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,isHovered:!0,label:`Hovered ${e[0].toUpperCase()}${e.slice(1)}`},`all-hovered-sec-${e}`))]}),C=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,filled:!0,icon:(0,d.jsx)(o,{}),label:`Filled ${e[0].toUpperCase()}${e.slice(1)}`},`all-filled-icon-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,filled:!0,label:`Filled ${e[0].toUpperCase()}${e.slice(1)}`},`all-filled-sec-${e}`))]}),w=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,filled:!0,icon:(0,d.jsx)(u,{}),label:`Filled ${e[0].toUpperCase()}${e.slice(1)}`},`all-filled-outline-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,filled:!0,filledStroke:!0,icon:(0,d.jsx)(u,{}),label:`FilledStroke ${e[0].toUpperCase()}${e.slice(1)}`},`all-filled-stroke-sec-${e}`))]}),T=()=>(0,d.jsxs)(p,{isScale:!1,children:[(0,d.jsx)(i,{primary:!0,size:r.small,label:`Hover me`,tooltipText:`This is a primary button with a tooltip`}),(0,d.jsx)(i,{size:r.normal,label:`Hover me too`,tooltipText:`This is a secondary button with a tooltip`}),(0,d.jsx)(i,{primary:!0,size:r.medium,icon:(0,d.jsx)(c,{}),label:`With icon`,tooltipText:`Button with icon and tooltip`})]}),E={render:()=>(0,d.jsx)(h,{}),parameters:{docs:{description:{story:`Primary buttons are used for main actions. They have a solid background color.`},source:{code:`<Button primary size={ButtonSize.extraSmall} label="Primary ExtraSmall" />
<Button primary size={ButtonSize.small} label="Primary Small" />
<Button primary size={ButtonSize.normal} label="Primary Normal" />
<Button primary size={ButtonSize.medium} label="Primary Medium" />`}}}},D={render:()=>(0,d.jsx)(g,{}),parameters:{docs:{description:{story:`Secondary buttons are used for secondary actions. They sit on the page background with a grey border that changes colour on hover.`},source:{code:`<Button size={ButtonSize.extraSmall} label="Secondary ExtraSmall" />
<Button size={ButtonSize.small} label="Secondary Small" />
<Button size={ButtonSize.normal} label="Secondary Normal" />
<Button size={ButtonSize.medium} label="Secondary Medium" />`}}}},O={render:()=>(0,d.jsx)(_,{}),parameters:{docs:{description:{story:`Buttons can include icons alongside text. Icons are displayed before the label.`},source:{code:`<Button primary size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button primary size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />
<Button size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />`}}}},k={name:`Loading Buttons`,render:()=>(0,d.jsx)(v,{}),parameters:{docs:{description:{story:`Loading state displays a spinner and disables interaction. Use for async operations.`},source:{code:`<Button primary size={ButtonSize.small} isLoading label="Loading Small" />
<Button primary size={ButtonSize.normal} isLoading label="Loading Normal" />
<Button size={ButtonSize.small} isLoading label="Loading Small" />
<Button size={ButtonSize.normal} isLoading label="Loading Normal" />`}}}},A={render:()=>(0,d.jsx)(y,{}),parameters:{docs:{description:{story:`Scale prop makes buttons expand to 100% of their container width. Useful for mobile layouts.`},source:{code:`<Button primary size={ButtonSize.small} scale label="Scale Small" />
<Button primary size={ButtonSize.normal} scale label="Scale Normal" />
<Button size={ButtonSize.small} scale label="Scale Small" />
<Button size={ButtonSize.normal} scale label="Scale Normal" />`}}}},j={render:()=>(0,d.jsx)(b,{}),parameters:{docs:{description:{story:"Disabled buttons cannot be clicked or focused: the secondary one turns grey, the primary one fades to 60% opacity (`isDisabled`)."},source:{code:`<Button primary size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button primary size={ButtonSize.normal} isDisabled label="Disabled Normal" />
<Button size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button size={ButtonSize.normal} isDisabled label="Disabled Normal" />`}}}},M={render:()=>(0,d.jsx)(x,{}),parameters:{docs:{description:{story:"The pressed look drawn while nothing presses the button (`isClicked`), for a button whose action is already under way, such as the one that opened the menu now on screen."},source:{code:`<Button primary size={ButtonSize.small} isClicked label="Clicked Small" />
<Button primary size={ButtonSize.normal} isClicked label="Clicked Normal" />
<Button size={ButtonSize.small} isClicked label="Clicked Small" />
<Button size={ButtonSize.normal} isClicked label="Clicked Normal" />`}}}},N={render:()=>(0,d.jsx)(S,{}),parameters:{docs:{description:{story:"The hover look drawn while the pointer is elsewhere (`isHovered`), for a button that should light up together with the element it belongs to, such as a hovered row."},source:{code:`<Button primary size={ButtonSize.small} isHovered label="Hovered Small" />
<Button primary size={ButtonSize.normal} isHovered label="Hovered Normal" />
<Button size={ButtonSize.small} isHovered label="Hovered Small" />
<Button size={ButtonSize.normal} isHovered label="Hovered Normal" />`}}}},P={render:()=>(0,d.jsx)(C,{}),parameters:{docs:{description:{story:"A quiet grey button with no border, for toolbar actions that should not compete with the content (`filled`). The first row shows that an icon is repainted in the text colour, whatever colour it was drawn in."},source:{code:`<Button size={ButtonSize.small} filled label="Filled Small" />
<Button size={ButtonSize.normal} filled label="Filled Normal" />
<Button size={ButtonSize.small} filled icon={<CatalogFolderIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<CatalogFolderIcon />} label="Filled Normal" />`}}}},F={render:()=>(0,d.jsx)(w,{}),parameters:{docs:{description:{story:"An outline-style icon on a filled button: in the first row the filled button paints the icon's shapes solid, in the second it keeps the outline (`filled` with `filledStroke`). `filledStroke` changes nothing without `filled`."},source:{code:`<Button size={ButtonSize.small} filled icon={<OutlineIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<OutlineIcon />} label="Filled Normal" />
<Button size={ButtonSize.small} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Small" />
<Button size={ButtonSize.normal} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Normal" />`}}}},I={render:()=>(0,d.jsx)(T,{}),parameters:{docs:{description:{story:`Buttons can display tooltips on hover. Hover over the buttons to see the tooltip text.`},source:{code:`<Button primary size={ButtonSize.small} label="Hover me" tooltipText="This is a primary button with a tooltip" />
<Button size={ButtonSize.normal} label="Hover me too" tooltipText="This is a secondary button with a tooltip" />
<Button primary size={ButtonSize.medium} icon={<Icon />} label="With icon" tooltipText="Button with icon and tooltip" />`}}}},L=()=>(0,d.jsxs)(p,{isScale:!1,children:[Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,accent:!0,label:`Accent ${e[0].toUpperCase()}${e.slice(1)}`},`all-accent-${e}`)),Object.keys(r).map(e=>(0,d.jsx)(i,{size:e,accent:!0,icon:(0,d.jsx)(o,{}),label:`Accent ${e[0].toUpperCase()}${e.slice(1)}`},`all-accent-icon-${e}`))]}),R={render:()=>(0,d.jsx)(L,{}),parameters:{docs:{description:{story:"An emphasised action that should stand out without taking the place of the primary one: a light accent tint with accent text, and an icon repainted in the same colour (`accent`)."},source:{code:`<Button size={ButtonSize.small} accent label="Accent Small" />
<Button size={ButtonSize.normal} accent label="Accent Normal" />
<Button size={ButtonSize.small} accent icon={<CatalogFolderIcon />} label="Accent Small" />
<Button size={ButtonSize.normal} accent icon={<CatalogFolderIcon />} label="Accent Normal" />`}}}},z=()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`,"--button-root-bg":`#fdf2f8`,"--button-root-color":`#9d174d`,"--button-root-border":`1px solid #f9a8d4`,"--button-root-bg-hover":`#fbcfe8`,"--button-root-color-hover":`#831843`,"--button-root-border-hover":`1px solid #db2777`,"--button-root-bg-active":`#f472b6`,"--button-root-color-active":`#500724`,"--button-root-border-active":`1px solid #9d174d`,"--button-root-bg-disabled":`#f5f5f5`,"--button-root-color-disabled":`#a3a3a3`,"--button-root-border-disabled":`1px dashed #d4d4d4`,"--button-primary-bg":`#7c3aed`,"--button-primary-color":`#fff`,"--button-primary-border":`1px solid #7c3aed`,"--button-primary-bg-hover":`#a78bfa`,"--button-primary-color-hover":`#fff`,"--button-primary-bg-active":`#4c1d95`,"--button-primary-color-active":`#ede9fe`,"--button-primary-border-active":`#2e1065`,"--button-primary-bg-disabled":`#ddd6fe`,"--button-primary-color-disabled":`#7c3aed`,"--button-primary-border-disabled":`1px solid #ddd6fe`,"--button-root-border-radius":`16px`,"--button-text-weight":`700`,"--button-height-md":`48px`,"--button-font-size-md":`15px`},children:[(0,d.jsx)(i,{size:r.normal,label:`Secondary`}),(0,d.jsx)(i,{size:r.normal,label:`Primary`,primary:!0}),(0,d.jsx)(i,{size:r.normal,label:`Disabled`,isDisabled:!0}),(0,d.jsx)(i,{size:r.normal,label:`Disabled`,primary:!0,isDisabled:!0})]}),B={render:()=>(0,d.jsx)(z,{}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover and press the buttons to see the hover and pressed values.\n\n- **Secondary** — the `--button-root-*` colours, the radius, the weight and the `normal` size's height and font size\n- **Primary** — the `--button-primary-*` colours\n- **Disabled** — the `--button-root-*-disabled` values (`isDisabled`)\n- **Disabled primary** — the `--button-primary-*-disabled` values, faded to 60% opacity by the component (`primary` with `isDisabled`)"},source:{code:`<div style={{
  "--button-root-bg": "#fdf2f8",
  "--button-root-color": "#9d174d",
  "--button-root-border": "1px solid #f9a8d4",
  "--button-root-bg-hover": "#fbcfe8",
  "--button-root-color-hover": "#831843",
  "--button-root-border-hover": "1px solid #db2777",
  "--button-root-bg-active": "#f472b6",
  "--button-root-color-active": "#500724",
  "--button-root-border-active": "1px solid #9d174d",
  "--button-root-bg-disabled": "#f5f5f5",
  "--button-root-color-disabled": "#a3a3a3",
  "--button-root-border-disabled": "1px dashed #d4d4d4",
  "--button-primary-bg": "#7c3aed",
  "--button-primary-color": "#fff",
  "--button-primary-border": "1px solid #7c3aed",
  "--button-primary-bg-hover": "#a78bfa",
  "--button-primary-color-hover": "#fff",
  "--button-primary-bg-active": "#4c1d95",
  "--button-primary-color-active": "#ede9fe",
  "--button-primary-border-active": "#2e1065",
  "--button-primary-bg-disabled": "#ddd6fe",
  "--button-primary-color-disabled": "#7c3aed",
  "--button-primary-border-disabled": "1px solid #ddd6fe",
  "--button-root-border-radius": "16px",
  "--button-text-weight": "700",
  "--button-height-md": "48px",
  "--button-font-size-md": "15px",
}}>
  <Button label="Secondary" />
  <Button label="Primary" primary />
  <Button label="Disabled" isDisabled />
  <Button label="Disabled" primary isDisabled />
</div>`}}}},V=[`Default`,`PrimaryButtons`,`SecondaryButtons`,`WithIconButtons`,`IsLoadingButtons`,`ScaleButtons`,`DisabledButtons`,`ClickedButtons`,`HoveredButtons`,`FilledButtons`,`FilledStrokeButtons`,`WithTooltip`,`AccentButtons`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Button {...args} />,
  args: {
    size: ButtonSize.small,
    label: "Button"
  },
  parameters: {
    docs: {
      description: {
        story: "The secondary button, for any action that is not the main one of a view; click it to see \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Button size={ButtonSize.small} label="Button" onClick={handleClick} />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <PrimaryTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Primary buttons are used for main actions. They have a solid background color."
      },
      source: {
        code: \`<Button primary size={ButtonSize.extraSmall} label="Primary ExtraSmall" />
<Button primary size={ButtonSize.small} label="Primary Small" />
<Button primary size={ButtonSize.normal} label="Primary Normal" />
<Button primary size={ButtonSize.medium} label="Primary Medium" />\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <SecondaryTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Secondary buttons are used for secondary actions. They sit on the page background with a grey border that changes colour on hover."
      },
      source: {
        code: \`<Button size={ButtonSize.extraSmall} label="Secondary ExtraSmall" />
<Button size={ButtonSize.small} label="Secondary Small" />
<Button size={ButtonSize.normal} label="Secondary Normal" />
<Button size={ButtonSize.medium} label="Secondary Medium" />\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <WithIconTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Buttons can include icons alongside text. Icons are displayed before the label."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button primary size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />
<Button size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Loading Buttons",
  render: () => <IsLoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Loading state displays a spinner and disables interaction. Use for async operations."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} isLoading label="Loading Small" />
<Button primary size={ButtonSize.normal} isLoading label="Loading Normal" />
<Button size={ButtonSize.small} isLoading label="Loading Small" />
<Button size={ButtonSize.normal} isLoading label="Loading Normal" />\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <ScaleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Scale prop makes buttons expand to 100% of their container width. Useful for mobile layouts."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} scale label="Scale Small" />
<Button primary size={ButtonSize.normal} scale label="Scale Normal" />
<Button size={ButtonSize.small} scale label="Scale Small" />
<Button size={ButtonSize.normal} scale label="Scale Normal" />\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Disabled buttons cannot be clicked or focused: the secondary one turns grey, the primary one fades to 60% opacity (\`isDisabled\`)."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button primary size={ButtonSize.normal} isDisabled label="Disabled Normal" />
<Button size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button size={ButtonSize.normal} isDisabled label="Disabled Normal" />\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <ClickedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The pressed look drawn while nothing presses the button (\`isClicked\`), for a button whose action is already under way, such as the one that opened the menu now on screen."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} isClicked label="Clicked Small" />
<Button primary size={ButtonSize.normal} isClicked label="Clicked Normal" />
<Button size={ButtonSize.small} isClicked label="Clicked Small" />
<Button size={ButtonSize.normal} isClicked label="Clicked Normal" />\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The hover look drawn while the pointer is elsewhere (\`isHovered\`), for a button that should light up together with the element it belongs to, such as a hovered row."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} isHovered label="Hovered Small" />
<Button primary size={ButtonSize.normal} isHovered label="Hovered Normal" />
<Button size={ButtonSize.small} isHovered label="Hovered Small" />
<Button size={ButtonSize.normal} isHovered label="Hovered Normal" />\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <FilledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A quiet grey button with no border, for toolbar actions that should not compete with the content (\`filled\`). The first row shows that an icon is repainted in the text colour, whatever colour it was drawn in."
      },
      source: {
        code: \`<Button size={ButtonSize.small} filled label="Filled Small" />
<Button size={ButtonSize.normal} filled label="Filled Normal" />
<Button size={ButtonSize.small} filled icon={<CatalogFolderIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<CatalogFolderIcon />} label="Filled Normal" />\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <FilledStrokeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An outline-style icon on a filled button: in the first row the filled button paints the icon's shapes solid, in the second it keeps the outline (\`filled\` with \`filledStroke\`). \`filledStroke\` changes nothing without \`filled\`."
      },
      source: {
        code: \`<Button size={ButtonSize.small} filled icon={<OutlineIcon />} label="Filled Small" />
<Button size={ButtonSize.normal} filled icon={<OutlineIcon />} label="Filled Normal" />
<Button size={ButtonSize.small} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Small" />
<Button size={ButtonSize.normal} filled filledStroke icon={<OutlineIcon />} label="FilledStroke Normal" />\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <TooltipTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Buttons can display tooltips on hover. Hover over the buttons to see the tooltip text."
      },
      source: {
        code: \`<Button primary size={ButtonSize.small} label="Hover me" tooltipText="This is a primary button with a tooltip" />
<Button size={ButtonSize.normal} label="Hover me too" tooltipText="This is a secondary button with a tooltip" />
<Button primary size={ButtonSize.medium} icon={<Icon />} label="With icon" tooltipText="Button with icon and tooltip" />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <AccentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An emphasised action that should stand out without taking the place of the primary one: a light accent tint with accent text, and an icon repainted in the same colour (\`accent\`)."
      },
      source: {
        code: \`<Button size={ButtonSize.small} accent label="Accent Small" />
<Button size={ButtonSize.normal} accent label="Accent Normal" />
<Button size={ButtonSize.small} accent icon={<CatalogFolderIcon />} label="Accent Small" />
<Button size={ButtonSize.normal} accent icon={<CatalogFolderIcon />} label="Accent Normal" />\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <CustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Hover and press the buttons to see the hover and pressed values.

- **Secondary** — the \\\`--button-root-*\\\` colours, the radius, the weight and the \\\`normal\\\` size's height and font size
- **Primary** — the \\\`--button-primary-*\\\` colours
- **Disabled** — the \\\`--button-root-*-disabled\\\` values (\\\`isDisabled\\\`)
- **Disabled primary** — the \\\`--button-primary-*-disabled\\\` values, faded to 60% opacity by the component (\\\`primary\\\` with \\\`isDisabled\\\`)\`
      },
      source: {
        code: \`<div style={{
  "--button-root-bg": "#fdf2f8",
  "--button-root-color": "#9d174d",
  "--button-root-border": "1px solid #f9a8d4",
  "--button-root-bg-hover": "#fbcfe8",
  "--button-root-color-hover": "#831843",
  "--button-root-border-hover": "1px solid #db2777",
  "--button-root-bg-active": "#f472b6",
  "--button-root-color-active": "#500724",
  "--button-root-border-active": "1px solid #9d174d",
  "--button-root-bg-disabled": "#f5f5f5",
  "--button-root-color-disabled": "#a3a3a3",
  "--button-root-border-disabled": "1px dashed #d4d4d4",
  "--button-primary-bg": "#7c3aed",
  "--button-primary-color": "#fff",
  "--button-primary-border": "1px solid #7c3aed",
  "--button-primary-bg-hover": "#a78bfa",
  "--button-primary-color-hover": "#fff",
  "--button-primary-bg-active": "#4c1d95",
  "--button-primary-color-active": "#ede9fe",
  "--button-primary-border-active": "#2e1065",
  "--button-primary-bg-disabled": "#ddd6fe",
  "--button-primary-color-disabled": "#7c3aed",
  "--button-primary-border-disabled": "1px solid #ddd6fe",
  "--button-root-border-radius": "16px",
  "--button-text-weight": "700",
  "--button-height-md": "48px",
  "--button-font-size-md": "15px",
}}>
  <Button label="Secondary" />
  <Button label="Primary" primary />
  <Button label="Disabled" isDisabled />
  <Button label="Disabled" primary isDisabled />
</div>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}}})))()}H();export{R as AccentButtons,M as ClickedButtons,B as CssCustomization,m as Default,j as DisabledButtons,P as FilledButtons,F as FilledStrokeButtons,N as HoveredButtons,k as IsLoadingButtons,E as PrimaryButtons,A as ScaleButtons,D as SecondaryButtons,O as WithIconButtons,I as WithTooltip,V as __namedExportsOrder,f as default};