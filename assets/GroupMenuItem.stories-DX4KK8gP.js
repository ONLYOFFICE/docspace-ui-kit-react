import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./GroupMenuItem-BH7HBiNq.js";var i,a,o,s,c,l,u;function d(){return(d=e((()=>{n(),i=t(),a={title:`UI/Table/GroupMenuItem`,component:r,parameters:{docs:{description:{component:`GroupMenuItem is one action button of a TableGroupMenu, the toolbar that replaces the table header while rows are selected.

The Table README describes it in full.`}}},argTypes:{isBlocked:{control:`boolean`,description:`Greys the button out and ignores clicks on it`,table:{defaultValue:{summary:`false`}}},item:{control:!1,description:`The action: its label, icon URL, tooltip, click handler, and the options of its menu when it has one`},dataTestId:{control:`text`,description:"Value of the item's `data-testid` attribute",table:{defaultValue:{summary:`group-menu-item`}}}}},o=(e={})=>({label:`Menu Item`,disabled:!1,onClick:()=>{},iconUrl:``,title:`Menu Item Title`,withDropDown:!1,options:[],id:`group-menu-item`,...e}),s={render:e=>(0,i.jsx)(r,{...e}),args:{item:o(),isBlocked:!1},parameters:{docs:{description:{story:`A single action applied to every selected row with one click, the most common entry of a group menu; change any other prop live in the Controls panel below.`},source:{code:`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked={false}
/>`}}}},c={render:e=>(0,i.jsx)(r,{...e}),args:{item:o({withDropDown:!0,options:[{key:`option-1`,label:`Option 1`,onClick:()=>{}},{key:`option-2`,label:`Option 2`,onClick:()=>{}}]}),isBlocked:!1},parameters:{docs:{description:{story:"An action with variants: click the button and pick one of its options from the menu under it (`withDropDown`, `options`)."},source:{code:`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
    withDropDown: true,
    options: [
      { key: "option-1", label: "Option 1", onClick: handleOption1 },
      { key: "option-2", label: "Option 2", onClick: handleOption2 },
    ],
  }}
  isBlocked={false}
/>`}}}},l={render:e=>(0,i.jsx)(r,{...e}),args:{item:o(),isBlocked:!0},parameters:{docs:{description:{story:"The same button greyed out and ignoring clicks, while an operation on the selection is still running (`isBlocked`)."},source:{code:`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked
/>`}}}},u=[`Default`,`WithDropdown`,`Blocked`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem(),
    isBlocked: false
  },
  parameters: {
    docs: {
      description: {
        story: "A single action applied to every selected row with one click, the most common entry of a group menu; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked={false}
/>\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem({
      withDropDown: true,
      options: [{
        key: "option-1",
        label: "Option 1",
        onClick: () => {}
      }, {
        key: "option-2",
        label: "Option 2",
        onClick: () => {}
      }]
    }),
    isBlocked: false
  },
  parameters: {
    docs: {
      description: {
        story: "An action with variants: click the button and pick one of its options from the menu under it (\`withDropDown\`, \`options\`)."
      },
      source: {
        code: \`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
    withDropDown: true,
    options: [
      { key: "option-1", label: "Option 1", onClick: handleOption1 },
      { key: "option-2", label: "Option 2", onClick: handleOption2 },
    ],
  }}
  isBlocked={false}
/>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem(),
    isBlocked: true
  },
  parameters: {
    docs: {
      description: {
        story: "The same button greyed out and ignoring clicks, while an operation on the selection is still running (\`isBlocked\`)."
      },
      source: {
        code: \`<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as Blocked,s as Default,c as WithDropdown,u as __namedExportsOrder,a as default};