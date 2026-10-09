import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{r,t as i}from"./text-Cz_cI6Yf.js";import{n as a,t as o}from"./cross.react-BpjVHsQC.js";import{n as s,t as c}from"./empty-view-ILtf1991.js";import{n as l,t as u}from"./catalog.folder.react-BLNaFnHq.js";import{n as d,t as f}from"./empty.rooms.root.light-B0T7L2ed.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{t(),d(),a(),l(),r(),s(),p=n(),m=e=>{if(typeof e==`string`)return e;let{pathname:t=``,search:n=``,hash:r=``}=e;return`${t}${n}${r}`},h=({children:e,to:t,...n})=>(0,p.jsx)(`a`,{href:m(t),...n,children:e}),g={title:`UI/Layout components/EmptyView`,component:c,parameters:{},argTypes:{title:{control:`text`,description:`Main title text displayed below the icon`},description:{control:`text`,description:`Text or content shown in smaller grey type under the title`},icon:{description:`Illustration shown at the top, above the title, rendered as given`,control:!1},options:{description:"What the user can do next, in the order given: an option with `to` is a link, `type` picks a button, separator or text action, and anything else is a suggestion card. `null` shows the header alone",control:!1},LinkRouter:{description:"Link component of the application's router, used to render link options. Without it a link option ignores its `to` and only runs its `onClick`",control:!1},extraContent:{description:`Custom content shown between the description and the options`,control:!1},className:{control:`text`,description:`CSS class added to the outer block`},bodyClassName:{control:`text`,description:`CSS class added to the block that holds the options`}}},_=({...e})=>(0,p.jsx)(c,{...e,LinkRouter:h}),v={render:_,args:{icon:(0,p.jsx)(f,{}),title:`Empty Folder`,description:`This folder is empty. Add files or folders to get started.`,options:[{key:`clear-filter`,icon:(0,p.jsx)(o,{}),to:`#`,description:`Clear Filter`}]},parameters:{docs:{description:{story:`The common case: an illustration, a title and a description, with one link that takes the user somewhere they can act. Change the texts live in the Controls panel below.`},source:{code:`<EmptyView
  icon={<EmptyRoomsIcon />}
  title="Empty Folder"
  description="This folder is empty. Add files or folders to get started."
  options={[
    { key: "clear-filter", icon: <CrossIcon />, to: "/files", description: "Clear Filter" },
  ]}
  LinkRouter={RouterLink}
/>`}}}},y={render:_,args:{icon:(0,p.jsx)(f,{}),title:`No Files Found`,description:`There are no files matching your search criteria.`,options:null},parameters:{docs:{description:{story:"For an empty state the user cannot act on, such as a search with no results: only the illustration, the title and the description (`options={null}`)."},source:{code:`<EmptyView
  icon={<SearchIcon />}
  title="No Files Found"
  description="There are no files matching your search criteria."
  options={null}
/>`}}}},b={render:_,args:{icon:(0,p.jsx)(f,{}),title:`Get Started`,description:`Choose an action to begin working with your workspace.`,options:[{key:`create`,icon:(0,p.jsx)(o,{}),to:`/create`,description:`Create a new document`},{key:`upload`,icon:(0,p.jsx)(o,{}),to:`/upload`,description:`Upload files from your computer`},{key:`import`,icon:(0,p.jsx)(o,{}),to:`/import`,description:`Import from external storage`}]},parameters:{docs:{description:{story:`When several next steps are equally likely, offer each as a link; they stack under the description in the order given.`},source:{code:`<EmptyView
  icon={<EmptyIcon />}
  title="Get Started"
  description="Choose an action to begin working with your workspace."
  options={[
    { key: "create", icon: <CreateIcon />, to: "/create", description: "Create a new document" },
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Upload files" },
    { key: "import", icon: <ImportIcon />, to: "/import", description: "Import from external storage" },
  ]}
  LinkRouter={RouterLink}
