import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./catalog.folder.react-BLNaFnHq.js";import{n as a,t as o}from"./tags-9ikQWVg3.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{s=t(),r(),a(),c=n(),{fn:l}=__STORYBOOK_MODULE_TEST__,u={title:`UI/Data display/Tags`,component:o,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{tags:{description:`Tags to lay out: plain strings, or objects with a label and an optional icon, suffix or icon-only look`},columnCount:{control:`number`,description:`How many tags are drawn before the rest collapse into one overflow tag; -1 draws all of them`},showCreateTag:{control:`boolean`,description:`Draws a plus tag after the others, or before them when every tag is shown; it disappears as soon as the tags overflow`,table:{defaultValue:{summary:`false`}}},removeTagIcon:{control:`boolean`,description:`Removes the leading margin of each entry in the overflow drop-down, so the entry text starts at the menu's edge`,table:{defaultValue:{summary:`false`}}},onSelectTag:{action:`tag selected`,description:`Called with the tag's label (and its passed-through numbers) when a tag or an entry of the overflow drop-down is clicked`},onMouseEnter:{action:`mouse enter`,description:`Called when the pointer enters any tag; it is not told which one`},onMouseLeave:{action:`mouse leave`,description:`Called when the pointer leaves any tag`},onOptionTagClick:{control:!1,description:`Called when the overflow tag or the plus tag is clicked; passing it turns the overflow tag into a +N count with no drop-down`},optionTagRef:{control:!1,description:`Ref to the overflow tag, for anchoring a menu of your own to it`},id:{control:`text`,description:`Applied to the outermost element`},className:{control:`text`,description:`Applied to the outermost element`},style:{control:`object`,description:`Inline style of the outermost element; its width is the width the tags share`}}},d={render:e=>(0,c.jsx)(o,{...e}),args:{tags:[`Design`,`Development`],columnCount:2}},f=e=>{let t=(0,s.useRef)(null);return(0,c.jsx)(o,{...e,optionTagRef:t})},p=e=>t=>(0,c.jsx)(`div`,{style:{height:e,paddingTop:20},children:(0,c.jsx)(t,{})}),m={render:e=>(0,c.jsx)(o,{...e}),args:{tags:[`Draft`,`Review`,`Contract`,`Invoice`,`Archive`],columnCount:5},parameters:{docs:{description:{story:`Five tags side by side, each given an equal share of the row, for when the column count leaves room for all of them.`},source:{code:`<Tags
  tags={["Draft", "Review", "Contract", "Invoice", "Archive"]}
  columnCount={5}
  onSelectTag={handleSelect}
/>`}}}},h={render:e=>(0,c.jsx)(o,{...e}),decorators:[p(150)],args:{tags:[`Tag1`,`Tag2`,`Tag3`,`Tag4`,`Tag5`,`Tag6`],style:{width:`250px`},columnCount:3},parameters:{docs:{description:{story:"Three tags and a `...` tag; click it to list the other three in a drop-down, and click an entry to select it (`onSelectTag`). Switch `removeTagIcon` in the Controls panel below to see the entries lose their leading margin."},source:{code:`<Tags
  tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]}
  style={{ width: "250px" }}
  columnCount={3}
  onSelectTag={handleSelect}
/>`}}}},g={render:e=>(0,c.jsx)(o,{...e}),args:{tags:[{label:`Design`,icon:i},{label:`Review`,labelSuffix:` (3)`},{label:`Storage`,icon:i,isThirdParty:!0}],columnCount:3},parameters:{docs:{description:{story:"**Design** carries an icon before its label, **Review** a suffix after it, and the third tag is only its icon at a fixed width (`isThirdParty`) — the looks a plain string cannot ask for."},source:{code:`<Tags
  tags={[
    { label: "Design", icon: FolderIcon },
    { label: "Review", labelSuffix: " (3)" },
    { label: "Storage", icon: FolderIcon, isThirdParty: true },
  ]}
  columnCount={3}
  onSelectTag={handleSelect}
/>`}}}},_={render:e=>(0,c.jsx)(o,{...e}),args:{tags:[`Tag1`,`Tag2`,`Tag3`,`Tag4`,`Tag5`],columnCount:-1},parameters:{docs:{description:{story:"All five tags at their natural width with no overflow tag, for a place where every tag must stay visible (`columnCount={-1}`); tags that do not fit are cut off at the container edge."},source:{code:`<Tags tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]} columnCount={-1} onSelectTag={handleSelect} />`}}}},v={render:e=>(0,c.jsx)(o,{...e}),args:{tags:[`Design`,`Development`],columnCount:3,showCreateTag:!0,onOptionTagClick:l()},parameters:{docs:{description:{story:"A plus tag after the two tags, for offering to add one more (`showCreateTag`); clicking it calls `onOptionTagClick`, and it disappears once the tags overflow."},source:{code:`<Tags
  tags={["Design", "Development"]}
  columnCount={3}
  showCreateTag
  onSelectTag={handleSelect}
  onOptionTagClick={openCreateDialog}
/>`}}}},y={render:e=>(0,c.jsx)(f,{...e}),decorators:[p(100)],args:{tags:[`Tag1`,`Tag2`,`Tag3`],columnCount:2,onOptionTagClick:l(),style:{width:`150px`}},parameters:{docs:{description:{story:"Two tags and a `+1` count instead of `...`, for when the hidden tags belong in a menu of your own: clicking the count opens no drop-down and calls `onOptionTagClick`, and `optionTagRef` points at it for anchoring."},source:{code:`const optionRef = useRef(null);
<Tags
  tags={["Tag1", "Tag2", "Tag3"]}
  columnCount={2}
  onSelectTag={handleSelect}
  optionTagRef={optionRef}
  onOptionTagClick={openTagMenu}
  style={{ width: "150px" }}
/>`}}}},b=e=>((0,s.useEffect)(()=>{let e=document.documentElement;return e.style.setProperty(`--tags-overflow-text-margin`,`24px`),()=>{e.style.removeProperty(`--tags-overflow-text-margin`)}},[]),(0,c.jsx)(o,{...e})),x={render:e=>(0,c.jsx)(b,{...e}),args:{tags:[`Draft`,`Review`,`Contract`,`Invoice`],columnCount:3,style:{width:`200px`}},parameters:{docs:{story:{inline:!1,height:`180px`},description:{story:"The variable is listed under CSS variables on this page. The example sets it to 24px on the document; click the `...` tag to see the entry **Invoice** start further from the menu's edge."},source:{code:`:root {
  --tags-overflow-text-margin: 24px;
}

<Tags
  tags={["Draft", "Review", "Contract", "Invoice"]}
  columnCount={3}
  style={{ width: "200px" }}
  onSelectTag={handleSelect}
/>`}}}},S=[`Default`,`MultipleTags`,`WithOverflow`,`WithTagObjects`,`ShowAll`,`WithCreateTag`,`WithCustomOptionTag`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 2
  }
}`,...d.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  args: {
    tags: ["Draft", "Review", "Contract", "Invoice", "Archive"],
    columnCount: 5
  },
  parameters: {
    docs: {
      description: {
        story: "Five tags side by side, each given an equal share of the row, for when the column count leaves room for all of them."
      },
      source: {
        code: \`<Tags
  tags={["Draft", "Review", "Contract", "Invoice", "Archive"]}
  columnCount={5}
  onSelectTag={handleSelect}
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  decorators: [withRoomBelow(150)],
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    style: {
      width: "250px"
    },
    columnCount: 3
  },
  parameters: {
    docs: {
      description: {
        story: "Three tags and a \`...\` tag; click it to list the other three in a drop-down, and click an entry to select it (\`onSelectTag\`). Switch \`removeTagIcon\` in the Controls panel below to see the entries lose their leading margin."
      },
      source: {
        code: \`<Tags
  tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]}
  style={{ width: "250px" }}
  columnCount={3}
  onSelectTag={handleSelect}
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  args: {
    tags: [{
      label: "Design",
      icon: FolderIcon
    }, {
      label: "Review",
      labelSuffix: " (3)"
    }, {
      label: "Storage",
      icon: FolderIcon,
      isThirdParty: true
    }],
    columnCount: 3
  },
  parameters: {
    docs: {
      description: {
        story: "**Design** carries an icon before its label, **Review** a suffix after it, and the third tag is only its icon at a fixed width (\`isThirdParty\`) — the looks a plain string cannot ask for."
      },
      source: {
        code: \`<Tags
  tags={[
    { label: "Design", icon: FolderIcon },
    { label: "Review", labelSuffix: " (3)" },
    { label: "Storage", icon: FolderIcon, isThirdParty: true },
  ]}
  columnCount={3}
  onSelectTag={handleSelect}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  args: {
    tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
    columnCount: -1
  },
  parameters: {
    docs: {
      description: {
        story: "All five tags at their natural width with no overflow tag, for a place where every tag must stay visible (\`columnCount={-1}\`); tags that do not fit are cut off at the container edge."
      },
      source: {
        code: \`<Tags tags={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]} columnCount={-1} onSelectTag={handleSelect} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Tags {...args} />,
  args: {
    tags: ["Design", "Development"],
    columnCount: 3,
    showCreateTag: true,
    onOptionTagClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A plus tag after the two tags, for offering to add one more (\`showCreateTag\`); clicking it calls \`onOptionTagClick\`, and it disappears once the tags overflow."
      },
      source: {
        code: \`<Tags
  tags={["Design", "Development"]}
  columnCount={3}
  showCreateTag
  onSelectTag={handleSelect}
  onOptionTagClick={openCreateDialog}
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <CustomOptionTagTemplate {...args} />,
  decorators: [withRoomBelow(100)],
  args: {
    tags: ["Tag1", "Tag2", "Tag3"],
    columnCount: 2,
    onOptionTagClick: fn(),
    style: {
      width: "150px"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Two tags and a \`+1\` count instead of \`...\`, for when the hidden tags belong in a menu of your own: clicking the count opens no drop-down and calls \`onOptionTagClick\`, and \`optionTagRef\` points at it for anchoring."
      },
      source: {
        code: \`const optionRef = useRef(null);
<Tags
  tags={["Tag1", "Tag2", "Tag3"]}
  columnCount={2}
  onSelectTag={handleSelect}
  optionTagRef={optionRef}
  onOptionTagClick={openTagMenu}
  style={{ width: "150px" }}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <CssCustomizationTemplate {...args} />,
  args: {
    tags: ["Draft", "Review", "Contract", "Invoice"],
    columnCount: 3,
    style: {
      width: "200px"
    }
  },
  parameters: {
    docs: {
      // Own document: the variable is set on <html> and would indent every story's drop-down.
      story: {
        inline: false,
        height: "180px"
      },
      description: {
        story: \`The variable is listed under CSS variables on this page. The example sets it to 24px on the document; click the \\\`...\\\` tag to see the entry **Invoice** start further from the menu's edge.\`
      },
      source: {
        code: \`:root {
  --tags-overflow-text-margin: 24px;
}

<Tags
  tags={["Draft", "Review", "Contract", "Invoice"]}
  columnCount={3}
  style={{ width: "200px" }}
  onSelectTag={handleSelect}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as CssCustomization,d as Default,m as MultipleTags,_ as ShowAll,v as WithCreateTag,y as WithCustomOptionTag,h as WithOverflow,g as WithTagObjects,S as __namedExportsOrder,u as default};