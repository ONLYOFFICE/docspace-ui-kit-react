import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./globalColors-fkBUxSeV.js";import{n as a,t as o}from"./tooltip-DcisrCmM.js";import{r as s,t as c}from"./text-Cz_cI6Yf.js";import{n as l,r as u,t as d}from"./button-DjDXE7uo.js";import{n as f,t as p}from"./link-C_nB54e7.js";var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{m=t(),r(),l(),f(),s(),a(),h=n(),g={title:`UI/Overlays/Tooltip`,component:o,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=649%3A4458&mode=dev`}},argTypes:{place:{control:`select`,options:[`top`,`top-start`,`top-end`,`right`,`right-start`,`right-end`,`bottom`,`bottom-start`,`bottom-end`,`left`,`left-start`,`left-end`],description:`Preferred side of the anchor; the tooltip moves to another side when this one has no room in the viewport`,table:{defaultValue:{summary:`top`}}},color:{control:`color`,description:`Background colour of the tooltip, in place of the theme's; removing it later keeps the last colour`},opacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the tooltip`,table:{defaultValue:{summary:`1`}}},maxWidth:{control:`text`,description:`Maximum width as a CSS length; longer text wraps onto further lines`,table:{defaultValue:{summary:`320px`}}},noArrow:{control:`boolean`,description:`Hides the arrow that points from the tooltip at its anchor; set it to false to show the arrow`,table:{defaultValue:{summary:`true`}}},openOnClick:{control:`boolean`,description:`Opens the tooltip on a click instead of on hover, and closes it on the next click`,table:{defaultValue:{summary:`false`}}},float:{control:`boolean`,description:`Makes the tooltip follow the pointer instead of sitting at a fixed side of the anchor`,table:{defaultValue:{summary:`false`}}},id:{control:`text`,description:`Identifier the anchors point at with data-tooltip-id; without it, or anchorSelect, the tooltip has nothing to attach to`},anchorSelect:{control:`text`,description:`CSS selector for the anchors, used instead of data-tooltip-id; it matches elements anywhere in the document`},children:{control:`text`,description:`Fixed content, shown for every anchor that has no data-tooltip-content of its own`},getContent:{control:!1,description:`Function that receives the anchor's text and element and returns the content to show; it replaces both the anchor's text and children`},offset:{control:`number`,description:`Gap between the anchor and the tooltip, in pixels`,table:{defaultValue:{summary:`4`}}},fallbackAxisSideDirection:{control:`select`,options:[`none`,`start`,`end`],description:`Whether the tooltip may move to a side on the other axis when the preferred side and its opposite both have no room, and which one it tries first`},delayShow:{control:`number`,description:`Time the pointer has to rest on the anchor before the tooltip appears, in milliseconds`},clickable:{control:`boolean`,description:`Keeps the tooltip open while the pointer is over it, so a link inside it can be clicked`},isOpen:{control:`boolean`,description:`Holds the tooltip open or closed; while it is set, hover and click no longer open or close it`},imperativeModeOnly:{control:`boolean`,description:`Stops the anchors opening the tooltip, so it opens only when code calls open() on its ref`},ref:{control:!1,description:`Handle with open() and close() methods for opening the tooltip from code`},afterShow:{action:`afterShow`,description:`Called after the tooltip has appeared`},afterHide:{action:`afterHide`,description:`Called after the tooltip has disappeared`},noUserSelect:{control:`boolean`,description:`Stops the text inside the tooltip being selected with the pointer`},zIndex:{control:`number`,description:`Stacking order of the wrapper around the tooltip, for placing it above or below other layers`},className:{control:`text`,description:`Class added to the wrapper around the tooltip, not to the tooltip itself`},style:{control:`object`,description:`Inline style of the wrapper around the tooltip; CSS variables set here reach the tooltip`},tooltipStyle:{control:`object`,description:`Inline style of the tooltip itself`},dataTestId:{control:`text`,description:`Value of data-testid on the wrapper around the tooltip`,table:{defaultValue:{summary:`tooltip`}}}}},_={marginTop:100,marginInlineStart:200},v={render:e=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`default-tooltip`,"data-tooltip-content":`Simple tooltip`,children:`Hover me`})}),(0,h.jsx)(o,{...e,id:`default-tooltip`})]}),args:{float:!0,place:`top`},parameters:{docs:{description:{story:"The basic setup: the anchor names the tooltip with `data-tooltip-id` and carries its text in `data-tooltip-content`. Hover the link to see the tooltip follow the pointer (`float`); change any other prop live in the Controls panel below."},source:{code:`<Link data-tooltip-id="my-tooltip" data-tooltip-content="Simple tooltip">
  Hover me
