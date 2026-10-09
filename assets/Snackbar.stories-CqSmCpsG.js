import{n as e,o as t,r as n,t as r}from"./rolldown-runtime-C0FnF6B9.js";import{t as i}from"./react-C21x__mS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{t as o}from"./classnames-CfLRLWYq.js";import{r as s,t as c}from"./text-Cz_cI6Yf.js";import{t as l}from"./prop-types-D9WxI36-.js";import{n as u,t as d}from"./danger.toast.react-CvA0daXC.js";import{n as f,t as p}from"./cross.react-BpjVHsQC.js";import{a as m,r as h,t as g}from"./heading-BgSzvZkA.js";import{n as _}from"./interop-default-DBxUGC2i.js";import{t as v}from"./client-Ch0uO0rn.js";var y=n({calcTimeDelta:()=>ae,default:()=>I,formatTimeDelta:()=>oe,zeroPad:()=>j});function b(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function x(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function S(e,t,n){return t&&x(e.prototype,t),n&&x(e,n),e}function C(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Super expression must either be null or a function`);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&T(e,t)}function w(e){return w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},w(e)}function T(e,t){return T=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},T(e,t)}function E(){if(typeof Reflect>`u`||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy==`function`)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function D(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function O(e,t){return t&&(typeof t==`object`||typeof t==`function`)?t:D(e)}function k(e){var t=E();return function(){var n=w(e),r;if(t){var i=w(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return O(this,r)}}function ee(e){return te(e)||ne(e)||re(e)||ie()}function te(e){if(Array.isArray(e))return A(e)}function ne(e){if(typeof Symbol<`u`&&Symbol.iterator in Object(e))return Array.from(e)}function re(e,t){if(e){if(typeof e==`string`)return A(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`)return Array.from(e);if(n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return A(e,t)}}function A(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function ie(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function j(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:2,n=String(e);if(t===0)return n;var r=n.match(/(.*?)([0-9]+)(.*)/),i=r?r[1]:``,a=r?r[3]:``,o=r?r[2]:n;return`${i}${o.length>=t?o:(ee(Array(t)).map(function(){return`0`}).join(``)+o).slice(t*-1)}${a}`}function ae(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.now,r=n===void 0?Date.now:n,i=t.precision,a=i===void 0?0:i,o=t.controlled,s=t.offsetTime,c=s===void 0?0:s,l=t.overtime,u=typeof e==`string`?new Date(e).getTime():e instanceof Date?e.getTime():e;o||(u+=c);var d=o?u:u-r(),f=Math.min(20,Math.max(0,a)),p=Math.round(parseFloat(((l?d:Math.max(0,d))/1e3).toFixed(f))*1e3),m=Math.abs(p)/1e3;return{total:p,days:Math.floor(m/86400),hours:Math.floor(m/3600%24),minutes:Math.floor(m/60%60),seconds:Math.floor(m%60),milliseconds:Number((m%1*1e3).toFixed()),completed:p<=0}}function oe(e,t){var n=e.days,r=e.hours,i=e.minutes,a=e.seconds,o=Object.assign(Object.assign({},P),t),s=o.daysInHours,c=o.zeroPadTime,l=o.zeroPadDays,u=l===void 0?c:l,d=Math.min(2,c),f=s?j(r+n*24,c):j(r,d);return{days:s?``:j(n,u),hours:f,minutes:j(i,d),seconds:j(a,d)}}var M,N,P,F,I;function se(){return(se=e((()=>{M=i(),N=l(),P={daysInHours:!1,zeroPadTime:2},F=function(e){C(n,e);var t=k(n);function n(){var e;return b(this,n),e=t.apply(this,arguments),e.state={count:e.props.count||3},e.startCountdown=function(){e.interval=window.setInterval(function(){e.state.count-1==0?(e.stopCountdown(),e.props.onComplete&&e.props.onComplete()):e.setState(function(e){return{count:e.count-1}})},1e3)},e.stopCountdown=function(){clearInterval(e.interval)},e.addTime=function(t){e.stopCountdown(),e.setState(function(e){return{count:e.count+t}},e.startCountdown)},e}return S(n,[{key:`componentDidMount`,value:function(){this.startCountdown()}},{key:`componentWillUnmount`,value:function(){clearInterval(this.interval)}},{key:`render`,value:function(){return this.props.children?(0,M.cloneElement)(this.props.children,{count:this.state.count}):null}}]),n}(M.Component),F.propTypes={count:N.number,children:N.element,onComplete:N.func},I=function(e){C(n,e);var t=k(n);function n(e){var r;if(b(this,n),r=t.call(this,e),r.mounted=!1,r.initialTimestamp=r.calcOffsetStartTimestamp(),r.offsetStartTimestamp=r.props.autoStart?0:r.initialTimestamp,r.offsetTime=0,r.legacyMode=!1,r.legacyCountdownRef=null,r.tick=function(){var e=r.calcTimeDelta(),t=e.completed&&!r.props.overtime?void 0:r.props.onTick;r.setTimeDeltaState(e,void 0,t)},r.setLegacyCountdownRef=function(e){r.legacyCountdownRef=e},r.start=function(){if(!r.isStarted()){var e=r.offsetStartTimestamp;r.offsetStartTimestamp=0,r.offsetTime+=e?r.calcOffsetStartTimestamp()-e:0;var t=r.calcTimeDelta();r.setTimeDeltaState(t,`STARTED`,r.props.onStart),!r.props.controlled&&(!t.completed||r.props.overtime)&&(r.clearTimer(),r.interval=window.setInterval(r.tick,r.props.intervalDelay))}},r.pause=function(){r.isPaused()||(r.clearTimer(),r.offsetStartTimestamp=r.calcOffsetStartTimestamp(),r.setTimeDeltaState(r.state.timeDelta,`PAUSED`,r.props.onPause))},r.stop=function(){r.isStopped()||(r.clearTimer(),r.offsetStartTimestamp=r.calcOffsetStartTimestamp(),r.offsetTime=r.offsetStartTimestamp-r.initialTimestamp,r.setTimeDeltaState(r.calcTimeDelta(),`STOPPED`,r.props.onStop))},r.isStarted=function(){return r.isStatus(`STARTED`)},r.isPaused=function(){return r.isStatus(`PAUSED`)},r.isStopped=function(){return r.isStatus(`STOPPED`)},r.isCompleted=function(){return r.isStatus(`COMPLETED`)},e.date){var i=r.calcTimeDelta();r.state={timeDelta:i,status:i.completed?`COMPLETED`:`STOPPED`}}else r.legacyMode=!0;return r}return S(n,[{key:`componentDidMount`,value:function(){this.legacyMode||(this.mounted=!0,this.props.onMount&&this.props.onMount(this.calcTimeDelta()),this.props.autoStart&&this.start())}},{key:`componentDidUpdate`,value:function(e){this.legacyMode||this.props.date!==e.date&&(this.initialTimestamp=this.calcOffsetStartTimestamp(),this.offsetStartTimestamp=this.initialTimestamp,this.offsetTime=0,this.setTimeDeltaState(this.calcTimeDelta()))}},{key:`componentWillUnmount`,value:function(){this.legacyMode||(this.mounted=!1,this.clearTimer())}},{key:`calcTimeDelta`,value:function(){var e=this.props,t=e.date,n=e.now,r=e.precision,i=e.controlled,a=e.overtime;return ae(t,{now:n,precision:r,controlled:i,offsetTime:this.offsetTime,overtime:a})}},{key:`calcOffsetStartTimestamp`,value:function(){return Date.now()}},{key:`addTime`,value:function(e){this.legacyCountdownRef.addTime(e)}},{key:`clearTimer`,value:function(){window.clearInterval(this.interval)}},{key:`isStatus`,value:function(e){return this.state.status===e}},{key:`setTimeDeltaState`,value:function(e,t,n){var r=this;if(this.mounted){var i=e.completed&&!this.state.timeDelta.completed,a=e.completed&&t===`STARTED`;return i&&!this.props.overtime&&this.clearTimer(),this.setState(function(n){var i=t||n.status;return e.completed&&!r.props.overtime?i=`COMPLETED`:!t&&i===`COMPLETED`&&(i=`STOPPED`),{timeDelta:e,status:i}},function(){n&&n(r.state.timeDelta),r.props.onComplete&&(i||a)&&r.props.onComplete(e,a)})}}},{key:`getApi`,value:function(){return this.api=this.api||{start:this.start,pause:this.pause,stop:this.stop,isStarted:this.isStarted,isPaused:this.isPaused,isStopped:this.isStopped,isCompleted:this.isCompleted}}},{key:`getRenderProps`,value:function(){var e=this.props,t=e.daysInHours,n=e.zeroPadTime,r=e.zeroPadDays,i=this.state.timeDelta;return Object.assign(Object.assign({},i),{api:this.getApi(),props:this.props,formatted:oe(i,{daysInHours:t,zeroPadTime:n,zeroPadDays:r})})}},{key:`render`,value:function(){if(this.legacyMode){var e=this.props,t=e.count,n=e.children,r=e.onComplete;return(0,M.createElement)(F,{ref:this.setLegacyCountdownRef,count:t,onComplete:r},n)}var i=this.props,a=i.className,o=i.overtime,s=i.children,c=i.renderer,l=this.getRenderProps();if(c)return c(l);if(s&&this.state.timeDelta.completed&&!o)return(0,M.cloneElement)(s,{countdown:l});var u=l.formatted,d=u.days,f=u.hours,p=u.minutes,m=u.seconds;return(0,M.createElement)(`span`,{className:a},l.total<0?`-`:``,d,d?`:`:``,f,`:`,p,`:`,m)}}]),n}(M.Component),I.defaultProps=Object.assign(Object.assign({},P),{controlled:!1,intervalDelay:1e3,precision:0,autoStart:!0}),I.propTypes={date:(0,N.oneOfType)([(0,N.instanceOf)(Date),N.string,N.number]),daysInHours:N.bool,zeroPadTime:N.number,zeroPadDays:N.number,controlled:N.bool,intervalDelay:N.number,precision:N.number,autoStart:N.bool,overtime:N.bool,className:N.string,children:N.element,renderer:N.func,now:N.func,onMount:N.func,onStart:N.func,onPause:N.func,onStop:N.func,onTick:N.func,onComplete:N.func}})))()}var ce=r((e=>{function t(){var e={};return e[`align-content`]=!1,e[`align-items`]=!1,e[`align-self`]=!1,e[`alignment-adjust`]=!1,e[`alignment-baseline`]=!1,e.all=!1,e[`anchor-point`]=!1,e.animation=!1,e[`animation-delay`]=!1,e[`animation-direction`]=!1,e[`animation-duration`]=!1,e[`animation-fill-mode`]=!1,e[`animation-iteration-count`]=!1,e[`animation-name`]=!1,e[`animation-play-state`]=!1,e[`animation-timing-function`]=!1,e.azimuth=!1,e[`backface-visibility`]=!1,e.background=!0,e[`background-attachment`]=!0,e[`background-clip`]=!0,e[`background-color`]=!0,e[`background-image`]=!0,e[`background-origin`]=!0,e[`background-position`]=!0,e[`background-repeat`]=!0,e[`background-size`]=!0,e[`baseline-shift`]=!1,e.binding=!1,e.bleed=!1,e[`bookmark-label`]=!1,e[`bookmark-level`]=!1,e[`bookmark-state`]=!1,e.border=!0,e[`border-bottom`]=!0,e[`border-bottom-color`]=!0,e[`border-bottom-left-radius`]=!0,e[`border-bottom-right-radius`]=!0,e[`border-bottom-style`]=!0,e[`border-bottom-width`]=!0,e[`border-collapse`]=!0,e[`border-color`]=!0,e[`border-image`]=!0,e[`border-image-outset`]=!0,e[`border-image-repeat`]=!0,e[`border-image-slice`]=!0,e[`border-image-source`]=!0,e[`border-image-width`]=!0,e[`border-left`]=!0,e[`border-left-color`]=!0,e[`border-left-style`]=!0,e[`border-left-width`]=!0,e[`border-radius`]=!0,e[`border-right`]=!0,e[`border-right-color`]=!0,e[`border-right-style`]=!0,e[`border-right-width`]=!0,e[`border-spacing`]=!0,e[`border-style`]=!0,e[`border-top`]=!0,e[`border-top-color`]=!0,e[`border-top-left-radius`]=!0,e[`border-top-right-radius`]=!0,e[`border-top-style`]=!0,e[`border-top-width`]=!0,e[`border-width`]=!0,e.bottom=!1,e[`box-decoration-break`]=!0,e[`box-shadow`]=!0,e[`box-sizing`]=!0,e[`box-snap`]=!0,e[`box-suppress`]=!0,e[`break-after`]=!0,e[`break-before`]=!0,e[`break-inside`]=!0,e[`caption-side`]=!1,e.chains=!1,e.clear=!0,e.clip=!1,e[`clip-path`]=!1,e[`clip-rule`]=!1,e.color=!0,e[`color-interpolation-filters`]=!0,e[`column-count`]=!1,e[`column-fill`]=!1,e[`column-gap`]=!1,e[`column-rule`]=!1,e[`column-rule-color`]=!1,e[`column-rule-style`]=!1,e[`column-rule-width`]=!1,e[`column-span`]=!1,e[`column-width`]=!1,e.columns=!1,e.contain=!1,e.content=!1,e[`counter-increment`]=!1,e[`counter-reset`]=!1,e[`counter-set`]=!1,e.crop=!1,e.cue=!1,e[`cue-after`]=!1,e[`cue-before`]=!1,e.cursor=!1,e.direction=!1,e.display=!0,e[`display-inside`]=!0,e[`display-list`]=!0,e[`display-outside`]=!0,e[`dominant-baseline`]=!1,e.elevation=!1,e[`empty-cells`]=!1,e.filter=!1,e.flex=!1,e[`flex-basis`]=!1,e[`flex-direction`]=!1,e[`flex-flow`]=!1,e[`flex-grow`]=!1,e[`flex-shrink`]=!1,e[`flex-wrap`]=!1,e.float=!1,e[`float-offset`]=!1,e[`flood-color`]=!1,e[`flood-opacity`]=!1,e[`flow-from`]=!1,e[`flow-into`]=!1,e.font=!0,e[`font-family`]=!0,e[`font-feature-settings`]=!0,e[`font-kerning`]=!0,e[`font-language-override`]=!0,e[`font-size`]=!0,e[`font-size-adjust`]=!0,e[`font-stretch`]=!0,e[`font-style`]=!0,e[`font-synthesis`]=!0,e[`font-variant`]=!0,e[`font-variant-alternates`]=!0,e[`font-variant-caps`]=!0,e[`font-variant-east-asian`]=!0,e[`font-variant-ligatures`]=!0,e[`font-variant-numeric`]=!0,e[`font-variant-position`]=!0,e[`font-weight`]=!0,e.grid=!1,e[`grid-area`]=!1,e[`grid-auto-columns`]=!1,e[`grid-auto-flow`]=!1,e[`grid-auto-rows`]=!1,e[`grid-column`]=!1,e[`grid-column-end`]=!1,e[`grid-column-start`]=!1,e[`grid-row`]=!1,e[`grid-row-end`]=!1,e[`grid-row-start`]=!1,e[`grid-template`]=!1,e[`grid-template-areas`]=!1,e[`grid-template-columns`]=!1,e[`grid-template-rows`]=!1,e[`hanging-punctuation`]=!1,e.height=!0,e.hyphens=!1,e.icon=!1,e[`image-orientation`]=!1,e[`image-resolution`]=!1,e[`ime-mode`]=!1,e[`initial-letters`]=!1,e[`inline-box-align`]=!1,e[`justify-content`]=!1,e[`justify-items`]=!1,e[`justify-self`]=!1,e.left=!1,e[`letter-spacing`]=!0,e[`lighting-color`]=!0,e[`line-box-contain`]=!1,e[`line-break`]=!1,e[`line-grid`]=!1,e[`line-height`]=!1,e[`line-snap`]=!1,e[`line-stacking`]=!1,e[`line-stacking-ruby`]=!1,e[`line-stacking-shift`]=!1,e[`line-stacking-strategy`]=!1,e[`list-style`]=!0,e[`list-style-image`]=!0,e[`list-style-position`]=!0,e[`list-style-type`]=!0,e.margin=!0,e[`margin-bottom`]=!0,e[`margin-left`]=!0,e[`margin-right`]=!0,e[`margin-top`]=!0,e[`marker-offset`]=!1,e[`marker-side`]=!1,e.marks=!1,e.mask=!1,e[`mask-box`]=!1,e[`mask-box-outset`]=!1,e[`mask-box-repeat`]=!1,e[`mask-box-slice`]=!1,e[`mask-box-source`]=!1,e[`mask-box-width`]=!1,e[`mask-clip`]=!1,e[`mask-image`]=!1,e[`mask-origin`]=!1,e[`mask-position`]=!1,e[`mask-repeat`]=!1,e[`mask-size`]=!1,e[`mask-source-type`]=!1,e[`mask-type`]=!1,e[`max-height`]=!0,e[`max-lines`]=!1,e[`max-width`]=!0,e[`min-height`]=!0,e[`min-width`]=!0,e[`move-to`]=!1,e[`nav-down`]=!1,e[`nav-index`]=!1,e[`nav-left`]=!1,e[`nav-right`]=!1,e[`nav-up`]=!1,e[`object-fit`]=!1,e[`object-position`]=!1,e.opacity=!1,e.order=!1,e.orphans=!1,e.outline=!1,e[`outline-color`]=!1,e[`outline-offset`]=!1,e[`outline-style`]=!1,e[`outline-width`]=!1,e.overflow=!1,e[`overflow-wrap`]=!1,e[`overflow-x`]=!1,e[`overflow-y`]=!1,e.padding=!0,e[`padding-bottom`]=!0,e[`padding-left`]=!0,e[`padding-right`]=!0,e[`padding-top`]=!0,e.page=!1,e[`page-break-after`]=!1,e[`page-break-before`]=!1,e[`page-break-inside`]=!1,e[`page-policy`]=!1,e.pause=!1,e[`pause-after`]=!1,e[`pause-before`]=!1,e.perspective=!1,e[`perspective-origin`]=!1,e.pitch=!1,e[`pitch-range`]=!1,e[`play-during`]=!1,e.position=!1,e[`presentation-level`]=!1,e.quotes=!1,e[`region-fragment`]=!1,e.resize=!1,e.rest=!1,e[`rest-after`]=!1,e[`rest-before`]=!1,e.richness=!1,e.right=!1,e.rotation=!1,e[`rotation-point`]=!1,e[`ruby-align`]=!1,e[`ruby-merge`]=!1,e[`ruby-position`]=!1,e[`shape-image-threshold`]=!1,e[`shape-outside`]=!1,e[`shape-margin`]=!1,e.size=!1,e.speak=!1,e[`speak-as`]=!1,e[`speak-header`]=!1,e[`speak-numeral`]=!1,e[`speak-punctuation`]=!1,e[`speech-rate`]=!1,e.stress=!1,e[`string-set`]=!1,e[`tab-size`]=!1,e[`table-layout`]=!1,e[`text-align`]=!0,e[`text-align-last`]=!0,e[`text-combine-upright`]=!0,e[`text-decoration`]=!0,e[`text-decoration-color`]=!0,e[`text-decoration-line`]=!0,e[`text-decoration-skip`]=!0,e[`text-decoration-style`]=!0,e[`text-emphasis`]=!0,e[`text-emphasis-color`]=!0,e[`text-emphasis-position`]=!0,e[`text-emphasis-style`]=!0,e[`text-height`]=!0,e[`text-indent`]=!0,e[`text-justify`]=!0,e[`text-orientation`]=!0,e[`text-overflow`]=!0,e[`text-shadow`]=!0,e[`text-space-collapse`]=!0,e[`text-transform`]=!0,e[`text-underline-position`]=!0,e[`text-wrap`]=!0,e.top=!1,e.transform=!1,e[`transform-origin`]=!1,e[`transform-style`]=!1,e.transition=!1,e[`transition-delay`]=!1,e[`transition-duration`]=!1,e[`transition-property`]=!1,e[`transition-timing-function`]=!1,e[`unicode-bidi`]=!1,e[`vertical-align`]=!1,e.visibility=!1,e[`voice-balance`]=!1,e[`voice-duration`]=!1,e[`voice-family`]=!1,e[`voice-pitch`]=!1,e[`voice-range`]=!1,e[`voice-rate`]=!1,e[`voice-stress`]=!1,e[`voice-volume`]=!1,e.volume=!1,e[`white-space`]=!1,e.widows=!1,e.width=!0,e[`will-change`]=!1,e[`word-break`]=!0,e[`word-spacing`]=!0,e[`word-wrap`]=!0,e[`wrap-flow`]=!1,e[`wrap-through`]=!1,e[`writing-mode`]=!1,e[`z-index`]=!1,e}function n(e,t,n){}function r(e,t,n){}var i=/javascript\s*\:/gim;function a(e,t){return i.test(t)?``:t}e.whiteList=t(),e.getDefaultWhiteList=t,e.onAttr=n,e.onIgnoreAttr=r,e.safeAttrValue=a})),le=r(((e,t)=>{t.exports={indexOf:function(e,t){var n,r;if(Array.prototype.indexOf)return e.indexOf(t);for(n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},forEach:function(e,t,n){var r,i;if(Array.prototype.forEach)return e.forEach(t,n);for(r=0,i=e.length;r<i;r++)t.call(n,e[r],r,e)},trim:function(e){return String.prototype.trim?e.trim():e.replace(/(^\s*)|(\s*$)/g,``)},trimRight:function(e){return String.prototype.trimRight?e.trimRight():e.replace(/(\s*$)/g,``)}}})),ue=r(((e,t)=>{var n=le();function r(e,t){e=n.trimRight(e),e[e.length-1]!==`;`&&(e+=`;`);var r=e.length,i=!1,a=0,o=0,s=``;function c(){if(!i){var r=n.trim(e.slice(a,o)),c=r.indexOf(`:`);if(c!==-1){var l=n.trim(r.slice(0,c)),u=n.trim(r.slice(c+1));if(l){var d=t(a,s.length,l,u,r);d&&(s+=d+`; `)}}}a=o+1}for(;o<r;o++){var l=e[o];if(l===`/`&&e[o+1]===`*`){var u=e.indexOf(`*/`,o+2);if(u===-1)break;o=u+1,a=o+1,i=!1}else l===`(`?i=!0:l===`)`?i=!1:l===`;`?i||c():l===`
`&&c()}return n.trim(s)}t.exports=r})),de=r(((e,t)=>{var n=ce(),r=ue();le();function i(e){return e==null}function a(e){var t={};for(var n in e)t[n]=e[n];return t}function o(e){e=a(e||{}),e.whiteList=e.whiteList||n.whiteList,e.onAttr=e.onAttr||n.onAttr,e.onIgnoreAttr=e.onIgnoreAttr||n.onIgnoreAttr,e.safeAttrValue=e.safeAttrValue||n.safeAttrValue,this.options=e}o.prototype.process=function(e){if(e||=``,e=e.toString(),!e)return``;var t=this.options,n=t.whiteList,a=t.onAttr,o=t.onIgnoreAttr,s=t.safeAttrValue;return r(e,function(e,t,r,c,l){var u=n[r],d=!1;if(u===!0?d=u:typeof u==`function`?d=u(c):u instanceof RegExp&&(d=u.test(c)),d!==!0&&(d=!1),c=s(r,c),c){var f={position:t,sourcePosition:e,source:l,isWhite:d};if(d){var p=a(r,c,f);return i(p)?r+`:`+c:p}var p=o(r,c,f);if(!i(p))return p}})},t.exports=o})),L=r(((e,t)=>{var n=ce(),r=de();function i(e,t){return new r(t).process(e)}for(var a in e=t.exports=i,e.FilterCSS=r,n)e[a]=n[a];typeof window<`u`&&(window.filterCSS=t.exports)})),R=r(((e,t)=>{t.exports={indexOf:function(e,t){var n,r;if(Array.prototype.indexOf)return e.indexOf(t);for(n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},forEach:function(e,t,n){var r,i;if(Array.prototype.forEach)return e.forEach(t,n);for(r=0,i=e.length;r<i;r++)t.call(n,e[r],r,e)},trim:function(e){return String.prototype.trim?e.trim():e.replace(/(^\s*)|(\s*$)/g,``)},spaceIndex:function(e){var t=/\s|\n|\t/.exec(e);return t?t.index:-1}}})),fe=r((e=>{var t=L().FilterCSS,n=L().getDefaultWhiteList,r=R();function i(){return{a:[`target`,`href`,`title`],abbr:[`title`],address:[],area:[`shape`,`coords`,`href`,`alt`],article:[],aside:[],audio:[`autoplay`,`controls`,`crossorigin`,`loop`,`muted`,`preload`,`src`],b:[],bdi:[`dir`],bdo:[`dir`],big:[],blockquote:[`cite`],br:[],caption:[],center:[],cite:[],code:[],col:[`align`,`valign`,`span`,`width`],colgroup:[`align`,`valign`,`span`,`width`],dd:[],del:[`datetime`],details:[`open`],div:[],dl:[],dt:[],em:[],figcaption:[],figure:[],font:[`color`,`size`,`face`],footer:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],header:[],hr:[],i:[],img:[`src`,`alt`,`title`,`width`,`height`,`loading`],ins:[`datetime`],kbd:[],li:[],mark:[],nav:[],ol:[],p:[],pre:[],s:[],section:[],small:[],span:[],sub:[],summary:[],sup:[],strong:[],strike:[],table:[`width`,`border`,`align`,`valign`],tbody:[`align`,`valign`],td:[`width`,`rowspan`,`colspan`,`align`,`valign`],tfoot:[`align`,`valign`],th:[`width`,`rowspan`,`colspan`,`align`,`valign`],thead:[`align`,`valign`],tr:[`rowspan`,`align`,`valign`],tt:[],u:[],ul:[],video:[`autoplay`,`controls`,`crossorigin`,`loop`,`muted`,`playsinline`,`poster`,`preload`,`src`,`height`,`width`]}}var a=new t;function o(e,t,n){}function s(e,t,n){}function c(e,t,n){}function l(e,t,n){}function u(e){return e.replace(f,`&lt;`).replace(p,`&gt;`)}function d(e,t,n,i){if(n=D(n),t===`href`||t===`src`){if(n=r.trim(n),n===`#`)return`#`;if(n.substr(0,7)!==`http://`&&n.substr(0,8)!==`https://`&&n.substr(0,7)!==`mailto:`&&n.substr(0,4)!==`tel:`&&n.substr(0,11)!==`data:image/`&&n.substr(0,6)!==`ftp://`&&n.substr(0,2)!==`./`&&n.substr(0,3)!==`../`&&n[0]!==`#`&&n[0]!==`/`)return``}else if(t===`background`){if(y.lastIndex=0,y.test(n))return``}else if(t===`style`){if(b.lastIndex=0,b.test(n)||(x.lastIndex=0,x.test(n)&&(y.lastIndex=0,y.test(n))))return``;i!==!1&&(i||=a,n=i.process(n))}return n=O(n),n}var f=/</g,p=/>/g,m=/"/g,h=/&quot;/g,g=/&#([a-zA-Z0-9]*);?/gim,_=/&colon;?/gim,v=/&newline;?/gim,y=/((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,b=/e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,x=/u\s*r\s*l\s*\(.*/gi;function S(e){return e.replace(m,`&quot;`)}function C(e){return e.replace(h,`"`)}function w(e){return e.replace(g,function(e,t){return t[0]===`x`||t[0]===`X`?String.fromCharCode(parseInt(t.substr(1),16)):String.fromCharCode(parseInt(t,10))})}function T(e){return e.replace(_,`:`).replace(v,` `)}function E(e){for(var t=``,n=0,i=e.length;n<i;n++)t+=e.charCodeAt(n)<32?` `:e.charAt(n);return r.trim(t)}function D(e){return e=C(e),e=w(e),e=T(e),e=E(e),e}function O(e){return e=S(e),e=u(e),e}function k(){return``}function ee(e,t){typeof t!=`function`&&(t=function(){});var n=!Array.isArray(e);function i(t){return n?!0:r.indexOf(e,t)!==-1}var a=[],o=!1;return{onIgnoreTag:function(e,n,r){if(i(e)){if(r.isClosing){var s=`[/removed]`,c=r.position+s.length;return a.push([o===!1?r.position:o,c]),o=!1,s}return o||=r.position,`[removed]`}return t(e,n,r)},remove:function(e){var t=``,n=0;return r.forEach(a,function(r){t+=e.slice(n,r[0]),n=r[1]}),t+=e.slice(n),t}}}function te(e){for(var t=``,n=0;n<e.length;){var r=e.indexOf(`<!--`,n);if(r===-1){t+=e.slice(n);break}t+=e.slice(n,r);var i=e.indexOf(`-->`,r);if(i===-1)break;n=i+3}return t}function ne(e){var t=e.split(``);return t=t.filter(function(e){var t=e.charCodeAt(0);return t===127?!1:t<=31?t===10||t===13:!0}),t.join(``)}e.whiteList=i(),e.getDefaultWhiteList=i,e.onTag=o,e.onIgnoreTag=s,e.onTagAttr=c,e.onIgnoreTagAttr=l,e.safeAttrValue=d,e.escapeHtml=u,e.escapeQuote=S,e.unescapeQuote=C,e.escapeHtmlEntities=w,e.escapeDangerHtml5Entities=T,e.clearNonPrintableCharacter=E,e.friendlyAttrValue=D,e.escapeAttrValue=O,e.onIgnoreTagStripAll=k,e.StripTagBody=ee,e.stripCommentTag=te,e.stripBlankChar=ne,e.attributeWrapSign=`"`,e.cssFilter=a,e.getDefaultCSSWhiteList=n})),pe=r((e=>{var t=R();function n(e){var n=t.spaceIndex(e),r=n===-1?e.slice(1,-1):e.slice(1,n+1);return r=t.trim(r).toLowerCase(),r.slice(0,1)===`/`&&(r=r.slice(1)),r.slice(-1)===`/`&&(r=r.slice(0,-1)),r}function r(e){return e.slice(0,2)===`</`}function i(e,t,i){var a=``,o=0,s=!1,c=!1,l=0,u=e.length,d=``,f=``;chariterator:for(l=0;l<u;l++){var p=e.charAt(l);if(s===!1){if(p===`<`){s=l;continue}}else if(c===!1){if(p===`<`){a+=i(e.slice(o,l)),s=l,o=l;continue}if(p===`>`||l===u-1){a+=i(e.slice(o,s)),f=e.slice(s,l+1),d=n(f),a+=t(s,a.length,d,f,r(f)),o=l+1,s=!1;continue}if(p===`"`||p===`'`)for(var m=1,h=e.charAt(l-m);h.trim()===``||h===`=`;){if(h===`=`){c=p;continue chariterator}h=e.charAt(l-++m)}}else if(p===c){c=!1;continue}}return o<u&&(a+=i(e.substr(o))),a}var a=/[^a-zA-Z0-9\\_:.-]/gim;function o(e,n){var r=0,i=0,o=[],u=!1,f=e.length;function p(e,r){if(e=t.trim(e),e=e.replace(a,``).toLowerCase(),!(e.length<1)){var i=n(e,r||``);i&&o.push(i)}}for(var m=0;m<f;m++){var h=e.charAt(m),g,_;if(u===!1&&h===`=`){u=e.slice(r,m),r=m+1,i=e.charAt(r)===`"`||e.charAt(r)===`'`?r:c(e,m+1);continue}if(u!==!1&&m===i){if(_=e.indexOf(h,m+1),_===-1)break;g=t.trim(e.slice(i+1,_)),p(u,g),u=!1,m=_,r=m+1;continue}if(/\s|\n|\t/.test(h)){if(e=e.replace(/\s|\n|\t/g,` `),u===!1){if(_=s(e,m),_===-1){g=t.trim(e.slice(r,m)),p(g),u=!1,r=m+1;continue}m=_-1;continue}if(_=l(e,m-1),_===-1){g=t.trim(e.slice(r,m)),g=d(g),p(u,g),u=!1,r=m+1;continue}continue}}return r<e.length&&(u===!1?p(e.slice(r)):p(u,d(t.trim(e.slice(r))))),t.trim(o.join(` `))}function s(e,t){for(;t<e.length;t++){var n=e[t];if(n!==` `)return n===`=`?t:-1}}function c(e,t){for(;t<e.length;t++){var n=e[t];if(n!==` `)return n===`'`||n===`"`?t:-1}}function l(e,t){for(;t>0;t--){var n=e[t];if(n!==` `)return n===`=`?t:-1}}function u(e){return e[0]===`"`&&e[e.length-1]===`"`||e[0]===`'`&&e[e.length-1]===`'`}function d(e){return u(e)?e.substr(1,e.length-2):e}e.parseTag=i,e.parseAttr=o})),me=r(((e,t)=>{var n=L().FilterCSS,r=fe(),i=pe(),a=i.parseTag,o=i.parseAttr,s=R();function c(e){return e==null}function l(e){var t=s.spaceIndex(e);if(t===-1)return{html:``,closing:e[e.length-2]===`/`};e=s.trim(e.slice(t+1,-1));var n=e[e.length-1]===`/`;return n&&(e=s.trim(e.slice(0,-1))),{html:e,closing:n}}function u(e){var t={};for(var n in e)t[n]=e[n];return t}function d(e){var t={};for(var n in e)Array.isArray(e[n])?t[n.toLowerCase()]=e[n].map(function(e){return e.toLowerCase()}):t[n.toLowerCase()]=e[n];return t}function f(e){e=u(e||{}),e.stripIgnoreTag&&(e.onIgnoreTag&&console.error(`Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time`),e.onIgnoreTag=r.onIgnoreTagStripAll),e.whiteList||e.allowList?e.whiteList=d(e.whiteList||e.allowList):e.whiteList=r.whiteList,this.attributeWrapSign=e.singleQuotedAttributeValue===!0?`'`:r.attributeWrapSign,e.onTag=e.onTag||r.onTag,e.onTagAttr=e.onTagAttr||r.onTagAttr,e.onIgnoreTag=e.onIgnoreTag||r.onIgnoreTag,e.onIgnoreTagAttr=e.onIgnoreTagAttr||r.onIgnoreTagAttr,e.safeAttrValue=e.safeAttrValue||r.safeAttrValue,e.escapeHtml=e.escapeHtml||r.escapeHtml,this.options=e,e.css===!1?this.cssFilter=!1:(e.css=e.css||{},this.cssFilter=new n(e.css))}f.prototype.process=function(e){if(e||=``,e=e.toString(),!e)return``;var t=this,n=t.options,i=n.whiteList,u=n.onTag,d=n.onIgnoreTag,f=n.onTagAttr,p=n.onIgnoreTagAttr,m=n.safeAttrValue,h=n.escapeHtml,g=t.attributeWrapSign,_=t.cssFilter;n.stripBlankChar&&(e=r.stripBlankChar(e)),n.allowCommentTag||(e=r.stripCommentTag(e));var v=!1;n.stripIgnoreTagBody&&(v=r.StripTagBody(n.stripIgnoreTagBody,d),d=v.onIgnoreTag);var y=a(e,function(e,t,n,r,a){var v={sourcePosition:e,position:t,isClosing:a,isWhite:Object.prototype.hasOwnProperty.call(i,n)},y=u(n,r,v);if(!c(y))return y;if(v.isWhite){if(v.isClosing)return`</`+n+`>`;var b=l(r),x=i[n],S=o(b.html,function(e,t){var r=s.indexOf(x,e)!==-1,i=f(n,e,t,r);return c(i)?r?(t=m(n,e,t,_),t?e+`=`+g+t+g:e):(i=p(n,e,t,r),c(i)?void 0:i):i});return r=`<`+n,S&&(r+=` `+S),b.closing&&(r+=` /`),r+=`>`,r}return y=d(n,r,v),c(y)?h(r):y},h);return v&&(y=v.remove(y)),y},t.exports=f})),he=r(((e,t)=>{var n=fe(),r=pe(),i=me();function a(e,t){return new i(t).process(e)}e=t.exports=a,e.filterXSS=a,e.FilterXSS=i,(function(){for(var t in n)e[t]=n[t];for(var i in r)e[i]=r[i]})(),typeof window<`u`&&(window.filterXSS=t.exports);function o(){return typeof self<`u`&&typeof DedicatedWorkerGlobalScope<`u`&&self instanceof DedicatedWorkerGlobalScope}o()&&(self.filterXSS=t.exports)})),ge,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,z;function Ae(){return(Ae=e((()=>{ge=`_iframe_1bwt0_1`,_e=`_snackbar_1bwt0_12`,ve=`_textContainer_1bwt0_53`,ye=`_headerBody_1bwt0_61`,be=`_logo_1bwt0_70`,xe=`_headerContainer_1bwt0_76`,Se=`_textHeader_1bwt0_83`,Ce=`_textBody_1bwt0_90`,we=`_text_1bwt0_53`,Te=`_action_1bwt0_103`,Ee=`_button_1bwt0_118`,De=`_actionWrapper_1bwt0_128`,Oe=`_crossIcon_1bwt0_146`,ke=`_infoIcon_1bwt0_182`,z={iframe:ge,snackbar:_e,textContainer:ve,headerBody:ye,logo:be,headerContainer:xe,textHeader:Se,textBody:Ce,text:we,action:Te,button:Ee,actionWrapper:De,crossIcon:Oe,infoIcon:ke}})))()}var je,Me,Ne,Pe,B,Fe,V;function Ie(){return(Ie=e((()=>{f(),u(),je=t(i()),Me=t(v()),se(),Ne=t(o()),Pe=t(he()),h(),s(),Ae(),B=a(),Fe=_(y),V=class e extends je.Component{static show(t){let{parentElementId:n,...r}=t,i=n&&document.getElementById(n);if(!i){let e=document.createElement(`div`);e.id=`snackbar`,document.body.appendChild(e),i=e}window.snackbar=t,Me.createRoot(i).render((0,B.jsx)(e,{...r}))}static close(){let e=window.snackbar;if(e&&e.parentElementId){let e=document.querySelector(`#snackbar-container`);e&&e.remove()}}constructor(e){super(e),this.state={isLoaded:!1}}componentDidMount(){let{onLoad:e}=this.props;e?.(),(this.props.skipBlur??!1)||window.addEventListener(`blur`,this.onClickIFrame)}componentWillUnmount(){window.removeEventListener(`blur`,this.onClickIFrame)}onActionClick=e=>{let{onAction:t}=this.props;t?.(e)};onClickIFrame=()=>{document.activeElement&&document.activeElement.nodeName.toLowerCase()===`iframe`&&setTimeout(()=>this.onActionClick(),500)};countDownRenderer=({minutes:e,seconds:t,completed:n})=>{if(n)return null;let{fontSize:r,fontWeight:i}=this.props;return(0,B.jsxs)(c,{as:`p`,fontSize:r,fontWeight:i,children:[j(e),`:`,j(t)]})};render(){let{text:e,headerText:t,btnText:n,showIcon:r,fontSize:i,fontWeight:a,textAlign:o,htmlContent:s,style:l,countDownTime:u,isCampaigns:f,additionalHeaderText:h,sectionWidth:_,opacity:v,backgroundImg:y,onAction:b,onLoad:x,...S}=this.props,C=t?{}:{display:`none`},w={"--opacity":v,"--background-image":y,...l},{isLoaded:T}=this.state;return f?(0,B.jsxs)(`div`,{id:`bar-banner`,style:{position:`relative`},children:[(0,B.jsx)(`iframe`,{id:`bar-frame`,"data-testid":`snackbar-iframe`,className:z.iframe,style:{"--section-width":_},src:s,scrolling:`no`,onLoad:()=>{this.setState({isLoaded:!0})}}),T?(0,B.jsx)(`div`,{className:(0,Ne.default)(z.actionWrapper,z.action),onClick:this.onActionClick,children:(0,B.jsx)(p,{className:z.crossIcon})}):null]}):(0,B.jsxs)(`div`,{...S,"data-testid":`snackbar-container`,id:`snackbar-container`,style:w,className:z.snackbar,children:[s?(0,B.jsx)(`div`,{className:z.iframe,style:{"--section-width":_},"data-testid":`snackbar-html-content`,dangerouslySetInnerHTML:{__html:(0,Pe.default)(s)}}):(0,B.jsxs)(`div`,{className:z.textContainer,style:{"--text-align":o},children:[(0,B.jsxs)(`div`,{className:z.headerBody,style:{textAlign:o},children:[r?(0,B.jsx)(`div`,{className:z.logo,children:(0,B.jsx)(d,{className:z.infoIcon,"data-testid":`snackbar-icon`})}):null,(0,B.jsxs)(`div`,{className:z.headerContainer,children:[(0,B.jsx)(g,{size:m.xsmall,isInline:!0,className:z.textHeader,style:C,"data-testid":`snackbar-header`,children:t}),h?(0,B.jsx)(c,{as:`span`,isInline:!0,fontSize:`12px`,"data-testid":`snackbar-additional-info`,children:h}):null]})]}),(0,B.jsxs)(`div`,{className:z.textBody,children:[(0,B.jsx)(c,{as:`p`,className:z.text,fontSize:i,fontWeight:a,"data-testid":`snackbar-message`,children:e}),n?(0,B.jsx)(c,{className:z.button,onClick:this.onActionClick,children:n}):null,u>-1?(0,B.jsx)(Fe,{date:Date.now()+u,renderer:this.countDownRenderer,onComplete:this.onActionClick}):null]})]}),n?null:(0,B.jsx)(`button`,{className:z.action,type:`submit`,onClick:this.onActionClick,children:(0,B.jsx)(p,{className:z.crossIcon})})]})}};try{V.displayName=`SnackBar`,V.__docgenInfo={description:``,displayName:`SnackBar`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/snackbar/Snackbar.tsx`,methods:[],props:{text:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Message of the bar, rendered under the header. Ignored when `htmlContent` is set.",name:`text`,required:!1,tags:{},type:{name:`ReactNode`}},headerText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Bold line above the message. Without it the heading element is still rendered, hidden with `display: none`.",name:`headerText`,required:!1,tags:{},type:{name:`string | undefined`}},btnText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Label of the inline action, drawn as underlined text after the message. Setting it removes the close cross.`,name:`btnText`,required:!1,tags:{},type:{name:`string | undefined`}},backgroundImg:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"CSS `background-image` value of the bar — a whole shorthand such as `url(/banner.png)`, not a bare path.",name:`backgroundImg`,required:!1,tags:{},type:{name:`string | undefined`}},showIcon:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Whether the warning icon is drawn before the header.`,name:`showIcon`,required:!1,tags:{},type:{name:`boolean | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Called by the action text, by the close cross, when the countdown reaches zero and when a click lands in an iframe. The event is only passed on a real click.`,name:`onAction`,required:!1,tags:{},type:{name:`((e?: MouseEvent<Element, MouseEvent> | undefined) => void) | undefined`}},fontSize:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Font size of the countdown, as a CSS length. It does not reach the message, whose size is fixed by `--snackbar-text-size`.",name:`fontSize`,required:!1,tags:{},type:{name:`string | undefined`}},fontWeight:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Font weight of the countdown. It does not reach the message either.`,name:`fontWeight`,required:!1,tags:{},type:{name:`number | undefined`}},textAlign:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Text alignment of the header and the message.`,name:`textAlign`,required:!1,tags:{},type:{name:`"match-parent" | TextAlignValue | undefined`}},htmlContent:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"HTML injected instead of `text`, sanitized with `xss`. Under `isCampaigns` it is read as the `src` of an iframe instead.",name:`htmlContent`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Applied to the outermost element as inline style. It is merged after the opacity and background variables, so it can override them.`,name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},countDownTime:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Milliseconds until the countdown fires `onAction`. Pass `-1` for no countdown at all: `0` fires it on the first frame.",name:`countDownTime`,required:!0,tags:{},type:{name:`number`}},sectionWidth:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Minimum width of the iframe on a tablet or wider, in pixels. It does nothing without `htmlContent`.",name:`sectionWidth`,required:!0,tags:{},type:{name:`number`}},isCampaigns:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Whether the bar is a campaign banner: `htmlContent` becomes an iframe URL and the only thing drawn over it is a close cross.",name:`isCampaigns`,required:!1,tags:{},type:{name:`boolean | undefined`}},onLoad:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Called once the bar is mounted. Under `isCampaigns` the iframe's own load is what reveals the cross.",name:`onLoad`,required:!1,tags:{},type:{name:`(() => void) | undefined`}},isMaintenance:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Ignored. Nothing reads this prop, and it reaches the DOM as an unknown attribute.`,name:`isMaintenance`,required:!1,tags:{},type:{name:`boolean | undefined`}},opacity:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Opacity of the bar. Without it the bar renders fully transparent — the stylesheet falls back to `0`.",name:`opacity`,required:!1,tags:{},type:{name:`number | undefined`}},onClose:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Ignored. Nothing reads this prop; the close cross calls `onAction`.",name:`onClose`,required:!1,tags:{},type:{name:`(() => void) | undefined`}},skipBlur:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:"Whether the window `blur` listener is skipped. It is on by default and turns a click inside an iframe into an `onAction` half a second later.",name:`skipBlur`,required:!1,tags:{},type:{name:`boolean | undefined`}},additionalHeaderText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/snackbar/Snackbar.types.ts`,name:`TypeLiteral`}],description:`Smaller line drawn next to the header.`,name:`additionalHeaderText`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var H,U,Le,W,G,K,q,J,Y,X,Z,Q,$,Re;function ze(){return(ze=e((()=>{Ie(),H=a(),{fn:U}=__STORYBOOK_MODULE_TEST__,Le={title:`UI/Feedback/SnackBar`,component:V,parameters:{},argTypes:{text:{control:`text`,description:"Message of the bar, drawn under the header. Not shown when `htmlContent` is set"},headerText:{control:`text`,description:`Bold line above the message. Without it the header line is hidden`},additionalHeaderText:{control:`text`,description:`Smaller line drawn next to the header`},btnText:{control:`text`,description:`Label of the action, drawn as underlined text after the message. Setting it removes the close cross`},showIcon:{control:`boolean`,description:`Whether the warning icon is drawn before the header`,table:{defaultValue:{summary:`false`}}},countDownTime:{control:`number`,description:"Milliseconds until the countdown after the message reaches zero and calls `onAction`. `-1` shows no countdown; `0` calls `onAction` as soon as the bar mounts"},opacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the whole bar. Without it the bar is fully transparent`,table:{defaultValue:{summary:`0`}}},backgroundImg:{control:`text`,description:"CSS `background-image` value of the bar, a whole value such as `url(/banner.png)` rather than a bare path"},isMaintenance:{control:!1,description:`Ignored: the bar looks the same with or without it`},fontSize:{control:`text`,description:`Font size of the countdown, as a CSS length. The header and message keep their own size`},fontWeight:{control:`number`,description:`Font weight of the countdown. The header and message keep their own weight`},textAlign:{control:`select`,options:[`start`,`end`,`left`,`right`,`center`,`justify`,`match-parent`],description:`Text alignment of the header and the message`},htmlContent:{control:`text`,description:"HTML drawn in place of the header and message, sanitized with xss, which drops `style` attributes. With `isCampaigns` it is the URL of the page loaded into the iframe"},isCampaigns:{control:`boolean`,description:"Whether the bar is a campaign banner: `htmlContent` is loaded as a page into an iframe, and the only thing drawn over it is a close cross",table:{defaultValue:{summary:`false`}}},sectionWidth:{control:`number`,description:"Minimum width of the HTML content on a tablet, in pixels. Has no effect without `htmlContent`"},skipBlur:{control:`boolean`,description:"Whether a click inside an iframe on the page is left alone. Without it such a click calls `onAction` half a second later",table:{defaultValue:{summary:`false`}}},style:{control:`object`,description:"Inline style of the bar, applied after `opacity` and `backgroundImg`, so it can override both"},onAction:{action:`onAction`,description:`Called when the action label or the close cross is clicked, when the countdown reaches zero, and after a click inside an iframe`},onClose:{control:!1,description:"Ignored: the close cross calls `onAction`"},onLoad:{action:`onLoad`,description:`Called once the bar is mounted`}}},W={backgroundImg:``,opacity:1,headerText:`Attention`,text:`Important notification message`,showIcon:!0,fontSize:`13px`,fontWeight:400,textAlign:`left`,htmlContent:``,countDownTime:-1,sectionWidth:500,onLoad:U(),onAction:U()},G=e=>(0,H.jsx)(`div`,{"data-testid":`snackbar-wrapper`,style:{width:`calc(100% - 32px)`},children:(0,H.jsx)(V,{...e})}),K={render:e=>(0,H.jsx)(G,{...e}),args:W,parameters:{docs:{description:{story:"The bar as most pages show it: a warning icon, a header and a message, with a close cross at the end that calls `onAction`. Change any other prop live in the Controls panel below."},source:{code:`<SnackBar
  headerText="Attention"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleClose}
