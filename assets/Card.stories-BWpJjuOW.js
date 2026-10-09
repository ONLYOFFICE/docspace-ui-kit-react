import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./classnames-CfLRLWYq.js";import{n as i,t as a}from"./catalog.folder.react-BLNaFnHq.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{o=`_container_116b1_1`,s=`_header_116b1_20`,c=`_title_116b1_28`,l=`_extra_116b1_36`,u=`_body_116b1_41`,d=`_connectedStatus_116b1_46`,f={container:o,header:s,title:c,extra:l,body:u,connectedStatus:d}})))()}var m,h,g;function _(){return(_=e((()=>{m=t(r()),p(),h=n(),g=({title:e,extra:t,children:n,className:r,style:i,dataTestId:a,footer:o})=>{let s=e!=null||t!=null;return(0,h.jsxs)(`div`,{className:(0,m.default)(f.container,r),style:i,"data-testid":a??`card`,children:[s?(0,h.jsxs)(`header`,{className:f.header,children:[e?(0,h.jsx)(`div`,{className:f.title,children:e}):null,t?(0,h.jsx)(`div`,{className:f.extra,children:t}):null]}):null,n?(0,h.jsx)(`div`,{className:f.body,children:n}):null,o?(0,h.jsx)(`footer`,{children:o}):null]})};try{g.displayName=`Card`,g.__docgenInfo={description:``,displayName:`Card`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/card/Card.tsx`,methods:[],props:{title:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:"Left side of the header row. The row is dropped entirely when both this and `extra` are unset.",name:`title`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`ReactNode`}},extra:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:`Right side of the header row, pushed against the trailing edge — a status, a badge, a link.`,name:`extra`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`ReactNode`}},children:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:`Body of the card. Nothing is rendered when it is empty.`,name:`children`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:`Added after the component's own class, on the outer element.`,name:`className`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:`Inline style of the outer element.`,name:`style`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`CSSProperties | undefined`}},dataTestId:{defaultValue:{value:`"card"`},declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:"Value of `data-testid` on the outer element.",name:`dataTestId`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{default:`"card"`},type:{name:`string | undefined`}},footer:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`}],description:"Contents of a `<footer>` below the body. It gets no styling of its own beyond the card's 12px gap.",name:`footer`,parent:{fileName:`docspace-ui-kit-react/components/card/Card.types.ts`,name:`CardProps`},required:!1,tags:{},type:{name:`ReactNode`}}},tags:{}}}catch{}})))()}var v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{i(),_(),p(),v=n(),y={title:`UI/Data display/Card`,component:g,parameters:{},argTypes:{title:{control:`text`,description:"Content on the leading side of the header row, in bold. The header row is left out when both this and `extra` are unset",table:{type:{summary:`React.ReactNode`}}},extra:{control:`text`,description:`Content on the trailing side of the header row, kept on one line at its natural width, such as a status or a badge`,table:{type:{summary:`React.ReactNode`}}},children:{control:`text`,description:`Body of the card, in smaller secondary text. Nothing is rendered for it when it is empty`,table:{type:{summary:`React.ReactNode`}}},footer:{control:`text`,description:`Content of a footer below the body, with no styling of its own beyond the card's 12px spacing`,table:{type:{summary:`React.ReactNode`}}},className:{control:`text`,description:`Class added after the component's own on the outer element`},style:{control:`object`,description:`Inline style of the outer element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"card"`}}}}},b={args:{title:`Card title`,children:`Card body content goes here.`},parameters:{docs:{description:{story:"The common case: a heading over a short block of text (`title`, `children`). Change any other prop live in the Controls panel below."},source:{code:`<Card title="Card title">Card body content goes here.</Card>`}}}},x={args:{title:`Backup storage`,extra:(0,v.jsx)(`span`,{className:f.connectedStatus,children:`Connected`}),children:`Copies of your documents are saved every night.`},parameters:{docs:{description:{story:'A short status belongs next to the heading: "Connected" sits on the trailing edge of the header row, on one line however long the title is (`extra`).'},source:{code:`<Card title="Backup storage" extra={<span>Connected</span>}>
  Copies of your documents are saved every night.
</Card>`}}}},S={args:{title:`Title without body`},parameters:{docs:{description:{story:"A heading alone labels a block that has no details yet; no empty body is left below it (`title` without `children`)."},source:{code:`<Card title="Title without body" />`}}}},C={args:{children:`Body content without a header row.`},parameters:{docs:{description:{story:"Text alone, for a note that needs no heading: with neither `title` nor `extra` set, the header row is left out and the text starts at the top of the card."},source:{code:`<Card>Body content without a header row.</Card>`}}}},w=()=>(0,v.jsx)(g,{title:(0,v.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,v.jsx)(a,{style:{width:16,height:16,flexShrink:0}}),`Title with icon`]}),children:`Body text below the icon title.`}),T={render:()=>(0,v.jsx)(w,{}),parameters:{docs:{description:{story:"An icon before the heading marks what the card is about; the card lays out nothing inside the title, so the icon and the text are wrapped in a flex span of the consumer's own (`title`)."},source:{code:`<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
      Title with icon
    </span>
  }
>
  Body text below the icon title.
</Card>`}}}},E=()=>(0,v.jsx)(g,{title:(0,v.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,v.jsx)(a,{style:{width:16,height:16,flexShrink:0}}),`Backup storage`]}),extra:(0,v.jsx)(`span`,{className:f.connectedStatus,children:`Connected`}),footer:(0,v.jsx)(`button`,{type:`button`,children:`Open settings`}),children:(0,v.jsx)(`p`,{style:{margin:0},children:`Copies of your documents are saved every night and kept for 30 days.`})}),D={render:()=>(0,v.jsx)(E,{}),parameters:{docs:{description:{story:'Every slot at once, for a block that states something and offers the next step: an icon and a heading (`title`), "Connected" on the trailing edge (`extra`), a paragraph (`children`) and an "Open settings" button below it (`footer`).'},source:{code:`<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
      Backup storage
    </span>
  }
  extra={<span>Connected</span>}
  footer={<button type="button">Open settings</button>}
>
  <p style={{ margin: 0 }}>
    Copies of your documents are saved every night and kept for 30 days.
  </p>
</Card>`}}}},O=()=>(0,v.jsx)(g,{title:`Custom colours`,style:{"--info-block-background":`#e8f1fb`,"--card-title-color":`#0b3d91`,"--card-body-color":`#3a5a80`},children:`The background, the title and the body text use the values set here.`}),k={render:()=>(0,v.jsx)(O,{}),parameters:{docs:{description:{story:"Every overridable variable set on the card itself -- the variables are listed under CSS variables on this page. They are set through the `style` prop, because a value on a wrapper never reaches the card."},source:{code:`<Card
  title="Custom colours"
  style={{
    "--info-block-background": "#e8f1fb",
    "--card-title-color": "#0b3d91",
    "--card-body-color": "#3a5a80",
  }}
>
  The background, the title and the body text use the values set here.
</Card>`}}}},A=[`Default`,`WithExtra`,`TitleOnly`,`BodyOnly`,`WithIconInTitle`,`FullExample`,`CssCustomization`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Card title",
    children: "Card body content goes here."
  },
  parameters: {
    docs: {
      description: {
        story: "The common case: a heading over a short block of text (\`title\`, \`children\`). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Card title="Card title">Card body content goes here.</Card>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Backup storage",
    extra: <span className={styles.connectedStatus}>Connected</span>,
    children: "Copies of your documents are saved every night."
  },
  parameters: {
    docs: {
      description: {
        story: 'A short status belongs next to the heading: "Connected" sits on the trailing edge of the header row, on one line however long the title is (\`extra\`).'
      },
      source: {
        code: \`<Card title="Backup storage" extra={<span>Connected</span>}>
  Copies of your documents are saved every night.
</Card>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Title without body"
  },
  parameters: {
    docs: {
      description: {
        story: "A heading alone labels a block that has no details yet; no empty body is left below it (\`title\` without \`children\`)."
      },
      source: {
        code: \`<Card title="Title without body" />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Body content without a header row."
  },
  parameters: {
    docs: {
      description: {
        story: "Text alone, for a note that needs no heading: with neither \`title\` nor \`extra\` set, the header row is left out and the text starts at the top of the card."
      },
      source: {
        code: \`<Card>Body content without a header row.</Card>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <WithIconInTitleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An icon before the heading marks what the card is about; the card lays out nothing inside the title, so the icon and the text are wrapped in a flex span of the consumer's own (\`title\`)."
      },
      source: {
        code: \`<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
      Title with icon
    </span>
  }
>
  Body text below the icon title.
</Card>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <FullExampleTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Every slot at once, for a block that states something and offers the next step: an icon and a heading (\`title\`), "Connected" on the trailing edge (\`extra\`), a paragraph (\`children\`) and an "Open settings" button below it (\`footer\`).'
      },
      source: {
        code: \`<Card
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FolderIcon style={{ width: 16, height: 16 }} />
      Backup storage
    </span>
  }
  extra={<span>Connected</span>}
  footer={<button type="button">Open settings</button>}
>
  <p style={{ margin: 0 }}>
    Copies of your documents are saved every night and kept for 30 days.
  </p>
</Card>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on the card itself -- the variables are listed under CSS variables on this page. They are set through the \\\`style\\\` prop, because a value on a wrapper never reaches the card.\`
      },
      source: {
        code: \`<Card
  title="Custom colours"
  style={{
    "--info-block-background": "#e8f1fb",
    "--card-title-color": "#0b3d91",
    "--card-body-color": "#3a5a80",
  }}
>
  The background, the title and the body text use the values set here.
</Card>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}}})))()}j();export{C as BodyOnly,k as CssCustomization,b as Default,D as FullExample,S as TitleOnly,x as WithExtra,T as WithIconInTitle,A as __namedExportsOrder,y as default};