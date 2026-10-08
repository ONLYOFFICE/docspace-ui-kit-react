import type React from "react";
import classNames from "classnames";

import { Link, LinkType } from "../../../link";
import { Button, ButtonSize } from "../../../button";

import { EmptyViewItem } from "../EmptyViewItem";
import {
  isEmptyActionOption,
  isEmptyButtonOption,
  isEmptyLinkOptions,
  isEmptySeparatorOption,
} from "../../EmptyView.utils";
import styles from "../../EmptyView.module.scss";

import type { EmptyViewOptionProps } from "../../EmptyView.types";

const EmptyViewOption = ({ option, LinkRouter }: EmptyViewOptionProps) => {
  if (isEmptyLinkOptions(option)) {
    if (option.isNext || !LinkRouter)
      return (
        <Link
          type={LinkType.action}
          id={option.key.toString()}
          className={classNames(styles.link, option.className)}
          onClick={(e) =>
            option.onClick?.(e as React.MouseEvent<HTMLAnchorElement>)
          }
        >
          {option.icon}
          <span>{option.description}</span>
        </Link>
      );
    return (
      <LinkRouter
        id={option.key.toString()}
        className={classNames(styles.link, option.className)}
        to={option.to}
        state={option.state}
        onClick={option.onClick}
      >
        {option.icon}
        <span>{option.description}</span>
      </LinkRouter>
    );
  }

  if (isEmptySeparatorOption(option)) {
    return (
      <span className={styles.separator} id={option.key.toString()}>
        {option.text}
      </span>
    );
  }

  if (isEmptyActionOption(option)) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof option.onClick === "function") {
        (option.onClick as (e?: React.MouseEvent<HTMLDivElement>) => void)(e);
      }
    };

    return (
      <div
        id={option.key.toString()}
        className={classNames(styles.action, {
          [styles.secondary]: option.className === "secondary",
        })}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {option.icon}
        <span>{option.title}</span>
      </div>
    );
  }

  if (isEmptyButtonOption(option)) {
    return (
      <Button
        className={classNames(styles.button, option.className)}
        id={option.key.toString()}
        onClick={option.onClick}
        label={option.title}
        primary={option.primary ?? true}
        isLoading={option.isLoading}
        size={ButtonSize.small}
      />
    );
  }

  const { key, ...other } = option;
  return <EmptyViewItem id={key.toString()} {...other} />;
};

export default EmptyViewOption;
