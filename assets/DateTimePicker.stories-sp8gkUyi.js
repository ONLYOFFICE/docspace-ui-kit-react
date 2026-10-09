import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{S as a,t as o}from"./enums-DzcBu485.js";import{c as s,f as c,h as l,i as u,l as d,o as ee,t as te,u as f}from"./dateArithmetic-Bwpb7u1g.js";import{n as p,t as m}from"./ComboBox-DWO8Uqxf.js";import{n as h,t as ne}from"./date-picker-CDPnFX_p.js";import{n as g,t as _}from"./time-picker-D4XJiXUo.js";var v,y,b,x;function S(){return(S=e((()=>{n(),v=n(),y=r(),b=({title:e,titleId:t,...n},r)=>(0,y.jsxs)(`svg`,{width:12,height:12,viewBox:`0 0 12 12`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,ref:r,"aria-labelledby":t,...n,children:[e?(0,y.jsx)(`title`,{id:t,children:e}):null,(0,y.jsxs)(`g`,{clipPath:`url(#clip0_5080_185586)`,children:[(0,y.jsx)(`circle`,{cx:6,cy:6,r:6,fill:`white`}),(0,y.jsx)(`path`,{d:`M5 3V6C5 6.37877 5.214 6.72504 5.55279 6.89443L7.55279 7.89443L8.44721 6.10557L7 5.38197V3H5Z`,fill:`#F24724`}),(0,y.jsx)(`path`,{fillRule:`evenodd`,clipRule:`evenodd`,d:`M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 8.20914 8.20914 10 6 10C3.79086 10 2 8.20914 2 6Z`,fill:`#F24724`})]}),(0,y.jsx)(`defs`,{children:(0,y.jsx)(`clipPath`,{id:`clip0_5080_185586`,children:(0,y.jsx)(`rect`,{width:12,height:12,fill:`white`})})})]}),x=(0,v.forwardRef)(b)})))()}var C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{C=`_selectors_1bi42_1`,w=`_selectedItem_1bi42_9`,T=`_hasError_1bi42_13`,E=`_timeCell_1bi42_17`,D=`_clockIcon_1bi42_49`,O=`_timePicker_1bi42_64`,k=`_timeSelector_1bi42_70`,A={selectors:C,selectedItem:w,hasError:T,timeCell:E,clockIcon:D,timePicker:O,timeSelector:k}})))()}var M,N,P,F;function I(){return(I=e((()=>{M=t(n()),N=t(i()),S(),a(),s(),l(),u(),g(),h(),p(),j(),P=r(),F=e=>{let{initialDate:t,selectDateText:n,onChange:r,className:i,id:a,hasError:s,minDate:l,maxDate:u,locale:d,openDate:p,dataTestId:h,hideCross:g,useMaxTime:v,translations:y}=e,b=[{key:`AM`,label:y.AM},{key:`PM`,label:y.PM}],[S,C]=(0,M.useState)(!1),[w,T]=(0,M.useState)(t?f(t):null),[E,D]=(0,M.useState)(!0),O=t?f(t):null,[k,j]=(0,M.useState)(O&&O.hour>=12?b[1]:b[0]),F=()=>C(!0),I=()=>C(!1),L=e=>{E&&e&&j(e.hour>=12?b[1]:b[0]),r?.(e),T(e)},R=(0,M.useRef)(null),z=e=>{let t=e.target;if(!t)return;let n=(t.tagName===`SPAN`?t.parentElement:t)?.classList.contains(`drop-down-item`);R?.current&&!R?.current?.contains(t)&&!n&&C(!1)},B=e=>{(e.key===o.enter||e.key===o.tab)&&C(!1)},V=e=>{j(e),w&&(e.key===`AM`?L(ee(w,12,`hours`)):L(te(w,12,`hours`)))};return(0,M.useEffect)(()=>(document.addEventListener(`click`,z,{capture:!0}),document.addEventListener(`keydown`,B,{capture:!0}),()=>{document.removeEventListener(`click`,z,{capture:!0}),document.removeEventListener(`keydown`,B,{capture:!0})}),[]),(0,M.useEffect)(()=>{let e=[`en-US`,`en-AU`,`en-PH`,`en`].some(e=>d.startsWith(e))||d===`en-GB`;D(e)},[t,d]),(0,P.jsxs)(`div`,{className:(0,N.default)(A.selectors,i,{[A.hasError]:s}),id:a,"data-testid":h??`date-time-picker`,"aria-label":n,"aria-invalid":s,children:[(0,P.jsx)(ne,{initialDate:t,onChange:L,selectDateText:n,minDate:l,maxDate:u,locale:d,openDate:p,outerDate:w,hideCross:g,useMaxTime:v}),(0,P.jsx)(`span`,{className:A.timeSelector,"data-testid":`date-time-picker-time-wrapper`,children:w===null?null:S?(0,P.jsxs)(`div`,{className:A.timePicker,ref:R,children:[(0,P.jsx)(_,{initialTime:w,onChange:L,tabIndex:0,onBlur:I,focusOnRender:!0,"aria-label":`Time picker`,isTwelveHourFormat:E,meridiem:String(k.key)}),E?(0,P.jsx)(m,{options:b,selectedOption:k,onSelect:V,scaledOptions:!0}):null]}):(0,P.jsxs)(`span`,{className:(0,N.default)(A.timeCell,{[A.hasError]:s}),onClick:F,"data-testid":`date-time-picker-time-display`,role:`button`,"aria-label":`Current time: ${c(w,`HH:mm`)}`,tabIndex:0,children:[(0,P.jsx)(x,{className:A.clockIcon,"aria-hidden":`true`,"data-testid":`date-time-picker-clock-icon`}),E?c(w,`hh:mm a`):c(w,`HH:mm`)]})})]})};try{F.displayName=`DateTimePicker`,F.__docgenInfo={description:``,displayName:`DateTimePicker`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/date-time-picker/index.tsx`,methods:[],props:{initialDate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Date and time the component starts on.`,name:`initialDate`,required:!1,tags:{},type:{name:`Nullable<string | DateTime<boolean> | Date> | undefined`}},selectDateText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Text of the button shown while no date is chosen.`,name:`selectDateText`,required:!0,tags:{},type:{name:`string`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Applied to the outermost element.`,name:`className`,required:!0,tags:{},type:{name:`string`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Applied to the outermost element.`,name:`id`,required:!0,tags:{},type:{name:`string`}},onChange:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:"Called whenever either half changes, with the combined date and time, or\n`null` when the date is cleared.",name:`onChange`,required:!0,tags:{},type:{name:`(d: DateTime<boolean> | null) => void`}},minDate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Earliest selectable day in the calendar.`,name:`minDate`,required:!1,tags:{},type:{name:`DateTime<boolean> | Date | undefined`}},maxDate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Latest selectable day in the calendar.`,name:`maxDate`,required:!1,tags:{},type:{name:`DateTime<boolean> | Date | undefined`}},locale:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`BCP 47 tag the calendar is written in. It also decides whether the time is
shown as 12-hour or 24-hour.`,name:`locale`,required:!0,tags:{},type:{name:`string`}},hasError:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Whether the control is drawn in its error colours.`,name:`hasError`,required:!0,tags:{},type:{name:`boolean`}},openDate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Month the calendar opens on.`,name:`openDate`,required:!0,tags:{},type:{name:`DateTime<boolean> | Date`}},dataTestId:{defaultValue:{value:`"date-time-picker"`},declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:"`data-testid` of the outermost element.",name:`dataTestId`,required:!1,tags:{default:`"date-time-picker"`},type:{name:`string | undefined`}},hideCross:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Whether the date chip's clearing cross is hidden.`,name:`hideCross`,required:!1,tags:{},type:{name:`boolean | undefined`}},useMaxTime:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Whether a picked day is reported at the end of that day rather than at midnight.`,name:`useMaxTime`,required:!1,tags:{},type:{name:`boolean | undefined`}},translations:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/date-time-picker/DateTimePicker.types.tsx`,name:`TypeLiteral`}],description:`Labels of the AM and PM options. Required: the component reads them while
rendering, and nothing here translates them for you.`,name:`translations`,required:!0,tags:{},type:{name:`DateTimePickerTranslations`}}},tags:{}}}catch{}})))()}var L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{n(),s(),I(),L=r(),R=n(),z={title:`UI/Form controls/DateTimePicker`,component:F,parameters:{},argTypes:{locale:{control:`select`,options:`az.ar-SA.zh-cn.cs.nl.en-gb.en.fi.fr.de.de-ch.el.it.ja.ko.lv.pl.pt.pt-br.ru.sk.sl.es.tr.uk.vi`.split(`.`),description:`BCP 47 tag the calendar is written in; it also picks the clock: 12-hour with an AM/PM drop-down for English locales, 24-hour for every other`},hasError:{control:`boolean`,description:`Draws the shown time in red and marks the control as invalid`},minDate:{control:`date`,description:`Earliest day the calendar lets you pick`},maxDate:{control:`date`,description:`Latest day the calendar lets you pick`},initialDate:{control:`date`,description:`Date and time the component starts on; read once, when it mounts`},openDate:{control:`date`,description:`Month the calendar opens on`},selectDateText:{control:`text`,description:`Text of the button shown while no date is chosen, also the control's accessible name`},className:{control:`text`,description:`Class added to the outermost element`},id:{control:`text`,description:"`id` of the outermost element"},dataTestId:{control:`text`,description:"`data-testid` of the outermost element",table:{defaultValue:{summary:`date-time-picker`}}},hideCross:{control:`boolean`,description:`Hides the cross on the date chip, so the picked day cannot be cleared`,table:{defaultValue:{summary:`false`}}},useMaxTime:{control:`boolean`,description:`Reports the first day picked at the end of that day rather than at the current time of day`,table:{defaultValue:{summary:`false`}}},translations:{control:`object`,description:`Labels of the AM and PM options in the drop-down; required, as nothing translates them for you`},onChange:{action:`onChange`,description:"Called whenever the day or the time changes, with the combined date and time, or `null` when the day is cleared"}}},B=e=>(0,L.jsx)(`div`,{style:{height:`500px`},children:e.children}),V=e=>typeof e==`number`?new Date(e):e,H={render:e=>(0,L.jsx)(B,{children:(0,R.createElement)(F,{...e,key:String(e.initialDate),initialDate:V(e.initialDate),minDate:V(e.minDate),maxDate:V(e.maxDate),openDate:V(e.openDate)})}),args:{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`default-date-time-picker`,hasError:!1,translations:{AM:`AM`,PM:`PM`}},parameters:{docs:{description:{story:`The picker as a form shows it before anything is chosen: only the "Select date" button. Pick a day to see the time appear beside it, click the time to edit it, and change any other prop live in the Controls panel below.`},source:{code:`<DateTimePicker
  locale="en"
  openDate={new Date()}
  minDate={new Date("1970/01/01")}
  maxDate={new Date("2036/01/01")}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`}}}},U=()=>(0,L.jsx)(B,{children:(0,L.jsx)(F,{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),initialDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`error-date-time-picker`,hasError:!0,onChange:e=>console.log(`Date changed:`,e),translations:{AM:`AM`,PM:`PM`}})}),W={render:()=>(0,L.jsx)(U,{}),parameters:{docs:{description:{story:"Use it when the chosen moment fails validation: the time turns red and the control is marked invalid for screen readers (`hasError`). A day is picked here because the time, the only part drawn in the error colour, shows only once there is one."},source:{code:`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hasError
  onChange={(date) => console.log(date)}
/>`}}}},G=()=>(0,L.jsx)(B,{children:(0,L.jsx)(F,{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),initialDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`initial-date-time-picker`,hasError:!1,onChange:e=>console.log(`Date changed:`,e),translations:{AM:`AM`,PM:`PM`}})}),K={render:()=>(0,L.jsx)(G,{}),parameters:{docs:{description:{story:"Use it to edit a moment that already exists, such as a saved deadline: the day chip and the time show it from the first render (`initialDate`). The English locale gives a 12-hour clock; click the time to see the AM/PM drop-down beside the editor."},source:{code:`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`}}}},q=()=>(0,L.jsx)(B,{children:(0,L.jsx)(F,{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),initialDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`hidden-cross-date-time-picker`,hasError:!1,hideCross:!0,onChange:e=>console.log(`Date changed:`,e),translations:{AM:`AM`,PM:`PM`}})}),J={render:()=>(0,L.jsx)(q,{}),parameters:{docs:{description:{story:"Use it for a field that must always hold a moment: the day chip has no cross, so the day can be changed in the calendar but never cleared (`hideCross`)."},source:{code:`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hideCross
  onChange={(date) => console.log(date)}
/>`}}}},Y=()=>(0,L.jsx)(B,{children:(0,L.jsx)(F,{locale:`de`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),initialDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`twenty-four-hour-date-time-picker`,hasError:!1,onChange:e=>console.log(`Date changed:`,e),translations:{AM:`AM`,PM:`PM`}})}),X={render:()=>(0,L.jsx)(Y,{}),parameters:{docs:{description:{story:'Any locale that is not English switches the clock to 24 hours (`locale`): the time reads "14:30" rather than "02:30 PM", and the editor opened by a click on it has no AM/PM drop-down. The calendar is written in the same locale.'},source:{code:`<DateTimePicker
  locale="de"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`}}}},Z={render:()=>(0,L.jsx)(`div`,{style:{height:`500px`,"--date-time-picker-cell-bg":`#cce5f6`,"--date-time-picker-icon":`#0082c9`,"--date-time-picker-cell-height":`28px`,"--date-time-picker-cell-radius":`6px`,"--date-time-picker-cell-padding":`6px 12px`,"--time-input-focus-border":`#0082c9`,"--time-input-bg":`#e6f3fb`,"--time-input-radius":`6px`,"--calendar-bg":`#e6f3fb`,"--calendar-border":`#0082c9`,"--calendar-title":`#0082c9`,"--calendar-accent":`#0082c9`,"--calendar-hover-bg":`#cce5f6`},children:(0,L.jsx)(F,{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),openDate:d(),initialDate:d(),selectDateText:`Select date`,className:`date-time-picker`,id:`css-customization-date-time-picker`,hasError:!1,onChange:()=>{},translations:{AM:`AM`,PM:`PM`}})}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Click the time to see the time editor and the day chip to see the calendar; the day chip, the "select date" button and the AM/PM drop-down keep their own variables, listed in the SelectedItem, AddButton and ComboBox stories.`},source:{code:`<div
  style={{
    "--date-time-picker-cell-bg": "#cce5f6",
    "--date-time-picker-icon": "#0082c9",
    "--date-time-picker-cell-height": "28px",
    "--date-time-picker-cell-radius": "6px",
    "--date-time-picker-cell-padding": "6px 12px",
    "--time-input-focus-border": "#0082c9",
    "--time-input-bg": "#e6f3fb",
    "--time-input-radius": "6px",
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
  }}
>
  <DateTimePicker
    locale="en"
    openDate={now()}
    initialDate={now()}
    selectDateText="Select date"
    translations={{ AM: "AM", PM: "PM" }}
    onChange={(date) => console.log(date)}
  />
</div>`}}}},Q=[`Default`,`WithError`,`WithInitialDate`,`HiddenCross`,`TwentyFourHourClock`,`CssCustomization`],H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <DateTimePicker {...args}
    // initialDate is read once on mount, so a new value remounts the picker.
    key={String(args.initialDate)} initialDate={fromControl(args.initialDate)} minDate={fromControl(args.minDate)} maxDate={fromControl(args.maxDate)} openDate={fromControl(args.openDate)} />
    </Wrapper>,
  args: {
    locale: "en",
    maxDate: new Date(\`\${new Date().getFullYear() + 10}/01/01\`),
    minDate: new Date("1970/01/01"),
    openDate: now(),
    selectDateText: "Select date",
    className: "date-time-picker",
    id: "default-date-time-picker",
    hasError: false,
    translations: {
      AM: "AM",
      PM: "PM"
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'The picker as a form shows it before anything is chosen: only the "Select date" button. Pick a day to see the time appear beside it, click the time to edit it, and change any other prop live in the Controls panel below.'
      },
      source: {
        code: \`<DateTimePicker
  locale="en"
  openDate={new Date()}
  minDate={new Date("1970/01/01")}
  maxDate={new Date("2036/01/01")}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <WithErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it when the chosen moment fails validation: the time turns red and the control is marked invalid for screen readers (\`hasError\`). A day is picked here because the time, the only part drawn in the error colour, shows only once there is one."
      },
      source: {
        code: \`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hasError
  onChange={(date) => console.log(date)}
/>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <WithInitialDateTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it to edit a moment that already exists, such as a saved deadline: the day chip and the time show it from the first render (\`initialDate\`). The English locale gives a 12-hour clock; click the time to see the AM/PM drop-down beside the editor."
      },
      source: {
        code: \`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>\`
      }
    }
  }
}`,...K.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <HiddenCrossTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use it for a field that must always hold a moment: the day chip has no cross, so the day can be changed in the calendar but never cleared (\`hideCross\`)."
      },
      source: {
        code: \`<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hideCross
  onChange={(date) => console.log(date)}
/>\`
      }
    }
  }
}`,...J.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <TwentyFourHourClockTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Any locale that is not English switches the clock to 24 hours (\`locale\`): the time reads "14:30" rather than "02:30 PM", and the editor opened by a click on it has no AM/PM drop-down. The calendar is written in the same locale.'
      },
      source: {
        code: \`<DateTimePicker
  locale="de"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    height: "500px",
    // DateTimePicker time cell
    "--date-time-picker-cell-bg": "#cce5f6",
    "--date-time-picker-icon": "#0082c9",
    "--date-time-picker-cell-height": "28px",
    "--date-time-picker-cell-radius": "6px",
    "--date-time-picker-cell-padding": "6px 12px",
    // TimePicker sub-component
    "--time-input-focus-border": "#0082c9",
    "--time-input-bg": "#e6f3fb",
    "--time-input-radius": "6px",
    // Calendar sub-component
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6"
  } as React.CSSProperties}>
      <DateTimePicker locale="en" maxDate={new Date(\`\${new Date().getFullYear() + 10}/01/01\`)} minDate={new Date("1970/01/01")} openDate={now()} initialDate={now()} selectDateText="Select date" className="date-time-picker" id="css-customization-date-time-picker" hasError={false} onChange={() => {}} translations={{
      AM: "AM",
      PM: "PM"
    }} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Click the time to see the time editor and the day chip to see the calendar; the day chip, the "select date" button and the AM/PM drop-down keep their own variables, listed in the SelectedItem, AddButton and ComboBox stories.\`
      },
      source: {
        code: \`<div
  style={{
    "--date-time-picker-cell-bg": "#cce5f6",
    "--date-time-picker-icon": "#0082c9",
    "--date-time-picker-cell-height": "28px",
    "--date-time-picker-cell-radius": "6px",
    "--date-time-picker-cell-padding": "6px 12px",
    "--time-input-focus-border": "#0082c9",
    "--time-input-bg": "#e6f3fb",
    "--time-input-radius": "6px",
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
  }}
>
  <DateTimePicker
    locale="en"
    openDate={now()}
    initialDate={now()}
    selectDateText="Select date"
    translations={{ AM: "AM", PM: "PM" }}
    onChange={(date) => console.log(date)}
  />
</div>\`
      }
    }
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{Z as CssCustomization,H as Default,J as HiddenCross,X as TwentyFourHourClock,W as WithError,K as WithInitialDate,Q as __namedExportsOrder,z as default};