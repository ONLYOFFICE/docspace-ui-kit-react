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
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { TimePicker } from ".";

describe("<TimePicker />", () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  const baseProps = {
    initialTime: "2025-01-09T14:30:00",
    onChange: mockOnChange,
    onBlur: mockOnBlur,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    const { container } = render(<TimePicker {...baseProps} />);
    expect(container).toBeTruthy();
  });

  it("renders with correct initial time", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    expect(hoursInput.value).toBe("14");
    expect(minutesInput.value).toBe("30");
  });

  it("handles hours input correctly", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "15" } });
    expect(hoursInput.value).toBe("15");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("handles minutes input correctly", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "45" } });
    expect(minutesInput.value).toBe("45");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("validates hours input range", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "24" } });
    expect(hoursInput.value).toBe("02");
  });

  it("handles blur events", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes");
    fireEvent.focus(minutesInput);
    fireEvent.change(minutesInput, { target: { value: "59" } });
    fireEvent.blur(minutesInput);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<TimePicker {...baseProps} />);
    const timePicker = screen.getByRole("group");
    expect(timePicker).toHaveAttribute("aria-label", "Time picker");
    const hoursInput = screen.getByLabelText("Hours");
    expect(hoursInput).toHaveAttribute("data-test-id", "hours-input");
    const minutesInput = screen.getByLabelText("Minutes");
    expect(minutesInput).toHaveAttribute("data-test-id", "minutes-input");
  });

  it("automatically formats and blurs when entering a single digit > 5 in minutes", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "6" } });

    expect(minutesInput.value).toBe("06");
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("prevents context menu on inputs", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours");
    const minutesInput = screen.getByLabelText("Minutes");

    const hoursEvent = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    const minutesEvent = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });

    fireEvent(hoursInput, hoursEvent);
    fireEvent(minutesInput, minutesEvent);

    expect(hoursEvent.defaultPrevented).toBe(true);
    expect(minutesEvent.defaultPrevented).toBe(true);
  });

  it("formats hours/minutes with leading zero on blur if single digit entered", () => {
    render(<TimePicker {...baseProps} initialTime="2025-01-09T14:30:00" />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "5" } });
    fireEvent.blur(hoursInput);
    expect(hoursInput.value).toBe("05");

    fireEvent.change(minutesInput, { target: { value: "3" } });
    fireEvent.blur(minutesInput);
    expect(minutesInput.value).toBe("03");
  });

  it("handles empty input in hours and minutes", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "" } });
    expect(hoursInput.value).toBe("00");

    fireEvent.change(minutesInput, { target: { value: "" } });
    expect(minutesInput.value).toBe("00");
  });

  it("blurs minutes input if length exceeds 2", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "blur");
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "123" } });

    expect(focusSpy).toHaveBeenCalled();
    expect(mockOnBlur).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("calls onBlur if minutes value exceeds 59", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "60" } });

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("renders correctly with default props", () => {
    const { container } = render(<TimePicker />);
    expect(container).toBeTruthy();

    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    fireEvent.change(hoursInput, { target: { value: "10" } });
    // Should not throw even if onChange is not provided
  });

  it("selects hours input when clicking on the container but not on minutes", () => {
    render(<TimePicker {...baseProps} />);
    const container = screen.getByTestId("time-picker");
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const selectSpy = vi.spyOn(hoursInput, "select");

    // Click on container (target is the div itself)
    fireEvent.click(container);

    expect(selectSpy).toHaveBeenCalled();
    selectSpy.mockRestore();
  });

  it("focuses minutes input if hours input length exceeds 2", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;
    const selectSpy = vi.spyOn(minutesInput, "select");

    fireEvent.change(hoursInput, { target: { value: "123" } });

    expect(selectSpy).toHaveBeenCalled();
    selectSpy.mockRestore();
  });
});
