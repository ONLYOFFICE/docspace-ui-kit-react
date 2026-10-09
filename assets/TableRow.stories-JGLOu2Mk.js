import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./TableCell-7C_VA9gK.js";import{n as i,t as a}from"./TableRow-JzNOco51.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),s={title:`UI/Table/TableRow`,component:a,parameters:{docs:{description:{component:`TableRow is one row of a table: its cells followed by a last cell with the row's context menu button.

The Table README describes it in full.`}}},argTypes:{checked:{control:`boolean`,description:"Adds a `checked` class to the row for the consumer's highlight and reveals children marked `create-share-link`",table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:"Marks the row whose context menu is open: reveals children marked `create-share-link` and turns off the drop highlight",table:{defaultValue:{summary:`false`}}},dragging:{control:`boolean`,description:"Fills children marked `droppable-hover` with the drop colour while something is dragged over the table",table:{defaultValue:{summary:`false`}}},isIndexEditingMode:{control:`boolean`,description:`Leaves out the last cell with the context menu button, for rows being reordered`,table:{defaultValue:{summary:`false`}}},hideColumns:{control:`boolean`,description:`Adds a class for the narrow layout the header asks for when it runs out of room; the kit styles nothing with it`,table:{defaultValue:{summary:`false`}}},contextOptions:{control:!1,description:`Items of the context menu; a non-empty list renders the three-dot button, an empty one leaves a blank space instead`},getContextModel:{control:!1,description:`Builds the context menu items at the moment the menu opens`},title:{control:`text`,description:`Hover tooltip of the three-dot button`},badgeUrl:{control:`text`,description:`URL of a badge image shown in the context menu's header`},selectionProp:{control:`object`,description:"Class and `value` spread onto the last cell, which holds the context menu button"},contextMenuCellStyle:{control:`object`,description:`Inline styles of the last cell`},className:{control:`text`,description:`Class applied to the row after the component's own`},style:{control:`object`,description:`Inline styles of the row; inside a table the header overwrites its grid columns`},dataTestId:{control:`text`,description:"Value of the row's `data-testid` attribute",table:{defaultValue:{summary:`table-row`}}},contextMenuTestId:{control:`text`,description:"Value of the context menu's `data-testid` attribute"},fileContextClick:{action:`fileContextClick`,description:"Called when the context menu is asked for, with `true` for a right-click"},onHideContextMenu:{action:`onHideContextMenu`,description:`Called when the context menu closes`},onClick:{action:`onClick`,description:`Called with the mouse event on a click anywhere in the row`},onDoubleClick:{action:`onDoubleClick`,description:`Called with the mouse event on a double click anywhere in the row`},onMouseEnter:{action:`onMouseEnter`,description:`Called when the pointer enters the row`},onMouseLeave:{action:`onMouseLeave`,description:`Called when the pointer leaves the row`},forwardedRef:{control:!1,description:`Ref of the row element`},children:{control:!1,description:"The row's cells, normally one `TableCell` per column"}},args:{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr) 24px`}}},c=[{key:`edit`,label:`Edit`,onClick:()=>console.log(`Edit clicked`)},{key:`delete`,label:`Delete`,onClick:()=>console.log(`Delete clicked`)}],l=(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r,{children:(0,o.jsx)(`span`,{children:`Cell 1`})}),(0,o.jsx)(r,{children:(0,o.jsx)(`span`,{children:`Cell 2`})}),(0,o.jsx)(r,{children:(0,o.jsx)(`span`,{children:`Cell 3`})})]}),u={render:e=>(0,o.jsx)(a,{...e}),args:{children:l,className:`custom-row-class`,selectionProp:{className:`selection-class`},title:`Context menu`,contextOptions:c},parameters:{docs:{description:{story:`A row with a context menu, the way rows in a file list offer their actions: right-click anywhere in the row, or click the three-dot button at its end.`},source:{code:`<TableRow
  contextOptions={contextOptions}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`}}}},d={render:e=>(0,o.jsx)(a,{...e}),args:{children:l,className:`custom-row-class`,selectionProp:{className:`selection-class`},isIndexEditingMode:!0},parameters:{docs:{description:{story:"While rows are being reordered the last cell with the context menu button is left out, so a drag cannot open a menu by accident (`isIndexEditingMode`)."},source:{code:`<TableRow
  isIndexEditingMode
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`}}}},f=[`Default`,`IndexEditingMode`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: {
      className: "selection-class"
    },
    title: "Context menu",
    contextOptions
  },
  parameters: {
    docs: {
      description: {
        story: "A row with a context menu, the way rows in a file list offer their actions: right-click anywhere in the row, or click the three-dot button at its end."
      },
      source: {
        code: \`<TableRow
  contextOptions={contextOptions}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: {
      className: "selection-class"
    },
    isIndexEditingMode: true
  },
  parameters: {
    docs: {
      description: {
        story: "While rows are being reordered the last cell with the context menu button is left out, so a drag cannot open a menu by accident (\`isIndexEditingMode\`)."
      },
      source: {
        code: \`<TableRow
  isIndexEditingMode
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Default,d as IndexEditingMode,f as __namedExportsOrder,s as default};