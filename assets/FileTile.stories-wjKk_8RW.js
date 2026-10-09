import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./common-icons-style-Dik-NKVV.js";import{n as a,t as o}from"./icon-button-CrT9MlQO.js";import{n as s,t as c}from"./link-C_nB54e7.js";import{S as l,c as u}from"./enums-DzcBu485.js";import{n as d,t as f}from"./word-kWuzOL5c.js";import{n as p,t as m}from"./badge-DpBv0vYH.js";import{n as h,t as g}from"./empty.rooms.root.light-B0T7L2ed.js";import{n as _,t as v}from"./file-tile-CgQ6PwKb.js";import{n as y,t as b}from"./tile-content-BziW1hzz.js";var x,S,C,w;function T(){return(T=e((()=>{t(),x=t(),S=n(),C=({title:e,titleId:t,...n},r)=>(0,S.jsxs)(`svg`,{width:12,height:12,viewBox:`0 0 12 12`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,ref:r,"aria-labelledby":t,...n,children:[e?(0,S.jsx)(`title`,{id:t,children:e}):null,(0,S.jsx)(`path`,{fillRule:`evenodd`,clipRule:`evenodd`,d:`M6 0C4.34315 0 3 1.34315 3 3V4C1.89543 4 1 4.89543 1 6V10C1 11.1046 1.89543 12 3 12H9C10.1046 12 11 11.1046 11 10V6C11 4.89543 10.1046 4 9 4V3C9 1.34315 7.65685 0 6 0ZM7 4V3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V4H7ZM7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8Z`,fill:`#657077`})]}),w=(0,x.forwardRef)(C)})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{E=t(),d(),h(),T(),s(),p(),r(),l(),_(),y(),a(),D=n(),{fn:O}=__STORYBOOK_MODULE_TEST__,k=(0,D.jsx)(f,{}),A=`data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22160%22%3E%3Crect%20width%3D%22320%22%20height%3D%22160%22%20fill%3D%22%23f3f4f4%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2224%22%20width%3D%22240%22%20height%3D%22136%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%2264%22%20y%3D%2248%22%20width%3D%22120%22%20height%3D%228%22%20fill%3D%22%23a3a9ae%22%2F%3E%3Crect%20x%3D%2264%22%20y%3D%2268%22%20width%3D%22192%22%20height%3D%226%22%20fill%3D%22%23d0d5da%22%2F%3E%3Crect%20x%3D%2264%22%20y%3D%2284%22%20width%3D%22176%22%20height%3D%226%22%20fill%3D%22%23d0d5da%22%2F%3E%3Crect%20x%3D%2264%22%20y%3D%22100%22%20width%3D%22184%22%20height%3D%226%22%20fill%3D%22%23d0d5da%22%2F%3E%3C%2Fsvg%3E`,j=[{id:`option_copy-to`,key:`copy-to`,label:`Copy`,onClick:()=>{},disabled:!1},{id:`option_move-to`,key:`move-to`,label:`Move to`,onClick:()=>{},disabled:!1}],M=(0,D.jsx)(`div`,{className:`badges`,children:(0,D.jsx)(m,{noHover:!0,isVersionBadge:!0,className:`badge badge-version badge-version-current tablet-badge icons-group`,backgroundColor:`#A3A9AE`,label:`New`,title:`my badge`,style:{width:`max-content`},onClick:()=>{}})}),N=(0,D.jsx)(`div`,{className:`badges`,children:(0,D.jsx)(o,{iconNode:(0,D.jsx)(w,{}),className:`badge lock-file icons-group file-locked`,size:i.medium,"data-id":`file-lock`,"data-locked":!1,onClick:()=>{},color:`#A3A9AE`,isDisabled:!1,hoverColor:`accent`,title:`Lock file`})}),P={title:`UI/Tiles/FileTile`,component:v,parameters:{},argTypes:{checked:{control:`boolean`,description:`Ticks the checkbox and keeps it in place of the icon, and tints the whole tile`,table:{defaultValue:{summary:`false`}}},isDragging:{control:`boolean`,description:`Marks the tile as being dragged; the checkbox then no longer replaces the icon on hover, and nothing else changes`,table:{defaultValue:{summary:`false`}}},inProgress:{control:`boolean`,description:`Replaces the icon and the checkbox with a small loader`,table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Keeps the hover tint and the underlined name on the tile being acted on`,table:{defaultValue:{summary:`false`}}},showHotkeyBorder:{control:`boolean`,description:`Turns the tile's border the accent colour, to mark the one the keyboard is on`,table:{defaultValue:{summary:`false`}}},isEdit:{control:`boolean`,description:`Removes the icon and the checkbox while the file is renamed`,table:{defaultValue:{summary:`false`}}},isBlockingOperation:{control:`boolean`,description:`Meant to stop the tile reacting to the pointer during an operation; it currently changes nothing`,table:{defaultValue:{summary:`false`}}},isHighlight:{control:`boolean`,description:`Fades a colour out of the lower part once, over two seconds, to point at a file that was just matched; the kit defines no colour for it (see CSS Customization)`,table:{defaultValue:{summary:`false`}}},item:{control:`object`,description:"The file the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button; `isPlugin` with `fileTileIcon` puts that icon in place of the preview"},children:{control:!1,description:"The name row beside the icon, usually a `TileContent`; only the first element is shown"},element:{control:!1,description:`The file-type icon beside the name; without it the tile has neither the icon nor the checkbox`},thumbnail:{control:`text`,description:"Address of the preview image, drawn across the upper part; the tile falls back to `temporaryIcon` when it fails to load"},temporaryIcon:{control:!1,description:`Placeholder drawn at the bottom of the upper part when there is no preview: an element as given, or the address of an SVG`},badges:{control:!1,description:"Badges in the top end corner of the preview; give their wrapper the class `badges` so clicking them does not select the tile"},contentElement:{control:!1,description:`A column of quick-action buttons in the top start corner of the preview`},contextOptions:{control:`object`,description:`Entries of the menu opened by the three-dot button`},getContextModel:{control:!1,description:`Returns the entries of the menu opened by a right-click; without it a right-click opens nothing`},onSelect:{description:`Called with the new checked state and the item on a plain click on the tile, from the checkbox, and when the icon is tapped on a phone`},setSelection:{description:`Called with an empty list just before a plain click selects the tile, unless the click landed on an image, an input or an icon`},withCtrlSelect:{description:`Called with the item on a Ctrl- or Cmd-click, which then does not select the tile`},withShiftSelect:{description:`Called with the item on a Shift-click, which then does not select the tile`},thumbnailClick:{description:`Called with the event when the preview is clicked; the tile's own click handling runs as well`},tileContextClick:{description:"Called just before the menu opens, with `true` when a right-click opened it"},hideContextMenu:{description:`Called when the menu closes`},forwardRef:{control:!1,description:`Ref to the outer element, which the tile also clicks on a right-click when its menu is not mounted yet`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"tile"`}}},thumbSize:{control:!1,description:`Ignored: no value of it changes the tile`},contextButtonSpacerWidth:{control:!1,description:`Ignored: it lands on the outer element as an unknown attribute`},sideColor:{control:!1,description:`Ignored: it lands on the outer element as an unknown attribute`}},args:{onSelect:O(),setSelection:O(),withCtrlSelect:O(),withShiftSelect:O(),thumbnailClick:O(),tileContextClick:O(),hideContextMenu:O()}},F=({checked:e,onSelect:t,...n})=>{let[r,i]=(0,E.useState)(e),a=(e,n)=>{i(e),t?.(e,n)};return(0,D.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,D.jsx)(v,{...n,checked:r,onSelect:a,children:(0,D.jsx)(b,{children:(0,D.jsx)(c,{children:`File Content`})})})})},I={render:F,args:{item:{id:`file-1`,title:`Document.docx`,fileExst:`.docx`,fileType:u.Document,contextOptions:[`copy-to`,`move-to`]},element:k,contextOptions:j,contentElement:N,badges:M,temporaryIcon:(0,D.jsx)(g,{}),getContextModel:()=>j},parameters:{docs:{description:{story:`A document with no preview yet: a placeholder picture, a badge and a quick action over it, and the name row with the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below.`},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  contentElement={contentElement}
  badges={badges}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},L={render:F,args:{...I.args,checked:!0},parameters:{docs:{description:{story:"A selected file, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (`checked`)."},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},R={render:F,args:{...I.args,inProgress:!0},parameters:{docs:{description:{story:"A file that is busy, being uploaded or converted: a small loader stands where the icon and the checkbox were (`inProgress`)."},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},z={render:F,args:{...I.args,thumbnail:A},parameters:{docs:{description:{story:"A document with a preview: the image fills the upper part, cropped from the top, and the badges sit over it (`thumbnail`). If the image fails to load, the placeholder from `temporaryIcon` takes its place."},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  thumbnail={thumbnailUrl}
  temporaryIcon={<ImageReactSvg />}
  badges={badges}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},B={render:F,args:{...I.args,showHotkeyBorder:!0},parameters:{docs:{description:{story:"The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself."},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  showHotkeyBorder
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},V={render:F,args:{...I.args,isEdit:!0},parameters:{docs:{description:{story:"A file whose name is being edited: the icon and the checkbox go, so the name row can hold a text field (`isEdit`)."},source:{code:`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  isEdit
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>`}}}},H={render:()=>(0,D.jsxs)(`div`,{style:{"--tile-bg":`#f4f9fd`,"--tile-border-style":`1px solid #0082c9`,"--tile-radius":`16px`,"--tile-height":`240px`,"--tile-hover-bg":`#cce5f6`,"--tile-hover-text-decoration":`none`,"--tile-badge-bg":`#e6f3fb`,"--tile-badge-radius":`8px`,"--tile-badge-box-shadow":`0 2px 8px rgba(0,130,201,0.3)`,"--tile-text-size":`13px`,"--tile-text-weight":`600`,"--tile-text-color":`#004d77`,"--tile-text-line-height":`20px`,"--tile-bottom-padding-inline":`8px`,"--tile-thumbnail-padding-inline":`16px`,"--tile-thumbnail-height":`140px`,"--tile-thumbnail-image-radius":`8px`,"--tile-thumbnail-image-hover-bg":`#e6f3fb`,"--tile-thumbnail-transition":`background 0.6s`,"--tile-option-button-padding-end":`8px`,"--tile-hotkey-color":`#e0662e`},children:[(0,D.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`},children:(0,D.jsx)(v,{item:{id:`file-1`,title:`Document.docx`,fileExst:`.docx`,fileType:u.Document,contextOptions:[`copy-to`,`move-to`]},element:k,contextOptions:j,thumbnail:A,badges:M,contentElement:N,getContextModel:()=>j,children:(0,D.jsx)(b,{children:(0,D.jsx)(c,{children:`Document.docx`})})})}),(0,D.jsx)(`div`,{style:{maxWidth:`300px`,margin:`30px`,"--file-tile-border-style":`2px solid`,"--tile-icon-display":`none`},children:(0,D.jsx)(v,{item:{id:`file-2`,title:`Report.docx`,fileExst:`.docx`,fileType:u.Document,contextOptions:[`copy-to`,`move-to`]},element:k,contextOptions:j,temporaryIcon:(0,D.jsx)(g,{}),showHotkeyBorder:!0,getContextModel:()=>j,children:(0,D.jsx)(b,{children:(0,D.jsx)(c,{children:`Report.docx`})})})})]}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page.\n\nTwo instances:\n- **Document.docx** — a preview, a badge and a quick action, for every variable except `--file-tile-border-style`, `--tile-icon-display`, `--tile-hotkey-color` and `--highlightColor`; hover it for the hover variables.\n- **Report.docx** — `showHotkeyBorder`, for `--tile-hotkey-color`, in a wrapper of its own that sets `--file-tile-border-style` to a thicker border and `--tile-icon-display` to `none`.\n\n`--highlightColor` is not set here: the highlight plays once, on mount, and is gone before a reader looks."},source:{code:`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-height": "240px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
  "--tile-bottom-padding-inline": "8px",
  "--tile-thumbnail-padding-inline": "16px",
  "--tile-thumbnail-height": "140px",
  "--tile-thumbnail-image-radius": "8px",
  "--tile-thumbnail-image-hover-bg": "#e6f3fb",
  "--tile-thumbnail-transition": "background 0.6s",
  "--tile-option-button-padding-end": "8px",
  "--tile-hotkey-color": "#e0662e",
}}>
  <FileTile item={file} element={<WordIcon />} contextOptions={options} thumbnail={thumbnailUrl} badges={badges} contentElement={quickActions}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>

  <div style={{ "--file-tile-border-style": "2px solid", "--tile-icon-display": "none" }}>
    <FileTile item={report} element={<WordIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Report.docx</Link></TileContent>
    </FileTile>
  </div>
</div>`}}}},U=[`Default`,`Checked`,`InProgress`,`WithThumbnail`,`WithHotkeyBorder`,`RenamingState`,`CssCustomization`],I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    item: {
      id: "file-1",
      title: "Document.docx",
      fileExst: ".docx",
      fileType: FileType.Document,
      contextOptions: ["copy-to", "move-to"]
    },
    element: wordElement,
    contextOptions,
    contentElement,
    badges,
    temporaryIcon: <ImageReactSvg />,
    getContextModel: () => contextOptions
  },
  parameters: {
    docs: {
      description: {
        story: "A document with no preview yet: a placeholder picture, a badge and a quick action over it, and the name row with the menu. Click the tile to select it, Ctrl- or Shift-click it to see the other callbacks in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  contentElement={contentElement}
  badges={badges}
  temporaryIcon={<ImageReactSvg />}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    checked: true
  },
  parameters: {
    docs: {
      description: {
        story: "A selected file, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the whole tile is tinted (\`checked\`)."
      },
      source: {
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "A file that is busy, being uploaded or converted: a small loader stands where the icon and the checkbox were (\`inProgress\`)."
      },
      source: {
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", fileType: FileType.Document, contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  inProgress={true}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    thumbnail
  },
  parameters: {
    docs: {
      description: {
        story: "A document with a preview: the image fills the upper part, cropped from the top, and the badges sit over it (\`thumbnail\`). If the image fails to load, the placeholder from \`temporaryIcon\` takes its place."
      },
      source: {
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  thumbnail={thumbnailUrl}
  temporaryIcon={<ImageReactSvg />}
  badges={badges}
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  showHotkeyBorder
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isEdit: true
  },
  parameters: {
    docs: {
      description: {
        story: "A file whose name is being edited: the icon and the checkbox go, so the name row can hold a text field (\`isEdit\`)."
      },
      source: {
        code: \`<FileTile
  item={{ id: "file-1", title: "Document.docx", fileExst: ".docx", contextOptions: ["copy-to", "move-to"] }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  temporaryIcon={<ImageReactSvg />}
  isEdit
>
  <TileContent><Link>File Content</Link></TileContent>
</FileTile>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--tile-bg": "#f4f9fd",
    "--tile-border-style": "1px solid #0082c9",
    "--tile-radius": "16px",
    "--tile-height": "240px",
    "--tile-hover-bg": "#cce5f6",
    "--tile-hover-text-decoration": "none",
    "--tile-badge-bg": "#e6f3fb",
    "--tile-badge-radius": "8px",
    "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
    "--tile-text-size": "13px",
    "--tile-text-weight": "600",
    "--tile-text-color": "#004d77",
    "--tile-text-line-height": "20px",
    "--tile-bottom-padding-inline": "8px",
    "--tile-thumbnail-padding-inline": "16px",
    "--tile-thumbnail-height": "140px",
    "--tile-thumbnail-image-radius": "8px",
    "--tile-thumbnail-image-hover-bg": "#e6f3fb",
    "--tile-thumbnail-transition": "background 0.6s",
    "--tile-option-button-padding-end": "8px",
    "--tile-hotkey-color": "#e0662e"
  } as CSSProperties}>
      <div style={{
      maxWidth: "300px",
      margin: "30px"
    }}>
        <FileTile item={{
        id: "file-1",
        title: "Document.docx",
        fileExst: ".docx",
        fileType: FileType.Document,
        contextOptions: ["copy-to", "move-to"]
      }} element={wordElement} contextOptions={contextOptions} thumbnail={thumbnail} badges={badges} contentElement={contentElement} getContextModel={() => contextOptions}>
          <TileContent>
            <Link>Document.docx</Link>
          </TileContent>
        </FileTile>
      </div>
      <div style={{
      maxWidth: "300px",
      margin: "30px",
      "--file-tile-border-style": "2px solid",
      "--tile-icon-display": "none"
    } as CSSProperties}>
        <FileTile item={{
        id: "file-2",
        title: "Report.docx",
        fileExst: ".docx",
        fileType: FileType.Document,
        contextOptions: ["copy-to", "move-to"]
      }} element={wordElement} contextOptions={contextOptions} temporaryIcon={<ImageReactSvg />} showHotkeyBorder getContextModel={() => contextOptions}>
          <TileContent>
            <Link>Report.docx</Link>
          </TileContent>
        </FileTile>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page.

Two instances:
- **Document.docx** — a preview, a badge and a quick action, for every variable except \\\`--file-tile-border-style\\\`, \\\`--tile-icon-display\\\`, \\\`--tile-hotkey-color\\\` and \\\`--highlightColor\\\`; hover it for the hover variables.
- **Report.docx** — \\\`showHotkeyBorder\\\`, for \\\`--tile-hotkey-color\\\`, in a wrapper of its own that sets \\\`--file-tile-border-style\\\` to a thicker border and \\\`--tile-icon-display\\\` to \\\`none\\\`.

\\\`--highlightColor\\\` is not set here: the highlight plays once, on mount, and is gone before a reader looks.\`
      },
      source: {
        code: \`<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-height": "240px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-hover-text-decoration": "none",
  "--tile-badge-bg": "#e6f3fb",
  "--tile-badge-radius": "8px",
  "--tile-badge-box-shadow": "0 2px 8px rgba(0,130,201,0.3)",
  "--tile-text-size": "13px",
  "--tile-text-weight": "600",
  "--tile-text-color": "#004d77",
  "--tile-text-line-height": "20px",
  "--tile-bottom-padding-inline": "8px",
  "--tile-thumbnail-padding-inline": "16px",
  "--tile-thumbnail-height": "140px",
  "--tile-thumbnail-image-radius": "8px",
  "--tile-thumbnail-image-hover-bg": "#e6f3fb",
  "--tile-thumbnail-transition": "background 0.6s",
  "--tile-option-button-padding-end": "8px",
  "--tile-hotkey-color": "#e0662e",
}}>
  <FileTile item={file} element={<WordIcon />} contextOptions={options} thumbnail={thumbnailUrl} badges={badges} contentElement={quickActions}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>

  <div style={{ "--file-tile-border-style": "2px solid", "--tile-icon-display": "none" }}>
    <FileTile item={report} element={<WordIcon />} contextOptions={options} showHotkeyBorder>
      <TileContent><Link>Report.docx</Link></TileContent>
    </FileTile>
  </div>
</div>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}}})))()}W();export{L as Checked,H as CssCustomization,I as Default,R as InProgress,V as RenamingState,B as WithHotkeyBorder,z as WithThumbnail,U as __namedExportsOrder,P as default};