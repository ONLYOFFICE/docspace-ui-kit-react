import React from "react";

export const getSideInfo = (
  content: React.ReactElement<{
    containerWidth?: string;
    children?: React.ReactElement;
  }>[],
  convert: boolean,
  interfaceDirection: string = "ltr",
) => {
  const info: React.ReactElement[] = [];
  let child = null;
  const lastIndex = content.length - 1;

  content.forEach(
    (
      element: React.ReactElement<{
        containerWidth?: string;
        children?: React.ReactElement;
      }>,
      index: number,
    ) => {
      if (index > 1) {
        if (!convert && index === lastIndex) {
          child = element;
        } else if (React.isValidElement(element) && "props" in element) {
          const children = element.props.children;
          if (children !== undefined && children !== null) {
            info.push(children as React.JSX.Element);
          }
        }
      }
    },
  );

  if (interfaceDirection === "rtl") {
    info.reverse();
  }

  return interfaceDirection === "ltr" ? (
    <>
      {info.join(" | ")}
      {child}
    </>
  ) : (
    <>
      {child}
      {info.join(" | ")}
    </>
  );
};
