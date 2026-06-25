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

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-svg", () => ({
  ReactSVG: (props: Record<string, unknown>) => (
    <div data-testid="react-svg-mock" {...props} />
  ),
}));

import { IconSizeType } from "../../utils";

import { Avatar, AvatarActionKeys } from ".";
import { AvatarRole, AvatarSize } from "./Avatar.enums";
import { EmptyIcon, getRoleIcon } from "./Avatar.utils";

const baseProps = {
  size: AvatarSize.max,
  role: AvatarRole.user,
  source: "",
  editLabel: "Edit",
  userName: "Demo User",
  editing: false,
  editAction: vi.fn(),
};

describe("<Avatar />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar with default props", () => {
    render(<Avatar {...baseProps} />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.getByText("DU")).toBeInTheDocument();
  });

  it("renders different avatar sizes", () => {
    const sizes = [
      AvatarSize.max,
      AvatarSize.big,
      AvatarSize.medium,
      AvatarSize.base,
      AvatarSize.small,
      AvatarSize.min,
    ];
    sizes.forEach((size) => {
      const { container } = render(<Avatar {...baseProps} size={size} />);
      expect(container.firstChild).toHaveAttribute("data-size", size);
    });
  });

  it("displays image when source is provided", () => {
    const source = "https://example.com/avatar.jpg";
    render(<Avatar {...baseProps} source={source} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", source);
  });

  it("shows edit button when editing and hasAvatar are true", () => {
    render(<Avatar {...baseProps} editing hasAvatar />);
    const editButton = screen.getByTestId("edit_avatar_icon_button");
    expect(editButton).toBeInTheDocument();
  });

  it("handles click events when onClick is provided", () => {
    const onClick = vi.fn();
    render(<Avatar {...baseProps} onClick={onClick} />);
    const avatar = screen.getByTestId("avatar");
    fireEvent.click(avatar);
    expect(onClick).toHaveBeenCalled();
  });

  it("displays correct initials for group avatar", () => {
    render(<Avatar {...baseProps} isGroup userName="Project Team" />);
    expect(screen.getByText("PT")).toBeInTheDocument();
  });

  it("handles file change when onChangeFile is provided", () => {
    const onChangeFile = vi.fn();
    render(<Avatar {...baseProps} editing onChangeFile={onChangeFile} />);
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["test"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onChangeFile).toHaveBeenCalled();
  });

  describe("role icons", () => {
    it("displays admin role icon", () => {
      render(<Avatar {...baseProps} role={AvatarRole.admin} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar.querySelector(".admin_icon")).toBeInTheDocument();
    });

    it("displays owner role icon", () => {
      render(<Avatar {...baseProps} role={AvatarRole.owner} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar.querySelector(".owner_icon")).toBeInTheDocument();
    });

    it("hides role icon when hideRoleIcon is true", () => {
      render(<Avatar {...baseProps} role={AvatarRole.admin} hideRoleIcon />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar.querySelector(".admin_icon")).not.toBeInTheDocument();
    });

    it("uses custom roleIcon when provided", () => {
      render(
        <Avatar
          {...baseProps}
          role={AvatarRole.admin}
          roleIcon={<div data-testid="custom-role-icon" />}
        />,
      );
      expect(screen.getByTestId("custom-role-icon")).toBeInTheDocument();
    });
  });

  describe("SVG icon source", () => {
    it("renders icon when source is an SVG path", () => {
      render(<Avatar {...baseProps} source="/icons/test.svg" userName="" />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar.querySelector(".icon")).toBeInTheDocument();
    });

    it("renders image instead of icon when isNotIcon is true", () => {
      render(
        <Avatar
          {...baseProps}
          source="/icons/test.svg"
          userName=""
          isNotIcon
        />,
      );
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("default source", () => {
    it("displays default avatar when isDefaultSource is true and no source/userName", () => {
      render(
        <Avatar {...baseProps} source="" userName="" isDefaultSource />,
      );
      const svg = screen.getByTestId("avatar").querySelector("svg[data-is-default='true']");
      expect(svg).toBeInTheDocument();
    });

    it("marks image as default when source contains default_user_photo", () => {
      render(
        <Avatar {...baseProps} source="https://example.com/default_user_photo.png" />,
      );
      const svg = screen.getByTestId("avatar").querySelector("svg[data-is-default='true']");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty icon when no source, userName, or isDefaultSource", () => {
      render(<Avatar {...baseProps} source="" userName="" />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("mouse events", () => {
    it("handles middle mouse button click", () => {
      const onClick = vi.fn();
      render(<Avatar {...baseProps} onClick={onClick} />);
      const avatar = screen.getByTestId("avatar");
      fireEvent.mouseDown(avatar, { button: 1 });
      expect(onClick).toHaveBeenCalled();
    });

    it("ignores non-middle mouse button on mouseDown", () => {
      const onClick = vi.fn();
      render(<Avatar {...baseProps} onClick={onClick} />);
      const avatar = screen.getByTestId("avatar");
      fireEvent.mouseDown(avatar, { button: 0 });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("edit mode interactions", () => {
    it("shows plus button when editing without hasAvatar", () => {
      const onChangeFile = vi.fn();
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar={false}
          onChangeFile={onChangeFile}
        />,
      );
      expect(screen.getByTestId("edit_avatar_icon_button")).toBeInTheDocument();
    });

    it("opens dropdown on edit button click when hasAvatar is true", () => {
      const onChangeFile = vi.fn();
      const model = [
        {
          key: "delete",
          label: "Delete",
          icon: "/icon.svg",
          onClick: vi.fn(),
        },
      ];
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const editButton = screen.getByTestId("edit_avatar_icon_button");
      fireEvent.click(editButton);
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("calls model onClick when dropdown item is clicked", () => {
      const onChangeFile = vi.fn();
      const modelClick = vi.fn();
      const model = [
        {
          key: "delete",
          label: "Delete",
          icon: "/icon.svg",
          onClick: modelClick,
        },
      ];
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const editButton = screen.getByTestId("edit_avatar_icon_button");
      fireEvent.click(editButton);
      const deleteOption = screen.getByTestId("delete");
      fireEvent.click(deleteOption);
      expect(modelClick).toHaveBeenCalled();
    });

    it("handles upload action with PROFILE_AVATAR_UPLOAD key", () => {
      const onChangeFile = vi.fn();
      const uploadClick = vi.fn();
      const model = [
        {
          key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
          label: "Upload",
          icon: "/upload.svg",
          onClick: uploadClick,
        },
      ];
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const editButton = screen.getByTestId("edit_avatar_icon_button");
      fireEvent.click(editButton);
      const uploadOption = screen.getByTestId(
        AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      );
      fireEvent.click(uploadOption);
      expect(uploadClick).toHaveBeenCalled();
    });

    it("clears file input value on click", () => {
      const onChangeFile = vi.fn();
      render(<Avatar {...baseProps} editing onChangeFile={onChangeFile} />);
      const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
      Object.defineProperty(fileInput, "value", {
        writable: true,
        value: "test.png",
      });
      fireEvent.click(fileInput);
      expect(fileInput.value).toBe("");
    });
  });

  describe("avatar click behavior", () => {
    it("does nothing on click when noClick is true", () => {
      const onChangeFile = vi.fn();
      const modelClick = vi.fn();
      const model = [
        {
          key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
          label: "Upload",
          icon: "/icon.svg",
          onClick: modelClick,
        },
      ];
      render(
        <Avatar
          {...baseProps}
          hasAvatar={false}
          noClick
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const avatar = screen.getByTestId("avatar");
      fireEvent.click(avatar);
      // With noClick=true, clicking avatar should not trigger upload
      expect(modelClick).not.toHaveBeenCalled();
    });

    it("opens dropdown on avatar click when hasAvatar and onChangeFile", () => {
      const onChangeFile = vi.fn();
      const model = [
        {
          key: "delete",
          label: "Delete",
          icon: "/icon.svg",
          onClick: vi.fn(),
        },
      ];
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const avatar = screen.getByTestId("avatar");
      fireEvent.click(avatar);
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("triggers upload on avatar click when no hasAvatar but has onChangeFile", () => {
      const uploadClick = vi.fn();
      const onChangeFile = vi.fn();
      const model = [
        {
          key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
          label: "Upload",
          icon: "/upload.svg",
          onClick: uploadClick,
        },
      ];
      render(
        <Avatar
          {...baseProps}
          editing
          hasAvatar={false}
          onChangeFile={onChangeFile}
          model={model}
        />,
      );
      const avatar = screen.getByTestId("avatar");
      fireEvent.click(avatar);
      expect(uploadClick).toHaveBeenCalled();
    });
  });

  describe("tooltip", () => {
    it("renders tooltip when withTooltip is true", () => {
      render(
        <Avatar
          {...baseProps}
          withTooltip
          tooltipContent="Test tooltip"
          role={AvatarRole.admin}
        />,
      );
      const roleWrapper = screen.getByTestId("avatar").querySelector("[data-tooltip-id]");
      expect(roleWrapper).toBeInTheDocument();
      expect(roleWrapper).toHaveAttribute("data-tooltip-content", "Test tooltip");
    });
  });

  describe("custom props", () => {
    it("applies custom className", () => {
      render(<Avatar {...baseProps} className="custom-class" />);
      expect(screen.getByTestId("avatar")).toHaveClass("custom-class");
    });

    it("applies custom dataTestId", () => {
      render(<Avatar {...baseProps} dataTestId="custom-avatar" />);
      expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
    });

    it("applies imgClassName to image", () => {
      render(
        <Avatar
          {...baseProps}
          source="https://example.com/avatar.jpg"
          imgClassName="custom-img-class"
        />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveClass("custom-img-class");
    });
  });
});

describe("Avatar utilities", () => {
  describe("getRoleIcon", () => {
    it("returns admin icon for admin role", () => {
      const icon = getRoleIcon(AvatarRole.admin);
      expect(icon).not.toBeNull();
    });

    it("returns owner icon for owner role", () => {
      const icon = getRoleIcon(AvatarRole.owner);
      expect(icon).not.toBeNull();
    });

    it("returns null for user role", () => {
      const icon = getRoleIcon(AvatarRole.user);
      expect(icon).toBeNull();
    });

    it("returns null for guest role", () => {
      const icon = getRoleIcon(AvatarRole.guest);
      expect(icon).toBeNull();
    });
  });

  describe("EmptyIcon", () => {
    it("renders with correct size", () => {
      const { container } = render(<EmptyIcon size={IconSizeType.scale} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("data-size", IconSizeType.scale);
    });
  });
});