</Link>
<Tooltip id="my-tooltip" float place="top" />`}}}},y=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`styled-tooltip`,"data-tooltip-content":`Styled tooltip`,children:`Hover for styled tooltip`})}),(0,h.jsx)(o,{id:`styled-tooltip`,opacity:.9,maxWidth:`200px`,noArrow:!1})]}),b={render:()=>(0,h.jsx)(y,{}),parameters:{docs:{description:{story:"For a tooltip that has to stand out from the theme: hover the link to see slight transparency (`opacity`), a narrower width limit (`maxWidth`) and the arrow pointing at the link (`noArrow={false}`)."},source:{code:`<Link data-tooltip-id="styled" data-tooltip-content="Styled tooltip">
  Hover for styled tooltip
</Link>
<Tooltip
  id="styled"
  opacity={0.9}
  maxWidth="200px"
  noArrow={false}
/>`}}}},x=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`click-tooltip`,"data-tooltip-content":`Click-triggered tooltip`,children:`Click me`})}),(0,h.jsx)(o,{id:`click-tooltip`,openOnClick:!0,place:`right`})]}),S={render:()=>(0,h.jsx)(x,{}),parameters:{docs:{description:{story:"For touch screens and hints the user asks for: click the link to open the tooltip on its right and click again to close it; hovering does nothing (`openOnClick`)."},source:{code:`<Link data-tooltip-id="click" data-tooltip-content="Click-triggered tooltip">
  Click me
</Link>
<Tooltip id="click" openOnClick place="right" />`}}}},C=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`rich-tooltip`,"data-tooltip-content":`Team member`,children:`Hover for rich content`})}),(0,h.jsx)(o,{id:`rich-tooltip`,float:!0,place:`top`,maxWidth:`250px`,getContent:({content:e})=>(0,h.jsxs)(`div`,{children:[(0,h.jsx)(c,{isBold:!0,fontSize:`16px`,children:e}),(0,h.jsx)(c,{color:i.gray,fontSize:`13px`,children:`name@example.com`}),(0,h.jsx)(c,{fontSize:`13px`,children:`Developer`})]})})]}),w={render:()=>(0,h.jsx)(C,{}),parameters:{docs:{description:{story:"For a hint that needs more than one line of plain text: hover the link to see a bold title taken from the anchor's text, with an address and a title below it (`getContent`)."},source:{code:`<Link data-tooltip-id="rich" data-tooltip-content="Team member">
  Hover for rich content
</Link>
<Tooltip
  id="rich"
  float
  maxWidth="250px"
  getContent={({ content }) => (
    <div>
      <Text isBold>{content}</Text>
      <Text>name@example.com</Text>
      <Text>Developer</Text>
    </div>
  )}
