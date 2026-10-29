import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

describe("Card", () => {
  it("adds no banner or contentinfo landmark to the page", () => {
    render(
      <Card title="Backup" footer={<span>Footer</span>}>
        Body
      </Card>,
    );

    // Testing Library maps every <header> to banner, ignoring the HTML-AAM
    // scoping rule browsers apply, so assert the scope itself: a header or
    // footer inside sectioning content is not a page landmark.
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("SECTION");
    expect(card.querySelector(":scope > header")).not.toBeNull();
    expect(card.querySelector(":scope > footer")).not.toBeNull();
  });

  it("renders a string title as an h3 heading", () => {
    render(<Card title="Backup storage">Body</Card>);

    expect(
      screen.getByRole("heading", { level: 3, name: "Backup storage" }),
    ).toBeInTheDocument();
  });

  it("renders a string title at the level asked for", () => {
    render(
      <Card title="Backup storage" titleLevel={2}>
        Body
      </Card>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Backup storage" }),
    ).toBeInTheDocument();
  });

  it("renders a node title as given, without wrapping it in a heading", () => {
    render(
      <Card title={<h2>Own heading</h2>} titleLevel={4}>
        Body
      </Card>,
    );

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(1);
    expect(headings[0].tagName).toBe("H2");
  });
});
