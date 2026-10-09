import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,r as a}from"./ThemeContext-DUdWYayy.js";import{n as o,t as s}from"./globalColors-fkBUxSeV.js";import{t as c}from"./classnames-CfLRLWYq.js";import{r as l,t as u}from"./text-Cz_cI6Yf.js";import{n as d,t as f}from"./link-C_nB54e7.js";import{c as p,s as m}from"./common-Ct6xxpXg.js";import{n as h,t as g}from"./badge-DpBv0vYH.js";import{n as _,t as v}from"./arrow.right.react-BM8a3dc_.js";var y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{y=`_categoryItemWrapper_1vgxj_1`,b=`_categoryItemHeading_1vgxj_28`,x=`_categoryItemSubheader_1vgxj_34`,S=`_categoryItemDescription_1vgxj_44`,C=`_disabled_1vgxj_49`,w=`_inheritTitleLink_1vgxj_53`,T=`_linkText_1vgxj_63`,E=`_arrowIcon_1vgxj_67`,D={categoryItemWrapper:y,categoryItemHeading:b,categoryItemSubheader:x,categoryItemDescription:S,disabled:C,inheritTitleLink:w,linkText:T,arrowIcon:E}})))()}var k,A,j;function M(){return(M=e((()=>{_(),n(),k=t(c()),l(),h(),d(),i(),m(),o(),O(),A=r(),j=({title:e,url:t,subtitle:n,onClickLink:r,isDisabled:i,withPaidBadge:o,badgeLabel:c,dataTestId:l})=>{let{isBase:d}=a(),m=i?{}:{onClick:r},h=i?{}:{href:t};return(0,A.jsxs)(`div`,{className:D.categoryItemWrapper,"data-testid":l,children:[(0,A.jsxs)(`div`,{className:D.categoryItemHeading,children:[(0,A.jsx)(f,{className:(0,k.default)(D.inheritTitleLink,`header`),noHover:i,...m,...h,dataTestId:l?`${l}_category_link`:void 0,children:e}),o&&!p()?(0,A.jsx)(g,{backgroundColor:d?s.favoritesStatus:s.favoriteStatusDark,label:c,isPaidBadge:!0,className:`paid-badge`,fontWeight:`700`}):null,(0,A.jsx)(v,{className:(0,k.default)(D.arrowIcon,`settings_unavailable`)})]}),(0,A.jsx)(u,{className:(0,k.default)(D.categoryItemDescription,{[D.disabled]:i}),children:n})]})};try{j.displayName=`CategoryItem`,j.__docgenInfo={description:``,displayName:`CategoryItem`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/category-item/index.tsx`,methods:[],props:{title:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:`Heading of the card, rendered as the text of a link at 16px.`,name:`title`,required:!0,tags:{},type:{name:`string`}},url:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Where the link points. It is dropped while `isDisabled` is set, which leaves an `<a>` with no `href`.",name:`url`,required:!0,tags:{},type:{name:`string`}},subtitle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:`Explanatory line under the title, at 12px and no wider than 1024px.`,name:`subtitle`,required:!0,tags:{},type:{name:`string`}},onClickLink:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Called with the click event on the title link. Nothing prevents the browser from following `url` — call `preventDefault` yourself when you route in JavaScript.",name:`onClickLink`,required:!0,tags:{},type:{name:`(e: MouseEvent<Element, MouseEvent>) => void`}},isDisabled:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Greys the subtitle and removes both `href` and `onClickLink` from the link. The title keeps its colour and the arrow still points right, so say elsewhere that the card is unavailable.",name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},withPaidBadge:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Shows the paid badge beside the title — unless the page's path contains `management`, where it is suppressed. Required, so pass `false` when there is no badge.",name:`withPaidBadge`,required:!0,tags:{},type:{name:`boolean`}},badgeLabel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Text inside the paid badge. Required even when `withPaidBadge` is `false`; pass an empty string then.",name:`badgeLabel`,required:!0,tags:{},type:{name:`string`}},dataTestId:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/category-item/CategoryItem.types.ts`,name:`TypeLiteral`}],description:"Value of `data-testid` on the wrapper, and the stem of the title link's own `<dataTestId>_category_link`. Without it the link keeps the shared `link` id.",name:`dataTestId`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{M(),N=r(),{fn:P}=__STORYBOOK_MODULE_TEST__,F={title:`UI/Data display/CategoryItem`,component:j,parameters:{},argTypes:{title:{control:`text`,description:`Heading of the entry, rendered as the text of a 16px link`},subtitle:{control:`text`,description:`Explanatory line under the title, at 12px and no wider than 1024px`},url:{control:`text`,description:`Where the title link points; dropped while the entry is disabled`},onClickLink:{action:`onClickLink`,description:"Called with the click event on the title link; the browser still follows `url` unless the handler calls `preventDefault`"},isDisabled:{control:`boolean`,description:"Removes the link's `href` and click handler and gives the subtitle the disabled colour, which is dimmer only in the dark theme; the title and arrow look unchanged",table:{defaultValue:{summary:`false`}}},withPaidBadge:{control:`boolean`,description:"Shows the paid badge beside the title, except on a page whose path contains `management`; required"},badgeLabel:{control:`text`,description:`Text inside the paid badge; required, so pass an empty string when there is no badge`},dataTestId:{control:`text`,description:"Value of `data-testid` on the entry, and the stem of the title link's `<dataTestId>_category_link`"}}},I={render:e=>(0,N.jsx)(j,{...e}),args:{title:`Category Title`,subtitle:`This is a description of the category that provides more details`,url:`#`,isDisabled:!1,withPaidBadge:!1,badgeLabel:`PRO`,onClickLink:P()},parameters:{docs:{description:{story:`An entry as it sits in an index of destinations: the title link, the explanation under it and the arrow. Change any prop live in the Controls panel below.`},source:{code:`<CategoryItem
  title="Category Title"
  subtitle="Description of the category"
  url="/settings/category"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel=""
/>`}}}},L={render:e=>(0,N.jsx)(j,{...e}),args:{title:`Premium Feature`,subtitle:`Available on a paid plan`,url:`#`,isDisabled:!1,withPaidBadge:!0,badgeLabel:`PRO`,onClickLink:P()},parameters:{docs:{description:{story:"Marks a destination that needs a paid plan: the badge beside the title carries its own text (`withPaidBadge`, `badgeLabel`). The badge is not shown on a page whose path contains `management`."},source:{code:`<CategoryItem
  title="Premium Feature"
  subtitle="Available on a paid plan"
  url="/settings/premium"
  onClickLink={handleClick}
  withPaidBadge
  badgeLabel="PRO"
/>`}}}},R={render:e=>(0,N.jsx)(j,{...e}),args:{title:`Disabled Category`,subtitle:`This category is currently unavailable`,url:`#`,isDisabled:!0,withPaidBadge:!1,badgeLabel:`PRO`,onClickLink:P()},parameters:{docs:{description:{story:"For a destination the reader cannot open right now: the title is no longer a working link (`isDisabled`). Nothing else marks it in the light theme, where the disabled subtitle colour matches the normal one; in the dark theme the subtitle dims. Say in the subtitle why the entry is unavailable."},source:{code:`<CategoryItem
  title="Disabled Category"
  subtitle="This category is currently unavailable"
  url="/settings/category"
  onClickLink={handleClick}
  isDisabled
  withPaidBadge={false}
  badgeLabel=""
/>`}}}},z=e=>(0,N.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`,maxWidth:`600px`},children:e.children}),B=()=>(0,N.jsxs)(z,{children:[(0,N.jsx)(j,{title:`General Settings`,subtitle:`Manage general application settings`,url:`#`,withPaidBadge:!1,badgeLabel:``,onClickLink:()=>{}}),(0,N.jsx)(j,{title:`Security`,subtitle:`Configure passwords and access policies`,url:`#`,withPaidBadge:!0,badgeLabel:`PRO`,onClickLink:()=>{}}),(0,N.jsx)(j,{title:`Backup`,subtitle:`Manage backup and restore options`,url:`#`,isDisabled:!0,withPaidBadge:!1,badgeLabel:``,onClickLink:()=>{}})]}),V={render:()=>(0,N.jsx)(B,{}),parameters:{docs:{description:{story:`The three looks side by side, as they appear together in one index:

- **General Settings** — a plain entry
- **Security** — the same entry with the paid badge (\`withPaidBadge\`)
- **Backup** — an unavailable entry whose title is no longer a link (\`isDisabled\`)`},source:{code:`<CategoryItem title="General Settings" subtitle="Manage general application settings" url="/settings/general" onClickLink={handleClick} withPaidBadge={false} badgeLabel="" />
<CategoryItem title="Security" subtitle="Configure passwords and access policies" url="/settings/security" onClickLink={handleClick} withPaidBadge badgeLabel="PRO" />
<CategoryItem title="Backup" subtitle="Manage backup and restore options" url="/settings/backup" onClickLink={handleClick} isDisabled withPaidBadge={false} badgeLabel="" />`}}}},H={render:e=>(0,N.jsx)(`div`,{dir:`rtl`,children:(0,N.jsx)(j,{...e})}),globals:{direction:`rtl`},args:{title:`إعدادات عامة`,subtitle:`اللغة والمنطقة الزمنية`,url:`#`,isDisabled:!1,withPaidBadge:!0,badgeLabel:`PRO`,onClickLink:P()},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`80px`},description:{story:'The same entry under a right-to-left interface: the title and subtitle align to the right, the badge follows the title leftwards and the arrow sits at the left end, mirrored to point left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <CategoryItem
    title="..."
    subtitle="..."
    url="/settings/general"
    onClickLink={handleClick}
    withPaidBadge
    badgeLabel="PRO"
  />
</div>`}}}},U={render:()=>(0,N.jsxs)(`div`,{style:{"--category-item-title-color":`#0082c9`,"--category-item-description-color":`#2e7d32`,"--category-item-arrow-color":`#d84315`,"--category-item-disabled-color":`#c4c4c4`,"--category-item-margin":`32px`},children:[(0,N.jsx)(j,{title:`Files`,subtitle:`Manage files and storage settings`,url:`/settings/files`,onClickLink:()=>{},withPaidBadge:!1,badgeLabel:``}),(0,N.jsx)(j,{title:`Security`,subtitle:`Configure passwords and two-factor authentication`,url:`/settings/security`,onClickLink:()=>{},isDisabled:!0,withPaidBadge:!1,badgeLabel:``})]}),parameters:{docs:{description:{story:"The variables set on one wrapper -- they are listed under CSS variables on this page. **Files** shows the title, subtitle and arrow colours and the margin below it; **Security** is disabled (`isDisabled`) to show `--category-item-disabled-color` on its subtitle."}}}},W=[`Default`,`WithPaidBadge`,`DisabledState`,`AllVariants`,`RightToLeft`,`CssCustomization`],I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <CategoryItem {...args} />,
  args: {
    title: "Category Title",
    subtitle: "This is a description of the category that provides more details",
    url: "#",
    isDisabled: false,
    withPaidBadge: false,
    badgeLabel: "PRO",
    onClickLink: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "An entry as it sits in an index of destinations: the title link, the explanation under it and the arrow. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<CategoryItem
  title="Category Title"
  subtitle="Description of the category"
  url="/settings/category"
  onClickLink={handleClick}
  withPaidBadge={false}
  badgeLabel=""
/>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <CategoryItem {...args} />,
  args: {
    title: "Premium Feature",
    subtitle: "Available on a paid plan",
    url: "#",
    isDisabled: false,
    withPaidBadge: true,
    badgeLabel: "PRO",
    onClickLink: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Marks a destination that needs a paid plan: the badge beside the title carries its own text (\`withPaidBadge\`, \`badgeLabel\`). The badge is not shown on a page whose path contains \`management\`."
      },
      source: {
        code: \`<CategoryItem
  title="Premium Feature"
  subtitle="Available on a paid plan"
  url="/settings/premium"
  onClickLink={handleClick}
  withPaidBadge
  badgeLabel="PRO"
/>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <CategoryItem {...args} />,
  args: {
    title: "Disabled Category",
    subtitle: "This category is currently unavailable",
    url: "#",
    isDisabled: true,
    withPaidBadge: false,
    badgeLabel: "PRO",
    onClickLink: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "For a destination the reader cannot open right now: the title is no longer a working link (\`isDisabled\`). Nothing else marks it in the light theme, where the disabled subtitle colour matches the normal one; in the dark theme the subtitle dims. Say in the subtitle why the entry is unavailable."
      },
      source: {
        code: \`<CategoryItem
  title="Disabled Category"
  subtitle="This category is currently unavailable"
  url="/settings/category"
  onClickLink={handleClick}
  isDisabled
  withPaidBadge={false}
  badgeLabel=""
/>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The three looks side by side, as they appear together in one index:\\n\\n- **General Settings** — a plain entry\\n- **Security** — the same entry with the paid badge (\`withPaidBadge\`)\\n- **Backup** — an unavailable entry whose title is no longer a link (\`isDisabled\`)"
      },
      source: {
        code: \`<CategoryItem title="General Settings" subtitle="Manage general application settings" url="/settings/general" onClickLink={handleClick} withPaidBadge={false} badgeLabel="" />
<CategoryItem title="Security" subtitle="Configure passwords and access policies" url="/settings/security" onClickLink={handleClick} withPaidBadge badgeLabel="PRO" />
<CategoryItem title="Backup" subtitle="Manage backup and restore options" url="/settings/backup" onClickLink={handleClick} isDisabled withPaidBadge={false} badgeLabel="" />\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <CategoryItem {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    // Arabic for "General settings" and "Language and time zone", escaped to keep the source ASCII.
    title: "\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a \\u0639\\u0627\\u0645\\u0629",
    subtitle: "\\u0627\\u0644\\u0644\\u063a\\u0629 \\u0648\\u0627\\u0644\\u0645\\u0646\\u0637\\u0642\\u0629 \\u0627\\u0644\\u0632\\u0645\\u0646\\u064a\\u0629",
    url: "#",
    isDisabled: false,
    withPaidBadge: true,
    badgeLabel: "PRO",
    onClickLink: fn()
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "80px"
      },
      description: {
        story: 'The same entry under a right-to-left interface: the title and subtitle align to the right, the badge follows the title leftwards and the arrow sits at the left end, mirrored to point left. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <CategoryItem
    title="..."
    subtitle="..."
    url="/settings/general"
    onClickLink={handleClick}
    withPaidBadge
    badgeLabel="PRO"
  />
</div>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--category-item-title-color": "#0082c9",
    "--category-item-description-color": "#2e7d32",
    "--category-item-arrow-color": "#d84315",
    "--category-item-disabled-color": "#c4c4c4",
    "--category-item-margin": "32px"
  } as CSSProperties}>
      <CategoryItem title="Files" subtitle="Manage files and storage settings" url="/settings/files" onClickLink={() => {}} withPaidBadge={false} badgeLabel="" />
      <CategoryItem title="Security" subtitle="Configure passwords and two-factor authentication" url="/settings/security" onClickLink={() => {}} isDisabled withPaidBadge={false} badgeLabel="" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables set on one wrapper -- they are listed under CSS variables on this page. **Files** shows the title, subtitle and arrow colours and the margin below it; **Security** is disabled (\\\`isDisabled\\\`) to show \\\`--category-item-disabled-color\\\` on its subtitle.\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}}})))()}G();export{V as AllVariants,U as CssCustomization,I as Default,R as DisabledState,H as RightToLeft,L as WithPaidBadge,W as __namedExportsOrder,F as default};