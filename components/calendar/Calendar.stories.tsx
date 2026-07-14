/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState } from "react";

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

export const CssCustomization: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<DateTime>(now());
    return (
      <div
        style={
          {
            // Calendar container
            "--calendar-bg": "#e6f3fb",
            "--calendar-border": "#0082c9",
            "--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
            "--calendar-radius": "12px",
            "--calendar-padding": "24px",
            "--calendar-width": "340px",
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
            "--calendar-hover-bg": "#cce5f6",
            "--calendar-past": "#5ab4e5",
            "--calendar-disabled": "#cce5f6",
          } as React.CSSProperties
        }
      >
        <Calendar
          locale="en"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          initialDate={new Date()}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "CSS custom property overrides applied to the calendar container.",
      },
    },
  },
};
