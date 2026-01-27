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

import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { Tabs } from ".";
import { TabsTypes } from "./Tabs.enums";
import { TTabItem } from "./Tabs.types";
import styles from "./Tabs.module.scss";

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor() {
    // Mock constructor
  }
}

// @ts-expect-error - Mocking IntersectionObserver for tests
window.IntersectionObserver = MockIntersectionObserver;

const arrayItems: TTabItem[] = [
  {
    id: "tab0",
    name: "Title1",
    content: (
      <div>
        <button type="button">BUTTON</button>
        <button type="button">BUTTON</button>
        <button type="button">BUTTON</button>
      </div>
    ),
  },
  {
    id: "tab1",
    name: "Title2",
    content: (
      <div>
        <label>LABEL</label>
        <label>LABEL</label>
        <label>LABEL</label>
      </div>
    ),
  },
];

describe("Tabs", () => {
  it("renders without errors", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab1" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders all tab items", () => {
    render(<Tabs items={arrayItems} selectedItemId="tab1" />);
    expect(screen.getByText("Title1")).toBeInTheDocument();
    expect(screen.getByText("Title2")).toBeInTheDocument();
  });

  it("shows correct content for selected tab", () => {
    render(<Tabs items={arrayItems} selectedItemId="tab1" />);
    const labels = screen.getAllByText("LABEL");
    expect(labels).toHaveLength(3);
  });

  it("applies correct styles for primary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Primary}
        selectedItemId="tab1"
      />,
    );
    expect(container.querySelector(`.${styles.primary}`)).toBeInTheDocument();
  });

  it("applies correct styles for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab1"
      />,
    );
    expect(container.querySelector(`.${styles.secondary}`)).toBeInTheDocument();
  });
  it("shows badge when provided", () => {
    const itemsWithBadge = [{ ...arrayItems[0], badge: "New" }, arrayItems[1]];
    render(<Tabs items={itemsWithBadge} selectedItemId="tab1" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies sticky styles when stickyTop is provided", () => {
    const { container } = render(
      <Tabs items={arrayItems} stickyTop="50px" selectedItemId="tab1" />,
    );
    const stickyElement = container.querySelector(".sticky");
    expect(stickyElement).toHaveStyle({ top: "50px" });
  });

  it("applies disabled state to tab", () => {
    const itemsWithDisabled = [
      arrayItems[0],
      { ...arrayItems[1], isDisabled: true },
    ];
    const { container } = render(
      <Tabs items={itemsWithDisabled} selectedItemId="tab0" />,
    );
    const disabledTab = container.querySelector(`.${styles.disabled}`);
    expect(disabledTab).toBeInTheDocument();
  });

  it("calls onSelect when tab is clicked", () => {
    const onSelectMock = vi.fn();
    render(
      <Tabs items={arrayItems} selectedItemId="tab0" onSelect={onSelectMock} />,
    );
    const tab = screen.getByTestId("tab1_tab");
    tab.click();
    expect(onSelectMock).toHaveBeenCalledWith(arrayItems[1]);
  });

  it("calls onClick when tab is clicked", () => {
    const onClickMock = vi.fn();
    const itemsWithOnClick = [
      arrayItems[0],
      { ...arrayItems[1], onClick: onClickMock },
    ];
    render(
      <Tabs items={itemsWithOnClick} selectedItemId="tab0" />,
    );
    const tab = screen.getByTestId("tab1_tab");
    tab.click();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        selectedItemId="tab0"
        className="custom-class"
      />,
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("hides sticky indent when withoutStickyIntend is true", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" withoutStickyIntend />,
    );
    const stickyIndent = container.querySelector(".sticky-indent");
    expect(stickyIndent).not.toBeInTheDocument();
  });

  it("shows sticky indent by default", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" />,
    );
    const stickyIndent = container.querySelector(".sticky-indent");
    expect(stickyIndent).toBeInTheDocument();
  });

  it("renders icon in secondary tabs", () => {
    const itemsWithIcon = [
      { ...arrayItems[0], iconName: "test-icon.svg" },
      arrayItems[1],
    ];
    const { container } = render(
      <Tabs
        items={itemsWithIcon}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
      />,
    );
    const icon = container.querySelector(`.${styles.tabIcon}`);
    expect(icon).toBeInTheDocument();
  });

  it("applies scaled styles for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
        scaled
      />,
    );
    expect(container.querySelector(`.${styles.scaled}`)).toBeInTheDocument();
  });

  it("applies custom id to tabs", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" id="custom-tabs-id" />,
    );
    expect(container.querySelector("#custom-tabs-id")).toBeInTheDocument();
  });

  it("does not call onClick when clicking already selected tab", () => {
    const onSelectMock = vi.fn();
    render(
      <Tabs items={arrayItems} selectedItemId="tab0" onSelect={onSelectMock} />,
    );
    const tab = screen.getByTestId("tab0_tab");
    tab.click();
    expect(onSelectMock).not.toHaveBeenCalled();
  });

  it("renders with layoutId for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
        layoutId="test-layout-id"
      />,
    );
    expect(container.querySelector("#test-layout-id")).toBeInTheDocument();
  });
});
