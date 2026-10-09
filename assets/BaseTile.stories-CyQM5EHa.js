import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./link-C_nB54e7.js";import{n as a,t as o}from"./word-kWuzOL5c.js";import{n as s,t as c}from"./base-tile-80NBnHCx.js";import{n as l,t as u}from"./tile-content-BziW1hzz.js";var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{d=t(),a(),r(),s(),l(),f=n(),{fn:p}=__STORYBOOK_MODULE_TEST__,m=(0,f.jsx)(o,{}),h=[{id:`option_edit`,key:`edit`,label:`Edit`,onClick:()=>{},disabled:!1},{id:`option_delete`,key:`delete`,label:`Delete`,onClick:()=>{},disabled:!1}],g={title:`UI/Tiles/BaseTile`,component:c,parameters:{},argTypes:{checked:{control:`boolean`,description:`Ticks the checkbox and keeps it in place of the icon, with the hover background`,table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Keeps the hover background on the tile being acted on, with no checkbox`,table:{defaultValue:{summary:`false`}}},inProgress:{control:`boolean`,description:`Replaces the icon and the checkbox with a small loader`,table:{defaultValue:{summary:`false`}}},showHotkeyBorder:{control:`boolean`,description:`Draws an accent border around the tile, to mark the one the keyboard is on`,table:{defaultValue:{summary:`false`}}},isEdit:{control:`boolean`,description:`Removes the icon and the checkbox and the hover background, leaving the top row to its content while the item is renamed`,table:{defaultValue:{summary:`false`}}},isBlockingOperation:{control:`boolean`,description:`Stops the tile from reacting to hover, clicks and right-clicks; it looks the same`,table:{defaultValue:{summary:`false`}}},indeterminate:{control:`boolean`,description:`Draws the checkbox with a dash instead of a tick, for a partly selected item`,table:{defaultValue:{summary:`false`}}},item:{control:`object`,description:"The item the tile stands for: passed back through `onSelect`, and its title and logo head the menu. A `contextOptions` key on it is what draws the three-dot button"},element:{control:!1,description:`The icon in the corner; without it the tile has neither the icon nor the checkbox`},topContent:{control:!1,description:"The title row beside the icon, usually a `TileContent`"},bottomContent:{control:!1,description:`The second row under the title, 24px high`},contextOptions:{control:`object`,description:`Entries of the menu opened by the three-dot button`},getContextModel:{control:!1,description:`Returns the entries of the menu opened by a right-click; without it a right-click opens nothing`},onSelect:{description:`Called with the new checked state and the item when the checkbox is clicked, or when the icon is tapped on a phone`},onRoomClick:{description:`Called with the click event on any click on the tile`},onHover:{description:`Called when the pointer enters the tile`},onLeave:{description:`Called when the pointer leaves the tile`},tileContextClick:{description:"Called just before the menu opens, with `true` when a right-click opened it"},hideContextMenu:{description:`Called when the menu closes`},badgeUrl:{control:`text`,description:`Image drawn as a badge in the menu's header`},className:{control:`text`,description:`Class added after the component's own on the outer element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"tile"`}}},checkboxContainerRef:{control:!1,description:`Ref to the element holding the icon and the checkbox`},forwardRef:{control:!1,description:`Ref to an element of your own that the tile clicks on a right-click when its menu is not mounted yet`},thumbnailClick:{control:!1,description:`Ignored: the tile never calls it`}},args:{onSelect:p(),onRoomClick:p(),onHover:p(),onLeave:p(),tileContextClick:p(),hideContextMenu:p()}},_=({checked:e,onSelect:t,...n})=>{let[r,i]=(0,d.useState)(e),a=(e,n)=>{i(e),t?.(e,n)};return(0,f.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,f.jsx)(c,{...n,checked:r,onSelect:a})})},v={render:_,args:{item:{id:`tile-1`,title:`Document.docx`,fileExst:`.docx`},element:m,contextOptions:h,topContent:(0,f.jsx)(u,{children:(0,f.jsx)(i,{children:`Document.docx`})}),getContextModel:()=>h},parameters:{docs:{description:{story:`A document as a tile: its icon, its name, and a checkbox that takes the icon's place on hover. Tick it, right-click the tile for its menu, and change any other prop live in the Controls panel below.`},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  onSelect={handleSelect}
  getContextModel={() => contextOptions}
