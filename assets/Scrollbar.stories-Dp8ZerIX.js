import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./Scrollbar-Tkb6Sv30.js";var i,a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i=t(),a={title:`UI/Layout/Scrollbar`,component:r,parameters:{},argTypes:{autoHide:{control:`boolean`,description:`Hides the tracks until the content is scrolled or the pointer moves over it, and fades them out again three seconds later`,table:{defaultValue:{summary:`true`}}},fixedSize:{control:`boolean`,description:`Keeps the thumb at its wider 8px thickness on desktop instead of widening it only while the pointer is over the track`,table:{defaultValue:{summary:`false`}}},paddingAfterLastItem:{control:`text`,description:`Space below the last item inside the scrolling area, as a CSS length`},paddingInlineEnd:{control:`text`,description:`Space between the content and the side the vertical track is on, as a CSS length; replaces the default 17px (8px on screens up to 600px wide)`},noScrollY:{control:`boolean`,description:`Disables vertical scrolling`,table:{defaultValue:{summary:`false`}}},noScrollX:{control:`boolean`,description:`Disables horizontal scrolling`,table:{defaultValue:{summary:`false`}}},rtl:{control:`boolean`,description:`Puts the vertical track on the left edge when true and on the right when false; follows the interface direction when not set`},tabIndex:{control:`number`,description:"Position of the scrolling area in the tab order; -1 keeps it out of the tab order, `null` removes the attribute",table:{defaultValue:{summary:`-1`}}},autoFocus:{control:`boolean`,description:`Moves focus to the scrolling area after the first render`,table:{defaultValue:{summary:`false`}}},translateContentSizeYToHolder:{control:`boolean`,description:`Gives the box the height of its content, so it grows with the content instead of filling its parent`,table:{defaultValue:{summary:`false`}}},translateContentSizeXToHolder:{control:`boolean`,description:`Gives the box the width of its content, so it grows with the content instead of filling its parent`,table:{defaultValue:{summary:`false`}}},translateContentSizesToHolder:{control:`boolean`,description:`Gives the box both the height and the width of its content`,table:{defaultValue:{summary:`false`}}},createContext:{control:`boolean`,description:`Publishes the scrollbar instance on a React context for the components rendered inside it`,table:{defaultValue:{summary:`false`}}},onScroll:{action:`onScroll`,description:`Called with the native scroll event as the content scrolls`},id:{control:`text`,description:`Id of the outer element`},className:{control:`text`,description:`Class added to the outer element`},style:{control:`object`,description:`Inline styles of the outer element, usually its width and height`},scrollClass:{control:`text`,description:`Class added to the element that scrolls`},scrollBodyClassName:{control:`text`,description:`Class added to the element that holds the content`},ref:{control:!1,description:`Receives the scrollbar instance, with its scroll methods and elements`},contentRef:{control:!1,description:`Receives the element that holds the content`},children:{control:!1,description:`The content to scroll`}}},o=()=>(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`p`,{children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}),(0,i.jsx)(`p`,{children:`Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}),(0,i.jsx)(`p`,{children:`Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`}),(0,i.jsx)(`p`,{children:`Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`})]}),s={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})}),args:{style:{width:300,height:200},autoHide:!1},parameters:{docs:{description:{story:"Tall content in a fixed-size box, with auto-hide turned off so the vertical track stays on screen (`autoHide={false}`); change any other prop live in the Controls panel below."},source:{code:`<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Scrollable content...</p>
</Scrollbar>`}}}},c={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})}),args:{style:{width:300,height:200},autoHide:!0},parameters:{docs:{description:{story:"The default behaviour, for content where a permanent track would distract: the track stays hidden until you scroll or move the pointer over the content, then fades out three seconds later (`autoHide`)."},source:{code:`<Scrollbar autoHide style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`}}}},l={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})}),args:{style:{width:300,height:200},autoHide:!1,fixedSize:!0},parameters:{docs:{description:{story:"The thumb stays at its wider 8px thickness on desktop instead of widening only while the pointer is over the track, so it is easier to find and grab (`fixedSize`)."},source:{code:`<Scrollbar fixedSize autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`}}}},u={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(`div`,{style:{whiteSpace:`nowrap`,padding:`10px`,display:`flex`,flexDirection:`row`},children:(0,i.jsx)(o,{})})}),args:{style:{width:300,height:100},autoHide:!1},parameters:{docs:{description:{story:`Content that overflows sideways gets a horizontal track along the bottom edge, drawn the same way as the vertical one.`},source:{code:`<Scrollbar autoHide={false} style={{ width: 300, height: 100 }}>
  <div style={{ whiteSpace: "nowrap" }}>Wide content...</div>
