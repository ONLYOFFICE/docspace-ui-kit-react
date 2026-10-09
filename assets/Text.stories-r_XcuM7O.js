import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{t as n}from"./rootTooltip-D3FzIvov.js";import{n as r}from"./tooltip-DcisrCmM.js";import{r as i,t as a}from"./text-Cz_cI6Yf.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{r(),i(),o=t(),s={title:`UI/Data display/Text`,component:a,parameters:{},argTypes:{as:{control:`select`,options:[`p`,`span`,`div`,`label`,`a`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`],description:"Element to render the text as; wins over `tag` when both are set",table:{defaultValue:{summary:`p`}}},tag:{control:`text`,description:"Tag name of the element to render, used only while `as` is unset"},children:{control:`text`,description:`Text to render`},fontSize:{control:`text`,description:"Font size, set as an inline style; a `fontSize` in `style` wins over it",table:{defaultValue:{summary:`13px`}}},fontWeight:{control:`text`,description:"Font weight, set as an inline style; ignored while `isBold` is on",table:{defaultValue:{summary:`400`}}},color:{control:`color`,description:`Text colour, set as an inline style; without it the text takes the colour of its parent`},backgroundColor:{control:`color`,description:`Background colour behind the text, set as an inline style`},textAlign:{control:`select`,options:[`left`,`center`,`right`,`justify`],description:`Aligns the lines to the left, the centre or the right, or stretches them to both edges; without it the text follows its parent's alignment`},lineHeight:{control:`text`,description:`Height of each line, set as an inline style`},dir:{control:`select`,options:[`ltr`,`rtl`,`auto`],description:"Writing direction: `ltr` and `rtl` set it on the element; `auto` lets the browser pick it from the text and wraps the text in a span that clicks pass through"},view:{control:`select`,options:[void 0,`tile`],description:"`tile` cuts the text to two lines with an ellipsis, and only while `dir` is `auto`; any other value does nothing"},isBold:{control:`boolean`,description:"Sets the weight to 700, overriding `fontWeight`",table:{defaultValue:{summary:`false`}}},isItalic:{control:`boolean`,description:`Renders the text in italics`,table:{defaultValue:{summary:`false`}}},isInline:{control:`boolean`,description:`Makes the element an inline block, so it sits on a line beside other text`,table:{defaultValue:{summary:`false`}}},truncate:{control:`boolean`,description:`Keeps the text on one line and ends it with an ellipsis; it needs a parent of bounded width, otherwise the element grows instead`,table:{defaultValue:{summary:`false`}}},noSelect:{control:`boolean`,description:`Stops the reader from selecting the text`,table:{defaultValue:{summary:`false`}}},title:{control:`text`,description:"Text of the kit's shared tooltip that opens when the pointer rests on the text; it needs `RootTooltip` mounted"},onClick:{action:`onClick`,description:`Called with the event when the text is clicked`},htmlFor:{control:`text`,description:'Passed to the element unchanged, for `as="label"`: the `id` of the field the text names'},href:{control:`text`,description:'Passed to the element unchanged, for `as="a"`'},rel:{control:`text`,description:'Passed to the element unchanged, for `as="a"`'},tabIndex:{control:`number`,description:"Passed to the element unchanged; a focusable text element also needs a `role` from you"},role:{control:`text`,description:"ARIA role of the element, passed unchanged: `status` or `alert` for a line that reports an outcome, `button` alongside `tabIndex` and `onClick`"},"aria-label":{control:`text`,description:`Accessible name, passed unchanged, for text whose content is not what should be announced`},"aria-live":{control:`select`,options:[void 0,`off`,`polite`,`assertive`],description:`Passed unchanged, so a screen reader reads the text out when it changes`},"aria-hidden":{control:`boolean`,description:`Passed unchanged, hiding decorative text that repeats what is already read`},id:{control:`text`,description:"The element's own `id`"},className:{control:!1,description:`Class name added after the component's own classes`},style:{control:!1,description:`Inline styles of the element, merged over the style props, so its values win`},display:{control:!1,description:"Ignored: written onto the element as an unknown attribute and does not change the layout; use `isInline` or `style`"},containerWidth:{control:!1,description:"Not read by the text itself: `RowContent` and `TileContent` read it off the child as the width of the slot they put it in"},containerMinWidth:{control:!1,description:"Not read by the text itself: `RowContent` reads it off the child as the minimum width of a side slot"},dataTestId:{control:`text`,description:"Value of `data-testid` on the element",table:{defaultValue:{summary:`text`}}},ref:{control:!1,description:"Attached to the rendered element, whatever `as` made it"}}},c=e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:e.children}),l={render:e=>(0,o.jsx)(a,{...e}),args:{children:`Sample text content`,as:`p`,fontSize:`13px`},parameters:{docs:{description:{story:`A paragraph at the kit's body size and regular weight, the starting point for any line of text; change any other prop live in the Controls panel below.`},source:{code:`<Text as="p" fontSize="13px">
  Sample text content
