import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./MCPIcon-BrtJSP0o.js";import{n as o,t as s}from"./catalog.folder.react-VUpu0ofJ.js";import{n as c,t as l}from"./catalog.folder.react-BLNaFnHq.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{c(),o(),r(),n(),u=t(),d={title:`UI/Data display/MCPIcon`,component:a,parameters:{layout:`centered`},argTypes:{title:{control:`text`,description:`Name of the server. Only its first character is drawn, uppercased, and only while there is no image`},size:{control:`select`,options:Object.values(i),description:`One of four squares: 16, 24, 32 or 48px, each with its own font size and corner radius`,table:{defaultValue:{summary:`large`}}},imgSrc:{control:`text`,description:`URL of an image drawn instead of the letter; if it fails to load, the letter is shown`},imgNode:{control:!1,description:"Image as a node, drawn instead of `imgSrc` when both are set; it never falls back to the letter"},className:{control:`text`,description:`Class added to the outer element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`mcp-icon`}}}}},f=e=>(0,u.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`,flexWrap:`wrap`},children:e.children}),p=e=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`8px`},children:[e.children,(0,u.jsx)(`span`,{style:{fontSize:`12px`,color:`#666`},children:e.label})]}),m={render:e=>(0,u.jsx)(a,{...e}),args:{title:`Document search`,size:i.Large},parameters:{docs:{description:{story:`A server with no image of its own: the first letter of its name on a grey tile. Change any other prop live in the Controls panel below.`},source:{code:`<MCPIcon title="Document search" size={MCPIconSize.Large} />`}}}},h={render:e=>(0,u.jsx)(a,{...e}),args:{title:`Document search`,size:i.Large,imgSrc:s},parameters:{docs:{description:{story:"Use when the server has a logo: the image replaces the letter and fills the whole square (`imgSrc`)."},source:{code:`<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/path/to/icon.svg" />`}}}},g=()=>(0,u.jsx)(f,{children:Object.keys(i).map(e=>(0,u.jsx)(p,{label:e,children:(0,u.jsx)(a,{title:`Document search`,size:i[e]})},e))}),_={render:()=>(0,u.jsx)(g,{}),parameters:{docs:{description:{story:"Pick the size that matches the row it sits in: 16px (Small), 24px (Medium), 32px (Big) and 48px (Large), the letter and the corner radius growing with it (`size`)."},source:{code:`<MCPIcon title="Document search" size={MCPIconSize.Small} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} />
<MCPIcon title="Document search" size={MCPIconSize.Big} />
<MCPIcon title="Document search" size={MCPIconSize.Large} />`}}}},v=()=>(0,u.jsx)(f,{children:Object.keys(i).map(e=>(0,u.jsx)(p,{label:e,children:(0,u.jsx)(a,{title:`Document search`,size:i[e],imgSrc:s})},e))}),y={render:()=>(0,u.jsx)(v,{}),parameters:{docs:{description:{story:"The same four sizes with an image: it is scaled to the square, and no tile is drawn behind it (`imgSrc`)."},source:{code:`<MCPIcon title="Document search" size={MCPIconSize.Small} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Big} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc={iconUrl} />`}}}},b={render:e=>(0,u.jsx)(a,{...e}),args:{title:`Document search`,size:i.Large,imgSrc:`data:image/png;base64,invalid`},parameters:{docs:{description:{story:"Pass a server's image URL without checking it first: when it fails to load, the letter on its tile takes its place (`imgSrc`)."},source:{code:`<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/missing/icon.svg" />`}}}},x={render:e=>(0,u.jsx)(a,{...e}),args:{title:`Document search`,size:i.Large,imgNode:(0,u.jsx)(l,{})},parameters:{docs:{description:{story:"Use for an icon your bundler has already inlined as a component: the element is drawn in place of the letter, and nothing replaces it if it is empty (`imgNode`)."},source:{code:`import FolderIcon from "./folder.react.svg";

<MCPIcon title="Document search" size={MCPIconSize.Large} imgNode={<FolderIcon />} />`}}}},S={render:()=>(0,u.jsx)(`div`,{style:{"--mcp-icon-bg":`#0082c9`,"--mcp-icon-color":`#ffffff`,"--mcp-icon-opacity":`0.6`,"--mcp-icon-weight":`400`,"--mcp-icon-radius":`50%`},children:(0,u.jsx)(f,{children:Object.keys(i).map(e=>(0,u.jsx)(p,{label:e,children:(0,u.jsx)(a,{title:`D`,size:i[e]})},e))})}),parameters:{docs:{description:{story:`The variables are listed under CSS variables on this page. The four sizes share one wrapper that sets all five variables: a round, semi-transparent blue tile with a regular-weight white letter.`},source:{code:`<div
  style={{
    "--mcp-icon-bg": "#0082c9",
    "--mcp-icon-color": "#ffffff",
    "--mcp-icon-opacity": "0.6",
    "--mcp-icon-weight": "400",
    "--mcp-icon-radius": "50%",
  }}
>
  <MCPIcon title="D" size={MCPIconSize.Large} />
</div>`}}}},C=[`Default`,`WithImage`,`AllSizes`,`AllSizesWithImage`,`BrokenImageFallback`,`WithImageNode`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large
  },
  parameters: {
    docs: {
      description: {
        story: "A server with no image of its own: the first letter of its name on a grey tile. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<MCPIcon title="Document search" size={MCPIconSize.Large} />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgSrc: CatalogFolderIconUrl
  },
  parameters: {
    docs: {
      description: {
        story: "Use when the server has a logo: the image replaces the letter and fills the whole square (\`imgSrc\`)."
      },
      source: {
        code: \`<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/path/to/icon.svg" />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the size that matches the row it sits in: 16px (Small), 24px (Medium), 32px (Big) and 48px (Large), the letter and the corner radius growing with it (\`size\`)."
      },
      source: {
        code: \`<MCPIcon title="Document search" size={MCPIconSize.Small} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} />
<MCPIcon title="Document search" size={MCPIconSize.Big} />
<MCPIcon title="Document search" size={MCPIconSize.Large} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <AllSizesWithImageTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The same four sizes with an image: it is scaled to the square, and no tile is drawn behind it (\`imgSrc\`)."
      },
      source: {
        code: \`<MCPIcon title="Document search" size={MCPIconSize.Small} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Medium} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Big} imgSrc={iconUrl} />
<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc={iconUrl} />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    // An unparsable data URL fails to load without a network request.
    imgSrc: "data:image/png;base64,invalid"
  },
  parameters: {
    docs: {
      description: {
        story: "Pass a server's image URL without checking it first: when it fails to load, the letter on its tile takes its place (\`imgSrc\`)."
      },
      source: {
        code: \`<MCPIcon title="Document search" size={MCPIconSize.Large} imgSrc="/missing/icon.svg" />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <MCPIcon {...args} />,
  args: {
    title: "Document search",
    size: MCPIconSize.Large,
    imgNode: <CatalogFolderIcon />
  },
  parameters: {
    docs: {
      description: {
        story: "Use for an icon your bundler has already inlined as a component: the element is drawn in place of the letter, and nothing replaces it if it is empty (\`imgNode\`)."
      },
      source: {
        code: \`import FolderIcon from "./folder.react.svg";

<MCPIcon title="Document search" size={MCPIconSize.Large} imgNode={<FolderIcon />} />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--mcp-icon-bg": "#0082c9",
    "--mcp-icon-color": "#ffffff",
    "--mcp-icon-opacity": "0.6",
    "--mcp-icon-weight": "400",
    "--mcp-icon-radius": "50%"
  } as CSSProperties}>
      <Wrapper>
        {(Object.keys(MCPIconSize) as Array<keyof typeof MCPIconSize>).map(key => <LabeledItem key={key} label={key}>
              <MCPIcon title="D" size={MCPIconSize[key]} />
            </LabeledItem>)}
      </Wrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The four sizes share one wrapper that sets all five variables: a round, semi-transparent blue tile with a regular-weight white letter.\`
      },
      source: {
        code: \`<div
  style={{
    "--mcp-icon-bg": "#0082c9",
    "--mcp-icon-color": "#ffffff",
    "--mcp-icon-opacity": "0.6",
    "--mcp-icon-weight": "400",
    "--mcp-icon-radius": "50%",
  }}
>
  <MCPIcon title="D" size={MCPIconSize.Large} />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{_ as AllSizes,y as AllSizesWithImage,b as BrokenImageFallback,S as CssCustomization,m as Default,h as WithImage,x as WithImageNode,C as __namedExportsOrder,d as default};