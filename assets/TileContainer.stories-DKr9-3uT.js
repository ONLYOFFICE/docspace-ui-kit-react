import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./link-C_nB54e7.js";import{S as i,c as a}from"./enums-DzcBu485.js";import{n as o,t as s}from"./folder-DBjybTp0.js";import{i as c,n as l,r as u,t as d}from"./slide-fXP1CF-q.js";import{n as f,t as p}from"./word-kWuzOL5c.js";import{n as m,t as h}from"./empty.rooms.root.light-B0T7L2ed.js";import{n as g,t as _}from"./file-tile-CgQ6PwKb.js";import{n as v,t as y}from"./tile-container-ClDBMR-F.js";import{n as b,t as x}from"./tile-content-BziW1hzz.js";import{n as S,t as C}from"./folder-tile-Bgi_NO_6.js";var w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{f(),c(),l(),m(),v(),b(),i(),n(),g(),S(),o(),w=t(),T=(0,w.jsx)(p,{}),E=(0,w.jsx)(u,{}),D=(0,w.jsx)(d,{}),O=[{id:`1`,title:`Document.docx`,fileExst:`.docx`,fileType:a.Document},{id:`2`,title:`Presentation.pptx`,fileExst:`.pptx`,fileType:a.Presentation},{id:`3`,title:`Spreadsheet.xlsx`,fileExst:`.xlsx`,fileType:a.Spreadsheet}],k=[{id:`f1`,title:`Projects`,isFolder:!0},{id:`f2`,title:`Archive`,isFolder:!0}],A=[{key:`edit`,label:`Edit`},{key:`delete`,label:`Delete`}],j={title:`UI/Tiles/TileContainer`,component:y,parameters:{},argTypes:{children:{control:!1,description:"The tiles; each must carry an `item` prop, which decides its group. A child without one, plain markup included, is not shown"},headingFolders:{control:`text`,description:`Heading above the folders; shown only when there is at least one folder`},headingFiles:{control:`text`,description:`Heading above the files; shown only when there is at least one file`},useReactWindow:{control:`boolean`,description:"Hands the sorted tiles to `infiniteGrid` instead of wrapping each group in a grid of its own; without an `infiniteGrid` the tiles are left with no grid at all",table:{defaultValue:{summary:`false`}}},infiniteGrid:{control:!1,description:`The host's virtualising grid, which receives all the tiles and whether the listing holds rooms or templates`},noSelect:{control:`boolean`,description:`Stops the reader selecting text anywhere in the grid`,table:{defaultValue:{summary:`false`}}},isDesc:{control:`boolean`,description:`Adds a class to both headings for a descending sort; no style of the kit reads it, so nothing changes on screen`,table:{defaultValue:{summary:`false`}}},id:{control:`text`,description:"Value of `id` on the outer element",table:{defaultValue:{summary:`"tileContainer"`}}},className:{control:`text`,description:`Class added to the outer element`},style:{control:`object`,description:`Inline style of the outer element`}}},M=e=>(0,w.jsx)(y,{...e,children:O.map(e=>(0,w.jsx)(_,{item:e,contextOptions:A,temporaryIcon:(0,w.jsx)(h,{}),element:e.fileType===a.Spreadsheet?D:e.fileType===a.Presentation?E:T,children:(0,w.jsx)(x,{children:(0,w.jsx)(r,{children:e.title})})},e.id))}),N={render:e=>(0,w.jsx)(M,{...e}),args:{useReactWindow:!1,headingFiles:`Files`},parameters:{docs:{description:{story:`Three documents under the files heading, in as many columns as the window has room for; resize the window to see the columns change, and change any other prop live in the Controls panel below.`},source:{code:`<TileContainer useReactWindow={false} headingFiles="Files">
  <FileTile item={file1} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={file2} element={<PdfSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FileTile item={file3} element={<SlideSvgUrl />} contextOptions={options}>
    <TileContent><Link>Spreadsheet.xlsx</Link></TileContent>
  </FileTile>
</TileContainer>`}}}},P={render:e=>(0,w.jsxs)(y,{...e,children:[O.slice(0,2).map(e=>(0,w.jsx)(_,{item:e,contextOptions:A,temporaryIcon:(0,w.jsx)(h,{}),element:T,children:(0,w.jsx)(x,{children:(0,w.jsx)(r,{children:e.title})})},e.id)),k.map(e=>(0,w.jsx)(C,{item:e,contextOptions:A,element:(0,w.jsx)(s,{}),children:(0,w.jsx)(x,{children:(0,w.jsx)(r,{children:e.title})})},e.id))]}),args:{headingFolders:`Folders`,headingFiles:`Files`},parameters:{docs:{description:{story:"A listing that holds both kinds, passed in with the files first: the grid still puts the folders on top, each group under its own heading (`headingFolders`, `headingFiles`), because it sorts by each tile's `item`, not by the order of the children."},source:{code:`<TileContainer headingFolders="Folders" headingFiles="Files">
  <FileTile item={{ id: "1", title: "Document.docx", fileExst: ".docx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={{ id: "2", title: "Presentation.pptx", fileExst: ".pptx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FolderTile item={{ id: "f1", title: "Projects", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>
  <FolderTile item={{ id: "f2", title: "Archive", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Archive</Link></TileContent>
  </FolderTile>
</TileContainer>`}}}},F={render:()=>(0,w.jsx)(`div`,{style:{"--tile-bg":`#f4f9fd`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`,"--tile-container-gap":`32px`},children:(0,w.jsx)(y,{useReactWindow:!1,headingFiles:`Files`,children:O.map(e=>(0,w.jsx)(_,{item:e,contextOptions:A,temporaryIcon:(0,w.jsx)(h,{}),element:e.fileType===a.Spreadsheet?D:e.fileType===a.Presentation?E:T,children:(0,w.jsx)(x,{children:(0,w.jsx)(r,{children:e.title})})},e.id))})}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. One grid of three files sets the gap and four of the tiles' variables; hover a tile for `--tile-hover-bg`. The container's own variable is the gap; the others are the tiles' and are set here once for the whole grid."},source:{code:`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-container-gap": "32px",
}}>
  <TileContainer headingFiles="Files">
    {files.map((file) => (
      <FileTile key={file.id} item={file} element={<WordIcon />} contextOptions={options}>
        <TileContent><Link>{file.title}</Link></TileContent>
      </FileTile>
    ))}
  </TileContainer>
</div>`}}}},I=[`Default`,`FoldersAndFiles`,`CssCustomization`],N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <ContainerTemplate {...args} />,
  args: {
    useReactWindow: false,
    headingFiles: "Files"
  },
  parameters: {
    docs: {
      description: {
        story: "Three documents under the files heading, in as many columns as the window has room for; resize the window to see the columns change, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TileContainer useReactWindow={false} headingFiles="Files">
  <FileTile item={file1} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={file2} element={<PdfSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FileTile item={file3} element={<SlideSvgUrl />} contextOptions={options}>
    <TileContent><Link>Spreadsheet.xlsx</Link></TileContent>
  </FileTile>
</TileContainer>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <TileContainer {...args}>
      {mockFiles.slice(0, 2).map(file => <FileTile key={file.id} item={file} contextOptions={mockContextOptions} temporaryIcon={<ImageReactSvg />} element={wordElement}>
          <TileContent>
            <Link>{file.title}</Link>
          </TileContent>
        </FileTile>)}
      {mockFolders.map(folder => <FolderTile key={folder.id} item={folder} contextOptions={mockContextOptions} element={<Folder32ReactSvg />}>
          <TileContent>
            <Link>{folder.title}</Link>
          </TileContent>
        </FolderTile>)}
    </TileContainer>,
  args: {
    headingFolders: "Folders",
    headingFiles: "Files"
  },
  parameters: {
    docs: {
      description: {
        story: "A listing that holds both kinds, passed in with the files first: the grid still puts the folders on top, each group under its own heading (\`headingFolders\`, \`headingFiles\`), because it sorts by each tile's \`item\`, not by the order of the children."
      },
      source: {
        code: \`<TileContainer headingFolders="Folders" headingFiles="Files">
  <FileTile item={{ id: "1", title: "Document.docx", fileExst: ".docx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={{ id: "2", title: "Presentation.pptx", fileExst: ".pptx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FolderTile item={{ id: "f1", title: "Projects", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>
  <FolderTile item={{ id: "f2", title: "Archive", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Archive</Link></TileContent>
  </FolderTile>
</TileContainer>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#f4f9fd",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-container-gap": "32px"
  } as CSSProperties}>
      <TileContainer useReactWindow={false} headingFiles="Files">
        {mockFiles.map(file => <FileTile key={file.id} item={file} contextOptions={mockContextOptions} temporaryIcon={<ImageReactSvg />} element={file.fileType === FileType.Spreadsheet ? slideElement : file.fileType === FileType.Presentation ? pdfElement : wordElement}>
            <TileContent>
              <Link>{file.title}</Link>
            </TileContent>
          </FileTile>)}
      </TileContainer>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. One grid of three files sets the gap and four of the tiles' variables; hover a tile for \\\`--tile-hover-bg\\\`. The container's own variable is the gap; the others are the tiles' and are set here once for the whole grid.\`
      },
      source: {
        code: \`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-container-gap": "32px",
}}>
  <TileContainer headingFiles="Files">
    {files.map((file) => (
      <FileTile key={file.id} item={file} element={<WordIcon />} contextOptions={options}>
        <TileContent><Link>{file.title}</Link></TileContent>
      </FileTile>
    ))}
  </TileContainer>
</div>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}}})))()}L();export{F as CssCustomization,N as Default,P as FoldersAndFiles,I as __namedExportsOrder,j as default};