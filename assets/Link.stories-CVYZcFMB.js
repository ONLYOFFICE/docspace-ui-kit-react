import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{t as n}from"./rootTooltip-D3FzIvov.js";import{n as r}from"./tooltip-DcisrCmM.js";import{i,n as a,r as o,t as s}from"./link-C_nB54e7.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{r(),a(),c=t(),{fn:l}=__STORYBOOK_MODULE_TEST__,u={title:`UI/Navigation/Link`,component:s,parameters:{},argTypes:{type:{control:`select`,options:Object.values(i),description:"`page` for a link that navigates to its `href`, with a solid underline on hover; `action` for a link that runs `onClick`, with a dashed underline on hover",table:{defaultValue:{summary:`page`}}},href:{control:`text`,description:"Address the link navigates to, as the anchor's `href`"},target:{control:`select`,options:Object.values(o),description:"Where the address opens: a new tab (`_blank`), the same frame (`_self`), the parent frame or the whole window"},rel:{control:`text`,description:"Relationship to the linked page, as the anchor's `rel`, e.g. `noopener noreferrer` for a new tab"},fontSize:{control:`text`,description:`Font size of the label; unset, it is 13px`},fontWeight:{control:`text`,description:"Font weight of the label; ignored while `isBold` is set"},lineHeight:{control:`text`,description:`Line height of the label; unset, the font size plus 6px`},color:{control:`color`,description:"Colour of the label: any CSS colour, or `accent` for the portal's accent colour, which leaves the label in its default colour where the portal does not define one"},textDecoration:{control:`select`,options:[`none`,`underline`,`line-through`,`overline`,`underline dotted`,`underline dashed`],description:`Line drawn under, over or through the label at all times; while set, it also replaces the underline shown on hover`},isBold:{control:`boolean`,description:`Renders the label at weight 700`,table:{defaultValue:{summary:`false`}}},isHovered:{control:`boolean`,description:`Shows the hover underline without a pointer over the link, for a row that highlights its link while the whole row is hovered`,table:{defaultValue:{summary:`false`}}},isSemitransparent:{control:`boolean`,description:`Halves the opacity, to mark a pending or inactive entity`,table:{defaultValue:{summary:`false`}}},isTextOverflow:{control:`boolean`,description:"Keeps the link within the width of its container; add `truncate` to end a long label with an ellipsis",table:{defaultValue:{summary:`false`}}},noHover:{control:`boolean`,description:`Removes the underline the link shows on hover`,table:{defaultValue:{summary:`false`}}},enableUserSelect:{control:`boolean`,description:`Whether the label can be selected with the mouse`,table:{defaultValue:{summary:`true`}}},truncate:{control:`boolean`,description:"Holds the label on one line and ends it with an ellipsis; needs `isTextOverflow` or a parent of bounded width",table:{defaultValue:{summary:`false`}}},title:{control:`text`,description:"Text of the tooltip shown on hover; it appears only where the app mounts `RootTooltip`"},ariaLabel:{control:`text`,description:`Accessible name of the link; unset, a string label is used as the name`},role:{control:`text`,description:"ARIA role of the anchor; an action link needs `button`, since an anchor without `href` has no role"},tabIndex:{control:`number`,description:"Position in the Tab order; an action link needs `0` to be reachable from the keyboard"},onClick:{description:`Called with the event when the link is clicked`},onKeyDown:{description:`Called with the event on a key press while the link has focus; an action link runs its action from Enter and Space here`},id:{control:`text`,description:"`id` of the anchor"},dataTestId:{control:`text`,description:"Value of `data-testid` on the anchor",table:{defaultValue:{summary:`link`}}},label:{control:!1,description:"Ignored: the label comes from `children`, and this prop reaches the anchor as an unknown attribute"}}},d=e=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:e.children}),f={render:e=>(0,c.jsx)(s,{...e,children:`Simple link`}),args:{href:`https://example.com`,type:i.page,fontSize:`13px`,target:o.blank,onClick:l()},parameters:{docs:{description:{story:`A page link that opens its address in a new tab. Hover it to see the underline, and change any other prop live in the Controls panel below.`},source:{code:`<Link
  type={LinkType.page}
  href="https://example.com"
  fontSize="13px"
  target={LinkTarget.blank}
>
  Simple link
