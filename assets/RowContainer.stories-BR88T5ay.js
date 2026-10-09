import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{r as i,t as a}from"./text-Cz_cI6Yf.js";import{n as o,t as s}from"./common-icons-style-Dik-NKVV.js";import{n as c,t as l}from"./Scrollbar-Tkb6Sv30.js";import{n as u,t as d}from"./catalog.folder.react-BLNaFnHq.js";import{n as f,t as p}from"./row-Dfhw8hpY.js";import{n as m,t as h}from"./row-content-DmK_ooH1.js";import{n as g,t as _}from"./row-container-Cd-0-hAF.js";var v,y;function b(){return(b=e((()=>{v=`_catalogFolderIcon_r6pwg_1`,y={catalogFolderIcon:v}})))()}var x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{x=t(n()),u(),o(),f(),m(),c(),i(),g(),b(),S=r(),{fn:C}=__STORYBOOK_MODULE_TEST__,w={title:`UI/Rows/RowContainer`,component:_,parameters:{},argTypes:{children:{control:!1,description:`The rows, as an array with one entry per row`},useReactWindow:{control:`boolean`,description:`Whether only the rows in view are mounted and the rest paged in as the user scrolls. It needs the page section's scroll container around it; turn it off for a short list`,table:{defaultValue:{summary:`true`}}},itemHeight:{control:`number`,description:`Height of every row in pixels while the list is virtualised; a taller row is cut off`,table:{defaultValue:{summary:`50`}}},manualHeight:{control:`text`,description:`Height of the list as a CSS length while it is virtualised; without it the list is as tall as its parent, which then needs a height of its own`},itemCount:{control:`number`,description:`How many rows there are in total, loaded or not; read only while the list is virtualised`},filesLength:{control:`number`,description:`How many rows are loaded so far; read only while the list is virtualised`},hasMoreFiles:{control:`boolean`,description:`Whether there is another range of rows to ask for; read only while the list is virtualised`},fetchMoreFiles:{control:!1,description:`Called with the start and stop index of the rows to load when the user scrolls near the end of the loaded ones; it returns a promise`},onScroll:{control:!1,description:`Called as the virtualised list scrolls`},noSelect:{control:`boolean`,description:`Stops the user from selecting the text of the rows, which is allowed by default`},id:{control:`text`,description:"Id of the list element. The virtualised list finds itself by the id `rowContainer` to measure its width, so another id, or a second list on the page, leaves its rows with no width",table:{defaultValue:{summary:`"rowContainer"`}}},className:{control:`text`,description:`Class added to the list element`},style:{control:`object`,description:`Inline style applied to the list element`}}},T=Array.from({length:20},(e,t)=>({id:`file-${t+1}`,title:`Document ${t+1}.docx`,size:`${t%9+1} KB`})),E=[{key:`open`,label:`Open`},{key:`rename`,label:`Rename`},{key:`delete`,label:`Delete`}],D=e=>(0,S.jsx)(p,{checked:!1,element:(0,S.jsx)(d,{className:y.catalogFolderIcon,"data-size":s.big}),contextOptions:E,children:(0,S.jsxs)(h,{children:[(0,S.jsx)(a,{fontSize:`15px`,fontWeight:600,truncate:!0,children:e.title}),(0,S.jsx)(`span`,{}),(0,S.jsx)(a,{children:`Modified today`}),(0,S.jsx)(a,{children:e.size})]})},e.id),O=e=>(0,S.jsx)(_,{...e,children:T.map(D)}),k={render:e=>(0,S.jsx)(O,{...e}),args:{useReactWindow:!1,children:[]},parameters:{docs:{description:{story:"A short list of twenty files rendered as it is, with virtualisation off (`useReactWindow`), which is how the list works on a page that has no portal section around it. Select the text of a row to see that selection is allowed; change any other prop live in the Controls panel below."},source:{code:`<RowContainer useReactWindow={false}>
  {files.map((file) => (
    <Row key={file.id} checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
      <RowContent>
        <Text fontSize="15px" fontWeight={600} truncate>{file.title}</Text>
        <span />
        <Text>Modified today</Text>
        <Text>{file.size}</Text>
      </RowContent>
    </Row>
  ))}
</RowContainer>`}}}},A={render:e=>(0,S.jsx)(O,{...e}),args:{useReactWindow:!1,noSelect:!0,children:[]},parameters:{docs:{description:{story:"A list whose rows are picked with clicks and drags rather than read and copied: dragging across a title selects no text (`noSelect`)."},source:{code:`<RowContainer useReactWindow={false} noSelect>
  {rows}
</RowContainer>`}}}},j=({children:e})=>(0,S.jsx)(`div`,{style:{height:`300px`,position:`relative`},id:`sectionScroll`,children:(0,S.jsx)(l,{children:e})}),M=100,N=20,P=e=>{let[t,n]=(0,x.useState)(N),[,r]=(0,x.useState)(!1);(0,x.useEffect)(()=>{r(!0)},[]);let i=async t=>{await e.fetchMoreFiles?.(t),await new Promise(e=>{setTimeout(e,500)}),n(e=>Math.min(M,e+N))},a=Array.from({length:t},(e,t)=>D({id:`file-${t+1}`,title:`Document ${t+1}.docx`,size:`${t%9+1} KB`}));return(0,S.jsx)(j,{children:(0,S.jsx)(_,{...e,itemCount:M,filesLength:t,hasMoreFiles:t<M,fetchMoreFiles:i,children:a})})},F={render:e=>(0,S.jsx)(P,{...e}),args:{useReactWindow:!0,itemHeight:56,fetchMoreFiles:C(),onScroll:C(),children:[]},parameters:{noPadding:!0,docs:{description:{story:"A list of a hundred files of which twenty are loaded: scroll the box and only the rows in view are mounted, each 56px high (`itemHeight`). Near the end of the loaded rows the list asks for the next range (`fetchMoreFiles`, logged in the Actions panel) and shows skeleton rows until it arrives half a second later."},source:{code:`<div id="sectionScroll" style={{ height: 300 }}>
  <Scrollbar>
    <RowContainer
      itemHeight={56}
      itemCount={100}
      filesLength={rows.length}
      hasMoreFiles={rows.length < 100}
      fetchMoreFiles={loadMore}
      onScroll={handleScroll}
    >
      {rows}
    </RowContainer>
  </Scrollbar>
</div>`},story:{inline:!1,height:`326px`}}}},I=[`Default`,`NoTextSelection`,`Virtualised`],k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    useReactWindow: false,
    children: []
  },
  parameters: {
    docs: {
      description: {
        story: "A short list of twenty files rendered as it is, with virtualisation off (\`useReactWindow\`), which is how the list works on a page that has no portal section around it. Select the text of a row to see that selection is allowed; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RowContainer useReactWindow={false}>
  {files.map((file) => (
    <Row key={file.id} checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
      <RowContent>
        <Text fontSize="15px" fontWeight={600} truncate>{file.title}</Text>
        <span />
        <Text>Modified today</Text>
        <Text>{file.size}</Text>
      </RowContent>
    </Row>
  ))}
</RowContainer>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    useReactWindow: false,
    noSelect: true,
    children: []
  },
  parameters: {
    docs: {
      description: {
        story: "A list whose rows are picked with clicks and drags rather than read and copied: dragging across a title selects no text (\`noSelect\`)."
      },
      source: {
        code: \`<RowContainer useReactWindow={false} noSelect>
  {rows}
</RowContainer>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <VirtualisedTemplate {...args} />,
  args: {
    useReactWindow: true,
    itemHeight: 56,
    fetchMoreFiles: fn(),
    onScroll: fn(),
    children: []
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "A list of a hundred files of which twenty are loaded: scroll the box and only the rows in view are mounted, each 56px high (\`itemHeight\`). Near the end of the loaded rows the list asks for the next range (\`fetchMoreFiles\`, logged in the Actions panel) and shows skeleton rows until it arrives half a second later."
      },
      source: {
        code: \`<div id="sectionScroll" style={{ height: 300 }}>
  <Scrollbar>
    <RowContainer
      itemHeight={56}
      itemCount={100}
      filesLength={rows.length}
      hasMoreFiles={rows.length < 100}
      fetchMoreFiles={loadMore}
      onScroll={handleScroll}
    >
      {rows}
    </RowContainer>
  </Scrollbar>
</div>\`
      },
      // Framed: the virtual list measures the first #rowContainer on the page
      story: {
        inline: false,
        height: "326px"
      }
    }
  }
}`,...F.parameters?.docs?.source}}}})))()}L();export{k as Default,A as NoTextSelection,F as Virtualised,I as __namedExportsOrder,w as default};