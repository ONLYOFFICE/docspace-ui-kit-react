import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";var r,i,a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{r=100,a=0,o=0,s=!1,c=0,l=0,u=()=>typeof document<`u`?document.getElementById(`ipl-progress-indicator`):null,d=e=>{e&&(e.setAttribute(`role`,`progressbar`),e.setAttribute(`aria-valuemin`,`0`),e.setAttribute(`aria-valuemax`,`100`),e.setAttribute(`data-test-id`,`top-loader`))},f=()=>{i&&clearTimeout(i),i=null;let e=u();e&&(e.style.width=`0px`,e.setAttribute(`aria-valuenow`,`0`)),a=0,o=0,s=!1,c=0,l=0},p=()=>{if(a>=r){f();return}let e=Date.now();if(s){let t=e-c,n=Math.min(t/1e3,1);a=o+(r-o)*n}else if(l>0){let t=e-l;if(t<=1e3)a=t/1e3*50;else{let e=Math.floor((t-1e3)/1e3);a=Math.min(50+(e+1)*10,90)}}let t=u();t&&(t.style.width=`${a}%`,t.setAttribute(`aria-valuenow`,a.toString()))},m=()=>{if(i)return;let e=u();e&&d(e),l=Date.now(),i=setInterval(p,50)},h=class{static start(){o=0,a=0,s=!1,c=0;let e=u();e&&e.setAttribute(`aria-valuenow`,`0`),m()}static cancel(){f()}static end(){i&&(o=a,s=!0,c=Date.now())}}})))()}var _,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{_=t(),g(),v=n(),y={title:`UI/Feedback/TopLoader`,parameters:{}},b=()=>((0,_.useEffect)(()=>{let e=document.createElement(`div`);return e.id=`ipl-progress-indicator`,e.style.position=`fixed`,e.style.top=`0`,e.style.left=`0`,e.style.height=`2px`,e.style.backgroundColor=`#2DA7DB`,e.style.transition=`width 0.2s ease-in-out`,document.body.appendChild(e),()=>{h.cancel(),document.body.contains(e)&&document.body.removeChild(e)}},[]),(0,v.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,padding:`20px`},children:[(0,v.jsx)(`button`,{type:`button`,onClick:()=>h.start(),children:`Start Loading`}),(0,v.jsx)(`button`,{type:`button`,onClick:()=>h.end(),children:`End Loading`}),(0,v.jsx)(`button`,{type:`button`,onClick:()=>h.cancel(),children:`Cancel`})]})),x={render:()=>(0,v.jsx)(b,{}),parameters:{docs:{description:{story:"Press **Start Loading** and a thin bar grows along the top of the viewport and stops at 90%; **End Loading** runs it to the full width and clears it, **Cancel** clears it at once (`start`, `end`, `cancel`). Use it to see how long a wait looks before the work finishes."},source:{code:`// Add to HTML: <div id="ipl-progress-indicator" />

// Start loading
TopLoaderService.start();

// Complete loading
TopLoaderService.end();

// Cancel loading
TopLoaderService.cancel();`}}}},S=e=>{(0,_.useEffect)(()=>{let t=document.createElement(`div`);return t.id=`top-loader-css-customization-demo`,Object.assign(t.style,e),document.body.appendChild(t),()=>{document.body.contains(t)&&document.body.removeChild(t)}},[])},C=()=>(S({position:`fixed`,top:`0`,left:`0`,width:`65%`,height:`4px`,backgroundColor:`#0082c9`,borderRadius:`0 2px 2px 0`,boxShadow:`0 0 8px rgba(0, 130, 201, 0.5)`,zIndex:`9999`,transition:`width 0.2s ease-in-out`}),(0,v.jsxs)(`div`,{style:{padding:`40px 20px`},children:[(0,v.jsxs)(`p`,{style:{margin:0,fontSize:`13px`,color:`#555`},children:[`Progress bar at 65% — a static visual demo of the styles you would apply to `,(0,v.jsx)(`code`,{children:`#ipl-progress-indicator`}),` (rendered here under a different id so it doesn't collide with the live bar in the Default story)`]}),(0,v.jsxs)(`p`,{style:{marginTop:`8px`,fontSize:`12px`,color:`#888`},children:[`Customizable properties: `,(0,v.jsx)(`strong`,{children:`height`}),`,`,` `,(0,v.jsx)(`strong`,{children:`backgroundColor`}),`, `,(0,v.jsx)(`strong`,{children:`borderRadius`}),`,`,` `,(0,v.jsx)(`strong`,{children:`boxShadow`}),`, `,(0,v.jsx)(`strong`,{children:`transition`}),`,`,` `,(0,v.jsx)(`strong`,{children:`zIndex`})]})]})),w={render:()=>(0,v.jsx)(C,{}),parameters:{docs:{description:{story:'`TopLoaderService` defines no CSS custom properties -- the element\'s own style does all of it, as the recipe "The element, and its style" on this page describes.\nThis story renders a static demo bar under a different id, purely for visual reference -- it is not driven by `TopLoaderService`.'},source:{code:`<div
  id="ipl-progress-indicator"
  style={{
    position: "fixed",
    top: 0,
    insetInlineStart: 0,
    width: 0,
    height: 4,
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    transition: "width 0.2s ease-in-out",
    zIndex: 9999,
  }}
/>`}}}},T=[`Default`,`CssCustomization`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Press **Start Loading** and a thin bar grows along the top of the viewport and stops at 90%; **End Loading** runs it to the full width and clears it, **Cancel** clears it at once (\\\`start\\\`, \\\`end\\\`, \\\`cancel\\\`). Use it to see how long a wait looks before the work finishes."
      },
      source: {
        code: \`// Add to HTML: <div id="ipl-progress-indicator" />

// Start loading
TopLoaderService.start();

// Complete loading
TopLoaderService.end();

// Cancel loading
TopLoaderService.cancel();\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`\\\`TopLoaderService\\\` defines no CSS custom properties -- the element's own style does all of it, as the recipe "The element, and its style" on this page describes.
This story renders a static demo bar under a different id, purely for visual reference -- it is not driven by \\\`TopLoaderService\\\`.\`
      },
      source: {
        code: \`<div
  id="ipl-progress-indicator"
  style={{
    position: "fixed",
    top: 0,
    insetInlineStart: 0,
    width: 0,
    height: 4,
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    transition: "width 0.2s ease-in-out",
    zIndex: 9999,
  }}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}}})))()}E();export{w as CssCustomization,x as Default,T as __namedExportsOrder,y as default};