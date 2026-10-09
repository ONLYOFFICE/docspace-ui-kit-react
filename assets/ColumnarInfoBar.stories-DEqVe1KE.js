import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./ColumnarInfoBar-Do6Wvgfc.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={title:`UI/Feedback/ColumnarInfoBar`,component:r,parameters:{},argTypes:{headerText:{control:`text`,description:"Bold heading above the columns, rendered as an `<h3>`; nothing is rendered in its place when it is empty"},columns:{control:`object`,description:`The label and value pairs, in order; each label is a small caption above its value, and both accept any node, so an icon or a link fits too`},onAction:{description:`Called when the close button is clicked. The button is rendered only while this is set, and the bar stays on screen until the host removes it`},onLoad:{description:`Called once after the bar mounts; a different function passed on a later render is never called`},style:{control:`object`,description:"Inline style of the bar; there is no `className` prop, so colour overrides go here too"},variant:{control:`select`,options:[`default`,`neutral`,`page`],description:"Which look to render: the warning bar with an orange edge, the bordered `neutral` card that slides open, or the padded `page` block with a two-column grid",table:{defaultValue:{summary:`default`}}},closeLabel:{control:`text`,description:"Name screen readers announce for the close button; ignored when `onAction` is not set",table:{defaultValue:{summary:`Close`}}}}},s={args:{headerText:`Document details`,columns:[{label:`Owner`,value:`Team member`},{label:`Size`,value:`2.4 MB`},{label:`Modified`,value:`May 26, 2026`},{label:`Format`,value:`DOCX`}],variant:`default`,onLoad:a()},parameters:{docs:{description:{story:`The warning bar with a heading and four columns and no close button: the starting point for a details strip. Change any prop live in the Controls panel below.`},source:{code:`<ColumnarInfoBar
  headerText="Document details"
  columns={[
    { label: "Owner", value: "Team member" },
    { label: "Size", value: "2.4 MB" },
    { label: "Modified", value: "May 26, 2026" },
    { label: "Format", value: "DOCX" },
  ]}
/>`}}}},c={name:`With Close Button`,args:{headerText:`New account details`,columns:[{label:`Workspace address`,value:`workspace.example.com`},{label:`Name`,value:`Team member`},{label:`Email`,value:`member@example.com`},{label:`Password`,value:`••••••••`}],onAction:a(),onLoad:a()},parameters:{docs:{description:{story:"A close button in the top trailing corner lets the reader dismiss details they have read once (`onAction`); clicking it only calls the handler, so the host takes the bar out of the tree. Its spoken name comes from `closeLabel`."},source:{code:`<ColumnarInfoBar
  headerText="New account details"
  columns={[
    { label: "Workspace address", value: "workspace.example.com" },
    { label: "Name", value: "Team member" },
    { label: "Email", value: "member@example.com" },
    { label: "Password", value: "••••••••" },
  ]}
  onAction={() => setVisible(false)}
/>`}}}},l={name:`Columns Only`,args:{columns:[{label:`Status`,value:`200 OK`},{label:`Event ID`,value:`evt_01hx9z3k2m`},{label:`Event Type`,value:`file.created`},{label:`Event Time`,value:`May 26, 2026, 14:32`},{label:`Delivery Time`,value:`May 26, 2026, 14:32:01`}],onLoad:a()},parameters:{docs:{description:{story:"Without `headerText` and `onAction` the bar is a plain strip of columns that stays on screen, for metadata the surrounding page already names. Narrow the window to see the columns wrap."},source:{code:`<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event ID", value: "evt_01hx9z3k2m" },
    { label: "Event Type", value: "file.created" },
    { label: "Event Time", value: "May 26, 2026, 14:32" },
    { label: "Delivery Time", value: "May 26, 2026, 14:32:01" },
  ]}
/>`}}}},u={args:{variant:`neutral`,headerText:`Before you start`,columns:[{label:`Storage`,value:`10 GB`},{label:`Members`,value:`25`},{label:`Retention`,value:`30 days`}],onAction:a(),onLoad:a()},parameters:{docs:{description:{story:'A rounded card with a light blue border and a blue heading, for information that is not a warning (`variant="neutral"`); it slides open when it mounts.'},source:{code:`<ColumnarInfoBar
  variant="neutral"
  headerText="Before you start"
  columns={[
    { label: "Storage", value: "10 GB" },
    { label: "Members", value: "25" },
    { label: "Retention", value: "30 days" },
  ]}
  onAction={handleClose}
/>`}}}},d={args:{variant:`page`,headerText:`Connection details`,columns:[{label:`Server`,value:`server.example.com`},{label:`Port`,value:`443`},{label:`Protocol`,value:`HTTPS`},{label:`Status`,value:`Connected`}],onAction:a(),onLoad:a()},parameters:{docs:{description:{story:'A padded block with the close button beside the heading and the columns in a two-column grid, for a details section inside a page rather than a notice above it (`variant="page"`).'},source:{code:`<ColumnarInfoBar
  variant="page"
  headerText="Connection details"
  columns={[
    { label: "Server", value: "server.example.com" },
    { label: "Port", value: "443" },
    { label: "Protocol", value: "HTTPS" },
    { label: "Status", value: "Connected" },
  ]}
  onAction={handleClose}
/>`}}}},f={render:()=>(0,i.jsx)(r,{headerText:`Custom colours`,columns:[{label:`Owner`,value:`Team member`},{label:`Version`,value:`2.6.0`},{label:`Region`,value:`EU West`}],onAction:()=>{},style:{"--cib-bg":`#1e1b4b`,"--cib-color":`#e0e7ff`,"--cib-accent":`#6366f1`,"--cib-header-color":`#a5b4fc`}}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. All four are set here through the bar's `style` prop, because a wrapper cannot reach them."},source:{code:`<ColumnarInfoBar
  headerText="Custom colours"
  columns={columns}
  onAction={handleClose}
  style={{
    "--cib-bg": "#1e1b4b",
    "--cib-color": "#e0e7ff",
    "--cib-accent": "#6366f1",
    "--cib-header-color": "#a5b4fc",
  }}
/>`}}}},p=[`Default`,`ProfileDetails`,`EventDetails`,`NeutralVariant`,`PageVariant`,`CssCustomization`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    headerText: "Document details",
    columns: [{
      label: "Owner",
      value: "Team member"
    }, {
      label: "Size",
      value: "2.4 MB"
    }, {
      label: "Modified",
      value: "May 26, 2026"
    }, {
      label: "Format",
      value: "DOCX"
    }],
    variant: "default",
    onLoad: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The warning bar with a heading and four columns and no close button: the starting point for a details strip. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<ColumnarInfoBar
  headerText="Document details"
  columns={[
    { label: "Owner", value: "Team member" },
    { label: "Size", value: "2.4 MB" },
    { label: "Modified", value: "May 26, 2026" },
    { label: "Format", value: "DOCX" },
  ]}
/>\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "With Close Button",
  args: {
    headerText: "New account details",
    columns: [{
      label: "Workspace address",
      value: "workspace.example.com"
    }, {
      label: "Name",
      value: "Team member"
    }, {
      label: "Email",
      value: "member@example.com"
    }, {
      label: "Password",
      value: "••••••••"
    }],
    onAction: fn(),
    onLoad: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A close button in the top trailing corner lets the reader dismiss details they have read once (\`onAction\`); clicking it only calls the handler, so the host takes the bar out of the tree. Its spoken name comes from \`closeLabel\`."
      },
      source: {
        code: \`<ColumnarInfoBar
  headerText="New account details"
  columns={[
    { label: "Workspace address", value: "workspace.example.com" },
    { label: "Name", value: "Team member" },
    { label: "Email", value: "member@example.com" },
    { label: "Password", value: "••••••••" },
  ]}
  onAction={() => setVisible(false)}
/>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Columns Only",
  args: {
    columns: [{
      label: "Status",
      value: "200 OK"
    }, {
      label: "Event ID",
      value: "evt_01hx9z3k2m"
    }, {
      label: "Event Type",
      value: "file.created"
    }, {
      label: "Event Time",
      value: "May 26, 2026, 14:32"
    }, {
      label: "Delivery Time",
      value: "May 26, 2026, 14:32:01"
    }],
    onLoad: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Without \`headerText\` and \`onAction\` the bar is a plain strip of columns that stays on screen, for metadata the surrounding page already names. Narrow the window to see the columns wrap."
      },
      source: {
        code: \`<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event ID", value: "evt_01hx9z3k2m" },
    { label: "Event Type", value: "file.created" },
    { label: "Event Time", value: "May 26, 2026, 14:32" },
    { label: "Delivery Time", value: "May 26, 2026, 14:32:01" },
  ]}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "neutral",
    headerText: "Before you start",
    columns: [{
      label: "Storage",
      value: "10 GB"
    }, {
      label: "Members",
      value: "25"
    }, {
      label: "Retention",
      value: "30 days"
    }],
    onAction: fn(),
    onLoad: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A rounded card with a light blue border and a blue heading, for information that is not a warning (\`variant="neutral"\`); it slides open when it mounts.'
      },
      source: {
        code: \`<ColumnarInfoBar
  variant="neutral"
  headerText="Before you start"
  columns={[
    { label: "Storage", value: "10 GB" },
    { label: "Members", value: "25" },
    { label: "Retention", value: "30 days" },
  ]}
  onAction={handleClose}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "page",
    headerText: "Connection details",
    columns: [{
      label: "Server",
      value: "server.example.com"
    }, {
      label: "Port",
      value: "443"
    }, {
      label: "Protocol",
      value: "HTTPS"
    }, {
      label: "Status",
      value: "Connected"
    }],
    onAction: fn(),
    onLoad: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A padded block with the close button beside the heading and the columns in a two-column grid, for a details section inside a page rather than a notice above it (\`variant="page"\`).'
      },
      source: {
        code: \`<ColumnarInfoBar
  variant="page"
  headerText="Connection details"
  columns={[
    { label: "Server", value: "server.example.com" },
    { label: "Port", value: "443" },
    { label: "Protocol", value: "HTTPS" },
    { label: "Status", value: "Connected" },
  ]}
  onAction={handleClose}
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <ColumnarInfoBar headerText="Custom colours" columns={[{
    label: "Owner",
    value: "Team member"
  }, {
    label: "Version",
    value: "2.6.0"
  }, {
    label: "Region",
    value: "EU West"
  }]} onAction={() => {}} style={{
    "--cib-bg": "#1e1b4b",
    "--cib-color": "#e0e7ff",
    "--cib-accent": "#6366f1",
    "--cib-header-color": "#a5b4fc"
  } as CSSProperties} />,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. All four are set here through the bar's \\\`style\\\` prop, because a wrapper cannot reach them.\`
      },
      source: {
        code: \`<ColumnarInfoBar
  headerText="Custom colours"
  columns={columns}
  onAction={handleClose}
  style={{
    "--cib-bg": "#1e1b4b",
    "--cib-color": "#e0e7ff",
    "--cib-accent": "#6366f1",
    "--cib-header-color": "#a5b4fc",
  }}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as CssCustomization,s as Default,l as EventDetails,u as NeutralVariant,d as PageVariant,c as ProfileDetails,p as __namedExportsOrder,o as default};