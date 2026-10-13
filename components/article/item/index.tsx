import type React from "react";
import type { ComponentType } from "react";

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
  // rather than around it. A click on it, from the pointer or from Enter,
  // bubbles to the item, which reports it through `onClick` once.
  // `aria-current` and `className` are not in LinkRouterProps, but a router
  // link passes them on to its anchor like any other attribute.
  const renderLink =
    isLink && LinkRouter
      ? (className: string, children: React.ReactNode) => (
          <LinkRouter
            {...({
              className,
              style: { textDecoration: "none" },
              to: linkData?.path,
              state: linkData?.state,
              "aria-current": isActive ? "page" : undefined,
            } as LinkRouterProps)}
          >
            {children}
          </LinkRouter>
        )
      : undefined;

  return (
    <ArticleItemComponent {...props} isLink={isLink} renderLink={renderLink} />
  );
};
