import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{c as i,l as a}from"./dateArithmetic-Bwpb7u1g.js";import{n as o,t as s}from"./Calendar-D7OsH9A3.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{c=t(n()),i(),o(),l=r(),u={title:`UI/Form controls/Calendar`,component:s,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=651-4406&mode=design&t=RrB9MOQGCnUPghij-0`}},argTypes:{locale:{control:`select`,options:`az.ar-SA.zh-cn.cs.nl.en-gb.en.fi.fr.de.de-ch.el.it.ja.ko.lv.pl.pt.pt-br.ru.sk.sl.es.tr.uk.vi`.split(`.`),description:`Locale tag the month and weekday names are written in; any tag the browser knows works, the list holds common ones`,table:{defaultValue:{summary:`en`}}},minDate:{control:`date`,description:`Earliest selectable day; earlier days are greyed out and the arrows stop at its month`,table:{defaultValue:{summary:`1970-01-01`}}},maxDate:{control:`date`,description:`Latest selectable day; later days are greyed out and the arrows stop at its month`,table:{defaultValue:{summary:`ten years from today`}}},initialDate:{control:`date`,description:`First shown date when the calendar opens; a date outside the range opens the nearer boundary instead`,table:{defaultValue:{summary:`today`}}},isMobile:{control:`boolean`,description:`Widens the gap between the two arrow buttons from 8px to 12px; the larger touch layout itself switches on by window width`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Additional CSS class for the calendar container`},id:{control:`text`,description:`Id of the calendar container`},style:{control:`object`,description:`Inline styles of the calendar container`},selectedDate:{control:!1,description:`The highlighted day, as a Luxon DateTime; its time is kept when another day is picked`},setSelectedDate:{action:`setSelectedDate`,description:`Called with the newly picked day, before onChange`},onChange:{action:`onChange`,description:`Called with the newly picked day, right after setSelectedDate and with the same value`},useMaxTime:{control:`boolean`,description:`Reports a picked day at 23:59:59.999 instead of keeping the time of the previous selection`,table:{defaultValue:{summary:`false`}}},isScroll:{control:`boolean`,description:`Wraps the grid in a scroll area and drops the calendar's top, right and bottom padding`,table:{defaultValue:{summary:`false`}}},dataTestId:{control:`text`,description:`data-testid of the calendar container`,table:{defaultValue:{summary:`calendar`}}},forwardedRef:{control:!1,description:`Ref to the calendar container`}}},d=e=>typeof e==`number`?new Date(e):e,f=({locale:e,minDate:t,maxDate:n,initialDate:r,isMobile:i,className:o,id:u,style:f,onChange:p,setSelectedDate:m,useMaxTime:h,isScroll:g,dataTestId:_})=>{let[v,y]=(0,c.useState)(a());return(0,l.jsx)(s,{locale:e,selectedDate:v,setSelectedDate:e=>{y(e),m?.(e)},onChange:p,minDate:d(t),maxDate:d(n),initialDate:d(r),isMobile:i,className:o,id:u,style:f,useMaxTime:h,isScroll:g,dataTestId:_})},p={render:e=>(0,l.jsx)(f,{...e}),args:{locale:`en`,maxDate:new Date(`${new Date().getFullYear()+10}/01/01`),minDate:new Date(`1970/01/01`),initialDate:new Date},parameters:{docs:{description:{story:`The calendar as it opens: today is filled with the accent colour. Click a day to select it and watch the Actions panel, click the title to switch to months and then years, and change any other prop live in the Controls panel below.`},source:{code:`const [selectedDate, setSelectedDate] = useState(now());

<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  onChange={handleChange}
/>`}}}},m=()=>{let[e,t]=(0,c.useState)(a()),n=new Date().getFullYear();return(0,l.jsx)(s,{locale:`en`,selectedDate:e,setSelectedDate:t,minDate:new Date(`${n}/01/01`),maxDate:new Date(`${n}/12/31`)})},h={render:()=>(0,l.jsx)(m,{}),parameters:{docs:{description:{story:`Calendar with min and max date constraints. Only dates within the current year are selectable.`},source:{code:`<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2026/01/01")}
  maxDate={new Date("2026/12/31")}
