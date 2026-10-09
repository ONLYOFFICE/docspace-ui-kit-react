import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,r}from"./Avatar.enums-D3mbkRzL.js";import{n as i,t as a}from"./checkbox-CMveAvkq.js";import{r as o,t as s}from"./avatar-B92H6Cjq.js";import{n as c,t as l}from"./TableCell-7C_VA9gK.js";var u,d,f,p,m,h,g;function _(){return(_=e((()=>{c(),o(),i(),u=t(),d={title:`UI/Table/TableCell`,component:l,parameters:{docs:{description:{component:`TableCell is one cell of a TableRow: a fixed-height box that sits in the column the table's grid gives it.

The Table README describes it in full.`}}},argTypes:{hasAccess:{control:`boolean`,description:"Shows the child marked `table-container_row-checkbox` in place of the child marked `table-container_element` while the pointer is over the cell",table:{defaultValue:{summary:`false`}}},checked:{control:`boolean`,description:"Shows the child marked `table-container_row-checkbox` in place of the child marked `table-container_element` all the time",table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class applied to the cell after the component's own`},style:{control:`object`,description:`Inline styles applied to the cell`},children:{control:!1,description:`Content of the cell: text or elements`},value:{control:`text`,description:"Written onto the cell as a `value` attribute, which drag and drop reads to identify the item"},documentTitle:{control:`text`,description:"Written onto the cell as a `data-document-title` attribute"},dataTestId:{control:`text`,description:"Value of the cell's `data-testid` attribute",table:{defaultValue:{summary:`table-cell`}}},forwardedRef:{control:!1,description:`Ref of the cell element`}}},f={render:e=>(0,u.jsx)(l,{...e}),args:{className:`custom-cell`,children:`Cell Content`,hasAccess:!1,checked:!1},parameters:{docs:{description:{story:`A cell holding plain text, the most common case; change any other prop live in the Controls panel below.`},source:{code:`<TableCell className="custom-cell">Cell Content</TableCell>`}}}},p={render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(`div`,{className:`table-container_element`,children:(0,u.jsx)(s,{role:n.none,size:r.min,source:``,noClick:!e.hasAccess})}),(0,u.jsx)(a,{className:`table-container_row-checkbox`,isChecked:e.checked})]}),args:{className:`custom-cell`,hasAccess:!0,checked:!1},parameters:{docs:{description:{story:"An avatar that turns into a checkbox when the pointer is over the cell, so a row can be picked without a separate checkbox column (`hasAccess`). Hover the cell to see the swap."},source:{code:`<TableCell hasAccess>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`}}}},m={render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(`div`,{className:`table-container_element`,children:(0,u.jsx)(s,{role:n.none,size:r.min,source:``,noClick:!e.hasAccess})}),(0,u.jsx)(a,{className:`table-container_row-checkbox`,isChecked:e.checked})]}),args:{className:`custom-cell`,hasAccess:!0,checked:!0},parameters:{docs:{description:{story:"Once the row is selected the checkbox stays in place of the avatar even without the pointer over it (`checked`)."},source:{code:`<TableCell hasAccess checked>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked />
</TableCell>`}}}},h={render:e=>(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(`div`,{className:`table-container_element`,children:(0,u.jsx)(s,{role:n.none,size:r.min,source:``,noClick:!e.hasAccess})}),(0,u.jsx)(a,{className:`table-container_row-checkbox`,isChecked:e.checked})]}),args:{className:`custom-cell`,hasAccess:!1,checked:!1},parameters:{docs:{description:{story:"Without `hasAccess` the cell keeps the avatar on hover and never shows the checkbox, for a row the user may not select."},source:{code:`<TableCell hasAccess={false}>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`}}}},g=[`Default`,`WithElement`,`WithElementChecked`,`WithElementNoAccess`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <TableCell {...args} />,
  args: {
    className: "custom-cell",
    children: "Cell Content",
    hasAccess: false,
    checked: false
  },
  parameters: {
    docs: {
      description: {
        story: "A cell holding plain text, the most common case; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TableCell className="custom-cell">Cell Content</TableCell>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <TableCell {...args}>
      <div className="table-container_element">
        <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick={!args.hasAccess} />
      </div>
      <Checkbox className="table-container_row-checkbox" isChecked={args.checked} />
    </TableCell>,
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: false
  },
  parameters: {
    docs: {
      description: {
        story: "An avatar that turns into a checkbox when the pointer is over the cell, so a row can be picked without a separate checkbox column (\`hasAccess\`). Hover the cell to see the swap."
      },
      source: {
        code: \`<TableCell hasAccess>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <TableCell {...args}>
      <div className="table-container_element">
        <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick={!args.hasAccess} />
      </div>
      <Checkbox className="table-container_row-checkbox" isChecked={args.checked} />
    </TableCell>,
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "Once the row is selected the checkbox stays in place of the avatar even without the pointer over it (\`checked\`)."
      },
      source: {
        code: \`<TableCell hasAccess checked>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked />
</TableCell>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <TableCell {...args}>
      <div className="table-container_element">
        <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick={!args.hasAccess} />
      </div>
      <Checkbox className="table-container_row-checkbox" isChecked={args.checked} />
    </TableCell>,
  args: {
    className: "custom-cell",
    hasAccess: false,
    checked: false
  },
  parameters: {
    docs: {
      description: {
        story: "Without \`hasAccess\` the cell keeps the avatar on hover and never shows the checkbox, for a row the user may not select."
      },
      source: {
        code: \`<TableCell hasAccess={false}>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{f as Default,p as WithElement,m as WithElementChecked,h as WithElementNoAccess,g as __namedExportsOrder,d as default};