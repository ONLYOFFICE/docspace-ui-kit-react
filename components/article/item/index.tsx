import type { ComponentType } from "react";

import { ArticleItem as ArticleItemComponent } from "./ArticleItem";
import { ArticleItemProps } from "./ArticleItem.types";
import type { LinkRouterProps } from "../../../types";

type Props = {
  LinkRouter?: ComponentType<LinkRouterProps>;
} & ArticleItemProps;

export const ArticleItem = (props: Props) => {
  const { linkData, isDisabled, LinkRouter } = props;

  const component = <ArticleItemComponent {...props} />;

  return !isDisabled && LinkRouter ? (
    <LinkRouter
      style={{ textDecoration: "none" }}
      to={linkData?.path}
      state={linkData?.state}
    >
      {component}
    </LinkRouter>
  ) : (
    component
  );
};
