import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./rootTooltip-D3FzIvov.js";import{n as i}from"./tooltip-DcisrCmM.js";import{r as a,t as o}from"./text-Cz_cI6Yf.js";import{n as s,t as c}from"./help-button-DRx62Qnc.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{t(),a(),i(),s(),l=n(),u={title:`UI/Interactive elements/HelpButton`,component:c,parameters:{},argTypes:{tooltipContent:{description:"Content of the tooltip. A string is shown by the application's shared tooltip, which appears only where `RootTooltip` is mounted; any other node opens in a tooltip the component renders itself",control:!1},getContent:{description:"Function that builds the tooltip's content in place of `tooltipContent`. A returned string goes to the shared tooltip, a returned node to the component's own",control:!1},children:{description:`Element to open the tooltip from in place of the info icon; the whole element becomes the anchor`,control:!1},place:{control:`select`,options:[`top`,`right`,`bottom`,`left`],description:`Side of the icon the tooltip opens on; it moves to another side when this one has no room`,table:{defaultValue:{summary:`top`}}},size:{control:{type:`number`,min:8,max:48},description:`Width and height of the info icon; a number is pixels, a string a CSS length`,table:{defaultValue:{summary:`12`}}},color:{control:`color`,description:'Colour of the info icon: any CSS colour, `"accent"` for the theme accent, or the name of a custom property starting with `--`'},iconName:{control:`text`,description:`URL of an SVG to draw instead of the info icon, fetched by the browser at runtime`},iconNode:{control:!1,description:`Icon as JSX to draw instead of the info icon`},offset:{control:`number`,description:`Gap between the icon and the tooltip, in pixels`},openOnClick:{control:`boolean`,description:`Opens the tooltip on click and keeps it open until the next click; when off, it opens on hover and closes when the pointer leaves`,table:{defaultValue:{summary:`true`}}},isClickable:{control:`boolean`,description:`Shows the pointer cursor over the icon; the tooltip opens on click either way`,table:{defaultValue:{summary:`true`}}},isOpen:{control:`boolean`,description:`Holds the tooltip open or closed from outside. Has no effect on a string tooltip`},afterShow:{action:`afterShow`,description:`Called after the tooltip has been shown. Not called for a string tooltip`},afterHide:{action:`afterHide`,description:`Called after the tooltip has been hidden. Not called for a string tooltip`},tooltipMaxWidth:{control:`text`,description:`Widest the tooltip may grow, as a CSS length; longer text wraps. Has no effect on a string tooltip`,table:{defaultValue:{summary:`320px`}}},tooltipStyle:{control:`object`,description:`Inline style of the tooltip box itself`},noUserSelect:{control:`boolean`,description:`Stops the text in the tooltip from being selected`},id:{control:`text`,description:`Id of the anchor. Without it a new id is generated on every render, so pass one for a button inside something that re-renders`},className:{control:`text`,description:`Class of the icon or of the element around the children`,table:{defaultValue:{summary:`icon-button`}}},style:{control:`object`,description:`Inline style of the wrapper around the anchor`},dataTip:{control:`text`,description:"Value of the legacy `data-tip` attribute on the icon"},dataTestId:{control:`text`,description:"Value of `data-testid` on the wrapper",table:{defaultValue:{summary:`help-button`}}},tooltipId:{control:!1,description:`Ignored. Nothing reads this prop`},tooltipProps:{control:!1,description:`Ignored. Nothing reads this prop`},offsetTop:{control:!1,description:`Ignored. Nothing reads this prop`},offsetRight:{control:!1,description:`Ignored. Nothing reads this prop`},offsetBottom:{control:!1,description:`Ignored. Nothing reads this prop`},offsetLeft:{control:!1,description:`Ignored. Nothing reads this prop`},hoverColor:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},clickColor:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},isDisabled:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},isFill:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},isStroke:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},iconHoverName:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},iconClickName:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onClick:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onMouseEnter:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onMouseLeave:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onMouseDown:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onMouseUp:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},tabIndex:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},onKeyDown:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`},title:{control:!1,description:`Accepted by the type but not passed on to the icon, so it has no effect`}}},d=e=>(0,l.jsx)(`div`,{style:{display:`flex`,gap:`32px`,alignItems:`center`,padding:`40px 20px`},children:e.children}),f={render:e=>(0,l.jsx)(`div`,{style:{padding:`40px 20px`},children:(0,l.jsx)(c,{...e})}),args:{tooltipContent:(0,l.jsx)(`div`,{children:`This is a help tooltip`}),place:`right`,offset:8},parameters:{docs:{description:{story:`The info icon with a short explanation beside it; click the icon to open it, and change any other prop live in the Controls panel below.`},source:{code:`<HelpButton
  tooltipContent={<div>This is a help tooltip</div>}
  place="right"
  offset={8}
