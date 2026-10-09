import{n as __esmMin,o as __toESM,t as __commonJSMin}from"./rolldown-runtime-C0FnF6B9.js";import{t as require_react}from"./react-C21x__mS.js";import{t as require_jsx_runtime}from"./jsx-runtime-BdxMnOeJ.js";import{n as init_InterfaceDirectionContext,r as useInterfaceDirection}from"./InterfaceDirectionContext-Bc3bP5Oy.js";import{t as require_classnames}from"./classnames-CfLRLWYq.js";import{t as require_prop_types}from"./prop-types-D9WxI36-.js";import{n as toastr,t as init_Toastr}from"./Toastr-x__mex7v.js";import{n as init_Toast,t as Toast}from"./Toast-6E8r1NpK.js";import{n as init_icon_button,t as IconButton}from"./icon-button-CrT9MlQO.js";import{n as init_Scrollbar,t as Scrollbar}from"./Scrollbar-Tkb6Sv30.js";import{n as interopDefault,t as init_interop_default}from"./interop-default-DBxUGC2i.js";import{n as init_copy_react,t as ForwardRef}from"./copy.react-CAxNI6mw.js";var require_toggle_selection=__commonJSMin(((e,t)=>{t.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case`INPUT`:case`TEXTAREA`:t.blur();break;default:t=null}return e.removeAllRanges(),function(){e.type===`Caret`&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t)}),t&&t.focus()}}})),require_copy_to_clipboard=__commonJSMin(((e,t)=>{var n=require_toggle_selection(),r={"text/plain":`Text`,"text/html":`Url`,default:`Text`},i=`Copy to clipboard: #{key}, Enter`;function a(e){var t=(/mac os x/i.test(navigator.userAgent)?`⌘`:`Ctrl`)+`+C`;return e.replace(/#{\s*key\s*}/g,t)}function o(e,t){var o,s,c,l,u,d,p=!1;t||={},o=t.debug||!1;try{if(c=n(),l=document.createRange(),u=document.getSelection(),d=document.createElement(`span`),d.textContent=e,d.ariaHidden=`true`,d.style.all=`unset`,d.style.position=`fixed`,d.style.top=0,d.style.clip=`rect(0, 0, 0, 0)`,d.style.whiteSpace=`pre`,d.style.webkitUserSelect=`text`,d.style.MozUserSelect=`text`,d.style.msUserSelect=`text`,d.style.userSelect=`text`,d.addEventListener(`copy`,function(n){if(n.stopPropagation(),t.format){if(n.preventDefault(),n.clipboardData===void 0){o&&console.warn(`unable to use e.clipboardData`),o&&console.warn(`trying IE specific stuff`),window.clipboardData.clearData();var i=r[t.format]||r.default;window.clipboardData.setData(i,e)}else n.clipboardData.clearData(),n.clipboardData.setData(t.format,e)}t.onCopy&&(n.preventDefault(),t.onCopy(n.clipboardData))}),document.body.appendChild(d),l.selectNodeContents(d),u.addRange(l),!document.execCommand(`copy`))throw Error(`copy command was unsuccessful`);p=!0}catch(n){o&&console.error(`unable to copy using execCommand: `,n),o&&console.warn(`trying IE specific stuff`);try{window.clipboardData.setData(t.format||`text`,e),t.onCopy&&t.onCopy(window.clipboardData),p=!0}catch(n){o&&console.error(`unable to copy using clipboardData: `,n),o&&console.error(`falling back to prompt`),s=a(`message`in t?t.message:i),window.prompt(s,e)}}finally{u&&(typeof u.removeRange==`function`?u.removeRange(l):u.removeAllRanges()),d&&document.body.removeChild(d),c()}return p}t.exports=o})),require_autosize=__commonJSMin(((e,t)=>{(function(n,r){if(typeof define==`function`&&define.amd)define([`module`,`exports`],r);else if(e!==void 0)r(t,e);else{var i={exports:{}};r(i,i.exports),n.autosize=i.exports}})(e,function(e,t){var n=typeof Map==`function`?new Map:function(){var e=[],t=[];return{has:function(t){return e.indexOf(t)>-1},get:function(n){return t[e.indexOf(n)]},set:function(n,r){e.indexOf(n)===-1&&(e.push(n),t.push(r))},delete:function(n){var r=e.indexOf(n);r>-1&&(e.splice(r,1),t.splice(r,1))}}}(),r=function(e){return new Event(e,{bubbles:!0})};try{new Event(`test`)}catch{r=function(e){var t=document.createEvent(`Event`);return t.initEvent(e,!0,!1),t}}function i(e){if(!e||!e.nodeName||e.nodeName!==`TEXTAREA`||n.has(e))return;var t=null,i=null,a=null;function o(){var n=window.getComputedStyle(e,null);n.resize===`vertical`?e.style.resize=`none`:n.resize===`both`&&(e.style.resize=`horizontal`),t=n.boxSizing===`content-box`?-(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom)):parseFloat(n.borderTopWidth)+parseFloat(n.borderBottomWidth),isNaN(t)&&(t=0),u()}function s(t){var n=e.style.width;e.style.width=`0px`,e.offsetWidth,e.style.width=n,e.style.overflowY=t}function c(e){for(var t=[];e&&e.parentNode&&e.parentNode instanceof Element;)e.parentNode.scrollTop&&t.push({node:e.parentNode,scrollTop:e.parentNode.scrollTop}),e=e.parentNode;return t}function l(){if(e.scrollHeight!==0){var n=c(e),r=document.documentElement&&document.documentElement.scrollTop;e.style.height=``,e.style.height=e.scrollHeight+t+`px`,i=e.clientWidth,n.forEach(function(e){e.node.scrollTop=e.scrollTop}),r&&(document.documentElement.scrollTop=r)}}function u(){l();var t=Math.round(parseFloat(e.style.height)),n=window.getComputedStyle(e,null),i=n.boxSizing===`content-box`?Math.round(parseFloat(n.height)):e.offsetHeight;if(i<t?n.overflowY===`hidden`&&(s(`scroll`),l(),i=n.boxSizing===`content-box`?Math.round(parseFloat(window.getComputedStyle(e,null).height)):e.offsetHeight):n.overflowY!==`hidden`&&(s(`hidden`),l(),i=n.boxSizing===`content-box`?Math.round(parseFloat(window.getComputedStyle(e,null).height)):e.offsetHeight),a!==i){a=i;var o=r(`autosize:resized`);try{e.dispatchEvent(o)}catch{}}}var d=function(){e.clientWidth!==i&&u()},p=function(t){window.removeEventListener(`resize`,d,!1),e.removeEventListener(`input`,u,!1),e.removeEventListener(`keyup`,u,!1),e.removeEventListener(`autosize:destroy`,p,!1),e.removeEventListener(`autosize:update`,u,!1),Object.keys(t).forEach(function(n){e.style[n]=t[n]}),n.delete(e)}.bind(e,{height:e.style.height,resize:e.style.resize,overflowY:e.style.overflowY,overflowX:e.style.overflowX,wordWrap:e.style.wordWrap});e.addEventListener(`autosize:destroy`,p,!1),`onpropertychange`in e&&`oninput`in e&&e.addEventListener(`keyup`,u,!1),window.addEventListener(`resize`,d,!1),e.addEventListener(`input`,u,!1),e.addEventListener(`autosize:update`,u,!1),e.style.overflowX=`hidden`,e.style.wordWrap=`break-word`,n.set(e,{destroy:p,update:u}),o()}function a(e){var t=n.get(e);t&&t.destroy()}function o(e){var t=n.get(e);t&&t.update()}var s=null;typeof window>`u`||typeof window.getComputedStyle!=`function`?(s=function(e){return e},s.destroy=function(e){return e},s.update=function(e){return e}):(s=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return i(e,t)}),e},s.destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],a),e},s.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],o),e}),t.default=s,e.exports=t.default})})),require_computedStyle_commonjs=__commonJSMin(((e,t)=>{t.exports=function(e,t,n){return n=window.getComputedStyle,(n?n(e):e.currentStyle)[t.replace(/-(\w)/gi,function(e,t){return t.toUpperCase()})]}})),require_line_height=__commonJSMin(((e,t)=>{var n=require_computedStyle_commonjs();function r(e){var t=n(e,`line-height`),r=parseFloat(t,10);if(t===r+``){var i=e.style.lineHeight;e.style.lineHeight=t+`em`,t=n(e,`line-height`),r=parseFloat(t,10),i?e.style.lineHeight=i:delete e.style.lineHeight}if(t.indexOf(`pt`)===-1?t.indexOf(`mm`)===-1?t.indexOf(`cm`)===-1?t.indexOf(`in`)===-1?t.indexOf(`pc`)!==-1&&(r*=16):r*=96:(r*=96,r/=2.54):(r*=96,r/=25.4):(r*=4,r/=3),r=Math.round(r),t===`normal`){var a=e.nodeName,o=document.createElement(a);o.innerHTML=`&nbsp;`,a.toUpperCase()===`TEXTAREA`&&o.setAttribute(`rows`,`1`);var s=n(e,`font-size`);o.style.fontSize=s,o.style.padding=`0px`,o.style.border=`0px`;var c=document.body;c.appendChild(o),r=o.offsetHeight,c.removeChild(o)}return r}t.exports=r})),require_TextareaAutosize=__commonJSMin((e=>{var t=e&&e.__extends||(function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){e(t,n);function r(){this.constructor=t}t.prototype=n===null?Object.create(n):(r.prototype=n.prototype,new r)}})(),n=e&&e.__assign||Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},r=e&&e.__rest||function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&(n[r[i]]=e[r[i]]);return n};e.__esModule=!0;var i=require_react(),a=require_prop_types(),o=require_autosize(),s=require_line_height(),c=`autosize:resized`,l=function(e){t(l,e);function l(){var t=e!==null&&e.apply(this,arguments)||this;return t.state={lineHeight:null},t.textarea=null,t.onResize=function(e){t.props.onResize&&t.props.onResize(e)},t.updateLineHeight=function(){t.textarea&&t.setState({lineHeight:s(t.textarea)})},t.onChange=function(e){var n=t.props.onChange;t.currentValue=e.currentTarget.value,n&&n(e)},t}return l.prototype.componentDidMount=function(){var e=this,t=this.props,n=t.maxRows,r=t.async;typeof n==`number`&&this.updateLineHeight(),typeof n==`number`||r?setTimeout(function(){return e.textarea&&o(e.textarea)}):this.textarea&&o(this.textarea),this.textarea&&this.textarea.addEventListener(c,this.onResize)},l.prototype.componentWillUnmount=function(){this.textarea&&(this.textarea.removeEventListener(c,this.onResize),o.destroy(this.textarea))},l.prototype.render=function(){var e=this,t=this,a=t.props;a.onResize;var o=a.maxRows;a.onChange;var s=a.style;a.innerRef;var c=a.children,l=r(a,[`onResize`,`maxRows`,`onChange`,`style`,`innerRef`,`children`]),u=t.state.lineHeight,d=o&&u?u*o:null;return i.createElement(`textarea`,n({},l,{onChange:this.onChange,style:d?n({},s,{maxHeight:d}):s,ref:function(t){e.textarea=t,typeof e.props.innerRef==`function`?e.props.innerRef(t):e.props.innerRef&&(e.props.innerRef.current=t)}}),c)},l.prototype.componentDidUpdate=function(){this.textarea&&o.update(this.textarea)},l.defaultProps={rows:1,async:!1},l.propTypes={rows:a.number,maxRows:a.number,onResize:a.func,innerRef:a.any,async:a.bool},l}(i.Component);e.TextareaAutosize=i.forwardRef(function(e,t){return i.createElement(l,n({},e,{innerRef:t}))})})),require_lib=__commonJSMin((e=>{e.__esModule=!0,e.default=require_TextareaAutosize().TextareaAutosize})),require_json2_mod=__commonJSMin(((exports,module)=>{(function(){var JSON2_mod={};function f(e){return e<10?`0`+e:e}typeof Date.prototype.toJSON!=`function`&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+`-`+f(this.getUTCMonth()+1)+`-`+f(this.getUTCDate())+`T`+f(this.getUTCHours())+`:`+f(this.getUTCMinutes())+`:`+f(this.getUTCSeconds())+`Z`:null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,keyable=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/,gap,indent,meta={"\b":`\\b`,"	":`\\t`,"\n":`\\n`,"\f":`\\f`,"\r":`\\r`,'"':`\\"`,"'":`\\'`,"\\":`\\\\`},rep;function quote(e,t){escapable.lastIndex=0;var n=`"`;return t===`single`&&(n=`'`),escapable.test(e)?n+e.replace(escapable,function(e){var t=meta[e];return typeof t==`string`?t:`\\u`+(`0000`+e.charCodeAt(0).toString(16)).slice(-4)})+n:n+e+n}function condQuoteKey(e,t){return keyable.test(e)?e:quote(e,t)}function str(e,t,n,r){var i,a,o,s,c=gap,l,u=t[e];switch(u&&typeof u==`object`&&typeof u.toJSON==`function`&&(u=u.toJSON(e)),typeof rep==`function`&&(u=rep.call(t,e,u)),typeof u){case`string`:return quote(u,r);case`number`:return isFinite(u)?String(u):`null`;case`boolean`:case`null`:return String(u);case`object`:if(!u)return`null`;if(gap+=indent,l=[],Object.prototype.toString.apply(u)===`[object Array]`){for(s=u.length,i=0;i<s;i+=1)l[i]=str(i,u,n,r)||`null`;return o=l.length===0?`[]`:gap?`[
`+gap+l.join(`,
`+gap)+`
`+c+`]`:`[`+l.join(`,`)+`]`,gap=c,o}if(rep&&typeof rep==`object`)for(s=rep.length,i=0;i<s;i+=1)typeof rep[i]==`string`&&(a=rep[i],o=str(a,u,n,r),o&&l.push((n?condQuoteKey(a,r):quote(a,r))+(gap?`: `:`:`)+o));else for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(o=str(a,u,n,r),o&&l.push((n?condQuoteKey(a,r):quote(a,r))+(gap?`: `:`:`)+o));return o=l.length===0?`{}`:gap?`{
`+gap+l.join(`,
`+gap)+`
`+c+`}`:`{`+l.join(`,`)+`}`,gap=c,o}}typeof JSON2_mod.stringify!=`function`&&(JSON2_mod.stringify=function(e,t,n,r,i){var a;if(gap=``,indent=``,typeof n==`number`)for(a=0;a<n;a+=1)indent+=` `;else typeof n==`string`&&(indent=n);if(rep=t,t&&typeof t!=`function`&&(typeof t!=`object`||typeof t.length!=`number`))throw Error(`JSON.stringify`);return str(``,{"":e},r,i)}),typeof JSON2_mod.parse!=`function`&&(JSON2_mod.parse=function(text,reviver){var j;function walk(e,t){var n,r,i=e[t];if(i&&typeof i==`object`)for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r===void 0?delete i[n]:i[n]=r);return reviver.call(e,t,i)}if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return`\\u`+(`0000`+e.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,`@`).replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,`]`).replace(/(?:^|:|,)(?:\s*\[)+/g,``)))return j=eval(`(`+text+`)`),typeof reviver==`function`?walk({"":j},``):j;throw SyntaxError(`JSON.parse`)}),exports===void 0?this.JSON2_mod=JSON2_mod:(module!==void 0&&module.exports&&(exports=module.exports=JSON2_mod),exports.JSON2_mod=JSON2_mod)}).call(exports)})),require_json_beautifier=__commonJSMin(((e,t)=>{(function(){function n(e){if(r(e)){var t=Object.keys(e);t&&t.forEach(function(t){var i=e[t];if(typeof i==`string`){var a=i-0;e[t]=isNaN(a)?i:a}else(r(i)||Array.isArray(i))&&n(i)})}}function r(e){return e&&typeof e==`object`}function i(e,t){if(t||=80,typeof t!=`number`||t<20)throw`Invalid width '`+t+`'. Expecting number equal or larger than 20.`;for(var n=e.split(`
`),r=0,i=null,a=[];r<n.length;){var o=!!n[r].match(/\[/),s=!!n[r].match(/\],?/);if(o&&!s)a=[n[r]],i=r;else if(s&&!o&&i){a.push((n[r]||``).trim());var c=a.join(` `);c.length<t&&(n.splice(i,r-i+1,c),r=i),i=null,a=[]}else i&&a.push((n[r]||``).trim());r+=1}return n.join(`
`)}function a(e,t){var r=t.space||2,a=t.dropQuotesOnKeys||!1,s=t.dropQuotesOnNumbers||!1,c=t.inlineShortArrays||!1,l=t.inlineShortArraysDepth||1,u=t.quoteType||`double`,d=t.minify||!1;s&&n(e);var p=o.stringify(e,null,d?void 0:r,a,u);if(c&&!d){var m=i(p);if(l>1)for(var h=1;h<l&&(p=m,m=i(p),m!=p);h++);p=m}return p}var o;e===void 0?(o=window.JSON2_mod,this.CSVJSON||={},this.CSVJSON.json_beautifier=a):(t!==void 0&&t.exports&&(e=t.exports=a),o=require_json2_mod(),e.json_beautifier=a)}).call(e)}));function isJSON(e){if(typeof e!=`string`)return!1;try{let t=JSON.parse(e);return typeof t==`object`&&!!t}catch{return!1}}function beautifyJSON(e){return(0,import_json_beautifier.default)(JSON.parse(e),{inlineShortArrays:!0})}function jsonify(e,t){return t&&e&&isJSON(e)?beautifyJSON(e):e}var import_json_beautifier;function init_Textarea_utils(){return(init_Textarea_utils=__esmMin((()=>{import_json_beautifier=__toESM(require_json_beautifier())})))()}var numeration,copyIconWrapper,wrapper,heightScale,isFullHeight,defaultHeight,textarea,enableCopy,isJSONField,scrollbar,Textarea_module_default;function init_Textarea_module(){return(init_Textarea_module=__esmMin((()=>{numeration=`_numeration_6afyf_1`,copyIconWrapper=`_copyIconWrapper_6afyf_9`,wrapper=`_wrapper_6afyf_43`,heightScale=`_heightScale_6afyf_54`,isFullHeight=`_isFullHeight_6afyf_57`,defaultHeight=`_defaultHeight_6afyf_60`,textarea=`_textarea_6afyf_65`,enableCopy=`_enableCopy_6afyf_75`,isJSONField=`_isJSONField_6afyf_78`,scrollbar=`_scrollbar_6afyf_336`,Textarea_module_default={numeration,copyIconWrapper,wrapper,heightScale,isFullHeight,defaultHeight,textarea,enableCopy,isJSONField,scrollbar}})))()}var import_react$1,import_copy_to_clipboard,import_classnames,import_lib,import_jsx_runtime$1,TextareaAutosize,Textarea;function init_Textarea(){return(init_Textarea=__esmMin((()=>{import_react$1=__toESM(require_react()),import_copy_to_clipboard=__toESM(require_copy_to_clipboard()),import_classnames=__toESM(require_classnames()),import_lib=__toESM(require_lib()),init_copy_react(),init_InterfaceDirectionContext(),init_icon_button(),init_Scrollbar(),init_Toastr(),init_Textarea_utils(),init_Textarea_module(),import_jsx_runtime$1=require_jsx_runtime(),TextareaAutosize=interopDefault(import_lib),Textarea=({className:e,wrapperClassName:t,id:n,isDisabled:r=!1,isReadOnly:i=!1,hasError:a=!1,heightScale:o=!1,maxLength:s,name:c,onChange:l,placeholder:u=` `,style:d,tabIndex:p,value:m=``,fontSize:h=13,heightTextArea:g,color:_,autoFocus:v,areaSelect:y=!1,isJSONField:b=!1,enableCopy:x=!1,hasNumeration:S=!1,isFullHeight:C=!1,classNameCopyIcon:w,isChatMode:T=!1,dataTestId:E,onKeyDown:D,onCopy:O,copyInfoText:k,"aria-label":A,"aria-labelledby":M,"aria-describedby":N})=>{let{isRTL:P}=useInterfaceDirection(),F=(0,import_react$1.useRef)(null),[I,L]=(0,import_react$1.useState)(a),[R,z]=(0,import_react$1.useState)(!1),B=jsonify(m,b),V=(0,import_react$1.useCallback)(()=>{let e=1.5,t=7,n=B.split(`
`).length,r=n*h*1.5+7+4,i=typeof g==`number`?`${g}px`:g,a=42,o=String(n).length-2>0?String(n).length:0;return{fullHeight:r,stringifiedHeight:i,paddingLeftProp:S?h<13?`${42+o*6}px`:`${(42+o*4)*h/13}px`:`8px`,numberOfLines:n}},[B,h,g,S]),H=(0,import_react$1.useCallback)(()=>{F.current&&(F.current.focus(),x&&F.current.select())},[x]),U=(0,import_react$1.useCallback)(()=>{B&&((0,import_copy_to_clipboard.default)(B),k&&toastr.success(k),O&&O(B))},[B,O,k]);(0,import_react$1.useEffect)(()=>{L(a)},[a]),(0,import_react$1.useEffect)(()=>{L(b&&(!m||!isJSON(m)))},[b,m]),(0,import_react$1.useEffect)(()=>{y&&F.current&&F.current.select()},[y]);let{fullHeight:W,stringifiedHeight:G,paddingLeftProp:K,numberOfLines:q}=V(),J=Array.from({length:q},(e,t)=>t+1).join(`
`);return(0,import_jsx_runtime$1.jsxs)(`div`,{className:(0,import_classnames.default)(Textarea_module_default.wrapper,t,{[Textarea_module_default.heightScale]:o,[Textarea_module_default.isFullHeight]:C,[Textarea_module_default.defaultHeight]:!o&&!C,[Textarea_module_default.isJSONField]:b&&x,[Textarea_module_default.copy]:x,[Textarea_module_default.scrollbar]:T}),style:{"--height-textarea":G,"--full-height":`${W}px`},onClick:H,children:[x?(0,import_jsx_runtime$1.jsx)(IconButton,{className:`${Textarea_module_default.copyIconWrapper} ${w||``}`,onClick:U,iconNode:(0,import_jsx_runtime$1.jsx)(ForwardRef,{}),size:16}):null,(0,import_jsx_runtime$1.jsxs)(Scrollbar,{className:(0,import_classnames.default)(e,{[Textarea_module_default.heightScale]:o,[Textarea_module_default.isFullHeight]:C,[Textarea_module_default.defaultHeight]:!o&&!C,[Textarea_module_default.hasError]:I||a,[Textarea_module_default.isDisabled]:r,[Textarea_module_default.scrollbar]:!T}),style:{...d,"--height-textarea":G,"--full-height":`${W}px`},"data-disabled":r,"data-error":I||a,"data-focus":R,children:[S?(0,import_jsx_runtime$1.jsx)(`pre`,{className:Textarea_module_default.numeration,style:h===13?{}:{fontSize:`${h}px`},children:J}):null,(0,import_jsx_runtime$1.jsx)(TextareaAutosize,{id:n,className:(0,import_classnames.default)(Textarea_module_default.textarea,{[Textarea_module_default.isJSONField]:b,[Textarea_module_default.hasError]:I||a}),placeholder:u,onChange:l,maxLength:s,name:c,tabIndex:p,"aria-label":A,"aria-labelledby":M,"aria-describedby":N,disabled:r,readOnly:i,value:b?B:m,style:{fontSize:`${h}px`,color:_,"--padding-inline-start":K},autoFocus:v,ref:F,dir:`auto`,"data-dir":P?`rtl`:void 0,"data-testid":E??`textarea`,onFocus:()=>z(!0),onBlur:()=>z(!1),onClick:e=>e.stopPropagation(),onKeyDown:D})]})]})};try{Textarea.displayName=`Textarea`,Textarea.__docgenInfo={description:``,displayName:`Textarea`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/textarea/Textarea.tsx`,methods:[],props:{className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Applied to the scrollbar around the textarea, not to the textarea itself.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},wrapperClassName:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Applied to the outer wrapper that carries the height and the copy icon.`,name:`wrapperClassName`,required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Used as HTML `id` property",name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},isDisabled:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Indicates that the field cannot be used`,name:`isDisabled`,required:!1,tags:{},type:{name:`boolean | undefined`}},isReadOnly:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Indicates that the field is displaying read-only content`,name:`isReadOnly`,required:!1,tags:{},type:{name:`boolean | undefined`}},hasError:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Draws the field in the error colour. Under `isJSONField` it adds to that\nmode's own error state rather than being replaced by it.",name:`hasError`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},heightScale:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Makes the field 65vh tall instead of the default 89px.`,name:`heightScale`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},maxLength:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Maximum number of characters the field accepts. Unlike `TextInput`, which\ncaps at 255, there is no limit unless you set one.",name:`maxLength`,required:!1,tags:{},type:{name:`number | undefined`}},name:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Used as HTML `name` property",name:`name`,required:!1,tags:{},type:{name:`string | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Sets a callback function that allows handling the component's changing events`,name:`onChange`,required:!1,tags:{},type:{name:`((e: ChangeEvent<HTMLTextAreaElement, Element>) => void) | undefined`}},onKeyDown:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Sets a callback function that allows handling the component's keyDown events`,name:`onKeyDown`,required:!1,tags:{},type:{name:`((e: KeyboardEvent<HTMLTextAreaElement>) => void) | undefined`}},placeholder:{defaultValue:{value:``},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Placeholder for Textarea`,name:`placeholder`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Accepts css style`,name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},tabIndex:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Used as HTML `tabindex` property. Left out, the field takes its natural\nplace in the tab order; pass `-1` only for a field the keyboard is meant to\nskip.",name:`tabIndex`,required:!1,tags:{},type:{name:`number | undefined`}},"aria-label":{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Accessible name of the field, for when no `<label>` points at it. Declared\nas a prop because this type is closed and accepts no arbitrary DOM\nattributes; `id` with a `<label for>` names the field just as well.",name:`aria-label`,required:!1,tags:{},type:{name:`string | undefined`}},"aria-labelledby":{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"`id` of the element that names this field — the usual choice when the\ncaption is already on screen, for instance a `FieldContainer` label given\nan `id` of its own.",name:`aria-labelledby`,required:!1,tags:{},type:{name:`string | undefined`}},"aria-describedby":{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"`id` of the element describing the field, such as a hint or an error line\nbelow it. Announced after the name.",name:`aria-describedby`,required:!1,tags:{},type:{name:`string | undefined`}},value:{defaultValue:{value:``},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"The text. The field is controlled, so pair it with `onChange`.",name:`value`,required:!1,tags:{default:`""`},type:{name:`string | undefined`}},fontSize:{defaultValue:{value:`13`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Font size in pixels, applied inline to the textarea and to the line
numbers.`,name:`fontSize`,required:!1,tags:{default:`13`},type:{name:`number | undefined`}},heightTextArea:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Fixed height, as a number of pixels or a CSS length. It wins over the\ndefault height but not over `heightScale` or `isFullHeight`.",name:`heightTextArea`,required:!1,tags:{},type:{name:`string | number | undefined`}},color:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Colour of the text, applied inline.`,name:`color`,required:!1,tags:{},type:{name:`string | undefined`}},autoFocus:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Default input property`,name:`autoFocus`,required:!1,tags:{},type:{name:`boolean | undefined`}},areaSelect:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Selects the whole text whenever this flips to true — for a field the user
is expected to copy from.`,name:`areaSelect`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},isJSONField:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Treats the value as JSON: pretty-prints it, and puts the field in the
error state whenever it is empty or not a JSON object or array, whatever
\`hasError\` says.`,name:`isJSONField`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},copyInfoText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Text of the toast shown after a successful copy. Without it the copy is
silent.`,name:`copyInfoText`,required:!1,tags:{},type:{name:`string | undefined`}},enableCopy:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Shows a copy button in the corner of the field.`,name:`enableCopy`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},hasNumeration:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Renders line numbers down the left edge and indents the text to make room
for them.`,name:`hasNumeration`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},isFullHeight:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Sizes the field to its content instead of scrolling inside a fixed
height.`,name:`isFullHeight`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},fullHeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Ignored. The component computes the full height itself and never reads
this prop.`,name:`fullHeight`,required:!1,tags:{},type:{name:`number | undefined`}},minHeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Ignored. Nothing in the component or its stylesheet reads this prop.`,name:`minHeight`,required:!1,tags:{},type:{name:`string | undefined`}},classNameCopyIcon:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Applied to the copy button, alongside the component's own class.`,name:`classNameCopyIcon`,required:!1,tags:{},type:{name:`string | undefined`}},paddingLeftProp:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Ignored. The indent for the line numbers is computed from the content.`,name:`paddingLeftProp`,required:!1,tags:{},type:{name:`string | undefined`}},isChatMode:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Moves the scrollbar styling from the inner scroller to the outer wrapper,
which is what a chat composer needs.`,name:`isChatMode`,required:!1,tags:{default:`false`},type:{name:`boolean | undefined`}},dataTestId:{defaultValue:{value:`"textarea"`},declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:"Value of `data-testid` on the textarea.",name:`dataTestId`,required:!1,tags:{default:`"textarea"`},type:{name:`string | undefined`}},onCopy:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/textarea/Textarea.types.ts`,name:`TypeLiteral`}],description:`Called with the copied text after the copy button is used.`,name:`onCopy`,required:!1,tags:{},type:{name:`((text: string) => void) | undefined`}}},tags:{}}}catch{}})))()}var import_react,import_jsx_runtime,meta,Wrapper,ControlledTextarea,Default,StatesTemplate,States,WithCopyTemplate,WithCopy,WithNumerationTemplate,WithNumeration,sampleJSON,brokenJSON,JSONFieldTemplate,JSONField,CustomHeightTemplate,CustomHeights,GrowsWithContentTemplate,GrowsWithContent,RightToLeftTemplate,RightToLeft,CssCustomization,__namedExportsOrder;function init_Textarea_stories(){return(init_Textarea_stories=__esmMin((()=>{import_react=require_react(),init_Toast(),init_Textarea(),import_jsx_runtime=require_jsx_runtime(),meta={title:`UI/Form controls/Textarea`,component:Textarea,parameters:{},argTypes:{value:{control:`text`,description:`Textarea value`,table:{defaultValue:{summary:`""`}}},placeholder:{control:`text`,description:`Placeholder text. Defaults to a single space so an empty field still counts as showing a placeholder, which the Firefox minimum-height rules rely on`,table:{defaultValue:{summary:`" "`}}},isDisabled:{control:`boolean`,description:`Disable the textarea`,table:{defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Make the textarea read-only`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Show error state`,table:{defaultValue:{summary:`false`}}},maxLength:{control:`number`,description:`Maximum character length`},heightTextArea:{control:`text`,description:`Custom height of the textarea`},fontSize:{control:`number`,description:`Font size in pixels`,table:{defaultValue:{summary:`13`}}},color:{control:`color`,description:`Text color`},enableCopy:{control:`boolean`,description:`Show copy icon`,table:{defaultValue:{summary:`false`}}},hasNumeration:{control:`boolean`,description:`Show line numbers`,table:{defaultValue:{summary:`false`}}},isJSONField:{control:`boolean`,description:`Pretty-prints the value as JSON and shows the error border while it is empty or not valid JSON; pair with hasNumeration for line numbers`,table:{defaultValue:{summary:`false`}}},heightScale:{control:`boolean`,description:`Makes the field 65% of the browser window height instead of a fixed height, so it stretches and shrinks with the window`,table:{defaultValue:{summary:`false`}}},isFullHeight:{control:`boolean`,description:`Makes the field exactly as tall as its text: every new line makes it taller and every removed line shorter, down to the 89px default height`,table:{defaultValue:{summary:`false`}}},copyInfoText:{control:`text`,description:`Text of the success toast shown after the copy button is clicked; without it no toast appears`},onCopy:{action:`onCopy`,description:`Called with the copied text after the copy button is clicked`},tabIndex:{control:`number`,description:`Tab order of the field; left out, the field takes its natural place in the Tab sequence, and -1 makes the keyboard skip it`},autoFocus:{control:`boolean`,description:`Focuses the field when it mounts`},areaSelect:{control:`boolean`,description:`Selects the whole text whenever it turns on, for a field the reader is expected to copy from`,table:{defaultValue:{summary:`false`}}},onChange:{description:`Called with the native change event on every edit; the stories wire it themselves to keep the field controlled`},onKeyDown:{action:`onKeyDown`,description:`Called with the native keyboard event on every key press`},isChatMode:{control:`boolean`,description:`Moves the border, background and state colors from the scroll container to the outer frame`,table:{defaultValue:{summary:`false`}}},id:{control:`text`,description:"HTML id of the textarea element, the target for `<label htmlFor>`"},name:{control:`text`,description:`HTML name of the textarea element for form submission`},className:{control:`text`,description:`Class added to the scroll container that carries the border`},wrapperClassName:{control:`text`,description:`Class added to the outer frame`},classNameCopyIcon:{control:`text`,description:`Class added to the copy button`},style:{control:`object`,description:`Inline styles applied to the scroll container that carries the border`},"aria-label":{control:`text`,description:"Accessible name of the field, for when no `<label>` points at it"},"aria-labelledby":{control:`text`,description:`id of the element on screen that names the field, such as a visible caption`},"aria-describedby":{control:`text`,description:`id of the element describing the field, such as a hint or an error line below it; announced after the name`},dataTestId:{control:`text`,description:`Value of data-testid on the textarea element`,table:{defaultValue:{summary:`"textarea"`}}}}},Wrapper=e=>(0,import_jsx_runtime.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gridGap:`16px`,alignItems:`start`},children:e.children}),ControlledTextarea=e=>{let{initialValue:t,...n}=e,[r,i]=(0,import_react.useState)(t||n.value||``);return(0,import_jsx_runtime.jsx)(Textarea,{...n,value:r,onChange:e=>i(e.target.value)})},Default={render:e=>(0,import_jsx_runtime.jsx)(ControlledTextarea,{...e}),args:{placeholder:`Enter text here`,isDisabled:!1,isReadOnly:!1,hasError:!1,heightTextArea:`150px`,value:``},parameters:{docs:{description:{story:"An empty field with a placeholder and a fixed height, the shape most forms start from (`placeholder`, `heightTextArea`); change any other prop live in the Controls panel below."},source:{code:`<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
  heightTextArea="150px"
/>`}}}},StatesTemplate=()=>(0,import_jsx_runtime.jsxs)(Wrapper,{children:[(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Normal textarea`,placeholder:`Normal`,heightTextArea:`100px`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Error state`,hasError:!0,heightTextArea:`100px`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Disabled textarea`,isDisabled:!0,heightTextArea:`100px`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Read-only textarea`,isReadOnly:!0,heightTextArea:`100px`})]}),States={render:()=>(0,import_jsx_runtime.jsx)(StatesTemplate,{}),parameters:{docs:{description:{story:"Four copies of the same field, one per state a form puts it in:\n\n- **Normal textarea** — the plain field\n- **Error state** — the red border a form shows after failed validation (`hasError`)\n- **Disabled textarea** — greyed out and unfocusable (`isDisabled`)\n- **Read-only textarea** — looks like the plain one but rejects typing (`isReadOnly`)"},source:{code:`<Textarea value="Normal textarea" />
<Textarea value="Error state" hasError />
<Textarea value="Disabled textarea" isDisabled />
<Textarea value="Read-only textarea" isReadOnly />`}}}},WithCopyTemplate=()=>(0,import_jsx_runtime.jsxs)(`div`,{style:{width:`400px`},children:[(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`This text can be copied using the copy button.`,enableCopy:!0,copyInfoText:`Text copied to clipboard!`,heightTextArea:`100px`}),(0,import_jsx_runtime.jsx)(Toast,{})]}),WithCopy={render:()=>(0,import_jsx_runtime.jsx)(WithCopyTemplate,{}),parameters:{docs:{description:{story:"The copy button in the corner puts the whole text on the clipboard and confirms it with a toast (`enableCopy`, `copyInfoText`); clicking the frame or the button also selects all the text. The toast renders only where a `Toast` container is mounted, so the story mounts one."},source:{code:`<Textarea
  value="This text can be copied"
  enableCopy
  copyInfoText="Text copied to clipboard!"
/>
<Toast />`}}}},WithNumerationTemplate=()=>(0,import_jsx_runtime.jsx)(`div`,{style:{width:`400px`},children:(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Line 1: First line of text
Line 2: Second line of text
Line 3: Third line of text
Line 4: Fourth line of text
Line 5: Fifth line of text`,hasNumeration:!0,heightTextArea:`150px`})}),WithNumeration={render:()=>(0,import_jsx_runtime.jsx)(WithNumerationTemplate,{}),parameters:{docs:{description:{story:"Line numbers beside the text for values read as code or configuration, so a reader can point to a line (`hasNumeration`)."},source:{code:`<Textarea
  value="Line 1\\nLine 2\\nLine 3"
  hasNumeration
/>`}}}},sampleJSON=JSON.stringify({title:`Quarterly report`,pages:12,tags:[`draft`,`shared`]},null,2),brokenJSON=`{"title": "Quarterly report", "pages": 12,`,JSONFieldTemplate=()=>(0,import_jsx_runtime.jsxs)(Wrapper,{children:[(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:sampleJSON,isJSONField:!0,hasNumeration:!0,heightTextArea:`200px`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:brokenJSON,isJSONField:!0,hasNumeration:!0,heightTextArea:`200px`})]}),JSONField={render:()=>(0,import_jsx_runtime.jsx)(JSONFieldTemplate,{}),parameters:{docs:{description:{story:"Two JSON fields, for values a reader edits as configuration:\n\n- **Left** — a valid object, pretty-printed with line numbers (`isJSONField`, `hasNumeration`)\n- **Right** — a truncated object, which keeps the red border until the text parses as JSON"},source:{code:`<Textarea
  value='{"title": "Quarterly report", "pages": 12}'
  isJSONField
  hasNumeration
/>
<Textarea value='{"title": "Quarterly report",' isJSONField hasNumeration />`}}}},CustomHeightTemplate=()=>(0,import_jsx_runtime.jsxs)(Wrapper,{children:[(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Small textarea`,heightTextArea:`80px`,placeholder:`80px height`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Medium textarea`,heightTextArea:`150px`,placeholder:`150px height`}),(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`Large textarea`,heightTextArea:`250px`,placeholder:`250px height`})]}),CustomHeights={render:()=>(0,import_jsx_runtime.jsx)(CustomHeightTemplate,{}),parameters:{docs:{description:{story:`Three heights of the same field, to pick the one that fits the surrounding form (\`heightTextArea\`):

- **Small textarea** — 80px
- **Medium textarea** — 150px
- **Large textarea** — 250px`},source:{code:`<Textarea value="Small" heightTextArea="80px" />
<Textarea value="Medium" heightTextArea="150px" />
<Textarea value="Large" heightTextArea="250px" />`}}}},GrowsWithContentTemplate=()=>(0,import_jsx_runtime.jsx)(`div`,{style:{width:`400px`},children:(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`First line
Second line
Third line
Fourth line
Fifth line
Sixth line`,isFullHeight:!0})}),GrowsWithContent={render:()=>(0,import_jsx_runtime.jsx)(GrowsWithContentTemplate,{}),parameters:{docs:{description:{story:"The frame is as tall as its text: add a line and it grows, delete one and it shrinks, never below the default height (`isFullHeight`)."},source:{code:`<Textarea value={value} onChange={handleChange} isFullHeight />`}}}},RightToLeftTemplate=()=>(0,import_jsx_runtime.jsx)(`div`,{dir:`rtl`,style:{width:`400px`},children:(0,import_jsx_runtime.jsx)(ControlledTextarea,{initialValue:`السطر الأول
السطر الثاني
السطر الثالث`,hasNumeration:!0,enableCopy:!0,heightTextArea:`120px`})}),RightToLeft={render:()=>(0,import_jsx_runtime.jsx)(RightToLeftTemplate,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`146px`},description:{story:'The same field under a right-to-left interface, mirroring the left-to-right layout: the line numbers move to the right edge, the copy button to the left one, and the text starts from the right. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <Textarea value={value} onChange={handleChange} hasNumeration enableCopy />
</div>`}}}},CssCustomization={render:()=>(0,import_jsx_runtime.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`,width:`300px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#c4b5fd`,"--text-input-border-hover":`#7c3aed`,"--text-input-border-focus":`#4c1d95`,"--text-input-color":`#4c1d95`,"--text-input-radius":`8px`,"--textarea-padding":`6px 12px 4px`,"--textarea-height-custom":`120px`,"--textarea-numeration-text-color":`#8b5cf6`},children:[(0,import_jsx_runtime.jsx)(Textarea,{value:`Custom styled textarea with CSS variables`,onChange:()=>{}}),(0,import_jsx_runtime.jsx)(Textarea,{value:`First line
Second line
Third line`,hasNumeration:!0,onChange:()=>{}})]}),parameters:{docs:{description:{story:"Nine of the variables set on one wrapper -- every one is listed under CSS variables on this page. The first field shows the shared `--text-input-*` tokens, the padding and the custom height; hover and focus it to see the two border variables. The second adds `hasNumeration`, the only state in which `--textarea-numeration-text-color` has anything to color."},source:{code:`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--textarea-padding": "6px 12px 4px",
      "--textarea-height-custom": "120px",
      "--textarea-numeration-text-color": "#8b5cf6",
    } as CSSProperties
  }
>
  <Textarea value="Custom styled textarea with CSS variables" onChange={() => {}} />
  <Textarea value={"First line\\nSecond line\\nThird line"} hasNumeration onChange={() => {}} />
</div>`}}}},__namedExportsOrder=[`Default`,`States`,`WithCopy`,`WithNumeration`,`JSONField`,`CustomHeights`,`GrowsWithContent`,`RightToLeft`,`CssCustomization`],Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:`{
  render: args => <ControlledTextarea {...args} />,
  args: {
    placeholder: "Enter text here",
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    heightTextArea: "150px",
    value: ""
  },
  parameters: {
    docs: {
      description: {
        story: "An empty field with a placeholder and a fixed height, the shape most forms start from (\`placeholder\`, \`heightTextArea\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
  heightTextArea="150px"
/>\`
      }
    }
  }
}`,...Default.parameters?.docs?.source}}},States.parameters={...States.parameters,docs:{...States.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Four copies of the same field, one per state a form puts it in:

- **Normal textarea** — the plain field
- **Error state** — the red border a form shows after failed validation (\\\`hasError\\\`)
- **Disabled textarea** — greyed out and unfocusable (\\\`isDisabled\\\`)
- **Read-only textarea** — looks like the plain one but rejects typing (\\\`isReadOnly\\\`)\`
      },
      source: {
        code: \`<Textarea value="Normal textarea" />
<Textarea value="Error state" hasError />
<Textarea value="Disabled textarea" isDisabled />
<Textarea value="Read-only textarea" isReadOnly />\`
      }
    }
  }
}`,...States.parameters?.docs?.source}}},WithCopy.parameters={...WithCopy.parameters,docs:{...WithCopy.parameters?.docs,source:{originalSource:`{
  render: () => <WithCopyTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The copy button in the corner puts the whole text on the clipboard and confirms it with a toast (\`enableCopy\`, \`copyInfoText\`); clicking the frame or the button also selects all the text. The toast renders only where a \`Toast\` container is mounted, so the story mounts one."
      },
      source: {
        code: \`<Textarea
  value="This text can be copied"
  enableCopy
  copyInfoText="Text copied to clipboard!"
/>
<Toast />\`
      }
    }
  }
}`,...WithCopy.parameters?.docs?.source}}},WithNumeration.parameters={...WithNumeration.parameters,docs:{...WithNumeration.parameters?.docs,source:{originalSource:`{
  render: () => <WithNumerationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Line numbers beside the text for values read as code or configuration, so a reader can point to a line (\`hasNumeration\`)."
      },
      source: {
        code: \`<Textarea
  value="Line 1\\\\nLine 2\\\\nLine 3"
  hasNumeration
/>\`
      }
    }
  }
}`,...WithNumeration.parameters?.docs?.source}}},JSONField.parameters={...JSONField.parameters,docs:{...JSONField.parameters?.docs,source:{originalSource:`{
  render: () => <JSONFieldTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Two JSON fields, for values a reader edits as configuration:

- **Left** — a valid object, pretty-printed with line numbers (\\\`isJSONField\\\`, \\\`hasNumeration\\\`)
- **Right** — a truncated object, which keeps the red border until the text parses as JSON\`
      },
      source: {
        code: \`<Textarea
  value='{"title": "Quarterly report", "pages": 12}'
  isJSONField
  hasNumeration
/>
<Textarea value='{"title": "Quarterly report",' isJSONField hasNumeration />\`
      }
    }
  }
}`,...JSONField.parameters?.docs?.source}}},CustomHeights.parameters={...CustomHeights.parameters,docs:{...CustomHeights.parameters?.docs,source:{originalSource:`{
  render: () => <CustomHeightTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Three heights of the same field, to pick the one that fits the surrounding form (\\\`heightTextArea\\\`):

- **Small textarea** — 80px
- **Medium textarea** — 150px
- **Large textarea** — 250px\`
      },
      source: {
        code: \`<Textarea value="Small" heightTextArea="80px" />
<Textarea value="Medium" heightTextArea="150px" />
<Textarea value="Large" heightTextArea="250px" />\`
      }
    }
  }
}`,...CustomHeights.parameters?.docs?.source}}},GrowsWithContent.parameters={...GrowsWithContent.parameters,docs:{...GrowsWithContent.parameters?.docs,source:{originalSource:`{
  render: () => <GrowsWithContentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The frame is as tall as its text: add a line and it grows, delete one and it shrinks, never below the default height (\`isFullHeight\`)."
      },
      source: {
        code: \`<Textarea value={value} onChange={handleChange} isFullHeight />\`
      }
    }
  }
}`,...GrowsWithContent.parameters?.docs?.source}}},RightToLeft.parameters={...RightToLeft.parameters,docs:{...RightToLeft.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "146px"
      },
      description: {
        story: 'The same field under a right-to-left interface, mirroring the left-to-right layout: the line numbers move to the right edge, the copy button to the left one, and the text starts from the right. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <Textarea value={value} onChange={handleChange} hasNumeration enableCopy />
</div>\`
      }
    }
  }
}`,...RightToLeft.parameters?.docs?.source}}},CssCustomization.parameters={...CssCustomization.parameters,docs:{...CssCustomization.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#c4b5fd",
    "--text-input-border-hover": "#7c3aed",
    "--text-input-border-focus": "#4c1d95",
    "--text-input-color": "#4c1d95",
    "--text-input-radius": "8px",
    "--textarea-padding": "6px 12px 4px",
    "--textarea-height-custom": "120px",
    "--textarea-numeration-text-color": "#8b5cf6"
  } as CSSProperties}>
      <Textarea value="Custom styled textarea with CSS variables" onChange={() => {}} />
      <Textarea value={"First line\\nSecond line\\nThird line"} hasNumeration onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Nine of the variables set on one wrapper -- every one is listed under CSS variables on this page. The first field shows the shared \\\`--text-input-*\\\` tokens, the padding and the custom height; hover and focus it to see the two border variables. The second adds \\\`hasNumeration\\\`, the only state in which \\\`--textarea-numeration-text-color\\\` has anything to color.\`
      },
      source: {
        code: \`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--textarea-padding": "6px 12px 4px",
      "--textarea-height-custom": "120px",
      "--textarea-numeration-text-color": "#8b5cf6",
    } as CSSProperties
  }
>
  <Textarea value="Custom styled textarea with CSS variables" onChange={() => {}} />
  <Textarea value={"First line\\\\nSecond line\\\\nThird line"} hasNumeration onChange={() => {}} />
</div>\`
      }
    }
  }
}`,...CssCustomization.parameters?.docs?.source}}}})))()}init_Textarea_stories();export{CssCustomization,CustomHeights,Default,GrowsWithContent,JSONField,RightToLeft,States,WithCopy,WithNumeration,__namedExportsOrder,meta as default};