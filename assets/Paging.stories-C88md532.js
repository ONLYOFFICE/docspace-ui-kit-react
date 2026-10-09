import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{n as a,r as o,t as s}from"./button-DjDXE7uo.js";import{n as c,t as l}from"./ComboBox-DWO8Uqxf.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{u=`_paging_hythb_1`,d=`_leftButtonsContainer_hythb_21`,f=`_prevButton_hythb_33`,p=`_nextButton_hythb_34`,m=`_page_hythb_63`,h=`_manualWidth_hythb_71`,g=`_onPage_hythb_96`,_=`_hideDisabled_hythb_109`,v={paging:u,leftButtonsContainer:d,prevButton:f,nextButton:p,page:m,manualWidth:h,onPage:g,hideDisabled:_}})))()}var b,x,S;function C(){return(C=e((()=>{n(),b=t(i()),a(),c(),y(),x=r(),S=e=>{let{previousLabel:t,nextLabel:n,previousAction:r,nextAction:i,pageItems:a,countItems:c,openDirection:u,disablePrevious:d=!1,disableNext:f=!1,selectedPageItem:p,selectedCountItem:m,id:h,className:g,style:_,showCountItem:y=!0,onSelectPage:S,onSelectCount:C,dataTestId:w}=e,T=e=>{S?.(e)},E=e=>{C?.(e)},D=a&&a.length>6?{dropDownMaxHeight:200}:{};return(0,x.jsxs)(`div`,{"data-testid":w??`paging`,id:h,className:(0,b.default)(v.paging,g),style:_,children:[(0,x.jsxs)(`div`,{className:v.leftButtonsContainer,children:[(0,x.jsx)(s,{className:(0,b.default)(v.prevButton,`not-selectable`),size:o.small,scale:!0,label:t,onClick:r,isDisabled:d,testId:`paging_previous_button`}),a?(0,x.jsx)(`div`,{className:v.page,children:(0,x.jsx)(l,{isDisabled:d?f:!1,className:v.manualWidth,directionY:u,options:a,onSelect:T,scaledOptions:a.length<6,selectedOption:p,dataTestId:`paging_page_items_combobox`,...D})}):null,(0,x.jsx)(s,{className:(0,b.default)(v.nextButton,`not-selectable`),size:o.small,scale:!0,label:n,onClick:i,isDisabled:f,testId:`paging_next_button`})]}),y?c&&(0,x.jsx)(`div`,{className:v.onPage,children:(0,x.jsx)(l,{className:v.hideDisabled,directionY:u,directionX:`right`,options:c,scaledOptions:!0,onSelect:E,selectedOption:m,dataTestId:`paging_count_items_combobox`})}):null]})};try{S.displayName=`Paging`,S.__docgenInfo={description:``,displayName:`Paging`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/paging/Paging.tsx`,methods:[],props:{previousLabel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Label of the previous-page button. Nothing here is translated, so pass the string already localised.`,name:`previousLabel`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`string`}},nextLabel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Label of the next-page button. Nothing here is translated, so pass the string already localised.`,name:`nextLabel`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`string`}},previousAction:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Called when the previous button is clicked. A promise it returns is not awaited: the component has no loading state of its own.`,name:`previousAction`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`(e?: MouseEvent<Element, MouseEvent> | undefined) => void | Promise<void>`}},nextAction:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Called when the next button is clicked. A promise it returns is not awaited: the component has no loading state of its own.`,name:`nextAction`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`(e?: MouseEvent<Element, MouseEvent> | undefined) => void | Promise<void>`}},disablePrevious:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Disables the previous button. The page selector is disabled only when `disableNext` is set as well.",name:`disablePrevious`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},disableNext:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Disables the next button.`,name:`disableNext`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},selectedPageItem:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"The option the page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectPage`.",name:`selectedPageItem`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`TOption`}},selectedCountItem:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"The option the per-page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectCount`.",name:`selectedCountItem`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`TOption`}},onSelectPage:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Called with the option that was picked in the page selector. Nothing moves until you update `selectedPageItem` yourself.",name:`onSelectPage`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`((option: TOption) => void | Promise<void>) | undefined`}},onSelectCount:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Called with the option that was picked in the per-page selector. Nothing changes until you update `selectedCountItem` yourself.",name:`onSelectCount`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`((option: TOption) => void | Promise<void>) | undefined`}},pageItems:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"One `{ key, label }` per page. Typed as required, but passing nothing simply leaves the page selector out.",name:`pageItems`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`TOption[]`}},countItems:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"One `{ key, label }` per page size. Typed as required, but passing nothing simply leaves the per-page selector out.",name:`countItems`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!0,tags:{},type:{name:`TOption[]`}},openDirection:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Which way both drop-downs open; `both` lets each one choose by the room under it.",name:`openDirection`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`"bottom" | "top" | "both" | undefined`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Added after the component's own class on the outer element.`,name:`className`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Value of `id` on the outer element.",name:`id`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Inline style of the outer element, and where the `--paging-*` custom properties go.",name:`style`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`CSSProperties | undefined`}},showCountItem:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:`Whether the per-page selector is rendered at all.`,name:`showCountItem`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},dataTestId:{defaultValue:{value:`"paging"`},declarations:[{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`}],description:"Value of `data-testid` on the outer element.",name:`dataTestId`,parent:{fileName:`docspace-ui-kit-react/components/paging/Paging.types.ts`,name:`PagingProps`},required:!1,tags:{default:`"paging"`},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{w=n(),C(),T=r(),{fn:E}=__STORYBOOK_MODULE_TEST__,D={title:`UI/Navigation/Paging`,component:S,parameters:{},argTypes:{previousLabel:{control:`text`,description:`Label of the previous-page button; nothing is translated, so pass the string already localised`},nextLabel:{control:`text`,description:`Label of the next-page button; nothing is translated, so pass the string already localised`},disablePrevious:{control:`boolean`,description:"Disables the previous button; the page selector is disabled too only when `disableNext` is set as well",table:{defaultValue:{summary:`false`}}},disableNext:{control:`boolean`,description:`Disables the next button`,table:{defaultValue:{summary:`false`}}},openDirection:{control:`select`,options:[`bottom`,`top`,`both`],description:"Side of the buttons both drop-downs open on: `bottom`, `top`, or `both` to open below and move above when a list does not fit there",table:{defaultValue:{summary:`bottom`}}},showCountItem:{control:`boolean`,description:`Whether the page-size selector is rendered at all`,table:{defaultValue:{summary:`true`}}},pageItems:{control:!1,description:"One `{ key, label }` per page, listed in the page selector; passing nothing leaves the page selector out"},countItems:{control:!1,description:"One `{ key, label }` per page size, listed in the page-size selector; passing nothing leaves that selector out"},selectedPageItem:{control:!1,description:"The option the page selector shows; hold it in your own state and update it from `onSelectPage`"},selectedCountItem:{control:!1,description:"The option the page-size selector shows; hold it in your own state and update it from `onSelectCount`"},previousAction:{description:`Called when the previous button is clicked; a returned promise is not awaited`},nextAction:{description:`Called when the next button is clicked; a returned promise is not awaited`},onSelectPage:{description:"Called with the option picked in the page selector; nothing moves until you update `selectedPageItem`"},onSelectCount:{description:"Called with the option picked in the page-size selector; nothing changes until you update `selectedCountItem`"},id:{control:`text`,description:"Value of `id` on the outer element"},className:{control:`text`,description:`Added after the component's own class on the outer element`},style:{control:!1,description:"Inline style of the outer element, and where the `--paging-*` custom properties go"},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`paging`}}}},args:{previousAction:E(),nextAction:E(),onSelectPage:E(),onSelectCount:E()}},O=e=>{let t=[];for(let n=1;n<=e;n+=1)t.push({key:n,label:`${n} of ${e}`});return t},k=[{key:25,label:`25 per page`},{key:50,label:`50 per page`},{key:100,label:`100 per page`}],A=O(200),j=({nextAction:e,previousAction:t,onSelectPage:n,onSelectCount:r,...i})=>{let[a,o]=(0,w.useState)(A[0]),[s,c]=(0,w.useState)(k[0]),l=A.findIndex(e=>e.key===a.key);return(0,T.jsx)(`div`,{style:{height:`100%`},children:(0,T.jsx)(S,{...i,pageItems:A,style:{justifyContent:`center`,alignItems:`center`},countItems:k,previousAction:e=>{t(e),A[l-1]&&o(A[l-1])},nextAction:t=>{e(t),A[l+1]&&o(A[l+1])},onSelectPage:e=>{n?.(e),o(e)},onSelectCount:e=>{r?.(e),c(e)},selectedPageItem:a,selectedCountItem:s})})},M={render:e=>(0,T.jsx)(j,{...e}),args:{previousLabel:`Previous`,nextLabel:`Next`,disablePrevious:!1,disableNext:!1,openDirection:`bottom`},parameters:{docs:{description:{story:`The full strip under a list of 200 pages: step with Previous and Next, jump from the page selector, or change the page size, and watch the calls in the Actions panel. The story holds the current page and size itself, as your code must; change any other prop live in the Controls panel below.`},source:{code:`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  pageItems={pageItems}
  countItems={countItems}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
  previousAction={handlePrev}
  nextAction={handleNext}
/>`}}}},N=()=>(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,disablePrevious:!0,pageItems:A,countItems:k,selectedPageItem:A[0],selectedCountItem:k[0],previousAction:async()=>{},nextAction:async()=>{},style:{justifyContent:`center`,alignItems:`center`}}),P={render:()=>(0,T.jsx)(N,{}),parameters:{docs:{description:{story:"On the first page there is nowhere to go back to, so the Previous button is greyed out and ignores clicks (`disablePrevious`); the component does not work this out, you set it."},source:{code:`<Paging previousLabel="Previous" nextLabel="Next" disablePrevious />`}}}},F=()=>(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,disableNext:!0,pageItems:A,countItems:k,selectedPageItem:A[A.length-1],selectedCountItem:k[0],previousAction:async()=>{},nextAction:async()=>{},style:{justifyContent:`center`,alignItems:`center`}}),I={render:()=>(0,T.jsx)(F,{}),parameters:{docs:{description:{story:"On the last page the Next button is greyed out and ignores clicks (`disableNext`), while the page selector stays open for jumping back."},source:{code:`<Paging previousLabel="Previous" nextLabel="Next" disableNext />`}}}},L=()=>(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,showCountItem:!1,pageItems:A,countItems:k,selectedPageItem:A[0],selectedCountItem:k[0],previousAction:async()=>{},nextAction:async()=>{},style:{justifyContent:`center`,alignItems:`center`}}),R={render:()=>(0,T.jsx)(L,{}),parameters:{docs:{description:{story:"For a list whose page size is fixed, the page-size selector at the end is left out (`showCountItem={false}`), leaving the two buttons and the page selector."},source:{code:`<Paging previousLabel="Previous" nextLabel="Next" showCountItem={false} />`}}}},z=()=>{let e=O(1);return(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,disablePrevious:!0,disableNext:!0,pageItems:e,countItems:k,selectedPageItem:e[0],selectedCountItem:k[0],previousAction:()=>{},nextAction:()=>{},style:{justifyContent:`center`,alignItems:`center`}})},B={render:()=>(0,T.jsx)(z,{}),parameters:{docs:{description:{story:"When the whole list fits on one page, both buttons are greyed out and the page selector is disabled with them (`disablePrevious` and `disableNext` together), while the page size can still be changed."},source:{code:`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  disablePrevious
  disableNext
  pageItems={[{ key: 1, label: "1 of 1" }]}
  countItems={countItems}
  selectedPageItem={{ key: 1, label: "1 of 1" }}
  selectedCountItem={countItems[0]}
  previousAction={handlePrev}
  nextAction={handleNext}
/>`}}}},V=()=>(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,pageItems:void 0,countItems:void 0,selectedPageItem:A[0],selectedCountItem:k[0],previousAction:()=>{},nextAction:()=>{},style:{justifyContent:`center`,alignItems:`center`}}),H={render:()=>(0,T.jsx)(V,{}),parameters:{docs:{description:{story:"For a list whose length is not known, only the Previous and Next buttons remain once neither list of options is passed (`pageItems` and `countItems` left out)."},source:{code:`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  previousAction={handlePrev}
  nextAction={handleNext}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
/>`}}}},U={render:()=>(0,T.jsx)(`div`,{style:{"--paging-gap":`16px`,"--paging-button-gap":`12px`,"--paging-font-size":`14px`,"--paging-button-padding":`8px 32px`,"--paging-prev-width":`140px`,"--paging-next-width":`120px`,"--paging-count-width":`160px`,"--paging-nav-height":`48px`},children:(0,T.jsx)(S,{previousLabel:`Previous`,nextLabel:`Next`,disablePrevious:!1,disableNext:!1,openDirection:`bottom`,pageItems:O(10),countItems:k,selectedCountItem:{key:25,label:`25 per page`},selectedPageItem:{key:1,label:`1 of 10`},previousAction:()=>{},nextAction:()=>{}})}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example raises the width cap of both buttons so their larger labels are not cut off, widens the page-size selector, and shows taller controls in a window narrower than 1024px.`},source:{code:`<div
  style={{
    "--paging-gap": "16px",
    "--paging-button-gap": "12px",
    "--paging-font-size": "14px",
    "--paging-button-padding": "8px 32px",
    "--paging-prev-width": "140px",
    "--paging-next-width": "120px",
    "--paging-count-width": "160px",
    "--paging-nav-height": "48px",
  }}
>
  <Paging previousLabel="Previous" nextLabel="Next" {...props} />
</div>`}}}},W=[`Default`,`DisabledPrevious`,`DisabledNext`,`WithoutCountSelector`,`SinglePage`,`ButtonsOnly`,`CssCustomization`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    previousLabel: "Previous",
    nextLabel: "Next",
    disablePrevious: false,
    disableNext: false,
    openDirection: "bottom"
  },
  parameters: {
    docs: {
      description: {
        story: "The full strip under a list of 200 pages: step with Previous and Next, jump from the page selector, or change the page size, and watch the calls in the Actions panel. The story holds the current page and size itself, as your code must; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  pageItems={pageItems}
  countItems={countItems}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
  previousAction={handlePrev}
  nextAction={handleNext}
/>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledPreviousTemplate />,
  parameters: {
    docs: {
      description: {
        story: "On the first page there is nowhere to go back to, so the Previous button is greyed out and ignores clicks (\`disablePrevious\`); the component does not work this out, you set it."
      },
      source: {
        code: \`<Paging previousLabel="Previous" nextLabel="Next" disablePrevious />\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledNextTemplate />,
  parameters: {
    docs: {
      description: {
        story: "On the last page the Next button is greyed out and ignores clicks (\`disableNext\`), while the page selector stays open for jumping back."
      },
      source: {
        code: \`<Paging previousLabel="Previous" nextLabel="Next" disableNext />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <WithoutCountTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a list whose page size is fixed, the page-size selector at the end is left out (\`showCountItem={false}\`), leaving the two buttons and the page selector."
      },
      source: {
        code: \`<Paging previousLabel="Previous" nextLabel="Next" showCountItem={false} />\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <SinglePageTemplate />,
  parameters: {
    docs: {
      description: {
        story: "When the whole list fits on one page, both buttons are greyed out and the page selector is disabled with them (\`disablePrevious\` and \`disableNext\` together), while the page size can still be changed."
      },
      source: {
        code: \`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  disablePrevious
  disableNext
  pageItems={[{ key: 1, label: "1 of 1" }]}
  countItems={countItems}
  selectedPageItem={{ key: 1, label: "1 of 1" }}
  selectedCountItem={countItems[0]}
  previousAction={handlePrev}
  nextAction={handleNext}
/>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonsOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a list whose length is not known, only the Previous and Next buttons remain once neither list of options is passed (\`pageItems\` and \`countItems\` left out)."
      },
      source: {
        code: \`<Paging
  previousLabel="Previous"
  nextLabel="Next"
  previousAction={handlePrev}
  nextAction={handleNext}
  selectedPageItem={currentPage}
  selectedCountItem={currentCount}
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--paging-gap": "16px",
    "--paging-button-gap": "12px",
    "--paging-font-size": "14px",
    "--paging-button-padding": "8px 32px",
    "--paging-prev-width": "140px",
    "--paging-next-width": "120px",
    "--paging-count-width": "160px",
    "--paging-nav-height": "48px"
  } as CSSProperties}>
      <Paging previousLabel="Previous" nextLabel="Next" disablePrevious={false} disableNext={false} openDirection="bottom" pageItems={createPageItems(10)} countItems={countItems} selectedCountItem={{
      key: 25,
      label: "25 per page"
    }} selectedPageItem={{
      key: 1,
      label: "1 of 10"
    }} previousAction={() => {}} nextAction={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example raises the width cap of both buttons so their larger labels are not cut off, widens the page-size selector, and shows taller controls in a window narrower than 1024px.\`
      },
      source: {
        code: \`<div
  style={{
    "--paging-gap": "16px",
    "--paging-button-gap": "12px",
    "--paging-font-size": "14px",
    "--paging-button-padding": "8px 32px",
    "--paging-prev-width": "140px",
    "--paging-next-width": "120px",
    "--paging-count-width": "160px",
    "--paging-nav-height": "48px",
  }}
>
  <Paging previousLabel="Previous" nextLabel="Next" {...props} />
</div>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}}})))()}G();export{H as ButtonsOnly,U as CssCustomization,M as Default,I as DisabledNext,P as DisabledPrevious,B as SinglePage,R as WithoutCountSelector,W as __namedExportsOrder,D as default};