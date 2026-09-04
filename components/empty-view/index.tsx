import { Text } from "../text";

import EmptyViewOption from "./sub-components/EmptyViewOption";

import styles from "./EmptyView.module.scss";
import type { EmptyViewProps } from "./EmptyView.types";

const EmptyView = ({
  description,
  icon,
  options,
  title,
  LinkRouter,
  className,
  bodyClassName,
  extraContent,
}: EmptyViewProps) => {
  return (
    <div
      className={`${styles.wrapper}${className ? ` ${className}` : ""}`}
      data-testid="empty-view"
    >
      <div className={styles.header}>
        {icon}
        <Text
          as="h3"
          fontWeight="700"
          lineHeight="22px"
          className={styles.headerTitle}
        >
          {title}
        </Text>
        <Text as="p" fontSize="12px" className={styles.subheading}>
          {description}
        </Text>
      </div>
      {extraContent ? extraContent : null}
      {options ? (
        <div
          className={`${styles.body}${bodyClassName ? ` ${bodyClassName}` : ""}`}
          data-testid="empty-view-body"
        >
          {options.map((option) => (
            <EmptyViewOption
              key={option.key}
              option={option}
              LinkRouter={LinkRouter}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { EmptyView };
export type {
  EmptyViewButtonType,
  EmptyViewItemType,
  EmptyViewLinkType,
  EmptyViewOptionsType,
  EmptyViewProps,
  EmptyViewSeparatorType,
} from "./EmptyView.types";
