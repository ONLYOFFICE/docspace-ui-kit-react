import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,c as i,i as a,l as o,s,t as c,u as l}from"./dateArithmetic-Bwpb7u1g.js";import{n as u,t as d}from"./date-picker-CDPnFX_p.js";var f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{t(),f=t(),a(),i(),u(),p=n(),m={title:`UI/Form controls/DatePicker`,component:d,parameters:{},argTypes:{locale:{control:`text`,description:`Locale the calendar writes its month names and weekdays in (e.g. 'en', 'de'); the chip always shows the date as '15 Sep 2026'`},selectDateText:{control:`text`,description:`Text of the button shown while no date is chosen`,table:{defaultValue:{summary:`"Select date"`}}},showCalendarIcon:{control:`boolean`,description:`Show calendar icon in the selected date chip`,table:{defaultValue:{summary:`true`}}},hideCross:{control:`boolean`,description:`Hide the close/remove button on the selected date chip`,table:{defaultValue:{summary:`false`}}},autoPosition:{control:`boolean`,description:`Opens the calendar against the right edge of the picker's positioned ancestor when less than 340px of the window is left to the picker's right; measured each time the calendar opens`,table:{defaultValue:{summary:`false`}}},openDate:{control:!1,description:"Month the calendar shows each time it opens, even with a date already chosen; a month outside `minDate` to `maxDate` is replaced by the nearest limit"},minDate:{control:!1,description:`Earliest selectable day; the days before it are drawn disabled`},maxDate:{control:!1,description:`Latest selectable day; the days after it are drawn disabled`},initialDate:{control:!1,description:"Date the picker starts with; cleared on the first render unless `outerDate` holds a date too"},outerDate:{control:!1,description:`The chosen date, held by the host: the chip shows it, and the picker shows the button again whenever it is empty`},onChange:{action:`onChange`,description:"Called with the picked day, and with `null` when the chip's cross clears it"},isMobile:{control:`boolean`,description:`Widens the gap between the calendar's previous and next arrows from 8px to 12px; the larger day cells of a phone come from the window width, not from this prop`,table:{defaultValue:{summary:`false`}}},useMaxTime:{control:`boolean`,description:`Reports a day picked while no date is chosen at 23:59:59.999 of that day instead of at the current time of day`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class name added to the outermost element`},id:{control:`text`,description:`Id of the outermost element`},testId:{control:`text`,description:"`data-testid` of the outermost element",table:{defaultValue:{summary:`"date-picker"`}}}}},h=e=>(0,p.jsx)(`div`,{style:{height:`350px`,padding:`20px`},children:e.children}),g=e=>{let{initialDate:t,onChange:n,...r}=e,[i,a]=(0,f.useState)(t?l(t):null);return(0,p.jsx)(h,{children:(0,p.jsx)(d,{...r,initialDate:t,onChange:e=>{a(e),n?.(e)},outerDate:i})})},_={render:e=>(0,p.jsx)(g,{...e}),args:{locale:`en`,openDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Select date`,showCalendarIcon:!0},parameters:{docs:{description:{story:`The picker as a form shows it before a date is chosen: click **Select date** to open the calendar, pick a day to turn the button into a chip, and change any other prop live in the Controls panel below.`},source:{code:`const [date, setDate] = useState<DateTime | null>(null);

<DatePicker
  locale="en"
  openDate={now()}
  minDate={createDateTime(1970, 1, 1)}
  maxDate={startOf(addToDate(now(), 10, "years"), "year")}
  outerDate={date}
  onChange={setDate}
  selectDateText="Select date"
/>`}}}},v=()=>(0,p.jsx)(g,{locale:`en`,openDate:o(),initialDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Date with initial value`}),y={render:()=>(0,p.jsx)(v,{}),parameters:{docs:{description:{story:`DatePicker initialized with the current date. The selected date appears as a chip that can be removed.`},source:{code:`const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Date with initial value"
  outerDate={date}
  onChange={setDate}
/>`}}}},b=()=>(0,p.jsx)(g,{locale:`en`,openDate:o(),minDate:r(o(),`day`),maxDate:r(c(o(),10,`years`),`year`),selectDateText:`Only future dates`}),x={render:()=>(0,p.jsx)(b,{}),parameters:{docs:{description:{story:`Restricts selection to future dates only by setting minDate to today. Past dates appear disabled in the calendar.`},source:{code:`<DatePicker
  locale="en"
  openDate={now()}
  minDate={startOf(now(), "day")}
  selectDateText="Only future dates"
  outerDate={date}
  onChange={setDate}
/>`}}}},S=()=>(0,p.jsx)(g,{locale:`en`,openDate:s(2023,6,15),minDate:s(2023,1,1),maxDate:s(2023,12,31),selectDateText:`Only dates from 2023`}),C={render:()=>(0,p.jsx)(S,{}),parameters:{docs:{description:{story:`Constrains the calendar to a specific year (2023). Only dates within January 1 - December 31, 2023 are selectable.`},source:{code:`<DatePicker
  locale="en"
  openDate={createDateTime(2023, 6, 15)}
  minDate={createDateTime(2023, 1, 1)}
  maxDate={createDateTime(2023, 12, 31)}
  selectDateText="Only dates from 2023"
  outerDate={date}
  onChange={setDate}
/>`}}}},w=()=>(0,p.jsx)(g,{locale:`en`,openDate:o(),initialDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`No calendar icon`,showCalendarIcon:!1}),T={render:()=>(0,p.jsx)(w,{}),parameters:{docs:{description:{story:`The calendar icon in the selected date chip can be hidden with showCalendarIcon={false}.`},source:{code:`<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  showCalendarIcon={false}
  selectDateText="No calendar icon"
  outerDate={date}
  onChange={setDate}
/>`}}}},E=()=>(0,p.jsx)(g,{locale:`en`,openDate:o(),initialDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Select date`,hideCross:!0}),D={render:()=>(0,p.jsx)(E,{}),parameters:{docs:{description:{story:"For a date the form requires: the chip has no cross, so a date can be replaced by clicking the chip and picking another day, but not removed (`hideCross`)."},source:{code:`const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  outerDate={date}
  onChange={setDate}
  hideCross
/>`}}}},O=()=>(0,p.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`},children:(0,p.jsx)(g,{locale:`en`,openDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Select date`,autoPosition:!0})}),k={render:()=>(0,p.jsx)(O,{}),parameters:{docs:{description:{story:"For a picker near the right edge of the window, such as the last column of a toolbar: click **Select date** and the calendar opens leftwards from the right edge of the nearest positioned container, here the window, instead of running off the screen (`autoPosition`)."},source:{code:`<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
    autoPosition
  />
</div>`}}}},A=()=>{let[e,t]=(0,f.useState)(null);return(0,p.jsxs)(`div`,{children:[(0,p.jsxs)(`div`,{style:{padding:`20px 20px 0`},children:[`Reported value: `,e?e.toISO():`none`]}),(0,p.jsx)(g,{locale:`en`,openDate:o(),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Select date`,useMaxTime:!0,onChange:t})]})},j={render:()=>(0,p.jsx)(A,{}),parameters:{docs:{description:{story:'For an inclusive end of a period, such as a "valid until" date: pick a day and the value above ends in 23:59:59.999, so the whole day is covered (`useMaxTime`). Without the prop the day is reported at the current time of day.'},source:{code:`<DatePicker
  locale="en"
  openDate={now()}
  outerDate={date}
  onChange={setDate}
  useMaxTime
/>`}}}},M={render:()=>(0,p.jsx)(`div`,{dir:`rtl`,children:(0,p.jsx)(g,{locale:`en`,openDate:o(),initialDate:s(2026,3,15),maxDate:r(c(o(),10,`years`),`year`),minDate:s(1970,1,1),selectDateText:`Select date`})}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`470px`},description:{story:'The picker under a right-to-left interface: the chip starts at the right edge, with the calendar icon on its right and the cross on its left, and the calendar opens under the right end of the picker. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>`}}}},N={"--calendar-bg":`#e6f3fb`,"--calendar-border":`#0082c9`,"--calendar-shadow":`0 4px 16px rgba(0,130,201,0.25)`,"--calendar-radius":`12px`,"--calendar-title":`#0082c9`,"--calendar-title-size":`16px`,"--calendar-outline":`#0082c9`,"--calendar-arrow":`#0082c9`,"--calendar-disabled-arrow":`#a0c8e8`,"--calendar-weekday":`#0082c9`,"--calendar-accent":`#0082c9`,"--calendar-selected-text":`#ffffff`,"--calendar-current-radius":`8px`,"--calendar-focused-radius":`8px`,"--calendar-focused-bg":`#ffffff`,"--calendar-focused-text":`#0082c9`,"--calendar-hover-bg":`#cce5f6`,"--calendar-hover-radius":`8px`,"--calendar-past":`#5ca8d9`,"--calendar-disabled":`#a0c8e8`,"--add-button-bg":`#cce5f6`,"--add-button-bg-hover":`#b3d9f0`,"--add-button-bg-active":`#99cceb`,"--add-button-icon-color":`#0082c9`,"--add-button-icon-color-hover":`#004f82`,"--add-button-radius":`8px`,"--selected-item-bg":`#cce5f6`,"--selected-item-bg-hover":`#b3d9f0`,"--selected-item-radius":`8px`},P={render:()=>(0,p.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,...N},children:[(0,p.jsx)(g,{locale:`en`,openDate:r(o(),`month`),initialDate:r(o(),`month`),minDate:r(o(),`month`),maxDate:r(c(o(),10,`years`),`year`),selectDateText:`Select date`}),(0,p.jsx)(g,{locale:`en`,openDate:o(),minDate:r(o(),`month`),maxDate:r(c(o(),10,`years`),`year`),selectDateText:`Select date`})]}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. They are set on one wrapper around two pickers. The first holds the first day of this month, so it shows the chip; the second has no date, so it shows the **Select date** button. Open either calendar to see the calendar variables: both start at the first of this month (`minDate`), so the days of the previous month and the left arrow show their disabled colours, and the first picker's chosen day differs from today. Hover the chip, the button and a day to see the hover variables."},source:{code:`<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
    "--add-button-bg": "#cce5f6",
    "--add-button-icon-color": "#0082c9",
    "--selected-item-bg": "#cce5f6",
    "--selected-item-radius": "8px",
  }}
