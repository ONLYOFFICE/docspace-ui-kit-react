import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./globalColors-fkBUxSeV.js";import{n as i,t as a}from"./Toast-6E8r1NpK.js";import{S as o,_ as s}from"./enums-DzcBu485.js";import{a as c,i as l}from"./ComboBox-DWO8Uqxf.js";import{n as u,t as d}from"./AccessRightSelect-C7ke4bqJ.js";import{n as f,t as p}from"./catalog.folder.react-VUpu0ofJ.js";var m;function h(){return(h=e((()=>{o(),n(),m=[{key:`key1`,label:`Full access`,description:`Can edit, share and delete files and folders`,quota:`paid`,color:r.favoritesStatus,access:s.FullAccess},{key:`key2`,label:`Editor`,description:`Can edit and share files`,access:s.Editing},{key:`key3`,label:``,isSeparator:!0},{key:`key4`,label:`Commenter`,description:`Can comment on and view files`,access:s.Comment},{key:`key5`,label:`Viewer`,description:`Can only view files`,access:s.ReadOnly},{key:`key6`,label:`No access`,description:``,access:s.DenyAccess}]})))()}var g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{o(),c(),i(),u(),f(),h(),g=t(),{fn:_}=__STORYBOOK_MODULE_TEST__,v=m.map(e=>e.isSeparator?e:{...e,icon:p}),y=({children:e})=>(0,g.jsx)(`div`,{style:{height:`420px`},children:e}),b=({children:e})=>(0,g.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,alignItems:`flex-start`,gap:`24px`},children:e}),x={title:`UI/Form controls/AccessRightSelect`,component:d,parameters:{},argTypes:{accessOptions:{control:!1,description:`The access levels to choose from, each drawn as a row with its icon, label, description and paid badge; an entry marked as a separator becomes a divider`},selectedOption:{control:!1,description:"The level shown in the button; keep it in your own state and set it from `onSelect`"},scaledOptions:{control:`boolean`,description:"Makes the list as wide as the button instead of `manualWidth`",table:{defaultValue:{summary:`false`}}},scaled:{control:`boolean`,description:"Makes the button take the full width of its parent, which overrides `size`",table:{defaultValue:{summary:`true`}}},directionX:{control:{type:`select`},options:[`right`,`left`],description:`Horizontal direction in which the dropdown opens`,table:{defaultValue:{summary:`right`}}},size:{control:{type:`select`},options:Object.values(l),description:"One of the fixed button widths — 173, 300, 350 or 500px, or the content's own; applies only when `scaled` is off",table:{defaultValue:{summary:`base`}}},manualWidth:{control:`text`,description:"Width of the list as a CSS length; the button's width is set by `size` and `scaled`",table:{defaultValue:{summary:`200px`}}},isDisabled:{control:`boolean`,description:`Greys the button out and stops it opening`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:`Shows a spinner in place of the button's label and icon, and stops the button opening`,table:{defaultValue:{summary:`false`}}},withoutBackground:{control:`boolean`,description:`Makes the backdrop behind the open list transparent`,table:{defaultValue:{summary:`false`}}},withBlur:{control:`boolean`,description:`Accepted but ignored: nothing blurs`,table:{defaultValue:{summary:`false`}}},directionY:{control:{type:`select`},options:[`top`,`bottom`,`both`],description:`Vertical direction in which the dropdown opens`,table:{defaultValue:{summary:`bottom`}}},isAside:{control:`boolean`,description:`Marks the backdrop behind the open list as belonging to a side panel`,table:{defaultValue:{summary:`false`}}},isMobileView:{control:`boolean`,description:`Pins the open list to the bottom of the screen, full width, on a phone in portrait`,table:{defaultValue:{summary:`false`}}},manualY:{control:`text`,description:`Exact vertical offset of the list from the button, when the list renders in place`},fixedDirection:{control:`boolean`,description:`Prevents the dropdown from flipping direction when near viewport edges`,table:{defaultValue:{summary:`false`}}},withBackground:{control:`boolean`,description:`Dims the page behind the open list`,table:{defaultValue:{summary:`false`}}},shouldShowBackdrop:{control:`boolean`,description:`Renders the backdrop behind the open list even when another one is already on screen`,table:{defaultValue:{summary:`false`}}},withBackdrop:{control:`boolean`,description:`Whether the open list puts a backdrop behind itself to catch the next click`,table:{defaultValue:{summary:`true`}}},noBorder:{control:`boolean`,description:`Removes the border from the select element`,table:{defaultValue:{summary:`false`}}},noSelect:{control:`boolean`,description:`Whether the button's text cannot be selected with the mouse`,table:{defaultValue:{summary:`true`}}},isSelectionDisabled:{control:`boolean`,description:"Refuses every level other than the current one and those in `availableAccess`; a refused pick shows `selectionErrorText` in a toast and the selection stays",table:{defaultValue:{summary:`false`}}},availableAccess:{control:`object`,description:"The `access` values that may still be picked while `isSelectionDisabled` is on"},selectionErrorText:{control:`text`,description:`The toast text shown when a refused level is picked`},displaySelectedOption:{control:`boolean`,description:`Keeps the current level highlighted in the list`,table:{defaultValue:{summary:`false`}}},showDisabledItems:{control:`boolean`,description:`Accepted but ignored: disabled options are always kept in the list`},title:{control:`text`,description:"Hover tooltip for the whole control; it needs `RootTooltip` mounted"},topSpace:{control:`number`,description:`Additional top spacing in pixels for the dropdown`},modernView:{control:`boolean`,description:`Switches the button to its compact presentation`,table:{defaultValue:{summary:`false`}}},fillIcon:{control:`boolean`,description:`Recolours the icon in the button to the theme's icon colour`,table:{defaultValue:{summary:`false`}}},isDefaultMode:{control:`boolean`,description:`Renders the open list in a portal at the end of the page, positioned against the button; turn it off to render the list in place, next to the button`,table:{defaultValue:{summary:`true`}}},comboIcon:{control:`text`,description:`URL of an icon shown in place of the arrow in the button`},usePortalBackdrop:{control:`boolean`,description:`Whether to render the backdrop using a React portal`,table:{defaultValue:{summary:`false`}}},type:{control:{type:`select`},options:[void 0,`badge`,`onlyIcon`,`descriptive`],description:"How the button shows the chosen level: `descriptive` adds its description under the label, `onlyIcon` shows the icon alone, `badge` draws the label as a badge"},dataTestId:{control:`text`,description:"`data-testid` of the button"},onSelect:{description:`Called with the level that was picked; not called for a refused one`},setIsOpenItemAccess:{control:!1,description:"Told `true` when the list opens and `false` when it closes"},className:{control:`text`,description:`Class added to the element that wraps the button and the list`},advancedOptions:{control:!1,description:"An element whose children replace the rows built from `accessOptions`"}},args:{usePortalBackdrop:!0,onSelect:_()}},S={args:{accessOptions:v,selectedOption:v[0],scaledOptions:!1,scaled:!1,directionX:`right`,size:l.content,manualWidth:`fit-content`},render:e=>(0,g.jsx)(y,{children:(0,g.jsx)(d,{...e})}),parameters:{docs:{description:{story:"The drop-down as it is placed next to a person or a link: open it to see each level's icon, description and paid badge, and pick one to see the button follow (`onSelect`, logged in the Actions panel). Change any other prop live in the Controls panel below."},source:{code:`<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  scaledOptions={false}
  scaled={false}
  directionX="right"
  size="content"
  manualWidth="fit-content"
  onSelect={(option) => setAccess(option)}