</Link>`}}}},p=()=>(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isBold:!0,children:`Bold page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,children:`Regular page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isHovered:!0,children:`Hovered page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isSemitransparent:!0,children:`Semitransparent page link`})]}),m=()=>(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.action,onClick:()=>{},isBold:!0,children:`Bold action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},children:`Regular action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},isHovered:!0,children:`Hovered action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},isSemitransparent:!0,children:`Semitransparent action link`})]}),h=()=>(0,c.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:16},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`strong`,{children:`Page links:`}),(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isBold:!0,children:`Bold page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,children:`Regular page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isHovered:!0,children:`Hovered page link`}),(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isSemitransparent:!0,children:`Semitransparent page link`})]})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`strong`,{children:`Action links:`}),(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.action,onClick:()=>{},isBold:!0,children:`Bold action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},children:`Regular action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},isHovered:!0,children:`Hovered action link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},isSemitransparent:!0,children:`Semitransparent action link`})]})]})]}),g=()=>(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isHovered:!0,children:`Hovered link`}),_=()=>(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isSemitransparent:!0,children:`Semitransparent link`}),v=()=>(0,c.jsx)(`div`,{style:{width:200},children:(0,c.jsx)(s,{type:i.page,href:`https://example.com`,isTextOverflow:!0,truncate:!0,children:`This is a very long link that should demonstrate text overflow behavior`})}),y=()=>(0,c.jsx)(s,{type:i.page,href:`https://example.com`,noHover:!0,children:`No hover effect link`}),b={render:()=>(0,c.jsx)(p,{}),parameters:{docs:{description:{story:"Page links navigate to another address; hover the regular one to see the solid underline a page link grows. **Bold page link** (`isBold`), **Hovered page link** keeps the underline on without a pointer (`isHovered`), **Semitransparent page link** is drawn at half opacity (`isSemitransparent`)."},source:{code:`<Link type={LinkType.page} href="https://example.com" isBold>Bold page link</Link>
<Link type={LinkType.page} href="https://example.com">Regular page link</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered page link</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent page link</Link>`}}}},x={render:()=>(0,c.jsx)(m,{}),parameters:{docs:{description:{story:`Action links run code in place instead of navigating, for filtering a list or opening a menu; hover the regular one to see the dashed underline that sets them apart from page links. The four links show the same states as the page links above.`},source:{code:`<Link type={LinkType.action} onClick={handleClick} isBold>Bold action link</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular action link</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered action link</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent action link</Link>`}}}},S={render:()=>(0,c.jsx)(h,{}),parameters:{docs:{description:{story:`Page and action links side by side, to compare the two underlines and the states each type shares: bold, hovered and semitransparent.`},source:{code:`// Page links
<Link type={LinkType.page} href="https://example.com" isBold>Bold</Link>
<Link type={LinkType.page} href="https://example.com">Regular</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent</Link>

// Action links
<Link type={LinkType.action} onClick={handleClick} isBold>Bold</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent</Link>`}}}},C={render:()=>(0,c.jsx)(g,{}),parameters:{docs:{description:{story:"The link shows its hover underline with no pointer over it, as it should inside a row that highlights its link while the whole row is hovered (`isHovered`)."},source:{code:`<Link type={LinkType.page} href="https://example.com" isHovered>Hovered link</Link>`}}}},w={render:()=>(0,c.jsx)(_,{}),parameters:{docs:{description:{story:"The link at half opacity, to mark an entity that is pending or inactive while keeping it clickable (`isSemitransparent`)."},source:{code:`<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent link</Link>`}}}},T={render:()=>(0,c.jsx)(v,{}),parameters:{docs:{description:{story:"A label longer than its 200px container stays on one line and ends with an ellipsis, so it cannot push the layout wider (`isTextOverflow` with `truncate`)."},source:{code:`<div style={{ width: 200 }}>
  <Link type={LinkType.page} href="https://example.com" isTextOverflow truncate>
    Very long link text...
  </Link>
</div>`}}}},E={render:()=>(0,c.jsx)(y,{}),parameters:{docs:{description:{story:"Hover the link: no underline appears, for a link whose surroundings already show that it is clickable (`noHover`)."},source:{code:`<Link type={LinkType.page} href="https://example.com" noHover>No hover effect link</Link>`}}}},D=()=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s,{type:i.page,href:`https://example.com`,title:`Opens the shared folder`,children:`Shared folder`}),(0,c.jsx)(n,{})]}),O={render:()=>(0,c.jsx)(D,{}),parameters:{docs:{description:{story:"Hover the link to read what it opens, for a label too short to say it (`title`). The text appears in the app's shared tooltip, not the browser's native one, so it shows only where the app mounts `RootTooltip`."},source:{code:`<Link type={LinkType.page} href="https://example.com" title="Opens the shared folder">
  Shared folder
</Link>
<RootTooltip />`}}}},k=()=>(0,c.jsx)(s,{type:i.action,role:`button`,tabIndex:0,onClick:()=>{},onKeyDown:()=>{},children:`Move to archive`}),A={render:()=>(0,c.jsx)(k,{}),parameters:{docs:{description:{story:"Press Tab to reach the link: an action link has no address, so without a role and a tab stop the keyboard skips it and a screen reader does not announce it. Here it is announced as a button (`role`), sits in the Tab order (`tabIndex`) and runs its action from the keys the handler checks (`onKeyDown`)."},source:{code:`<Link
  type={LinkType.action}
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick(e);
  }}
>
  Move to archive
</Link>`}}}},j=()=>(0,c.jsx)(s,{type:i.page,href:`https://example.com`,color:`#2E7D32`,children:`Custom colour link`}),M={render:()=>(0,c.jsx)(j,{}),parameters:{docs:{description:{story:"Colour draws the eye to a link inside plain text: the label takes any CSS colour (`color`). The value `accent` uses the accent colour of the portal instead, which this Storybook does not define, so it is not shown here."},source:{code:`<Link type={LinkType.page} href="https://example.com" color="#2E7D32">
  Custom colour link
</Link>`}}}},N=()=>(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.page,href:`https://example.com`,textDecoration:`underline`,children:`Underlined link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},textDecoration:`underline dashed`,children:`Dashed action link`})]}),P={render:()=>(0,c.jsx)(N,{}),parameters:{docs:{description:{story:"A link inside a paragraph is easier to spot when it is underlined before the pointer reaches it. **Underlined link** keeps a solid underline, **Dashed action link** a dashed one (`textDecoration`); the line stays the same on hover."},source:{code:`<Link type={LinkType.page} href="https://example.com" textDecoration="underline">
  Underlined link
</Link>
<Link type={LinkType.action} onClick={handleClick} textDecoration="underline dashed">
  Dashed action link
</Link>`}}}},F={render:()=>(0,c.jsx)(`div`,{style:{"--link-text-color":`#9C27B0`,"--link-hover-page-text-decoration":`none`,"--link-hover-text-decoration":`underline wavy`},children:(0,c.jsxs)(d,{children:[(0,c.jsx)(s,{type:i.page,href:`https://example.com`,children:`Custom color link`}),(0,c.jsx)(s,{type:i.action,onClick:()=>{},style:{"--link-text-decoration":`underline dotted`,"--link-line-height":`32px`},children:`Custom action link`})]})}),parameters:{docs:{description:{story:"Overridable variables set on a wrapper and on the link itself -- the variables are listed under CSS variables on this page.\n\n**Custom color link** is a page link: it takes the colour from the wrapper, and on hover shows no underline (`--link-hover-page-text-decoration`). **Custom action link** is there for the variables an action link reads: hover it for a wavy underline (`--link-hover-text-decoration`); at rest it carries a dotted underline and a taller line (`--link-text-decoration`, `--link-line-height`, through its `style` prop). `--link-display` is not shown: in a column of links its effect cannot be seen."},source:{code:`<div
  style={{
    "--link-text-color": "#9C27B0",
    "--link-hover-page-text-decoration": "none",
    "--link-hover-text-decoration": "underline wavy",
  }}
>
  <Link type={LinkType.page} href="https://example.com">
    Custom color link
  </Link>
  <Link
    type={LinkType.action}
    onClick={handleClick}
    style={{
      "--link-text-decoration": "underline dotted",
      "--link-line-height": "32px",
    }}
  >
    Custom action link
  </Link>
</div>`}}}},I=[`Default`,`PageLinks`,`ActionLinks`,`AllVariants`,`HoveredState`,`SemitransparentState`,`WithTextOverflow`,`NoHoverEffect`,`WithTooltip`,`KeyboardAccessibleAction`,`CustomColor`,`TextDecorations`,`CssCustomization`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Link {...args}>Simple link</Link>,
  args: {
    href: "https://example.com",
    type: LinkType.page,
    fontSize: "13px",
    target: LinkTarget.blank,
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A page link that opens its address in a new tab. Hover it to see the underline, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Link
  type={LinkType.page}
  href="https://example.com"
  fontSize="13px"
  target={LinkTarget.blank}
>
  Simple link
</Link>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <PageLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Page links navigate to another address; hover the regular one to see the solid underline a page link grows. **Bold page link** (\`isBold\`), **Hovered page link** keeps the underline on without a pointer (\`isHovered\`), **Semitransparent page link** is drawn at half opacity (\`isSemitransparent\`)."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" isBold>Bold page link</Link>
<Link type={LinkType.page} href="https://example.com">Regular page link</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered page link</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent page link</Link>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <ActionLinksTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Action links run code in place instead of navigating, for filtering a list or opening a menu; hover the regular one to see the dashed underline that sets them apart from page links. The four links show the same states as the page links above."
      },
      source: {
        code: \`<Link type={LinkType.action} onClick={handleClick} isBold>Bold action link</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular action link</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered action link</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent action link</Link>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Page and action links side by side, to compare the two underlines and the states each type shares: bold, hovered and semitransparent."
      },
      source: {
        code: \`// Page links
<Link type={LinkType.page} href="https://example.com" isBold>Bold</Link>
<Link type={LinkType.page} href="https://example.com">Regular</Link>
<Link type={LinkType.page} href="https://example.com" isHovered>Hovered</Link>
<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent</Link>

// Action links
<Link type={LinkType.action} onClick={handleClick} isBold>Bold</Link>
<Link type={LinkType.action} onClick={handleClick}>Regular</Link>
<Link type={LinkType.action} onClick={handleClick} isHovered>Hovered</Link>
<Link type={LinkType.action} onClick={handleClick} isSemitransparent>Semitransparent</Link>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The link shows its hover underline with no pointer over it, as it should inside a row that highlights its link while the whole row is hovered (\`isHovered\`)."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" isHovered>Hovered link</Link>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <SemitransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The link at half opacity, to mark an entity that is pending or inactive while keeping it clickable (\`isSemitransparent\`)."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" isSemitransparent>Semitransparent link</Link>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A label longer than its 200px container stays on one line and ends with an ellipsis, so it cannot push the layout wider (\`isTextOverflow\` with \`truncate\`)."
      },
      source: {
        code: \`<div style={{ width: 200 }}>
  <Link type={LinkType.page} href="https://example.com" isTextOverflow truncate>
    Very long link text...
  </Link>
</div>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <NoHoverTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Hover the link: no underline appears, for a link whose surroundings already show that it is clickable (\`noHover\`)."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" noHover>No hover effect link</Link>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <WithTooltipTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Hover the link to read what it opens, for a label too short to say it (\`title\`). The text appears in the app's shared tooltip, not the browser's native one, so it shows only where the app mounts \`RootTooltip\`."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" title="Opens the shared folder">
  Shared folder
</Link>
<RootTooltip />\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <KeyboardActionTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Press Tab to reach the link: an action link has no address, so without a role and a tab stop the keyboard skips it and a screen reader does not announce it. Here it is announced as a button (\`role\`), sits in the Tab order (\`tabIndex\`) and runs its action from the keys the handler checks (\`onKeyDown\`)."
      },
      source: {
        code: \`<Link
  type={LinkType.action}
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick(e);
  }}
>
  Move to archive
</Link>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <CustomColorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Colour draws the eye to a link inside plain text: the label takes any CSS colour (\`color\`). The value \`accent\` uses the accent colour of the portal instead, which this Storybook does not define, so it is not shown here."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" color="#2E7D32">
  Custom colour link
</Link>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <TextDecorationsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A link inside a paragraph is easier to spot when it is underlined before the pointer reaches it. **Underlined link** keeps a solid underline, **Dashed action link** a dashed one (\`textDecoration\`); the line stays the same on hover."
      },
      source: {
        code: \`<Link type={LinkType.page} href="https://example.com" textDecoration="underline">
  Underlined link
</Link>
<Link type={LinkType.action} onClick={handleClick} textDecoration="underline dashed">
  Dashed action link
</Link>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--link-text-color": "#9C27B0",
    "--link-hover-page-text-decoration": "none",
    "--link-hover-text-decoration": "underline wavy"
  } as CSSProperties}>
      <Wrapper>
        <Link type={LinkType.page} href="https://example.com">
          Custom color link
        </Link>
        <Link type={LinkType.action} onClick={() => {}} style={{
        "--link-text-decoration": "underline dotted",
        "--link-line-height": "32px"
      } as CSSProperties}>
          Custom action link
        </Link>
      </Wrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Overridable variables set on a wrapper and on the link itself -- the variables are listed under CSS variables on this page.

**Custom color link** is a page link: it takes the colour from the wrapper, and on hover shows no underline (\\\`--link-hover-page-text-decoration\\\`). **Custom action link** is there for the variables an action link reads: hover it for a wavy underline (\\\`--link-hover-text-decoration\\\`); at rest it carries a dotted underline and a taller line (\\\`--link-text-decoration\\\`, \\\`--link-line-height\\\`, through its \\\`style\\\` prop). \\\`--link-display\\\` is not shown: in a column of links its effect cannot be seen.\`
      },
      source: {
        code: \`<div
  style={{
    "--link-text-color": "#9C27B0",
    "--link-hover-page-text-decoration": "none",
    "--link-hover-text-decoration": "underline wavy",
  }}
>
  <Link type={LinkType.page} href="https://example.com">
    Custom color link
  </Link>
  <Link
    type={LinkType.action}
    onClick={handleClick}
    style={{
      "--link-text-decoration": "underline dotted",
      "--link-line-height": "32px",
    }}
  >
    Custom action link
  </Link>
</div>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}}})))()}L();export{x as ActionLinks,S as AllVariants,F as CssCustomization,M as CustomColor,f as Default,C as HoveredState,A as KeyboardAccessibleAction,E as NoHoverEffect,b as PageLinks,w as SemitransparentState,P as TextDecorations,T as WithTextOverflow,O as WithTooltip,I as __namedExportsOrder,u as default};