/>`}}}},T=()=>{let e=[{name:`Member A`,email:`a@example.com`,position:`Developer`},{name:`Member B`,email:`b@example.com`,position:`Designer`},{name:`Member C`,email:`c@example.com`,position:`Manager`}];return(0,h.jsxs)(`div`,{style:{padding:`20px`},children:[(0,h.jsx)(c,{children:`Group of tooltips:`}),(0,h.jsx)(`div`,{style:{display:`flex`,gap:`20px`,marginTop:`10px`},children:e.map((e,t)=>(0,h.jsx)(p,{"data-tooltip-id":`group-tooltip`,"data-tooltip-content":t,children:e.name},e.name))}),(0,h.jsx)(o,{id:`group-tooltip`,getContent:({content:t})=>{let n=e[Number(t)];return n?(0,h.jsxs)(`div`,{children:[(0,h.jsx)(c,{isBold:!0,fontSize:`16px`,children:n.name}),(0,h.jsx)(c,{color:i.gray,fontSize:`13px`,children:n.email}),(0,h.jsx)(c,{fontSize:`13px`,children:n.position})]}):null}})]})},E={render:()=>(0,h.jsx)(T,{}),parameters:{docs:{description:{story:"For a list where every row needs its own hint: hover each name to see one tooltip show that member's details, looked up from the index the anchor carries (`getContent`)."},source:{code:`{users.map((user, index) => (
  <Link data-tooltip-id="group" data-tooltip-content={index}>
    {user.name}
  </Link>
))}
<Tooltip
  id="group"
  getContent={({ content }) => {
    const user = users[Number(content)];
    return <div><Text isBold>{user.name}</Text></div>;
  }}
/>`}}}},D=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`fixed-content-tooltip`,children:`Hover me`})}),(0,h.jsx)(o,{id:`fixed-content-tooltip`,children:(0,h.jsx)(c,{fontSize:`12px`,children:`Shown for every anchor without text of its own`})})]}),O={render:()=>(0,h.jsx)(D,{}),parameters:{docs:{description:{story:"For content written once in the markup rather than on each anchor: hover the link, which has no `data-tooltip-content`, to see the tooltip's own children."},source:{code:`<Link data-tooltip-id="fixed">Hover me</Link>
<Tooltip id="fixed">
  <Text>Shown for every anchor without text of its own</Text>
</Tooltip>`}}}},k=()=>(0,h.jsxs)(`div`,{style:{padding:`20px`,display:`flex`,gap:`20px`},children:[(0,h.jsx)(p,{className:`selector-anchor`,"data-tooltip-content":`First file`,children:`First`}),(0,h.jsx)(p,{className:`selector-anchor`,"data-tooltip-content":`Second file`,children:`Second`}),(0,h.jsx)(o,{anchorSelect:`.selector-anchor`,place:`bottom`})]}),A={render:()=>(0,h.jsx)(k,{}),parameters:{docs:{description:{story:"For anchors that cannot carry a `data-tooltip-id`: hover either link to see the tooltip below it; both are found by their class (`anchorSelect`). The selector is matched across the whole page."},source:{code:`<Link className="file-link" data-tooltip-content="First file">
  First
</Link>
<Link className="file-link" data-tooltip-content="Second file">
  Second
</Link>
<Tooltip anchorSelect=".file-link" place="bottom" />`}}}},j=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`clickable-tooltip`,children:`Hover me`})}),(0,h.jsx)(o,{id:`clickable-tooltip`,clickable:!0,place:`bottom`,children:(0,h.jsxs)(c,{fontSize:`12px`,children:[`Move the pointer here and `,(0,h.jsx)(p,{href:`#`,children:`follow the link`})]})})]}),M={render:()=>(0,h.jsx)(j,{}),parameters:{docs:{description:{story:"For a tooltip with a link inside: hover the anchor, then move the pointer into the tooltip; it stays open, so the link can be clicked (`clickable`)."},source:{code:`<Link data-tooltip-id="clickable">Hover me</Link>
<Tooltip id="clickable" clickable place="bottom">
  <Text>
    Move the pointer here and <Link href="#">follow the link</Link>
  </Text>
</Tooltip>`}}}},N=()=>(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(p,{"data-tooltip-id":`delayed-tooltip`,"data-tooltip-content":`Appears after one second`,children:`Rest the pointer here`})}),(0,h.jsx)(o,{id:`delayed-tooltip`,delayShow:1e3})]}),P={render:()=>(0,h.jsx)(N,{}),parameters:{docs:{description:{story:"For anchors the pointer often crosses on its way elsewhere: rest the pointer on the link for a second before the tooltip appears; passing over it shows nothing (`delayShow`)."},source:{code:`<Link data-tooltip-id="delayed" data-tooltip-content="Appears after one second">
  Rest the pointer here