/>`}}}},y={render:_,args:{...v.args,checked:!0},parameters:{docs:{description:{story:"A selected tile, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the background stays tinted (`checked`)."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  checked={true}
  onSelect={handleSelect}
/>`}}}},b={render:_,args:{...v.args,isActive:!0},parameters:{docs:{description:{story:"The tile whose menu is open or that an action is running on keeps the hover background after the pointer leaves, so the reader can tell which one it is (`isActive`)."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isActive={true}
/>`}}}},x={render:_,args:{...v.args,inProgress:!0},parameters:{docs:{description:{story:"A tile whose item is busy, being copied or converted: a small loader stands where the icon and the checkbox were (`inProgress`)."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  inProgress={true}
/>`}}}},S={render:_,args:{...v.args,showHotkeyBorder:!0},parameters:{docs:{description:{story:"The tile the keyboard is on while the reader moves through the grid with the arrow keys: an accent border marks it (`showHotkeyBorder`). The tile does not handle the keys itself."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  showHotkeyBorder={true}
/>`}}}},C={render:_,args:{...v.args,topContent:(0,f.jsx)(u,{children:(0,f.jsx)(i,{children:`Document.docx`})}),bottomContent:(0,f.jsx)(`div`,{style:{padding:`8px`,fontSize:`12px`,color:`#666`},children:`Additional information`})},parameters:{docs:{description:{story:"A tile with a second row under the title, for tags or a line of details (`bottomContent`)."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  bottomContent={<div>Additional information</div>}
/>`}}}},w={render:_,args:{...v.args,item:{id:`tile-1`,title:`Document.docx`,fileExst:`.docx`,contextOptions:[]}},parameters:{docs:{description:{story:"A tile whose actions are reachable without a right-click: the three-dot button opens the same menu. It is drawn only when the item carries a `contextOptions` key of its own, whatever the `contextOptions` prop holds."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx", contextOptions: [] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  getContextModel={() => contextOptions}
/>`}}}},T={render:_,args:{...v.args,isEdit:!0},parameters:{docs:{description:{story:"A tile whose name is being edited: the icon and the checkbox go, so the title row can hold a text field across the tile, and hovering no longer tints it (`isEdit`)."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isEdit
/>`}}}},E={render:_,args:{...v.args,isBlockingOperation:!0},parameters:{docs:{description:{story:"A tile an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle tile, so show the operation somewhere else."},source:{code:`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isBlockingOperation
/>`}}}},D={render:()=>(0,f.jsxs)(`div`,{style:{"--tile-bg":`#e6f3fb`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`,"--tile-icon-color":`#0082c9`,"--tile-hotkey-color":`#00304d`,"--tile-padding":`12px 0`,"--tile-row-gap":`12px`},children:[(0,f.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,f.jsx)(c,{item:{id:`tile-1`,title:`Document.docx`,fileExst:`.docx`,contextOptions:[]},element:m,contextOptions:h,topContent:(0,f.jsx)(u,{children:(0,f.jsx)(i,{children:`Document.docx`})}),onSelect:()=>{},getContextModel:()=>h})}),(0,f.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,f.jsx)(c,{item:{id:`tile-2`,title:`Report.docx`,fileExst:`.docx`},element:m,contextOptions:h,topContent:(0,f.jsx)(u,{children:(0,f.jsx)(i,{children:`Report.docx`})}),showHotkeyBorder:!0})})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first tile shows every variable but the hotkey colour; hover it for the hover background. The second is there for `--tile-hotkey-color`, which only a tile with `showHotkeyBorder` draws."}}}},O=[`Default`,`Checked`,`Active`,`InProgress`,`WithHotkeyBorder`,`WithBottomContent`,`WithMenuButton`,`RenamingState`,`BlockingOperation`,`CssCustomization`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: {
      id: "tile-1",
      title: "Document.docx",
      fileExst: ".docx"
    },
    element: wordElement,
    contextOptions,
    topContent: <TileContent>
        <Link>Document.docx</Link>
      </TileContent>,
    getContextModel: () => contextOptions
  },
  parameters: {
    docs: {
      description: {
        story: "A document as a tile: its icon, its name, and a checkbox that takes the icon's place on hover. Tick it, right-click the tile for its menu, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  onSelect={handleSelect}
  getContextModel={() => contextOptions}
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "A selected tile, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the background stays tinted (\`checked\`)."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  checked={true}
  onSelect={handleSelect}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isActive: true
  },
  parameters: {
    docs: {
      description: {
        story: "The tile whose menu is open or that an action is running on keeps the hover background after the pointer leaves, so the reader can tell which one it is (\`isActive\`)."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isActive={true}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "A tile whose item is busy, being copied or converted: a small loader stands where the icon and the checkbox were (\`inProgress\`)."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  inProgress={true}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true
  },
  parameters: {
    docs: {
      description: {
        story: "The tile the keyboard is on while the reader moves through the grid with the arrow keys: an accent border marks it (\`showHotkeyBorder\`). The tile does not handle the keys itself."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  showHotkeyBorder={true}
/>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    topContent: <TileContent>
        <Link>Document.docx</Link>
      </TileContent>,
    bottomContent: <div style={{
      padding: "8px",
      fontSize: "12px",
      color: "#666"
    }}>
        Additional information
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "A tile with a second row under the title, for tags or a line of details (\`bottomContent\`)."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  bottomContent={<div>Additional information</div>}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    item: {
      id: "tile-1",
      title: "Document.docx",
      fileExst: ".docx",
      contextOptions: []
    } as BaseTileProps["item"]
  },
  parameters: {
    docs: {
      description: {
        story: "A tile whose actions are reachable without a right-click: the three-dot button opens the same menu. It is drawn only when the item carries a \`contextOptions\` key of its own, whatever the \`contextOptions\` prop holds."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx", contextOptions: [] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  getContextModel={() => contextOptions}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: "A tile whose name is being edited: the icon and the checkbox go, so the title row can hold a text field across the tile, and hovering no longer tints it (\`isEdit\`)."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isEdit
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true
  },
  parameters: {
    docs: {
      description: {
        story: "A tile an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (\`isBlockingOperation\`). It looks the same as an idle tile, so show the operation somewhere else."
      },
      source: {
        code: \`<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isBlockingOperation
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#e6f3fb",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-icon-color": "#0082c9",
    "--tile-hotkey-color": "#00304d",
    "--tile-padding": "12px 0",
    "--tile-row-gap": "12px"
  } as CSSProperties}>
      <div style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
        <BaseTile item={{
        id: "tile-1",
        title: "Document.docx",
        fileExst: ".docx",
        contextOptions: []
      } as BaseTileProps["item"]} element={wordElement} contextOptions={contextOptions} topContent={<TileContent>
              <Link>Document.docx</Link>
            </TileContent>} onSelect={() => {}} getContextModel={() => contextOptions} />
      </div>
      <div style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
        <BaseTile item={{
        id: "tile-2",
        title: "Report.docx",
        fileExst: ".docx"
      }} element={wordElement} contextOptions={contextOptions} topContent={<TileContent>
              <Link>Report.docx</Link>
            </TileContent>} showHotkeyBorder />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first tile shows every variable but the hotkey colour; hover it for the hover background. The second is there for \\\`--tile-hotkey-color\\\`, which only a tile with \\\`showHotkeyBorder\\\` draws.\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}}})))()}k();export{b as Active,E as BlockingOperation,y as Checked,D as CssCustomization,v as Default,x as InProgress,T as RenamingState,C as WithBottomContent,S as WithHotkeyBorder,w as WithMenuButton,O as __namedExportsOrder,g as default};