import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./catalog.folder.react-VUpu0ofJ.js";import{n as i,t as a}from"./catalog.folder.react-BLNaFnHq.js";import{n as o,t as s}from"./tag-DZauVoJE.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{i(),n(),o(),c=t(),l={title:`UI/Data display/Tag`,component:s,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-2597&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{tag:{control:`text`,description:"Identifier of the tag: handed to `onDelete`, and shown as the text when `label` is left out"},label:{control:`text`,description:`Text of the tag, also used as its accessible name`},isNewTag:{control:`boolean`,description:'Draws the tag in its "new" colours; together with `onDelete` it also shows the delete cross',table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables the tag and prevents interactions`,table:{defaultValue:{summary:`false`}}},isDeleted:{control:`boolean`,description:"Marks the tag as removed: the border greys out and `onClick` stops firing",table:{defaultValue:{summary:`false`}}},tagMaxWidth:{control:`text`,description:`Maximum width of the tag (CSS value)`},icon:{control:!1,description:`Glyph before the label: an SVG URL, or a component rendered as a 12px icon`},iconClassName:{control:`text`,description:`Class name applied to the glyph`},withLabel:{control:`boolean`,description:`Whether the label is rendered; turn it off for a tag that is only its glyph`,table:{defaultValue:{summary:`true`}}},labelSuffix:{control:`text`,description:`Extra text after the label, on the same line`},labelSuffixColor:{control:`color`,description:`CSS colour of the label suffix`},isLast:{control:`boolean`,description:`Drops the space after the tag, for the last tag in a row`,table:{defaultValue:{summary:`false`}}},isDefault:{control:!1,description:`Ignored: nothing on a single tag reads it`},roomType:{control:`number`,description:"Number passed straight back through `onClick`; the tag itself does nothing with it"},providerType:{control:`number`,description:"Number passed straight back through `onClick`; the tag itself does nothing with it"},id:{control:`text`,description:`Id of the outermost element`},className:{control:`text`,description:`Class name of the outermost element`},style:{control:`object`,description:"Inline style of the outermost element; `tagMaxWidth` wins over its `maxWidth`"},dataTestId:{control:`text`,description:"`data-testid` of the outermost element",table:{defaultValue:{summary:`"tag_item"`}}},ref:{control:!1,description:`Ref to the outermost element`},onClick:{action:`clicked`,description:"Called on a click anywhere in the tag with `{ label, roomType, providerType }`, not with the DOM event; silent while the tag is disabled or deleted"},onDelete:{action:`deleted`,description:"Called with `tag` when the cross is clicked; the cross appears only on a new tag"},onMouseEnter:{action:`mouseEntered`,description:`Called when the pointer enters the tag`},onMouseLeave:{action:`mouseLeft`,description:`Called when the pointer leaves the tag`}}},u=e=>(0,c.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`8px`,alignItems:`center`},children:e.children}),d={render:e=>(0,c.jsx)(s,{...e}),args:{tag:`script`,label:`Script`,tagMaxWidth:`160px`},parameters:{docs:{description:{story:`A plain tag with a label, the starting point for every other state; change any prop live in the Controls panel below.`},source:{code:`<Tag tag="script" label="Script" tagMaxWidth="160px" />`}}}},f=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{tag:`default`,label:`Default`}),(0,c.jsx)(s,{tag:`new`,label:`New Tag`,isNewTag:!0,onDelete:()=>{}}),(0,c.jsx)(s,{tag:`disabled`,label:`Disabled`,isDisabled:!0}),(0,c.jsx)(s,{tag:`deleted`,label:`Deleted`,isDeleted:!0})]}),p=({onDelete:e})=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{tag:`drafts`,label:`Drafts`,isNewTag:!0,onDelete:e}),(0,c.jsx)(s,{tag:`review`,label:`Review`,isNewTag:!0,onDelete:e}),(0,c.jsx)(s,{tag:`archive`,label:`Archive`,isNewTag:!0,onDelete:e})]}),m=({onClick:e})=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{tag:`design`,label:`Design`,onClick:e}),(0,c.jsx)(s,{tag:`development`,label:`Development`,onClick:e}),(0,c.jsx)(s,{tag:`marketing`,label:`Marketing`,onClick:e})]}),h=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{tag:`short`,label:`Short`,tagMaxWidth:`80px`}),(0,c.jsx)(s,{tag:`long`,label:`This is a very long tag label that will be truncated`,tagMaxWidth:`160px`}),(0,c.jsx)(s,{tag:`wide`,label:`Wide tag with more space`,tagMaxWidth:`250px`})]}),g={render:()=>(0,c.jsx)(f,{}),parameters:{docs:{description:{story:"The four looks a tag can take, side by side, to pick the one that matches an item's status:\n\n- **Default** — a bordered tag on the plain background\n- **New Tag** — a filled tag with a delete cross after the label (`isNewTag` with `onDelete`)\n- **Disabled** — a dashed border; the tag ignores hover and clicks (`isDisabled`)\n- **Deleted** — a greyed-out border; clicks no longer reach `onClick` (`isDeleted`)"},source:{code:`<Tag tag="default" label="Default" />
<Tag tag="new" label="New Tag" isNewTag onDelete={() => {}} />
<Tag tag="disabled" label="Disabled" isDisabled />
<Tag tag="deleted" label="Deleted" isDeleted />`}}}},_={render:e=>(0,c.jsx)(p,{...e}),parameters:{docs:{description:{story:"Tags the user has just added and can still take back: click a cross to remove its tag, and the Actions panel shows the identifier `onDelete` receives."},source:{code:`<Tag tag="drafts" label="Drafts" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="review" label="Review" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="archive" label="Archive" isNewTag onDelete={(tag) => console.log(tag)} />`}}}},v={render:e=>(0,c.jsx)(m,{...e}),parameters:{docs:{description:{story:"Tags that act as filters: hover one to see it highlight, click it, and the Actions panel shows the `{ label }` object `onClick` receives instead of the DOM event."},source:{code:`<Tag tag="design" label="Design" onClick={({ label }) => console.log(label)} />
<Tag tag="development" label="Development" onClick={({ label }) => console.log(label)} />
<Tag tag="marketing" label="Marketing" onClick={({ label }) => console.log(label)} />`}}}},y={render:()=>(0,c.jsx)(h,{}),parameters:{docs:{description:{story:`Tags with different max-width values. Long text is truncated with ellipsis when it exceeds the max width.`},source:{code:`<Tag tag="short" label="Short" tagMaxWidth="80px" />
<Tag tag="long" label="This is a very long tag label..." tagMaxWidth="160px" />
<Tag tag="wide" label="Wide tag with more space" tagMaxWidth="250px" />`}}}},b={render:()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{tag:`url`,label:`Folder from a URL`,icon:r,withLabel:!1}),(0,c.jsx)(s,{tag:`component`,label:`Folder component`,icon:a,withLabel:!1})]}),parameters:{docs:{description:{story:"A compact tag that is only a glyph marks where an item comes from without taking the width of a label; the hidden label still names the tag for screen readers (`withLabel={false}`):\n\n- **First tag** — the glyph loaded from an SVG file (`icon` as a URL)\n- **Second tag** — the same glyph passed as a React component (`icon` as a component)"},source:{code:`<Tag tag="url" label="Folder from a URL" icon={folderIconUrl} withLabel={false} />
<Tag tag="component" label="Folder component" icon={FolderIcon} withLabel={false} />`}}}},x={render:e=>(0,c.jsx)(s,{...e}),args:{tag:`reports`,label:`Reports`,labelSuffix:` (12)`,labelSuffixColor:`#A3A9AE`},parameters:{docs:{description:{story:"A count after the label, in a quieter colour, tells the reader how many items the tag covers without a second element (`labelSuffix`, `labelSuffixColor`)."},source:{code:`<Tag tag="reports" label="Reports" labelSuffix=" (12)" labelSuffixColor="#A3A9AE" />`}}}},S={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,"--tag-bg":`#EDE7F6`,"--tag-border-style":`1px solid #9C27B0`,"--tag-radius":`16px`,"--tag-inner-padding":`4px 14px`,"--tag-height":`30px`,"--tag-spacing-end":`16px`},children:[(0,c.jsx)(s,{tag:`custom`,label:`Custom Tag`}),(0,c.jsx)(s,{tag:`second`,label:`Second Tag`})]}),parameters:{docs:{description:{story:"Six variables set on one wrapper -- the variables are listed under CSS variables on this page. Both tags take every variable from the wrapper; the second is there to show the space `--tag-spacing-end` leaves after **Custom Tag**."},source:{code:`<div
  style={{
    display: "flex",
    "--tag-bg": "#EDE7F6",
    "--tag-border-style": "1px solid #9C27B0",
    "--tag-radius": "16px",
    "--tag-inner-padding": "4px 14px",
    "--tag-height": "30px",
    "--tag-spacing-end": "16px",
  }}
>
  <Tag tag="custom" label="Custom Tag" />
  <Tag tag="second" label="Second Tag" />
</div>`}}}},C=[`Default`,`States`,`NewTags`,`ClickableTags`,`MaxWidthVariants`,`IconOnly`,`WithLabelSuffix`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Tag {...args} />,
  args: {
    tag: "script",
    label: "Script",
    tagMaxWidth: "160px"
  },
  parameters: {
    docs: {
      description: {
        story: "A plain tag with a label, the starting point for every other state; change any prop live in the Controls panel below."
      },
      source: {
        code: \`<Tag tag="script" label="Script" tagMaxWidth="160px" />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The four looks a tag can take, side by side, to pick the one that matches an item's status:

- **Default** — a bordered tag on the plain background
- **New Tag** — a filled tag with a delete cross after the label (\\\`isNewTag\\\` with \\\`onDelete\\\`)
- **Disabled** — a dashed border; the tag ignores hover and clicks (\\\`isDisabled\\\`)
- **Deleted** — a greyed-out border; clicks no longer reach \\\`onClick\\\` (\\\`isDeleted\\\`)\`
      },
      source: {
        code: \`<Tag tag="default" label="Default" />
<Tag tag="new" label="New Tag" isNewTag onDelete={() => {}} />
<Tag tag="disabled" label="Disabled" isDisabled />
<Tag tag="deleted" label="Deleted" isDeleted />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <NewTagTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Tags the user has just added and can still take back: click a cross to remove its tag, and the Actions panel shows the identifier \`onDelete\` receives."
      },
      source: {
        code: \`<Tag tag="drafts" label="Drafts" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="review" label="Review" isNewTag onDelete={(tag) => console.log(tag)} />
<Tag tag="archive" label="Archive" isNewTag onDelete={(tag) => console.log(tag)} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <ClickableTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Tags that act as filters: hover one to see it highlight, click it, and the Actions panel shows the \`{ label }\` object \`onClick\` receives instead of the DOM event."
      },
      source: {
        code: \`<Tag tag="design" label="Design" onClick={({ label }) => console.log(label)} />
<Tag tag="development" label="Development" onClick={({ label }) => console.log(label)} />
<Tag tag="marketing" label="Marketing" onClick={({ label }) => console.log(label)} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <MaxWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Tags with different max-width values. Long text is truncated with ellipsis when it exceeds the max width."
      },
      source: {
        code: \`<Tag tag="short" label="Short" tagMaxWidth="80px" />
<Tag tag="long" label="This is a very long tag label..." tagMaxWidth="160px" />
<Tag tag="wide" label="Wide tag with more space" tagMaxWidth="250px" />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Wrapper>
      <Tag tag="url" label="Folder from a URL" icon={CatalogFolderReactSvgUrl} withLabel={false} />
      <Tag tag="component" label="Folder component" icon={CatalogFolderIcon} withLabel={false} />
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: \`A compact tag that is only a glyph marks where an item comes from without taking the width of a label; the hidden label still names the tag for screen readers (\\\`withLabel={false}\\\`):

- **First tag** — the glyph loaded from an SVG file (\\\`icon\\\` as a URL)
- **Second tag** — the same glyph passed as a React component (\\\`icon\\\` as a component)\`
      },
      source: {
        code: \`<Tag tag="url" label="Folder from a URL" icon={folderIconUrl} withLabel={false} />
<Tag tag="component" label="Folder component" icon={FolderIcon} withLabel={false} />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Tag {...args} />,
  args: {
    tag: "reports",
    label: "Reports",
    labelSuffix: " (12)",
    labelSuffixColor: "#A3A9AE"
  },
  parameters: {
    docs: {
      description: {
        story: "A count after the label, in a quieter colour, tells the reader how many items the tag covers without a second element (\`labelSuffix\`, \`labelSuffixColor\`)."
      },
      source: {
        code: \`<Tag tag="reports" label="Reports" labelSuffix=" (12)" labelSuffixColor="#A3A9AE" />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    "--tag-bg": "#EDE7F6",
    "--tag-border-style": "1px solid #9C27B0",
    "--tag-radius": "16px",
    "--tag-inner-padding": "4px 14px",
    "--tag-height": "30px",
    "--tag-spacing-end": "16px"
  } as CSSProperties}>
      <Tag tag="custom" label="Custom Tag" />
      <Tag tag="second" label="Second Tag" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Six variables set on one wrapper -- the variables are listed under CSS variables on this page. Both tags take every variable from the wrapper; the second is there to show the space \\\`--tag-spacing-end\\\` leaves after **Custom Tag**.\`
      },
      source: {
        code: \`<div
  style={{
    display: "flex",
    "--tag-bg": "#EDE7F6",
    "--tag-border-style": "1px solid #9C27B0",
    "--tag-radius": "16px",
    "--tag-inner-padding": "4px 14px",
    "--tag-height": "30px",
    "--tag-spacing-end": "16px",
  }}
>
  <Tag tag="custom" label="Custom Tag" />
  <Tag tag="second" label="Second Tag" />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{v as ClickableTags,S as CssCustomization,d as Default,b as IconOnly,y as MaxWidthVariants,_ as NewTags,g as States,x as WithLabelSuffix,C as __namedExportsOrder,l as default};