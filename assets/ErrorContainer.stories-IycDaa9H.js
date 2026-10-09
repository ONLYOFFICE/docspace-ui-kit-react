import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./ErrorContainer-BbY1erzg.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a={title:`UI/Layout components/ErrorContainer`,component:r,parameters:{},argTypes:{headerText:{control:`text`,description:"The heading, rendered as an `h1` at 23px"},bodyText:{control:`text`,description:`The line under the heading, 14px and no wider than 560px`},buttonText:{control:`text`,description:"Label of the action button. The button appears only when `onClickButton` is set as well"},customizedBodyText:{control:`text`,description:"A third line under `bodyText`, 13px and 600-weight, in the muted colour. It takes plain text: markup in the string is shown as typed"},isPrimaryButton:{control:`boolean`,description:`Whether the action button is the filled accent one rather than the outlined one`,table:{defaultValue:{summary:`true`}}},isEditor:{control:`boolean`,description:`Takes the container out of the page flow and lays it over the whole width of its positioned parent, for a host that mounts it over a layout of its own`,table:{defaultValue:{summary:`false`}}},hideLogo:{control:`boolean`,description:`Hides the portal logo above the illustration`,table:{defaultValue:{summary:`false`}}},onClickButton:{action:`clicked`,description:"Called when the action button is clicked. The button appears only when `buttonText` is set as well"},children:{control:!1,description:`Rendered last, below the button: the place for a support link or a details block`},id:{control:`text`,description:"Value of `id` on the outer element. It does not rename the fixed ids of the parts inside"},className:{control:`text`,description:`Added after the component's own classes on the outer element`},style:{control:`object`,description:`Inline style of the outer element`}}},o={render:e=>(0,i.jsx)(r,{...e}),args:{bodyText:`Try again later`,headerText:`Some error has happened`,customizedBodyText:`Customized body`},parameters:{docs:{description:{story:"The plain error page: the heading says what happened (`headerText`), the line under it says what to do (`bodyText`), and the muted third line carries a detail such as an error code (`customizedBodyText`). Change any other prop live in the Controls panel below."},source:{code:`<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  customizedBodyText="Customized body"
/>`}}}},s={render:e=>(0,i.jsx)(r,{...e}),args:{bodyText:`An error occurred while processing your request`,headerText:`Some error has happened`,buttonText:`Retry`,isPrimaryButton:!0},parameters:{docs:{description:{story:"**Retry** — a filled button under the message, for the one action that gets the user out of the error (`buttonText` with `onClickButton`). Without the handler the button is not rendered at all."},source:{code:`<ErrorContainer
  headerText="Some error has happened"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  isPrimaryButton
  onClickButton={handleRetry}
/>`}}}},c={render:e=>(0,i.jsx)(r,{...e}),args:{isEditor:!0,bodyText:`Editor mode error message`,buttonText:`Close Editor`},parameters:{docs:{description:{story:"The same page laid over its host instead of pushing it down (`isEditor`), for a screen such as a document editor that mounts the error on top of a layout of its own."},source:{code:`<ErrorContainer
  isEditor
  bodyText="Editor mode error message"
  buttonText="Close Editor"
  onClickButton={handleClose}
/>`}}}},l={render:e=>(0,i.jsx)(r,{...e}),args:{headerText:`Connection Error`,bodyText:`Unable to connect to the server`,children:(0,i.jsxs)(`div`,{style:{padding:`20px`,textAlign:`center`},children:[(0,i.jsx)(`p`,{style:{fontSize:`14px`,marginBottom:`12px`,color:`var(--text-color)`},children:`Please check the following:`}),(0,i.jsxs)(`ul`,{style:{listStyle:`none`,padding:0,fontSize:`14px`,color:`var(--text-color)`,lineHeight:`1.8`},children:[(0,i.jsx)(`li`,{children:`Your internet connection is active`}),(0,i.jsx)(`li`,{children:`Server status at status.example.com`}),(0,i.jsx)(`li`,{children:`Firewall or antivirus settings`})]}),(0,i.jsx)(`p`,{style:{fontSize:`13px`,marginTop:`16px`,color:`var(--gray)`,fontStyle:`italic`},children:`Error Code: ERR_CONNECTION_REFUSED`})]})},parameters:{docs:{description:{story:"**Please check the following** — a checklist and an error code under the message (`children`), for guidance that does not fit into one line of text."},source:{code:`<ErrorContainer
  headerText="Connection Error"
  bodyText="Unable to connect to the server"
>
  <div>
    <p>Please check the following:</p>
    <ul>
      <li>Your internet connection is active</li>
      <li>Server status</li>
      <li>Firewall settings</li>
    </ul>
  </div>
</ErrorContainer>`}}}},u={render:e=>(0,i.jsx)(r,{...e}),args:{headerText:`Some error has happened`,bodyText:`The file could not be opened`,buttonText:`Go back`,isPrimaryButton:!1},parameters:{docs:{description:{story:"**Go back** — the same button, outlined (`isPrimaryButton` off), for a page where leaving is the way out rather than an action the user is expected to take."},source:{code:`<ErrorContainer
  headerText="Some error has happened"
  bodyText="The file could not be opened"
  buttonText="Go back"
  isPrimaryButton={false}
  onClickButton={handleBack}
/>`}}}},d={render:e=>(0,i.jsx)(r,{...e}),args:{headerText:`Some error has happened`,bodyText:`Try again later`,hideLogo:!0},parameters:{docs:{description:{story:"The page starts with the illustration, with no logo above it (`hideLogo`), for a host that already shows its own brand or has no portal to take the logo from."},source:{code:`<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  hideLogo
/>`}}}},f={render:()=>(0,i.jsx)(`div`,{style:{"--error-container-bg":`#e6f3fb`,"--error-container-text":`#1d2d44`},children:(0,i.jsx)(r,{headerText:`Connection error`,bodyText:`Unable to connect to the server.`,customizedBodyText:`Error code: 503`})}),parameters:{docs:{description:{story:"Both overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. The example tints the page background and the `customizedBodyText` line."},source:{code:`<div
  style={{
    "--error-container-bg": "#e6f3fb",
    "--error-container-text": "#1d2d44",
  }}
>
  <ErrorContainer
    headerText="Connection error"
    bodyText="Unable to connect to the server."
    customizedBodyText="Error code: 503"
  />
</div>`}}}},p=[`Default`,`WithPrimaryButton`,`InEditorMode`,`WithChildren`,`WithSecondaryButton`,`WithoutLogo`,`CssCustomization`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    bodyText: "Try again later",
    headerText: "Some error has happened",
    customizedBodyText: "Customized body"
  },
  parameters: {
    docs: {
      description: {
        story: "The plain error page: the heading says what happened (\`headerText\`), the line under it says what to do (\`bodyText\`), and the muted third line carries a detail such as an error code (\`customizedBodyText\`). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  customizedBodyText="Customized body"
/>\`
      }
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    bodyText: "An error occurred while processing your request",
    headerText: "Some error has happened",
    buttonText: "Retry",
    isPrimaryButton: true
  },
  parameters: {
    docs: {
      description: {
        story: "**Retry** — a filled button under the message, for the one action that gets the user out of the error (\`buttonText\` with \`onClickButton\`). Without the handler the button is not rendered at all."
      },
      source: {
        code: \`<ErrorContainer
  headerText="Some error has happened"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  isPrimaryButton
  onClickButton={handleRetry}
/>\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    isEditor: true,
    bodyText: "Editor mode error message",
    buttonText: "Close Editor"
  },
  parameters: {
    docs: {
      description: {
        story: "The same page laid over its host instead of pushing it down (\`isEditor\`), for a screen such as a document editor that mounts the error on top of a layout of its own."
      },
      source: {
        code: \`<ErrorContainer
  isEditor
  bodyText="Editor mode error message"
  buttonText="Close Editor"
  onClickButton={handleClose}
/>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    headerText: "Connection Error",
    bodyText: "Unable to connect to the server",
    children: <div style={{
      padding: "20px",
      textAlign: "center"
    }}>
        <p style={{
        fontSize: "14px",
        marginBottom: "12px",
        color: "var(--text-color)"
      }}>
          Please check the following:
        </p>
        <ul style={{
        listStyle: "none",
        padding: 0,
        fontSize: "14px",
        color: "var(--text-color)",
        lineHeight: "1.8"
      }}>
          <li>Your internet connection is active</li>
          <li>Server status at status.example.com</li>
          <li>Firewall or antivirus settings</li>
        </ul>
        <p style={{
        fontSize: "13px",
        marginTop: "16px",
        color: "var(--gray)",
        fontStyle: "italic"
      }}>
          Error Code: ERR_CONNECTION_REFUSED
        </p>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "**Please check the following** — a checklist and an error code under the message (\`children\`), for guidance that does not fit into one line of text."
      },
      source: {
        code: \`<ErrorContainer
  headerText="Connection Error"
  bodyText="Unable to connect to the server"
>
  <div>
    <p>Please check the following:</p>
    <ul>
      <li>Your internet connection is active</li>
      <li>Server status</li>
      <li>Firewall settings</li>
    </ul>
  </div>
</ErrorContainer>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "The file could not be opened",
    buttonText: "Go back",
    isPrimaryButton: false
  },
  parameters: {
    docs: {
      description: {
        story: "**Go back** — the same button, outlined (\`isPrimaryButton\` off), for a page where leaving is the way out rather than an action the user is expected to take."
      },
      source: {
        code: \`<ErrorContainer
  headerText="Some error has happened"
  bodyText="The file could not be opened"
  buttonText="Go back"
  isPrimaryButton={false}
  onClickButton={handleBack}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "Try again later",
    hideLogo: true
  },
  parameters: {
    docs: {
      description: {
        story: "The page starts with the illustration, with no logo above it (\`hideLogo\`), for a host that already shows its own brand or has no portal to take the logo from."
      },
      source: {
        code: \`<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  hideLogo
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--error-container-bg": "#e6f3fb",
    "--error-container-text": "#1d2d44"
  } as CSSProperties}>
      <ErrorContainer headerText="Connection error" bodyText="Unable to connect to the server." customizedBodyText="Error code: 503" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. The example tints the page background and the \\\`customizedBodyText\\\` line.\`
      },
      source: {
        code: \`<div
  style={{
    "--error-container-bg": "#e6f3fb",
    "--error-container-text": "#1d2d44",
  }}
>
  <ErrorContainer
    headerText="Connection error"
    bodyText="Unable to connect to the server."
    customizedBodyText="Error code: 503"
  />
</div>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as CssCustomization,o as Default,c as InEditorMode,l as WithChildren,s as WithPrimaryButton,u as WithSecondaryButton,d as WithoutLogo,p as __namedExportsOrder,a as default};