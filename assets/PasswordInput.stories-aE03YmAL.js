import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,r as a}from"./InterfaceDirectionContext-Bc3bP5Oy.js";import{n as o,t as s}from"./globalColors-fkBUxSeV.js";import{t as c}from"./classnames-CfLRLWYq.js";import{n as l,t as u}from"./tooltip-DcisrCmM.js";import{r as d,t as f}from"./text-Cz_cI6Yf.js";import{i as ee,n as te,t as ne}from"./link-C_nB54e7.js";import{i as p,n as m,r as re,t as ie}from"./eye.off.react-hmv8rG7r.js";import{n as h}from"./text-input-D8OFtXHj.js";import{n as g,t as _}from"./TextInput.enums-z6wZ2LJ6.js";import{n as ae,t as oe}from"./input-block-DrQ2rbwD.js";var v,se;function y(){return(y=e((()=>{v=n(),se=(e,t,n,r)=>{let[i,a]=(0,v.useState)({type:e,value:t,copyLabel:n,disableCopyAction:!r,displayTooltip:!1,validLength:!1,validDigits:!1,validCapital:!1,validSpecial:!1});return{state:i,setState:a}}})))()}var b,ce;function x(){return(x=e((()=>{b=n(),ce=(e,t)=>{let n=(0,b.useCallback)(t=>{if(!e)return{};let n=new RegExp(e.upperCaseRegexStr||``),r=new RegExp(e.digitsRegexStr||``),i=new RegExp(e.specSymbolsRegexStr||``),a=!0,o=!0,s=!0,c=!0,l=!0;return e.upperCase&&(a=n.test(t)),e.digits&&(o=r.test(t)),e.specSymbols&&(s=i.test(t)),e.allowedCharactersRegexStr&&(c=RegExp(`^${e.allowedCharactersRegexStr}{1,}$`).test(t)),e?.minLength!==void 0&&(l=t.trim().length>=e.minLength),{allowed:c,digits:o,capital:a,special:s,length:l}},[e]);return{testStrength:n,checkPassword:(0,b.useCallback)((e,r)=>{let i=n(e),a=Object.values(i).every(Boolean);t?.(a,i),r(t=>({...t,value:e,validLength:i.length||!1,validDigits:i.digits||!1,validCapital:i.capital||!1,validSpecial:i.special||!1}))},[t,n])}}})))()}var S,C,le;function w(){return(w=e((()=>{S=n(),h(),C={LOWERCASE:`abcdefghijklmnopqrstuvwxyz`,NUMBERS:`0123456789`},le=(e,t,n,r,i,a,o)=>{let s=(0,S.useCallback)(e=>{let t=Math.floor(Math.random()*e.length);return e.charAt(t)},[]),c=(0,S.useCallback)(()=>{let n=t?.minLength||8,r=[];for(t?.upperCase&&r.push(s(C.LOWERCASE).toUpperCase()),t?.digits&&r.push(s(C.NUMBERS)),t?.specSymbols&&e&&r.push(s(e));r.length<n;){let n=[C.LOWERCASE];t?.upperCase&&n.push(C.LOWERCASE.toUpperCase()),t?.digits&&n.push(C.NUMBERS),t?.specSymbols&&e&&n.push(e);let i=n[Math.floor(Math.random()*n.length)];r.push(s(i))}return r.sort(()=>Math.random()-.5).join(``).slice(0,n)},[s,e,t?.digits,t?.minLength,t?.specSymbols,t?.upperCase]);return{onGeneratePassword:(0,S.useCallback)(e=>{if(n){e.preventDefault();return}let t=c();r!==g.text&&o(e=>({...e,type:g.text})),a(t,o),i({target:{value:t}},!0)},[a,c,n,i,o,r])}}})))()}var T,ue;function de(){return(de=e((()=>{T=n(),h(),ue=(e,t,n,r,i,a,o,s,c)=>{let[l,u]=(0,T.useState)(null),d=(0,T.useCallback)(e=>{let n;if(!s)return e;let r=s??``,i=r.length,a=document.getElementById(`conversion-password`)?.selectionStart;u(a);let o=e.substring(0,a??void 0),c=o.split(``).filter(e=>e===t).length,l=a?e.substring(a).length:0,d=o.substring(c),f=r.substring(0,c),ee=i-l,te=r.substring(ee);return n=f+d,l&&(n+=te),n},[t,s]),f=(0,T.useCallback)((t,r)=>{let{value:s}=t.target;if(e&&!r&&(s=d(t.target.value)),c&&(s=c(s)),o?.(t,s),n){a(e=>({...e,value:s}));return}i(s,a)},[e,o,n,i,a,d,c]);return(0,T.useEffect)(()=>{l&&e&&r===g.password&&document.getElementById(`conversion-password`)?.setSelectionRange(l,l)},[l,e,r]),{caretPosition:l,setCaretPosition:u,setPasswordSettings:d,onChangeAction:f}}})))()}var E,D,fe,pe,O,k,me,A;function he(){return(he=e((()=>{E=`_styledInput_nw11l_1`,D=`_rtlStyledInput_nw11l_6`,fe=`_tooltipContainer_nw11l_14`,pe=`_tooltip_nw11l_14`,O=`_fullWidth_nw11l_51`,k=`_passwordProgress_nw11l_119`,me=`_withInputWidth_nw11l_119`,A={styledInput:E,rtlStyledInput:D,tooltipContainer:fe,tooltip:pe,fullWidth:O,"input-relative":`_input-relative_nw11l_91`,passwordProgress:k,withInputWidth:me}})))()}var j,ge,M,_e,N;function P(){return(P=e((()=>{j=t(n()),ge=t(c()),p(),m(),ae(),te(),d(),l(),h(),o(),w(),de(),y(),x(),he(),i(),M=r(),_e={minLength:8,upperCase:!1,digits:!1,specSymbols:!1,digitsRegexStr:`(?=.*\\d)`,upperCaseRegexStr:`(?=.*[A-Z])`,specSymbolsRegexStr:`(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])`},N=({ref:e,inputType:t=g.password,inputValue:n,clipActionResource:r,emailInputName:i,passwordSettings:o=_e,onBlur:c,onKeyDown:l,onValidateInput:d,onChange:te,isDisabled:p=!1,simpleView:m=!1,generatorSpecial:h=`!@#$%^&*`,clipCopiedResource:ae=`Copied`,tooltipPasswordTitle:v,tooltipPasswordLength:y,tooltipPasswordDigits:b,tooltipPasswordCapital:x,tooltipPasswordSpecial:S,generatePasswordTitle:C,inputName:w=`passwordInput`,scale:T=!0,size:de,hasError:E,hasWarning:D,placeholder:fe,tabIndex:pe,maxLength:O,id:k,autoComplete:me=`new-password`,forwardedRef:he,isDisableTooltip:N=!1,inputWidth:P,className:F=``,style:I,isFullWidth:L=!1,isAutoFocussed:R,tooltipAllowedCharacters:z,isSimulateType:B=!1,testId:V,simulateSymbol:H=`•`,sanitizeValue:ve})=>{let U=(0,j.useRef)(null),W=(e=>{let t=(0,j.useRef)(void 0);return(0,j.useEffect)(()=>{t.current=e}),t.current})(n??``)??``,{state:G,setState:K}=se(t,n,r,i),{checkPassword:q}=ce(o,d),{onChangeAction:J}=ue(B,H,m,G.type,q,K,te,G.value,ve),{onGeneratePassword:Y}=le(h,o,p,G.type,J,q,K),{isRTL:ye}=a(),X=j.useCallback(()=>{let e=G.type===g.text?g.password:g.text;K(t=>({...t,type:e}))},[K,G.type]);j.useEffect(()=>{p&&G.type===g.text&&X()},[p,X,G.type]);let be=(0,j.useRef)(null),Z=(0,j.useRef)(null),Q=(0,j.useCallback)(e=>{e.persist(),c&&c(e)},[c]),$=j.useCallback(e=>{if(U.current&&Z.current){let t=e.target,n=U.current,r=Z.current;if(!n||!n.isOpen||n.activeAnchor?.contains(t)||r?.parentElement?.contains(t))return;n.close()}},[U]);j.useEffect(()=>(document.addEventListener(`mousedown`,$),()=>{document.removeEventListener(`mousedown`,$)}),[$]);let xe=(0,j.useCallback)(e=>{e.persist(),l&&l(e)},[l]);(0,j.useEffect)(()=>{K(e=>({...e,copyLabel:r}))},[r,ae,K]),(0,j.useEffect)(()=>{(B&&n!==W||n===``&&W!==``)&&J?.({target:{value:n}})},[n,W,B,J]),(0,j.useEffect)(()=>{let e=G.value?.length??0,t=o?.minLength;if(!U.current)return;let n=U.current;(t&&e<t||E||D)&&n?.open?.()},[G.value,E,D,U]),j.useEffect(()=>{let e=G.value?.length??0,t=o?.minLength??0;if(U.current){let n=U.current,r=e>=t;n?.isOpen&&r&&E!==void 0&&!E&&!D&&n.close()}},[G.value,E,D,o?.minLength,U]),j.useImperativeHandle(e,()=>({onGeneratePassword:Y,setState:K,value:G.value}),[Y,K,G.value]);let Se=(e,t,n,r,i)=>(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(`div`,{className:`break`}),(0,M.jsxs)(f,{className:`text-tooltip`,fontSize:`10px`,color:s.gray,as:`span`,children:[e?.minLength?t:null,` `,e?.digits?`, ${n}`:null,` `,e?.upperCase?`, ${r}`:null,` `,e?.specSymbols?`, ${i}`:null]}),(0,M.jsx)(`div`,{className:`break`})]}),Ce=()=>(0,M.jsx)(`div`,{className:A.tooltip,ref:Z,children:(0,M.jsxs)(f,{as:`div`,fontSize:`12px`,className:A.tooltipContainer,title:v,children:[v,(0,M.jsx)(f,{as:`div`,title:y,color:G.validLength?s.lightStatusPositive:s.lightErrorStatus,children:y}),o?.digits?(0,M.jsx)(f,{as:`div`,title:b,color:G.validDigits?s.lightStatusPositive:s.lightErrorStatus,children:b}):null,o?.upperCase?(0,M.jsx)(f,{as:`div`,title:x,color:G.validCapital?s.lightStatusPositive:s.lightErrorStatus,children:x}):null,o?.specSymbols?(0,M.jsx)(f,{as:`div`,title:S,color:G.validSpecial?s.lightStatusPositive:s.lightErrorStatus,children:S}):null,z,C?(0,M.jsx)(`div`,{className:`generate-btn-container`,children:(0,M.jsx)(ne,{className:`generate-btn`,type:ee.action,fontWeight:`600`,isHovered:!0,onClick:Y,dataTestId:`generate_password_link`,children:C})}):null]})}),we=()=>{let e=de??_.middle,{type:t,value:n}=G,r=t===`password`?(0,M.jsx)(ie,{"data-testid":`password_input_eye_off_icon`}):(0,M.jsx)(re,{"data-testid":`password_input_eye_icon`}),i=`password_eye--${t===`password`?`close`:`open`}`,a=(n??``).replace(/(.)/g,H);return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(oe,{id:k,className:`input-relative`,name:w,hasError:E,isDisabled:p,iconNode:r,iconButtonClassName:i,value:B&&t===`password`?a:n??``,onIconClick:X,onChange:J,scale:T,size:e,type:B?g.text:t,iconSize:16,isIconFill:!0,onBlur:Q,onKeyDown:xe,hasWarning:D,placeholder:fe,tabIndex:pe,maxLength:O,autoComplete:me,forwardedRef:he,isAutoFocussed:R}),!N&&!p?(0,M.jsx)(u,{place:`top`,clickable:!0,openOnClick:!0,anchorSelect:`div[id='tooltipContent-${k||w}'] input`,ref:U,imperativeModeOnly:!0,children:Ce()}):null]})};return(0,M.jsx)(`div`,{className:(0,ge.default)(A.styledInput,{[A.rtlStyledInput]:ye,[A.fullWidth]:L,[A.disabled]:p},F),style:I,"data-testid":V??`password-input`,"data-scale":T,"data-warning":D,"data-error":E,"data-disabled":p,children:m?(0,M.jsxs)(M.Fragment,{children:[we(),Se()]}):(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(`div`,{className:`password-field-wrapper`,children:(0,M.jsx)(`div`,{id:`tooltipContent-${k||w}`,"data-testid":`tooltipContent`,ref:be,className:(0,ge.default)(A.passwordProgress,{[A.withInputWidth]:P}),style:P?{width:P}:{},children:we()})}),Se()]})})},N.displayName=`PasswordInput`;try{N.displayName=`PasswordInput`,N.__docgenInfo={description:``,displayName:`PasswordInput`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/password-input/index.tsx`,methods:[],props:{size:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Supported size of the input fields`,name:`size`,required:!1,tags:{},type:{name:`InputSize | undefined`}},scale:{defaultValue:{value:`true`},declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates the input field has scale`,name:`scale`,required:!1,tags:{},type:{name:`boolean | undefined`}},tabIndex:{defaultValue:{value:`-1`},declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"Used as HTML `tabindex` property of the `<input>`. Unlike `TextInput`'s, this one defaults to\n`-1`, so the field is out of the tab order until you pass `0` — and so is every component\nbuilt on it that passes its own `tabIndex` through, `SearchInput` and `PasswordInput` among\nthem.",name:`tabIndex`,required:!1,tags:{default:`-1`},type:{name:`number | undefined`}},className:{defaultValue:{value:``},declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Applied to the group.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"Applied to the `<input>`, not to the group around it.",name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Applied to the group.`,name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},isDisabled:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates that the field cannot be used`,name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},onClick:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Called when clicked`,name:`onClick`,required:!1,tags:{},type:{name:`((e: MouseEvent<HTMLInputElement, MouseEvent>) => void) | undefined`}},testId:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"`data-testid` of the inner `<input>`, passed through to `TextInput`.",name:`testId`,required:!1,tags:{},type:{name:`string | undefined`}},mask:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Input text mask`,name:`mask`,required:!1,tags:{},type:{name:`Mask | ((value: string) => Mask) | undefined`}},dir:{defaultValue:{value:`"auto"`},declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Text direction.`,name:`dir`,required:!1,tags:{default:`"auto"`},type:{name:`string | undefined`}},onFocus:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Called when field is focused`,name:`onFocus`,required:!1,tags:{},type:{name:`((e: FocusEvent<HTMLInputElement, Element>) => void) | undefined`}},onBlur:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Called when field is blurred`,name:`onBlur`,required:!1,tags:{},type:{name:`((e: FocusEvent<HTMLInputElement, Element>) => void) | undefined`}},onKeyDown:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Called when a key is pressed`,name:`onKeyDown`,required:!1,tags:{},type:{name:`((e: KeyboardEvent<HTMLInputElement>) => void) | undefined`}},onContextMenu:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Called when context menu is triggered`,name:`onContextMenu`,required:!1,tags:{},type:{name:`((e: MouseEvent<HTMLInputElement, MouseEvent>) => void) | undefined`}},dataTestId:{defaultValue:{value:`"input-block"`},declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"`data-testid` of the group.",name:`dataTestId`,required:!1,tags:{default:`"input-block"`},type:{name:`string | undefined`}},hasError:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates the input field has an error`,name:`hasError`,required:!1,tags:{},type:{name:`boolean | undefined`}},forwardedRef:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"Ref to the `<input>` element itself.",name:`forwardedRef`,required:!1,tags:{},type:{name:`Ref<HTMLInputElement> | undefined`}},keepCharPositions:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Allows to add or delete characters without changing the positions of the existing characters`,name:`keepCharPositions`,required:!1,tags:{},type:{name:`boolean | undefined`}},guide:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`When guide is true, Text Mask always shows both placeholder characters and non-placeholder mask characters`,name:`guide`,required:!1,tags:{},type:{name:`boolean | undefined`}},isAutoFocussed:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Focus the input field on initial render`,name:`isAutoFocussed`,required:!1,tags:{},type:{name:`boolean | undefined`}},isReadOnly:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates that the field is displaying read-only content`,name:`isReadOnly`,required:!1,tags:{},type:{name:`boolean | undefined`}},hasWarning:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates the input field has a warning`,name:`hasWarning`,required:!1,tags:{},type:{name:`boolean | undefined`}},fontWeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Sets the font weight`,name:`fontWeight`,required:!1,tags:{},type:{name:`string | number | undefined`}},isBold:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Sets font weight value to 600`,name:`isBold`,required:!1,tags:{},type:{name:`boolean | undefined`}},withBorder:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/text-input/TextInput.types.ts`,name:`TypeLiteral`}],description:`Indicates that component contains border`,name:`withBorder`,required:!1,tags:{},type:{name:`boolean | undefined`}},hoverColor:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Colour of that icon on hover.`,name:`hoverColor`,required:!1,tags:{},type:{name:`string | undefined`}},iconNode:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"The icon as an element, instead of `iconName`.",name:`iconNode`,required:!1,tags:{},type:{name:`ReactNode`}},iconColor:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Colour of that icon.`,name:`iconColor`,required:!1,tags:{},type:{name:`string | undefined`}},iconSize:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"Size of that icon in pixels. It falls back to `size`.",name:`iconSize`,required:!1,tags:{},type:{name:`number | undefined`}},isIconFill:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:"Whether the icon's paths are recoloured to `iconColor`. Leave it off for a\nmulti-coloured icon.",name:`isIconFill`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},onIconClick:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Called when the icon is clicked. Without it the icon is rendered in the
disabled style and does not respond — it is what makes the icon a button.`,name:`onIconClick`,required:!1,tags:{},type:{name:`((e: MouseEvent<Element, MouseEvent>) => void) | undefined`}},noIcon:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/input-block/InputBlock.types.ts`,name:`TypeLiteral`}],description:`Whether the icon box is left out entirely. Without it an empty box is still
rendered and still takes its padding.`,name:`noIcon`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Handle for generating a password and reading the current value.`,name:`ref`,required:!1,tags:{},type:{name:`RefObject<PasswordInputHandle | null> | undefined`}},inputValue:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Value the field starts with. The component owns the value from then on:
changing this later is ignored unless it becomes an empty string, or
\`isSimulateType\` is set.`,name:`inputValue`,required:!1,tags:{},type:{name:`string | undefined`}},emailInputName:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Ignored. It only sets an internal flag for a copy button that is not rendered.`,name:`emailInputName`,required:!1,tags:{},type:{name:`string | undefined`}},passwordSettings:{defaultValue:{value:`{
  minLength: 8,
  upperCase: false,
  digits: false,
  specSymbols: false,
  digitsRegexStr: "(?=.*\\\\d)",
  upperCaseRegexStr: "(?=.*[A-Z])",
  specSymbolsRegexStr: "(?=.*[\\\\x21-\\\\x2F\\\\x3A-\\\\x40\\\\x5B-\\\\x60\\\\x7B-\\\\x7E])",
}`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`The rules the generator and the checker use. Left out, only a minimum
length of 8 is required — digits, capitals and symbols are all off.`,name:`passwordSettings`,required:!1,tags:{},type:{name:`TPasswordSettings | undefined`}},onValidateInput:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:"Called after every change with whether every rule passes, and with each\nrule's own result. It never fires in `simpleView`, which skips checking.",name:`onValidateInput`,required:!1,tags:{},type:{name:`((progressScore: boolean, passwordValidation: TPasswordValidation) => void) | undefined`}},generatorSpecial:{defaultValue:{value:`!@#$%^&*`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Characters the generator may pick symbols from.`,name:`generatorSpecial`,required:!1,tags:{default:`"!@#$%^&*"`},type:{name:`string | undefined`}},simpleView:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Strips the component down to the field and the reveal eye: no strength
tooltip, no generate link, and no validation at all.`,name:`simpleView`,required:!1,tags:{},type:{name:`boolean | undefined`}},isFullWidth:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Whether the wrapper is a full-width block rather than shrinking to the field.`,name:`isFullWidth`,required:!1,tags:{},type:{name:`boolean | undefined`}},isSimulateType:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:"Renders the value as repeated `simulateSymbol` characters in a **text**\nfield, keeping the real value in state. It needs the input's `id` to be\n`conversion-password`, which is where it reads the caret from.",name:`isSimulateType`,required:!1,tags:{},type:{name:`boolean | undefined`}},simulateSymbol:{defaultValue:{value:`•`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:"The character drawn for each real one under `isSimulateType`.",name:`simulateSymbol`,required:!1,tags:{default:`"•"`},type:{name:`string | undefined`}},clipActionResource:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Ignored. It feeds a copy button that is not rendered.`,name:`clipActionResource`,required:!1,tags:{},type:{name:`string | undefined`}},clipCopiedResource:{defaultValue:{value:`Copied`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Ignored. It feeds a copy button that is not rendered.`,name:`clipCopiedResource`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipPasswordTitle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Title for password requirements tooltip`,name:`tooltipPasswordTitle`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipPasswordLength:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Prompt for minimum length requirement`,name:`tooltipPasswordLength`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipPasswordDigits:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Prompt for digits requirement`,name:`tooltipPasswordDigits`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipPasswordCapital:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Prompt for capital letters requirement`,name:`tooltipPasswordCapital`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipPasswordSpecial:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Prompt for special characters requirement`,name:`tooltipPasswordSpecial`,required:!1,tags:{},type:{name:`string | undefined`}},tooltipAllowedCharacters:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Title for allowed characters tooltip`,name:`tooltipAllowedCharacters`,required:!1,tags:{},type:{name:`string | undefined`}},isDisableTooltip:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Allows to hide Tooltip`,name:`isDisableTooltip`,required:!1,tags:{},type:{name:`boolean | undefined`}},generatePasswordTitle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Title of the password generation button`,name:`generatePasswordTitle`,required:!1,tags:{},type:{name:`string | undefined`}},inputType:{defaultValue:{value:`InputType.password`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:"Whether the field starts revealed. The eye toggles it from then on, and\n`isDisabled` forces it back to hidden.",name:`inputType`,required:!1,tags:{default:`InputType.password`},type:{name:`InputType.text | InputType.password | undefined`}},inputName:{defaultValue:{value:`passwordInput`},declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:"`name` of the field, and the fallback for the tooltip's anchor id when no\n`id` is given — so two fields on one page need distinct ids.",name:`inputName`,required:!1,tags:{default:`"passwordInput"`},type:{name:`string | undefined`}},inputWidth:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Width of the field's wrapper, as a CSS length.`,name:`inputWidth`,required:!1,tags:{},type:{name:`string | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Called on every change with the DOM event and the value after sanitising.
Read the second argument: under \`isSimulateType\` the event carries the
masking characters, not the password.`,name:`onChange`,required:!1,tags:{},type:{name:`((e: ChangeEvent<HTMLInputElement, Element>, value?: string | undefined) => void) | undefined`}},sanitizeValue:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/password-input/PasswordInput.types.ts`,name:`TypeLiteral`}],description:`Runs on every change before the value is stored — stripping spaces, say.`,name:`sanitizeValue`,required:!1,tags:{},type:{name:`((value: string) => string) | undefined`}}},tags:{}}}catch{}})))()}var F,I,L,R,z,B,V,H,ve,U,W,G,K,q,J,Y,ye,X,be,Z,Q,$;function xe(){return(xe=e((()=>{F=n(),h(),P(),I=r(),L={title:`UI/Form controls/PasswordInput`,component:N,parameters:{},argTypes:{size:{control:`select`,options:Object.values(_),description:`Height and font size of the field`,table:{defaultValue:{summary:`middle`}}},simpleView:{control:`boolean`,description:`Strips the component down to the field and the eye button: no tooltip, no generator link and no rule checking`,table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Greys the field out, blocks typing and generation, drops the tooltip and hides the characters again`,table:{defaultValue:{summary:`false`}}},isDisableTooltip:{control:`boolean`,description:`Never shows the rules tooltip`,table:{defaultValue:{summary:`false`}}},maxLength:{control:`number`,description:`Maximum number of characters the field accepts`},inputWidth:{control:`text`,description:`Width of the field as a CSS length; left out, the field fills its container`},scale:{control:`boolean`,description:`Stretches the field to the full width of its container`,table:{defaultValue:{summary:`true`}}},inputValue:{control:`text`,description:`Value the field starts with; the component keeps its own value from then on and only follows a later change to an empty string`},inputName:{control:`text`,description:"`name` of the field, also used to find the field for the tooltip when no `id` is given, so two fields on one page need distinct names or ids",table:{defaultValue:{summary:`passwordInput`}}},id:{control:`text`,description:"`id` of the field's wrapper, used to find the field for the tooltip"},placeholder:{control:`text`,description:`Hint shown in the empty field`},inputType:{control:`radio`,options:[`password`,`text`],description:"Whether the field starts with its characters shown (`text`) or hidden (`password`); the eye button toggles it from then on",table:{defaultValue:{summary:`password`}}},passwordSettings:{control:`object`,description:`The rules the checker and the generator use: minimum length, and whether capitals, digits and special characters are required`,table:{defaultValue:{summary:`{ minLength: 8 }`}}},hasError:{control:`boolean`,description:`Draws the field with a red error border, and the rules tooltip opens on every change`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Draws the field with a warning border, and the rules tooltip opens on every change`,table:{defaultValue:{summary:`false`}}},tooltipPasswordTitle:{control:`text`,description:`Heading of the rules tooltip`},tooltipPasswordLength:{control:`text`,description:`Tooltip line for the minimum length rule, including the number`},tooltipPasswordDigits:{control:`text`,description:`Tooltip line for the digits rule, shown when digits are required`},tooltipPasswordCapital:{control:`text`,description:`Tooltip line for the capital letters rule, shown when capitals are required`},tooltipPasswordSpecial:{control:`text`,description:`Tooltip line for the special characters rule, shown when they are required`},tooltipAllowedCharacters:{control:`text`,description:`Extra text shown in the tooltip after the rules`},generatePasswordTitle:{control:`text`,description:`Text of a link at the bottom of the tooltip that fills the field with a random password meeting the rules; left out, no link is shown`},generatorSpecial:{control:`text`,description:`Characters the generator may pick special characters from`,table:{defaultValue:{summary:`!@#$%^&*`}}},isFullWidth:{control:`boolean`,description:`Makes the component a full-width block instead of a row that shrinks to the field`,table:{defaultValue:{summary:`false`}}},isSimulateType:{control:!1,description:"Draws each character as `simulateSymbol` in a plain text field while keeping the real value; the field's `id` must be `conversion-password`",table:{defaultValue:{summary:`false`}}},simulateSymbol:{control:`text`,description:"Character drawn for each real one under `isSimulateType`",table:{defaultValue:{summary:`•`}}},autoComplete:{control:`text`,description:"`autocomplete` attribute of the field",table:{defaultValue:{summary:`new-password`}}},tabIndex:{control:`number`,description:`Position of the field in the Tab order`},isAutoFocussed:{control:`boolean`,description:`Focuses the field when it mounts`,table:{defaultValue:{summary:`false`}}},onChange:{action:`onChange`,description:`Called on every change with the DOM event and the stored value; read the second argument, since a generated password arrives without a real event`},onValidateInput:{action:`onValidateInput`,description:"Called after every change with whether all rules pass and with each rule's own result; never called in `simpleView`"},sanitizeValue:{control:!1,description:`Function run on every change before the value is stored, such as one that strips spaces`},onBlur:{action:`onBlur`,description:`Called when the field loses focus`},onKeyDown:{action:`onKeyDown`,description:`Called on every key press in the field`},emailInputName:{control:!1,description:`Ignored: it feeds a copy button that is not rendered`},clipActionResource:{control:!1,description:`Ignored: it feeds a copy button that is not rendered`},clipCopiedResource:{control:!1,description:`Ignored: it feeds a copy button that is not rendered`}}},R=e=>(0,I.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gridGap:`24px`,alignItems:`start`},children:e.children}),z={minLength:6,upperCase:!0,digits:!0,specSymbols:!0,digitsRegexStr:`(?=.*\\d)`,upperCaseRegexStr:`(?=.*[A-Z])`,specSymbolsRegexStr:`(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])`},B={tooltipPasswordTitle:`Password must contain:`,tooltipPasswordLength:`minimum length: `,tooltipPasswordDigits:`digits`,tooltipPasswordCapital:`capital letters`,tooltipPasswordSpecial:`special characters (!@#$%^&*)`,generatorSpecial:`!@#$%^&*`},V=({passwordSettings:e,onChange:t,onValidateInput:n,...r})=>{let[i,a]=(0,F.useState)(``),[o,s]=(0,F.useState)(e);return(0,F.useEffect)(()=>{s(e),a(``)},[e]),(0,I.jsx)(`div`,{style:{height:`110px`,width:`320px`},children:(0,I.jsx)(N,{size:_.base,...r,scale:!0,inputValue:i,onChange:(e,n)=>{a(n??``),t?.(e,n)},tooltipPasswordLength:`${r.tooltipPasswordLength}${e?.minLength}`,passwordSettings:o,onValidateInput:n})})},H={render:e=>(0,I.jsx)(V,{...e}),args:{isDisabled:!1,passwordSettings:z,simpleView:!1,inputName:`demoPasswordInput-default`,isDisableTooltip:!1,...B,placeholder:`password`,maxLength:30,size:_.base},parameters:{docs:{description:{story:`The field as a sign-up form uses it: type a character to open the rules tooltip and watch each rule turn green as the value meets it; change any other prop live in the Controls panel below.`},source:{code:`<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  onValidateInput={(isValid, rules) => setCanSubmit(isValid)}
  passwordSettings={{
    minLength: 6,
    upperCase: true,
    digits: true,
    specSymbols: true,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  placeholder="password"
  maxLength={30}
  size={InputSize.base}
/>`}}}},ve=()=>{let[e,t]=(0,F.useState)(``);return(0,I.jsx)(`div`,{style:{width:`320px`},children:(0,I.jsx)(N,{simpleView:!0,inputValue:e,onChange:e=>t(e.currentTarget?.value),inputName:`simple-view-demo`,placeholder:`Enter password`,passwordSettings:z,scale:!0})})},U={render:()=>(0,I.jsx)(ve,{}),parameters:{docs:{description:{story:"A sign-in form only needs the field and the eye button: the simple view drops the rules tooltip and skips rule checking, so the field accepts any value (`simpleView`)."},source:{code:`<PasswordInput
  simpleView
  inputValue={value}
  onChange={handleChange}
  placeholder="Enter password"
/>`}}}},W=()=>(0,I.jsxs)(R,{children:[(0,I.jsx)(V,{passwordSettings:z,inputName:`state-normal`,placeholder:`Normal`,...B}),(0,I.jsx)(V,{passwordSettings:z,inputName:`state-disabled`,isDisabled:!0,placeholder:`Disabled`,...B}),(0,I.jsx)(V,{passwordSettings:z,inputName:`state-error`,hasError:!0,placeholder:`With error`,...B})]}),G={render:()=>(0,I.jsx)(W,{}),parameters:{docs:{description:{story:"Three fields a form may need side by side: **Normal**, ready for input; **Disabled**, greyed out with typing blocked and no tooltip (`isDisabled`); **With error**, drawn with a red border to flag a value the form rejected (`hasError`)."},source:{code:`<PasswordInput placeholder="Normal" passwordSettings={settings} />
<PasswordInput placeholder="Disabled" isDisabled passwordSettings={settings} />
<PasswordInput placeholder="With error" hasError passwordSettings={settings} />`}}}},K=()=>{let[e,t]=(0,F.useState)(``);return(0,I.jsx)(`div`,{style:{height:`110px`,width:`320px`},children:(0,I.jsx)(N,{inputValue:e,onChange:e=>t(e.currentTarget?.value),inputName:`custom-rules-demo`,placeholder:`Min 8 chars, uppercase & digits`,passwordSettings:{...z,minLength:8,specSymbols:!1},tooltipPasswordTitle:`Password must contain:`,tooltipPasswordLength:`minimum length: 8`,tooltipPasswordDigits:`digits`,tooltipPasswordCapital:`capital letters`,scale:!0})})},q={render:()=>(0,I.jsx)(K,{}),parameters:{docs:{description:{story:"A policy that asks for less: type into the field and the tooltip lists only a minimum length of 8, capital letters and digits, because special characters are switched off (`passwordSettings`)."},source:{code:`<PasswordInput
  passwordSettings={{
    minLength: 8,
    upperCase: true,
    digits: true,
    specSymbols: false,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 8"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
/>`}}}},J=()=>(0,I.jsxs)(R,{children:[(0,I.jsx)(V,{passwordSettings:z,inputName:`size-base`,size:_.base,placeholder:`Base size`,simpleView:!0,...B}),(0,I.jsx)(V,{passwordSettings:z,inputName:`size-middle`,size:_.middle,placeholder:`Middle size`,simpleView:!0,...B}),(0,I.jsx)(V,{passwordSettings:z,inputName:`size-large`,size:_.large,placeholder:`Large size`,simpleView:!0,...B})]}),Y={render:()=>(0,I.jsx)(J,{}),parameters:{docs:{description:{story:"Pick the height that matches the other fields of the form: base, middle and large (`size`)."},source:{code:`<PasswordInput size={InputSize.base} placeholder="Base size" simpleView />
<PasswordInput size={InputSize.middle} placeholder="Middle size" simpleView />
<PasswordInput size={InputSize.large} placeholder="Large size" simpleView />`}}}},ye=()=>{let[e,t]=(0,F.useState)(``);return(0,I.jsx)(`div`,{style:{height:`110px`,width:`320px`},children:(0,I.jsx)(N,{inputValue:e,onChange:(e,n)=>t(n??``),inputName:`generator-demo`,placeholder:`Type a character`,passwordSettings:z,...B,tooltipPasswordLength:`minimum length: 6`,generatePasswordTitle:`Generate password`,scale:!0})})},X={render:()=>(0,I.jsx)(ye,{}),parameters:{docs:{description:{story:"Saves the user from inventing a password that meets every rule: type a character to open the tooltip, then click **Generate password** at its bottom; the field fills with a random password that passes all rules and shows its characters (`generatePasswordTitle`, symbols picked from `generatorSpecial`)."},source:{code:`<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  passwordSettings={settings}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  generatorSpecial="!@#$%^&*"
  generatePasswordTitle="Generate password"
/>`}}}},be=()=>{let[e,t]=(0,F.useState)(`Passw0rd!`);return(0,I.jsx)(`div`,{dir:`rtl`,style:{width:`320px`},children:(0,I.jsx)(N,{simpleView:!0,inputValue:e,onChange:(e,n)=>t(n??``),inputName:`rtl-demo`,placeholder:`كلمة المرور`,scale:!0})})},Z={render:()=>(0,I.jsx)(be,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`58px`},description:{story:'The field in a right-to-left layout: the hidden characters line up from the right edge and the eye button moves to the left end. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <PasswordInput
    simpleView
    inputValue={value}
    onChange={(e, value) => setValue(value ?? "")}
    placeholder="كلمة المرور"
  />
</div>`}}}},Q={render:()=>(0,I.jsx)(`div`,{style:{width:`320px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#7c3aed`,"--text-input-color":`#4c1d95`,"--text-input-radius":`8px`,"--text-input-border-hover":`#a78bfa`,"--text-input-border-focus":`#2e1065`},children:(0,I.jsx)(N,{inputValue:`Passw0rd!`,onChange:()=>{},inputName:`css-custom-demo`,placeholder:`Custom styled password`,passwordSettings:z,...B,scale:!0,size:_.base})}),parameters:{docs:{description:{story:`The input variables set on one wrapper -- the variables are listed under CSS variables on this page. The example sets every variable but the tooltip width, which a wrapper cannot reach; hover and focus the field to see the border colors.`}}}},$=[`Default`,`SimpleView`,`States`,`CustomValidation`,`Sizes`,`WithPasswordGenerator`,`RightToLeft`,`CssCustomization`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <PasswordInputTemplate {...args} />,
  args: {
    isDisabled: false,
    passwordSettings: basePasswordSettings,
    simpleView: false,
    inputName: "demoPasswordInput-default",
    isDisableTooltip: false,
    ...baseTooltipProps,
    placeholder: "password",
    maxLength: 30,
    size: InputSize.base
  },
  parameters: {
    docs: {
      description: {
        story: "The field as a sign-up form uses it: type a character to open the rules tooltip and watch each rule turn green as the value meets it; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  onValidateInput={(isValid, rules) => setCanSubmit(isValid)}
  passwordSettings={{
    minLength: 6,
    upperCase: true,
    digits: true,
    specSymbols: true,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  placeholder="password"
  maxLength={30}
  size={InputSize.base}
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <SimpleViewTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A sign-in form only needs the field and the eye button: the simple view drops the rules tooltip and skips rule checking, so the field accepts any value (\`simpleView\`)."
      },
      source: {
        code: \`<PasswordInput
  simpleView
  inputValue={value}
  onChange={handleChange}
  placeholder="Enter password"
/>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Three fields a form may need side by side: **Normal**, ready for input; **Disabled**, greyed out with typing blocked and no tooltip (\`isDisabled\`); **With error**, drawn with a red border to flag a value the form rejected (\`hasError\`)."
      },
      source: {
        code: \`<PasswordInput placeholder="Normal" passwordSettings={settings} />
<PasswordInput placeholder="Disabled" isDisabled passwordSettings={settings} />
<PasswordInput placeholder="With error" hasError passwordSettings={settings} />\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <CustomRulesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A policy that asks for less: type into the field and the tooltip lists only a minimum length of 8, capital letters and digits, because special characters are switched off (\`passwordSettings\`)."
      },
      source: {
        code: \`<PasswordInput
  passwordSettings={{
    minLength: 8,
    upperCase: true,
    digits: true,
    specSymbols: false,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 8"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
/>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the height that matches the other fields of the form: base, middle and large (\`size\`)."
      },
      source: {
        code: \`<PasswordInput size={InputSize.base} placeholder="Base size" simpleView />
<PasswordInput size={InputSize.middle} placeholder="Middle size" simpleView />
<PasswordInput size={InputSize.large} placeholder="Large size" simpleView />\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <GeneratorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Saves the user from inventing a password that meets every rule: type a character to open the tooltip, then click **Generate password** at its bottom; the field fills with a random password that passes all rules and shows its characters (\`generatePasswordTitle\`, symbols picked from \`generatorSpecial\`)."
      },
      source: {
        code: \`<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  passwordSettings={settings}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  generatorSpecial="!@#$%^&*"
  generatePasswordTitle="Generate password"
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "58px"
      },
      description: {
        story: 'The field in a right-to-left layout: the hidden characters line up from the right edge and the eye button moves to the left end. The wrapper carries \`dir="rtl"\`; the direction also comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <PasswordInput
    simpleView
    inputValue={value}
    onChange={(e, value) => setValue(value ?? "")}
    placeholder="كلمة المرور"
  />
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "320px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#7c3aed",
    "--text-input-color": "#4c1d95",
    "--text-input-radius": "8px",
    "--text-input-border-hover": "#a78bfa",
    "--text-input-border-focus": "#2e1065"
  } as CSSProperties}>
      <PasswordInput inputValue="Passw0rd!" onChange={() => {}} inputName="css-custom-demo" placeholder="Custom styled password" passwordSettings={basePasswordSettings} {...baseTooltipProps} scale size={InputSize.base} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The input variables set on one wrapper -- the variables are listed under CSS variables on this page. The example sets every variable but the tooltip width, which a wrapper cannot reach; hover and focus the field to see the border colors.\`
      }
    }
  }
}`,...Q.parameters?.docs?.source}}}})))()}xe();export{Q as CssCustomization,q as CustomValidation,H as Default,Z as RightToLeft,U as SimpleView,Y as Sizes,G as States,X as WithPasswordGenerator,$ as __namedExportsOrder,L as default};