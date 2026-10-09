import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,r as i,t as a}from"./button-DjDXE7uo.js";import{n as o,t as s}from"./backdrop-DQlwuaA3.js";var c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{c=t(),o(),r(),l=n(),u={title:`UI/Overlays/Backdrop`,component:s,parameters:{},argTypes:{visible:{control:!1,description:`Whether the layer is rendered at all; a backdrop that is not visible renders nothing. The stories switch it with their button`,table:{defaultValue:{summary:`false`}}},zIndex:{control:`number`,description:`Stacking order of the layer; the component it covers needs a higher one`,table:{defaultValue:{summary:`203`}}},withBackground:{control:`boolean`,description:`Dims the page. Without it the layer is transparent and only catches clicks, except on a screen 600px wide or narrower, where it dims anyway`,table:{defaultValue:{summary:`false`}}},withoutBackground:{control:`boolean`,description:`Keeps the layer transparent on every screen size, even when withBackground or isAside is set`,table:{defaultValue:{summary:`false`}}},isAside:{control:`boolean`,description:`Marks the layer as belonging to a side panel: it dims the page and renders even when other backdrops are already on screen`,table:{defaultValue:{summary:`false`}}},isModalDialog:{control:`boolean`,description:`Lets touch scrolling over the layer go on; without it a touch move over the layer is blocked`,table:{defaultValue:{summary:`false`}}},shouldShowBackdrop:{control:`boolean`,description:`Renders the layer even when another backdrop is already on screen, which would otherwise keep it hidden`,table:{defaultValue:{summary:`false`}}},onClick:{control:!1,description:`Called on a click on the layer, and on a touch move or touch end over it. The stories use it to close the backdrop`},className:{control:`text`,description:`Extra class name, or an array of them, for the layer`},id:{control:`text`,description:`HTML id of the layer`},style:{control:`object`,description:`Inline styles for the layer, applied over the stacking order set by zIndex`}}},d=e=>{let[t,n]=(0,c.useState)(!1),r=()=>n(!t),o=document.body.classList.contains(`dark`);return(0,l.jsxs)(`div`,{style:{height:`200px`},children:[(0,l.jsx)(a,{label:`Toggle Backdrop`,primary:!0,size:i.medium,onClick:r}),(0,l.jsx)(s,{...e,visible:t,onClick:r}),t?(0,l.jsx)(`button`,{type:`button`,onClick:r,style:{position:`fixed`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,color:o?`#fff`:`#333`,backgroundColor:o?`rgba(32, 32, 32, 0.8)`:`rgba(255, 255, 255, 0.8)`,padding:`10px 16px`,borderRadius:`6px`,border:`none`,fontSize:`16px`,cursor:`pointer`,zIndex:204},children:`Click anywhere to close`}):null]})},f=e=>{let[t,n]=(0,c.useState)(!1),[r,o]=(0,c.useState)(!1),u=document.body.classList.contains(`dark`);return(0,l.jsxs)(`div`,{style:{height:`200px`},children:[(0,l.jsx)(a,{label:`First Backdrop`,primary:!0,size:i.medium,onClick:()=>n(!0)}),(0,l.jsx)(s,{...e,visible:t,isAside:!0,onClick:()=>n(!1)}),t&&!r?(0,l.jsx)(`div`,{style:{position:`fixed`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,zIndex:204},children:(0,l.jsx)(a,{label:`Second Backdrop`,primary:!0,size:i.medium,onClick:()=>o(!0)})}):null,(0,l.jsx)(s,{...e,visible:r,isAside:!0,zIndex:205,onClick:()=>o(!1)}),r?(0,l.jsx)(`button`,{type:`button`,onClick:()=>o(!1),style:{position:`fixed`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,color:u?`#fff`:`#333`,backgroundColor:u?`rgba(32, 32, 32, 0.8)`:`rgba(255, 255, 255, 0.8)`,padding:`10px 16px`,borderRadius:`6px`,border:`none`,fontSize:`16px`,cursor:`pointer`,zIndex:206},children:`Click anywhere to close the second backdrop`}):null]})},p=e=>{let[t,n]=(0,c.useState)(!1),r=()=>n(!t),o=document.body.classList.contains(`dark`);return(0,l.jsxs)(`div`,{style:{height:`300px`},children:[(0,l.jsx)(a,{label:`Show Modal`,primary:!0,size:i.medium,onClick:r}),(0,l.jsx)(s,{...e,visible:t,isModalDialog:!0,onClick:r}),t?(0,l.jsxs)(`button`,{type:`button`,onClick:r,style:{position:`fixed`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,background:o?`#333`:`white`,color:o?`#fff`:`#333`,padding:`2rem`,borderRadius:`8px`,border:`none`,cursor:`pointer`,textAlign:`left`,zIndex:204,boxShadow:o?`0 4px 12px rgba(0, 0, 0, 0.5)`:`0 4px 12px rgba(0, 0, 0, 0.15)`},children:[(0,l.jsx)(`h2`,{style:{color:o?`#fff`:`#333`},children:`Modal Content`}),(0,l.jsx)(`p`,{style:{color:o?`#ccc`:`#666`},children:`Click outside to close`})]}):null]})},m={render:e=>(0,l.jsx)(d,{...e}),args:{withBackground:!0},parameters:{docs:{description:{story:"The common case: a dimmed layer behind a dialog that closes it on a click (`withBackground`). Press the button to open it, then click anywhere to close it; change any other prop live in the Controls panel below."},source:{code:`<Backdrop visible={isVisible} withBackground onClick={handleClose} />`}}}},h={render:e=>(0,l.jsx)(d,{...e}),args:{withoutBackground:!0},parameters:{docs:{description:{story:"For a menu or dropdown that must close on an outside click without darkening the page: the layer stays transparent and still catches the click (`withoutBackground`)."},source:{code:`<Backdrop visible={isVisible} withoutBackground onClick={handleClose} />`}}}},g={render:e=>(0,l.jsx)(f,{...e}),args:{withBackground:!0},parameters:{docs:{description:{story:"For a side panel opened over another one: each panel's layer renders even though a backdrop is already on screen, and the second darkens the page further (`isAside`). Open the first backdrop, then the second from the button above it; a click closes the top layer first."},source:{code:`<Backdrop visible={isFirstVisible} isAside withBackground onClick={() => setFirstVisible(false)} />
<Backdrop visible={isSecondVisible} isAside withBackground zIndex={205} onClick={() => setSecondVisible(false)} />`}}}},_={render:e=>(0,l.jsx)(p,{...e}),args:{withBackground:!0,isModalDialog:!0},parameters:{docs:{description:{story:"For a modal dialog on a touch screen: the layer keeps catching taps that close the dialog, but no longer blocks touch scrolling (`isModalDialog`)."},source:{code:`<Backdrop visible={isVisible} isModalDialog withBackground onClick={handleClose} />`}}}},v={render:e=>{let[t,n]=(0,c.useState)(!1),r=document.body.classList.contains(`dark`);return(0,l.jsxs)(`div`,{style:{height:`300px`,position:`relative`},children:[(0,l.jsx)(a,{label:`Show Backdrop (z-index: 500)`,primary:!0,size:i.medium,onClick:()=>n(!t)}),(0,l.jsx)(s,{...e,visible:t,onClick:()=>n(!1)}),t?(0,l.jsxs)(`button`,{type:`button`,onClick:()=>n(!1),style:{position:`fixed`,top:`50%`,left:`50%`,transform:`translate(-50%, -50%)`,backgroundColor:r?`rgba(32, 32, 32, 0.9)`:`rgba(255, 255, 255, 0.9)`,color:r?`#fff`:`#333`,padding:`2rem`,borderRadius:`8px`,border:`none`,cursor:`pointer`,zIndex:501,textAlign:`center`},children:[(0,l.jsx)(`h3`,{children:`Custom z-index: 500`}),(0,l.jsx)(`p`,{children:`Modal is on top (z-index: 501)`}),(0,l.jsx)(`p`,{children:`Click to close`})]}):null]})},args:{withBackground:!0,zIndex:500},parameters:{docs:{description:{story:"When the covered content has to sit above other high layers of the page, raise the backdrop's stacking order and place the content one step above it — here 500 and 501 instead of the default 203 (`zIndex`)."},source:{code:`<Backdrop visible={isVisible} withBackground zIndex={500} onClick={handleClose} />`}}}},y={render:()=>(0,l.jsxs)(`div`,{style:{"--backdrop-bg":`rgba(0, 130, 201, 0.4)`},children:[(0,l.jsx)(s,{visible:!0,withBackground:!0,onClick:()=>{}}),(0,l.jsx)(`div`,{style:{position:`relative`,zIndex:11,color:`#fff`,padding:`16px`,fontWeight:600},children:`Custom blue backdrop`})]}),parameters:{docs:{story:{inline:!1,height:`200px`},description:{story:"The dimming colour overridden on a wrapper -- the variables are listed under CSS variables on this page. The stacking order is the `zIndex` prop."},source:{code:`<div style={{ "--backdrop-bg": "rgba(0, 130, 201, 0.4)" }}>
  <Backdrop visible withBackground onClick={handleClose} />
</div>`}}}},b=[`Default`,`WithoutBackground`,`MultipleBackdrops`,`ModalDialogBackdrop`,`WithCustomZIndex`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    withBackground: true
  },
  parameters: {
    docs: {
      description: {
        story: "The common case: a dimmed layer behind a dialog that closes it on a click (\`withBackground\`). Press the button to open it, then click anywhere to close it; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Backdrop visible={isVisible} withBackground onClick={handleClose} />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    withoutBackground: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a menu or dropdown that must close on an outside click without darkening the page: the layer stays transparent and still catches the click (\`withoutBackground\`)."
      },
      source: {
        code: \`<Backdrop visible={isVisible} withoutBackground onClick={handleClose} />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <MultipleBackdropsTemplate {...args} />,
  args: {
    withBackground: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a side panel opened over another one: each panel's layer renders even though a backdrop is already on screen, and the second darkens the page further (\`isAside\`). Open the first backdrop, then the second from the button above it; a click closes the top layer first."
      },
      source: {
        code: \`<Backdrop visible={isFirstVisible} isAside withBackground onClick={() => setFirstVisible(false)} />
<Backdrop visible={isSecondVisible} isAside withBackground zIndex={205} onClick={() => setSecondVisible(false)} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <ModalTemplate {...args} />,
  args: {
    withBackground: true,
    isModalDialog: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a modal dialog on a touch screen: the layer keeps catching taps that close the dialog, but no longer blocks touch scrolling (\`isModalDialog\`)."
      },
      source: {
        code: \`<Backdrop visible={isVisible} isModalDialog withBackground onClick={handleClose} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [isVisible, setIsVisible] = useState(false);
    const isDarkTheme = document.body.classList.contains("dark");
    return <div style={{
      height: "300px",
      position: "relative"
    }}>
        <Button label="Show Backdrop (z-index: 500)" primary size={ButtonSize.medium} onClick={() => setIsVisible(!isVisible)} />
        <Backdrop {...args} visible={isVisible} onClick={() => setIsVisible(false)} />
        {isVisible ? <button type="button" onClick={() => setIsVisible(false)} style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: isDarkTheme ? "rgba(32, 32, 32, 0.9)" : "rgba(255, 255, 255, 0.9)",
        color: isDarkTheme ? "#fff" : "#333",
        padding: "2rem",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        zIndex: 501,
        textAlign: "center"
      }}>
            <h3>Custom z-index: 500</h3>
            <p>Modal is on top (z-index: 501)</p>
            <p>Click to close</p>
          </button> : null}
      </div>;
  },
  args: {
    withBackground: true,
    zIndex: 500
  },
  parameters: {
    docs: {
      description: {
        story: "When the covered content has to sit above other high layers of the page, raise the backdrop's stacking order and place the content one step above it — here 500 and 501 instead of the default 203 (\`zIndex\`)."
      },
      source: {
        code: \`<Backdrop visible={isVisible} withBackground zIndex={500} onClick={handleClose} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--backdrop-bg": "rgba(0, 130, 201, 0.4)"
  } as CSSProperties}>
      <Backdrop visible withBackground onClick={() => {}} />
      <div style={{
      position: "relative",
      zIndex: 11,
      color: "#fff",
      padding: "16px",
      fontWeight: 600
    }}>
        Custom blue backdrop
      </div>
    </div>,
  parameters: {
    docs: {
      // The layer is fixed over the whole window, so inline it would cover the Docs page.
      story: {
        inline: false,
        height: "200px"
      },
      description: {
        story: \`The dimming colour overridden on a wrapper -- the variables are listed under CSS variables on this page. The stacking order is the \\\`zIndex\\\` prop.\`
      },
      source: {
        code: \`<div style={{ "--backdrop-bg": "rgba(0, 130, 201, 0.4)" }}>
  <Backdrop visible withBackground onClick={handleClose} />
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}}})))()}x();export{y as CssCustomization,m as Default,_ as ModalDialogBackdrop,g as MultipleBackdrops,v as WithCustomZIndex,h as WithoutBackground,b as __namedExportsOrder,u as default};