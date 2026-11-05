import React from "react";
import classNames from "classnames";

import { Scrollbar } from "../scrollbar";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useFocusReturn } from "../../hooks/useFocusReturn";

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

  // What is left is two kinds of prop, and each has one home. `aria-*` names
  // the panel and goes on the `<aside>`; everything else is the header's.
  // Spreading all of it onto both put header props on the DOM element --
  // React warned about `onBackClick`, a `style` replaced the panel's own
  // z-index, and an `id` appeared twice on the page.
  const ariaProps: Record<string, unknown> = {};
  const headerProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith("aria-")) ariaProps[key] = value;
    else headerProps[key] = value;
  }

  // An open panel lies over the page with a backdrop in front of it, so it
  // takes the focus, Tab and Shift+Tab stay in it, and closed it gives the
  // focus back to the control that opened it.
  const asideRef = React.useRef<HTMLElement>(null);
  useFocusReturn(asideRef, !!visible);
  useFocusTrap(asideRef, !!visible);

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
      ref={asideRef}
      // The panel holds the focus when it opens, and is the trap's fallback:
      // with nothing in it to tab to, Tab does not go dead.
      tabIndex={-1}
      className={asideClasses}
      style={{ zIndex }}
      data-testid="aside"
      {...ariaProps}
    >
      {!withoutHeader ? (
        <AsideHeader isCloseable onCloseClick={onClose} {...headerProps} />
      ) : null}
      {withoutBodyScroll ? (
        children
      ) : (
        <Scrollbar className={styles.body}>{children}</Scrollbar>
      )}
    </aside>
  );
};

const Aside = React.memo(AsidePure);

export { Aside };
