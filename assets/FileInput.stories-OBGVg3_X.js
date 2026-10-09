import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n}from"./text-input-D8OFtXHj.js";import{t as r}from"./TextInput.enums-z6wZ2LJ6.js";import{n as i,t as a}from"./FileInput-B9t1Hh0z.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),i(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Form controls/FileInput`,component:a,parameters:{},argTypes:{size:{control:`select`,options:Object.values(r),description:`Height and width of the field, which also pick the icon box and button sizes`,table:{defaultValue:{summary:`base`}}},placeholder:{control:`text`,description:`Text shown in the field until a file is chosen`},buttonLabel:{control:`text`,description:`Renders a button with this label in place of the icon`},isDisabled:{control:`boolean`,description:`Greys the field out and stops a click from opening the file picker`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:`Replaces the icon with a spinner, greys the field and stops a click from opening the file picker; with a button label the button stays and only the click is stopped`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Draws the field and its icon box with an error border`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Draws the field and its icon box with a warning border`,table:{defaultValue:{summary:`false`}}},scale:{control:`boolean`,description:`Stretches the field to the full width of its container`,table:{defaultValue:{summary:`false`}}},isMultiple:{control:`boolean`,description:`Whether several files may be chosen or dropped at once`,table:{defaultValue:{summary:`true`}}},isDocumentIcon:{control:`boolean`,description:`Shows a document icon instead of the folder icon`,table:{defaultValue:{summary:`false`}}},accept:{control:`object`,description:'File extensions or MIME types the picker offers and a drop accepts, such as `[".pdf", "image/*"]`; a file of any other type is refused with an error toast',table:{defaultValue:{summary:`[""]`}}},onInput:{description:"Called with the chosen files: a single `File` when one was chosen, an array when several were"},fromStorage:{control:`boolean`,description:"Stops the field from opening the file picker: it shows `path` instead and passes clicks to `onClick`",table:{defaultValue:{summary:`false`}}},path:{control:`text`,description:"Text shown in the field while `fromStorage` is set"},onClick:{description:"Called when the field or its icon is clicked, only while `fromStorage` is set"},id:{control:`text`,description:`Id of the hidden file input, not of the visible field`},idButton:{control:`text`,description:`Id of the outermost element`},name:{control:!1,description:`Accepted but not used`},className:{control:!1,description:`Class added to the outermost element`},style:{control:!1,description:`Inline style of the outermost element`},"aria-label":{control:`text`,description:`Accessible name of the control, which has none without it`},"aria-description":{control:`text`,description:`Accessible description of the control`},"data-test-id":{control:`text`,description:`Test id of the outermost element`,table:{defaultValue:{summary:`file-input`}}}}},l=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),u={render:e=>(0,o.jsx)(a,{...e}),args:{placeholder:`Choose file`,size:r.base,scale:!1,isDisabled:!1,isLoading:!1,hasError:!1,hasWarning:!1,"aria-label":`Choose file`,onInput:s()},parameters:{docs:{description:{story:`The field as a form shows it before anything is chosen; change any prop live in the Controls panel below.`},source:{code:`<FileInput
  placeholder="Choose file"
  size={InputSize.base}
  aria-label="Choose file"
  onInput={(file) => console.log(file)}
/>`}}}},d=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{size:r.base,placeholder:`Base size`,"aria-label":`Base size file input`}),(0,o.jsx)(a,{size:r.middle,placeholder:`Middle size`,"aria-label":`Middle size file input`}),(0,o.jsx)(a,{size:r.large,placeholder:`Large size`,"aria-label":`Large size file input`})]}),f={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"Pick the size that matches the other fields of the form: each one also sets the field's width and the size of its icon box (`size`)."},source:{code:`<FileInput size={InputSize.base} placeholder="Base size" />
<FileInput size={InputSize.middle} placeholder="Middle size" />
<FileInput size={InputSize.large} placeholder="Large size" />`}}}},p=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{size:r.base,placeholder:`Normal`,"aria-label":`Normal file input`}),(0,o.jsx)(a,{size:r.base,placeholder:`Error state`,hasError:!0,"aria-label":`Error file input`}),(0,o.jsx)(a,{size:r.base,placeholder:`Warning state`,hasWarning:!0,"aria-label":`Warning file input`}),(0,o.jsx)(a,{size:r.base,placeholder:`Disabled`,isDisabled:!0,"aria-label":`Disabled file input`}),(0,o.jsx)(a,{size:r.base,placeholder:`Loading`,isLoading:!0,"aria-label":`Loading file input`})]}),m={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"Use these to tell the user about the chosen file: **Error state** and **Warning state** recolour the border (`hasError`, `hasWarning`), **Disabled** greys the field and ignores clicks (`isDisabled`), and **Loading** shows a spinner in place of the icon (`isLoading`)."},source:{code:`<FileInput placeholder="Normal" />
<FileInput placeholder="Error state" hasError />
<FileInput placeholder="Warning state" hasWarning />
<FileInput placeholder="Disabled" isDisabled />
<FileInput placeholder="Loading" isLoading />`}}}},h=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{size:r.base,placeholder:`Images only`,accept:[`.png`,`.jpg`,`.jpeg`,`.gif`],"aria-label":`Image file input`}),(0,o.jsx)(a,{size:r.base,placeholder:`Documents only`,accept:[`.pdf`,`.docx`,`.xlsx`],"aria-label":`Document file input`})]}),g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"Limit the field to the types the host can handle: the picker offers only these extensions, and a dropped file of another type is refused with an error toast (`accept`)."},source:{code:`<FileInput placeholder="Images only" accept={[".png", ".jpg", ".jpeg", ".gif"]} />
<FileInput placeholder="Documents only" accept={[".pdf", ".docx", ".xlsx"]} />`}}}},_=()=>(0,o.jsx)(`div`,{style:{display:`grid`,gridGap:`16px`},children:(0,o.jsx)(a,{size:r.base,placeholder:`Scaled file input`,scale:!0,"aria-label":`Scaled file input`})}),v={render:()=>(0,o.jsx)(_,{}),parameters:{docs:{description:{story:"Use it when the field should line up with a full-width form column: it stretches to the width of its container (`scale`)."},source:{code:`<FileInput placeholder="Scaled file input" scale />`}}}},y=()=>(0,o.jsxs)(`div`,{style:{display:`grid`,gridGap:`16px`,width:`400px`},children:[(0,o.jsx)(a,{size:r.base,placeholder:`Base size`,buttonLabel:`Browse`,scale:!0,"aria-label":`Base size file input with a button`}),(0,o.jsx)(a,{size:r.middle,placeholder:`Middle size`,buttonLabel:`Browse`,scale:!0,"aria-label":`Middle size file input with a button`}),(0,o.jsx)(a,{size:r.large,placeholder:`Large size`,buttonLabel:`Browse`,scale:!0,"aria-label":`Large size file input with a button`})]}),b={render:()=>(0,o.jsx)(y,{}),parameters:{docs:{description:{story:"Use a labelled button when an icon alone would not tell the user what the field does: the button takes the place of the icon and grows with the field's size (`buttonLabel`). The field is given the full width of its container here (`scale`), because at a fixed size the button is laid out past the field's own width."},source:{code:`<FileInput size={InputSize.base} placeholder="Base size" buttonLabel="Browse" scale />
<FileInput size={InputSize.middle} placeholder="Middle size" buttonLabel="Browse" scale />
<FileInput size={InputSize.large} placeholder="Large size" buttonLabel="Browse" scale />`}}}},x=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{size:r.base,placeholder:`Folder icon`,"aria-label":`File input with a folder icon`}),(0,o.jsx)(a,{size:r.base,placeholder:`Document icon`,isDocumentIcon:!0,"aria-label":`File input with a document icon`})]}),S={render:()=>(0,o.jsx)(x,{}),parameters:{docs:{description:{story:"Use the document icon when the field takes a single document rather than any file: **Folder icon** is the default, **Document icon** the alternative (`isDocumentIcon`)."},source:{code:`<FileInput size={InputSize.base} placeholder="Folder icon" />
<FileInput size={InputSize.base} placeholder="Document icon" isDocumentIcon />`}}}},C={render:e=>(0,o.jsx)(a,{...e}),args:{size:r.middle,placeholder:`Choose a folder`,fromStorage:!0,path:`Documents/Reports`,"aria-label":`Choose a folder`,onClick:s()},parameters:{docs:{description:{story:"Use this when the file comes from somewhere other than the device, such as a folder picker of the host's own: the field shows the path it is given (`fromStorage`, `path`), and a click on it or its icon calls the host instead of opening the file picker (`onClick`) — click it and watch the Actions panel."},source:{code:`<FileInput
  size={InputSize.middle}
  placeholder="Choose a folder"
  fromStorage
  path="Documents/Reports"
  onClick={openFolderDialog}
/>`}}}},w=()=>(0,o.jsxs)(`div`,{style:{display:`grid`,gridGap:`16px`,width:`320px`,"--file-input-border":`#0082c9`,"--file-input-hover-border":`#006ba6`,"--file-input-focus-border":`#004f82`,"--file-input-radius":`8px`,"--file-input-warning-border":`#e67e00`,"--file-input-error-border":`#c0392b`,"--file-input-disabled-border":`#b0cce3`,"--file-input-placeholder-color":`#7aa8c7`,"--text-input-bg":`#f0f8ff`,"--text-input-color":`#004f82`,"--text-input-radius":`8px 0 0 8px`},children:[(0,o.jsx)(a,{placeholder:`Choose file`,size:r.base,scale:!0,"aria-label":`Custom styled file input`}),(0,o.jsx)(a,{placeholder:`Warning state`,size:r.base,scale:!0,hasWarning:!0,"aria-label":`Warning file input`}),(0,o.jsx)(a,{placeholder:`Error state`,size:r.base,scale:!0,hasError:!0,"aria-label":`Error file input`}),(0,o.jsx)(a,{placeholder:`Disabled`,size:r.base,scale:!0,isDisabled:!0,"aria-label":`Disabled file input`})]}),T={render:()=>(0,o.jsx)(w,{}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.\n\n- **Choose file** — the border, background, text and radius variables; hover it for `--file-input-hover-border` and press it for `--file-input-focus-border`\n- **Warning state** — `--file-input-warning-border` (`hasWarning`)\n- **Error state** — `--file-input-error-border` (`hasError`)\n- **Disabled** — `--file-input-disabled-border` and `--file-input-placeholder-color` (`isDisabled`)"},source:{code:`<div
  style={{
    "--file-input-border": "#0082c9",
    "--file-input-hover-border": "#006ba6",
    "--file-input-focus-border": "#004f82",
    "--file-input-radius": "8px",
    "--file-input-warning-border": "#e67e00",
    "--file-input-error-border": "#c0392b",
    "--file-input-disabled-border": "#b0cce3",
    "--file-input-placeholder-color": "#7aa8c7",
    "--text-input-bg": "#f0f8ff",
    "--text-input-color": "#004f82",
    "--text-input-radius": "8px 0 0 8px",
  }}
>
  <FileInput placeholder="Choose file" size={InputSize.base} scale />
  <FileInput placeholder="Warning state" size={InputSize.base} scale hasWarning />
  <FileInput placeholder="Error state" size={InputSize.base} scale hasError />
  <FileInput placeholder="Disabled" size={InputSize.base} scale isDisabled />
</div>`}}}},E=[`Default`,`Sizes`,`States`,`WithAcceptFilter`,`ScaledInput`,`WithButton`,`DocumentIcon`,`WithPath`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <FileInput {...args} />,
  args: {
    placeholder: "Choose file",
    size: InputSize.base,
    scale: false,
    isDisabled: false,
    isLoading: false,
    hasError: false,
    hasWarning: false,
    "aria-label": "Choose file",
    onInput: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The field as a form shows it before anything is chosen; change any prop live in the Controls panel below."
      },
      source: {
        code: \`<FileInput
  placeholder="Choose file"
  size={InputSize.base}
  aria-label="Choose file"
  onInput={(file) => console.log(file)}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the size that matches the other fields of the form: each one also sets the field's width and the size of its icon box (\`size\`)."
      },
      source: {
        code: \`<FileInput size={InputSize.base} placeholder="Base size" />
<FileInput size={InputSize.middle} placeholder="Middle size" />
<FileInput size={InputSize.large} placeholder="Large size" />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use these to tell the user about the chosen file: **Error state** and **Warning state** recolour the border (\`hasError\`, \`hasWarning\`), **Disabled** greys the field and ignores clicks (\`isDisabled\`), and **Loading** shows a spinner in place of the icon (\`isLoading\`)."
      },
      source: {
        code: \`<FileInput placeholder="Normal" />
<FileInput placeholder="Error state" hasError />
<FileInput placeholder="Warning state" hasWarning />
<FileInput placeholder="Disabled" isDisabled />
<FileInput placeholder="Loading" isLoading />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <WithAcceptFilterTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Limit the field to the types the host can handle: the picker offers only these extensions, and a dropped file of another type is refused with an error toast (\`accept\`)."
      },
      source: {
        code: \`<FileInput placeholder="Images only" accept={[".png", ".jpg", ".jpeg", ".gif"]} />
<FileInput placeholder="Documents only" accept={[".pdf", ".docx", ".xlsx"]} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it when the field should line up with a full-width form column: it stretches to the width of its container (\`scale\`)."
      },
      source: {
        code: \`<FileInput placeholder="Scaled file input" scale />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <WithButtonTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use a labelled button when an icon alone would not tell the user what the field does: the button takes the place of the icon and grows with the field's size (\`buttonLabel\`). The field is given the full width of its container here (\`scale\`), because at a fixed size the button is laid out past the field's own width."
      },
      source: {
        code: \`<FileInput size={InputSize.base} placeholder="Base size" buttonLabel="Browse" scale />
<FileInput size={InputSize.middle} placeholder="Middle size" buttonLabel="Browse" scale />
<FileInput size={InputSize.large} placeholder="Large size" buttonLabel="Browse" scale />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <DocumentIconTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use the document icon when the field takes a single document rather than any file: **Folder icon** is the default, **Document icon** the alternative (\`isDocumentIcon\`)."
      },
      source: {
        code: \`<FileInput size={InputSize.base} placeholder="Folder icon" />
<FileInput size={InputSize.base} placeholder="Document icon" isDocumentIcon />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <FileInput {...args} />,
  args: {
    size: InputSize.middle,
    placeholder: "Choose a folder",
    fromStorage: true,
    path: "Documents/Reports",
    "aria-label": "Choose a folder",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Use this when the file comes from somewhere other than the device, such as a folder picker of the host's own: the field shows the path it is given (\`fromStorage\`, \`path\`), and a click on it or its icon calls the host instead of opening the file picker (\`onClick\`) — click it and watch the Actions panel."
      },
      source: {
        code: \`<FileInput
  size={InputSize.middle}
  placeholder="Choose a folder"
  fromStorage
  path="Documents/Reports"
  onClick={openFolderDialog}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Choose file** — the border, background, text and radius variables; hover it for \\\`--file-input-hover-border\\\` and press it for \\\`--file-input-focus-border\\\`
- **Warning state** — \\\`--file-input-warning-border\\\` (\\\`hasWarning\\\`)
- **Error state** — \\\`--file-input-error-border\\\` (\\\`hasError\\\`)
- **Disabled** — \\\`--file-input-disabled-border\\\` and \\\`--file-input-placeholder-color\\\` (\\\`isDisabled\\\`)\`
      },
      source: {
        code: \`<div
  style={{
    "--file-input-border": "#0082c9",
    "--file-input-hover-border": "#006ba6",
    "--file-input-focus-border": "#004f82",
    "--file-input-radius": "8px",
    "--file-input-warning-border": "#e67e00",
    "--file-input-error-border": "#c0392b",
    "--file-input-disabled-border": "#b0cce3",
    "--file-input-placeholder-color": "#7aa8c7",
    "--text-input-bg": "#f0f8ff",
    "--text-input-color": "#004f82",
    "--text-input-radius": "8px 0 0 8px",
  }}
>
  <FileInput placeholder="Choose file" size={InputSize.base} scale />
  <FileInput placeholder="Warning state" size={InputSize.base} scale hasWarning />
  <FileInput placeholder="Error state" size={InputSize.base} scale hasError />
  <FileInput placeholder="Disabled" size={InputSize.base} scale isDisabled />
</div>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}}})))()}D();export{T as CssCustomization,u as Default,S as DocumentIcon,v as ScaledInput,f as Sizes,m as States,g as WithAcceptFilter,b as WithButton,C as WithPath,E as __namedExportsOrder,c as default};