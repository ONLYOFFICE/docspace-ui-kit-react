import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getWeekdayElements } from "./getWeekdayElements";

describe("getWeekdayElements", () => {
    it("should render weekday names", () => {
        const elements = getWeekdayElements();
        render(<>{elements}</>);
        
        const m = screen.getAllByText("M");
        expect(m.length).toBeGreaterThan(0);
        
        const t = screen.getAllByText("T");
        expect(t.length).toBeGreaterThan(1); // Tue, Thu
    });
});