</Link>
<Tooltip id="delayed" delayShow={1000} />`}}}},F=()=>{let[e,t]=(0,m.useState)(!1);return(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsx)(`div`,{style:{..._,position:`absolute`},children:(0,h.jsx)(`span`,{"data-tooltip-id":`controlled-tooltip`,"data-tooltip-content":`Opened by the button, not by hover`,children:(0,h.jsx)(d,{label:e?`Hide tooltip`:`Show tooltip`,size:u.small,onClick:()=>t(!e)})})}),(0,h.jsx)(o,{id:`controlled-tooltip`,place:`right`,isOpen:e})]})},I={render:()=>(0,h.jsx)(F,{}),parameters:{docs:{description:{story:"For a tooltip the host decides to show, such as after a failed action: click the button to open the tooltip and again to close it; hovering no longer does either (`isOpen`)."},source:{code:`const [open, setOpen] = useState(false);

<span
  data-tooltip-id="controlled"
  data-tooltip-content="Opened by the button, not by hover"
>
  <Button
    label={open ? "Hide tooltip" : "Show tooltip"}
    onClick={() => setOpen(!open)}
  />
</span>
<Tooltip id="controlled" place="right" isOpen={open} />`}}}},L=()=>{let e=(0,m.useRef)(null);return(0,h.jsxs)(`div`,{style:{height:`240px`},children:[(0,h.jsxs)(`div`,{style:{..._,position:`absolute`,display:`flex`,gap:`12px`},children:[(0,h.jsx)(d,{id:`imperative-anchor`,label:`Open`,size:u.small,onClick:()=>e.current?.open({anchorSelect:`#imperative-anchor`,content:`Opened from code`})}),(0,h.jsx)(d,{label:`Close`,size:u.small,onClick:()=>e.current?.close()})]}),(0,h.jsx)(o,{ref:e,id:`imperative-tooltip`,place:`bottom`,imperativeModeOnly:!0})]})},R={render:()=>(0,h.jsx)(L,{}),parameters:{docs:{description:{story:"For a tooltip shown at a moment only the code knows: click **Open** to see the tooltip below it and **Close** to hide it; hovering either button shows nothing (`imperativeModeOnly` with `ref`)."},source:{code:`const tooltipRef = useRef<TooltipRefProps | null>(null);

<Button
  id="open"
  label="Open"
  onClick={() =>
    tooltipRef.current?.open({
      anchorSelect: "#open",
      content: "Opened from code",
    })
  }
/>
<Button label="Close" onClick={() => tooltipRef.current?.close()} />
<Tooltip ref={tooltipRef} id="imperative" place="bottom" imperativeModeOnly />`}}}},z={render:()=>(0,h.jsxs)(`div`,{style:{height:`200px`,position:`relative`},children:[(0,h.jsx)(`div`,{style:{position:`absolute`,top:80,left:100},children:(0,h.jsx)(p,{"data-tooltip-id":`css-customization-tooltip`,"data-tooltip-content":`Custom tooltip with a narrower width that wraps`,children:`Hover to see custom tooltip`})}),(0,h.jsx)(o,{id:`css-customization-tooltip`,place:`top`,style:{"--tooltip-radius":`16px`,"--tooltip-inner-padding":`12px 20px`,"--tooltip-bg":`#1e1b4b`,"--tooltip-color":`#e0e7ff`,"--tooltip-shadow":`0 4px 16px rgba(0,0,0,0.4)`,"--tooltip-text-size":`14px`,"--tooltip-max-width-value":`180px`,"--tooltip-layer":`1000`}})]}),parameters:{docs:{description:{story:"Every overridable variable set on one tooltip -- the variables are listed under CSS variables on this page. The tooltip renders in a portal outside the story's markup, so the variables go on its own `style` prop, which lands on the wrapper around it. Hover the link to see all of them at once; the stacking order has no visible effect here."},source:{code:`<Tooltip
  id="custom"
  style={{
    "--tooltip-radius": "16px",
    "--tooltip-inner-padding": "12px 20px",
    "--tooltip-bg": "#1e1b4b",
    "--tooltip-color": "#e0e7ff",
    "--tooltip-shadow": "0 4px 16px rgba(0,0,0,0.4)",
    "--tooltip-text-size": "14px",
    "--tooltip-max-width-value": "180px",
    "--tooltip-layer": "1000",
  }}
