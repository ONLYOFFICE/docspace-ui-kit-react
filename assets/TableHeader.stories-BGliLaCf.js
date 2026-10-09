import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{S as r,v as i}from"./enums-DzcBu485.js";import{n as a,t as o}from"./TableHeader-CXsmwfmK.js";var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{s=t(),a(),r(),c=n(),l=`storybook-table-header-column-storage`,u=`storybook-table-header-info-panel-storage`,d=e=>{let t=(0,s.useRef)(null);return(0,c.jsx)(`div`,{id:`table-container`,ref:t,style:{marginInline:`40px`,position:`relative`},children:(0,c.jsx)(o,{...e,containerRef:t})})},f={title:`UI/Table/TableHeader`,component:o,parameters:{docs:{description:{component:`TableHeader is the row of column titles at the top of a table; it also decides the width of every column and writes them onto the table's grid.

The Table README describes it in full.`}}},argTypes:{columns:{control:!1,description:`The columns in order: title, sort field, callbacks and the flags that shape each one`},containerRef:{control:!1,description:`Ref of the TableContainer, whose grid columns the header writes`},columnStorageName:{control:`text`,description:"`localStorage` key the column widths are saved under; each table on a site needs its own"},columnInfoPanelStorageName:{control:`text`,description:"`localStorage` key used instead while an info panel narrows the table"},sortBy:{control:`select`,options:[i.Name,i.Type,i.Tags,i.Author],description:"Field the table is sorted by; the column with the same `sortBy` keeps its arrow on screen"},sorted:{control:`boolean`,description:`Direction of the sort; turning it off turns the arrow over`},sortingVisible:{control:`boolean`,description:`Shows the sort arrows and lets a click on a title sort the table`,table:{defaultValue:{summary:`true`}}},showSettings:{control:`boolean`,description:`Shows the cog at the end that lists the columns to hide`,table:{defaultValue:{summary:`true`}}},settingsTitle:{control:`text`,description:`Hover tooltip of the cog`},infoPanelVisible:{control:`boolean`,description:"Saves and restores the widths under `columnInfoPanelStorageName`, for the narrower table next to an open info panel",table:{defaultValue:{summary:`false`}}},isIndexEditingMode:{control:`boolean`,description:`Stops columns being resized and greys the cog out while rows are reordered`,table:{defaultValue:{summary:`false`}}},withoutWideColumn:{control:`boolean`,description:"Shares the width equally between the columns instead of giving the `default` column 40%",table:{defaultValue:{summary:`false`}}},resetColumnsSize:{control:`boolean`,description:`Discards the saved widths and lays the columns out afresh`},isLengthenHeader:{control:`boolean`,description:`Draws the line under the header across its full width instead of stopping short of the edges`},useReactWindow:{control:`boolean`,description:`Set when the body is virtualised, so the header rewrites the widths of the rows it renders`,table:{defaultValue:{summary:`false`}}},sectionWidth:{control:`number`,description:`Width of the section around the table in pixels; required, but the header reads its container instead`},setHideColumns:{control:!1,description:"Called with `true` when the columns stop fitting and with `false` when they fit again"},tagRef:{control:!1,description:"Ref attached to the header cell of the column that asks for it with `withTagRef`"},onClick:{control:!1,description:`Accepted, but the header never calls it`},style:{control:!1,description:`Accepted, but never applied to the header`}},tags:[`!autodocs`],decorators:[e=>(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{marginBottom:`20px`,fontSize:`14px`},children:(0,c.jsxs)(`p`,{children:[(0,c.jsx)(`strong`,{children:`Note:`}),` TableHeader component for displaying table headers with support for column resizing, sorting, and column visibility settings.`]})}),(0,c.jsx)(e,{})]})]},p={render:e=>(0,c.jsx)(d,{...e}),args:{containerRef:{current:null},columns:[{key:`Name`,title:`Name`,resizable:!0,enable:!0,default:!0,sortBy:i.Name,minWidth:210,onChange:()=>{},onClick:()=>{}},{key:`Type`,title:`Type`,enable:!0,resizable:!0,sortBy:i.Type,onChange:()=>{},onClick:()=>{}},{key:`Tags`,title:`Tags`,enable:!0,resizable:!0,sortBy:i.Tags,withTagRef:!0,onChange:()=>{},onClick:()=>{}},{key:`Owner`,title:`Owner`,enable:!0,resizable:!0,sortBy:i.Author,onChange:()=>{},onClick:()=>{}}],columnStorageName:l,columnInfoPanelStorageName:u,sectionWidth:1e3,sortBy:i.Name,sorted:!0,useReactWindow:!1,showSettings:!0,sortingVisible:!0,isLengthenHeader:!1,resetColumnsSize:!1,infoPanelVisible:!1,settingsTitle:`Column Settings`,isIndexEditingMode:!1,withoutWideColumn:!1},parameters:{docs:{description:{story:`The header of a four-column list, sorted by Name: drag the handles between the titles to resize the columns, hover a title to see its arrow, and click the cog to choose columns. Change any other prop live in the Controls panel below.`},source:{code:`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible
/>`}}}},m={render:e=>(0,c.jsx)(d,{...e}),args:{...p.args,showSettings:!1},parameters:{docs:{description:{story:"The same header without the cog, for a table whose columns are fixed (`showSettings` off)."},source:{code:`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings={false}
  sortingVisible
/>`}}}},h={render:e=>(0,c.jsx)(d,{...e}),args:{...p.args,sortingVisible:!1},parameters:{docs:{description:{story:"The same header for a list in a fixed order: no arrows, and a click on a title does nothing (`sortingVisible` off)."},source:{code:`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible={false}
/>`}}}},g={render:e=>(0,c.jsx)(`div`,{dir:`rtl`,children:(0,c.jsx)(d,{...e})}),args:{...p.args,columnStorageName:`storybook-table-header-rtl-column-storage`,columnInfoPanelStorageName:`storybook-table-header-rtl-info-panel-storage`},globals:{direction:`rtl`},parameters:{docs:{description:{story:`In a right-to-left interface the first column starts at the right edge and the cog sits at the left; dragging a handle to the left widens the column on its right.`},source:{code:`<div dir="rtl">
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={1000}
    sortBy={SortByFieldName.Name}
    sorted
  />
</div>`}}}},_=[`Default`,`WithoutSettings`,`WithoutSorting`,`RightToLeft`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <TableHeaderWrapper {...args} />,
  args: {
    containerRef: {
      current: null
    },
    columns: [{
      key: "Name",
      title: "Name",
      resizable: true,
      enable: true,
      default: true,
      sortBy: SortByFieldName.Name,
      minWidth: 210,
      onChange: () => {},
      onClick: () => {}
    }, {
      key: "Type",
      title: "Type",
      enable: true,
      resizable: true,
      sortBy: SortByFieldName.Type,
      onChange: () => {},
      onClick: () => {}
    }, {
      key: "Tags",
      title: "Tags",
      enable: true,
      resizable: true,
      sortBy: SortByFieldName.Tags,
      withTagRef: true,
      onChange: () => {},
      onClick: () => {}
    }, {
      key: "Owner",
      title: "Owner",
      enable: true,
      resizable: true,
      sortBy: SortByFieldName.Author,
      onChange: () => {},
      onClick: () => {}
    }],
    columnStorageName: COLUMN_STORAGE_NAME,
    columnInfoPanelStorageName: COLUMN_INFO_PANEL_STORAGE_NAME,
    sectionWidth: 1000,
    sortBy: SortByFieldName.Name,
    sorted: true,
    useReactWindow: false,
    showSettings: true,
    sortingVisible: true,
    isLengthenHeader: false,
    resetColumnsSize: false,
    infoPanelVisible: false,
    settingsTitle: "Column Settings",
    isIndexEditingMode: false,
    withoutWideColumn: false
  },
  parameters: {
    docs: {
      description: {
        story: "The header of a four-column list, sorted by Name: drag the handles between the titles to resize the columns, hover a title to see its arrow, and click the cog to choose columns. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <TableHeaderWrapper {...args} />,
  args: {
    ...Default.args,
    showSettings: false
  },
  parameters: {
    docs: {
      description: {
        story: "The same header without the cog, for a table whose columns are fixed (\`showSettings\` off)."
      },
      source: {
        code: \`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings={false}
  sortingVisible
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <TableHeaderWrapper {...args} />,
  args: {
    ...Default.args,
    sortingVisible: false
  },
  parameters: {
    docs: {
      description: {
        story: "The same header for a list in a fixed order: no arrows, and a click on a title does nothing (\`sortingVisible\` off)."
      },
      source: {
        code: \`<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible={false}
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <TableHeaderWrapper {...args} />
    </div>,
  args: {
    ...Default.args,
    columnStorageName: "storybook-table-header-rtl-column-storage",
    columnInfoPanelStorageName: "storybook-table-header-rtl-info-panel-storage"
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    docs: {
      description: {
        story: "In a right-to-left interface the first column starts at the right edge and the cog sits at the left; dragging a handle to the left widens the column on its right."
      },
      source: {
        code: \`<div dir="rtl">
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={1000}
    sortBy={SortByFieldName.Name}
    sorted
  />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{p as Default,g as RightToLeft,m as WithoutSettings,h as WithoutSorting,_ as __namedExportsOrder,f as default};