/>`}}}},C=()=>(0,g.jsx)(y,{children:(0,g.jsxs)(b,{children:[(0,g.jsx)(d,{accessOptions:v,selectedOption:v[1],scaled:!1,size:l.content,manualWidth:`fit-content`}),(0,g.jsx)(d,{accessOptions:v,selectedOption:v[1],type:`descriptive`,scaled:!1,size:l.content,manualWidth:`fit-content`}),(0,g.jsx)(d,{accessOptions:v,selectedOption:v[1],type:`onlyIcon`,scaled:!1,size:l.content,manualWidth:`fit-content`})]})}),w={render:()=>(0,g.jsx)(C,{}),parameters:{docs:{description:{story:'How much of the chosen level the button shows, from the most room to the least:\n\n- **Editor** — the label alone, the usual form (no `type`)\n- **Editor, Can edit and share files** — the label with the description underneath, for a form where the choice needs explaining (`type="descriptive"`)\n- **The folder icon** — the icon alone, for a row with no room for text; the list still shows every label (`type="onlyIcon"`)'},source:{code:`<AccessRightSelect accessOptions={options} selectedOption={access} />
<AccessRightSelect accessOptions={options} selectedOption={access} type="descriptive" />
<AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" />`}}}},T=()=>(0,g.jsxs)(y,{children:[(0,g.jsx)(d,{accessOptions:v,selectedOption:v[4],isSelectionDisabled:!0,availableAccess:[s.Comment,s.ReadOnly],selectionErrorText:`This access level is not available`,scaled:!1,size:l.content,manualWidth:`fit-content`}),(0,g.jsx)(a,{})]}),E={render:()=>(0,g.jsx)(T,{}),parameters:{docs:{description:{story:"For a level the viewer may see but not grant. Open the list and pick **Full access**: a toast explains why, and the button keeps **Viewer**; **Commenter** and **Viewer** can still be picked (`isSelectionDisabled`, `availableAccess`, `selectionErrorText`). The toast needs `Toast` mounted once in the app."},source:{code:`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isSelectionDisabled
  availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
  selectionErrorText="This access level is not available"
  onSelect={(option) => setAccess(option)}
