import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./globalColors-fkBUxSeV.js";import{n as i,t as a}from"./badge-DpBv0vYH.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),i(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Data display/Badge`,component:a,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=6057-171831&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{label:{control:`text`,description:'What the badge says, a number or a short text. `0`, `"0"` and an empty string hide the badge',table:{defaultValue:{summary:`0`}}},type:{control:`select`,options:[void 0,`high`],description:"`high` switches to the emphasised preset: 6px corners and 3px 10px padding around the label"},backgroundColor:{control:`color`,description:"Colour of the pill. Ignored while `isMutedBadge` is set",table:{defaultValue:{summary:`accent colour`}}},color:{control:`color`,description:"Colour of the label. Ignored while `isPaidBadge` is set",table:{defaultValue:{summary:`white`}}},fontSize:{control:`text`,description:"Size of the label text, in every type including `high`",table:{defaultValue:{summary:`11px`}}},fontWeight:{control:`number`,description:"Weight of the label text, in every type including `high`",table:{defaultValue:{summary:`800`}}},borderRadius:{control:`text`,description:"Corner radius of the badge and its pill. The pill keeps 6px corners while `type` is `high`",table:{defaultValue:{summary:`11px`}}},padding:{control:`text`,description:"Space inside the pill around the label. Replaced by 3px 10px while `type` is `high`",table:{defaultValue:{summary:`0px 5px`}}},maxWidth:{control:`text`,description:"Widest the pill may be; a longer label is cut off without an ellipsis. Not applied while `isPaidBadge` is set",table:{defaultValue:{summary:`50px`}}},height:{control:`text`,description:`Height of the badge. Without it the badge is as tall as its label`},border:{control:`text`,description:"CSS `border` shorthand drawn around the badge. The badge draws no border of its own"},noHover:{control:`boolean`,description:`Keeps the arrow cursor and a fixed colour on hover and press, for a badge that is only a marker`,table:{defaultValue:{summary:`false`}}},isHovered:{control:`boolean`,description:"Shows the pointer cursor and makes a `border` transparent without the pointer being there. It does not draw the hover colour",table:{defaultValue:{summary:`false`}}},isVersionBadge:{control:`boolean`,description:`On tablet-width screens and narrower, lets the badge fill the width of its container; the pill stays centred at its own width`,table:{defaultValue:{summary:`false`}}},isPaidBadge:{control:`boolean`,description:"Keeps the label white whatever `color` says and lifts `maxWidth`, so a long label is never cut off",table:{defaultValue:{summary:`false`}}},isMutedBadge:{control:`boolean`,description:"Paints the pill grey over `backgroundColor`, for something inactive",table:{defaultValue:{summary:`false`}}},onClick:{control:!1,description:`Called with the click event. The badge prevents the event's default action first`},onMouseOver:{control:!1,description:`Called when the pointer enters the badge or moves over it`},onMouseLeave:{control:!1,description:`Called when the pointer leaves the badge`},className:{control:`text`,description:`Extra class name on the outer element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`badge`}}}}},l=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(100px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),u={render:e=>(0,o.jsx)(a,{...e}),args:{label:24,onClick:s(),onMouseOver:s(),onMouseLeave:s()},parameters:{docs:{description:{story:`The badge as it usually appears: a count on the accent colour. Change any prop live in the Controls panel below, and set the label to 0 to see the badge disappear.`},source:{code:`<Badge label={24} />`}}}},d=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{label:3}),(0,o.jsx)(a,{label:`New`}),(0,o.jsx)(a,{label:`99+`}),(0,o.jsx)(a,{type:`high`,label:`High`,backgroundColor:r.mainRed})]}),f=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{label:`v1.2.3`,isVersionBadge:!0}),(0,o.jsx)(a,{label:`PRO`,isPaidBadge:!0,backgroundColor:`#EDC409`}),(0,o.jsx)(a,{label:`Muted`,isMutedBadge:!0})]}),p=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{label:`Default`}),(0,o.jsx)(a,{label:`Hovered`,isHovered:!0}),(0,o.jsx)(a,{label:`No Hover`,noHover:!0})]}),m=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(a,{label:`Custom`,backgroundColor:`#335EA3`,color:`#FFFFFF`,fontSize:`14px`,fontWeight:600,borderRadius:`8px`,padding:`4px 12px`}),(0,o.jsx)(a,{label:`Bordered`,border:`2px solid #333`,backgroundColor:`transparent`,color:`#333`}),(0,o.jsx)(a,{label:`Large`,maxWidth:`80px`,padding:`4px 16px`,fontSize:`14px`})]}),h={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:`The two looks a badge can take:

- **3**, **New**, **99+** — the usual round pill, as wide as its label, for a count or a short word
- **High** — the emphasised preset (\`type="high"\`), with squarer corners and more padding, for a marker that should stand out`},source:{code:`<Badge label={3} />
<Badge label="New" />
<Badge label="99+" />
<Badge type="high" label="High" backgroundColor={globalColors.mainRed} />`}}}},g={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:"Markers with a meaning of their own:\n\n- **v1.2.3** — a version number (`isVersionBadge`); on tablet-width screens and narrower it fills the width of its container\n- **PRO** — a paid-feature marker (`isPaidBadge`): the text stays white and the label is never cut off\n- **Muted** — a grey pill for something inactive (`isMutedBadge`)"},source:{code:`<Badge label="v1.2.3" isVersionBadge />
<Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
<Badge label="Muted" isMutedBadge />`}}}},_={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:`Hover and press each badge to compare:

- **Default** — the pill lightens on hover and darkens while pressed
- **Hovered** — shows the pointer cursor before the pointer arrives (\`isHovered\`); the colour still changes only under the real pointer
- **No Hover** — keeps the arrow cursor and its colour, for a badge that is only a marker (\`noHover\`)`},source:{code:`<Badge label="Default" />
<Badge label="Hovered" isHovered />
<Badge label="No Hover" noHover />`}}}},v={render:()=>(0,o.jsx)(m,{}),parameters:{docs:{description:{story:`For a place where the theme's pill does not fit:

- **Custom** — its own background, text colour, text size and weight, corners and padding
- **Bordered** — a transparent pill with a border around it (\`border\`)
- **Large** — a wider cap (\`maxWidth\`) and more padding for a longer label`},source:{code:`<Badge label="Custom" backgroundColor="#335EA3" color="#FFFFFF" fontSize="14px" fontWeight={600} borderRadius="8px" padding="4px 12px" />
<Badge label="Bordered" border="2px solid #333" backgroundColor="transparent" color="#333" />
<Badge label="Large" maxWidth="80px" padding="4px 16px" fontSize="14px" />`}}}},y={render:e=>(0,o.jsx)(a,{...e}),args:{label:`Click me`,onClick:s()},parameters:{docs:{description:{story:"A badge that opens something when clicked: click it and watch the Actions panel (`onClick`). It takes no keyboard focus, so offer the same action somewhere a keyboard user can reach it."},source:{code:`<Badge label="Click me" onClick={onOpen} />`}}}},b={render:()=>(0,o.jsx)(`div`,{style:{"--badge-bg":`#7B4FBF`,"--badge-radius":`12px`,"--badge-high-padding":`3px 14px`},children:(0,o.jsx)(a,{type:`high`,label:`Premium`})}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. The example is one `high` badge, because two of the three variables apply only to that type."},source:{code:`<div
  style={{
    "--badge-bg": "#7B4FBF",
    "--badge-radius": "12px",
    "--badge-high-padding": "3px 14px",
  }}
>
  <Badge type="high" label="Premium" />
</div>`}}}},x=[`Default`,`BadgeTypes`,`SpecialBadges`,`HoverStates`,`CustomStyled`,`InteractiveBadge`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Badge {...args} />,
  args: {
    label: 24,
    onClick: fn(),
    onMouseOver: fn(),
    onMouseLeave: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The badge as it usually appears: a count on the accent colour. Change any prop live in the Controls panel below, and set the label to 0 to see the badge disappear."
      },
      source: {
        code: \`<Badge label={24} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <BadgeTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The two looks a badge can take:

- **3**, **New**, **99+** — the usual round pill, as wide as its label, for a count or a short word
- **High** — the emphasised preset (\\\`type="high"\\\`), with squarer corners and more padding, for a marker that should stand out\`
      },
      source: {
        code: \`<Badge label={3} />
<Badge label="New" />
<Badge label="99+" />
<Badge type="high" label="High" backgroundColor={globalColors.mainRed} />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <SpecialBadgesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Markers with a meaning of their own:

- **v1.2.3** — a version number (\\\`isVersionBadge\\\`); on tablet-width screens and narrower it fills the width of its container
- **PRO** — a paid-feature marker (\\\`isPaidBadge\\\`): the text stays white and the label is never cut off
- **Muted** — a grey pill for something inactive (\\\`isMutedBadge\\\`)\`
      },
      source: {
        code: \`<Badge label="v1.2.3" isVersionBadge />
<Badge label="PRO" isPaidBadge backgroundColor="#EDC409" />
<Badge label="Muted" isMutedBadge />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <HoverStatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Hover and press each badge to compare:

- **Default** — the pill lightens on hover and darkens while pressed
- **Hovered** — shows the pointer cursor before the pointer arrives (\\\`isHovered\\\`); the colour still changes only under the real pointer
- **No Hover** — keeps the arrow cursor and its colour, for a badge that is only a marker (\\\`noHover\\\`)\`
      },
      source: {
        code: \`<Badge label="Default" />
<Badge label="Hovered" isHovered />
<Badge label="No Hover" noHover />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStyledTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`For a place where the theme's pill does not fit:

- **Custom** — its own background, text colour, text size and weight, corners and padding
- **Bordered** — a transparent pill with a border around it (\\\`border\\\`)
- **Large** — a wider cap (\\\`maxWidth\\\`) and more padding for a longer label\`
      },
      source: {
        code: \`<Badge label="Custom" backgroundColor="#335EA3" color="#FFFFFF" fontSize="14px" fontWeight={600} borderRadius="8px" padding="4px 12px" />
<Badge label="Bordered" border="2px solid #333" backgroundColor="transparent" color="#333" />
<Badge label="Large" maxWidth="80px" padding="4px 16px" fontSize="14px" />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Badge {...args} />,
  args: {
    label: "Click me",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A badge that opens something when clicked: click it and watch the Actions panel (\`onClick\`). It takes no keyboard focus, so offer the same action somewhere a keyboard user can reach it."
      },
      source: {
        code: \`<Badge label="Click me" onClick={onOpen} />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--badge-bg": "#7B4FBF",
    "--badge-radius": "12px",
    "--badge-high-padding": "3px 14px"
  } as CSSProperties}>
      <Badge type="high" label="Premium" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The example is one \\\`high\\\` badge, because two of the three variables apply only to that type.\`
      },
      source: {
        code: \`<div
  style={{
    "--badge-bg": "#7B4FBF",
    "--badge-radius": "12px",
    "--badge-high-padding": "3px 14px",
  }}
>
  <Badge type="high" label="Premium" />
</div>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}}})))()}S();export{h as BadgeTypes,b as CssCustomization,v as CustomStyled,u as Default,_ as HoverStates,y as InteractiveBadge,g as SpecialBadges,x as __namedExportsOrder,c as default};