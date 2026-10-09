import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./public-room-bar-C2jYqNPx.js";import{n as i,t as a}from"./planet.react-CvYnOWuq.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{a(),n(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Feedback/PublicRoomBar`,component:r,parameters:{},argTypes:{headerText:{control:`text`,description:`Bold first line beside the icon: a string, or any node, which is then wrapped in a div instead of a paragraph`},bodyText:{control:`text`,description:`Smaller line under the header, at 12px: a string, or any node, which is then wrapped in a div instead of a paragraph`},iconName:{control:`text`,description:`Icon beside the header: a URL of an SVG file, loaded and inlined, or an element rendered as given; only its path fills take the header icon colour`,table:{defaultValue:{summary:`16px people glyph`}}},hideHeader:{control:`boolean`,description:`Removes the first row, icon and header text together, so only the body line is left`,table:{defaultValue:{summary:`false`}}},onClose:{control:!1,description:`Called when the close cross is clicked; the cross is shown only while this is set, and the bar stays on screen until the host stops rendering it`},barIsVisible:{control:`boolean`,description:`Removes the 20px margin above the bar, for a bar that already sits under something; it does not show or hide the bar`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class added after the component's own on the outer element`},style:{control:`object`,description:`Inline style of the outer element`},dataTestId:{control:`text`,description:`Value of data-testid on the outer element`,table:{defaultValue:{summary:`"public_room_bar"`}}}}},l={render:e=>(0,o.jsx)(r,{...e}),args:{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1},parameters:{docs:{description:{story:`The bar as most screens use it: the default icon, a header and a body line, with no close cross. Change any prop live in the Controls panel below.`},source:{code:`<PublicRoomBar
  headerText="Public Room"
  bodyText="This room is accessible to anyone with the link"
/>`}}}},u={render:e=>(0,o.jsx)(r,{...e}),args:{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1,iconName:i},parameters:{docs:{description:{story:"Replace the default glyph when another icon says more about the state the bar explains — here a planet, passed as an SVG URL (`iconName`)."},source:{code:`<PublicRoomBar
  headerText="Public Room"
  bodyText="Accessible via link"
  iconName={PlanetIcon}
/>`}}}},d={render:e=>(0,o.jsx)(r,{...e}),args:{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1,onClose:void 0},parameters:{docs:{description:{story:`Persistent bar without a close button. Cannot be dismissed by the user.`},source:{code:`<PublicRoomBar
  headerText="Public Room"
  bodyText="Persistent notification"
/>`}}}},f=()=>(0,o.jsx)(r,{headerText:(0,o.jsx)(`div`,{style:{color:`#0082c9`},children:`Custom Header Component`}),bodyText:(0,o.jsx)(`div`,{style:{fontStyle:`italic`},children:`Custom Body Component`}),barIsVisible:!0}),p={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:"Pass nodes instead of strings when a line needs markup of its own — a coloured header and an italic body here, each wrapped in a div instead of a paragraph (`headerText`, `bodyText`). The bar also sits without its top margin (`barIsVisible`)."},source:{code:`<PublicRoomBar
  headerText={<div style={{ color: "#0082c9" }}>Custom Header</div>}
  bodyText={<div style={{ fontStyle: "italic" }}>Custom Body</div>}
  barIsVisible
/>`}}}},m={render:e=>(0,o.jsx)(r,{...e}),args:{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1,onClose:s()},parameters:{docs:{description:{story:"Let the reader dismiss a note they have read: a close cross appears on the right (`onClose`). Clicking it only reports the click in the Actions panel; the bar stays until the host stops rendering it."},source:{code:`const [isShown, setIsShown] = useState(true);

{isShown ? (
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
    onClose={() => setIsShown(false)}
  />
) : null}`}}}},h={render:e=>(0,o.jsx)(r,{...e}),args:{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1,hideHeader:!0},parameters:{docs:{description:{story:"For a note that needs no title: the icon and the bold header are gone and only the smaller body line is left (`hideHeader`)."},source:{code:`<PublicRoomBar
  headerText=""
  bodyText="This room is accessible to anyone with the link"
  hideHeader
/>`}}}},g={render:()=>(0,o.jsx)(`div`,{style:{"--public-room-bar-bg":`#e6f3fb`,"--public-room-bar-header-color":`#0082c9`,"--public-room-bar-header-icon":`#0082c9`,"--public-room-bar-body-color":`#1f5f86`,"--public-room-bar-radius":`12px`,"--public-room-bar-padding":`16px 20px`,"--public-room-bar-top-margin":`8px`,"--public-room-bar-bottom-margin":`24px`,"--public-room-bar-header-gap":`12px`},children:(0,o.jsx)(r,{headerText:`Public Room`,bodyText:`This room is accessible to anyone with the link`,barIsVisible:!1})}),parameters:{docs:{description:{story:`The colour, spacing and corner variables set on one wrapper -- the variables are listed under CSS variables on this page.`},source:{code:`<div
  style={{
    "--public-room-bar-bg": "#e6f3fb",
    "--public-room-bar-header-color": "#0082c9",
    "--public-room-bar-header-icon": "#0082c9",
    "--public-room-bar-body-color": "#1f5f86",
    "--public-room-bar-radius": "12px",
    "--public-room-bar-padding": "16px 20px",
    "--public-room-bar-top-margin": "8px",
    "--public-room-bar-bottom-margin": "24px",
    "--public-room-bar-header-gap": "12px",
  }}
>
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
  />
</div>`}}}},_=[`Default`,`WithCustomIcon`,`WithoutCloseButton`,`WithCustomComponents`,`WithCloseButton`,`WithoutHeader`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false
  },
  parameters: {
    docs: {
      description: {
        story: "The bar as most screens use it: the default icon, a header and a body line, with no close cross. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<PublicRoomBar
  headerText="Public Room"
  bodyText="This room is accessible to anyone with the link"
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    iconName: PlanetIcon
  },
  parameters: {
    docs: {
      description: {
        story: "Replace the default glyph when another icon says more about the state the bar explains — here a planet, passed as an SVG URL (\`iconName\`)."
      },
      source: {
        code: \`<PublicRoomBar
  headerText="Public Room"
  bodyText="Accessible via link"
  iconName={PlanetIcon}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    onClose: undefined
  },
  parameters: {
    docs: {
      description: {
        story: "Persistent bar without a close button. Cannot be dismissed by the user."
      },
      source: {
        code: \`<PublicRoomBar
  headerText="Public Room"
  bodyText="Persistent notification"
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <WithCustomComponentsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pass nodes instead of strings when a line needs markup of its own — a coloured header and an italic body here, each wrapped in a div instead of a paragraph (\`headerText\`, \`bodyText\`). The bar also sits without its top margin (\`barIsVisible\`)."
      },
      source: {
        code: \`<PublicRoomBar
  headerText={<div style={{ color: "#0082c9" }}>Custom Header</div>}
  bodyText={<div style={{ fontStyle: "italic" }}>Custom Body</div>}
  barIsVisible
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    onClose: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Let the reader dismiss a note they have read: a close cross appears on the right (\`onClose\`). Clicking it only reports the click in the Actions panel; the bar stays until the host stops rendering it."
      },
      source: {
        code: \`const [isShown, setIsShown] = useState(true);

{isShown ? (
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
    onClose={() => setIsShown(false)}
  />
) : null}\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <PublicRoomBar {...args} />,
  args: {
    headerText: "Public Room",
    bodyText: "This room is accessible to anyone with the link",
    barIsVisible: false,
    hideHeader: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a note that needs no title: the icon and the bold header are gone and only the smaller body line is left (\`hideHeader\`)."
      },
      source: {
        code: \`<PublicRoomBar
  headerText=""
  bodyText="This room is accessible to anyone with the link"
  hideHeader
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--public-room-bar-bg": "#e6f3fb",
    "--public-room-bar-header-color": "#0082c9",
    "--public-room-bar-header-icon": "#0082c9",
    "--public-room-bar-body-color": "#1f5f86",
    "--public-room-bar-radius": "12px",
    "--public-room-bar-padding": "16px 20px",
    "--public-room-bar-top-margin": "8px",
    "--public-room-bar-bottom-margin": "24px",
    "--public-room-bar-header-gap": "12px"
  } as CSSProperties}>
      <PublicRoomBar headerText="Public Room" bodyText="This room is accessible to anyone with the link" barIsVisible={false} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The colour, spacing and corner variables set on one wrapper -- the variables are listed under CSS variables on this page.\`
      },
      source: {
        code: \`<div
  style={{
    "--public-room-bar-bg": "#e6f3fb",
    "--public-room-bar-header-color": "#0082c9",
    "--public-room-bar-header-icon": "#0082c9",
    "--public-room-bar-body-color": "#1f5f86",
    "--public-room-bar-radius": "12px",
    "--public-room-bar-padding": "16px 20px",
    "--public-room-bar-top-margin": "8px",
    "--public-room-bar-bottom-margin": "24px",
    "--public-room-bar-header-gap": "12px",
  }}
>
  <PublicRoomBar
    headerText="Public Room"
    bodyText="This room is accessible to anyone with the link"
  />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as CssCustomization,l as Default,m as WithCloseButton,p as WithCustomComponents,u as WithCustomIcon,d as WithoutCloseButton,h as WithoutHeader,_ as __namedExportsOrder,c as default};