/>`}}}},p=()=>(0,l.jsxs)(d,{children:[(0,l.jsx)(c,{tooltipContent:(0,l.jsx)(`div`,{children:`Default size`}),place:`top`,offset:8}),(0,l.jsx)(c,{tooltipContent:(0,l.jsx)(`div`,{children:`Large blue help button`}),size:24,color:`#2DA7DB`,place:`top`,offset:12}),(0,l.jsx)(c,{tooltipContent:(0,l.jsx)(`div`,{children:`Large green help button`}),size:20,color:`#4CAF50`,place:`top`,offset:12})]}),m={render:()=>(0,l.jsx)(p,{}),parameters:{docs:{description:{story:`An icon larger or in another colour stands out next to a heading rather than a field label. Click each icon to open its tooltip.`},source:{code:`<HelpButton tooltipContent={<div>Default size</div>} place="top" />
<HelpButton tooltipContent={<div>Large blue</div>} size={24} color="#2DA7DB" place="top" />
<HelpButton tooltipContent={<div>Large green</div>} size={20} color="#4CAF50" place="top" />`}}}},h=()=>(0,l.jsx)(`div`,{style:{padding:`40px 20px`},children:(0,l.jsx)(c,{tooltipContent:(0,l.jsxs)(`div`,{style:{padding:`8px`},children:[(0,l.jsx)(o,{fontSize:`14px`,fontWeight:`bold`,children:`Help Information`}),(0,l.jsxs)(`ul`,{style:{margin:`8px 0`},children:[(0,l.jsx)(`li`,{children:`First instruction`}),(0,l.jsx)(`li`,{children:`Second instruction`}),(0,l.jsx)(`li`,{children:`Third instruction`})]}),(0,l.jsx)(o,{fontSize:`12px`,color:`gray`,children:`Click for more details`})]}),place:`right`,offset:8})}),g={render:()=>(0,l.jsx)(h,{}),parameters:{docs:{description:{story:`An explanation that needs a heading or a list goes in as a React node, which opens in the component's own tooltip with no shared tooltip mounted.`},source:{code:`<HelpButton
  tooltipContent={
    <div>
      <Text fontWeight="bold">Help Information</Text>
      <ul>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ul>
    </div>
  }
  place="right"
/>`}}}},_=()=>(0,l.jsx)(`div`,{style:{display:`flex`,gap:`48px`,alignItems:`center`,justifyContent:`center`,padding:`80px 40px`},children:[`top`,`right`,`bottom`,`left`].map(e=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`8px`},children:[(0,l.jsx)(c,{tooltipContent:(0,l.jsxs)(`div`,{children:[`Tooltip appears at `,e]}),place:e,offset:8}),(0,l.jsx)(`span`,{style:{fontSize:`12px`,color:`#666`},children:e})]},e))}),v={render:()=>(0,l.jsx)(_,{}),parameters:{docs:{description:{story:`The side matters when the icon sits at the edge of a form or next to other controls. Click each icon to see its tooltip open on the side written under it.`},source:{code:`<HelpButton tooltipContent={<div>Top</div>} place="top" />
<HelpButton tooltipContent={<div>Right</div>} place="right" />
<HelpButton tooltipContent={<div>Bottom</div>} place="bottom" />
<HelpButton tooltipContent={<div>Left</div>} place="left" />`}}}},y=()=>(0,l.jsxs)(`div`,{style:{padding:`40px 20px`},children:[(0,l.jsx)(r,{}),(0,l.jsx)(c,{id:`text-content-help`,tooltipContent:`Plain text opens in the shared tooltip`,place:`right`})]}),b={render:()=>(0,l.jsx)(y,{}),parameters:{docs:{description:{story:"Plain text needs no tooltip of its own: a string is shown by the application's shared tooltip, so it appears only where `RootTooltip` is mounted once, as it is here. Click the icon to open it."},source:{code:`<RootTooltip />
<HelpButton
  id="text-content-help"
  tooltipContent="Plain text opens in the shared tooltip"
  place="right"