</Text>`}}}},u=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{fontSize:`10px`,children:`10px - Extra small text`}),(0,o.jsx)(a,{fontSize:`12px`,children:`12px - Small text`}),(0,o.jsx)(a,{fontSize:`13px`,children:`13px - Default text`}),(0,o.jsx)(a,{fontSize:`14px`,children:`14px - Medium text`}),(0,o.jsx)(a,{fontSize:`16px`,children:`16px - Large text`}),(0,o.jsx)(a,{fontSize:`18px`,children:`18px - Extra large text`}),(0,o.jsx)(a,{fontSize:`24px`,children:`24px - Display text`})]}),d=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{fontWeight:`300`,children:`Light (300)`}),(0,o.jsx)(a,{fontWeight:`400`,children:`Regular (400)`}),(0,o.jsx)(a,{fontWeight:`500`,children:`Medium (500)`}),(0,o.jsx)(a,{fontWeight:`600`,children:`Semibold (600)`}),(0,o.jsx)(a,{fontWeight:`700`,children:`Bold (700)`})]}),f=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{children:`Regular text`}),(0,o.jsx)(a,{isBold:!0,children:`Bold text`}),(0,o.jsx)(a,{isItalic:!0,children:`Italic text`}),(0,o.jsx)(a,{isBold:!0,isItalic:!0,children:`Bold and italic text`})]}),p=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{textAlign:`left`,children:`Left aligned text`}),(0,o.jsx)(a,{textAlign:`center`,children:`Center aligned text`}),(0,o.jsx)(a,{textAlign:`right`,children:`Right aligned text`}),(0,o.jsx)(a,{textAlign:`justify`,children:`Justified text that spans multiple lines to demonstrate the justify alignment behavior in longer paragraphs of content.`})]}),m=()=>(0,o.jsxs)(`div`,{children:[(0,o.jsx)(a,{isInline:!0,children:`First inline text`}),` `,(0,o.jsx)(a,{isInline:!0,children:`Second inline text`}),` `,(0,o.jsx)(a,{isInline:!0,isBold:!0,children:`Third bold inline text`})]}),h=()=>(0,o.jsx)(`div`,{style:{width:200},children:(0,o.jsx)(a,{truncate:!0,children:`This is a very long text that will be truncated when it exceeds the container width`})}),g=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{as:`h1`,fontSize:`32px`,fontWeight:`700`,children:`Heading 1`}),(0,o.jsx)(a,{as:`h2`,fontSize:`28px`,fontWeight:`700`,children:`Heading 2`}),(0,o.jsx)(a,{as:`h3`,fontSize:`24px`,fontWeight:`600`,children:`Heading 3`}),(0,o.jsx)(a,{as:`h4`,fontSize:`20px`,fontWeight:`600`,children:`Heading 4`}),(0,o.jsx)(a,{as:`h5`,fontSize:`16px`,fontWeight:`600`,children:`Heading 5`}),(0,o.jsx)(a,{as:`h6`,fontSize:`14px`,fontWeight:`600`,children:`Heading 6`})]}),_=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{dir:`ltr`,children:`English text (LTR)`}),(0,o.jsx)(a,{dir:`rtl`,textAlign:`right`,children:`مرحبا بالعالم - Hello World (RTL)`}),(0,o.jsx)(a,{dir:`auto`,children:`English text with auto direction`}),(0,o.jsx)(a,{dir:`auto`,children:`نص عربي مع اتجاه تلقائي`})]}),v=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{children:`This text can be selected`}),(0,o.jsx)(a,{noSelect:!0,children:`This text cannot be selected`})]}),y={render:()=>(0,o.jsx)(u,{}),parameters:{docs:{description:{story:"Seven lines from 10px to 24px, to pick a size against the 13px body text (`fontSize`)."},source:{code:`<Text fontSize="10px">10px - Extra small text</Text>
<Text fontSize="12px">12px - Small text</Text>
<Text fontSize="13px">13px - Default text</Text>
<Text fontSize="14px">14px - Medium text</Text>
<Text fontSize="16px">16px - Large text</Text>
<Text fontSize="18px">18px - Extra large text</Text>
<Text fontSize="24px">24px - Display text</Text>`}}}},b={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"Five lines from light (300) to bold (700), to compare weights at the same size (`fontWeight`); a weight shows only if the font carries it."},source:{code:`<Text fontWeight="300">Light (300)</Text>
<Text fontWeight="400">Regular (400)</Text>
<Text fontWeight="500">Medium (500)</Text>
<Text fontWeight="600">Semibold (600)</Text>
<Text fontWeight="700">Bold (700)</Text>`}}}},x={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:"Emphasis without choosing a weight: **Bold text** sets 700 (`isBold`), **Italic text** slants it (`isItalic`), and the last line combines both."},source:{code:`<Text>Regular text</Text>
<Text isBold>Bold text</Text>
<Text isItalic>Italic text</Text>
<Text isBold isItalic>Bold and italic text</Text>`}}}},S={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"The four alignments in one column (`textAlign`); the justified paragraph stretches every line but the last to both edges."},source:{code:`<Text textAlign="left">Left aligned text</Text>
<Text textAlign="center">Center aligned text</Text>
<Text textAlign="right">Right aligned text</Text>
<Text textAlign="justify">Justified text...</Text>`}}}},C={render:()=>(0,o.jsx)(m,{}),parameters:{docs:{description:{story:"Three pieces of text on one line, for mixing styles inside a sentence without a wrapper (`isInline`)."},source:{code:`<Text isInline>First inline text</Text>
<Text isInline>Second inline text</Text>
<Text isInline isBold>Third bold inline text</Text>`}}}},w={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"A sentence longer than its 200px box stays on one line and ends with an ellipsis (`truncate`); without a box of bounded width it would grow instead."},source:{code:`<div style={{ width: 200 }}>
  <Text truncate>This is a very long text that will be truncated...</Text>