/>`}}}},q={render:e=>(0,H.jsx)(G,{...e}),args:{...W,btnText:`Take Action`},parameters:{docs:{description:{story:"When the notice asks for one step, the bar offers it in place of the close cross: the underlined **Take Action** label after the message calls `onAction` (`btnText`)."},source:{code:`<SnackBar
  headerText="Attention"
  text="Important notification"
  btnText="Take Action"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleAction}
/>`}}}},J={render:e=>(0,H.jsx)(G,{...e}),args:{...W,countDownTime:5e3,text:`This message will disappear in 5 seconds`},parameters:{docs:{description:{story:"For a notice that should not outstay its moment: the countdown after the message ticks down from 00:05 and calls `onAction` at zero, where the host removes the bar (`countDownTime`). Here nothing removes it, so only the timer disappears."},source:{code:`<SnackBar
  headerText="Attention"
  text="This message will disappear in 5 seconds"
  showIcon
  opacity={1}
  countDownTime={5000}
  sectionWidth={500}
  onAction={handleDismiss}
/>`}}}},Y={render:e=>(0,H.jsx)(G,{...e}),args:{...W,htmlContent:`<p>Your storage is <b>almost full</b>. Please free up space or <a href='#'>upgrade your plan</a> to continue working without interruptions.</p>`,text:``},parameters:{docs:{description:{story:"When the notice needs bold text or a link, pass it as HTML: it replaces the header and the message, and the markup is sanitized first, which also drops any `style` attribute (`htmlContent`)."},source:{code:`<SnackBar
  htmlContent="<p>Your storage is <b>almost full</b>. <a href='#'>Upgrade</a></p>"
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`}}}},X={render:e=>(0,H.jsx)(G,{...e}),args:{...W,headerText:`Maintenance Notice`,text:`System maintenance is scheduled for tonight at 10 PM`},parameters:{docs:{description:{story:"A scheduled-maintenance notice is an ordinary bar with its own header and message; there is no separate maintenance look, and `isMaintenance` changes nothing."},source:{code:`<SnackBar
  headerText="Maintenance Notice"
  text="System maintenance is scheduled for tonight at 10 PM"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`}}}},Z={render:e=>(0,H.jsx)(G,{...e}),args:{...W,additionalHeaderText:`Today, 10:00`},parameters:{docs:{description:{story:"When the header needs a detail such as a time, the smaller **Today, 10:00** line sits right after it (`additionalHeaderText`)."},source:{code:`<SnackBar
  headerText="Attention"
  additionalHeaderText="Today, 10:00"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>`}}}},Q={render:e=>(0,H.jsx)(`div`,{dir:`rtl`,children:(0,H.jsx)(G,{...e})}),globals:{direction:`rtl`},args:{...W,headerText:`تنبيه`,text:`رسالة إشعار مهمة`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`90px`},description:{story:`The same bar under a right-to-left interface: the accent stripe moves to the right edge, the icon and header start from the right, and the close cross moves to the left end. The wrapper sets the direction to right-to-left, and the bar's logical properties follow it.`},source:{code:`<div dir="rtl">
  <SnackBar
    headerText="..."
    text="..."
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={500}
  />
