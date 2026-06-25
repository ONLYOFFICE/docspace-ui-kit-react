import type { CSSProperties, FC } from "react";

type ReactSVGMockProps = {
	src?: string;
	className?: string;
	style?: CSSProperties;
	"data-testid"?: string;
};

// Mock for the `react-svg` library. The real `ReactSVG` relies on
// `@tanem/svg-injector`, which schedules `setTimeout` polls that can fire
// after the jsdom environment is torn down, throwing
// `SVGSVGElement is not defined`. Rendering a plain <svg> keeps tests
// deterministic and free of leaked timers.
export const ReactSVG: FC<ReactSVGMockProps> = ({
	src,
	className,
	style,
	"data-testid": dataTestId,
}) => (
	<svg
		data-testid={dataTestId ?? "mocked-react-svg"}
		data-src={src}
		className={className}
		style={style}
	/>
);
