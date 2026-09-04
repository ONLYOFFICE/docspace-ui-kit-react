import React from "react";
import classNames from "classnames";

import { Scrollbar } from "../scrollbar";

import { AsideHeader } from "./aside-header";

import type { AsideProps } from "./Aside.types";
import styles from "./Aside.module.scss";

export * from "./aside-header";

const AsidePure = (props: AsideProps) => {
  const {
    visible,
    children,
    scale = false,
    zIndex = 400,
    className,
    withoutBodyScroll = false,
    onClose,
    withoutHeader = false,
    ...rest
  } = props;

  const asideClasses = classNames(
    styles.aside,
    className,
    "not-selectable",
    "aside",
    {
      [styles.scale]: scale,
      [styles.visible]: visible,
    },
  );

  return (
    <aside
      className={asideClasses}
      style={{ zIndex }}
      data-testid="aside"
      {...rest}
    >
      {!withoutHeader ? (
        <AsideHeader isCloseable onCloseClick={onClose} {...rest} />
      ) : null}
      {withoutBodyScroll ? children : <Scrollbar>{children}</Scrollbar>}
    </aside>
  );
};

const Aside = React.memo(AsidePure);

export { Aside };
