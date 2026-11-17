import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Textarea } from ".";

describe("<Textarea />", () => {
  it("passes the input-assistance attributes to the field", () => {
    render(
      <Textarea
        value=""
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
      />,
    );

    const field = screen.getByTestId("textarea");
    expect(field).toHaveAttribute("spellcheck", "false");
    expect(field).toHaveAttribute("autocorrect", "off");
    expect(field).toHaveAttribute("autocapitalize", "off");
    expect(field).toHaveAttribute("autocomplete", "off");
  });

  it("leaves the input-assistance attributes to the browser by default", () => {
    render(<Textarea value="" />);

    const field = screen.getByTestId("textarea");
    for (const attribute of [
      "spellcheck",
      "autocorrect",
      "autocapitalize",
      "autocomplete",
    ]) {
      expect(field).not.toHaveAttribute(attribute);
    }
  });
});
