import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{r as n,t as r}from"./text-Cz_cI6Yf.js";import{n as i,t as a}from"./link-C_nB54e7.js";import{n as o,t as s}from"./word-kWuzOL5c.js";import{n as c,t as l}from"./badge-DpBv0vYH.js";import{n as u,t as d}from"./base-tile-80NBnHCx.js";import{n as f,t as p}from"./tile-content-BziW1hzz.js";var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{o(),f(),u(),i(),n(),c(),m=t(),{fn:h}=__STORYBOOK_MODULE_TEST__,g=(0,m.jsx)(s,{}),_=[{key:`edit`,label:`Edit`},{key:`delete`,label:`Delete`}],v={title:`UI/Tiles/TileContent`,component:p,parameters:{},argTypes:{children:{control:!1,description:"The one element shown as the tile's name; a `containerWidth` prop on it becomes the width of the slot"},onClick:{description:`Called with no argument when anything inside the slot is clicked`},className:{control:`text`,description:`Class added after the component's own on the outer element`},id:{control:`text`,description:"Value of `id` on the outer element"},style:{control:`object`,description:`Inline style of the outer element`}},args:{onClick:h()},decorators:[e=>(0,m.jsx)(`div`,{style:{maxWidth:`300px`,margin:`20px`},children:(0,m.jsx)(d,{item:{id:`1`,title:`Document.docx`},contextOptions:_,element:g,topContent:(0,m.jsx)(e,{})})})]},y={args:{children:(0,m.jsx)(a,{children:`Document.docx`})},parameters:{docs:{description:{story:"A file name as a link, the way a tile usually shows it. Click it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<TileContent>
  <Link>Document.docx</Link>
</TileContent>`}}}},b={args:{children:(0,m.jsx)(r,{fontSize:`14px`,fontWeight:600,children:`My Document`})},parameters:{docs:{description:{story:"A name that should not look clickable, for an item the reader cannot open: plain `Text` in place of a link."},source:{code:`<TileContent>
  <Text fontSize="14px" fontWeight={600}>My Document</Text>
</TileContent>`}}}},x={args:{children:(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,m.jsx)(a,{children:`Document.docx`}),(0,m.jsx)(l,{label:`New`,backgroundColor:`#4781D1`,color:`#fff`})]})},parameters:{docs:{description:{story:`A name with a badge beside it. The slot takes one element, so the name and the badge go inside a wrapper of your own.`},source:{code:`<TileContent>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Link>Document.docx</Link>
    <Badge label="New" backgroundColor="#4781D1" color="#fff" />
  </div>
</TileContent>`}}}},S={args:{children:(0,m.jsx)(r,{containerWidth:`120px`,truncate:!0,children:`Quarterly report with a long name.docx`})},parameters:{docs:{description:{story:"A name held to a set width whatever room the tile has, so the names in a grid end at the same point: the slot takes its width from the child's own `containerWidth` prop, and `truncate` on the `Text` cuts the rest off."},source:{code:`<TileContent>
  <Text containerWidth="120px" truncate>
    Quarterly report with a long name.docx
  </Text>
</TileContent>`}}}},C={decorators:[e=>(0,m.jsx)(`div`,{style:{"--tile-bg":`#e6f3fb`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`},children:(0,m.jsx)(e,{})})],args:{children:(0,m.jsx)(a,{children:`Document.docx`})},parameters:{docs:{description:{story:`TileContent reads no variables of its own -- the tile's variables it sits in are listed under CSS variables on the BaseTile, FileTile, FolderTile and RoomTile pages. This example sets four of the BaseTile ones on a wrapper; hover the tile to see the hover background.`}}}},w=[`Default`,`WithText`,`WithMultipleElements`,`FixedTitleWidth`,`CssCustomization`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Link>Document.docx</Link>
  },
  parameters: {
    docs: {
      description: {
        story: "A file name as a link, the way a tile usually shows it. Click it to see \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TileContent>
  <Link>Document.docx</Link>
</TileContent>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Text fontSize="14px" fontWeight={600}>
        My Document
      </Text>
  },
  parameters: {
    docs: {
      description: {
        story: "A name that should not look clickable, for an item the reader cannot open: plain \`Text\` in place of a link."
      },
      source: {
        code: \`<TileContent>
  <Text fontSize="14px" fontWeight={600}>My Document</Text>
</TileContent>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}>
        <Link>Document.docx</Link>
        <Badge label="New" backgroundColor="#4781D1" color="#fff" />
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "A name with a badge beside it. The slot takes one element, so the name and the badge go inside a wrapper of your own."
      },
      source: {
        code: \`<TileContent>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Link>Document.docx</Link>
    <Badge label="New" backgroundColor="#4781D1" color="#fff" />
  </div>
</TileContent>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Text containerWidth="120px" truncate>
        Quarterly report with a long name.docx
      </Text>
  },
  parameters: {
    docs: {
      description: {
        story: "A name held to a set width whatever room the tile has, so the names in a grid end at the same point: the slot takes its width from the child's own \`containerWidth\` prop, and \`truncate\` on the \`Text\` cuts the rest off."
      },
      source: {
        code: \`<TileContent>
  <Text containerWidth="120px" truncate>
    Quarterly report with a long name.docx
  </Text>
</TileContent>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  // This decorator wraps the meta one, so the variables reach the BaseTile around the slot.
  decorators: [Story => <div style={{
    "--tile-bg": "#e6f3fb",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6"
  } as CSSProperties}>
        <Story />
      </div>],
  args: {
    children: <Link>Document.docx</Link>
  },
  parameters: {
    docs: {
      description: {
        story: \`TileContent reads no variables of its own -- the tile's variables it sits in are listed under CSS variables on the BaseTile, FileTile, FolderTile and RoomTile pages. This example sets four of the BaseTile ones on a wrapper; hover the tile to see the hover background.\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}}})))()}T();export{C as CssCustomization,y as Default,S as FixedTitleWidth,x as WithMultipleElements,b as WithText,w as __namedExportsOrder,v as default};