import React from "react";
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Settings } from "luxon";
import { getWeekdayElements } from "./index";

describe("getWeekdayElements", () => {
  beforeAll(() => {
    Settings.defaultLocale = "en-US";
  });

  it("should render weekday names", () => {
    const elements = getWeekdayElements();
    render(<>{elements}</>);

    const m = screen.getAllByText("M");
    expect(m.length).toBeGreaterThan(0);

    const t = screen.getAllByText("T");
    expect(t.length).toBeGreaterThan(1); // Tue, Thu
  });
});
