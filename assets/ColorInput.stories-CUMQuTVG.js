import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./globalColors-fkBUxSeV.js";import{i as o,n as s,r as c,t as l}from"./drop-down-H7nHxgOI.js";import{t as u}from"./classnames-CfLRLWYq.js";import{n as d}from"./text-input-D8OFtXHj.js";import{t as f}from"./TextInput.enums-z6wZ2LJ6.js";import{i as p,n as m,r as h,t as g}from"./ColorPicker-CemxeI36.js";var _,v,y,b,x,S,C,w;function T(){return(T=e((()=>{_=`_dropDownItemHex_kqvlo_1`,v=`_wrapper_kqvlo_5`,y=`_hexValue_kqvlo_13`,b=`_inputWrapper_kqvlo_274`,x=`_scale_kqvlo_280`,S=`_colorBlock_kqvlo_284`,C=`_disabled_kqvlo_293`,w={dropDownItemHex:_,wrapper:v,hexValue:y,inputWrapper:b,scale:x,colorBlock:S,disabled:C}})))()}var E,D,O,k;function A(){return(A=e((()=>{E=n(),p(),D=t(u()),o(),s(),m(),i(),T(),O=r(),k=({className:e,id:t,handleChange:n,defaultColor:r,size:i,scale:o,isDisabled:s,hasError:u,hasWarning:d,dataTestId:f})=>{let[p,m]=(0,E.useState)(r||a.lightBlueMain),[_,v]=(0,E.useState)(!1),y=()=>v(!1),b=()=>v(e=>!e),x=e=>{n?.(e),m(e)},S={"--block-color":p};return(0,O.jsxs)(`div`,{"data-testid":f??`color-input`,className:(0,D.default)(w.wrapper,e),id:t,children:[(0,O.jsxs)(`div`,{className:(0,D.default)(w.inputWrapper,{[w.scale]:o}),children:[(0,O.jsx)(h,{className:w.hexValue,prefixed:!0,color:p.toUpperCase(),onChange:x,"data-size":i,"data-error":u?`true`:void 0,"data-warning":d?`true`:void 0,"data-scale":o?`true`:void 0,"data-disabled":s?`true`:void 0,disabled:s}),(0,O.jsx)(`span`,{className:(0,D.default)(w.colorBlock,{[w.disabled]:s}),style:S,onClick:b})]}),(0,O.jsx)(l,{manualY:`48px`,withBackdrop:!0,isDefaultMode:!1,open:_,clickOutsideAction:y,children:(0,O.jsx)(c,{className:(0,D.default)(w.dropDownItemHex,`drop-down-item-hex`),children:(0,O.jsx)(g,{appliedColor:p,handleChange:x,isPickerOnly:!0,onClose:y})})})]})};try{k.displayName=`ColorInput`,k.__docgenInfo={description:``,displayName:`ColorInput`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/color-input/ColorInput.tsx`,methods:[],props:{className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element.`,name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},defaultColor:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Colour the field starts on, as a hex string. It is read once, on mount —
the component owns the value from then on, so this is a starting point and
not a controlled value. The kit's blue is used when it is left out.`,name:`defaultColor`,required:!1,tags:{},type:{name:`string | undefined`}},handleChange:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Called with the new hex colour each time the field holds a complete 3- or
6-digit code, and on every move inside the picker. There is no confirm step
and no \`onApply\`.`,name:`handleChange`,required:!1,tags:{},type:{name:`((color: string) => void) | undefined`}},size:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Width, font size and padding of the field; the height does not change.`,name:`size`,required:!1,tags:{},type:{name:`InputSize | undefined`}},scale:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Whether the field stretches to fill its container.`,name:`scale`,required:!1,tags:{},type:{name:`boolean | undefined`}},isDisabled:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Whether the field is disabled. The swatch stops opening the picker too.`,name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},hasError:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Whether the field is drawn in its error colours.`,name:`hasError`,required:!1,tags:{},type:{name:`boolean | undefined`}},hasWarning:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:`Whether the field is drawn in its warning colours.`,name:`hasWarning`,required:!1,tags:{},type:{name:`boolean | undefined`}},dataTestId:{defaultValue:{value:`"color-input"`},declarations:[{fileName:`docspace-ui-kit-react/components/color-input/ColorInput.types.ts`,name:`TypeLiteral`}],description:"`data-testid` of the outermost element.",name:`dataTestId`,required:!1,tags:{default:`"color-input"`},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{d(),i(),A(),j=r(),M={title:`UI/Form controls/ColorInput`,component:k,parameters:{},argTypes:{defaultColor:{control:`color`,description:`Hex color the field starts on; read once on mount, after which the field keeps its own value`,table:{defaultValue:{summary:`#4781D1`}}},size:{control:`select`,options:Object.values(f),description:`Width, font size and padding of the field; the height is the same at every size`,table:{defaultValue:{summary:`undefined`}}},scale:{control:`boolean`,description:`Scale input to 100% width`,table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disable the input field; the swatch stops opening the picker too`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Draws the field's border in the error color`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Draws the field's border in the warning color`,table:{defaultValue:{summary:`false`}}},handleChange:{action:`handleChange`,description:`Called with the new hex color each time the field holds a complete 3- or 6-digit code and on every move in the picker`},className:{control:`text`,description:`Class applied to the outermost element`},id:{control:`text`,description:`HTML id of the outermost element`},dataTestId:{control:`text`,description:"Value of the outermost element's `data-testid` attribute",table:{defaultValue:{summary:`color-input`}}}}},N=e=>(0,j.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(220px, 1fr))`,gridGap:`16px`,alignItems:`start`,minHeight:`420px`},children:e.children}),P={render:e=>(0,j.jsx)(`div`,{style:{height:`410px`},children:(0,j.jsx)(k,{...e})}),args:{defaultColor:a.lightBlueMain,size:f.base,scale:!1,isDisabled:!1,hasError:!1,hasWarning:!1},parameters:{docs:{description:{story:`The field on its own, starting on the kit's blue. Type a hex code or click the swatch to pick one, and change any other prop live in the Controls panel below.`},source:{code:`<ColorInput
  defaultColor="#4781D1"
  size={InputSize.base}
  handleChange={(color) => console.log(color)}
/>`}}}},F=()=>(0,j.jsx)(N,{children:Object.values(f).map(e=>(0,j.jsx)(k,{defaultColor:a.lightBlueMain,size:e,handleChange:t=>console.log(`${e} color changed:`,t)},e))}),I={render:()=>(0,j.jsx)(F,{}),parameters:{docs:{description:{story:"Pick the size that matches the other fields in the same form: **base**, **middle** and **large** differ in width, and **large** also in text size and padding, while all three keep the same height (`size`)."},source:{code:`<ColorInput size={InputSize.base} defaultColor="#4781D1" />
<ColorInput size={InputSize.middle} defaultColor="#4781D1" />
<ColorInput size={InputSize.large} defaultColor="#4781D1" />`}}}},L=()=>(0,j.jsxs)(N,{children:[(0,j.jsx)(k,{defaultColor:a.lightBlueMain,handleChange:()=>{}}),(0,j.jsx)(k,{defaultColor:a.lightBlueMain,hasError:!0,handleChange:()=>{}}),(0,j.jsx)(k,{defaultColor:a.lightBlueMain,hasWarning:!0,handleChange:()=>{}}),(0,j.jsx)(k,{defaultColor:a.lightBlueMain,isDisabled:!0,handleChange:()=>{}})]}),R={render:()=>(0,j.jsx)(L,{}),parameters:{docs:{description:{story:"Show whether the entered color is accepted: the first field is in its normal state, the second has a red border (`hasError`), the third an orange one (`hasWarning`), and the fourth is greyed out and its swatch no longer opens the picker (`isDisabled`)."},source:{code:`<ColorInput defaultColor="#4781D1" />
<ColorInput defaultColor="#4781D1" hasError />
<ColorInput defaultColor="#4781D1" hasWarning />
<ColorInput defaultColor="#4781D1" isDisabled />`}}}},z=()=>(0,j.jsx)(`div`,{style:{height:`410px`},children:(0,j.jsx)(k,{defaultColor:a.lightBlueMain,scale:!0,handleChange:e=>console.log(`Color changed:`,e)})}),B={render:()=>(0,j.jsx)(z,{}),parameters:{docs:{description:{story:"Use it where the field shares a column with full-width inputs: the field stretches across its container and the swatch stays at its end (`scale`)."},source:{code:`<ColorInput defaultColor="#4781D1" scale />`}}}},V=()=>(0,j.jsx)(`div`,{style:{"--color-input-height":`36px`,"--color-input-padding":`6px 12px`,"--color-input-swatch-size":`24px`,"--color-input-swatch-radius":`6px`,"--text-input-color":`#004f82`,"--text-input-border-color":`#0082c9`,"--text-input-border-hover":`#005a8c`,"--text-input-border-focus":`#00324d`,"--text-input-radius":`8px`,"--dropdown-border-style":`1px solid #0082c9`,"--dropdown-shadow":`0 4px 16px rgba(0, 130, 201, 0.25)`,"--dropdown-radius":`12px`,height:`410px`},children:(0,j.jsx)(k,{defaultColor:`#0082c9`,handleChange:()=>{}})}),H={render:()=>(0,j.jsx)(V,{}),parameters:{docs:{description:{story:"Every overridable variable but `--dropdown-bg` set on one field -- the variables are listed under CSS variables on this page. Hover and focus it to see the border colors, and click its swatch to open the popup."},source:{code:`<div
  style={{
    "--color-input-height": "36px",
    "--color-input-padding": "6px 12px",
    "--color-input-swatch-size": "24px",
    "--color-input-swatch-radius": "6px",
    "--text-input-color": "#004f82",
    "--text-input-border-color": "#0082c9",
    "--text-input-border-hover": "#005a8c",
    "--text-input-border-focus": "#00324d",
    "--text-input-radius": "8px",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <ColorInput defaultColor="#0082c9" />
</div>`}}}},U=[`Default`,`Sizes`,`States`,`ScaledInput`,`CssCustomization`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    height: "410px"
  }}>
      <ColorInput {...args} />
    </div>,
  args: {
    defaultColor: globalColors.lightBlueMain,
    size: InputSize.base,
    scale: false,
    isDisabled: false,
    hasError: false,
    hasWarning: false
  },
  parameters: {
    docs: {
      description: {
        story: "The field on its own, starting on the kit's blue. Type a hex code or click the swatch to pick one, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ColorInput
  defaultColor="#4781D1"
  size={InputSize.base}
  handleChange={(color) => console.log(color)}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the size that matches the other fields in the same form: **base**, **middle** and **large** differ in width, and **large** also in text size and padding, while all three keep the same height (\`size\`)."
      },
      source: {
        code: \`<ColorInput size={InputSize.base} defaultColor="#4781D1" />
<ColorInput size={InputSize.middle} defaultColor="#4781D1" />
<ColorInput size={InputSize.large} defaultColor="#4781D1" />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Show whether the entered color is accepted: the first field is in its normal state, the second has a red border (\`hasError\`), the third an orange one (\`hasWarning\`), and the fourth is greyed out and its swatch no longer opens the picker (\`isDisabled\`)."
      },
      source: {
        code: \`<ColorInput defaultColor="#4781D1" />
<ColorInput defaultColor="#4781D1" hasError />
<ColorInput defaultColor="#4781D1" hasWarning />
<ColorInput defaultColor="#4781D1" isDisabled />\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it where the field shares a column with full-width inputs: the field stretches across its container and the swatch stays at its end (\`scale\`)."
      },
      source: {
        code: \`<ColorInput defaultColor="#4781D1" scale />\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable but \\\`--dropdown-bg\\\` set on one field -- the variables are listed under CSS variables on this page. Hover and focus it to see the border colors, and click its swatch to open the popup.\`
      },
      source: {
        code: \`<div
  style={{
    "--color-input-height": "36px",
    "--color-input-padding": "6px 12px",
    "--color-input-swatch-size": "24px",
    "--color-input-swatch-radius": "6px",
    "--text-input-color": "#004f82",
    "--text-input-border-color": "#0082c9",
    "--text-input-border-hover": "#005a8c",
    "--text-input-border-focus": "#00324d",
    "--text-input-radius": "8px",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <ColorInput defaultColor="#0082c9" />
</div>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}}})))()}W();export{H as CssCustomization,P as Default,B as ScaledInput,I as Sizes,R as States,U as __namedExportsOrder,M as default};