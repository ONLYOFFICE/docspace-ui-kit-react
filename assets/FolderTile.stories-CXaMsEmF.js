import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./link-C_nB54e7.js";import{n as a,t as o}from"./folder-DBjybTp0.js";import{n as s,t as c}from"./folder-aUaCzHzJ.js";import{n as l,t as u}from"./badge-DpBv0vYH.js";import{n as d,t as f}from"./tile-content-BziW1hzz.js";import{n as p,t as m}from"./folder-tile-Bgi_NO_6.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{h=t(),a(),s(),r(),l(),p(),d(),g=n(),{fn:_}=__STORYBOOK_MODULE_TEST__,v=(0,g.jsx)(o,{}),y=[{id:`option_copy-to`,key:`copy-to`,label:`Copy`,onClick:()=>{},disabled:!1},{id:`option_move-to`,key:`move-to`,label:`Move to`,onClick:()=>{},disabled:!1}],b=(0,g.jsx)(`div`,{className:`badges`,children:(0,g.jsx)(u,{noHover:!0,className:`badge badge-version tablet-badge icons-group`,backgroundColor:`#A3A9AE`,label:`1`,title:`my badge`,style:{width:`max-content`},onClick:()=>{}})}),x={title:`UI/Tiles/FolderTile`,component:m,parameters:{},argTypes:{checked:{control:`boolean`,description:`Ticks the checkbox and keeps it in place of the icon, and tints the whole tile`,table:{defaultValue:{summary:`false`}}},inProgress:{control:`boolean`,description:`Replaces the icon and the checkbox with a small loader`,table:{defaultValue:{summary:`false`}}},indeterminate:{control:`boolean`,description:`Draws the checkbox half-filled; it shows while the checkbox does, that is on hover or when the tile is checked`,table:{defaultValue:{summary:`false`}}},isBigFolder:{control:`boolean`,description:`Switches from the single 64px row to a 220px card with a picture above the row`,table:{defaultValue:{summary:`false`}}},showHotkeyBorder:{control:`boolean`,description:`Turns the tile's border the accent colour, to mark the one the keyboard is on`,table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Keeps the hover tint and the underlined name on the tile being acted on`,table:{defaultValue:{summary:`false`}}},isDragging:{control:`boolean`,description:`Marks the tile as being dragged; hovering it then neither tints it nor swaps the icon for the checkbox`,table:{defaultValue:{summary:`false`}}},isEdit:{control:`boolean`,description:`Removes the icon and the checkbox while the folder is renamed, and stops hovering from tinting the tile`,table:{defaultValue:{summary:`false`}}},item:{control:`object`,description:"The folder the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button"},children:{control:!1,description:"The name row beside the icon, usually a `TileContent`; only the first element is shown"},element:{control:!1,description:`The folder icon beside the name; without it the tile has neither the icon nor the checkbox`},temporaryIcon:{control:!1,description:`The picture of the tall layout, drawn at the bottom of its upper part: an element as given, or the address of an SVG`},badges:{control:!1,description:"Badges at the end of the name row, or in the top end corner of the picture in the tall layout; give their wrapper the class `badges` so clicking them does not select the tile"},contextOptions:{control:`object`,description:`Entries of the menu opened by the three-dot button`},getContextModel:{control:!1,description:`Returns the entries of the menu opened by a right-click; without it a right-click opens nothing`},onSelect:{description:`Called with the new checked state and the item on a plain click on the tile, from the checkbox, and when the icon is tapped on a phone`},setSelection:{description:`Called with an empty list just before a plain click selects the tile, unless the click landed on an image, an input or an icon`},withCtrlSelect:{description:`Called with the item on a Ctrl- or Cmd-click, which then does not select the tile`},withShiftSelect:{description:`Called with the item on a Shift-click, which then does not select the tile`},tileContextClick:{description:"Called just before the menu opens, with `true` when a right-click opened it"},hideContextMenu:{description:`Called when the menu closes`},forwardRef:{control:!1,description:`Ref to the outer element, which the tile also clicks on a right-click when its menu is not mounted yet`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"tile"`}}},thumbnailClick:{control:!1,description:`Ignored: nothing in the tile calls it`},contextMenuHeader:{control:!1,description:"Ignored: the menu's header is built from the first child's `item`"},dragging:{control:!1,description:"Ignored: `isDragging` is the one that is read"}},args:{onSelect:_(),setSelection:_(),withCtrlSelect:_(),withShiftSelect:_(),tileContextClick:_(),hideContextMenu:_()}},S=({checked:e,onSelect:t,...n})=>{let[r,a]=(0,h.useState)(e),o=(e,n)=>{a(e),t?.(e,n)};return(0,g.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,g.jsx)(m,{...n,checked:r,onSelect:o,children:(0,g.jsx)(f,{children:(0,g.jsx)(i,{children:`Folder Content`})})})})},C={render:S,args:{item:{id:`folder-1`,title:`My Folder`,isFolder:!0,contextOptions:[`copy-to`,`move-to`]},element:v,contextOptions:y,badges:b,getContextModel:()=>y},parameters:{docs:{description:{story:`A folder as a single row: the icon, the name, and a badge beside the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below.`},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},w={render:S,args:{item:{id:`folder-1`,title:`My Folder`,isFolder:!0,contextOptions:[`copy-to`,`move-to`]},element:v,contextOptions:y,badges:b,isBigFolder:!0,temporaryIcon:(0,g.jsx)(c,{}),getContextModel:()=>y},parameters:{docs:{description:{story:"The tall layout, for a grid where folders should stand out as much as files: a picture on top with the badge in its corner, and the name row below it (`isBigFolder`, `temporaryIcon`)."},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isBigFolder={true}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},T={render:S,args:{...C.args,checked:!0},parameters:{docs:{description:{story:"A selected folder, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (`checked`)."},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},E={render:S,args:{...C.args,inProgress:!0},parameters:{docs:{description:{story:"A folder that is busy, being copied or moved: a small loader stands where the icon and the checkbox were (`inProgress`)."},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},D={render:S,args:{...C.args,showHotkeyBorder:!0},parameters:{docs:{description:{story:"The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself."},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showHotkeyBorder
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},O={render:S,args:{...C.args,isEdit:!0},parameters:{docs:{description:{story:"A folder whose name is being edited: the icon and the checkbox go, so the name row can hold a text field, and hovering no longer tints the tile (`isEdit`)."},source:{code:`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isEdit
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>`}}}},k={render:e=>(0,g.jsx)(`div`,{dir:`rtl`,children:(0,g.jsx)(S,{...e})}),globals:{direction:`rtl`},args:{...C.args},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`150px`},description:{story:'The same row in a right-to-left layout: the icon moves to the right-hand end, the name is aligned right after it, and the badge and the three-dot button move to the left edge. The wrapper carries `dir="rtl"` for the layout; the side the three-dot menu opens on comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <FolderTile item={folder} element={<Folder32ReactSvg />} contextOptions={contextOptions} badges={badges}>
    <TileContent><Link>Folder Content</Link></TileContent>
  </FolderTile>
</div>`}}}},A={render:()=>(0,g.jsxs)(`div`,{style:{"--tile-bg":`#f4f9fd`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-hover-bg":`#cce5f6`,"--tile-hover-text-decoration":`none`,"--tile-hotkey-color":`#e0662e`,"--tile-badge-bg":`#e6f3fb`,"--tile-badge-radius":`8px`,"--tile-badge-box-shadow":`0 2px 8px rgba(0,130,201,0.3)`,"--tile-text-size":`13px`,"--tile-text-weight":`600`,"--tile-text-color":`#004d77`,"--tile-text-line-height":`20px`},children:[(0,g.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,g.jsx)(m,{item:{id:`folder-1`,title:`My Folder`,isFolder:!0,contextOptions:[`copy-to`,`move-to`]},element:v,contextOptions:y,badges:b,getContextModel:()=>y,children:(0,g.jsx)(f,{children:(0,g.jsx)(i,{children:`My Folder`})})})}),(0,g.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,g.jsx)(m,{item:{id:`folder-2`,title:`Projects`,isFolder:!0,contextOptions:[`copy-to`,`move-to`]},element:v,contextOptions:y,badges:b,isBigFolder:!0,temporaryIcon:(0,g.jsx)(c,{}),getContextModel:()=>y,children:(0,g.jsx)(f,{children:(0,g.jsx)(i,{children:`Projects`})})})}),(0,g.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`,"--folder-tile-border-style":`2px solid`},children:(0,g.jsx)(m,{item:{id:`folder-3`,title:`Archive`,isFolder:!0,contextOptions:[`copy-to`,`move-to`]},element:v,contextOptions:y,showHotkeyBorder:!0,getContextModel:()=>y,children:(0,g.jsx)(f,{children:(0,g.jsx)(i,{children:`Archive`})})})})]}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page.\n\nThree instances:\n- **My Folder** — the single row, for the border, radius and name variables; hover it for `--tile-hover-bg`, `--tile-hover-text-decoration` and `--tile-bg` behind the icon.\n- **Projects** — the tall layout (`isBigFolder`), for `--tile-bg` and the badge variables.\n- **Archive** — `showHotkeyBorder`, for `--tile-hotkey-color`, in a wrapper of its own that sets `--folder-tile-border-style` to a thicker border."},source:{code:`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-hotkey-color": "#e0662e",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
}}>
  <FolderTile item={folder} element={<FolderIcon />} contextOptions={options} badges={badges}>
    <TileContent><Link>My Folder</Link></TileContent>
  </FolderTile>

  <FolderTile item={projects} element={<FolderIcon />} contextOptions={options} badges={badges} isBigFolder temporaryIcon={<FolderPicture />}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>

  <div style={{ "--folder-tile-border-style": "2px solid" }}>
    <FolderTile item={archive} element={<FolderIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Archive</Link></TileContent>
    </FolderTile>
  </div>
</div>`}}}},j=[`Default`,`Big`,`Checked`,`InProgress`,`WithHotkeyBorder`,`RenamingState`,`RightToLeft`,`CssCustomization`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: {
      id: "folder-1",
      title: "My Folder",
      isFolder: true,
      contextOptions: ["copy-to", "move-to"]
    },
    element,
    contextOptions,
    badges,
    getContextModel: () => contextOptions
  },
  parameters: {
    docs: {
      description: {
        story: "A folder as a single row: the icon, the name, and a badge beside the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: {
      id: "folder-1",
      title: "My Folder",
      isFolder: true,
      contextOptions: ["copy-to", "move-to"]
    },
    element,
    contextOptions,
    badges,
    isBigFolder: true,
    temporaryIcon: <ImageReactSvg />,
    getContextModel: () => contextOptions
  },
  parameters: {
    docs: {
      description: {
        story: "The tall layout, for a grid where folders should stand out as much as files: a picture on top with the badge in its corner, and the name row below it (\`isBigFolder\`, \`temporaryIcon\`)."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isBigFolder={true}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "A selected folder, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (\`checked\`)."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "A folder that is busy, being copied or moved: a small loader stands where the icon and the checkbox were (\`inProgress\`)."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true
  },
  parameters: {
    docs: {
      description: {
        story: "The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (\`showHotkeyBorder\`). The tile does not handle the keys itself."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showHotkeyBorder
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: "A folder whose name is being edited: the icon and the checkbox go, so the name row can hold a text field, and hovering no longer tints the tile (\`isEdit\`)."
      },
      source: {
        code: \`<FolderTile
  item={{ id: "folder-1", title: "My Folder", isFolder: true, contextOptions: ["copy-to", "move-to"] }}
  element={<Folder32ReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  isEdit
>
  <TileContent><Link>Folder Content</Link></TileContent>
</FolderTile>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Template {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...Default.args
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "150px"
      },
      description: {
        story: 'The same row in a right-to-left layout: the icon moves to the right-hand end, the name is aligned right after it, and the badge and the three-dot button move to the left edge. The wrapper carries \`dir="rtl"\` for the layout; the side the three-dot menu opens on comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <FolderTile item={folder} element={<Folder32ReactSvg />} contextOptions={contextOptions} badges={badges}>
    <TileContent><Link>Folder Content</Link></TileContent>
  </FolderTile>
</div>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#f4f9fd",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-hover-text-decoration": "none",
    "--tile-hotkey-color": "#e0662e",
    "--tile-badge-bg": "#e6f3fb",
    "--tile-badge-radius": "8px",
    "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
    "--tile-text-size": "13px",
    "--tile-text-weight": "600",
    "--tile-text-color": "#004d77",
    "--tile-text-line-height": "20px"
  } as CSSProperties}>
      <div style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
        <FolderTile item={{
        id: "folder-1",
        title: "My Folder",
        isFolder: true,
        contextOptions: ["copy-to", "move-to"]
      }} element={element} contextOptions={contextOptions} badges={badges} getContextModel={() => contextOptions}>
          <TileContent>
            <Link>My Folder</Link>
          </TileContent>
        </FolderTile>
      </div>
      <div style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
        <FolderTile item={{
        id: "folder-2",
        title: "Projects",
        isFolder: true,
        contextOptions: ["copy-to", "move-to"]
      }} element={element} contextOptions={contextOptions} badges={badges} isBigFolder temporaryIcon={<ImageReactSvg />} getContextModel={() => contextOptions}>
          <TileContent>
            <Link>Projects</Link>
          </TileContent>
        </FolderTile>
      </div>
      <div style={{
      maxWidth: "300px",
      margin: "30px",
      "--folder-tile-border-style": "2px solid"
    } as CSSProperties}>
        <FolderTile item={{
        id: "folder-3",
        title: "Archive",
        isFolder: true,
        contextOptions: ["copy-to", "move-to"]
      }} element={element} contextOptions={contextOptions} showHotkeyBorder getContextModel={() => contextOptions}>
          <TileContent>
            <Link>Archive</Link>
          </TileContent>
        </FolderTile>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page.

Three instances:
- **My Folder** — the single row, for the border, radius and name variables; hover it for \\\`--tile-hover-bg\\\`, \\\`--tile-hover-text-decoration\\\` and \\\`--tile-bg\\\` behind the icon.
- **Projects** — the tall layout (\\\`isBigFolder\\\`), for \\\`--tile-bg\\\` and the badge variables.
- **Archive** — \\\`showHotkeyBorder\\\`, for \\\`--tile-hotkey-color\\\`, in a wrapper of its own that sets \\\`--folder-tile-border-style\\\` to a thicker border.\`
      },
      source: {
        code: \`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-hotkey-color": "#e0662e",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
}}>
  <FolderTile item={folder} element={<FolderIcon />} contextOptions={options} badges={badges}>
    <TileContent><Link>My Folder</Link></TileContent>
  </FolderTile>

  <FolderTile item={projects} element={<FolderIcon />} contextOptions={options} badges={badges} isBigFolder temporaryIcon={<FolderPicture />}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>

  <div style={{ "--folder-tile-border-style": "2px solid" }}>
    <FolderTile item={archive} element={<FolderIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Archive</Link></TileContent>
    </FolderTile>
  </div>
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{w as Big,T as Checked,A as CssCustomization,C as Default,E as InProgress,O as RenamingState,k as RightToLeft,D as WithHotkeyBorder,j as __namedExportsOrder,x as default};