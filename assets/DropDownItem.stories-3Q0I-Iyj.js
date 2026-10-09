import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./drop-down-H7nHxgOI.js";import{n as o,t as s}from"./settings.react-BjFsDBU-.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{s(),r(),n(),c=t(),l={title:`UI/Overlays/DropDownItem`,component:i,parameters:{},argTypes:{label:{control:`text`,description:`Text or node shown in the item; a string also becomes the hover title`},icon:{control:`text`,description:"Icon before the label: a component or element rendered as given, or a URL — a path with `.svg` or `images/` is inlined, anything else becomes an image"},disabled:{control:`boolean`,description:"Greys the item out and stops `onClick`; inside `DropDown` the item is dropped from the list unless `showDisabledItems` is set",table:{defaultValue:{summary:`false`}}},isSeparator:{control:`boolean`,description:`Renders a one-pixel line between items instead of any content`,table:{defaultValue:{summary:`false`}}},isHeader:{control:`boolean`,description:`Renders a taller, non-clickable section title with a line under it`,table:{defaultValue:{summary:`false`}}},isSelected:{control:`boolean`,description:"Marks the item as the current choice: sets `aria-selected` and calls `onClickSelectedItem` on click; it is highlighted only while also disabled",table:{defaultValue:{summary:`false`}}},isSubMenu:{control:`boolean`,description:"Shows an arrow at the end of the row; it points the other way in right-to-left and turns down with `isActive`",table:{defaultValue:{summary:`false`}}},isModern:{control:`boolean`,description:`Narrows the side padding of the row to 8px`,table:{defaultValue:{summary:`false`}}},noHover:{control:`boolean`,description:`Keeps the background unchanged under the pointer`,table:{defaultValue:{summary:`false`}}},noActive:{control:`boolean`,description:`Keeps the background unchanged while the item is pressed`,table:{defaultValue:{summary:`false`}}},withToggle:{control:`boolean`,description:"Shows a switch at the end of the row; changing it calls `onClick`",table:{defaultValue:{summary:`false`}}},checked:{control:`boolean`,description:"Whether the switch shown by `withToggle` is on",table:{defaultValue:{summary:`false`}}},isBeta:{control:`boolean`,description:"Shows a beta badge at the end of the row, labelled by `betaLabel`",table:{defaultValue:{summary:`false`}}},isPaidBadge:{control:`boolean`,description:"Shows a paid badge at the end of the row, labelled by `badgeLabel` or `paidLabel`",table:{defaultValue:{summary:`false`}}},textOverflow:{control:`boolean`,description:`Cuts the whole row off with an ellipsis when it is wider than the item`,table:{defaultValue:{summary:`false`}}},fillIcon:{control:`boolean`,description:`Recolours an icon given as a URL to the item's icon colour; off, the icon keeps its own colours`,table:{defaultValue:{summary:`true`}}},isActiveDescendant:{control:`boolean`,description:`Paints the item with the hover background as the one keyboard navigation is on; ignored while disabled`,table:{defaultValue:{summary:`false`}}},minWidth:{control:`text`,description:`Minimum width of the item, as a CSS length`},onClick:{action:`clicked`,description:`Called on a click on the item and on a change of its switch; not called while disabled`},isActive:{control:`boolean`,description:`Highlights the item with the selected background; on a submenu entry it also turns the arrow down`,table:{defaultValue:{summary:`false`}}},withoutIcon:{control:`boolean`,description:"Hides the icon even when `icon` is set",table:{defaultValue:{summary:`false`}}},withHeaderArrow:{control:`boolean`,description:`Shows a back arrow before the label of a header item`},headerArrowAction:{action:`headerArrowAction`,description:`Called when the back arrow of a header item is clicked`},children:{control:!1,description:"Content of the item, rendered only when `label` is empty — never next to it"},additionalElement:{control:!1,description:`Element placed at the end of the row, after the label`},description:{control:`text`,description:`Second line under the label, always visible; the item grows to fit it`},truncateText:{control:`boolean`,description:`Cuts the label alone off with an ellipsis, so the elements at the end of the row stay visible`},betaLabel:{control:`text`,description:`Text of the beta badge, used instead of the host's own constant`},paidLabel:{control:`text`,description:`Text of the paid badge, used instead of the translated default`},badgeLabel:{control:`text`,description:"Text of the paid badge; takes precedence over `paidLabel`"},withExternalLink:{control:`boolean`,description:"Shows an external-link icon at the end of the row, when `externalLinkPath` is also set"},externalLinkPath:{control:`text`,description:`Must be non-empty for the external-link icon to show; the item does not navigate to it itself`},onExternalLinkClick:{action:`onExternalLinkClick`,description:"Called when the external-link icon is clicked, without calling `onClick`"},onClickSelectedItem:{action:`onClickSelectedItem`,description:"Called when an item with `isSelected` is clicked"},onMouseDown:{action:`onMouseDown`,description:`Called when a mouse button is pressed on the item`},stopMouseDownPropagation:{control:`boolean`,description:`Keeps a mouse press on the item from reaching the page, so a menu that closes on an outside press stays open until the click`},setOpen:{action:`setOpen`,description:"Called with `false` after every click, disabled ones included, so the enclosing menu can close"},tooltip:{control:`text`,description:"Hint shown on a touch device when a disabled item is tapped; needs `RootTooltip` mounted"},tabIndex:{control:`number`,description:`Position in the Tab order; the default keeps the item off it`,table:{defaultValue:{summary:`-1`}}},height:{control:`number`,description:"Height in pixels the enclosing `DropDown` reserves for the item in its list; the item's own height does not follow it"},heightTablet:{control:`number`,description:"The same as `height`, used on a tablet-width window"},className:{control:`text`,description:`Class name added to the item`},style:{control:`object`,description:`Inline styles of the item`},id:{control:`text`,description:`Id of the item element`},testId:{control:`text`,description:"Value of `data-testid` on the item",table:{defaultValue:{summary:`"drop-down-item"`}}}}},u=e=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`4px`,width:`250px`},children:e.children}),d={render:e=>(0,c.jsx)(i,{...e}),args:{label:`Default Item`},parameters:{docs:{description:{story:`A plain item with a label, the row a menu is made of; change any other prop live in the Controls panel below.`},source:{code:`<DropDownItem label="Default Item" onClick={handleClick} />`}}}},f=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`Editor`,icon:o,description:`Can edit the document, leave comments and share it with others.`}),(0,c.jsx)(i,{label:`Commenter`,icon:o,description:`Can read the document and leave comments, but not change its text.`}),(0,c.jsx)(i,{label:`Viewer`,icon:o,description:`Can only read the document.`})]}),p={render:()=>(0,c.jsx)(f,{}),parameters:{docs:{description:{story:"Each item reads as two lines: the label, and under it an always-visible explanation of what choosing it means (`description`). Use it where picking an item has consequences the label alone cannot convey."},source:{code:`<DropDownItem
  label="Editor"
  icon={SettingsIcon}
  description="Can edit the document, leave comments and share it with others."
/>`}}}},m=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{isHeader:!0,label:`Header Item`}),(0,c.jsx)(i,{label:`Regular Item`}),(0,c.jsx)(i,{label:`With Icon`,icon:o}),(0,c.jsx)(i,{isSeparator:!0}),(0,c.jsx)(i,{label:`Selected Item`,isSelected:!0,isActive:!0}),(0,c.jsx)(i,{label:`Disabled Item`,disabled:!0})]}),h={render:()=>(0,c.jsx)(m,{}),parameters:{docs:{description:{story:"The building blocks of a menu, top to bottom: **Header Item** — a section title with a line under it (`isHeader`); **Regular Item** and **With Icon** — plain rows, with and without an icon (`icon`); a separator line (`isSeparator`); **Selected Item** — the current choice, highlighted (`isActive`) and announced as selected (`isSelected`); **Disabled Item** — greyed out and not clickable (`disabled`)."},source:{code:`<DropDownItem isHeader label="Header Item" />
<DropDownItem label="Regular Item" />
<DropDownItem label="With Icon" icon={SettingsIcon} />
<DropDownItem isSeparator />
<DropDownItem label="Selected Item" isSelected isActive />
<DropDownItem label="Disabled Item" disabled />`}}}},g=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`Toggle Off`,withToggle:!0,checked:!1}),(0,c.jsx)(i,{label:`Toggle On`,withToggle:!0,checked:!0})]}),_={render:()=>(0,c.jsx)(g,{}),parameters:{docs:{description:{story:"A menu entry that switches an option on and off in place, without opening a dialog: **Toggle Off** and **Toggle On** show both positions (`withToggle`, `checked`); a change of the switch calls `onClick`."},source:{code:`<DropDownItem label="Toggle Off" withToggle checked={false} />
<DropDownItem label="Toggle On" withToggle checked />`}}}},v=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`New Feature`,icon:o,isBeta:!0,betaLabel:`Beta`}),(0,c.jsx)(i,{label:`Premium Feature`,icon:o,isPaidBadge:!0,paidLabel:`Pro`})]}),y={render:()=>(0,c.jsx)(v,{}),parameters:{docs:{description:{story:"Badges tell the reader before clicking that an entry is new or needs a paid plan: **New Feature** carries a beta badge (`isBeta`, `betaLabel`), **Premium Feature** a paid one (`isPaidBadge`, `paidLabel`)."},source:{code:`<DropDownItem label="New Feature" icon={SettingsIcon} isBeta betaLabel="Beta" />
<DropDownItem label="Premium Feature" icon={SettingsIcon} isPaidBadge paidLabel="Pro" />`}}}},b=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`Open Submenu`,icon:o,isSubMenu:!0}),(0,c.jsx)(i,{label:`Active Submenu`,icon:o,isSubMenu:!0,isActive:!0})]}),x={render:()=>(0,c.jsx)(b,{}),parameters:{docs:{description:{story:"An arrow at the end of the row tells the reader the entry leads to more options: **Open Submenu** shows it pointing sideways (`isSubMenu`), **Active Submenu** — the entry whose submenu is open — highlighted with the arrow turned down (`isActive`)."},source:{code:`<DropDownItem label="Open Submenu" icon={SettingsIcon} isSubMenu />
<DropDownItem label="Active Submenu" icon={SettingsIcon} isSubMenu isActive />`}}}},S=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`Save`,icon:o,additionalElement:(0,c.jsx)(`span`,{style:{color:`#999`},children:`Ctrl+S`})}),(0,c.jsx)(i,{label:`Copy`,icon:o,additionalElement:(0,c.jsx)(`span`,{style:{color:`#999`},children:`Ctrl+C`})})]}),C={render:()=>(0,c.jsx)(S,{}),parameters:{docs:{description:{story:"Any element can sit at the end of the row, such as the keyboard shortcut of a command: **Save** and **Copy** show theirs on the right (`additionalElement`)."},source:{code:`<DropDownItem label="Save" icon={SettingsIcon} additionalElement={<span>Ctrl+S</span>} />
<DropDownItem label="Copy" icon={SettingsIcon} additionalElement={<span>Ctrl+C</span>} />`}}}},w=({headerArrowAction:e})=>(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`Header with Back`,isHeader:!0,withHeaderArrow:!0,headerArrowAction:e}),(0,c.jsx)(i,{label:`Option 1`}),(0,c.jsx)(i,{label:`Option 2`})]}),T={render:e=>(0,c.jsx)(w,{headerArrowAction:e.headerArrowAction}),parameters:{docs:{description:{story:"A nested menu level needs a way back: **Header with Back** shows an arrow before the title (`isHeader`, `withHeaderArrow`); click it to see `headerArrowAction` in the Actions panel."},source:{code:`<DropDownItem
  label="Header with Back"
  isHeader
  withHeaderArrow
  headerArrowAction={goBack}
/>`}}}},E=()=>(0,c.jsx)(u,{children:(0,c.jsx)(i,{label:`This is a very long item label that should trigger text overflow ellipsis when the container is too small`,textOverflow:!0,minWidth:`200px`})}),D={render:()=>(0,c.jsx)(E,{}),parameters:{docs:{description:{story:"A label longer than the menu is cut off with an ellipsis instead of wrapping or widening the menu (`textOverflow`)."},source:{code:`<DropDownItem label="Very long text..." textOverflow minWidth="200px" />`}}}},O={render:e=>(0,c.jsx)(u,{children:(0,c.jsx)(i,{...e})}),args:{label:`Help center`,icon:o,withExternalLink:!0,externalLinkPath:`https://example.com/help`},parameters:{docs:{description:{story:"An entry can carry a second target at its end: **Help center** shows an external-link icon (`withExternalLink`, `externalLinkPath`); click the icon to see `onExternalLinkClick` in the Actions panel while `onClick` stays silent, and open the link from that callback yourself."},source:{code:`<DropDownItem
  label="Help center"
  icon={SettingsIcon}
  withExternalLink
  externalLinkPath="https://example.com/help"
  onExternalLinkClick={() => window.open(helpUrl, "_blank")}
/>`}}}},k=()=>(0,c.jsx)(`div`,{dir:`rtl`,children:(0,c.jsxs)(u,{children:[(0,c.jsx)(i,{label:`الإعدادات`,icon:o}),(0,c.jsx)(i,{label:`المزيد من الخيارات`,icon:o,isSubMenu:!0}),(0,c.jsx)(i,{label:`الإشعارات`,icon:o,withToggle:!0,checked:!0})]})}),A={render:()=>(0,c.jsx)(k,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`130px`},description:{story:'The same rows under a right-to-left interface: the icons move to the right of the labels, and the submenu arrow and the switch move to the left end, the arrow mirrored to point left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <DropDownItem label="..." icon={SettingsIcon} />
  <DropDownItem label="..." icon={SettingsIcon} isSubMenu />
  <DropDownItem label="..." icon={SettingsIcon} withToggle checked />
</div>`}}}},j={render:()=>(0,c.jsx)(`div`,{style:{position:`relative`,height:`20px`,width:`240px`,"--drop-down-item-color":`#4c1d95`,"--drop-down-item-icon-fill":`#7c3aed`,"--drop-down-item-hover-bg":`#ede9fe`,"--drop-down-item-divider":`#c4b5fd`,"--drop-down-item-disabled-color":`#a78bfa`,"--drop-down-item-height":`40px`,"--drop-down-item-font-size":`14px`,"--drop-down-item-font-weight":`400`,"--drop-down-item-padding":`0 20px`,"--drop-down-item-header-height":`56px`,"--drop-down-item-header-font-size":`18px`},children:(0,c.jsxs)(a,{open:!0,directionY:`bottom`,fixedDirection:!0,isDefaultMode:!1,showDisabledItems:!0,children:[(0,c.jsx)(i,{isHeader:!0,label:`Header`}),(0,c.jsx)(i,{label:`Custom Item`,icon:o}),(0,c.jsx)(i,{label:`Another Item`,icon:o}),(0,c.jsx)(i,{isSeparator:!0}),(0,c.jsx)(i,{label:`Disabled Item`,disabled:!0})]})}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Header** shows the header height, font size and the line under it, **Custom Item** and **Another Item** the text and icon colors, row height, font and padding — hover them for the hover background — the separator its color, and **Disabled Item** the disabled text color (`showDisabledItems` keeps it in the list)."}}}},M=[`Default`,`WithDescription`,`ItemTypes`,`WithToggle`,`WithBadges`,`Submenu`,`WithAdditionalElement`,`HeaderWithArrow`,`WithTextOverflow`,`WithExternalLink`,`RightToLeft`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <DropDownItem {...args} />,
  args: {
    label: "Default Item"
  },
  parameters: {
    docs: {
      description: {
        story: "A plain item with a label, the row a menu is made of; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<DropDownItem label="Default Item" onClick={handleClick} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <WithDescriptionTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Each item reads as two lines: the label, and under it an always-visible explanation of what choosing it means (\`description\`). Use it where picking an item has consequences the label alone cannot convey."
      },
      source: {
        code: \`<DropDownItem
  label="Editor"
  icon={SettingsIcon}
  description="Can edit the document, leave comments and share it with others."
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <ItemTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The building blocks of a menu, top to bottom: **Header Item** — a section title with a line under it (\`isHeader\`); **Regular Item** and **With Icon** — plain rows, with and without an icon (\`icon\`); a separator line (\`isSeparator\`); **Selected Item** — the current choice, highlighted (\`isActive\`) and announced as selected (\`isSelected\`); **Disabled Item** — greyed out and not clickable (\`disabled\`)."
      },
      source: {
        code: \`<DropDownItem isHeader label="Header Item" />
<DropDownItem label="Regular Item" />
<DropDownItem label="With Icon" icon={SettingsIcon} />
<DropDownItem isSeparator />
<DropDownItem label="Selected Item" isSelected isActive />
<DropDownItem label="Disabled Item" disabled />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <WithToggleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A menu entry that switches an option on and off in place, without opening a dialog: **Toggle Off** and **Toggle On** show both positions (\`withToggle\`, \`checked\`); a change of the switch calls \`onClick\`."
      },
      source: {
        code: \`<DropDownItem label="Toggle Off" withToggle checked={false} />
<DropDownItem label="Toggle On" withToggle checked />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <WithBadgesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Badges tell the reader before clicking that an entry is new or needs a paid plan: **New Feature** carries a beta badge (\`isBeta\`, \`betaLabel\`), **Premium Feature** a paid one (\`isPaidBadge\`, \`paidLabel\`)."
      },
      source: {
        code: \`<DropDownItem label="New Feature" icon={SettingsIcon} isBeta betaLabel="Beta" />
<DropDownItem label="Premium Feature" icon={SettingsIcon} isPaidBadge paidLabel="Pro" />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <SubmenuTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An arrow at the end of the row tells the reader the entry leads to more options: **Open Submenu** shows it pointing sideways (\`isSubMenu\`), **Active Submenu** — the entry whose submenu is open — highlighted with the arrow turned down (\`isActive\`)."
      },
      source: {
        code: \`<DropDownItem label="Open Submenu" icon={SettingsIcon} isSubMenu />
<DropDownItem label="Active Submenu" icon={SettingsIcon} isSubMenu isActive />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <WithAdditionalElementTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Any element can sit at the end of the row, such as the keyboard shortcut of a command: **Save** and **Copy** show theirs on the right (\`additionalElement\`)."
      },
      source: {
        code: \`<DropDownItem label="Save" icon={SettingsIcon} additionalElement={<span>Ctrl+S</span>} />
<DropDownItem label="Copy" icon={SettingsIcon} additionalElement={<span>Ctrl+C</span>} />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <HeaderWithArrowTemplate headerArrowAction={args.headerArrowAction} />,
  parameters: {
    docs: {
      description: {
        story: "A nested menu level needs a way back: **Header with Back** shows an arrow before the title (\`isHeader\`, \`withHeaderArrow\`); click it to see \`headerArrowAction\` in the Actions panel."
      },
      source: {
        code: \`<DropDownItem
  label="Header with Back"
  isHeader
  withHeaderArrow
  headerArrowAction={goBack}
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A label longer than the menu is cut off with an ellipsis instead of wrapping or widening the menu (\`textOverflow\`)."
      },
      source: {
        code: \`<DropDownItem label="Very long text..." textOverflow minWidth="200px" />\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <DropDownItem {...args} />
    </Wrapper>,
  args: {
    label: "Help center",
    icon: SettingsReactSvgUrl,
    withExternalLink: true,
    externalLinkPath: "https://example.com/help"
  },
  parameters: {
    docs: {
      description: {
        story: "An entry can carry a second target at its end: **Help center** shows an external-link icon (\`withExternalLink\`, \`externalLinkPath\`); click the icon to see \`onExternalLinkClick\` in the Actions panel while \`onClick\` stays silent, and open the link from that callback yourself."
      },
      source: {
        code: \`<DropDownItem
  label="Help center"
  icon={SettingsIcon}
  withExternalLink
  externalLinkPath="https://example.com/help"
  onExternalLinkClick={() => window.open(helpUrl, "_blank")}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, so the theme's data-dir="rtl" does not flip the whole Docs page.
      story: {
        inline: false,
        height: "130px"
      },
      description: {
        story: 'The same rows under a right-to-left interface: the icons move to the right of the labels, and the submenu arrow and the switch move to the left end, the arrow mirrored to point left. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <DropDownItem label="..." icon={SettingsIcon} />
  <DropDownItem label="..." icon={SettingsIcon} isSubMenu />
  <DropDownItem label="..." icon={SettingsIcon} withToggle checked />
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    position: "relative",
    height: "20px",
    width: "240px",
    "--drop-down-item-color": "#4c1d95",
    "--drop-down-item-icon-fill": "#7c3aed",
    "--drop-down-item-hover-bg": "#ede9fe",
    "--drop-down-item-divider": "#c4b5fd",
    "--drop-down-item-disabled-color": "#a78bfa",
    "--drop-down-item-height": "40px",
    "--drop-down-item-font-size": "14px",
    "--drop-down-item-font-weight": "400",
    "--drop-down-item-padding": "0 20px",
    "--drop-down-item-header-height": "56px",
    "--drop-down-item-header-font-size": "18px"
  } as CSSProperties}>
      <DropDown open directionY="bottom" fixedDirection isDefaultMode={false} showDisabledItems>
        <DropDownItem isHeader label="Header" />
        <DropDownItem label="Custom Item" icon={SettingsReactSvgUrl} />
        <DropDownItem label="Another Item" icon={SettingsReactSvgUrl} />
        <DropDownItem isSeparator />
        <DropDownItem label="Disabled Item" disabled />
      </DropDown>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Header** shows the header height, font size and the line under it, **Custom Item** and **Another Item** the text and icon colors, row height, font and padding — hover them for the hover background — the separator its color, and **Disabled Item** the disabled text color (\\\`showDisabledItems\\\` keeps it in the list).\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}}})))()}N();export{j as CssCustomization,d as Default,T as HeaderWithArrow,h as ItemTypes,A as RightToLeft,x as Submenu,C as WithAdditionalElement,y as WithBadges,p as WithDescription,O as WithExternalLink,D as WithTextOverflow,_ as WithToggle,M as __namedExportsOrder,l as default};