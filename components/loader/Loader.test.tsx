import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";

import { LoaderTypes } from "./Loader.enums";

import { Loader } from ".";

const baseProps = {
	type: LoaderTypes.base,
	color: "black",
	size: "18px",
	label: "Loading",
};

describe("<Loader />", () => {
	it("renders without error", () => {
		render(<Loader {...baseProps} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
	});

	it("renders base type with text", () => {
		render(<Loader {...baseProps} />);
		expect(screen.getByText("Loading")).toBeInTheDocument();
	});

	it("renders oval type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.oval} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
	});

	it("renders dual-ring type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.dualRing} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("dual-ring-loader")).toBeInTheDocument();
	});

	it("renders rombs type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.rombs} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("rombs-loader")).toBeInTheDocument();
	});

	it("renders track type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.track} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("track-loader")).toBeInTheDocument();
	});

	it("accepts custom className", () => {
		render(<Loader {...baseProps} className="custom-loader" />);
		expect(screen.getByTestId("loader")).toHaveClass("custom-loader");
	});

	it("accepts custom style", () => {
		const customStyle = { marginTop: "20px" };
		render(<Loader {...baseProps} style={customStyle} />);
		expect(screen.getByTestId("loader")).toHaveStyle(customStyle);
	});

	it("accepts custom id", () => {
		render(<Loader {...baseProps} id="custom-loader" />);
		expect(screen.getByTestId("loader")).toHaveAttribute("id", "custom-loader");
	});
});
