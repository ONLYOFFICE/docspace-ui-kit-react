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

import React from "react";
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";

import {
	addToDate,
	createDateTime,
	now,
	parseToDateTime,
	startOf,
} from "../../utils/date";

import { DatePicker } from ".";

const meta = {
	title: "UI/Form controls/DatePicker",
	component: DatePicker,
	parameters: {
		docs: {
			description: {
				component: `Date picker component that allows users to select dates from a calendar popup with configurable date ranges and locale support.

### Features

- **Calendar Popup**: Visual calendar for date selection
- **Date Ranges**: Configurable minimum and maximum selectable dates
- **Locale Support**: Calendar formatting based on locale
- **Calendar Icon**: Optional calendar icon in the selected date chip
- **Selected Date Chip**: Displays the chosen date as a removable chip
- **Auto-Positioning**: Automatically adjusts calendar position based on available space

### Usage

\`\`\`tsx
import { DatePicker } from "@docspace/ui-kit/components/date-picker";

<DatePicker
  locale="en"
  openDate={now()}
  onChange={(date) => console.log(date)}
  selectDateText="Select date"
/>

// With date constraints
<DatePicker
  locale="en"
  openDate={now()}
  minDate={now()}
  maxDate={addToDate(now(), 1, "years")}
  onChange={handleDateChange}
/>
\`\`\``,
			},
		},
	},
	argTypes: {
		locale: {
			control: "text",
			description: "Locale for date formatting (e.g., 'en', 'ru')",
		},
		selectDateText: {
			control: "text",
			description: "Placeholder text when no date is selected",
		},
		showCalendarIcon: {
			control: "boolean",
			description: "Show calendar icon in the selected date chip",
			table: {
				defaultValue: { summary: "true" },
			},
		},
		hideCross: {
			control: "boolean",
			description: "Hide the close/remove button on the selected date chip",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		autoPosition: {
			control: "boolean",
			description:
				"Auto-position the calendar based on available viewport space",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof DatePicker>;

type Story = StoryObj<ComponentProps<typeof DatePicker>>;

export default meta;

const DatePickerWrapper = (props: { children: React.ReactNode }) => {
	return (
		<div style={{ height: "350px", padding: "20px" }}>{props.children}</div>
	);
};

const ControlledDatePicker = (
	props: Omit<ComponentProps<typeof DatePicker>, "onChange"> & {
		onChange?: (d: null | DateTime) => void;
	},
) => {
	const { initialDate, onChange, ...rest } = props;
	const [selectedDate, setSelectedDate] = useState<DateTime | null>(
		initialDate ? parseToDateTime(initialDate) : null,
	);

	return (
		<DatePickerWrapper>
			<DatePicker
				{...rest}
				initialDate={initialDate}
				onChange={(date) => {
					setSelectedDate(date);
					onChange?.(date);
				}}
				outerDate={selectedDate}
			/>
		</DatePickerWrapper>
	);
};

export const Default: Story = {
	render: (args) => <ControlledDatePicker {...args} />,
	args: {
		locale: "en",
		openDate: now(),
		maxDate: startOf(
			addToDate(now(), 10, "years") as DateTime,
			"year",
		) as DateTime,
		minDate: createDateTime(1970, 1, 1),
		selectDateText: "Select date",
		showCalendarIcon: true,
	},
};

const WithInitialDateTemplate = () => {
	return (
		<ControlledDatePicker
			locale="en"
			openDate={now()}
			initialDate={now()}
			maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
			minDate={createDateTime(1970, 1, 1)}
			selectDateText="Date with initial value"
		/>
	);
};

export const WithInitialDate: Story = {
	render: () => <WithInitialDateTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"DatePicker initialized with the current date. The selected date appears as a chip that can be removed.",
			},
			source: {
				code: `<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Date with initial value"
/>`,
			},
		},
	},
};

const FutureDatesOnlyTemplate = () => {
	return (
		<ControlledDatePicker
			locale="en"
			openDate={now()}
			minDate={startOf(now(), "day") as DateTime}
			maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
			selectDateText="Only future dates"
		/>
	);
};

export const FutureDatesOnly: Story = {
	render: () => <FutureDatesOnlyTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Restricts selection to future dates only by setting minDate to today. Past dates appear disabled in the calendar.",
			},
			source: {
				code: `<DatePicker
  locale="en"
  openDate={now()}
  minDate={startOf(now(), "day")}
  selectDateText="Only future dates"
/>`,
			},
		},
	},
};

const SpecificYearTemplate = () => {
	return (
		<ControlledDatePicker
			locale="en"
			openDate={createDateTime(2023, 6, 15)}
			minDate={createDateTime(2023, 1, 1)}
			maxDate={createDateTime(2023, 12, 31)}
			selectDateText="Only dates from 2023"
		/>
	);
};

export const SpecificYearRange: Story = {
	render: () => <SpecificYearTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Constrains the calendar to a specific year (2023). Only dates within January 1 - December 31, 2023 are selectable.",
			},
			source: {
				code: `<DatePicker
  locale="en"
  openDate={createDateTime(2023, 6, 15)}
  minDate={createDateTime(2023, 1, 1)}
  maxDate={createDateTime(2023, 12, 31)}
  selectDateText="Only dates from 2023"
/>`,
			},
		},
	},
};

const WithoutCalendarIconTemplate = () => {
	return (
		<ControlledDatePicker
			locale="en"
			openDate={now()}
			initialDate={now()}
			maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
			minDate={createDateTime(1970, 1, 1)}
			selectDateText="No calendar icon"
			showCalendarIcon={false}
		/>
	);
};

export const WithoutCalendarIcon: Story = {
	render: () => <WithoutCalendarIconTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"The calendar icon in the selected date chip can be hidden with showCalendarIcon={false}.",
			},
			source: {
				code: `<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  showCalendarIcon={false}
  selectDateText="No calendar icon"
/>`,
			},
		},
	},
};

export const CssCustomization: Story = {
	render: () => (
		<div
			style={
				{
					height: "350px",
					padding: "20px",
					// DatePicker container
					"--date-picker-bg": "#e6f3fb",
					"--date-picker-header-border": "1px solid #0082c9",
					"--date-picker-padding": "0 16px 16px",
					"--date-picker-body-padding": "12px 0",
					// Calendar sub-component
					"--calendar-bg": "#e6f3fb",
					"--calendar-border": "#0082c9",
					"--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
					"--calendar-radius": "12px",
					"--calendar-title": "#0082c9",
					"--calendar-outline": "#0082c9",
					"--calendar-arrow": "#0082c9",
					"--calendar-weekday": "#0082c9",
					"--calendar-accent": "#0082c9",
					"--calendar-hover-bg": "#cce5f6",
					// AddButton sub-component
					"--add-button-background": "#e6f3fb",
					"--add-button-icon": "#0082c9",
					// SelectedItem sub-component
					"--selected-item-background": "#cce5f6",
					"--selected-item-background-hover": "#b3d9f0",
					"--selected-item-active-background": "#0082c9",
					"--selected-item-active-color": "#ffffff",
					// IconButton (used in SelectedItem close button)
					"--icon-button-color": "#0082c9",
					"--icon-button-hover-color": "#006fa6",
				} as React.CSSProperties
			}
		>
			<ControlledDatePicker
				locale="en"
				openDate={now()}
				initialDate={now()}
				maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
				minDate={createDateTime(1970, 1, 1)}
				selectDateText="Select date"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"CSS custom property overrides applied to the date picker and its Calendar, AddButton, and SelectedItem sub-components.",
			},
		},
	},
};
