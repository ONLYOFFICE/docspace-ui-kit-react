import type React from "react";
import type { ComponentType } from "react";

import { ArticleItem as ArticleItemComponent } from "./ArticleItem";
import { ArticleItemProps } from "./ArticleItem.types";
import type { LinkRouterProps } from "../../../types";

type Props = {
  LinkRouter?: ComponentType<LinkRouterProps>;
} & ArticleItemProps;

export const ArticleItem = (props: Props) => {
  const { linkData, isDisabled, LinkRouter, onClick, id, isActive } = props;

  const isLink = Boolean(!isDisabled && LinkRouter);

  const component = <ArticleItemComponent {...props} isLink={isLink} />;

  if (!isLink || !LinkRouter) return component;

  // A pointer click lands on the item inside and reaches `onClick` there.
  // Enter on the focused link clicks the link itself, which the item never
  // sees, so it is reported here.
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.target === e.currentTarget) onClick?.(e, id);
  };

  // `aria-current` is not in LinkRouterProps, but a router link passes it on
  // to its anchor like any other attribute.
  const linkProps = {
    style: { textDecoration: "none" },
    to: linkData?.path,
    state: linkData?.state,
    onClick: onLinkClick,
    "aria-current": isActive ? "page" : undefined,
  } as LinkRouterProps;

  return <LinkRouter {...linkProps}>{component}</LinkRouter>;
};