</div>`}}}},T={render:()=>(0,o.jsx)(g,{}),parameters:{docs:{description:{story:"Real `h1`-`h6` elements for a document outline, each given its size and weight by hand (`as`, `fontSize`, `fontWeight`); `Heading` carries these sizes already."},source:{code:`<Text as="h1" fontSize="32px" fontWeight="700">Heading 1</Text>
<Text as="h2" fontSize="28px" fontWeight="700">Heading 2</Text>
<Text as="h3" fontSize="24px" fontWeight="600">Heading 3</Text>
<Text as="h4" fontSize="20px" fontWeight="600">Heading 4</Text>
<Text as="h5" fontSize="16px" fontWeight="600">Heading 5</Text>
<Text as="h6" fontSize="14px" fontWeight="600">Heading 6</Text>`}}}},E={render:()=>(0,o.jsx)(_,{}),parameters:{docs:{description:{story:'For text whose language is not known in advance: the first line is set left to right and the second right to left (`dir`); the last two leave the direction to the browser, which reads it from the text itself (`dir="auto"`).'},source:{code:`<Text dir="ltr">English text (LTR)</Text>
<Text dir="rtl" textAlign="right">مرحبا بالعالم (RTL)</Text>
<Text dir="auto">Auto-detected direction</Text>`}}}},D={render:()=>(0,o.jsx)(v,{}),parameters:{docs:{description:{story:"For captions that should not be copied by accident: drag across both lines, and only the first one is selected (`noSelect`)."},source:{code:`<Text>This text can be selected</Text>
<Text noSelect>This text cannot be selected</Text>`}}}},O={render:()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a,{isInline:!0,title:`Last edited on 12 March`,children:`Updated recently`}),(0,o.jsx)(n,{})]}),parameters:{docs:{description:{story:"For text that needs a word of explanation without taking space on the page: rest the pointer on the line to read the tooltip (`title`). It opens the kit's shared tooltip, which needs `RootTooltip` mounted, as this story does."},source:{code:`<Text isInline title="Last edited on 12 March">
  Updated recently
</Text>
<RootTooltip />`}}}},k={render:()=>(0,o.jsx)(`div`,{style:{"--text-size":`18px`,"--text-weight":`600`},children:(0,o.jsx)(a,{children:`Semi-bold larger text via CSS vars`})}),parameters:{docs:{description:{story:`Both variables set on one wrapper -- the variables are listed under CSS variables on this page. The line of text inside comes out larger and semibold.`},source:{code:`<div
  style={{
    "--text-size": "18px",
    "--text-weight": "600",
  }}
>
  <Text>Semi-bold larger text via CSS vars</Text>