/>`}}}},x=()=>(0,l.jsx)(`div`,{style:{padding:`40px 20px`},children:(0,l.jsx)(c,{id:`custom-anchor-help`,place:`right`,tooltipMaxWidth:`240px`,tooltipContent:(0,l.jsx)(o,{fontSize:`12px`,children:`Storage is counted across all your rooms.`}),children:(0,l.jsx)(o,{as:`span`,style:{textDecoration:`underline dotted`},children:`Storage`})})}),S={render:()=>(0,l.jsx)(x,{}),parameters:{docs:{description:{story:"When the label itself should open the explanation, pass it as children in place of the icon. Click **Storage** to open a tooltip no wider than 240px (`tooltipMaxWidth`)."},source:{code:`<HelpButton
  id="custom-anchor-help"
  place="right"
  tooltipMaxWidth="240px"
  tooltipContent={<Text fontSize="12px">Storage is counted across all your rooms.</Text>}
>
  <Text as="span" style={{ textDecoration: "underline dotted" }}>Storage</Text>
</HelpButton>`}}}},C=()=>(0,l.jsx)(`div`,{style:{padding:`40px 20px`},children:(0,l.jsx)(c,{id:`hover-help`,openOnClick:!1,place:`right`,tooltipContent:(0,l.jsx)(`div`,{children:`Opens while the pointer is over the icon`})})}),w={render:()=>(0,l.jsx)(C,{}),parameters:{docs:{description:{story:"A one-line hint with nothing to click inside can open on hover instead (`openOnClick={false}`). Point at the icon to open it; the tooltip closes when the pointer leaves."},source:{code:`<HelpButton
  openOnClick={false}
  place="right"
  tooltipContent={<div>Opens while the pointer is over the icon</div>}
/>`}}}},T={"--tooltip-bg":`#1e3a5f`,"--tooltip-color":`#e6f3fb`,"--tooltip-max-width-value":`180px`},E={render:()=>(0,l.jsxs)(`div`,{style:{padding:`40px 20px`,display:`flex`,gap:`32px`,alignItems:`center`},children:[(0,l.jsx)(c,{tooltipContent:(0,l.jsx)(`div`,{children:`Customized tooltip`}),place:`right`,offset:8,tooltipStyle:T}),(0,l.jsx)(c,{tooltipContent:(0,l.jsx)(`div`,{children:`Another tooltip, wrapped at the custom maximum width`}),size:20,place:`right`,offset:8,tooltipStyle:T})]}),parameters:{docs:{description:{story:"The tooltip's variables passed through `tooltipStyle` -- the variables are listed under CSS variables on this page. Click either icon to see the custom colours; the second tooltip's longer text wraps at 180px."},source:{code:`<HelpButton
  tooltipContent={<div>Customized tooltip</div>}
  tooltipStyle={{
    "--tooltip-bg": "#1e3a5f",
    "--tooltip-color": "#e6f3fb",
    "--tooltip-max-width-value": "180px",
  }}
