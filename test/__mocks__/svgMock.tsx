import type { FC, SVGProps } from "react";

const SvgMock: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg data-testid="svg-mock" {...props} />
);

export default SvgMock;