</div>`}}}},A=[`Default`,`FontSizes`,`FontWeights`,`TextStyles`,`TextAlignment`,`InlineText`,`TruncatedText`,`HeadingElements`,`Direction`,`NoSelectText`,`WithTooltip`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Text {...args} />,
  args: {
    children: "Sample text content",
    as: "p",
    fontSize: "13px"
  },
  parameters: {
    docs: {
      description: {
        story: "A paragraph at the kit's body size and regular weight, the starting point for any line of text; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Text as="p" fontSize="13px">
  Sample text content
</Text>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <FontSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Seven lines from 10px to 24px, to pick a size against the 13px body text (\`fontSize\`)."
      },
      source: {
        code: \`<Text fontSize="10px">10px - Extra small text</Text>
<Text fontSize="12px">12px - Small text</Text>
<Text fontSize="13px">13px - Default text</Text>
<Text fontSize="14px">14px - Medium text</Text>
<Text fontSize="16px">16px - Large text</Text>
<Text fontSize="18px">18px - Extra large text</Text>
<Text fontSize="24px">24px - Display text</Text>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <FontWeightsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Five lines from light (300) to bold (700), to compare weights at the same size (\`fontWeight\`); a weight shows only if the font carries it."
      },
      source: {
        code: \`<Text fontWeight="300">Light (300)</Text>
<Text fontWeight="400">Regular (400)</Text>
<Text fontWeight="500">Medium (500)</Text>
<Text fontWeight="600">Semibold (600)</Text>
<Text fontWeight="700">Bold (700)</Text>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <TextStylesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Emphasis without choosing a weight: **Bold text** sets 700 (\`isBold\`), **Italic text** slants it (\`isItalic\`), and the last line combines both."
      },
      source: {
        code: \`<Text>Regular text</Text>
<Text isBold>Bold text</Text>
<Text isItalic>Italic text</Text>
<Text isBold isItalic>Bold and italic text</Text>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <TextAlignmentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The four alignments in one column (\`textAlign\`); the justified paragraph stretches every line but the last to both edges."
      },
      source: {
        code: \`<Text textAlign="left">Left aligned text</Text>
<Text textAlign="center">Center aligned text</Text>
<Text textAlign="right">Right aligned text</Text>
<Text textAlign="justify">Justified text...</Text>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <InlineTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Three pieces of text on one line, for mixing styles inside a sentence without a wrapper (\`isInline\`)."
      },
      source: {
        code: \`<Text isInline>First inline text</Text>
<Text isInline>Second inline text</Text>
<Text isInline isBold>Third bold inline text</Text>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A sentence longer than its 200px box stays on one line and ends with an ellipsis (\`truncate\`); without a box of bounded width it would grow instead."
      },
      source: {
        code: \`<div style={{ width: 200 }}>
  <Text truncate>This is a very long text that will be truncated...</Text>
</div>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <HeadingElementsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Real \`h1\`-\`h6\` elements for a document outline, each given its size and weight by hand (\`as\`, \`fontSize\`, \`fontWeight\`); \`Heading\` carries these sizes already."
      },
      source: {
        code: \`<Text as="h1" fontSize="32px" fontWeight="700">Heading 1</Text>
<Text as="h2" fontSize="28px" fontWeight="700">Heading 2</Text>
<Text as="h3" fontSize="24px" fontWeight="600">Heading 3</Text>
<Text as="h4" fontSize="20px" fontWeight="600">Heading 4</Text>
<Text as="h5" fontSize="16px" fontWeight="600">Heading 5</Text>
<Text as="h6" fontSize="14px" fontWeight="600">Heading 6</Text>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <DirectionTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'For text whose language is not known in advance: the first line is set left to right and the second right to left (\`dir\`); the last two leave the direction to the browser, which reads it from the text itself (\`dir="auto"\`).'
      },
      source: {
        code: \`<Text dir="ltr">English text (LTR)</Text>
<Text dir="rtl" textAlign="right">مرحبا بالعالم (RTL)</Text>
<Text dir="auto">Auto-detected direction</Text>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <NoSelectTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For captions that should not be copied by accident: drag across both lines, and only the first one is selected (\`noSelect\`)."
      },
      source: {
        code: \`<Text>This text can be selected</Text>
<Text noSelect>This text cannot be selected</Text>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <Text isInline title="Last edited on 12 March">
        Updated recently
      </Text>
      <RootTooltip />
    </>,
  parameters: {
    docs: {
      description: {
        story: "For text that needs a word of explanation without taking space on the page: rest the pointer on the line to read the tooltip (\`title\`). It opens the kit's shared tooltip, which needs \`RootTooltip\` mounted, as this story does."
      },
      source: {
        code: \`<Text isInline title="Last edited on 12 March">
  Updated recently
</Text>
<RootTooltip />\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--text-size": "18px",
    "--text-weight": "600"
  } as CSSProperties}>
      <Text>Semi-bold larger text via CSS vars</Text>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both variables set on one wrapper -- the variables are listed under CSS variables on this page. The line of text inside comes out larger and semibold.\`
      },
      source: {
        code: \`<div
  style={{
    "--text-size": "18px",
    "--text-weight": "600",
  }}
>
  <Text>Semi-bold larger text via CSS vars</Text>
</div>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}}})))()}j();export{k as CssCustomization,l as Default,E as Direction,y as FontSizes,b as FontWeights,T as HeadingElements,C as InlineText,D as NoSelectText,S as TextAlignment,x as TextStyles,w as TruncatedText,O as WithTooltip,A as __namedExportsOrder,s as default};