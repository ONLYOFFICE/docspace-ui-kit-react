import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,r as a}from"./InterfaceDirectionContext-Bc3bP5Oy.js";var o,s,c,l,u;function d(){return(d=e((()=>{o=200,s=50,c=null,l=()=>{c&&clearTimeout(c)},u=e=>{let t=document.querySelector(`.section-scroll`);if(t){let n=e.clientY,r=document.documentElement.clientHeight,i=o,a=r-o,u=n<i,d=n>a;if(!(u||d)){l();return}let f=t.scrollHeight-r,p=()=>{let e=t.scrollTop,r=e>0,c=e<f,l=e;if(u&&r){let e=(i-n)/o;l-=s*e}else if(d&&c){let e=(n-a)/o;l+=s*e}return l=Math.max(0,Math.min(f,l)),l!==e&&(t.scrollTo(0,l),!0)},m=()=>{l(),p()&&(c=setTimeout(m,30))};m()}}})))()}var f,p;function m(){return(m=e((()=>{f=`_selectionArea_1iwfl_1`,p={selectionArea:f}})))()}var h;function g(){return(g=e((()=>{h=e=>{let t=-1,n=!1;return{next:()=>{n||(n=!0,t=requestAnimationFrame(()=>{e(),n=!1}))},cancel:()=>{cancelAnimationFrame(t),n=!1}}}})))()}var _,v,y;function b(){return(b=e((()=>{_=t(n()),i(),d(),m(),g(),v=r(),y=({onMove:e,selectableClass:t=``,scrollClass:n,viewAs:r,itemsContainerClass:i,isRooms:o,folderHeaderHeight:s,countTilesInRow:c,defaultHeaderHeight:d,arrayTypes:f,containerClass:m,itemClass:g,onMouseDown:y})=>{let b=_.useRef({x1:0,x2:0,y1:0,y2:0}),x=_.useRef(new DOMRect),S=_.useRef(null),C=_.useRef([]),w=_.useRef({top:0,left:0,width:0,height:0}),T=_.useRef({x:0,y:0}),E=_.useRef(null),D=_.useRef({x:0,y:0}),O=_.useRef(new Set),{isRTL:k}=a(),A=_.useCallback((e,t)=>{let{right:n,left:i,bottom:a,top:o}=x.current;if(!E.current)return;let{scrollTop:s}=E.current,l,u,p,m;if(r===`tile`){let h=0,g=f?.find(e=>e.type===t)?.rowGap||0;if(e===0)l=w.current.top-s,u=l+w.current.height;else{let n=C.current.findIndex(e=>e.type===t),r=n===0?0:n;l=d?r*d:0;let i=C.current[n].itemHeight+g;if(r){let t=0;for(let e=0;e<n;e+=1){let n=f?.find(t=>t.type===C.current[e].type);n&&(h+=n.countOfMissingTiles||0,t+=n.rowCount||0,n.rowGap&&n.rowCount&&(l+=(C.current[e].itemHeight+n.rowGap)*n.rowCount))}let r=Math.floor((e+h)/c)-t;l+=w.current.top+i*r-s,u=l+i-g}else{let t=Math.trunc(e/c);l+=w.current.top+i*t-s,u=l+i-g}}let _=(e+h)%c;return k&&r===`tile`&&(_=c-1-_),_===0?(p=w.current.left,m=p+w.current.width):(p=w.current.left+(w.current.width+g)*_,m=p+w.current.width),n>p&&i<m&&a>l&&o<u}let h=w.current.height;return e===0?(l=w.current.top-s,u=l+h):(l=w.current.top+h*e-s,u=l+h),a>l&&o<u},[f,c,d,k,r]),j=_.useCallback(()=>{let e=document.getElementsByClassName(m)[0]??document.querySelectorAll(`html`)[0];if(!e)return;let{scrollTop:t,scrollHeight:n,clientHeight:r,scrollLeft:i,scrollWidth:a,clientWidth:o}=e,s=e.getBoundingClientRect(),{x1:c,y1:l}=b.current,{x2:u,y2:d}=b.current;u<s.left?(D.current.x=i?-Math.abs(s.left-u):0,u=u<s.left?s.left:u):u>s.right?(D.current.x=a-i-o?Math.abs(s.left+s.width-u):0,u=u>s.right?s.right:u):D.current.x=0,d<s.top?(D.current.y=t?-Math.abs(s.top-d):0,d=d<s.top?s.top:d):d>s.bottom?(D.current.y=n-t-r?Math.abs(s.top+s.height-d):0,d=d>s.bottom?s.bottom:d):D.current.y=0;let f=Math.min(c,u),p=Math.min(l,d),h=Math.max(c,u),g=Math.max(l,d);x.current.x=f+1,x.current.y=p+1,x.current.width=h-f-3,x.current.height=g-p-3},[m]),M=_.useCallback(()=>{let n=[],i=[],a=[],o=document.getElementsByClassName(t),s=[...Array.from(o),...Array.from(O.current)];for(let e=0;e<s.length;e+=1){let t=s[e],o=r===`tile`?t?.getAttribute(`value`)?.split(`_`):t?.getElementsByClassName(g)[0]?.getAttribute(`value`)?.split(`_`),c=o?.[0],l=o?.[o.length-1];C.current.findIndex(e=>e.type===c)===-1&&C.current.push({type:c||``,itemHeight:t.getBoundingClientRect().height}),A(l?+l:0,c||``)?(n.push(t),a.push(t)):i.push(t)}e?.({added:n,removed:i})},[A,g,e,t,r]),N=()=>{if(!x.current||!S?.current)return;let{x:e,y:t,width:n,height:r}=x.current,{style:i}=S.current;i.left=`${e}px`,i.top=`${t}px`,i.width=`${n}px`,i.height=`${r}px`},P=_.useCallback(()=>h(()=>{j(),M(),N()}),[j,M]),F=_.useCallback(e=>{b.current.x2=e.clientX,b.current.y2=e.clientY,u(e),P().next()},[P]),I=_.useCallback(e=>{let{scrollTop:n,scrollLeft:r}=e.target;b.current.x1+=T.current.x-r,b.current.y1+=T.current.y-n,T.current.x=r,T.current.y=n;let i=document.getElementsByClassName(t);for(let e=0;e<i.length;e+=1){let t=i[e];O.current.add(t)}P().next()},[P,t]),L=_.useCallback(e=>{let{x1:t,y1:n}=b.current;S.current&&(Math.abs(e.clientX-t)>=10||Math.abs(e.clientY-n)>=10)&&(document.removeEventListener(`mousemove`,L),document.addEventListener(`mousemove`,F,{passive:!1}),S.current.style.display=`block`,F(e))},[F]),R=_.useCallback(()=>{document.removeEventListener(`mousemove`,L),document.removeEventListener(`mousemove`,F),E.current&&E.current.removeEventListener(`scroll`,I)},[L,I,F]),z=_.useCallback(()=>{if(l(),R(),document.removeEventListener(`mouseup`,z),window.removeEventListener(`blur`,z),D.current.x=0,D.current.y=0,O.current=new Set,P()?.cancel(),S.current){let{style:e}=S.current;e.display=`none`,e.left=`0px`,e.top=`0px`,e.width=`0px`,e.height=`0px`}},[P,R]),B=_.useCallback(()=>{document.addEventListener(`mousemove`,L,{passive:!1}),document.addEventListener(`mouseup`,z),window.addEventListener(`blur`,z),E.current&&E.current.addEventListener(`scroll`,I)},[L,I,z]),V=_.useCallback(a=>{if(y?.(a),a.button!==0)return;let c=a.target;if(c&&c.closest(`.not-selectable`)||c.closest(`.tile-selected`)||c.closest(`.table-row-selected`)||c.closest(`.row-selected`)||!c.closest(`#sectionScroll`)||c.closest(`.table-container_row-checkbox`)||c.closest(`.item-file-name`)||!document.getElementsByClassName(t).length)return;b.current={x1:a.clientX,y1:a.clientY,x2:0,y2:0};let l=n&&document.getElementsByClassName(n)?document.getElementsByClassName(n)[0]:document;l instanceof Element&&(E.current=l),l instanceof Element&&(T.current={x:l.scrollLeft,y:l.scrollTop});let{x1:u,y1:d}=b.current;(Math.abs(a.clientX-u)>=10||Math.abs(a.clientY-d)>=10)&&e?.({added:[],removed:[],clear:!0}),B();let f=document.getElementsByClassName(i);if(!f?.length)return;try{let e=f[0].getBoundingClientRect();l instanceof Element&&(!o&&r===`tile`?(w.current.top=l.scrollTop+e.top+s,w.current.left=l.scrollLeft+e.left):(w.current.top=l.scrollTop+e.top,w.current.left=l.scrollLeft+e.left))}catch(e){console.error(`Error getting container bounds:`,e);return}let p=f[0].getElementsByClassName(t)[0].getBoundingClientRect();w.current.width=p.width,w.current.height=p.height},[B,s,o,i,e,n,t,r]);return _.useEffect(()=>(document.addEventListener(`mousedown`,V),()=>{document.removeEventListener(`mousedown`,V)}),[V]),_.useEffect(()=>{C.current=[]},[o,r]),(0,v.jsx)(`div`,{ref:S,className:`${p.selectionArea} selection-area`,"data-testid":`selection-area`})};try{y.displayName=`SelectionArea`,y.__docgenInfo={description:``,displayName:`SelectionArea`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/selection-area/SelectionArea.tsx`,methods:[],props:{containerClass:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"Class of the element the rectangle is clamped to. When nothing matches it, the `<html>` element is used. Required.",name:`containerClass`,required:!0,tags:{},type:{name:`string`}},selectableClass:{defaultValue:{value:``},declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"Class every selectable element carries. Each one must also have a `value` attribute shaped `type_…_index`, which is how the component works out where it sits. Required.",name:`selectableClass`,required:!1,tags:{},type:{name:`string`}},onMove:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:`Called on every animation frame of a drag with the full covered and uncovered sets.`,name:`onMove`,required:!1,tags:{},type:{name:`(({ added, removed, clear }: TOnMove) => void) | undefined`}},scrollClass:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"Class of the scrolling element. The component listens to its `scroll` and shifts the rectangle to match; without a match it falls back to the document. Required.",name:`scrollClass`,required:!0,tags:{},type:{name:`string`}},viewAs:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:'`"tile"` switches to the grid arithmetic — columns, row gaps and missing tiles; anything else is treated as a single column. Required.',name:`viewAs`,required:!0,tags:{},type:{name:`TViewAs`}},itemsContainerClass:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:`Class of the element the items sit in. It is measured once, at the start of each drag, to place the grid's origin. Required.`,name:`itemsContainerClass`,required:!0,tags:{},type:{name:`string`}},isRooms:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"In tile view, skips adding `folderHeaderHeight` to the grid's origin.",name:`isRooms`,required:!1,tags:{},type:{name:`boolean | undefined`}},folderHeaderHeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"Height in pixels of the header above the tiles, added to the grid's origin unless `isRooms` is set. It is asserted to exist in tile view.",name:`folderHeaderHeight`,required:!1,tags:{},type:{name:`number | undefined`}},arrayTypes:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:`One entry per group of items, in the order they appear. Tile arithmetic needs it; without it every gap and row count is taken as zero.`,name:`arrayTypes`,required:!1,tags:{},type:{name:`TArrayTypes[] | undefined`}},itemClass:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"In row view, the class of the descendant that carries the `value` attribute. Required.",name:`itemClass`,required:!0,tags:{},type:{name:`string`}},countTilesInRow:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:"How many tiles fit in a row. It is asserted to exist in tile view, where a missing value makes every position `NaN`.",name:`countTilesInRow`,required:!1,tags:{},type:{name:`number | undefined`}},defaultHeaderHeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:`Height in pixels of one group heading, multiplied by the number of headings above a group.`,name:`defaultHeaderHeight`,required:!1,tags:{},type:{name:`number | undefined`}},onMouseDown:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/selection-area/SelectionArea.types.ts`,name:`TypeLiteral`}],description:`Called on every mouse-down on the document, before the button and the target are checked — so it fires for the right button and for clicks that start no selection.`,name:`onMouseDown`,required:!1,tags:{},type:{name:`((event: MouseEvent) => void) | undefined`}}},tags:{}}}catch{}})))()}var x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{x=`_container_g0dq6_1`,S=`_itemsContainer_g0dq6_9`,C=`_item_g0dq6_9`,w=`_selected_g0dq6_28`,T=`_rowList_g0dq6_37`,E=`_exactGrid_g0dq6_43`,D=`_row_g0dq6_37`,O={container:x,itemsContainer:S,item:C,selected:w,rowList:T,exactGrid:E,row:D}})))()}var A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{A=n(),b(),k(),j=r(),M={title:`UI/Layout/SelectionArea`,component:y,tags:[`!autodocs`],parameters:{},argTypes:{viewAs:{control:`select`,options:[`tile`,`row`],description:"`tile` works out each item's place on a grid of columns and rows; any other value treats the items as one column of equal-height rows",table:{defaultValue:{summary:`undefined`}}},folderHeaderHeight:{control:`number`,description:"Height in pixels of a header above the tiles, added to the top of the grid in tile view unless `isRooms` is set; tile view expects it to be set",table:{defaultValue:{summary:`undefined`}}},defaultHeaderHeight:{control:`number`,description:`Height in pixels of one group heading in tile view, counted once for every group above an item's group`,table:{defaultValue:{summary:`undefined`}}},countTilesInRow:{control:`number`,description:`How many tiles fit in one row in tile view; without it no tile is ever covered`,table:{defaultValue:{summary:`undefined`}}},isRooms:{control:`boolean`,description:"In tile view, leaves `folderHeaderHeight` out of the grid's top edge",table:{defaultValue:{summary:`undefined`}}},arrayTypes:{control:`object`,description:"One entry per group of items, in display order: the group name matched against the first part of an item's `value`, the gap between its rows, how many rows it takes and how many tile slots it leaves empty at the end",table:{defaultValue:{summary:`undefined`}}},containerClass:{control:!1,description:`Class of the element the rectangle stays inside; the whole page when nothing carries it. Fixed by the story`},selectableClass:{control:!1,description:"Class every selectable item carries, together with a `value` attribute shaped `group_…_index`. Fixed by the story"},scrollClass:{control:!1,description:`Class of the scrolling element; when it scrolls, the rectangle's starting corner moves with the content. Fixed by the story`},itemsContainerClass:{control:!1,description:`Class of the element the items sit in; its top-left corner, read when a drag starts, is where the first item is taken to be. Fixed by the story`},itemClass:{control:!1,description:"In row view, the class of the child inside each item that carries the `value` attribute. Fixed by the story"},onMove:{control:!1,description:"Called on every animation frame of a drag with every covered item (`added`) and every uncovered one (`removed`). The story uses it to highlight the covered items"},onMouseDown:{action:`onMouseDown`,description:`Called on every mouse-down anywhere in the document, before the component checks the button and where the press landed`}},decorators:[e=>(0,j.jsx)(`div`,{id:`sectionScroll`,className:O.container,children:(0,j.jsx)(e,{})})]},N=({gridClassName:e=O.itemsContainer,...t})=>{let[n,r]=(0,A.useState)([]),i=({added:e,removed:n})=>{r(r=>{let i=[...r];return e.forEach(e=>{let n=(t.viewAs===`tile`?e:e.getElementsByClassName(t.itemClass||`item-name`)[0])?.getAttribute(`value`);n&&!i.includes(n)&&i.push(n)}),n.forEach(e=>{let n=(t.viewAs===`tile`?e:e.getElementsByClassName(t.itemClass||`item-name`)[0])?.getAttribute(`value`);if(n){let e=i.indexOf(n);e>-1&&i.splice(e,1)}}),i})};return(0,j.jsxs)(j.Fragment,{children:[t.viewAs===`tile`?(0,j.jsx)(`div`,{className:e,children:Array.from({length:12}).map((e,t)=>(0,j.jsxs)(`div`,{className:`${O.item} selectable-item ${n.includes(`item_${t}`)?O.selected:``}`,value:`item_${t}`,"data-id":`item_${t}`,children:[`Item `,t+1]},`item_${String(t)}`))}):(0,j.jsx)(`div`,{className:O.rowList,children:Array.from({length:12}).map((e,t)=>(0,j.jsx)(`div`,{className:`${O.row} selectable-item ${n.includes(`row_${t}`)?O.selected:``}`,children:(0,j.jsxs)(`span`,{className:`item-name`,value:`row_${t}`,children:[`Row `,t+1]})},`row_${String(t)}`))}),(0,j.jsx)(y,{...t,onMove:i,containerClass:O.container,itemsContainerClass:t.viewAs===`tile`?e:O.rowList,selectableClass:`selectable-item`,scrollClass:O.container,itemClass:`item-name`})]})},P={render:e=>(0,j.jsx)(N,{...e}),args:{viewAs:`tile`,folderHeaderHeight:0,defaultHeaderHeight:0,countTilesInRow:4,arrayTypes:[{type:`item`,itemHeight:150,rowGap:16}],isRooms:!1},parameters:{docs:{description:{story:`A grid of tiles, the layout the rectangle's column and row arithmetic is built for. Click and drag across the items to select them; a covered tile turns blue. Change any other prop live in the Controls panel below.`},source:{code:`<SelectionArea
  viewAs="tile"
  containerClass="my-container"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
  countTilesInRow={4}
  arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
/>`}}}},F={render:e=>(0,j.jsx)(N,{...e}),args:{viewAs:`row`},parameters:{docs:{description:{story:"A list of equal-height rows, where only the rectangle's vertical extent decides what is covered: drag down from any row and every row it crosses turns blue, however far to the side the pointer goes (`viewAs`). Each row keeps its `value` on a child, found by `itemClass`."},source:{code:`<SelectionArea
  viewAs="row"
  containerClass="my-scroll"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
/>`}}}},I={render:e=>(0,j.jsx)(`div`,{dir:`rtl`,children:(0,j.jsx)(N,{...e,gridClassName:O.exactGrid})}),globals:{direction:`rtl`},args:{...P.args},parameters:{docs:{story:{inline:!1,height:`640px`},description:{story:'The tile grid in a right-to-left layout: the first tile sits in the top right corner, and a drag across the right-hand column selects the first tile of each row. The wrapper carries `dir="rtl"` for the grid; the component mirrors its column order from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>`}}}},L={render:e=>(0,j.jsx)(`div`,{style:{"--selection-area-bg":`rgba(0, 130, 201, 0.25)`,"--selection-area-border":`1px solid #0082c9`,"--selection-area-z-index":`10`},children:(0,j.jsx)(N,{...e})}),args:{viewAs:`tile`,folderHeaderHeight:0,defaultHeaderHeight:0,countTilesInRow:4,arrayTypes:[{type:`item`,itemHeight:150,rowGap:16}],isRooms:!1},parameters:{docs:{description:{story:`All three variables set on one wrapper -- the variables are listed under CSS variables on this page. Drag across the tiles to see the fill and the border.`},source:{code:`<div
  style={{
    "--selection-area-bg": "rgba(0, 130, 201, 0.25)",
    "--selection-area-border": "1px solid #0082c9",
    "--selection-area-z-index": "10",
  }}
>
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>`}}}},R=[`Default`,`RowView`,`RightToLeft`,`CssCustomization`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <SelectionTemplate {...args} />,
  args: {
    viewAs: "tile",
    folderHeaderHeight: 0,
    defaultHeaderHeight: 0,
    countTilesInRow: 4,
    arrayTypes: [{
      type: "item",
      itemHeight: 150,
      rowGap: 16
    }],
    isRooms: false
  },
  parameters: {
    docs: {
      description: {
        story: "A grid of tiles, the layout the rectangle's column and row arithmetic is built for. Click and drag across the items to select them; a covered tile turns blue. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<SelectionArea
  viewAs="tile"
  containerClass="my-container"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
  countTilesInRow={4}
  arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <SelectionTemplate {...args} />,
  args: {
    viewAs: "row"
  },
  parameters: {
    docs: {
      description: {
        story: "A list of equal-height rows, where only the rectangle's vertical extent decides what is covered: drag down from any row and every row it crosses turns blue, however far to the side the pointer goes (\`viewAs\`). Each row keeps its \`value\` on a child, found by \`itemClass\`."
      },
      source: {
        code: \`<SelectionArea
  viewAs="row"
  containerClass="my-scroll"
  itemsContainerClass="my-items"
  selectableClass="selectable-item"
  scrollClass="my-scroll"
  itemClass="item-name"
  onMove={handleMove}
/>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <SelectionTemplate {...args} gridClassName={styles.exactGrid} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "640px"
      },
      description: {
        story: 'The tile grid in a right-to-left layout: the first tile sits in the top right corner, and a drag across the right-hand column selects the first tile of each row. The wrapper carries \`dir="rtl"\` for the grid; the component mirrors its column order from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    "--selection-area-bg": "rgba(0, 130, 201, 0.25)",
    "--selection-area-border": "1px solid #0082c9",
    "--selection-area-z-index": "10"
  } as CSSProperties}>
      <SelectionTemplate {...args} />
    </div>,
  args: {
    viewAs: "tile",
    folderHeaderHeight: 0,
    defaultHeaderHeight: 0,
    countTilesInRow: 4,
    arrayTypes: [{
      type: "item",
      itemHeight: 150,
      rowGap: 16
    }],
    isRooms: false
  },
  parameters: {
    docs: {
      description: {
        story: \`All three variables set on one wrapper -- the variables are listed under CSS variables on this page. Drag across the tiles to see the fill and the border.\`
      },
      source: {
        code: \`<div
  style={{
    "--selection-area-bg": "rgba(0, 130, 201, 0.25)",
    "--selection-area-border": "1px solid #0082c9",
    "--selection-area-z-index": "10",
  }}
>
  <SelectionArea
    viewAs="tile"
    containerClass="my-container"
    itemsContainerClass="my-items"
    selectableClass="selectable-item"
    scrollClass="my-scroll"
    itemClass="item-name"
    onMove={handleMove}
    countTilesInRow={4}
    arrayTypes={[{ type: "item", itemHeight: 150, rowGap: 16 }]}
  />
</div>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}}})))()}z();export{L as CssCustomization,P as Default,I as RightToLeft,F as RowView,R as __namedExportsOrder,M as default};