/>`}}}},B=[`Default`,`CustomStyling`,`ClickToShow`,`RichContent`,`SharedByManyAnchors`,`FixedContent`,`AnchoredBySelector`,`ClickableContent`,`DelayedAppearance`,`ControlledOpen`,`OpenedFromCode`,`CssCustomization`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => {
    return <div style={{
      height: "240px"
    }}>
        <div style={{
        ...bodyStyle,
        position: "absolute" as const
      }}>
          <Link data-tooltip-id="default-tooltip" data-tooltip-content="Simple tooltip">
            Hover me
          </Link>
        </div>
        <Tooltip {...args} id="default-tooltip" />
      </div>;
  },
  args: {
    float: true,
    place: "top"
  },
  parameters: {
    docs: {
      description: {
        story: "The basic setup: the anchor names the tooltip with \`data-tooltip-id\` and carries its text in \`data-tooltip-content\`. Hover the link to see the tooltip follow the pointer (\`float\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Link data-tooltip-id="my-tooltip" data-tooltip-content="Simple tooltip">
  Hover me
</Link>
<Tooltip id="my-tooltip" float place="top" />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a tooltip that has to stand out from the theme: hover the link to see slight transparency (\`opacity\`), a narrower width limit (\`maxWidth\`) and the arrow pointing at the link (\`noArrow={false}\`)."
      },
      source: {
        code: \`<Link data-tooltip-id="styled" data-tooltip-content="Styled tooltip">
  Hover for styled tooltip
</Link>
<Tooltip
  id="styled"
  opacity={0.9}
  maxWidth="200px"
  noArrow={false}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <ClickToShowTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For touch screens and hints the user asks for: click the link to open the tooltip on its right and click again to close it; hovering does nothing (\`openOnClick\`)."
      },
      source: {
        code: \`<Link data-tooltip-id="click" data-tooltip-content="Click-triggered tooltip">
  Click me
</Link>
<Tooltip id="click" openOnClick place="right" />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <RichContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a hint that needs more than one line of plain text: hover the link to see a bold title taken from the anchor's text, with an address and a title below it (\`getContent\`)."
      },
      source: {
        code: \`<Link data-tooltip-id="rich" data-tooltip-content="Team member">
  Hover for rich content
</Link>
<Tooltip
  id="rich"
  float
  maxWidth="250px"
  getContent={({ content }) => (
    <div>
      <Text isBold>{content}</Text>
      <Text>name@example.com</Text>
      <Text>Developer</Text>
    </div>
  )}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <DynamicGroupTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a list where every row needs its own hint: hover each name to see one tooltip show that member's details, looked up from the index the anchor carries (\`getContent\`)."
      },
      source: {
        code: \`{users.map((user, index) => (
  <Link data-tooltip-id="group" data-tooltip-content={index}>
    {user.name}
  </Link>
))}
<Tooltip
  id="group"
  getContent={({ content }) => {
    const user = users[Number(content)];
    return <div><Text isBold>{user.name}</Text></div>;
  }}
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <FixedContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For content written once in the markup rather than on each anchor: hover the link, which has no \`data-tooltip-content\`, to see the tooltip's own children."
      },
      source: {
        code: \`<Link data-tooltip-id="fixed">Hover me</Link>
<Tooltip id="fixed">
  <Text>Shown for every anchor without text of its own</Text>
</Tooltip>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <AnchoredBySelectorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For anchors that cannot carry a \`data-tooltip-id\`: hover either link to see the tooltip below it; both are found by their class (\`anchorSelect\`). The selector is matched across the whole page."
      },
      source: {
        code: \`<Link className="file-link" data-tooltip-content="First file">
  First
</Link>
<Link className="file-link" data-tooltip-content="Second file">
  Second
</Link>
<Tooltip anchorSelect=".file-link" place="bottom" />\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <ClickableContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a tooltip with a link inside: hover the anchor, then move the pointer into the tooltip; it stays open, so the link can be clicked (\`clickable\`)."
      },
      source: {
        code: \`<Link data-tooltip-id="clickable">Hover me</Link>
<Tooltip id="clickable" clickable place="bottom">
  <Text>
    Move the pointer here and <Link href="#">follow the link</Link>
  </Text>
</Tooltip>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <DelayedAppearanceTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For anchors the pointer often crosses on its way elsewhere: rest the pointer on the link for a second before the tooltip appears; passing over it shows nothing (\`delayShow\`)."
      },
      source: {
        code: \`<Link data-tooltip-id="delayed" data-tooltip-content="Appears after one second">
  Rest the pointer here
</Link>
<Tooltip id="delayed" delayShow={1000} />\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledOpenTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a tooltip the host decides to show, such as after a failed action: click the button to open the tooltip and again to close it; hovering no longer does either (\`isOpen\`)."
      },
      source: {
        code: \`const [open, setOpen] = useState(false);

<span
  data-tooltip-id="controlled"
  data-tooltip-content="Opened by the button, not by hover"
>
  <Button
    label={open ? "Hide tooltip" : "Show tooltip"}
    onClick={() => setOpen(!open)}
  />
</span>
<Tooltip id="controlled" place="right" isOpen={open} />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <OpenedFromCodeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a tooltip shown at a moment only the code knows: click **Open** to see the tooltip below it and **Close** to hide it; hovering either button shows nothing (\`imperativeModeOnly\` with \`ref\`)."
      },
      source: {
        code: \`const tooltipRef = useRef<TooltipRefProps | null>(null);

<Button
  id="open"
  label="Open"
  onClick={() =>
    tooltipRef.current?.open({
      anchorSelect: "#open",
      content: "Opened from code",
    })
  }
/>
<Button label="Close" onClick={() => tooltipRef.current?.close()} />
<Tooltip ref={tooltipRef} id="imperative" place="bottom" imperativeModeOnly />\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    height: "200px",
    position: "relative"
  }}>
      <div style={{
      position: "absolute",
      top: 80,
      left: 100
    }}>
        <Link data-tooltip-id="css-customization-tooltip" data-tooltip-content="Custom tooltip with a narrower width that wraps">
          Hover to see custom tooltip
        </Link>
      </div>
      <Tooltip id="css-customization-tooltip" place="top" style={{
      "--tooltip-radius": "16px",
      "--tooltip-inner-padding": "12px 20px",
      "--tooltip-bg": "#1e1b4b",
      "--tooltip-color": "#e0e7ff",
      "--tooltip-shadow": "0 4px 16px rgba(0,0,0,0.4)",
      "--tooltip-text-size": "14px",
      "--tooltip-max-width-value": "180px",
      "--tooltip-layer": "1000"
    } as CSSProperties} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one tooltip -- the variables are listed under CSS variables on this page. The tooltip renders in a portal outside the story's markup, so the variables go on its own \\\`style\\\` prop, which lands on the wrapper around it. Hover the link to see all of them at once; the stacking order has no visible effect here.\`
      },
      source: {
        code: \`<Tooltip
  id="custom"
  style={{
    "--tooltip-radius": "16px",
    "--tooltip-inner-padding": "12px 20px",
    "--tooltip-bg": "#1e1b4b",
    "--tooltip-color": "#e0e7ff",
    "--tooltip-shadow": "0 4px 16px rgba(0,0,0,0.4)",
    "--tooltip-text-size": "14px",
    "--tooltip-max-width-value": "180px",
    "--tooltip-layer": "1000",
  }}
/>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}}})))()}V();export{A as AnchoredBySelector,S as ClickToShow,M as ClickableContent,I as ControlledOpen,z as CssCustomization,b as CustomStyling,v as Default,P as DelayedAppearance,O as FixedContent,R as OpenedFromCode,w as RichContent,E as SharedByManyAnchors,B as __namedExportsOrder,g as default};