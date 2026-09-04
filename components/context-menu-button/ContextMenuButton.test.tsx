import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { globalColors } from "../../providers/theme";

import VerticalDotsReactSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";

import type { ContextMenuModel } from "../context-menu";

import { ContextMenuButton } from "./ContextMenuButton";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const baseData = (): ContextMenuModel[] => [
	{
		key: "key",
		label: "label",
		onClick: vi.fn(),
	},
];

const baseProps = {
	title: "Actions",
	iconName: VerticalDotsReactSvgUrl,
	size: 16,
	color: globalColors.gray,
	getData: baseData,
	isDisabled: false,
	displayType: ContextMenuButtonDisplayType.dropdown,
	data: baseData(),
};

describe("<ContextMenuButton />", () => {
	it("renders without error", () => {
		render(<ContextMenuButton {...baseProps} />);
		expect(screen.getByTestId("context-menu-button")).toBeInTheDocument();
	});

	it("closes the dropdown on an outside mousedown whose click is swallowed", () => {
		const onClose = vi.fn();

		render(<ContextMenuButton {...baseProps} opened onClose={onClose} />);

		const dropDown = screen.getByTestId("dropdown");

		expect(dropDown).toHaveClass("open");

		const outside = document.createElement("div");
		outside.addEventListener("click", (e) => e.stopPropagation());
		document.body.appendChild(outside);

		fireEvent.mouseDown(outside);
		fireEvent.click(outside);

		expect(dropDown).not.toHaveClass("open");
		expect(onClose).toHaveBeenCalledTimes(1);

		outside.remove();
	});
});
