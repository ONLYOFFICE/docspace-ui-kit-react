import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r,r as i,t as a}from"./heading-BgSzvZkA.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{i(),o=t(),s=Object.values(r).filter(e=>typeof e==`number`),c={title:`UI/Data display/Heading`,component:a,parameters:{},argTypes:{level:{control:{type:`select`,labels:Object.fromEntries(s.map(e=>[e,r[e]]))},options:s,description:"Which heading element is rendered, `h1` through `h6`. It changes only the element, not the size: an `h3` can be the largest text on the page",table:{defaultValue:{summary:`h1`}}},size:{control:`select`,options:Object.values(n),description:"One of five preset sizes, from 15px (`xsmall`) to 27px (`xlarge`). Has no effect while `type` is set",table:{defaultValue:{summary:`medium`}}},type:{control:`select`,options:[`header`,`menu`,`content`],description:"Bold preset that replaces `size`: `content` 18px, `menu` 23px, `header` 28px, each with a 50px line height. Unset, the heading follows `size`"},color:{control:`color`,description:`Text colour, as an inline style. Any CSS colour; unset, the heading is black, or white in the dark theme`},truncate:{control:`boolean`,description:`Holds the heading on one line and ends it with an ellipsis. It needs a parent of bounded width; on its own the heading grows instead`,table:{defaultValue:{summary:`false`}}},isInline:{control:`boolean`,description:`Renders the heading inline, so it sits in the same line as the text around it instead of on a line of its own`,table:{defaultValue:{summary:`false`}}},fontSize:{control:`text`,description:"Font size, as an inline style, in any CSS unit. Wins over both `size` and `type`"},fontWeight:{control:`text`,description:"Font weight, as an inline style. Wins over the 600 of the plain heading and the bold of `type`"},lineHeight:{control:`text`,description:"Line height, as an inline style. Wins over the 50px line height of `type`"},as:{control:!1,description:"Element or component to render instead of the `h1`-`h6` tag; `level` is then ignored"},title:{control:`text`,description:"Native tooltip text, shown by the browser on hover. `HeadingWithTooltip` shows it in the shared tooltip instead"},children:{control:`text`,description:`Heading text`},id:{control:`text`,description:"`id` of the rendered element"},className:{control:`text`,description:`Added after the component's own classes`},style:{control:`object`,description:"Inline style of the element. Its `color`, `fontSize`, `fontWeight` and `lineHeight` are replaced by the props of the same name"}}},l=e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:e.children}),u={render:e=>(0,o.jsx)(a,{...e}),args:{level:r.h1,size:n.large,children:`Default Heading`},parameters:{docs:{description:{story:"A large `h1`, the title of a page or panel; change the level, size, type or any other prop live in the Controls panel below."},source:{code:`<Heading level={HeadingLevel.h1} size={HeadingSize.large}>
  Default Heading
