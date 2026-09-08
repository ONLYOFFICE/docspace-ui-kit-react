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
import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, render, act, fireEvent } from "@testing-library/react";
import { ContextMenu } from ".";
import type { ContextMenuRefType } from "./ContextMenu.types";
import styles from "./ContextMenu.module.scss";

const ITEM_WIDTH = 200;

const defineSize = (
	target: Element | Window,
	prop: string,
	value: number | undefined,
) => {
	if (value === undefined) {
		Reflect.deleteProperty(target, prop);
		return;
	}

	Object.defineProperty(target, prop, { value, configurable: true });
};

/**
 * Mobile Firefox reports `window.innerWidth` (the visual viewport) wider than
 * the layout viewport the menu is laid out in, so the two are set apart here.
 */
const mockViewport = (layoutWidth: number, visualWidth: number) => {
	defineSize(window, "innerWidth", visualWidth);
	defineSize(window, "innerHeight", 800);
	defineSize(document.documentElement, "clientWidth", layoutWidth);
	defineSize(document.documentElement, "clientHeight", 800);
};

const showAt = (ref: React.RefObject<ContextMenuRefType | null>, x: number) => {
	act(() => {
		ref.current?.show({
			clientX: x,
			clientY: 100,
			pageX: x,
			pageY: 100,
			stopPropagation: () => {},
			preventDefault: () => {},
		} as unknown as MouseEvent);
	});
};

describe("<ContextMenu />", () => {
	const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

	afterEach(() => {
		Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
		defineSize(window, "innerWidth", undefined);
		defineSize(window, "innerHeight", undefined);
		defineSize(document.documentElement, "clientWidth", undefined);
		defineSize(document.documentElement, "clientHeight", undefined);
	});

	it("renders without error", () => {
		render(<ContextMenu model={[]} />);
		expect(screen.getByTestId("context-menu")).toBeInTheDocument();
	});

	it("has base contextMenu class", () => {
		render(<ContextMenu model={[]} />);
		expect(screen.getByTestId("context-menu")).toHaveClass(styles.contextMenu);
	});

	it("renders an item description under its label", () => {
		const ref = React.createRef<ContextMenuRefType>();
		const onClick = vi.fn();

		render(
			<ContextMenu
				ref={ref}
				model={[
					{
						key: "roomAdmin",
						label: "Room admin",
						onClick,
						description: "Room admins manage their assigned rooms.",
					},
				]}
				withHotkeys={false}
			/>,
		);

		showAt(ref, 100);

		expect(
			screen.getByText("Room admins manage their assigned rooms."),
		).toBeInTheDocument();

		fireEvent.click(screen.getByText("Room admin"));
		expect(onClick).toHaveBeenCalled();
	});

	it("keeps the menu inside the layout viewport when opened near its edge", () => {
		// jsdom does not lay out, so the measured item width comes from the mock
		Element.prototype.getBoundingClientRect = () =>
			({ width: ITEM_WIDTH, height: 36 }) as DOMRect;

		mockViewport(800, 1200);

		const ref = React.createRef<ContextMenuRefType>();

		render(
			<ContextMenu
				ref={ref}
				model={[{ key: "open", label: "Open" }]}
				withHotkeys={false}
			/>,
		);

		showAt(ref, 780);

		const left = Number.parseFloat(ref.current?.menuRef.current?.style.left ?? "");

		expect(left).toBeLessThanOrEqual(800 - ITEM_WIDTH);
		expect(left).toBeGreaterThanOrEqual(0);
	});

	/**
	 * Bug 83459 - an open menu must survive a re-render of whatever holds it.
	 *
	 * Consumers hand `onHide` over as a plain arrow function, so it is a new
	 * value on every parent render. The teardown that reports "the menu went
	 * away" used to hang off it and therefore ran on those renders too, closing
	 * a menu that was still open - which is why the profile menu could not show
	 * its "Live chat" switch changing.
	 */
	it("stays open when its parent re-renders with a fresh onHide", () => {
		const ref = React.createRef<ContextMenuRefType>();
		let rerender: () => void = () => {};
		const hidden: number[] = [];

		const Parent = () => {
			const [renders, setRenders] = React.useState(0);

			rerender = () => setRenders((value) => value + 1);

			return (
				<ContextMenu
					ref={ref}
					model={[{ key: "open", label: `Open ${renders}` }]}
					withHotkeys={false}
					// A new function each render, the way every real parent passes it.
					onHide={() => hidden.push(renders)}
				/>
			);
		};

		render(<Parent />);
		showAt(ref, 100);

		expect(screen.getByText("Open 0")).toBeInTheDocument();

		act(() => {
			rerender();
		});

		expect(screen.getByText("Open 1")).toBeInTheDocument();
		expect(hidden).toEqual([]);
	});
});
