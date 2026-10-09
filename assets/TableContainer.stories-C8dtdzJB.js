import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,n as i,o as a,t as o}from"./Scrollbar-Tkb6Sv30.js";import{S as s,v as c}from"./enums-DzcBu485.js";import{i as l,n as u,r as d,t as f}from"./TableBody-BXi4vyQf.js";import{n as p,t as m}from"./TableCell-7C_VA9gK.js";import{n as h,t as g}from"./TableRow-JzNOco51.js";import{n as _,t as v}from"./TableHeader-CXsmwfmK.js";var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{y=t(),r(),l(),i(),h(),p(),_(),s(),u(),b=n(),x=`storybook-table-container-column-storage`,S=`storybook-table-container-info-panel-storage`,C=[{key:`Column 1`,title:`Column 1`,resizable:!0,enable:!0,default:!0,sortBy:c.Name,minWidth:210,onChange:()=>{},onClick:()=>{}},{key:`Column 2`,title:`Column 2`,enable:!0,resizable:!0,sortBy:c.Type,onChange:()=>{},onClick:()=>{}},{key:`Column 3`,title:`Column 3`,enable:!0,resizable:!0,sortBy:c.Tags,withTagRef:!0,onChange:()=>{},onClick:()=>{}}],w=e=>Array.from({length:e},(e,t)=>(0,b.jsxs)(g,{children:[(0,b.jsx)(m,{children:`Cell ${t+1}-1`}),(0,b.jsx)(m,{children:`Cell ${t+1}-2`}),(0,b.jsx)(m,{children:`Cell ${t+1}-3`})]},a())),T=e=>{let{useReactWindow:t}=e,n=(0,y.useRef)(null);return(0,b.jsxs)(d,{...e,forwardedRef:n,children:[(0,b.jsx)(v,{containerRef:n,columns:C,columnStorageName:x,columnInfoPanelStorageName:S,sectionWidth:800,useReactWindow:t,showSettings:!0,sortingVisible:!0,sorted:!0}),(0,b.jsx)(f,{columnStorageName:x,columnInfoPanelStorageName:S,fetchMoreFiles:async()=>{},filesLength:10,hasMoreFiles:!1,itemCount:10,itemHeight:50,useReactWindow:t,children:w(10)})]})},E={title:`UI/Table/TableContainer`,component:T,tags:[`!autodocs`],parameters:{docs:{description:{component:`TableContainer is the outer element of a table, the grid that the header, the group menu and the rows are laid out in.

The Table README describes it in full.`}}},argTypes:{useReactWindow:{control:`boolean`,description:`Makes the container a full-height block instead of a grid; set it together with the same prop on the header and the body when the rows are virtualised`},noSelect:{control:`boolean`,description:`Stops the user selecting text anywhere inside the table`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class applied to the container after the component's own`},forwardedRef:{control:!1,description:"Ref of the container element; pass the same ref to the header as `containerRef`"},children:{control:!1,description:`The header, the group menu and the body`}},decorators:[e=>(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`div`,{style:{marginBottom:`20px`,fontSize:`14px`},children:(0,b.jsxs)(`p`,{children:[(0,b.jsx)(`strong`,{children:`Note:`}),` TableContainer is a wrapper for table elements (header, body, rows, cells). When used with react-window, it sets specific styles to properly contain virtualized content.`]})}),(0,b.jsx)(`div`,{style:{position:`relative`},children:(0,b.jsx)(o,{id:`sectionScroll`,style:{height:`400px`},autoHide:!1,children:(0,b.jsx)(`div`,{style:{marginTop:`25px`},children:(0,b.jsx)(e,{})})})})]})]},D={render:e=>(0,b.jsx)(T,{...e}),args:{useReactWindow:!1},parameters:{docs:{description:{story:"A complete table of ten rows under a sortable header, the usual way the parts are put together: the container holds the grid, the header sizes its columns. Turn on `useReactWindow` in the Controls panel below to render the same rows through the virtualised body."},source:{code:`const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={800}
    useReactWindow={false}
    showSettings
    sortingVisible
    sorted
  />
  <TableBody
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    fetchMoreFiles={fetchMore}
    filesLength={10}
    hasMoreFiles={false}
    itemCount={10}
    itemHeight={50}
    useReactWindow={false}
  >
    {rows}
  </TableBody>
</TableContainer>`}}}},O=[`Default`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <TableContainerWrapper {...args} />,
  args: {
    useReactWindow: false
  },
  parameters: {
    docs: {
      description: {
        story: "A complete table of ten rows under a sortable header, the usual way the parts are put together: the container holds the grid, the header sizes its columns. Turn on \`useReactWindow\` in the Controls panel below to render the same rows through the virtualised body."
      },
      source: {
        code: \`const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={800}
    useReactWindow={false}
    showSettings
    sortingVisible
    sorted
  />
  <TableBody
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    fetchMoreFiles={fetchMore}
    filesLength={10}
    hasMoreFiles={false}
    itemCount={10}
    itemHeight={50}
    useReactWindow={false}
  >
    {rows}
  </TableBody>
</TableContainer>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}}})))()}k();export{D as Default,O as __namedExportsOrder,E as default};