import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,n as i,o as a,t as o}from"./Scrollbar-Tkb6Sv30.js";import{i as s,n as c,r as l,t as u}from"./TableBody-BXi4vyQf.js";import{n as d,t as f}from"./TableCell-7C_VA9gK.js";import{n as p,t as m}from"./TableRow-JzNOco51.js";var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{h=t(),r(),c(),p(),d(),i(),s(),g=n(),_=`storybook-table-body-column-storage`,v=`storybook-table-body-info-panel-storage`,y={title:`UI/Table/TableBody`,component:u,tags:[`!autodocs`],parameters:{docs:{description:{component:`TableBody holds the rows of a table and, for a long list, renders only the rows in view and asks for the next page as the user scrolls.

The Table README describes it in full.`}}},argTypes:{useReactWindow:{control:`boolean`,description:`Mounts only the rows near the visible part of the page and loads more on scroll; when off, every row is rendered at once`,table:{defaultValue:{summary:`true`}}},itemHeight:{control:`number`,description:`Height of every row in pixels when the rows are virtualised`,table:{defaultValue:{summary:`41`}}},itemCount:{control:`number`,description:`How many rows there are in total, loaded or not`},filesLength:{control:`number`,description:"How many rows are loaded; rows past this index are drawn as placeholders while `hasMoreFiles` is set"},hasMoreFiles:{control:`boolean`,description:"Adds two placeholder rows after the loaded ones and asks `fetchMoreFiles` for more when they come into view"},infoPanelVisible:{control:`boolean`,description:"Lays the virtualised rows out with the column widths saved under `columnInfoPanelStorageName` instead of `columnStorageName`",table:{defaultValue:{summary:`false`}}},columnStorageName:{control:`text`,description:"`localStorage` key the header saved the column widths under; without it the body renders nothing"},columnInfoPanelStorageName:{control:`text`,description:"`localStorage` key of the column widths used while an info panel is open; without it the body renders nothing"},isIndexEditingMode:{control:`boolean`,description:`Accepted for the rows being reordered, but has no effect`},fetchMoreFiles:{control:!1,action:`fetchMoreFiles`,description:`Called with the start and stop index of the rows to load when placeholder rows scroll into view`},onScroll:{control:!1,action:`onScroll`,description:`Called as the page scrolls, only while the rows are virtualised`},children:{control:!1,description:`The rows, as an array with one element per row`}},decorators:[(e,t)=>{let n=(0,h.useRef)(null),[r,i]=(0,h.useState)(!1),[a,s]=(0,h.useState)(0);return(0,h.useEffect)(()=>{r||i(!0)},[r,i]),(0,h.useEffect)(()=>{if(r){let e=document.querySelectorAll(`.table-container_row`).length;s(e)}},[r]),(0,g.jsxs)(`div`,{children:[(0,g.jsx)(`div`,{style:{marginBottom:`20px`,fontSize:`14px`},children:(0,g.jsxs)(`p`,{children:[(0,g.jsx)(`strong`,{children:`Note:`}),` TableBody component for displaying table rows with support for infinite scrolling and virtual scrolling using react-window.`]})}),(0,g.jsx)(o,{id:`sectionScroll`,style:{height:`400px`},autoHide:!1,children:(0,g.jsx)(`div`,{style:{paddingTop:`20px`,width:`98%`},children:(0,g.jsx)(l,{forwardedRef:n,useReactWindow:t.args.useReactWindow,children:r?(0,g.jsx)(e,{}):null})})}),(0,g.jsxs)(`div`,{style:{marginTop:`20px`,fontSize:`16px`},children:[(0,g.jsxs)(`div`,{children:[`useReactWindow: `,t.args.useReactWindow.toString()]}),(0,g.jsxs)(`div`,{children:[`Rendered rows: `,a,`/`,t.args.itemCount]})]})]})}]},b=e=>Array(e).fill(null).map((e,t)=>(0,g.jsxs)(m,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr 1fr 24px`},children:[(0,g.jsx)(f,{children:`Cell ${t+1}-1`}),(0,g.jsx)(f,{children:`Cell ${t+1}-2`}),(0,g.jsx)(f,{children:`Cell ${t+1}-3`})]},a())),x={render:e=>(0,g.jsx)(u,{...e}),args:{columnStorageName:_,columnInfoPanelStorageName:v,fetchMoreFiles:async()=>{},filesLength:20,hasMoreFiles:!1,itemCount:20,itemHeight:50,useReactWindow:!0,infoPanelVisible:!1,children:b(20)},parameters:{docs:{description:{story:`Twenty rows through the virtualised body, the mode for a list that can grow long: scroll the frame and only the rows near the view stay mounted, as the counter below it shows.`},source:{code:`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>`}}}},S={render:e=>(0,g.jsx)(u,{...e}),args:{...x.args,useReactWindow:!1},parameters:{docs:{description:{story:"The same twenty rows rendered all at once (`useReactWindow` off), which is simpler and enough for a short list that never pages."},source:{code:`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow={false}
>
  {rows}
</TableBody>`}}}},C={render:e=>(0,g.jsx)(u,{...e}),args:{...x.args,children:b(5),filesLength:5,itemCount:5,hasMoreFiles:!0},parameters:{docs:{description:{story:"Five loaded rows followed by two placeholder rows, what the user sees while the next page is on its way (`hasMoreFiles`); `fetchMoreFiles` is called as the placeholders come into view."},source:{code:`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={5}
  hasMoreFiles
  itemCount={5}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>`}}}},w=[`Default`,`WithoutReactWindow`,`WithMoreFiles`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <TableBody {...args} />,
  args: {
    columnStorageName: COLUMN_STORAGE_NAME,
    columnInfoPanelStorageName: COLUMN_INFO_PANEL_STORAGE_NAME,
    fetchMoreFiles: async () => {},
    filesLength: 20,
    hasMoreFiles: false,
    itemCount: 20,
    itemHeight: 50,
    useReactWindow: true,
    infoPanelVisible: false,
    children: createMockRows(20)
  },
  parameters: {
    docs: {
      description: {
        story: "Twenty rows through the virtualised body, the mode for a list that can grow long: scroll the frame and only the rows near the view stay mounted, as the counter below it shows."
      },
      source: {
        code: \`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <TableBody {...args} />,
  args: {
    ...Default.args,
    useReactWindow: false
  },
  parameters: {
    docs: {
      description: {
        story: "The same twenty rows rendered all at once (\`useReactWindow\` off), which is simpler and enough for a short list that never pages."
      },
      source: {
        code: \`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={20}
  hasMoreFiles={false}
  itemCount={20}
  itemHeight={50}
  useReactWindow={false}
>
  {rows}
</TableBody>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <TableBody {...args} />,
  args: {
    ...Default.args,
    children: createMockRows(5),
    filesLength: 5,
    itemCount: 5,
    hasMoreFiles: true
  },
  parameters: {
    docs: {
      description: {
        story: "Five loaded rows followed by two placeholder rows, what the user sees while the next page is on its way (\`hasMoreFiles\`); \`fetchMoreFiles\` is called as the placeholders come into view."
      },
      source: {
        code: \`<TableBody
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  fetchMoreFiles={fetchMore}
  filesLength={5}
  hasMoreFiles
  itemCount={5}
  itemHeight={50}
  useReactWindow
>
  {rows}
</TableBody>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}}})))()}T();export{x as Default,C as WithMoreFiles,S as WithoutReactWindow,w as __namedExportsOrder,y as default};