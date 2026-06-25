import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { ArticleButtonLoader } from ".";
import styles from "./ArticleButtonLoader.module.scss";
import type { RectangleSkeletonProps } from "../../../rectangle";

const rectangleMocks = vi.hoisted(() => ({
	rectangleSkeletonMock: vi.fn(
		(props: RectangleSkeletonProps) => (
			<div data-testid="rectangle-skeleton-mock" {...props} />
		),
	),
}));

vi.mock("../../../rectangle", () => ({
	RectangleSkeleton: rectangleMocks.rectangleSkeletonMock,
}));

beforeEach(() => {
	rectangleMocks.rectangleSkeletonMock.mockClear();
});

describe("ArticleButtonLoader", () => {
  it("renders without crashing", () => {
    render(<ArticleButtonLoader />);
    expect(screen.getByTestId("article-button-loader")).toBeInTheDocument();
  });

	it("applies provided id, className and style to the container", () => {
		const style = { padding: "12px" } as React.CSSProperties;
		render(
			<ArticleButtonLoader
				id="custom-id"
				className="external-class"
				style={style}
			/>,
		);

		const container = screen.getByTestId("article-button-loader");
		expect(container).toHaveAttribute("id", "custom-id");
		expect(container).toHaveClass(styles.container);
		expect(container).toHaveClass("external-class");
		expect(container).toHaveStyle({ padding: "12px" });
	});

	it("passes skeleton specific props down to RectangleSkeleton", () => {
		const skeletonProps: RectangleSkeletonProps = {
			title: "Button skeleton",
			width: "120px",
			height: "32px",
			borderRadius: "4px",
			backgroundColor: "#000",
			foregroundColor: "#fff",
			backgroundOpacity: 0.3,
			foregroundOpacity: 0.6,
			speed: 2,
			animate: false,
		};

		render(<ArticleButtonLoader {...skeletonProps} />);

		expect(screen.getByTestId("rectangle-skeleton-mock")).toBeInTheDocument();
		const passedProps = rectangleMocks.rectangleSkeletonMock.mock.calls[0][0];
		expect(passedProps).toMatchObject(skeletonProps);
	});
});