</div>`}}}},$={render:()=>(0,H.jsx)(`div`,{style:{width:`400px`,"--snackbar-background":`#eef2ff`,"--snackbar-text-color":`#b91c1c`,"--snackbar-accent-color":`#4f46e5`,"--snackbar-accent-width":`6px`,"--snackbar-text-size":`13px`,"--snackbar-content-padding":`16px 24px`,"--snackbar-icon-fill":`#4f46e5`},children:(0,H.jsx)(V,{text:`Custom styled notification with CSS variables`,headerText:`Custom Theme`,showIcon:!0,opacity:1,countDownTime:-1,sectionWidth:400,onAction:()=>{}})}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The message takes the red text colour while the header keeps the heading colour.`},source:{code:`<div
  style={{
    "--snackbar-background": "#eef2ff",
    "--snackbar-text-color": "#b91c1c",
    "--snackbar-accent-color": "#4f46e5",
    "--snackbar-accent-width": "6px",
    "--snackbar-text-size": "13px",
    "--snackbar-content-padding": "16px 24px",
    "--snackbar-icon-fill": "#4f46e5",
  }}
>
  <SnackBar
    headerText="Custom Theme"
    text="Custom styled notification with CSS variables"
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={400}
  />
</div>`}}}},Re=[`Default`,`WithAction`,`WithCountdown`,`WithHtmlContent`,`Maintenance`,`WithAdditionalHeaderText`,`RightToLeft`,`CssCustomization`],K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: baseArgs,
  parameters: {
    docs: {
      description: {
        story: "The bar as most pages show it: a warning icon, a header and a message, with a close cross at the end that calls \`onAction\`. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<SnackBar
  headerText="Attention"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleClose}
/>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    btnText: "Take Action"
  },
  parameters: {
    docs: {
      description: {
        story: "When the notice asks for one step, the bar offers it in place of the close cross: the underlined **Take Action** label after the message calls \`onAction\` (\`btnText\`)."
      },
      source: {
        code: \`<SnackBar
  headerText="Attention"
  text="Important notification"
  btnText="Take Action"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
  onAction={handleAction}
/>\`
      }
    }
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    countDownTime: 5000,
    text: "This message will disappear in 5 seconds"
  },
  parameters: {
    docs: {
      description: {
        story: "For a notice that should not outstay its moment: the countdown after the message ticks down from 00:05 and calls \`onAction\` at zero, where the host removes the bar (\`countDownTime\`). Here nothing removes it, so only the timer disappears."
      },
      source: {
        code: \`<SnackBar
  headerText="Attention"
  text="This message will disappear in 5 seconds"
  showIcon
  opacity={1}
  countDownTime={5000}
  sectionWidth={500}
  onAction={handleDismiss}
/>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    htmlContent: "<p>Your storage is <b>almost full</b>. Please free up space or <a href='#'>upgrade your plan</a> to continue working without interruptions.</p>",
    text: ""
  },
  parameters: {
    docs: {
      description: {
        story: "When the notice needs bold text or a link, pass it as HTML: it replaces the header and the message, and the markup is sanitized first, which also drops any \`style\` attribute (\`htmlContent\`)."
      },
      source: {
        code: \`<SnackBar
  htmlContent="<p>Your storage is <b>almost full</b>. <a href='#'>Upgrade</a></p>"
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>\`
      }
    }
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    headerText: "Maintenance Notice",
    text: "System maintenance is scheduled for tonight at 10 PM"
  },
  parameters: {
    docs: {
      description: {
        story: "A scheduled-maintenance notice is an ordinary bar with its own header and message; there is no separate maintenance look, and \`isMaintenance\` changes nothing."
      },
      source: {
        code: \`<SnackBar
  headerText="Maintenance Notice"
  text="System maintenance is scheduled for tonight at 10 PM"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <SnackBarWrapper {...args} />,
  args: {
    ...baseArgs,
    additionalHeaderText: "Today, 10:00"
  },
  parameters: {
    docs: {
      description: {
        story: "When the header needs a detail such as a time, the smaller **Today, 10:00** line sits right after it (\`additionalHeaderText\`)."
      },
      source: {
        code: \`<SnackBar
  headerText="Attention"
  additionalHeaderText="Today, 10:00"
  text="Important notification message"
  showIcon
  opacity={1}
  countDownTime={-1}
  sectionWidth={500}
/>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <SnackBarWrapper {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...baseArgs,
    headerText: "\\u062a\\u0646\\u0628\\u064a\\u0647",
    text: "\\u0631\\u0633\\u0627\\u0644\\u0629 \\u0625\\u0634\\u0639\\u0627\\u0631 \\u0645\\u0647\\u0645\\u0629"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the direction of the whole Docs page
      story: {
        inline: false,
        height: "90px"
      },
      description: {
        story: "The same bar under a right-to-left interface: the accent stripe moves to the right edge, the icon and header start from the right, and the close cross moves to the left end. The wrapper sets the direction to right-to-left, and the bar's logical properties follow it."
      },
      source: {
        code: \`<div dir="rtl">
  <SnackBar
    headerText="..."
    text="..."
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={500}
  />
</div>\`
      }
    }
  }
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "400px",
    "--snackbar-background": "#eef2ff",
    "--snackbar-text-color": "#b91c1c",
    "--snackbar-accent-color": "#4f46e5",
    "--snackbar-accent-width": "6px",
    "--snackbar-text-size": "13px",
    "--snackbar-content-padding": "16px 24px",
    "--snackbar-icon-fill": "#4f46e5"
  } as CSSProperties}>
      <SnackBar text="Custom styled notification with CSS variables" headerText="Custom Theme" showIcon opacity={1} countDownTime={-1} sectionWidth={400} onAction={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The message takes the red text colour while the header keeps the heading colour.\`
      },
      source: {
        code: \`<div
  style={{
    "--snackbar-background": "#eef2ff",
    "--snackbar-text-color": "#b91c1c",
    "--snackbar-accent-color": "#4f46e5",
    "--snackbar-accent-width": "6px",
    "--snackbar-text-size": "13px",
    "--snackbar-content-padding": "16px 24px",
    "--snackbar-icon-fill": "#4f46e5",
  }}
>
  <SnackBar
    headerText="Custom Theme"
    text="Custom styled notification with CSS variables"
    showIcon
    opacity={1}
    countDownTime={-1}
    sectionWidth={400}
  />
</div>\`
      }
    }
  }
}`,...$.parameters?.docs?.source}}}})))()}ze();export{$ as CssCustomization,K as Default,X as Maintenance,Q as RightToLeft,q as WithAction,Z as WithAdditionalHeaderText,J as WithCountdown,Y as WithHtmlContent,Re as __namedExportsOrder,Le as default};