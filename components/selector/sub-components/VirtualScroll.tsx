import { useEffect, useRef } from "react";

import { Scrollbar, type ScrollbarProps } from "../../scrollbar";
import { ASIDE_PADDING_AFTER_LAST_ITEM } from "../../../constants";

export const VirtualScroll = (props: ScrollbarProps) => {
	const scrollContentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const isSearchInputFocused = document.activeElement?.closest(
			".search-input-block",
		);

		if (!isSearchInputFocused) {
			scrollContentRef.current?.focus();
		}
	}, []);

	useEffect(() => {
		const onTabClick = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;

			e.preventDefault();

			const searchInput = document.querySelector(
				".selector-search-input input",
			) as HTMLInputElement;

			if (searchInput) {
				searchInput.focus();
			}
		};

		scrollContentRef.current?.addEventListener("keydown", onTabClick);

		return () => {
			scrollContentRef.current?.removeEventListener("keydown", onTabClick);
		};
	}, []);

	return (
		<Scrollbar
			{...props}
			scrollClass="selector-body-scroll"
			paddingAfterLastItem={ASIDE_PADDING_AFTER_LAST_ITEM}
			contentRef={scrollContentRef}
		/>
	);
};

VirtualScroll.displayName = "VirtualScroll";
