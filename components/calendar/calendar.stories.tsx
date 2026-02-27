// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useState } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";

import { now } from "../../utils/date";

import { Calendar } from ".";

const locales = [
  "az",
  "ar-SA",
  "zh-cn",
  "cs",
  "nl",
  "en-gb",
  "en",
  "fi",
  "fr",
  "de",
  "de-ch",
  "el",
  "it",
  "ja",
  "ko",
  "lv",
  "pl",
  "pt",
  "pt-br",
  "ru",
  "sk",
  "sl",
  "es",
  "tr",
  "uk",
  "vi",
];

const meta = {
  title: "UI/Interactive elements/Calendar",
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component: `Calendar component for selecting dates. Displays a monthly view with navigation between months and years.

### Features

- **Date Selection**: Click to select a specific date
- **Month/Year Navigation**: Browse through months and years
- **Locale Support**: Supports 25+ locales for date formatting and weekday names
- **Date Range Constraints**: Configurable min/max date boundaries
- **Initial Date**: Set the initially visible month/year
- **Custom Styling**: Accepts className and inline styles

### Usage

\`\`\`tsx
import { Calendar } from "@docspace/ui-kit/components/calendar";

// Basic usage
<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>

// With date constraints
<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2024/01/01")}
  maxDate={new Date("2030/01/01")}
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=651-4406&mode=design&t=RrB9MOQGCnUPghij-0",
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: locales,
      description: "Specifies the calendar locale",
      table: {
        defaultValue: { summary: "en" },
      },
    },
    minDate: {
      control: "date",
      description: "Specifies the minimum selectable date",
    },
    maxDate: {
      control: "date",
      description: "Specifies the maximum selectable date",
    },
    initialDate: {
      control: "date",
      description: "First shown date when the calendar opens",
    },
    isMobile: {
      control: "boolean",
      description: "Enables mobile-optimized layout",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS class for the calendar container",
    },
    onChange: {
      action: "onChange",
      description: "Callback function called when the selected date changes",
    },
  },
} satisfies Meta<typeof Calendar>;

type Story = StoryObj<ComponentProps<typeof Calendar>>;

export default meta;

const InteractiveCalendar = ({
  locale,
  minDate,
  maxDate,
  initialDate,
  isMobile,
  className,
  id,
}: {
  locale: string;
  minDate?: DateTime | Date;
  maxDate?: DateTime | Date;
  initialDate?: DateTime | Date;
  isMobile?: boolean;
  className?: string;
  id?: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  return (
    <Calendar
      locale={locale}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      minDate={minDate}
      maxDate={maxDate}
      initialDate={initialDate}
      isMobile={isMobile}
      className={className}
      id={id}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    locale: "en",
    maxDate: new Date(`${new Date().getFullYear() + 10}/01/01`),
    minDate: new Date("1970/01/01"),
    initialDate: new Date(),
  },
};

const WithDateConstraintsTemplate = () => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  const currentYear = new Date().getFullYear();
  return (
    <Calendar
      locale="en"
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      minDate={new Date(`${currentYear}/01/01`)}
      maxDate={new Date(`${currentYear}/12/31`)}
    />
  );
};

export const WithDateConstraints: Story = {
  render: () => <WithDateConstraintsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Calendar with min and max date constraints. Only dates within the current year are selectable.",
      },
      source: {
        code: `<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2026/01/01")}
  maxDate={new Date("2026/12/31")}
/>`,
      },
    },
  },
};

const LocaleCalendarItem = ({ locale }: { locale: string }) => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  return (
    <div>
      <div
        style={{
          marginBottom: "8px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {locale}
      </div>
      <Calendar
        locale={locale}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

const LocaleExamplesTemplate = () => {
  const sampleLocales = ["en", "ru", "de", "ja"];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: "24px",
      }}
    >
      {sampleLocales.map((locale) => (
        <LocaleCalendarItem key={locale} locale={locale} />
      ))}
    </div>
  );
};

export const LocaleExamples: Story = {
  render: () => <LocaleExamplesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Calendar rendered in different locales. Shows how month names, weekday headers, and date formatting adapt to each locale.",
      },
      source: {
        code: `<Calendar locale="en" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ru" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="de" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ja" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />`,
      },
    },
  },
};
