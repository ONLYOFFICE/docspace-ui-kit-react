import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{S as n,v as r}from"./enums-DzcBu485.js";import{n as i,t as a}from"./TableSettings-DLgWz2KQ.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i(),o=t(),s={title:`UI/Table/TableSettings`,component:a,parameters:{docs:{description:{component:`TableSettings is the cog at the end of a TableHeader that opens a list of the columns, each with a checkbox that shows or hides it.

The Table README describes it in full.`}}},argTypes:{columns:{control:!1,description:"The table's columns; only those with an `onChange` and without `isDisabled` get a checkbox"},disableSettings:{control:`boolean`,description:`Greys the cog out and stops the list of columns opening`,table:{defaultValue:{summary:`false`}}}}},c={render:e=>(0,o.jsx)(a,{...e}),args:{columns:[{key:`name`,title:`Name`,enable:!0,sortBy:r.Name,onChange:()=>{}},{key:`type`,title:`Type`,enable:!0,sortBy:r.Type,onChange:()=>{}},{key:`modified`,title:`Modified`,enable:!1,sortBy:r.ModifiedDate,onChange:()=>{}},{key:`owner`,title:`Owner`,enable:!0,sortBy:r.Author,onChange:()=>{}}],disableSettings:!1},parameters:{docs:{description:{story:`The cog that lets a user choose which columns to see; click it to open the list, where Modified is unticked because that column is hidden.`},source:{code:`<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
    { key: "owner", title: "Owner", enable: true, sortBy: SortByFieldName.Author, onChange: handleToggle },
  ]}
  disableSettings={false}
/>`}}}},l={render:e=>(0,o.jsx)(a,{...e}),args:{...c.args,disableSettings:!0},parameters:{docs:{description:{story:"A greyed-out cog that does not open, for the moments the column set must not change, such as while rows are reordered (`disableSettings`)."},source:{code:`<TableSettings
  columns={columns}
  disableSettings
/>`}}}},u={render:e=>(0,o.jsx)(a,{...e}),args:{columns:[{key:`name`,title:`Name`,enable:!0,sortBy:r.Name,isDisabled:!0,onChange:()=>{}},{key:`type`,title:`Type`,enable:!0,sortBy:r.Type,onChange:()=>{}},{key:`size`,title:`Size`,enable:!0,sortBy:r.Size},{key:`modified`,title:`Modified`,enable:!1,sortBy:r.ModifiedDate,onChange:()=>{}}],disableSettings:!1},parameters:{docs:{description:{story:"Click the cog: only Type and Modified are listed. Name is marked `isDisabled` and Size has no `onChange`, so neither can be hidden, which keeps the column that identifies a row always on screen."},source:{code:`<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, isDisabled: true, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, onChange: handleToggle },
    { key: "size", title: "Size", enable: true },
    { key: "modified", title: "Modified", enable: false, onChange: handleToggle },
  ]}
/>`}}}},d=[`Default`,`Disabled`,`WithLockedColumns`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <TableSettings {...args} />,
  args: {
    columns: [{
      key: "name",
      title: "Name",
      enable: true,
      sortBy: SortByFieldName.Name,
      onChange: () => {}
    }, {
      key: "type",
      title: "Type",
      enable: true,
      sortBy: SortByFieldName.Type,
      onChange: () => {}
    }, {
      key: "modified",
      title: "Modified",
      enable: false,
      sortBy: SortByFieldName.ModifiedDate,
      onChange: () => {}
    }, {
      key: "owner",
      title: "Owner",
      enable: true,
      sortBy: SortByFieldName.Author,
      onChange: () => {}
    }],
    disableSettings: false
  },
  parameters: {
    docs: {
      description: {
        story: "The cog that lets a user choose which columns to see; click it to open the list, where Modified is unticked because that column is hidden."
      },
      source: {
        code: \`<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
    { key: "owner", title: "Owner", enable: true, sortBy: SortByFieldName.Author, onChange: handleToggle },
  ]}
  disableSettings={false}
/>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <TableSettings {...args} />,
  args: {
    ...Default.args,
    disableSettings: true
  },
  parameters: {
    docs: {
      description: {
        story: "A greyed-out cog that does not open, for the moments the column set must not change, such as while rows are reordered (\`disableSettings\`)."
      },
      source: {
        code: \`<TableSettings
  columns={columns}
  disableSettings
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <TableSettings {...args} />,
  args: {
    columns: [{
      key: "name",
      title: "Name",
      enable: true,
      sortBy: SortByFieldName.Name,
      isDisabled: true,
      onChange: () => {}
    }, {
      key: "type",
      title: "Type",
      enable: true,
      sortBy: SortByFieldName.Type,
      onChange: () => {}
    }, {
      key: "size",
      title: "Size",
      enable: true,
      sortBy: SortByFieldName.Size
    }, {
      key: "modified",
      title: "Modified",
      enable: false,
      sortBy: SortByFieldName.ModifiedDate,
      onChange: () => {}
    }],
    disableSettings: false
  },
  parameters: {
    docs: {
      description: {
        story: "Click the cog: only Type and Modified are listed. Name is marked \`isDisabled\` and Size has no \`onChange\`, so neither can be hidden, which keeps the column that identifies a row always on screen."
      },
      source: {
        code: \`<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, isDisabled: true, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, onChange: handleToggle },
    { key: "size", title: "Size", enable: true },
    { key: "modified", title: "Modified", enable: false, onChange: handleToggle },
  ]}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{c as Default,l as Disabled,u as WithLockedColumns,d as __namedExportsOrder,s as default};