/>`}}}},x=[{key:`create`,icon:(0,p.jsx)(u,{}),title:`Create a folder`,description:`Keep related files together in one place.`},{key:`upload`,icon:(0,p.jsx)(u,{}),title:`Upload files`,description:`Click to choose where the files come from.`,model:[{key:`device`,label:`From this device`},{key:`storage`,label:`From a connected storage`}]},{key:`templates`,icon:(0,p.jsx)(u,{}),title:`Browse templates`,description:`This card is disabled, so it is not shown.`,disabled:!0}],S={render:_,args:{icon:(0,p.jsx)(f,{}),title:`Nothing here yet`,description:`Pick one of the suggestions below to get started.`,options:x},parameters:{docs:{description:{story:"Cards give each next step a title and a line of explanation, for when a link alone would not say enough:\n\n- **Create a folder** — a plain card; clicking it runs its `onClick`\n- **Upload files** — click it to open a menu of choices instead (`model`)\n- A third card, **Browse templates**, is `disabled` and therefore not rendered at all"},source:{code:`<EmptyView
  icon={<EmptyIcon />}
  title="Nothing here yet"
  description="Pick one of the suggestions below to get started."
  options={[
    { key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place.", onClick: handleCreate },
    {
      key: "upload",
      icon: <FolderIcon />,
      title: "Upload files",
      description: "Click to choose where the files come from.",
      model: [
        { key: "device", label: "From this device", onClick: handleDevice },
        { key: "storage", label: "From a connected storage", onClick: handleStorage },
      ],
    },
    { key: "templates", icon: <FolderIcon />, title: "Browse templates", description: "...", disabled: true },
  ]}
/>`}}}},C={render:_,args:{icon:(0,p.jsx)(f,{}),title:`No documents`,description:`Create the first document or bring one in.`,options:[{key:`create`,type:`button`,title:`Create document`},{key:`import`,type:`button`,title:`Import`,primary:!1},{key:`sync`,type:`button`,title:`Sync`,primary:!1,isLoading:!0}]},parameters:{docs:{description:{story:`Buttons suit a step that starts work right here rather than going somewhere; they line up in a row and wrap when there is no room:

- **Create document** — primary, which is what a button option is unless told otherwise
- **Import** — secondary (\`primary: false\`)
- **Sync** — secondary, with a loader while its work runs (\`isLoading\`)`},source:{code:`<EmptyView
  icon={<EmptyIcon />}
  title="No documents"
  description="Create the first document or bring one in."
  options={[
    { key: "create", type: "button", title: "Create document", onClick: handleCreate },
    { key: "import", type: "button", title: "Import", primary: false, onClick: handleImport },
    { key: "sync", type: "button", title: "Sync", primary: false, isLoading: true },
  ]}
/>`}}}},w={render:_,args:{icon:(0,p.jsx)(f,{}),title:`This folder is empty`,description:`Add the first file to it.`,options:[{key:`upload`,type:`action`,icon:(0,p.jsx)(u,{}),title:`Upload a file`},{key:`or`,type:`separator`,text:`or`},{key:`create`,type:`action`,icon:(0,p.jsx)(u,{}),title:`Create a document`,className:`secondary`}]},parameters:{docs:{description:{story:'Text actions are the lightest option, for two alternatives joined by a word:\n\n- **Upload a file** — an accented icon-and-text action (`type: "action"`)\n- **or** — a separator line of text between the two (`type: "separator"`)\n- **Create a document** — the same action in grey, for the less likely choice (`className: "secondary"`)'},source:{code:`<EmptyView
  icon={<EmptyIcon />}
  title="This folder is empty"
  description="Add the first file to it."
  options={[
    { key: "upload", type: "action", icon: <FolderIcon />, title: "Upload a file", onClick: handleUpload },
    { key: "or", type: "separator", text: "or" },
    { key: "create", type: "action", icon: <FolderIcon />, title: "Create a document", className: "secondary", onClick: handleCreate },
  ]}
/>`}}}},T={render:_,args:{icon:(0,p.jsx)(f,{}),title:`No shared files`,description:`Files other people share with you appear here.`,extraContent:(0,p.jsx)(i,{fontSize:`12px`,fontWeight:`600`,children:`Ask a teammate to share a file with you.`}),options:[{key:`refresh`,icon:(0,p.jsx)(o,{}),to:`#`,description:`Clear Filter`}]},parameters:{docs:{description:{story:"When the empty state needs something the option types do not cover — a hint, a form, a picture — it goes between the description and the options (`extraContent`)."},source:{code:`<EmptyView
  icon={<EmptyIcon />}
  title="No shared files"
  description="Files other people share with you appear here."
  extraContent={<Text fontSize="12px" fontWeight="600">Ask a teammate to share a file with you.</Text>}
  options={[{ key: "refresh", icon: <CrossIcon />, to: "/files", description: "Clear Filter" }]}
  LinkRouter={RouterLink}
/>`}}}},E={render:e=>(0,p.jsx)(`div`,{dir:`rtl`,children:(0,p.jsx)(_,{...e})}),globals:{direction:`rtl`},args:{icon:(0,p.jsx)(f,{}),title:`This folder is empty`,description:`Add the first file to it`,options:[{key:`create`,icon:(0,p.jsx)(u,{}),title:`Create a folder`,description:`Keep related files together in one place`}]},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`375px`},description:{story:'The same empty state under a right-to-left interface: in the suggestion card the icon moves to the right edge, the text aligns right, and the arrow moves to the left edge and points left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <EmptyView
    icon={<EmptyIcon />}
    title="This folder is empty"
    description="Add the first file to it"
    options={[{ key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place" }]}
  />
</div>`}}}},D={render:()=>(0,p.jsx)(`div`,{style:{"--empty-view-title-color":`#0082c9`,"--empty-view-header-font-size":`18px`,"--empty-view-desc-color":`#5b6b7a`,"--empty-view-link-accent":`#0082c9`,"--empty-view-link-background":`#e6f3fb`,"--empty-view-link-hover-background":`#cce5f6`,"--empty-view-link-radius":`50px`,"--empty-view-link-padding":`8px 16px`,"--empty-view-link-text-size":`14px`,"--empty-view-link-text-weight":`700`,"--empty-view-item-radius":`12px`,"--empty-view-item-padding":`16px 20px`,"--empty-view-item-gap":`16px`,"--empty-view-icon-size":`24px`,"--empty-view-item-hover-background":`#e6f3fb`,"--empty-view-item-title-color":`#004f82`,"--empty-view-item-desc-color":`#7a8a99`,"--empty-view-divider-color":`#0082c9`,"--empty-view-width":`400px`,"--empty-view-gap":`12px`,"--empty-view-padding-top":`24px`},children:(0,p.jsx)(c,{icon:(0,p.jsx)(f,{}),title:`No Files Found`,description:`Upload or create files to get started.`,options:[{key:`upload`,icon:(0,p.jsx)(o,{}),to:`#`,description:`Upload files`},{key:`create`,icon:(0,p.jsx)(o,{}),to:`#`,description:`Create new document`},{key:`or`,type:`separator`,text:`or`},{key:`folder`,icon:(0,p.jsx)(u,{}),title:`Create a folder`,description:`Keep related files together in one place.`}],LinkRouter:h})}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The instance holds two links, a separator and a suggestion card. Hover a link and the card to see the hover backgrounds.`},source:{code:`<div
  style={{
    "--empty-view-title-color": "#0082c9",
    "--empty-view-link-background": "#e6f3fb",
    "--empty-view-link-radius": "50px",
    "--empty-view-item-radius": "12px",
    "--empty-view-divider-color": "#0082c9",
    "--empty-view-width": "400px",
  }}
>
  <EmptyView icon={<EmptyIcon />} title="No Files Found" description="..." options={options} LinkRouter={RouterLink} />
</div>`}}}},O=[`Default`,`NoOptions`,`WithMultipleOptions`,`SuggestionCards`,`WithButtons`,`TextActionsWithSeparator`,`WithExtraContent`,`RightToLeft`,`CssCustomization`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Empty Folder",
    description: "This folder is empty. Add files or folders to get started.",
    options: [{
      key: "clear-filter",
      icon: <CrossSvg />,
      to: "#",
      description: "Clear Filter"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "The common case: an illustration, a title and a description, with one link that takes the user somewhere they can act. Change the texts live in the Controls panel below."
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyRoomsIcon />}
  title="Empty Folder"
  description="This folder is empty. Add files or folders to get started."
  options={[
    { key: "clear-filter", icon: <CrossIcon />, to: "/files", description: "Clear Filter" },
  ]}
  LinkRouter={RouterLink}
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No Files Found",
    description: "There are no files matching your search criteria.",
    options: null
  },
  parameters: {
    docs: {
      description: {
        story: "For an empty state the user cannot act on, such as a search with no results: only the illustration, the title and the description (\`options={null}\`)."
      },
      source: {
        code: \`<EmptyView
  icon={<SearchIcon />}
  title="No Files Found"
  description="There are no files matching your search criteria."
  options={null}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Get Started",
    description: "Choose an action to begin working with your workspace.",
    options: [{
      key: "create",
      icon: <CrossSvg />,
      to: "/create",
      description: "Create a new document"
    }, {
      key: "upload",
      icon: <CrossSvg />,
      to: "/upload",
      description: "Upload files from your computer"
    }, {
      key: "import",
      icon: <CrossSvg />,
      to: "/import",
      description: "Import from external storage"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "When several next steps are equally likely, offer each as a link; they stack under the description in the order given."
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyIcon />}
  title="Get Started"
  description="Choose an action to begin working with your workspace."
  options={[
    { key: "create", icon: <CreateIcon />, to: "/create", description: "Create a new document" },
    { key: "upload", icon: <UploadIcon />, to: "/upload", description: "Upload files" },
    { key: "import", icon: <ImportIcon />, to: "/import", description: "Import from external storage" },
  ]}
  LinkRouter={RouterLink}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "Nothing here yet",
    description: "Pick one of the suggestions below to get started.",
    options: cardOptions
  },
  parameters: {
    docs: {
      description: {
        story: \`Cards give each next step a title and a line of explanation, for when a link alone would not say enough:

- **Create a folder** — a plain card; clicking it runs its \\\`onClick\\\`
- **Upload files** — click it to open a menu of choices instead (\\\`model\\\`)
- A third card, **Browse templates**, is \\\`disabled\\\` and therefore not rendered at all\`
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyIcon />}
  title="Nothing here yet"
  description="Pick one of the suggestions below to get started."
  options={[
    { key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place.", onClick: handleCreate },
    {
      key: "upload",
      icon: <FolderIcon />,
      title: "Upload files",
      description: "Click to choose where the files come from.",
      model: [
        { key: "device", label: "From this device", onClick: handleDevice },
        { key: "storage", label: "From a connected storage", onClick: handleStorage },
      ],
    },
    { key: "templates", icon: <FolderIcon />, title: "Browse templates", description: "...", disabled: true },
  ]}
/>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No documents",
    description: "Create the first document or bring one in.",
    options: [{
      key: "create",
      type: "button",
      title: "Create document"
    }, {
      key: "import",
      type: "button",
      title: "Import",
      primary: false
    }, {
      key: "sync",
      type: "button",
      title: "Sync",
      primary: false,
      isLoading: true
    }]
  },
  parameters: {
    docs: {
      description: {
        story: \`Buttons suit a step that starts work right here rather than going somewhere; they line up in a row and wrap when there is no room:

- **Create document** — primary, which is what a button option is unless told otherwise
- **Import** — secondary (\\\`primary: false\\\`)
- **Sync** — secondary, with a loader while its work runs (\\\`isLoading\\\`)\`
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyIcon />}
  title="No documents"
  description="Create the first document or bring one in."
  options={[
    { key: "create", type: "button", title: "Create document", onClick: handleCreate },
    { key: "import", type: "button", title: "Import", primary: false, onClick: handleImport },
    { key: "sync", type: "button", title: "Sync", primary: false, isLoading: true },
  ]}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "This folder is empty",
    description: "Add the first file to it.",
    options: [{
      key: "upload",
      type: "action",
      icon: <FolderSvg />,
      title: "Upload a file"
    }, {
      key: "or",
      type: "separator",
      text: "or"
    }, {
      key: "create",
      type: "action",
      icon: <FolderSvg />,
      title: "Create a document",
      className: "secondary"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: \`Text actions are the lightest option, for two alternatives joined by a word:

- **Upload a file** — an accented icon-and-text action (\\\`type: "action"\\\`)
- **or** — a separator line of text between the two (\\\`type: "separator"\\\`)
- **Create a document** — the same action in grey, for the less likely choice (\\\`className: "secondary"\\\`)\`
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyIcon />}
  title="This folder is empty"
  description="Add the first file to it."
  options={[
    { key: "upload", type: "action", icon: <FolderIcon />, title: "Upload a file", onClick: handleUpload },
    { key: "or", type: "separator", text: "or" },
    { key: "create", type: "action", icon: <FolderIcon />, title: "Create a document", className: "secondary", onClick: handleCreate },
  ]}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "No shared files",
    description: "Files other people share with you appear here.",
    extraContent: <Text fontSize="12px" fontWeight="600">
        Ask a teammate to share a file with you.
      </Text>,
    options: [{
      key: "refresh",
      icon: <CrossSvg />,
      to: "#",
      description: "Clear Filter"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "When the empty state needs something the option types do not cover — a hint, a form, a picture — it goes between the description and the options (\`extraContent\`)."
      },
      source: {
        code: \`<EmptyView
  icon={<EmptyIcon />}
  title="No shared files"
  description="Files other people share with you appear here."
  extraContent={<Text fontSize="12px" fontWeight="600">Ask a teammate to share a file with you.</Text>}
  options={[{ key: "refresh", icon: <CrossIcon />, to: "/files", description: "Clear Filter" }]}
  LinkRouter={RouterLink}
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Template {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    icon: <EmptyRoomsLightSvg />,
    title: "This folder is empty",
    description: "Add the first file to it",
    options: [{
      key: "create",
      icon: <FolderSvg />,
      title: "Create a folder",
      description: "Keep related files together in one place"
    }]
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, so its direction does not flip the whole Docs page.
      story: {
        inline: false,
        height: "375px"
      },
      description: {
        story: 'The same empty state under a right-to-left interface: in the suggestion card the icon moves to the right edge, the text aligns right, and the arrow moves to the left edge and points left. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <EmptyView
    icon={<EmptyIcon />}
    title="This folder is empty"
    description="Add the first file to it"
    options={[{ key: "create", icon: <FolderIcon />, title: "Create a folder", description: "Keep related files together in one place" }]}
  />
</div>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--empty-view-title-color": "#0082c9",
    "--empty-view-header-font-size": "18px",
    "--empty-view-desc-color": "#5b6b7a",
    "--empty-view-link-accent": "#0082c9",
    "--empty-view-link-background": "#e6f3fb",
    "--empty-view-link-hover-background": "#cce5f6",
    "--empty-view-link-radius": "50px",
    "--empty-view-link-padding": "8px 16px",
    "--empty-view-link-text-size": "14px",
    "--empty-view-link-text-weight": "700",
    "--empty-view-item-radius": "12px",
    "--empty-view-item-padding": "16px 20px",
    "--empty-view-item-gap": "16px",
    "--empty-view-icon-size": "24px",
    "--empty-view-item-hover-background": "#e6f3fb",
    "--empty-view-item-title-color": "#004f82",
    "--empty-view-item-desc-color": "#7a8a99",
    "--empty-view-divider-color": "#0082c9",
    "--empty-view-width": "400px",
    "--empty-view-gap": "12px",
    "--empty-view-padding-top": "24px"
  } as CSSProperties}>
      <EmptyView icon={<EmptyRoomsLightSvg />} title="No Files Found" description="Upload or create files to get started." options={[{
      key: "upload",
      icon: <CrossSvg />,
      to: "#",
      description: "Upload files"
    }, {
      key: "create",
      icon: <CrossSvg />,
      to: "#",
      description: "Create new document"
    }, {
      key: "or",
      type: "separator",
      text: "or"
    }, {
      key: "folder",
      icon: <FolderSvg />,
      title: "Create a folder",
      description: "Keep related files together in one place."
    }]} LinkRouter={MockLinkRouter} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The instance holds two links, a separator and a suggestion card. Hover a link and the card to see the hover backgrounds.\`
      },
      source: {
        code: \`<div
  style={{
    "--empty-view-title-color": "#0082c9",
    "--empty-view-link-background": "#e6f3fb",
    "--empty-view-link-radius": "50px",
    "--empty-view-item-radius": "12px",
    "--empty-view-divider-color": "#0082c9",
    "--empty-view-width": "400px",
  }}
>
  <EmptyView icon={<EmptyIcon />} title="No Files Found" description="..." options={options} LinkRouter={RouterLink} />
</div>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}}})))()}k();export{D as CssCustomization,v as Default,y as NoOptions,E as RightToLeft,S as SuggestionCards,w as TextActionsWithSeparator,C as WithButtons,T as WithExtraContent,b as WithMultipleOptions,O as __namedExportsOrder,g as default};