>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>`}}}},F=[`Default`,`WithInitialDate`,`FutureDatesOnly`,`SpecificYearRange`,`WithoutCalendarIcon`,`WithoutClearButton`,`AlignedToRightEdge`,`EndOfDayValue`,`RightToLeft`,`CssCustomization`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <ControlledDatePicker {...args} />,
  args: {
    locale: "en",
    openDate: now(),
    maxDate: startOf(addToDate(now(), 10, "years") as DateTime, "year") as DateTime,
    minDate: createDateTime(1970, 1, 1),
    selectDateText: "Select date",
    showCalendarIcon: true
  },
  parameters: {
    docs: {
      description: {
        story: "The picker as a form shows it before a date is chosen: click **Select date** to open the calendar, pick a day to turn the button into a chip, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`const [date, setDate] = useState<DateTime | null>(null);

<DatePicker
  locale="en"
  openDate={now()}
  minDate={createDateTime(1970, 1, 1)}
  maxDate={startOf(addToDate(now(), 10, "years"), "year")}
  outerDate={date}
  onChange={setDate}
  selectDateText="Select date"
/>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <WithInitialDateTemplate />,
  parameters: {
    docs: {
      description: {
        story: "DatePicker initialized with the current date. The selected date appears as a chip that can be removed."
      },
      source: {
        code: \`const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Date with initial value"
  outerDate={date}
  onChange={setDate}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <FutureDatesOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Restricts selection to future dates only by setting minDate to today. Past dates appear disabled in the calendar."
      },
      source: {
        code: \`<DatePicker
  locale="en"
  openDate={now()}
  minDate={startOf(now(), "day")}
  selectDateText="Only future dates"
  outerDate={date}
  onChange={setDate}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <SpecificYearTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Constrains the calendar to a specific year (2023). Only dates within January 1 - December 31, 2023 are selectable."
      },
      source: {
        code: \`<DatePicker
  locale="en"
  openDate={createDateTime(2023, 6, 15)}
  minDate={createDateTime(2023, 1, 1)}
  maxDate={createDateTime(2023, 12, 31)}
  selectDateText="Only dates from 2023"
  outerDate={date}
  onChange={setDate}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <WithoutCalendarIconTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The calendar icon in the selected date chip can be hidden with showCalendarIcon={false}."
      },
      source: {
        code: \`<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  showCalendarIcon={false}
  selectDateText="No calendar icon"
  outerDate={date}
  onChange={setDate}
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <WithoutClearButtonTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a date the form requires: the chip has no cross, so a date can be replaced by clicking the chip and picking another day, but not removed (\`hideCross\`)."
      },
      source: {
        code: \`const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  outerDate={date}
  onChange={setDate}
  hideCross
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <AlignedToRightEdgeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a picker near the right edge of the window, such as the last column of a toolbar: click **Select date** and the calendar opens leftwards from the right edge of the nearest positioned container, here the window, instead of running off the screen (\`autoPosition\`)."
      },
      source: {
        code: \`<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
    autoPosition
  />
</div>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <EndOfDayValueTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'For an inclusive end of a period, such as a "valid until" date: pick a day and the value above ends in 23:59:59.999, so the whole day is covered (\`useMaxTime\`). Without the prop the day is reported at the current time of day.'
      },
      source: {
        code: \`<DatePicker
  locale="en"
  openDate={now()}
  outerDate={date}
  onChange={setDate}
  useMaxTime
/>\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <ControlledDatePicker locale="en" openDate={now()} initialDate={createDateTime(2026, 3, 15)} maxDate={startOf(addToDate(now(), 10, "years")!, "year")!} minDate={createDateTime(1970, 1, 1)} selectDateText="Select date" />
    </div>,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "470px"
      },
      description: {
        story: 'The picker under a right-to-left interface: the chip starts at the right edge, with the calendar icon on its right and the cross on its left, and the calendar opens under the right end of the picker. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexWrap: "wrap",
    ...cssVariables
  }}>
      <ControlledDatePicker locale="en" openDate={startOf(now(), "month") as DateTime} initialDate={startOf(now(), "month") as DateTime} minDate={startOf(now(), "month") as DateTime} maxDate={startOf(addToDate(now(), 10, "years")!, "year")!} selectDateText="Select date" />
      <ControlledDatePicker locale="en" openDate={now()} minDate={startOf(now(), "month") as DateTime} maxDate={startOf(addToDate(now(), 10, "years")!, "year")!} selectDateText="Select date" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. They are set on one wrapper around two pickers. The first holds the first day of this month, so it shows the chip; the second has no date, so it shows the **Select date** button. Open either calendar to see the calendar variables: both start at the first of this month (\\\`minDate\\\`), so the days of the previous month and the left arrow show their disabled colours, and the first picker's chosen day differs from today. Hover the chip, the button and a day to see the hover variables.\`
      },
      source: {
        code: \`<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
    "--add-button-bg": "#cce5f6",
    "--add-button-icon-color": "#0082c9",
    "--selected-item-bg": "#cce5f6",
    "--selected-item-radius": "8px",
  }}
>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}}})))()}I();export{k as AlignedToRightEdge,P as CssCustomization,_ as Default,j as EndOfDayValue,x as FutureDatesOnly,M as RightToLeft,C as SpecificYearRange,y as WithInitialDate,T as WithoutCalendarIcon,D as WithoutClearButton,F as __namedExportsOrder,m as default};