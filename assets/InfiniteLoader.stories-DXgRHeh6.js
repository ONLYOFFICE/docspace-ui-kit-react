import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./Scrollbar-Tkb6Sv30.js";import{n as a,t as o}from"./InfiniteLoader-w7nBvfp-.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{s=t(),r(),a(),c=n(),{fn:l}=__STORYBOOK_MODULE_TEST__,u=(e,t=0)=>Array(e).fill(null).map((e,n)=>(0,c.jsxs)(`div`,{style:{padding:`8px`,border:`1px solid #eee`,margin:`4px`,borderRadius:`4px`},children:[`Item `,t+n+1]},`item-${t+n}`)),d=({children:e})=>(0,c.jsx)(`div`,{style:{height:`300px`,position:`relative`},id:`sectionScroll`,children:(0,c.jsx)(i,{children:(0,c.jsx)(`div`,{id:`tileContainer`,style:{width:`100%`},children:(0,c.jsx)(`div`,{id:`rowContainer`,children:(0,c.jsx)(`div`,{id:`table-container`,children:e})})})})}),f=({viewAs:e=`tile`,itemCount:t=100,itemSize:n=20,countTilesInRow:r=4,isLoading:i=!1,infoPanelVisible:a,hasMoreFiles:l,columnStorageName:d,columnInfoPanelStorageName:f,loadMoreItems:p,onScroll:m,renderItem:h}={})=>{let g=(e,t)=>h?Array.from({length:e},(e,n)=>h(t+n)):u(e,t),[_,v]=(0,s.useState)(g(20,0)),[y]=(0,s.useState)(t),[b,x]=(0,s.useState)(20),[S,C]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{if(!S){C(!0);let e=document.querySelector(`#sectionScroll .scroll-wrapper > .scroller`);if(e){let t=new Event(`scroll`,{bubbles:!0});e.dispatchEvent(t)}}},[S]),(0,c.jsx)(o,{viewAs:e,itemCount:y,filesLength:b,hasMoreFiles:l??b<y,loadMoreItems:async({startIndex:e,stopIndex:t})=>{p?.({startIndex:e,stopIndex:t}),await new Promise(e=>{setTimeout(e,500)});let n=t-e+1,r=g(n,b);v(e=>[...e,...r]),x(e=>e+n)},itemSize:n,countTilesInRow:r,isLoading:i,infoPanelVisible:a,columnStorageName:d,columnInfoPanelStorageName:f,onScroll:m,children:_})},p={title:`UI/Status components/InfiniteLoader`,component:o,parameters:{},decorators:[e=>(0,c.jsx)(d,{children:(0,c.jsx)(e,{})})],argTypes:{viewAs:{control:`select`,options:[`row`,`tile`,`table`],description:"Which layout to render: `tile` lays the children out as rows of a grid, `row` and `table` as a list; it also picks the placeholder shown for rows not loaded yet"},hasMoreFiles:{control:`boolean`,description:`Whether there is another page to ask for; while false, every row counts as loaded and no placeholder is shown`},filesLength:{control:`number`,description:`How many items are loaded so far`},itemCount:{control:`number`,description:`How many items there are in total, loaded or not`},loadMoreItems:{control:!1,description:`Called with the start and stop index of the items to load when the user scrolls near the end of the loaded ones; it returns a promise`},itemSize:{control:`number`,description:"Height of every row in pixels in the `row` and `table` layouts; the `tile` layout ignores it and sizes each row from the tile it holds"},children:{control:!1,description:`The items, as an array with one entry per list row, table row or row of tiles`},onScroll:{control:!1,description:`Called as the list scrolls`},isLoading:{control:`boolean`,description:`Renders nothing at all while true`,table:{defaultValue:{summary:`false`}}},countTilesInRow:{control:`number`,description:"How many tiles one row of the `tile` layout holds; it decides which rows count as loaded and how many skeleton tiles a row shows during a long scroll jump",table:{defaultValue:{summary:`1`}}},columnStorageName:{control:`text`,description:"`localStorage` key holding the table's column widths; required in the `table` layout, which throws without it"},columnInfoPanelStorageName:{control:`text`,description:"`localStorage` key holding the table's column widths while the info panel is open; required in the `table` layout"},infoPanelVisible:{control:`boolean`,description:`Reads the table's column widths from the info-panel key instead of the regular one`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class added to the list element`},currentFolderId:{control:`text`,description:"Identifier of the folder being shown; when it changes, the `tile` layout measures its row heights again"},showSkeleton:{control:!1,description:`Ignored; the loader sets it itself after a scroll jump of more than 800px`},smallPreview:{control:!1,description:`Declared, but no layout reads it`},isOneTile:{control:!1,description:`Declared, but no layout reads it`}}},m={args:{viewAs:`tile`,itemCount:100,itemSize:20,countTilesInRow:4,isLoading:!1,infoPanelVisible:!1,hasMoreFiles:!0,loadMoreItems:l(),onScroll:l()},render:e=>(0,c.jsx)(f,{...e}),parameters:{docs:{description:{story:"Scroll the box: when the end of the loaded items comes near, the loader asks for the next range, and the new items arrive half a second later (`loadMoreItems`, logged in the Actions panel). In the `tile` layout each child is one row of the grid; here a plain box stands in for a row of tiles. Change any other prop live in the Controls panel below."},source:{code:`<InfiniteLoaderComponent
  viewAs="tile"
  itemCount={100}
  filesLength={20}
  hasMoreFiles={true}
  loadMoreItems={handleLoadMore}
  itemSize={20}
  countTilesInRow={4}
  isLoading={false}
>
  {items}
</InfiniteLoaderComponent>`}}}},h=e=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`div`,{style:{padding:`12px 8px`},children:[`Document `,e+1]}),(0,c.jsx)(`div`,{style:{padding:`12px 8px`},children:`Today`}),(0,c.jsxs)(`div`,{style:{padding:`12px 8px`},children:[e%9+1,` KB`]})]}),g=`storybook-infinite-loader-columns`,_=()=>{try{localStorage.setItem(g,`2fr 1fr 1fr`)}catch{}},v={args:{viewAs:`row`,itemCount:100,itemSize:48,hasMoreFiles:!0,loadMoreItems:l()},render:e=>(0,c.jsx)(f,{...e}),parameters:{docs:{description:{story:'A list of rows of one height (`viewAs="row"`, `itemSize`). Scroll to the end: the rows after the last loaded item are skeleton rows until the next page arrives, and a jump of more than 800px, such as dragging the scrollbar, turns every row in view into a skeleton while the scrolling lasts.'},source:{code:`<InfiniteLoaderComponent
  viewAs="row"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
>
  {items}
</InfiniteLoaderComponent>`}}}},y={args:{viewAs:`table`,itemCount:100,itemSize:48,hasMoreFiles:!0,columnStorageName:g,columnInfoPanelStorageName:g,loadMoreItems:l()},render:e=>(_(),(0,c.jsx)(f,{...e,renderItem:h})),parameters:{docs:{description:{story:'A table whose rows share one column layout (`viewAs="table"`). The layout is not passed as a prop: the loader reads it from `localStorage` under the key it is given (`columnStorageName`, or `columnInfoPanelStorageName` while `infoPanelVisible` is set), which lets the table header that saves the widths and the rows below stay in step. The rows not loaded yet show the table skeleton.'},source:{code:`localStorage.setItem("filesColumns", "2fr 1fr 1fr");

<InfiniteLoaderComponent
  viewAs="table"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
  columnStorageName="filesColumns"
  columnInfoPanelStorageName="filesColumnsInfoPanel"
>
  {rows.map((file) => (
    <>
      <div>{file.title}</div>
      <div>{file.modified}</div>
      <div>{file.size}</div>
    </>
  ))}
</InfiniteLoaderComponent>`}}}},b=e=>(0,c.jsx)(`div`,{style:{padding:`8px`,border:`1px solid #eee`,margin:`4px`,borderRadius:`4px`},children:`\u0645\u0644\u0641 ${e+1}`}),x={args:{viewAs:`row`,itemCount:100,itemSize:48,hasMoreFiles:!0,loadMoreItems:l()},globals:{direction:`rtl`},render:e=>(0,c.jsx)(`div`,{dir:`rtl`,children:(0,c.jsx)(f,{...e,renderItem:b})}),parameters:{noPadding:!0,docs:{description:{story:`The row layout in a right-to-left interface: the text of each row starts at the right edge of the row instead of the left.`},source:{code:`<div dir="rtl">
  <InfiniteLoaderComponent viewAs="row" itemSize={48} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>`},story:{inline:!1,height:`326px`}}}},S={render:()=>(0,c.jsx)(`div`,{style:{"--infinite-loader-tile-gap":`20px 24px`,"--infinite-loader-tile-min-size":`180px`,"--infinite-loader-tile-max-size":`280px`},children:(0,c.jsx)(f,{})}),parameters:{docs:{description:{story:`The three tile variables set on one wrapper -- the variables are listed under CSS variables on this page. They size only the skeleton tiles, which appear for a moment when the box is scrolled by more than 800px at once — drag the scrollbar quickly to see them.`},source:{code:`<div
  style={{
    "--infinite-loader-tile-gap": "20px 24px",
    "--infinite-loader-tile-min-size": "180px",
    "--infinite-loader-tile-max-size": "280px",
  }}
>
  <InfiniteLoaderComponent viewAs="tile" countTilesInRow={4} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>`}}}},C=[`Default`,`RowLayout`,`TableLayout`,`RightToLeft`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    viewAs: "tile" as TViewAs,
    itemCount: 100,
    itemSize: 20,
    countTilesInRow: 4,
    isLoading: false,
    infoPanelVisible: false,
    hasMoreFiles: true,
    loadMoreItems: fn(),
    onScroll: fn()
  },
  render: args => <InfiniteLoaderDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Scroll the box: when the end of the loaded items comes near, the loader asks for the next range, and the new items arrive half a second later (\`loadMoreItems\`, logged in the Actions panel). In the \`tile\` layout each child is one row of the grid; here a plain box stands in for a row of tiles. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<InfiniteLoaderComponent
  viewAs="tile"
  itemCount={100}
  filesLength={20}
  hasMoreFiles={true}
  loadMoreItems={handleLoadMore}
  itemSize={20}
  countTilesInRow={4}
  isLoading={false}
>
  {items}
</InfiniteLoaderComponent>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    viewAs: "row" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    loadMoreItems: fn()
  },
  render: args => <InfiniteLoaderDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A list of rows of one height (\`viewAs="row"\`, \`itemSize\`). Scroll to the end: the rows after the last loaded item are skeleton rows until the next page arrives, and a jump of more than 800px, such as dragging the scrollbar, turns every row in view into a skeleton while the scrolling lasts.'
      },
      source: {
        code: \`<InfiniteLoaderComponent
  viewAs="row"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
>
  {items}
</InfiniteLoaderComponent>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    viewAs: "table" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    columnStorageName: TABLE_COLUMNS_KEY,
    columnInfoPanelStorageName: TABLE_COLUMNS_KEY,
    loadMoreItems: fn()
  },
  render: args => {
    saveTableColumns();
    return <InfiniteLoaderDemo {...args} renderItem={renderTableRow} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A table whose rows share one column layout (\`viewAs="table"\`). The layout is not passed as a prop: the loader reads it from \`localStorage\` under the key it is given (\`columnStorageName\`, or \`columnInfoPanelStorageName\` while \`infoPanelVisible\` is set), which lets the table header that saves the widths and the rows below stay in step. The rows not loaded yet show the table skeleton.'
      },
      source: {
        code: \`localStorage.setItem("filesColumns", "2fr 1fr 1fr");

<InfiniteLoaderComponent
  viewAs="table"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
  columnStorageName="filesColumns"
  columnInfoPanelStorageName="filesColumnsInfoPanel"
>
  {rows.map((file) => (
    <>
      <div>{file.title}</div>
      <div>{file.modified}</div>
      <div>{file.size}</div>
    </>
  ))}
</InfiniteLoaderComponent>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    viewAs: "row" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    loadMoreItems: fn()
  },
  globals: {
    direction: "rtl"
  },
  render: args => <div dir="rtl">
      <InfiniteLoaderDemo {...args} renderItem={renderRtlItem} />
    </div>,
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "The row layout in a right-to-left interface: the text of each row starts at the right edge of the row instead of the left."
      },
      source: {
        code: \`<div dir="rtl">
  <InfiniteLoaderComponent viewAs="row" itemSize={48} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>\`
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: {
        inline: false,
        height: "326px"
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--infinite-loader-tile-gap": "20px 24px",
    "--infinite-loader-tile-min-size": "180px",
    "--infinite-loader-tile-max-size": "280px"
  } as CSSProperties}>
      <InfiniteLoaderDemo />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The three tile variables set on one wrapper -- the variables are listed under CSS variables on this page. They size only the skeleton tiles, which appear for a moment when the box is scrolled by more than 800px at once — drag the scrollbar quickly to see them.\`
      },
      source: {
        code: \`<div
  style={{
    "--infinite-loader-tile-gap": "20px 24px",
    "--infinite-loader-tile-min-size": "180px",
    "--infinite-loader-tile-max-size": "280px",
  }}
>
  <InfiniteLoaderComponent viewAs="tile" countTilesInRow={4} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as CssCustomization,m as Default,x as RightToLeft,v as RowLayout,y as TableLayout,C as __namedExportsOrder,p as default};