</Heading>`}}}},d=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{level:r.h1,children:`H1 Heading`}),(0,o.jsx)(a,{level:r.h2,children:`H2 Heading`}),(0,o.jsx)(a,{level:r.h3,children:`H3 Heading`}),(0,o.jsx)(a,{level:r.h4,children:`H4 Heading`}),(0,o.jsx)(a,{level:r.h5,children:`H5 Heading`}),(0,o.jsx)(a,{level:r.h6,children:`H6 Heading`})]}),f=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{level:r.h1,size:n.xsmall,children:`XSmall Heading`}),(0,o.jsx)(a,{level:r.h1,size:n.small,children:`Small Heading`}),(0,o.jsx)(a,{level:r.h1,size:n.medium,children:`Medium Heading`}),(0,o.jsx)(a,{level:r.h1,size:n.large,children:`Large Heading`}),(0,o.jsx)(a,{level:r.h1,size:n.xlarge,children:`XLarge Heading`})]}),p=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{level:r.h1,children:`Default Type`}),(0,o.jsx)(a,{level:r.h1,type:`header`,children:`Header Type`}),(0,o.jsx)(a,{level:r.h1,type:`menu`,children:`Menu Type`}),(0,o.jsx)(a,{level:r.h1,type:`content`,children:`Content Type`})]}),m=()=>(0,o.jsx)(`div`,{style:{width:250},children:(0,o.jsx)(a,{level:r.h2,truncate:!0,children:`This is a very long heading that will be truncated when it exceeds the container width`})}),h=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{level:r.h1,color:`blue`,children:`Blue Heading`}),(0,o.jsx)(a,{level:r.h1,style:{fontStyle:`italic`},children:`Italic Heading`}),(0,o.jsx)(a,{level:r.h1,style:{textDecoration:`underline`},children:`Underlined Heading`})]}),g={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"Six headings, `h1` through `h6`, all at the same medium size: the level decides the element a screen reader builds the page outline from, not how large the text looks (`level`)."},source:{code:`<Heading level={HeadingLevel.h1}>H1 Heading</Heading>
<Heading level={HeadingLevel.h2}>H2 Heading</Heading>
<Heading level={HeadingLevel.h3}>H3 Heading</Heading>
<Heading level={HeadingLevel.h4}>H4 Heading</Heading>
<Heading level={HeadingLevel.h5}>H5 Heading</Heading>
<Heading level={HeadingLevel.h6}>H6 Heading</Heading>`}}}},_={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:"Five `h1` headings from 15px to 27px: pick the size for the visual weight the layout needs, whatever level the heading has (`size`)."},source:{code:`<Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>XSmall Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.small}>Small Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.medium}>Medium Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.large}>Large Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>XLarge Heading</Heading>`}}}},v={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"**Default Type** has no `type` and follows `size`; **Header Type** is 28px at weight 600, **Menu Type** 23px bold and **Content Type** 18px bold, all three on a 50px line height, for titles that must line up with a 50px row (`type`)."},source:{code:`<Heading level={HeadingLevel.h1}>Default Type</Heading>
<Heading level={HeadingLevel.h1} type="header">Header Type</Heading>
<Heading level={HeadingLevel.h1} type="menu">Menu Type</Heading>
<Heading level={HeadingLevel.h1} type="content">Content Type</Heading>`}}}},y={render:()=>(0,o.jsx)(m,{}),parameters:{docs:{description:{story:"A long title in a 250px column stays on one line and ends with an ellipsis, for headers that must not wrap; without a bounded parent the heading grows instead (`truncate`)."},source:{code:`<div style={{ width: 250 }}>
  <Heading level={HeadingLevel.h2} truncate>
    This is a very long heading that will be truncated...
  </Heading>
</div>`}}}},b={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"One-off looks without a stylesheet: **Blue Heading** sets the colour through the `color` prop, **Italic Heading** and **Underlined Heading** pass other CSS through `style`."},source:{code:`<Heading level={HeadingLevel.h1} color="blue">Blue Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ fontStyle: "italic" }}>Italic Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ textDecoration: "underline" }}>Underlined Heading</Heading>`}}}},x={render:()=>(0,o.jsxs)(`div`,{style:{"--heading-text-color":`#7B4FBF`,"--heading-weight":`800`,"--heading-size-content":`22px`,"--heading-size-menu":`26px`,"--heading-size-header":`32px`,"--heading-lh":`40px`},children:[(0,o.jsx)(a,{level:r.h2,type:`content`,children:`Custom Heading`}),(0,o.jsx)(a,{level:r.h2,children:`Plain Heading`}),(0,o.jsx)(a,{level:r.h2,type:`menu`,children:`Menu Heading`}),(0,o.jsx)(a,{level:r.h2,type:`header`,children:`Header Heading`})]}),parameters:{docs:{description:{story:'Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Custom Heading** (`type="content"`) shows the colour, `--heading-size-content` and `--heading-lh`; **Plain Heading** has no `type` and is there for `--heading-weight`; **Menu Heading** and **Header Heading** show `--heading-size-menu` and `--heading-size-header`.'},source:{code:`<div
  style={{
    "--heading-text-color": "#7B4FBF",
    "--heading-weight": "800",
    "--heading-size-content": "22px",
    "--heading-size-menu": "26px",
    "--heading-size-header": "32px",
    "--heading-lh": "40px",
  }}
>
  <Heading level={HeadingLevel.h2} type="content">
    Custom Heading
  </Heading>
  <Heading level={HeadingLevel.h2}>Plain Heading</Heading>
  <Heading level={HeadingLevel.h2} type="menu">
    Menu Heading
  </Heading>
  <Heading level={HeadingLevel.h2} type="header">
    Header Heading
  </Heading>
