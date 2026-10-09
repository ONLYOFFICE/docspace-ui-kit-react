import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./catalog.folder.react-VUpu0ofJ.js";import{n as a,t as o}from"./catalog.trash.react-DXnBu-0X.js";import{a as s,i as c,n as l,r as u}from"./ArticleItem-C8tVZFfR.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),r(),a(),u(),s(),d=n(),f={path:``,state:{}},p={title:`UI/Layout components/ArticleItem`,component:l,parameters:{docs:{description:{component:`One catalog entry of the Article panel's body: an icon, a label and an optional badge. The Article page describes it in full.`}},design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=474-2027&mode=design&t=TBNCKMQKQMxr44IZ-0`}},decorators:[e=>(0,d.jsx)(`div`,{className:c.storyCatalogWrapper,style:{width:`250px`},children:(0,d.jsx)(e,{})})],args:{icon:i,text:`Documents`,showText:!0,linkData:f},argTypes:{showText:{control:`boolean`},showBadge:{control:`boolean`},isActive:{control:`boolean`},isDragging:{control:`boolean`},isDragActive:{control:`boolean`},isHeader:{control:`boolean`},isFirstHeader:{control:`boolean`,if:{arg:`isHeader`}},isEndOfBlock:{control:`boolean`},showInitial:{control:`boolean`},labelBadge:{control:`text`},text:{control:`text`}}},m={args:{}},h={args:{showText:!1,showBadge:!1},decorators:[e=>(0,d.jsx)(`div`,{className:c.storyCatalogWrapper,style:{width:`52px`},children:(0,d.jsx)(e,{})})]},g={args:{showBadge:!0,labelBadge:`42`}},_={args:{showBadge:!0,iconBadge:o}},v={args:{isActive:!0,showBadge:!0,labelBadge:`New`}},y={args:{isDragging:!0}},b={args:{isDragActive:!0}},x={args:{text:`RECENT`,isHeader:!0,showText:!0}},S={render:()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{icon:i,text:`First Item`,showText:!0,showBadge:!0,isEndOfBlock:!0,labelBadge:`3`,linkData:f}),(0,d.jsx)(l,{icon:i,text:`Second Item`,showText:!0,showBadge:!0,iconBadge:o,linkData:f})]})},C={render:()=>(0,d.jsxs)(`div`,{style:{"--article-item-border-radius":`8px`,"--article-item-text":`#222222`,"--article-item-text-active":`#ffffff`,"--article-item-text-weight":`400`,"--article-item-icon":`#222222`,"--article-item-icon-active":`#ffffff`,"--article-item-active-bg":`#00679e`,"--article-item-active-hover-bg":`#00507a`,"--article-item-hover-bg":`#f5f5f5`,"--sidebar-item-gap":`4px`},children:[(0,d.jsx)(l,{icon:i,text:`Documents`,showText:!0,linkData:f}),(0,d.jsx)(l,{icon:i,text:`Active Item`,showText:!0,isActive:!0,linkData:f}),(0,d.jsx)(l,{icon:o,text:`Trash`,showText:!0,linkData:f})]}),parameters:{docs:{description:{story:`The row's variables set on one wrapper -- they are listed under CSS variables on the Article page.`},source:{code:`// Sidebar with Nextcloud-style active state and gaps
<div style={{
  "--article-item-border-radius": "8px",
  "--article-item-text": "#222222",
  "--article-item-text-active": "#ffffff",
  "--article-item-text-weight": "400",
  "--article-item-active-bg": "#00679e",
  "--article-item-hover-bg": "#f5f5f5",
  "--sidebar-item-gap": "4px",
}}>
  <ArticleItemPure icon={folderIcon} text="Documents" showText linkData={linkData} />
  <ArticleItemPure icon={folderIcon} text="Active" showText isActive linkData={linkData} />
</div>`}}}},w=[`Default`,`IconOnly`,`WithBadge`,`WithCustomBadge`,`Active`,`Dragging`,`DragTarget`,`Header`,`EndOfBlock`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    showText: false,
    showBadge: false
  },
  decorators: [Story => <div className={styles.storyCatalogWrapper} style={{
    width: "52px"
  }}>
        <Story />
      </div>]
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    showBadge: true,
    labelBadge: "42"
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    showBadge: true,
    iconBadge: CatalogTrashReactSvgUrl
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    isActive: true,
    showBadge: true,
    labelBadge: "New"
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    isDragging: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    isDragActive: true
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    text: "RECENT",
    isHeader: true,
    showText: true
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <ArticleItemPure icon={CatalogFolderReactSvgUrl} text="First Item" showText showBadge isEndOfBlock labelBadge="3" linkData={defaultLinkData} />
      <ArticleItemPure icon={CatalogFolderReactSvgUrl} text="Second Item" showText showBadge iconBadge={CatalogTrashReactSvgUrl} linkData={defaultLinkData} />
    </>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--article-item-border-radius": "8px",
    "--article-item-text": "#222222",
    "--article-item-text-active": "#ffffff",
    "--article-item-text-weight": "400",
    "--article-item-icon": "#222222",
    "--article-item-icon-active": "#ffffff",
    "--article-item-active-bg": "#00679e",
    "--article-item-active-hover-bg": "#00507a",
    "--article-item-hover-bg": "#f5f5f5",
    "--sidebar-item-gap": "4px"
  } as React.CSSProperties}>
      <ArticleItemPure icon={CatalogFolderReactSvgUrl} text="Documents" showText linkData={defaultLinkData} />
      <ArticleItemPure icon={CatalogFolderReactSvgUrl} text="Active Item" showText isActive linkData={defaultLinkData} />
      <ArticleItemPure icon={CatalogTrashReactSvgUrl} text="Trash" showText linkData={defaultLinkData} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: "The row's variables set on one wrapper -- they are listed under CSS variables on the Article page."
      },
      source: {
        code: \`// Sidebar with Nextcloud-style active state and gaps
<div style={{
  "--article-item-border-radius": "8px",
  "--article-item-text": "#222222",
  "--article-item-text-active": "#ffffff",
  "--article-item-text-weight": "400",
  "--article-item-active-bg": "#00679e",
  "--article-item-hover-bg": "#f5f5f5",
  "--sidebar-item-gap": "4px",
}}>
  <ArticleItemPure icon={folderIcon} text="Documents" showText linkData={linkData} />
  <ArticleItemPure icon={folderIcon} text="Active" showText isActive linkData={linkData} />
</div>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}}})))()}T();export{v as Active,C as CssCustomization,m as Default,b as DragTarget,y as Dragging,S as EndOfBlock,x as Header,h as IconOnly,g as WithBadge,_ as WithCustomBadge,w as __namedExportsOrder,p as default};