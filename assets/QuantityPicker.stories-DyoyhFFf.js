import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{n as a,t as o}from"./tooltip-DcisrCmM.js";import{r as s,t as c}from"./text-Cz_cI6Yf.js";import{n as ee,t as te}from"./text-input-D8OFtXHj.js";import{n as ne}from"./TextInput.enums-z6wZ2LJ6.js";import{n as l,t as re}from"./slider-avEbx71c.js";import{n as ie,t as ae}from"./tab-item-Cu1aopHu.js";var u,d,f,oe;function p(){return(p=e((()=>{n(),u=n(),d=r(),f=({title:e,titleId:t,...n},r)=>(0,d.jsxs)(`svg`,{width:17,height:16,viewBox:`0 0 17 16`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,ref:r,"aria-labelledby":t,...n,children:[e?(0,d.jsx)(`title`,{id:t,children:e}):null,(0,d.jsx)(`path`,{fillRule:`evenodd`,clipRule:`evenodd`,d:`M9.5 0H7.5V7H0.5V9H7.5V16H9.5V9H16.5V7H9.5V0Z`,fill:`white`})]}),oe=(0,u.forwardRef)(f)})))()}var se,m,h,ce;function g(){return(g=e((()=>{n(),se=n(),m=r(),h=({title:e,titleId:t,...n},r)=>(0,m.jsxs)(`svg`,{width:17,height:2,viewBox:`0 0 17 2`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,ref:r,"aria-labelledby":t,...n,children:[e?(0,m.jsx)(`title`,{id:t,children:e}):null,(0,m.jsx)(`path`,{d:`M16.5 6.99382e-07L16.5 2L0.5 2L0.5 0L16.5 6.99382e-07Z`,fill:`#333333`})]}),ce=(0,se.forwardRef)(h)})))()}var _,v,y,b,x,S,C,w,T,E,D,le,O,k,A,j,M,ue,de,fe,N;function P(){return(P=e((()=>{_=`_container_ru1vc_1`,v=`_sliderWrapper_ru1vc_5`,y=`_slider_ru1vc_5`,b=`_sliderTrack_ru1vc_14`,x=`_sliderTrackValueMin_ru1vc_20`,S=`_sliderTrackValueMax_ru1vc_21`,C=`_countControls_ru1vc_32`,w=`_controlButton_ru1vc_38`,T=`_disabled_ru1vc_41`,E=`_circle_ru1vc_47`,D=`_minusIcon_ru1vc_75`,le=`_plusIcon_ru1vc_79`,O=`_countInput_ru1vc_83`,k=`_isLarge_ru1vc_95`,A=`_isConstant_ru1vc_98`,j=`_countTitle_ru1vc_101`,M=`_subTitle_ru1vc_108`,ue=`_tabsWrapper_ru1vc_117`,de=`_underContorlsText_ru1vc_125`,fe=`_warningIncrementFromZero_ru1vc_132`,N={container:_,sliderWrapper:v,slider:y,sliderTrack:b,sliderTrackValueMin:x,sliderTrackValueMax:S,countControls:C,controlButton:w,disabled:T,circle:E,minusIcon:D,plusIcon:le,countInput:O,isLarge:k,isConstant:A,countTitle:j,subTitle:M,tabsWrapper:ue,underContorlsText:de,warningIncrementFromZero:fe}})))()}var pe,F,I,L,R;function z(){return(z=e((()=>{pe=t(n()),F=t(i()),p(),g(),s(),l(),ee(),ie(),P(),I=r(),L=(e,t,n)=>t&&t&&e<n?e!==0:!1,R=({value:e,minValue:t,maxValue:n,step:r,title:i,subtitle:a,showPlusSign:o,isDisabled:s,showSlider:ee,onChange:l,className:ie,items:u,isLarge:d,withoutControls:f,disableValue:p,underControlsTitle:se,enableZero:m,isZeroAllowed:h,minusTooltipId:g,minusDisabled:_,decreaseLabel:v,increaseLabel:y})=>{let b=m??h??!1,x=o&&e>n?`${n}+`:`${e}`,S=o?n+1:n,C=e=>Math.min(e,S),[w,T]=(0,pe.useState)(!1),[E,D]=(0,pe.useState)(null),le=(0,F.default)(N.container,ie),O=(0,F.default)(N.countTitle,{[N.disabled]:s}),k=(0,F.default)(N.underContorlsText,{[N.warningIncrementFromZero]:b?w:!1}),A=(0,F.default)(N.countInput,{[N.disabled]:s,[N.isLarge]:d,[N.isConstant]:s&&p}),j=(0,F.default)(N.circle,{[N.disabled]:s}),M=(0,F.default)(N.controlButton,{[N.disabled]:s}),ue=e=>{let t=parseFloat(e.target.value);D(null),l(t)},de=i=>{let a=i.currentTarget.dataset.operation,o=+e;D(null),a===`plus`&&(o<t?(o=t,T(!1)):o<S&&(o=C(o+r))),a===`minus`&&(e>n?o=n:o-r>=t?o-=r:(o=b?0:t,T(!1))),o!==+e&&l(o)},fe=r=>{let i=r.target.value.replace(/\D/g,``),a=+i;if(i!==``&&a>n){D(null),S!==e&&l(S),T(!1);return}D(i),i!==``&&(!b&&a<t||(a!==e&&l(a),T(L(a,b,t))))},P=()=>{if(E===null)return;let n=E===``?0:+E,r=b||n>=t?n:t;D(null),r!==e&&l(r),T(L(r,b,t))},R=e=>{e.key===`Enter`&&P()},z=s?{}:{onClick:de,onMouseDown:e=>{e.preventDefault()}},B=s||_?{}:z,V=!s&&_,H=(0,F.default)(j,N.minusIcon,{[N.disabled]:_}),U=s?{}:{onChange:ue},me=s?{}:{onChange:fe,onBlur:P,onKeyDown:R},W=()=>!u||!u.length?[]:u.map(e=>typeof e==`number`?{name:`+${e}`,id:e.toString(),value:e,content:null,isDisabled:s}:{name:`+${e.name}`,id:e.value.toString(),value:e.value,content:null,isDisabled:s}),G=t=>{let n=Number(t.currentTarget.dataset.value);n!==void 0&&(D(null),l(C(e+n)),T(!1))},K=W();return(0,I.jsxs)(`div`,{className:le,children:[i?(0,I.jsx)(c,{fontWeight:600,fontSize:`16px`,className:O,children:i}):null,a?(0,I.jsx)(c,{fontWeight:600,fontSize:`11px`,className:(0,F.default)(N.subTitle,{[N.disabled]:s}),children:a}):null,(0,I.jsxs)(`div`,{className:N.countControls,children:[f?null:(0,I.jsx)(`button`,{type:`button`,className:H,...B,...g?{"data-tooltip-id":g}:{},...v?{"aria-label":v}:{},...V?{"aria-disabled":!0}:{},disabled:s,"data-operation":`minus`,"data-testid":`quantity_picker_minus_icon`,children:(0,I.jsx)(ce,{className:M,"aria-hidden":`true`})}),s?(0,I.jsx)(c,{className:A,children:p??x}):(0,I.jsx)(te,{type:ne.text,isReadOnly:s,withBorder:!1,className:A,value:E??x,style:{boxShadow:`none`},...me,tabIndex:0,testId:`quantity_picker_input`}),f?null:(0,I.jsx)(`button`,{type:`button`,className:`${j} ${N.plusIcon}`,...z,...y?{"aria-label":y}:{},disabled:s,"data-operation":`plus`,"data-testid":`quantity_picker_plus_icon`,children:(0,I.jsx)(oe,{className:M,"aria-hidden":`true`})})]}),(0,I.jsx)(c,{className:k,children:se}),ee?(0,I.jsxs)(`div`,{className:N.sliderWrapper,children:[(0,I.jsx)(re,{thumbBorderWidth:`8px`,thumbHeight:`32px`,thumbWidth:`32px`,runnableTrackHeight:`12px`,isDisabled:s,min:t,max:S,step:r,withPouring:!0,value:e,...U,className:N.slider,dataTestId:`quantity_picker_slider`}),(0,I.jsxs)(`div`,{className:N.sliderTrack,children:[(0,I.jsx)(c,{className:N.sliderTrackValueMin,children:t}),(0,I.jsx)(c,{className:N.sliderTrackValueMax,children:`${n}${o?`+`:``}`})]})]}):null,u&&u.length>0?(0,I.jsx)(`div`,{className:N.tabsWrapper,children:K.map(e=>(0,I.jsx)(ae,{"data-value":e.value,label:e.name,onSelect:G,isDisabled:s,allowNoSelection:!0,dataTestId:`add_${e.id}_tab_item`},e.id))}):null]})};try{R.displayName=`quantitypicker`,R.__docgenInfo={description:``,displayName:`quantitypicker`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,methods:[],props:{value:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Current value; the component is controlled`,name:`value`,required:!0,tags:{},type:{name:`number`}},minValue:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Lower bound for the controls, typed input and slider`,name:`minValue`,required:!0,tags:{},type:{name:`number`}},maxValue:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Upper bound; nothing the component does goes past it, except the one overflow step `showPlusSign` allows",name:`maxValue`,required:!0,tags:{},type:{name:`number`}},step:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Amount the plus and minus controls and the slider move by; the last step up is shortened so it stops at the bound`,name:`step`,required:!0,tags:{},type:{name:`number`}},title:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Heading above the controls; omitted when empty`,name:`title`,required:!1,tags:{},type:{name:`string | null | undefined`}},subtitle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Secondary line under the title; omitted when empty`,name:`subtitle`,required:!1,tags:{},type:{name:`string | undefined`}},showPlusSign:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Lets the value go exactly one past `maxValue` (to `maxValue + 1`), shown as `maxValue+`",name:`showPlusSign`,required:!1,tags:{},type:{name:`boolean | undefined`}},isDisabled:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Disables every control and replaces the input with static text`,name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},showSlider:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Renders a slider bound to the value, from `minValue` to `maxValue` (`maxValue + 1` with `showPlusSign`)",name:`showSlider`,required:!1,tags:{},type:{name:`boolean | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Called with the new value`,name:`onChange`,required:!0,tags:{},type:{name:`(value: number) => void`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Class name on the root element`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},items:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Preset tabs; selecting one adds its amount to the current value, capped like the plus control`,name:`items`,required:!1,tags:{},type:{name:`(number | TabItemObject)[] | undefined`}},isLarge:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Widens the value field from 101px to 140px`,name:`isLarge`,required:!1,tags:{},type:{name:`boolean | undefined`}},withoutControls:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:`Hides the plus and minus controls`,name:`withoutControls`,required:!1,tags:{},type:{name:`boolean | undefined`}},disableValue:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Text shown in place of the value while `isDisabled` is set; the field then sizes to its content",name:`disableValue`,required:!1,tags:{},type:{name:`string | undefined`}},underControlsTitle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Text under the controls; turns to the warning colour while an invalid value is entered with `enableZero`",name:`underControlsTitle`,required:!1,tags:{},type:{name:`ReactNode`}},isZeroAllowed:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Former name of `enableZero`, kept as an alias; `enableZero` wins when both are set.",name:`isZeroAllowed`,required:!1,tags:{deprecated:"Use `enableZero`."},type:{name:`boolean | undefined`}},enableZero:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Allows zero as a value below `minValue`; other values below it are flagged",name:`enableZero`,required:!1,tags:{},type:{name:`boolean | undefined`}},minusTooltipId:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Tooltip id set as `data-tooltip-id` on the minus control",name:`minusTooltipId`,required:!1,tags:{},type:{name:`string | undefined`}},minusDisabled:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:"Disables only the minus control; it stays focusable (`aria-disabled`) so `minusTooltipId` can still explain why",name:`minusDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},decreaseLabel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:'Accessible name of the minus control, e.g. a translated "Decrease"; no `aria-label` is rendered without it',name:`decreaseLabel`,required:!1,tags:{},type:{name:`string | undefined`}},increaseLabel:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/quantity-picker/quantity-picker.tsx`,name:`TypeLiteral`}],description:'Accessible name of the plus control, e.g. a translated "Increase"; no `aria-label` is rendered without it',name:`increaseLabel`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var B;function V(){return(V=e((()=>{z(),B=R})))()}var H,U,me,W,G,K,q,J,Y,X,he,Z,Q,$,ge;function _e(){return(_e=e((()=>{H=n(),a(),V(),U=r(),me={title:`UI/Form controls/QuantityPicker`,component:B,parameters:{},argTypes:{value:{control:`number`,description:"Current value; the component is controlled, so the host updates it from `onChange`"},minValue:{control:`number`,description:`Lowest value the minus control, the typed number and the slider can reach`},maxValue:{control:`number`,description:"Highest value the controls, the typed number, the presets and the slider can reach, apart from the one overflow step `showPlusSign` allows"},step:{control:`number`,description:`Amount the minus and plus controls and the slider move by; the last step up is shortened so it stops at the maximum`},title:{control:`text`,description:`Heading above the controls; left empty, no heading is shown`},subtitle:{control:`text`,description:`Smaller line under the heading; left empty, no line is shown`},showPlusSign:{control:`boolean`,description:"Lets the value go exactly one past `maxValue`, shown as the maximum followed by a plus sign",table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables both controls, the slider and the presets, and shows the number as static text that cannot be typed into`,table:{defaultValue:{summary:`false`}}},showSlider:{control:`boolean`,description:`Shows a slider under the controls that moves the same value, with the minimum and the maximum written at its ends`,table:{defaultValue:{summary:`false`}}},onChange:{action:`onChange`,description:`Called with the new value`},className:{control:`text`,description:`Class name on the root element`},items:{control:`object`,description:"Preset tabs under the controls, each a number or a `{ name, value }` pair; a tab reads as its amount after a plus sign and adds that amount to the current value"},isLarge:{control:`boolean`,description:`Widens the number field from 101px to 140px, for longer numbers`,table:{defaultValue:{summary:`false`}}},withoutControls:{control:`boolean`,description:`Hides the minus and plus controls, leaving the number alone`,table:{defaultValue:{summary:`false`}}},disableValue:{control:`text`,description:"Text shown in place of the number while `isDisabled` is set; the field then shrinks or grows to fit it"},underControlsTitle:{control:`text`,description:`Text or any node shown under the number; the line keeps its height even when empty`},isZeroAllowed:{control:`boolean`,description:"Deprecated: former name of `enableZero`, still honoured when `enableZero` is not set",table:{defaultValue:{summary:`false`}}},enableZero:{control:`boolean`,description:"Accepts zero as a value below `minValue`: the minus control steps down to zero and a typed number under the minimum is kept",table:{defaultValue:{summary:`false`}}},minusTooltipId:{control:`text`,description:`Id of a tooltip the host renders, attached to the minus control so hovering it opens that tooltip`},minusDisabled:{control:`boolean`,description:`Disables only the minus control; it stays focusable so a tooltip attached to it can still explain why`,table:{defaultValue:{summary:`false`}}},decreaseLabel:{control:`text`,description:`Accessible name of the minus control, such as a translated "Decrease"; left out, the control has no name`},increaseLabel:{control:`text`,description:`Accessible name of the plus control, such as a translated "Increase"; left out, the control has no name`}}},W=e=>{let{value:t,onChange:n}=e,[r,i]=(0,H.useState)(t);(0,H.useEffect)(()=>i(t),[t]);let a=e=>{i(e),n?.(e)};return(0,U.jsx)(B,{...e,value:r,onChange:a})},G={render:e=>(0,U.jsx)(W,{...e}),args:{value:5,minValue:1,maxValue:100,step:1,title:`Managers`,subtitle:`Choose how many managers to add`,decreaseLabel:`Decrease`,increaseLabel:`Increase`},parameters:{docs:{description:{story:`The basic picker: press minus or plus, or type a number between the bounds. Change any other prop live in the Controls panel below.`},source:{code:`const [value, setValue] = useState(5);

<QuantityPicker
  title="Managers"
  subtitle="Choose how many managers to add"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  decreaseLabel="Decrease"
  increaseLabel="Increase"
  onChange={setValue}
/>`}}}},K={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,value:40,showSlider:!0,title:`Storage`,subtitle:`GB of additional storage`},parameters:{docs:{description:{story:"A slider under the controls, for covering a wide range quickly: dragging it and pressing the controls move the same number (`showSlider`)."},source:{code:`<QuantityPicker
  title="Storage"
  subtitle="GB of additional storage"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  onChange={setValue}
/>`}}}},q={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,value:10,items:[{name:`10`,value:10},{name:`50`,value:50},{name:`100`,value:100}],title:`Copies`,subtitle:`Pick a preset or enter a number`},parameters:{docs:{description:{story:"Quick-add tabs for the amounts people pick most: **+10**, **+50** and **+100** each add their amount to the number shown, and stop at the maximum (`items`)."},source:{code:`<QuantityPicker
  title="Copies"
  subtitle="Pick a preset or enter a number"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  items={[
    { name: "10", value: 10 },
    { name: "50", value: 50 },
    { name: "100", value: 100 },
  ]}
  onChange={setValue}
/>`}}}},J={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,isDisabled:!0,disableValue:`Unlimited`,title:`Managers`,subtitle:`This amount cannot be changed`},parameters:{docs:{description:{story:"An amount the reader may see but not change: **Unlimited** stands in place of the number as static text that cannot be typed into, and the controls cannot be pressed (`isDisabled`, `disableValue`)."},source:{code:`<QuantityPicker
  title="Managers"
  subtitle="This amount cannot be changed"
  value={5}
  minValue={1}
  maxValue={100}
  step={1}
  isDisabled
  disableValue="Unlimited"
  onChange={() => {}}
/>`}}}},Y={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,value:101,showSlider:!0,showPlusSign:!0,title:`Copies`,subtitle:`More than 100 counts as one choice`},parameters:{docs:{description:{story:"For a range whose top is open-ended: the number reads **100+**, one step past the maximum, and the slider's far end carries the same label; press minus to come back to 100 (`showPlusSign`)."},source:{code:`<QuantityPicker
  title="Copies"
  subtitle="More than 100 counts as one choice"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  showPlusSign
  onChange={setValue}
/>`}}}},X={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,value:5,minValue:5,enableZero:!0,title:`Copies`,subtitle:`At least 5, or none at all`,underControlsTitle:`Press minus to drop to zero`},parameters:{docs:{description:{story:"For an amount that is either none or at least a minimum: pressing minus at 5 drops straight to 0, and plus from 0 jumps back to 5 (`enableZero`). The line under the number is free text (`underControlsTitle`)."},source:{code:`<QuantityPicker
  title="Copies"
  subtitle="At least 5, or none at all"
  value={value}
  minValue={5}
  maxValue={100}
  step={1}
  enableZero
  underControlsTitle="Press minus to drop to zero"
  onChange={setValue}
/>`}}}},he=e=>(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(W,{...e}),(0,U.jsx)(o,{id:`quantity-picker-minus-tooltip`,place:`bottom`,children:`The amount cannot go below the current one`})]}),Z={render:e=>(0,U.jsx)(he,{...e}),args:{...G.args,title:`Copies`,subtitle:`You can add copies but not remove them`,minusDisabled:!0,minusTooltipId:`quantity-picker-minus-tooltip`},parameters:{docs:{description:{story:"When the amount may only grow: pressing minus changes nothing, but the control stays reachable with Tab, and hovering it opens a tooltip that says why (`minusDisabled`, `minusTooltipId`). The tooltip is the host's own."},source:{code:`<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  minusDisabled
  minusTooltipId="minus-tooltip"
  onChange={setValue}
/>
<Tooltip id="minus-tooltip" place="bottom">
  The amount cannot go below the current one
</Tooltip>`}}}},Q={render:e=>(0,U.jsx)(W,{...e}),args:{...G.args,value:40,withoutControls:!0,showSlider:!0,title:`Copies`,subtitle:`Drag the slider or type a number`},parameters:{docs:{description:{story:"The number alone, without the minus and plus controls, for when a slider or typing is the way to change it (`withoutControls`)."},source:{code:`<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  withoutControls
  showSlider
  onChange={setValue}
/>`}}}},$={render:e=>(0,U.jsx)(`div`,{dir:`rtl`,children:(0,U.jsx)(W,{...e})}),globals:{direction:`rtl`},args:{...G.args,value:40,showSlider:!0,title:`عدد النسخ`,subtitle:`اختر عدد النسخ`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`200px`},description:{story:'The picker in a right-to-left layout: plus moves to the left of the number and minus to the right, the slider fills from the right, and the minimum sits at its right end. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <QuantityPicker
    title="عدد النسخ"
    value={value}
    minValue={1}
    maxValue={100}
    step={1}
    showSlider
    onChange={setValue}
  />
</div>`}}}},ge=[`Default`,`WithSlider`,`WithPresets`,`Disabled`,`WithPlusSign`,`WithZeroAllowed`,`MinusLockedWithTooltip`,`WithoutControls`,`RightToLeft`],G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    value: 5,
    minValue: 1,
    maxValue: 100,
    step: 1,
    title: "Managers",
    subtitle: "Choose how many managers to add",
    decreaseLabel: "Decrease",
    increaseLabel: "Increase"
  },
  parameters: {
    docs: {
      description: {
        story: "The basic picker: press minus or plus, or type a number between the bounds. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`const [value, setValue] = useState(5);

<QuantityPicker
  title="Managers"
  subtitle="Choose how many managers to add"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  decreaseLabel="Decrease"
  increaseLabel="Increase"
  onChange={setValue}
/>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "Storage",
    subtitle: "GB of additional storage"
  },
  parameters: {
    docs: {
      description: {
        story: "A slider under the controls, for covering a wide range quickly: dragging it and pressing the controls move the same number (\`showSlider\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Storage"
  subtitle="GB of additional storage"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  onChange={setValue}
/>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 10,
    items: [{
      name: "10",
      value: 10
    }, {
      name: "50",
      value: 50
    }, {
      name: "100",
      value: 100
    }],
    title: "Copies",
    subtitle: "Pick a preset or enter a number"
  },
  parameters: {
    docs: {
      description: {
        story: "Quick-add tabs for the amounts people pick most: **+10**, **+50** and **+100** each add their amount to the number shown, and stop at the maximum (\`items\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Copies"
  subtitle="Pick a preset or enter a number"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  items={[
    { name: "10", value: 10 },
    { name: "50", value: 50 },
    { name: "100", value: 100 },
  ]}
  onChange={setValue}
/>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    isDisabled: true,
    disableValue: "Unlimited",
    title: "Managers",
    subtitle: "This amount cannot be changed"
  },
  parameters: {
    docs: {
      description: {
        story: "An amount the reader may see but not change: **Unlimited** stands in place of the number as static text that cannot be typed into, and the controls cannot be pressed (\`isDisabled\`, \`disableValue\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Managers"
  subtitle="This amount cannot be changed"
  value={5}
  minValue={1}
  maxValue={100}
  step={1}
  isDisabled
  disableValue="Unlimited"
  onChange={() => {}}
/>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 101,
    showSlider: true,
    showPlusSign: true,
    title: "Copies",
    subtitle: "More than 100 counts as one choice"
  },
  parameters: {
    docs: {
      description: {
        story: "For a range whose top is open-ended: the number reads **100+**, one step past the maximum, and the slider's far end carries the same label; press minus to come back to 100 (\`showPlusSign\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Copies"
  subtitle="More than 100 counts as one choice"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  showPlusSign
  onChange={setValue}
/>\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 5,
    minValue: 5,
    enableZero: true,
    title: "Copies",
    subtitle: "At least 5, or none at all",
    underControlsTitle: "Press minus to drop to zero"
  },
  parameters: {
    docs: {
      description: {
        story: "For an amount that is either none or at least a minimum: pressing minus at 5 drops straight to 0, and plus from 0 jumps back to 5 (\`enableZero\`). The line under the number is free text (\`underControlsTitle\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Copies"
  subtitle="At least 5, or none at all"
  value={value}
  minValue={5}
  maxValue={100}
  step={1}
  enableZero
  underControlsTitle="Press minus to drop to zero"
  onChange={setValue}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <MinusLockedTemplate {...args} />,
  args: {
    ...Default.args,
    title: "Copies",
    subtitle: "You can add copies but not remove them",
    minusDisabled: true,
    minusTooltipId: "quantity-picker-minus-tooltip"
  },
  parameters: {
    docs: {
      description: {
        story: "When the amount may only grow: pressing minus changes nothing, but the control stays reachable with Tab, and hovering it opens a tooltip that says why (\`minusDisabled\`, \`minusTooltipId\`). The tooltip is the host's own."
      },
      source: {
        code: \`<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  minusDisabled
  minusTooltipId="minus-tooltip"
  onChange={setValue}
/>
<Tooltip id="minus-tooltip" place="bottom">
  The amount cannot go below the current one
</Tooltip>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    withoutControls: true,
    showSlider: true,
    title: "Copies",
    subtitle: "Drag the slider or type a number"
  },
  parameters: {
    docs: {
      description: {
        story: "The number alone, without the minus and plus controls, for when a slider or typing is the way to change it (\`withoutControls\`)."
      },
      source: {
        code: \`<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  withoutControls
  showSlider
  onChange={setValue}
/>\`
      }
    }
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <QuantityPickerWithState {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "عدد النسخ",
    subtitle: "اختر عدد النسخ"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "200px"
      },
      description: {
        story: 'The picker in a right-to-left layout: plus moves to the left of the number and minus to the right, the slider fills from the right, and the minimum sits at its right end. The wrapper carries \`dir="rtl"\`; the direction also comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <QuantityPicker
    title="عدد النسخ"
    value={value}
    minValue={1}
    maxValue={100}
    step={1}
    showSlider
    onChange={setValue}
  />
</div>\`
      }
    }
  }
}`,...$.parameters?.docs?.source}}}})))()}_e();export{G as Default,J as Disabled,Z as MinusLockedWithTooltip,$ as RightToLeft,Y as WithPlusSign,q as WithPresets,K as WithSlider,X as WithZeroAllowed,Q as WithoutControls,ge as __namedExportsOrder,me as default};