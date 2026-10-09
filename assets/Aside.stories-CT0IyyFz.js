import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{r,t as i}from"./text-Cz_cI6Yf.js";import{n as a,r as o,t as s}from"./button-DjDXE7uo.js";import{n as c,t as l}from"./toggle-button-CG0Cg1bK.js";import{n as u,r as d}from"./Avatar.enums-D3mbkRzL.js";import{n as f,t as p}from"./aside-CerT-TeK.js";import{n as m,t as h}from"./backdrop-DQlwuaA3.js";import{r as g,t as _}from"./avatar-B92H6Cjq.js";import{n as v,t as y}from"./text-input-D8OFtXHj.js";import{n as b,t as x}from"./TextInput.enums-z6wZ2LJ6.js";import{n as S,t as C}from"./Label-BMKvP-K4.js";import{n as w,t as T}from"./default_user_photo_size_82-82-BZq-hL9W.js";var E,D;function O(){return(O=e((()=>{E=`_scene_1a4o8_1`,D={scene:E}})))()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{k=t(),f(),a(),v(),c(),g(),r(),S(),m(),w(),O(),A=n(),j={title:`UI/Overlays/Aside`,component:p,parameters:{layout:`fullscreen`,docs:{story:{inline:!1,height:`600px`}},noPadding:!0},argTypes:{visible:{control:`boolean`,description:`Whether the panel is slid into view; the panel and its children stay mounted either way. Required`},scale:{control:`boolean`,description:`Makes the panel take the full width of the window instead of 480px`,table:{defaultValue:{summary:`false`}}},zIndex:{control:`number`,description:`Stacking order of the panel; a backdrop of your own needs a lower value`,table:{defaultValue:{summary:`400`}}},withoutHeader:{control:`boolean`,description:"Renders no header at all, which also removes the close cross, the only control that calls `onClose`",table:{defaultValue:{summary:`false`}}},withoutBodyScroll:{control:`boolean`,description:`Renders the children directly instead of inside the kit's scrollbar; it does not lock the page's scroll`,table:{defaultValue:{summary:`false`}}},header:{control:`text`,description:`Title of the panel: a string is shown as bold 21px text, any other node inside a heading that cuts off with an ellipsis`},isBackButton:{control:`boolean`,description:"Shows a back arrow before the title, which calls `onBackClick`",table:{defaultValue:{summary:`false`}}},isCloseable:{control:`boolean`,description:"Shows the close cross, which calls `onClose`",table:{defaultValue:{summary:`true`}}},isLoading:{control:`boolean`,description:`Replaces the whole header, title, icons and close cross alike, with a skeleton bar`,table:{defaultValue:{summary:`false`}}},withoutBorder:{control:`boolean`,description:`Hides the line under the header`,table:{defaultValue:{summary:`false`}}},headerHeight:{control:`text`,description:"Height of the header as a CSS length, such as `70px`; without it the header is 53px tall"},headerIcons:{control:!1,description:"Extra icon buttons between the title and the close cross, each with a `key`, an `onClick` and an `iconNode` or a `url`"},headerComponent:{control:!1,description:`Any node shown in the header after the icons and before the close cross`},onClose:{action:`close clicked`,description:`Called when the close cross is clicked; nothing else closes the panel`},onBackClick:{action:`back clicked`,description:`Called when the back arrow is clicked`},className:{control:`text`,description:"Class name added to the `<aside>` element"},children:{control:!1,description:`Content of the panel, shown below the header`}}},M={boxSizing:`border-box`,height:`100vh`,padding:`32px`,display:`flex`,flexDirection:`column`,gap:`16px`,fontFamily:`'Open Sans', sans-serif`,backgroundColor:`var(--aside-story-page)`},N={backgroundColor:`var(--aside-story-card)`,borderRadius:`6px`,padding:`20px`,border:`1px solid var(--aside-story-border)`},P=e=>{let[t,n]=(0,k.useState)(!1);(0,k.useEffect)(()=>{n(!!e.visible)},[e.visible]);let r=()=>n(!0),a=()=>{n(!1),e.onClose?.()};return(0,A.jsxs)(`div`,{className:D.scene,style:M,children:[(0,A.jsxs)(`div`,{style:N,children:[(0,A.jsx)(i,{fontSize:`22px`,fontWeight:600,children:`Documents`}),(0,A.jsx)(i,{fontSize:`13px`,style:{marginTop:`8px`,color:`var(--aside-story-muted)`},children:`Click the button below to open the side panel.`}),(0,A.jsx)(s,{label:`Open Panel`,primary:!0,size:o.medium,onClick:r,style:{marginTop:`16px`}})]}),(0,A.jsx)(`div`,{style:{...N,flex:1,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`var(--aside-story-faint)`,fontSize:`14px`},children:`Main content area`}),(0,A.jsx)(h,{visible:t,onClick:a,zIndex:399,isAside:!0}),(0,A.jsx)(p,{...e,visible:t,onClose:a,children:e.children})]})},F=()=>{let[e,t]=(0,k.useState)(!0),[n,r]=(0,k.useState)(!1),[a,c]=(0,k.useState)(!0),u={padding:`16px 20px`,borderBottom:`1px solid var(--aside-story-border)`},d={display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`10px 0`};return(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{style:u,children:[(0,A.jsx)(i,{fontWeight:600,fontSize:`14px`,children:`Notifications`}),(0,A.jsxs)(`div`,{style:d,children:[(0,A.jsx)(i,{fontSize:`13px`,children:`Email notifications`}),(0,A.jsx)(l,{isChecked:e,onChange:()=>t(e=>!e)})]})]}),(0,A.jsxs)(`div`,{style:u,children:[(0,A.jsx)(i,{fontWeight:600,fontSize:`14px`,children:`Appearance`}),(0,A.jsxs)(`div`,{style:d,children:[(0,A.jsx)(i,{fontSize:`13px`,children:`Dark mode`}),(0,A.jsx)(l,{isChecked:n,onChange:()=>r(e=>!e)})]})]}),(0,A.jsxs)(`div`,{style:u,children:[(0,A.jsx)(i,{fontWeight:600,fontSize:`14px`,children:`Editor`}),(0,A.jsxs)(`div`,{style:d,children:[(0,A.jsx)(i,{fontSize:`13px`,children:`Auto-save`}),(0,A.jsx)(l,{isChecked:a,onChange:()=>c(e=>!e)})]})]}),(0,A.jsx)(`div`,{style:{padding:`20px`},children:(0,A.jsx)(s,{label:`Save Changes`,primary:!0,size:o.normal,scale:!0})})]})},I=()=>(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,padding:`24px 20px`,borderBottom:`1px solid var(--aside-story-border)`,gap:`12px`},children:[(0,A.jsx)(_,{size:d.big,source:T,role:u.none}),(0,A.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,A.jsx)(i,{fontSize:`16px`,fontWeight:700,children:`Team member`}),(0,A.jsx)(i,{fontSize:`13px`,style:{marginTop:`4px`,color:`var(--aside-story-muted)`},children:`member@example.com`})]})]}),(0,A.jsxs)(`div`,{style:{padding:`16px 20px`,display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(C,{text:`First Name`}),(0,A.jsx)(y,{value:`Team`,type:b.text,size:x.base,scale:!0,onChange:()=>{}})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(C,{text:`Last Name`}),(0,A.jsx)(y,{value:`Member`,type:b.text,size:x.base,scale:!0,onChange:()=>{}})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(C,{text:`Email`}),(0,A.jsx)(y,{value:`member@example.com`,type:b.email,size:x.base,scale:!0,onChange:()=>{}})]})]}),(0,A.jsxs)(`div`,{style:{padding:`16px 20px`,display:`flex`,gap:`8px`},children:[(0,A.jsx)(s,{label:`Save`,primary:!0,size:o.normal,scale:!0}),(0,A.jsx)(s,{label:`Cancel`,size:o.normal,scale:!0})]})]}),L=()=>(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{style:{padding:`20px`,borderBottom:`1px solid var(--aside-story-border)`,display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,A.jsx)(i,{fontSize:`15px`,fontWeight:600,children:`Quarterly Report.docx`}),(0,A.jsx)(i,{fontSize:`12px`,style:{color:`var(--aside-story-muted)`},children:`Last modified: Feb 10, 2026`})]}),(0,A.jsxs)(`div`,{style:{padding:`16px 20px`},children:[(0,A.jsx)(i,{fontWeight:600,fontSize:`14px`,style:{marginBottom:`12px`},children:`Details`}),[{label:`Type`,value:`Document`},{label:`Size`,value:`2.4 MB`},{label:`Owner`,value:`Team member`},{label:`Created`,value:`Jan 15, 2026`},{label:`Location`,value:`My Documents`}].map(e=>(0,A.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,padding:`8px 0`,borderBottom:`1px solid var(--aside-story-row)`},children:[(0,A.jsx)(i,{fontSize:`13px`,style:{color:`var(--aside-story-muted)`},children:e.label}),(0,A.jsx)(i,{fontSize:`13px`,children:e.value})]},e.label))]}),(0,A.jsxs)(`div`,{style:{padding:`16px 20px`},children:[(0,A.jsx)(i,{fontWeight:600,fontSize:`14px`,style:{marginBottom:`12px`},children:`Shared with`}),[`Member one`,`Member two`,`Member three`].map(e=>(0,A.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,padding:`8px 0`},children:[(0,A.jsx)(_,{size:d.min,userName:e,role:u.none}),(0,A.jsx)(i,{fontSize:`13px`,children:e})]},e))]})]}),R={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,header:`Panel Title`,children:(0,A.jsx)(`div`,{style:{padding:`20px`},children:(0,A.jsx)(i,{fontSize:`14px`,children:`This is example content inside the Aside panel.`})})},parameters:{docs:{description:{story:"The panel with a title and a short text, opened by the button on the page. Close it with the cross or by clicking the dimmed page — that dimming is a `Backdrop` of the story's own, since `Aside` renders none. Change any other prop live in the Controls panel below."},source:{code:`<Aside visible={isVisible} header="Panel Title" onClose={handleClose}>
  <div style={{ padding: "20px" }}>
    <Text>Content here</Text>
  </div>
</Aside>`}}}},z={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,header:`Settings`,children:(0,A.jsx)(F,{})},parameters:{docs:{description:{story:`A short settings form with switches and a save button — the kind of form a side panel holds beside the page it configures.`},source:{code:`<Aside visible={isVisible} header="Settings" onClose={handleClose}>
  <SettingsContent />
</Aside>`}}}},B={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,header:`Profile`,children:(0,A.jsx)(I,{})},parameters:{docs:{description:{story:`An edit form with an avatar, labelled text fields and two buttons, for changing an item without leaving the page.`},source:{code:`<Aside visible={isVisible} header="Profile" onClose={handleClose}>
  <UserProfileContent />
</Aside>`}}}},V={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,header:`File Info`,children:(0,A.jsx)(L,{})},parameters:{docs:{description:{story:`The details of a selected file — its properties and the people it is shared with — the most common content of a side panel next to a list.`},source:{code:`<Aside visible={isVisible} header="File Info" onClose={handleClose}>
  <FileDetailsContent />
</Aside>`}}}},H={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,header:`Details`,isBackButton:!0,children:(0,A.jsx)(L,{})},parameters:{docs:{description:{story:"A back arrow before the title, for a panel with several levels: the arrow calls `onBackClick`, logged in the Actions panel, while the cross still closes the panel (`isBackButton`)."},source:{code:`<Aside visible={isVisible} header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
  <FileDetailsContent />
</Aside>`}}}},U={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,withoutHeader:!0,children:(0,A.jsx)(I,{})},parameters:{docs:{description:{story:"A panel with no header, for content that brings its own title bar. The close cross goes with the header, so the page has to close the panel itself — here a click on the dimmed page does (`withoutHeader`)."},source:{code:`<Aside visible={isVisible} withoutHeader onClose={handleClose}>
  <UserProfileContent />
</Aside>`}}}},W={render:e=>(0,A.jsx)(P,{...e}),args:{visible:!1,scale:!0,header:`Full Width Panel`,children:(0,A.jsx)(F,{})},parameters:{docs:{description:{story:"The panel across the full width of the window instead of 480px, for content that needs the room (`scale`)."},source:{code:`<Aside visible={isVisible} scale header="Full Width Panel" onClose={handleClose}>
  <SettingsContent />
</Aside>`}}}},G=e=>(0,A.jsx)(`div`,{dir:`rtl`,children:(0,A.jsx)(P,{...e})}),K={render:e=>(0,A.jsx)(G,{...e}),globals:{direction:`rtl`},args:{visible:!0,header:`Details`,isBackButton:!0,children:(0,A.jsx)(L,{})},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`600px`},description:{story:'The same panel under a right-to-left interface: it is attached to the left edge instead of the right and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <Aside visible header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
    <FileDetailsContent />
  </Aside>
</div>`}}}},q=()=>(0,A.jsx)(`div`,{style:{"--aside-bg":`#e6f3fb`,"--aside-width":`360px`,"--aside-transition":`transform 0.2s ease`,"--aside-mobile-footer-height":`32px`,"--aside-header-color":`#004f82`,"--aside-header-border":`#0082c9`,"--aside-header-font-size":`18px`,"--aside-header-height":`60px`,"--aside-header-gap":`12px`},children:(0,A.jsx)(p,{visible:!0,header:(0,A.jsx)(`span`,{children:`Settings`}),isBackButton:!0,onClose:()=>{},children:(0,A.jsxs)(`div`,{style:{padding:`20px`},children:[(0,A.jsx)(`p`,{style:{margin:`0 0 12px`,fontWeight:600,color:`#004f82`},children:`Custom styled panel`}),(0,A.jsx)(`p`,{style:{margin:0,fontSize:`13px`,color:`#5aa9d0`},children:`Background, width, header color and border customized via CSS vars.`})]})})}),J={render:()=>(0,A.jsx)(q,{}),parameters:{docs:{story:{inline:!1,height:`500px`},description:{story:`The panel and its header restyled through CSS variables on one wrapper -- the variables are listed under CSS variables on this page, and the header's on the AsideHeader page.

The title here is a node rather than a string, so the color and font-size variables reach it. The back arrow is on to show the gap between it and the title; the phone footer offset shows only in a phone-width window. The margin is left alone because the border does not follow it.`},source:{code:`<div
  style={{
    "--aside-bg": "#e6f3fb",
    "--aside-width": "360px",
    "--aside-transition": "transform 0.2s ease",
    "--aside-mobile-footer-height": "32px",
    "--aside-header-color": "#004f82",
    "--aside-header-border": "#0082c9",
    "--aside-header-font-size": "18px",
    "--aside-header-height": "60px",
    "--aside-header-gap": "12px",
  }}
>
  <Aside visible header={<span>Settings</span>} isBackButton onClose={handleClose}>
    {children}
  </Aside>
</div>`}}}},Y=[`Default`,`Settings`,`UserProfile`,`FileDetails`,`WithBackButton`,`WithoutHeader`,`Scaled`,`RightToLeft`,`CssCustomization`],R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    header: "Panel Title",
    children: <div style={{
      padding: "20px"
    }}>
        <Text fontSize="14px">
          This is example content inside the Aside panel.
        </Text>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "The panel with a title and a short text, opened by the button on the page. Close it with the cross or by clicking the dimmed page — that dimming is a \`Backdrop\` of the story's own, since \`Aside\` renders none. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Aside visible={isVisible} header="Panel Title" onClose={handleClose}>
  <div style={{ padding: "20px" }}>
    <Text>Content here</Text>
  </div>
</Aside>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    header: "Settings",
    children: <SettingsContent />
  },
  parameters: {
    docs: {
      description: {
        story: "A short settings form with switches and a save button — the kind of form a side panel holds beside the page it configures."
      },
      source: {
        code: \`<Aside visible={isVisible} header="Settings" onClose={handleClose}>
  <SettingsContent />
</Aside>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    header: "Profile",
    children: <UserProfileContent />
  },
  parameters: {
    docs: {
      description: {
        story: "An edit form with an avatar, labelled text fields and two buttons, for changing an item without leaving the page."
      },
      source: {
        code: \`<Aside visible={isVisible} header="Profile" onClose={handleClose}>
  <UserProfileContent />
</Aside>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    header: "File Info",
    children: <FileDetailsContent />
  },
  parameters: {
    docs: {
      description: {
        story: "The details of a selected file — its properties and the people it is shared with — the most common content of a side panel next to a list."
      },
      source: {
        code: \`<Aside visible={isVisible} header="File Info" onClose={handleClose}>
  <FileDetailsContent />
</Aside>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    header: "Details",
    isBackButton: true,
    children: <FileDetailsContent />
  },
  parameters: {
    docs: {
      description: {
        story: "A back arrow before the title, for a panel with several levels: the arrow calls \`onBackClick\`, logged in the Actions panel, while the cross still closes the panel (\`isBackButton\`)."
      },
      source: {
        code: \`<Aside visible={isVisible} header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
  <FileDetailsContent />
</Aside>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    withoutHeader: true,
    children: <UserProfileContent />
  },
  parameters: {
    docs: {
      description: {
        story: "A panel with no header, for content that brings its own title bar. The close cross goes with the header, so the page has to close the panel itself — here a click on the dimmed page does (\`withoutHeader\`)."
      },
      source: {
        code: \`<Aside visible={isVisible} withoutHeader onClose={handleClose}>
  <UserProfileContent />
</Aside>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    visible: false,
    scale: true,
    header: "Full Width Panel",
    children: <SettingsContent />
  },
  parameters: {
    docs: {
      description: {
        story: "The panel across the full width of the window instead of 480px, for content that needs the room (\`scale\`)."
      },
      source: {
        code: \`<Aside visible={isVisible} scale header="Full Width Panel" onClose={handleClose}>
  <SettingsContent />
</Aside>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <RightToLeftTemplate {...args} />,
  globals: {
    direction: "rtl"
  },
  args: {
    visible: true,
    header: "Details",
    isBackButton: true,
    children: <FileDetailsContent />
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "600px"
      },
      description: {
        story: 'The same panel under a right-to-left interface: it is attached to the left edge instead of the right and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <Aside visible header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
    <FileDetailsContent />
  </Aside>
</div>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      story: {
        inline: false,
        height: "500px"
      },
      description: {
        story: \`The panel and its header restyled through CSS variables on one wrapper -- the variables are listed under CSS variables on this page, and the header's on the AsideHeader page.

The title here is a node rather than a string, so the color and font-size variables reach it. The back arrow is on to show the gap between it and the title; the phone footer offset shows only in a phone-width window. The margin is left alone because the border does not follow it.\`
      },
      source: {
        code: \`<div
  style={{
    "--aside-bg": "#e6f3fb",
    "--aside-width": "360px",
    "--aside-transition": "transform 0.2s ease",
    "--aside-mobile-footer-height": "32px",
    "--aside-header-color": "#004f82",
    "--aside-header-border": "#0082c9",
    "--aside-header-font-size": "18px",
    "--aside-header-height": "60px",
    "--aside-header-gap": "12px",
  }}
>
  <Aside visible header={<span>Settings</span>} isBackButton onClose={handleClose}>
    {children}
  </Aside>
</div>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}}})))()}X();export{J as CssCustomization,R as Default,V as FileDetails,K as RightToLeft,W as Scaled,z as Settings,B as UserProfile,H as WithBackButton,U as WithoutHeader,Y as __namedExportsOrder,j as default};