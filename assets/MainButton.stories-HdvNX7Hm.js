import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./main-button-_nE3afA8.js";import{n as i,t as a}from"./catalog.folder.react-VUpu0ofJ.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{i(),n(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c=[{key:0,label:`New document`,icon:a},{key:1,label:`New spreadsheet`,icon:a},{key:2,label:`New presentation`,icon:a},{key:3,label:`Master form`,icon:a,items:[{key:4,label:`From blank`},{key:5,label:`From an existing text file`}]},{key:6,label:`New folder`,icon:a},{key:7,isSeparator:!0},{key:8,label:`Upload`,icon:a}],l={title:`UI/Interactive elements/MainButton`,component:r,parameters:{},argTypes:{text:{control:`text`,description:`Text drawn in the button. It is the whole label: the component takes no children`,table:{defaultValue:{summary:`"Button"`}}},isDisabled:{control:`boolean`,description:"Whether the button is inert: it dims to 60% opacity and a click neither opens the menu nor calls `onAction`",table:{defaultValue:{summary:`false`}}},isDropdown:{control:`boolean`,description:"Whether a click opens the menu built from `model`, with an arrow beside the text. When off, the click calls `onAction` instead",table:{defaultValue:{summary:`true`}}},opened:{control:!1,description:`Ignored. Nothing reads this prop, and it reaches the button's element as an unknown attribute`},onAction:{action:`onAction`,description:"Called with the click event when the button is clicked. Only reached while `isDropdown` is off"},model:{control:!1,description:"Items of the menu: a label with an optional icon and description, a separator, or a nested list under `items`. Required even when `isDropdown` is off and nothing reads it"},hideArrow:{control:`boolean`,description:`Whether the arrow beside the text is left out. A click still opens the menu`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class added to the button, after the component's own classes`},id:{control:`text`,description:`Id of the button, not of the wrapper around it`},style:{control:`object`,description:`Inline style of the button`},setRefMap:{control:!1,description:`Called on mount and on every window resize with a key and the button's element, so a host can find the button, for example to point a guided tour at it`},anchorRef:{control:!1,description:`Element the menu opens under and takes its width from. Without it the button's own box is used; pass an outer wrapper when the button sits inside a larger clickable area`}}},u=e=>(0,o.jsx)(`div`,{style:{maxWidth:`210px`},children:e.children}),d={render:e=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{...e})}),args:{text:`Main Button`,model:c},parameters:{docs:{description:{story:`The button with its menu: click it to open the list of things to create, then change any other prop live in the Controls panel below.`},source:{code:`<MainButton text="Main Button" model={itemsModel} />`}}}},f=()=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{text:`Disabled Button`,isDisabled:!0,isDropdown:!1,model:[]})}),p={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:`MainButton in a disabled state. The button cannot be interacted with and appears with reduced opacity.`},source:{code:`<MainButton text="Disabled Button" isDisabled isDropdown={false} model={[]} />`}}}},m=()=>(0,o.jsx)(`div`,{style:{maxWidth:`310px`},children:(0,o.jsx)(r,{text:`Disabled with Dropdown`,isDropdown:!0,isDisabled:!0,model:c})}),h={render:()=>(0,o.jsx)(m,{}),parameters:{docs:{description:{story:`MainButton with a dropdown menu in a disabled state. Both the button and dropdown are non-interactive.`},source:{code:`<MainButton text="Disabled with Dropdown" isDropdown isDisabled model={itemsModel} />`}}}},g={render:e=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{...e})}),args:{text:`Click Me`,isDropdown:!1,model:[],onAction:s()},parameters:{docs:{description:{story:"For a single action that needs no menu: the button has no arrow, and a click is reported in the Actions panel instead of opening a list (`isDropdown={false}`, `onAction`)."},source:{code:`<MainButton text="Click Me" isDropdown={false} model={[]} onAction={handleClick} />`}}}},_=[{key:0,label:`Blank document`,icon:a,description:`Start from an empty page and add the content yourself.`},{key:1,label:`From template`,icon:a,description:`Pick a ready-made layout from the gallery and fill in its fields.`},{key:2,label:`Upload file`,icon:a,description:`Add a file from your device to the current folder.`}],v=()=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{text:`Create`,model:_})}),y={render:()=>(0,o.jsx)(v,{}),parameters:{docs:{description:{story:"For choices that need a word of explanation: click the button and each item shows its label with a description under it, while the menu grows wider than the button to fit the text (`description` on the items of `model`)."},source:{code:`<MainButton
  text="Create"
  model={[
    {
      key: 0,
      label: "Blank document",
      icon: FolderIcon,
      description: "Start from an empty page and add the content yourself.",
    },
    {
      key: 1,
      label: "From template",
      icon: FolderIcon,
      description: "Pick a ready-made layout from the gallery and fill in its fields.",
    },
  ]}
/>`}}}},b=()=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{text:`Create new`,model:c})}),x={render:()=>(0,o.jsx)(b,{}),parameters:{docs:{description:{story:`MainButton with a full dropdown menu including icons, nested sub-menus, and separators. Click the button to see the dropdown.`},source:{code:`<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New spreadsheet", icon: FolderIcon },
    { key: 2, label: "New presentation", icon: FolderIcon },
    { key: 3, label: "Master form", icon: FolderIcon, items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ]},
    { key: 6, label: "New folder", icon: FolderIcon },
    { key: 7, isSeparator: true },
    { key: 8, label: "Upload", icon: FolderIcon },
  ]}
/>`}}}},S={render:e=>(0,o.jsx)(u,{children:(0,o.jsx)(r,{...e})}),args:{text:`Create new`,model:c,hideArrow:!0},parameters:{docs:{description:{story:"For a button whose label alone says it opens a list: the arrow beside the text is gone, yet a click still opens the same menu (`hideArrow`)."},source:{code:`<MainButton text="Create new" model={itemsModel} hideArrow />`}}}},C={render:e=>(0,o.jsx)(`div`,{dir:`rtl`,children:(0,o.jsx)(u,{children:(0,o.jsx)(r,{...e})})}),args:{text:`جديد`,model:c},globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`304px`},description:{story:'The button in a right-to-left layout: the text moves to the right edge and the arrow to the left; click it and the menu opens with its icons on the right and the sub-menu chevron on the left. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <MainButton text="جديد" model={itemsModel} />
</div>`}}}},w={render:()=>(0,o.jsx)(`div`,{style:{"--main-button-bg":`#0082c9`,"--main-button-color":`#ffffff`,"--main-button-icon-color":`#ffffff`,"--main-button-radius":`50px`,"--main-button-text-size":`14px`,"--main-button-text-weight":`600`,"--main-button-text-line-height":`24px`,"--main-button-inner-padding":`6px 20px`},children:(0,o.jsx)(u,{children:(0,o.jsx)(r,{text:`New`,model:c})})}),parameters:{docs:{description:{story:`Every overridable variable set on a wrapper around one button -- the variables are listed under CSS variables on this page. Click it to see the menu keep the button's new width.`},source:{code:`<div
  style={{
    "--main-button-bg": "#0082c9",
    "--main-button-color": "#ffffff",
    "--main-button-icon-color": "#ffffff",
    "--main-button-radius": "50px",
    "--main-button-text-size": "14px",
    "--main-button-text-weight": "600",
    "--main-button-text-line-height": "24px",
    "--main-button-inner-padding": "6px 20px",
  }}
>
  <MainButton text="New" model={itemsModel} />
</div>`}}}},T=[`Default`,`Disabled`,`DisabledWithDropdown`,`WithAction`,`WithItemDescriptions`,`WithDropdown`,`WithoutArrow`,`RightToLeft`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <MainButton {...args} />
    </Wrapper>,
  args: {
    text: "Main Button",
    model: itemsModel
  },
  parameters: {
    docs: {
      description: {
        story: "The button with its menu: click it to open the list of things to create, then change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<MainButton text="Main Button" model={itemsModel} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "MainButton in a disabled state. The button cannot be interacted with and appears with reduced opacity."
      },
      source: {
        code: \`<MainButton text="Disabled Button" isDisabled isDropdown={false} model={[]} />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledWithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story: "MainButton with a dropdown menu in a disabled state. Both the button and dropdown are non-interactive."
      },
      source: {
        code: \`<MainButton text="Disabled with Dropdown" isDropdown isDisabled model={itemsModel} />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <MainButton {...args} />
    </Wrapper>,
  args: {
    text: "Click Me",
    isDropdown: false,
    model: [],
    onAction: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "For a single action that needs no menu: the button has no arrow, and a click is reported in the Actions panel instead of opening a list (\`isDropdown={false}\`, \`onAction\`)."
      },
      source: {
        code: \`<MainButton text="Click Me" isDropdown={false} model={[]} onAction={handleClick} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <WithItemDescriptionsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For choices that need a word of explanation: click the button and each item shows its label with a description under it, while the menu grows wider than the button to fit the text (\`description\` on the items of \`model\`)."
      },
      source: {
        code: \`<MainButton
  text="Create"
  model={[
    {
      key: 0,
      label: "Blank document",
      icon: FolderIcon,
      description: "Start from an empty page and add the content yourself.",
    },
    {
      key: 1,
      label: "From template",
      icon: FolderIcon,
      description: "Pick a ready-made layout from the gallery and fill in its fields.",
    },
  ]}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <WithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story: "MainButton with a full dropdown menu including icons, nested sub-menus, and separators. Click the button to see the dropdown."
      },
      source: {
        code: \`<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New spreadsheet", icon: FolderIcon },
    { key: 2, label: "New presentation", icon: FolderIcon },
    { key: 3, label: "Master form", icon: FolderIcon, items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ]},
    { key: 6, label: "New folder", icon: FolderIcon },
    { key: 7, isSeparator: true },
    { key: 8, label: "Upload", icon: FolderIcon },
  ]}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <MainButton {...args} />
    </Wrapper>,
  args: {
    text: "Create new",
    model: itemsModel,
    hideArrow: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a button whose label alone says it opens a list: the arrow beside the text is gone, yet a click still opens the same menu (\`hideArrow\`)."
      },
      source: {
        code: \`<MainButton text="Create new" model={itemsModel} hideArrow />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Wrapper>
        <MainButton {...args} />
      </Wrapper>
    </div>,
  args: {
    text: "\\u062c\\u062f\\u064a\\u062f",
    model: itemsModel
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "304px"
      },
      description: {
        story: 'The button in a right-to-left layout: the text moves to the right edge and the arrow to the left; click it and the menu opens with its icons on the right and the sub-menu chevron on the left. The wrapper carries \`dir="rtl"\`; the direction also comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <MainButton text="\\u062c\\u062f\\u064a\\u062f" model={itemsModel} />
</div>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--main-button-bg": "#0082c9",
    "--main-button-color": "#ffffff",
    "--main-button-icon-color": "#ffffff",
    "--main-button-radius": "50px",
    "--main-button-text-size": "14px",
    "--main-button-text-weight": "600",
    "--main-button-text-line-height": "24px",
    "--main-button-inner-padding": "6px 20px"
  } as CSSProperties}>
      <Wrapper>
        <MainButton text="New" model={itemsModel} />
      </Wrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on a wrapper around one button -- the variables are listed under CSS variables on this page. Click it to see the menu keep the button's new width.\`
      },
      source: {
        code: \`<div
  style={{
    "--main-button-bg": "#0082c9",
    "--main-button-color": "#ffffff",
    "--main-button-icon-color": "#ffffff",
    "--main-button-radius": "50px",
    "--main-button-text-size": "14px",
    "--main-button-text-weight": "600",
    "--main-button-text-line-height": "24px",
    "--main-button-inner-padding": "6px 20px",
  }}
>
  <MainButton text="New" model={itemsModel} />
</div>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}}})))()}E();export{w as CssCustomization,d as Default,p as Disabled,h as DisabledWithDropdown,C as RightToLeft,g as WithAction,x as WithDropdown,y as WithItemDescriptions,S as WithoutArrow,T as __namedExportsOrder,l as default};