</div>`}}}},S=[`Default`,`Levels`,`Sizes`,`Types`,`TruncatedHeading`,`CustomStyled`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Heading {...args} />,
  args: {
    level: HeadingLevel.h1,
    size: HeadingSize.large,
    children: "Default Heading"
  },
  parameters: {
    docs: {
      description: {
        story: "A large \`h1\`, the title of a page or panel; change the level, size, type or any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Heading level={HeadingLevel.h1} size={HeadingSize.large}>
  Default Heading
</Heading>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <LevelsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Six headings, \`h1\` through \`h6\`, all at the same medium size: the level decides the element a screen reader builds the page outline from, not how large the text looks (\`level\`)."
      },
      source: {
        code: \`<Heading level={HeadingLevel.h1}>H1 Heading</Heading>
<Heading level={HeadingLevel.h2}>H2 Heading</Heading>
<Heading level={HeadingLevel.h3}>H3 Heading</Heading>
<Heading level={HeadingLevel.h4}>H4 Heading</Heading>
<Heading level={HeadingLevel.h5}>H5 Heading</Heading>
<Heading level={HeadingLevel.h6}>H6 Heading</Heading>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Five \`h1\` headings from 15px to 27px: pick the size for the visual weight the layout needs, whatever level the heading has (\`size\`)."
      },
      source: {
        code: \`<Heading level={HeadingLevel.h1} size={HeadingSize.xsmall}>XSmall Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.small}>Small Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.medium}>Medium Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.large}>Large Heading</Heading>
<Heading level={HeadingLevel.h1} size={HeadingSize.xlarge}>XLarge Heading</Heading>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <TypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "**Default Type** has no \`type\` and follows \`size\`; **Header Type** is 28px at weight 600, **Menu Type** 23px bold and **Content Type** 18px bold, all three on a 50px line height, for titles that must line up with a 50px row (\`type\`)."
      },
      source: {
        code: \`<Heading level={HeadingLevel.h1}>Default Type</Heading>
<Heading level={HeadingLevel.h1} type="header">Header Type</Heading>
<Heading level={HeadingLevel.h1} type="menu">Menu Type</Heading>
<Heading level={HeadingLevel.h1} type="content">Content Type</Heading>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A long title in a 250px column stays on one line and ends with an ellipsis, for headers that must not wrap; without a bounded parent the heading grows instead (\`truncate\`)."
      },
      source: {
        code: \`<div style={{ width: 250 }}>
  <Heading level={HeadingLevel.h2} truncate>
    This is a very long heading that will be truncated...
  </Heading>
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStyledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "One-off looks without a stylesheet: **Blue Heading** sets the colour through the \`color\` prop, **Italic Heading** and **Underlined Heading** pass other CSS through \`style\`."
      },
      source: {
        code: \`<Heading level={HeadingLevel.h1} color="blue">Blue Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ fontStyle: "italic" }}>Italic Heading</Heading>
<Heading level={HeadingLevel.h1} style={{ textDecoration: "underline" }}>Underlined Heading</Heading>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--heading-text-color": "#7B4FBF",
    "--heading-weight": "800",
    "--heading-size-content": "22px",
    "--heading-size-menu": "26px",
    "--heading-size-header": "32px",
    "--heading-lh": "40px"
  } as CSSProperties}>
      <Heading level={HeadingLevel.h2} type="content">
        Custom Heading
      </Heading>
      <Heading level={HeadingLevel.h2}>Plain Heading</Heading>
      <Heading level={HeadingLevel.h2} type="menu">
        Menu Heading
      </Heading>
      <Heading level={HeadingLevel.h2} type="header">
        Header Heading
      </Heading>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Custom Heading** (\\\`type="content"\\\`) shows the colour, \\\`--heading-size-content\\\` and \\\`--heading-lh\\\`; **Plain Heading** has no \\\`type\\\` and is there for \\\`--heading-weight\\\`; **Menu Heading** and **Header Heading** show \\\`--heading-size-menu\\\` and \\\`--heading-size-header\\\`.\`
      },
      source: {
        code: \`<div
  style={{
    "--heading-text-color": "#7B4FBF",
    "--heading-weight": "800",
    "--heading-size-content": "22px",
    "--heading-size-menu": "26px",
    "--heading-size-header": "32px",
    "--heading-lh": "40px",
  }}
>
  <Heading level={HeadingLevel.h2} type="content">
    Custom Heading
  </Heading>
  <Heading level={HeadingLevel.h2}>Plain Heading</Heading>
  <Heading level={HeadingLevel.h2} type="menu">
    Menu Heading
  </Heading>
  <Heading level={HeadingLevel.h2} type="header">
    Header Heading
  </Heading>
</div>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as CssCustomization,b as CustomStyled,u as Default,g as Levels,_ as Sizes,y as TruncatedHeading,v as Types,S as __namedExportsOrder,c as default};