/>`}}}},D=[`Default`,`CustomStyle`,`WithCustomContent`,`TooltipPositions`,`WithTextContent`,`WithCustomAnchor`,`OpensOnHover`,`CssCustomization`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    padding: "40px 20px"
  }}>
      <HelpButton {...args} />
    </div>,
  args: {
    tooltipContent: <div>This is a help tooltip</div>,
    place: "right",
    offset: 8
  },
  parameters: {
    docs: {
      description: {
        story: "The info icon with a short explanation beside it; click the icon to open it, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<HelpButton
  tooltipContent={<div>This is a help tooltip</div>}
  place="right"
  offset={8}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStyleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An icon larger or in another colour stands out next to a heading rather than a field label. Click each icon to open its tooltip."
      },
      source: {
        code: \`<HelpButton tooltipContent={<div>Default size</div>} place="top" />
<HelpButton tooltipContent={<div>Large blue</div>} size={24} color="#2DA7DB" place="top" />
<HelpButton tooltipContent={<div>Large green</div>} size={20} color="#4CAF50" place="top" />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <WithCustomContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An explanation that needs a heading or a list goes in as a React node, which opens in the component's own tooltip with no shared tooltip mounted."
      },
      source: {
        code: \`<HelpButton
  tooltipContent={
    <div>
      <Text fontWeight="bold">Help Information</Text>
      <ul>
        <li>First instruction</li>
        <li>Second instruction</li>
      </ul>
    </div>
  }
  place="right"
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <TooltipPositionsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The side matters when the icon sits at the edge of a form or next to other controls. Click each icon to see its tooltip open on the side written under it."
      },
      source: {
        code: \`<HelpButton tooltipContent={<div>Top</div>} place="top" />
<HelpButton tooltipContent={<div>Right</div>} place="right" />
<HelpButton tooltipContent={<div>Bottom</div>} place="bottom" />
<HelpButton tooltipContent={<div>Left</div>} place="left" />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <TextContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Plain text needs no tooltip of its own: a string is shown by the application's shared tooltip, so it appears only where \`RootTooltip\` is mounted once, as it is here. Click the icon to open it."
      },
      source: {
        code: \`<RootTooltip />
<HelpButton
  id="text-content-help"
  tooltipContent="Plain text opens in the shared tooltip"
  place="right"
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <CustomAnchorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "When the label itself should open the explanation, pass it as children in place of the icon. Click **Storage** to open a tooltip no wider than 240px (\`tooltipMaxWidth\`)."
      },
      source: {
        code: \`<HelpButton
  id="custom-anchor-help"
  place="right"
  tooltipMaxWidth="240px"
  tooltipContent={<Text fontSize="12px">Storage is counted across all your rooms.</Text>}
>
  <Text as="span" style={{ textDecoration: "underline dotted" }}>Storage</Text>
</HelpButton>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <OpensOnHoverTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A one-line hint with nothing to click inside can open on hover instead (\`openOnClick={false}\`). Point at the icon to open it; the tooltip closes when the pointer leaves."
      },
      source: {
        code: \`<HelpButton
  openOnClick={false}
  place="right"
  tooltipContent={<div>Opens while the pointer is over the icon</div>}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "40px 20px",
    display: "flex",
    gap: "32px",
    alignItems: "center"
  }}>
      <HelpButton tooltipContent={<div>Customized tooltip</div>} place="right" offset={8} tooltipStyle={cssTooltipStyle} />
      <HelpButton tooltipContent={<div>Another tooltip, wrapped at the custom maximum width</div>} size={20} place="right" offset={8} tooltipStyle={cssTooltipStyle} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The tooltip's variables passed through \\\`tooltipStyle\\\` -- the variables are listed under CSS variables on this page. Click either icon to see the custom colours; the second tooltip's longer text wraps at 180px.\`
      },
      source: {
        code: \`<HelpButton
  tooltipContent={<div>Customized tooltip</div>}
  tooltipStyle={{
    "--tooltip-bg": "#1e3a5f",
    "--tooltip-color": "#e6f3fb",
    "--tooltip-max-width-value": "180px",
  }}
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}}})))()}O();export{E as CssCustomization,m as CustomStyle,f as Default,w as OpensOnHover,v as TooltipPositions,S as WithCustomAnchor,g as WithCustomContent,b as WithTextContent,D as __namedExportsOrder,u as default};