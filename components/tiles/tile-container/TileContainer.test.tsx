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

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { TileContainer } from ".";
import { TileItem } from "./TileContainer.types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./TileContainer.module.scss", () => ({
  default: {
    tileContainer: "tileContainer",
    gridWrapper: "gridWrapper",
    tileItemWrapper: "tileItemWrapper",
    folder: "folder",
    file: "file",
    room: "room",
    template: "template",
    folders: "folders",
    files: "files",
    rooms: "rooms",
    templates: "templates",
    header: "header",
    isDesc: "isDesc",
    noSelect: "noSelect",
  },
}));

vi.mock("../../heading", () => ({
  Heading: ({ children, ...props }: { children: React.ReactNode }) => (
    <h3 {...props}>{children}</h3>
  ),
  HeadingSize: {
    xsmall: "xsmall",
  },
}));

describe("TileContainer", () => {
  const MockTile = ({ item }: { item: TileItem }) => (
    <div data-testid={`tile-${item.id}`}>{item.title}</div>
  );

  it("renders container correctly", () => {
    render(
      <TileContainer>
        <MockTile item={{ id: "1", title: "File 1" }} />
      </TileContainer>,
    );
    expect(screen.getByTestId("tile-1")).toBeTruthy();
  });

  it("renders with custom id", () => {
    const { container } = render(
      <TileContainer id="custom-container">
        <MockTile item={{ id: "1", title: "File 1" }} />
      </TileContainer>,
    );
    const element = container.querySelector("#custom-container");
    expect(element).toBeTruthy();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <TileContainer className="custom-class">
        <MockTile item={{ id: "1", title: "File 1" }} />
      </TileContainer>,
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });

  it("separates folders and files correctly", () => {
    render(
      <TileContainer headingFolders="Folders" headingFiles="Files">
        <MockTile item={{ id: "1", title: "Folder 1", isFolder: true }} />
        <MockTile item={{ id: "2", title: "File 1", fileExst: ".docx" }} />
      </TileContainer>,
    );

    expect(screen.getByText("Folders")).toBeTruthy();
    expect(screen.getByText("Files")).toBeTruthy();
  });

  it("renders rooms separately", () => {
    render(
      <TileContainer>
        <MockTile item={{ id: "1", title: "Room 1", isRoom: true }} />
      </TileContainer>,
    );
    expect(screen.getByTestId("tile-1")).toBeTruthy();
  });

  it("renders templates separately", () => {
    render(
      <TileContainer>
        <MockTile item={{ id: "1", title: "Template 1", isTemplate: true }} />
      </TileContainer>,
    );
    expect(screen.getByTestId("tile-1")).toBeTruthy();
  });

  it("applies noSelect class when noSelect is true", () => {
    const { container } = render(
      <TileContainer noSelect>
        <MockTile item={{ id: "1", title: "File 1" }} />
      </TileContainer>,
    );
    const element = container.querySelector("[class*='noSelect']");
    expect(element).toBeTruthy();
  });

  it("renders heading for folders when folders exist", () => {
    render(
      <TileContainer headingFolders="My Folders">
        <MockTile item={{ id: "1", title: "Folder 1", isFolder: true }} />
      </TileContainer>,
    );
    expect(screen.getByText("My Folders")).toBeTruthy();
  });

  it("renders heading for files when files exist", () => {
    render(
      <TileContainer headingFiles="My Files">
        <MockTile item={{ id: "1", title: "File 1", fileExst: ".docx" }} />
      </TileContainer>,
    );
    expect(screen.getByText("My Files")).toBeTruthy();
  });

  it("handles empty children gracefully", () => {
    const { container } = render(<TileContainer>{null}</TileContainer>);
    const tileContainer = container.querySelector("[class*='tileContainer']");
    expect(tileContainer).toBeTruthy();
  });

  it("applies isDesc class to headers when isDesc is true", () => {
    const { container } = render(
      <TileContainer headingFiles="Files" isDesc>
        <MockTile item={{ id: "1", title: "File 1", fileExst: ".docx" }} />
      </TileContainer>,
    );
    const header = container.querySelector("[class*='isDesc']");
    expect(header).toBeTruthy();
  });

  it("renders multiple files in grid wrapper", () => {
    const { container } = render(
      <TileContainer>
        <MockTile item={{ id: "1", title: "File 1", fileExst: ".docx" }} />
        <MockTile item={{ id: "2", title: "File 2", fileExst: ".xlsx" }} />
      </TileContainer>,
    );
    const gridWrapper = container.querySelector("[class*='gridWrapper']");
    expect(gridWrapper).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    const { container } = render(
      <TileContainer style={customStyle}>
        <MockTile item={{ id: "1", title: "File 1" }} />
      </TileContainer>,
    );
    const tileContainer = container.querySelector("[class*='tileContainer']");
    expect(tileContainer?.getAttribute("style")).toContain("background-color");
  });
});