/>`}}}},g=({locale:e})=>{let[t,n]=(0,c.useState)(a());return(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`div`,{style:{marginBottom:`8px`,fontWeight:`bold`,textAlign:`center`},children:e}),(0,l.jsx)(s,{locale:e,selectedDate:t,setSelectedDate:n})]})},_=()=>(0,l.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, 1fr)`,gridGap:`24px`},children:[`en`,`ru`,`de`,`ja`].map(e=>(0,l.jsx)(g,{locale:e},e))}),v={render:()=>(0,l.jsx)(_,{}),parameters:{docs:{description:{story:`Calendar rendered in different locales. Shows how month names, weekday headers, and date formatting adapt to each locale.`},source:{code:`<Calendar locale="en" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ru" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="de" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ja" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />`}}}},y=()=>{let[e,t]=(0,c.useState)(a());return(0,l.jsx)(`div`,{dir:`rtl`,children:(0,l.jsx)(s,{locale:`ar-SA`,selectedDate:e,setSelectedDate:t})})},b={render:()=>(0,l.jsx)(y,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`402px`},description:{story:'The calendar in a right-to-left layout with Arabic names: the weeks run from right to left, the title moves to the right edge and the arrows to the left, while the chevron after the title stays on its right, before the text. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <Calendar
    locale="ar-SA"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
  />
</div>`}}}},x={render:()=>{let e=a(),[t,n]=(0,c.useState)(e.set({day:e.day===15?16:15}));return(0,l.jsx)(`div`,{style:{"--calendar-bg":`#e6f3fb`,"--calendar-border":`#0082c9`,"--calendar-shadow":`0 4px 16px rgba(0,130,201,0.25)`,"--calendar-radius":`12px`,"--calendar-padding":`24px`,"--calendar-width":`340px`,"--calendar-height":`360px`,"--calendar-title":`#0082c9`,"--calendar-title-size":`16px`,"--calendar-outline":`#0082c9`,"--calendar-arrow":`#0082c9`,"--calendar-disabled-arrow":`#cce5f6`,"--calendar-weekday":`#0082c9`,"--calendar-accent":`#0082c9`,"--calendar-selected-text":`#ffffff`,"--calendar-current-radius":`8px`,"--calendar-focused-radius":`8px`,"--calendar-focused-bg":`#ffffff`,"--calendar-focused-text":`#0082c9`,"--calendar-hover-bg":`#cce5f6`,"--calendar-hover-radius":`8px`,"--calendar-past":`#5ab4e5`,"--calendar-disabled":`#cce5f6`},children:(0,l.jsx)(s,{locale:`en`,selectedDate:t,setSelectedDate:n,minDate:e.startOf(`month`)})})},parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The calendar opens with a selected day other than today, so the today and selected-day variables both show, and with `minDate` at the start of this month, so the days of the previous month and the left arrow show their disabled colours. Hover a day and an arrow to see the hover variables."},source:{code:`<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-radius": "12px",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-focused-bg": "#ffffff",
    "--calendar-hover-bg": "#cce5f6",
    "--calendar-past": "#5ab4e5",
    "--calendar-disabled": "#cce5f6",
  }}
>
  <Calendar
    locale="en"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    minDate={startOfThisMonth}
  />
</div>`}}}},S=[`Default`,`WithDateConstraints`,`LocaleExamples`,`RightToLeft`,`CssCustomization`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveCalendar {...args} />,
  args: {
    locale: "en",
    maxDate: new Date(\`\${new Date().getFullYear() + 10}/01/01\`),
    minDate: new Date("1970/01/01"),
    initialDate: new Date()
  },
  parameters: {
    docs: {
      description: {
        story: "The calendar as it opens: today is filled with the accent colour. Click a day to select it and watch the Actions panel, click the title to switch to months and then years, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`const [selectedDate, setSelectedDate] = useState(now());

<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  onChange={handleChange}
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <WithDateConstraintsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Calendar with min and max date constraints. Only dates within the current year are selectable."
      },
      source: {
        code: \`<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2026/01/01")}
  maxDate={new Date("2026/12/31")}
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <LocaleExamplesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Calendar rendered in different locales. Shows how month names, weekday headers, and date formatting adapt to each locale."
      },
      source: {
        code: \`<Calendar locale="en" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ru" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="de" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ja" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "402px"
      },
      description: {
        story: 'The calendar in a right-to-left layout with Arabic names: the weeks run from right to left, the title moves to the right edge and the arrows to the left, while the chevron after the title stays on its right, before the text. The wrapper carries \`dir="rtl"\`; the direction also comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <Calendar
    locale="ar-SA"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
  />
</div>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const today = now();
    const [selectedDate, setSelectedDate] = useState<DateTime>(today.set({
      day: today.day === 15 ? 16 : 15
    }));
    return <div style={{
      // Calendar container
      "--calendar-bg": "#e6f3fb",
      "--calendar-border": "#0082c9",
      "--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
      "--calendar-radius": "12px",
      "--calendar-padding": "24px",
      "--calendar-width": "340px",
      "--calendar-height": "360px",
      // Title
      "--calendar-title": "#0082c9",
      "--calendar-title-size": "16px",
      // Navigation arrows
      "--calendar-outline": "#0082c9",
      "--calendar-arrow": "#0082c9",
      "--calendar-disabled-arrow": "#cce5f6",
      // Weekday labels
      "--calendar-weekday": "#0082c9",
      // Date items
      "--calendar-accent": "#0082c9",
      "--calendar-selected-text": "#ffffff",
      "--calendar-current-radius": "8px",
      "--calendar-focused-radius": "8px",
      "--calendar-focused-bg": "#ffffff",
      "--calendar-focused-text": "#0082c9",
      "--calendar-hover-bg": "#cce5f6",
      "--calendar-hover-radius": "8px",
      "--calendar-past": "#5ab4e5",
      "--calendar-disabled": "#cce5f6"
    } as React.CSSProperties}>
        <Calendar locale="en" selectedDate={selectedDate} setSelectedDate={setSelectedDate} minDate={today.startOf("month")} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The calendar opens with a selected day other than today, so the today and selected-day variables both show, and with \\\`minDate\\\` at the start of this month, so the days of the previous month and the left arrow show their disabled colours. Hover a day and an arrow to see the hover variables.\`
      },
      source: {
        code: \`<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-radius": "12px",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-focused-bg": "#ffffff",
    "--calendar-hover-bg": "#cce5f6",
    "--calendar-past": "#5ab4e5",
    "--calendar-disabled": "#cce5f6",
  }}
>
  <Calendar
    locale="en"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    minDate={startOfThisMonth}
  />
</div>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}}})))()}C();export{x as CssCustomization,p as Default,v as LocaleExamples,b as RightToLeft,h as WithDateConstraints,S as __namedExportsOrder,u as default};