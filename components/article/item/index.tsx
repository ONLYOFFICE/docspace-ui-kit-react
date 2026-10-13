import React, { type ComponentType } from "react";

import { ArticleItem as ArticleItemComponent } from "./ArticleItem";
import { ArticleItemProps } from "./ArticleItem.types";
import type { LinkRouterProps } from "../../../types";

type Props = {
  LinkRouter?: ComponentType<LinkRouterProps>;
} & ArticleItemProps;

export const ArticleItem = (props: Props) => {
  const { linkData, isDisabled, LinkRouter, isActive } = props;

  const isLink = Boolean(!isDisabled && LinkRouter);

  // The link is the item's control: a layer over the row, beside the badge
  // rather than around it. The item's click handler is the link's own
  // `onClick`, so a router link runs it before navigating and a
  // `preventDefault()` in the item's `onClick` cancels the navigation; the
  // item does not report the same click again when it bubbles to the row.
  // `aria-current` is not in LinkRouterProps, but a router link passes it on
  // to its anchor like any other attribute. It is memoised so the memoised
  // item below can skip a render when nothing it draws has changed.
  const path = linkData?.path;
  const linkState = linkData?.state;
  const renderLink = React.useMemo(
    () =>
      isLink && LinkRouter
        ? (
            className: string,
            children: React.ReactNode,
            onClick: React.MouseEventHandler<HTMLAnchorElement>,
          ) => (
            <LinkRouter
              {...({
                className,
                style: { textDecoration: "none" },
                to: path,
                state: linkState,
                onClick,
                "aria-current": isActive ? "page" : undefined,
              } as LinkRouterProps)}
            >
              {children}
            </LinkRouter>
          )
        : undefined,
    [isLink, LinkRouter, path, linkState, isActive],
  );

  return (
    <ArticleItemComponent {...props} isLink={isLink} renderLink={renderLink} />
  );
};