</Scrollbar>`}}}},d={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(`div`,{style:{width:`500px`},children:(0,i.jsx)(o,{})})}),args:{style:{width:300,height:200},autoHide:!1},parameters:{docs:{description:{story:`Content taller and wider than the box shows both tracks, each shortened by 16px so they do not overlap in the corner.`},source:{code:`<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <div style={{ width: "500px" }}>Tall and wide content...</div>
</Scrollbar>`}}}},f={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})}),args:{style:{width:300,height:200},autoHide:!1,paddingAfterLastItem:`50px`},parameters:{docs:{description:{story:`Scrollbar with additional padding after the last item, providing extra space at the bottom of scrollable content.`},source:{code:`<Scrollbar paddingAfterLastItem="50px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with padding at bottom...</p>
</Scrollbar>`}}}},p={render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})}),args:{style:{width:300,height:200},autoHide:!1,paddingInlineEnd:`100px`},parameters:{docs:{description:{story:`Scrollbar with inline-end padding, adding space on the right (or left in RTL) side of the scroll body.`},source:{code:`<Scrollbar paddingInlineEnd="100px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with inline-end padding...</p>
</Scrollbar>`}}}},m={render:e=>(0,i.jsx)(`div`,{dir:`rtl`,children:(0,i.jsx)(r,{...e,children:(0,i.jsx)(o,{})})}),globals:{direction:`rtl`},args:{style:{width:300,height:200},autoHide:!1},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`226px`},description:{story:"The same box under a right-to-left interface: the vertical track moves to the left edge, the text aligns to the right and the content's inline-end padding moves to the left with the track. The direction comes from the theme's `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir=\"rtl\"` for the text itself."},source:{code:`<div dir="rtl">
  <Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
    <p>Scrollable content...</p>
  </Scrollbar>
</div>`}}}},h={render:()=>(0,i.jsx)(`div`,{style:{"--scrollbar-bg":`#7c3aed`,"--scrollbar-bg-hover":`#5b21b6`,"--scrollbar-bg-active":`#4c1d95`,"--scrollbar-thumb-size":`6px`,"--scrollbar-radius":`4px`,"--scrollbar-track-padding":`2px`,"--scrollbar-padding-end":`32px`},children:(0,i.jsx)(r,{style:{width:300,height:200},autoHide:!1,children:(0,i.jsx)(o,{})})}),parameters:{docs:{description:{story:`The variables are listed under CSS variables on this page. The example sets the thumb colours (hover and drag the thumb to see the other two), a 6px thumb, a 2px track padding and 32px of space before the track.`}}}},g=[`Default`,`WithAutoHide`,`WithFixedSize`,`WithHorizontalScroll`,`WithBothScrollbars`,`WithPaddingAfterLastItem`,`WithPaddingInlineEnd`,`RightToLeft`,`CssCustomization`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false
  },
  parameters: {
    docs: {
      description: {
        story: "Tall content in a fixed-size box, with auto-hide turned off so the vertical track stays on screen (\`autoHide={false}\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Scrollable content...</p>
</Scrollbar>\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: true
  },
  parameters: {
    docs: {
      description: {
        story: "The default behaviour, for content where a permanent track would distract: the track stays hidden until you scroll or move the pointer over the content, then fades out three seconds later (\`autoHide\`)."
      },
      source: {
        code: \`<Scrollbar autoHide style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false,
    fixedSize: true
  },
  parameters: {
    docs: {
      description: {
        story: "The thumb stays at its wider 8px thickness on desktop instead of widening only while the pointer is over the track, so it is easier to find and grab (\`fixedSize\`)."
      },
      source: {
        code: \`<Scrollbar fixedSize autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <div style={{
      whiteSpace: "nowrap",
      padding: "10px",
      display: "flex",
      flexDirection: "row"
    }}>
        <LongContent />
      </div>
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 100
    },
    autoHide: false
  },
  parameters: {
    docs: {
      description: {
        story: "Content that overflows sideways gets a horizontal track along the bottom edge, drawn the same way as the vertical one."
      },
      source: {
        code: \`<Scrollbar autoHide={false} style={{ width: 300, height: 100 }}>
  <div style={{ whiteSpace: "nowrap" }}>Wide content...</div>
</Scrollbar>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <div style={{
      width: "500px"
    }}>
        <LongContent />
      </div>
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false
  },
  parameters: {
    docs: {
      description: {
        story: "Content taller and wider than the box shows both tracks, each shortened by 16px so they do not overlap in the corner."
      },
      source: {
        code: \`<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <div style={{ width: "500px" }}>Tall and wide content...</div>
</Scrollbar>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false,
    paddingAfterLastItem: "50px"
  },
  parameters: {
    docs: {
      description: {
        story: "Scrollbar with additional padding after the last item, providing extra space at the bottom of scrollable content."
      },
      source: {
        code: \`<Scrollbar paddingAfterLastItem="50px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with padding at bottom...</p>
</Scrollbar>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>,
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false,
    paddingInlineEnd: "100px"
  },
  parameters: {
    docs: {
      description: {
        story: "Scrollbar with inline-end padding, adding space on the right (or left in RTL) side of the scroll body."
      },
      source: {
        code: \`<Scrollbar paddingInlineEnd="100px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with inline-end padding...</p>
</Scrollbar>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Scrollbar {...args}>
        <LongContent />
      </Scrollbar>
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    style: {
      width: 300,
      height: 200
    },
    autoHide: false
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the direction of the whole Docs page
      story: {
        inline: false,
        height: "226px"
      },
      description: {
        story: "The same box under a right-to-left interface: the vertical track moves to the left edge, the text aligns to the right and the content's inline-end padding moves to the left with the track. The direction comes from the theme's \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir=\\"rtl\\"\` for the text itself."
      },
      source: {
        code: \`<div dir="rtl">
  <Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
    <p>Scrollable content...</p>
  </Scrollbar>
</div>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--scrollbar-bg": "#7c3aed",
    "--scrollbar-bg-hover": "#5b21b6",
    "--scrollbar-bg-active": "#4c1d95",
    "--scrollbar-thumb-size": "6px",
    "--scrollbar-radius": "4px",
    "--scrollbar-track-padding": "2px",
    "--scrollbar-padding-end": "32px"
  } as CSSProperties}>
      <Scrollbar style={{
      width: 300,
      height: 200
    }} autoHide={false}>
        <LongContent />
      </Scrollbar>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The example sets the thumb colours (hover and drag the thumb to see the other two), a 6px thumb, a 2px track padding and 32px of space before the track.\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as CssCustomization,s as Default,m as RightToLeft,c as WithAutoHide,d as WithBothScrollbars,l as WithFixedSize,u as WithHorizontalScroll,f as WithPaddingAfterLastItem,p as WithPaddingInlineEnd,g as __namedExportsOrder,a as default};