/>
<Toast />`}}}},D={args:{...S.args,isDisabled:!0},render:e=>(0,g.jsx)(y,{children:(0,g.jsx)(d,{...e})}),parameters:{docs:{description:{story:"For an access level that cannot be changed right now, such as while the person is being removed: the button is greyed out and clicking it does not open the list (`isDisabled`)."},source:{code:`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isDisabled
/>`}}}},O={args:{...S.args,isLoading:!0},render:e=>(0,g.jsx)(y,{children:(0,g.jsx)(d,{...e})}),parameters:{docs:{description:{story:"For the moment a new level is being saved: a spinner takes the place of the label and icon, and the list cannot be opened until the save finishes (`isLoading`)."},source:{code:`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isLoading={isSaving}
/>`}}}},k=()=>(0,g.jsx)(`div`,{style:{"--access-right-select-text":`#0082c9`,"--access-right-select-disabled-icon":`#a8cfe6`,"--access-right-select-icon":`#0082c9`,"--access-right-select-description":`#5aa9d0`,"--access-right-select-description-size":`12px`,"--access-right-select-gap":`12px`,"--access-right-select-item-padding":`10px 0`,"--combobox-radius":`8px`,"--dropdown-bg":`#e6f3fb`,"--dropdown-border-style":`1px solid #0082c9`,"--dropdown-shadow":`0 4px 16px rgba(0, 130, 201, 0.25)`,"--dropdown-radius":`12px`},children:(0,g.jsx)(`div`,{style:{height:`420px`},children:(0,g.jsxs)(b,{children:[(0,g.jsx)(d,{accessOptions:v,selectedOption:v[0],scaledOptions:!1,scaled:!1,directionX:`right`,size:l.content,manualWidth:`320px`,isDefaultMode:!1}),(0,g.jsx)(d,{accessOptions:v,selectedOption:v[0],type:`onlyIcon`,scaled:!1,size:l.content,manualWidth:`320px`,isDefaultMode:!1}),(0,g.jsx)(d,{accessOptions:v,selectedOption:v[0],type:`onlyIcon`,isDisabled:!0,scaled:!1,size:l.content,manualWidth:`320px`,isDefaultMode:!1})]})})}),A={render:()=>(0,g.jsx)(k,{}),parameters:{docs:{description:{story:'Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Open any of the instances to see the row and panel variables; they render the list in place (`isDefaultMode={false}`), because a portalled list is out of reach of a wrapper\'s variables. The three instances share one wrapper:\n\n- **Full access** — the usual button, for the button radius and everything in the list\n- **The first icon** — `type="onlyIcon"`, for `--access-right-select-text`\n- **The second icon** — `type="onlyIcon"` and `isDisabled`, for `--access-right-select-disabled-icon`'},source:{code:`<div
  style={{
    "--access-right-select-text": "#0082c9",
    "--access-right-select-disabled-icon": "#a8cfe6",
    "--access-right-select-icon": "#0082c9",
    "--access-right-select-description": "#5aa9d0",
    "--access-right-select-description-size": "12px",
    "--access-right-select-gap": "12px",
    "--access-right-select-item-padding": "10px 0",
    "--combobox-radius": "8px",
    "--dropdown-bg": "#e6f3fb",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <AccessRightSelect accessOptions={options} selectedOption={access} isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDisabled isDefaultMode={false} />
</div>`}}}},j=[`Default`,`DisplayTypes`,`RestrictedChoices`,`DisabledState`,`LoadingState`,`CssCustomization`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    accessOptions: data,
    selectedOption: data[0],
    scaledOptions: false,
    scaled: false,
    directionX: "right",
    size: ComboBoxSize.content,
    manualWidth: "fit-content"
  },
  render: args => <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: "The drop-down as it is placed next to a person or a link: open it to see each level's icon, description and paid badge, and pick one to see the button follow (\`onSelect\`, logged in the Actions panel). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  scaledOptions={false}
  scaled={false}
  directionX="right"
  size="content"
  manualWidth="fit-content"
  onSelect={(option) => setAccess(option)}
/>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <DisplayTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`How much of the chosen level the button shows, from the most room to the least:

- **Editor** — the label alone, the usual form (no \\\`type\\\`)
- **Editor, Can edit and share files** — the label with the description underneath, for a form where the choice needs explaining (\\\`type="descriptive"\\\`)
- **The folder icon** — the icon alone, for a row with no room for text; the list still shows every label (\\\`type="onlyIcon"\\\`)\`
      },
      source: {
        code: \`<AccessRightSelect accessOptions={options} selectedOption={access} />
<AccessRightSelect accessOptions={options} selectedOption={access} type="descriptive" />
<AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" />\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <RestrictedChoicesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a level the viewer may see but not grant. Open the list and pick **Full access**: a toast explains why, and the button keeps **Viewer**; **Commenter** and **Viewer** can still be picked (\`isSelectionDisabled\`, \`availableAccess\`, \`selectionErrorText\`). The toast needs \`Toast\` mounted once in the app."
      },
      source: {
        code: \`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isSelectionDisabled
  availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
  selectionErrorText="This access level is not available"
  onSelect={(option) => setAccess(option)}
/>
<Toast />\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isDisabled: true
  },
  render: args => <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: "For an access level that cannot be changed right now, such as while the person is being removed: the button is greyed out and clicking it does not open the list (\`isDisabled\`)."
      },
      source: {
        code: \`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isDisabled
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isLoading: true
  },
  render: args => <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: "For the moment a new level is being saved: a spinner takes the place of the label and icon, and the list cannot be opened until the save finishes (\`isLoading\`)."
      },
      source: {
        code: \`<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isLoading={isSaving}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Open any of the instances to see the row and panel variables; they render the list in place (\\\`isDefaultMode={false}\\\`), because a portalled list is out of reach of a wrapper's variables. The three instances share one wrapper:

- **Full access** — the usual button, for the button radius and everything in the list
- **The first icon** — \\\`type="onlyIcon"\\\`, for \\\`--access-right-select-text\\\`
- **The second icon** — \\\`type="onlyIcon"\\\` and \\\`isDisabled\\\`, for \\\`--access-right-select-disabled-icon\\\`\`
      },
      source: {
        code: \`<div
  style={{
    "--access-right-select-text": "#0082c9",
    "--access-right-select-disabled-icon": "#a8cfe6",
    "--access-right-select-icon": "#0082c9",
    "--access-right-select-description": "#5aa9d0",
    "--access-right-select-description-size": "12px",
    "--access-right-select-gap": "12px",
    "--access-right-select-item-padding": "10px 0",
    "--combobox-radius": "8px",
    "--dropdown-bg": "#e6f3fb",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <AccessRightSelect accessOptions={options} selectedOption={access} isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDisabled isDefaultMode={false} />
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as CssCustomization,S as Default,D as DisabledState,w as DisplayTypes,O as LoadingState,E as RestrictedChoices,j as __namedExportsOrder,x as default};