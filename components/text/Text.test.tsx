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

import { screen, render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Text } from ".";

// Mock CSS modules - return default export for CSS Modules
vi.mock("./Text.module.scss", () => ({
  default: {
    text: "text",
    inline: "inline",
    italic: "italic",
    bold: "bold",
    noSelect: "noSelect",
    truncate: "truncate",
    autoDirSpan: "autoDirSpan",
    tile: "tile",
  },
}));

describe("Text Component", () => {
  describe("Basic Rendering", () => {
    it("renders text content", () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders with default props", () => {
      render(<Text>Default Text</Text>);
      const text = screen.getByTestId("text");
      expect(text).toBeInTheDocument();
      expect(text.className).toContain("text");
    });

    it("accepts custom className", () => {
      render(<Text className="custom-text">Text with class</Text>);
      const text = screen.getByTestId("text");
      expect(text.className).toContain("text");
      expect(text.className).toContain("custom-text");
    });

    it("accepts custom id", () => {
      render(<Text id="custom-id">Text with ID</Text>);
      expect(screen.getByTestId("text")).toHaveAttribute("id", "custom-id");
    });
  });

  describe("Styling Props", () => {
    it("applies custom fontSize", () => {
      render(<Text fontSize="16px">Large Text</Text>);
      expect(screen.getByTestId("text")).toHaveStyle({ fontSize: "16px" });
    });

    it("applies custom color", () => {
      render(<Text color="#FF0000">Red Text</Text>);
      expect(screen.getByTestId("text")).toHaveStyle({ color: "#FF0000" });
    });

    it("applies custom fontWeight", () => {
      render(<Text fontWeight={700}>Bold Text</Text>);
      expect(screen.getByTestId("text")).toHaveStyle({ fontWeight: 700 });
    });

    it("applies custom textAlign", () => {
      render(<Text textAlign="center">Centered Text</Text>);
      expect(screen.getByTestId("text")).toHaveStyle({ textAlign: "center" });
    });

    it("applies custom backgroundColor", () => {
      render(<Text backgroundColor="#F0F0F0">Text with background</Text>);
      expect(screen.getByTestId("text")).toHaveStyle({
        backgroundColor: "#F0F0F0",
      });
    });
  });

  describe("Element Type and Tag", () => {
    it("renders as different HTML elements using 'as' prop", () => {
      render(<Text as="h1">Heading Text</Text>);
      expect(screen.getByTestId("text").tagName).toBe("H1");
    });

    it("renders with custom tag", () => {
      render(<Text tag="span">Span Text</Text>);
      expect(screen.getByTestId("text").tagName).toBe("SPAN");
    });

    it("prefers 'as' prop over 'tag' prop", () => {
      render(
        <Text as="h2" tag="span">
          Mixed Props Text
        </Text>,
      );
      expect(screen.getByTestId("text").tagName).toBe("H2");
    });
  });

  describe("Interactive Features", () => {
    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Text onClick={handleClick}>Clickable Text</Text>);

      fireEvent.click(screen.getByText("Clickable Text"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders with title attribute", () => {
      const title = "Text Title";
      render(<Text title={title}>Hover Text</Text>);
      expect(screen.getByTestId("text")).toHaveAttribute("title", title);
    });
  });

  describe("CSS Module Classes", () => {
    it("applies inline display class", () => {
      render(<Text isInline>Inline Text</Text>);
      expect(screen.getByTestId("text").className).toContain("inline");
    });

    it("applies bold class", () => {
      render(<Text isBold>Bold Text</Text>);
      expect(screen.getByTestId("text").className).toContain("bold");
    });

    it("applies italic class", () => {
      render(<Text isItalic>Italic Text</Text>);
      expect(screen.getByTestId("text").className).toContain("italic");
    });

    it("applies noSelect class", () => {
      render(<Text noSelect>Non-selectable Text</Text>);
      expect(screen.getByTestId("text").className).toContain("noSelect");
    });

    it("applies truncate class", () => {
      render(<Text truncate>Truncated Text</Text>);
      expect(screen.getByTestId("text").className).toContain("truncate");
    });

    it("applies autoDirSpan class for auto direction", () => {
      render(<Text dir="auto">Auto Direction Text</Text>);
      const span = screen.getByText("Auto Direction Text");
      expect(span.className).toContain("autoDirSpan");
    });

    it("applies tile class for tile view", () => {
      render(
        <Text dir="auto" view="tile">
          Tile View Text
        </Text>,
      );
      const span = screen.getByText("Tile View Text");
      expect(span.className).toContain("autoDirSpan");
      expect(span.className).toContain("tile");
    });
  });

  describe("Style Combinations", () => {
    it("combines multiple CSS module classes", () => {
      render(
        <Text isInline isBold isItalic noSelect>
          Multi-styled Text
        </Text>,
      );
      const text = screen.getByTestId("text");
      expect(text.className).toContain("text");
      expect(text.className).toContain("inline");
      expect(text.className).toContain("bold");
      expect(text.className).toContain("italic");
      expect(text.className).toContain("noSelect");
    });

    it("combines CSS module classes with custom className", () => {
      render(
        <Text isInline isBold className="custom-class">
          Combined Classes Text
        </Text>,
      );
      const text = screen.getByTestId("text");
      expect(text.className).toContain("text");
      expect(text.className).toContain("inline");
      expect(text.className).toContain("bold");
      expect(text.className).toContain("custom-class");
    });
  });
});
