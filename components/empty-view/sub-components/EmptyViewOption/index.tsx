import type React from "react";
import classNames from "classnames";

import { Link, LinkType } from "../../../link";
import { Button, ButtonSize } from "../../../button";

import { EmptyViewItem } from "../EmptyViewItem";
import {
  isActivationKey,
  isEmptyActionOption,
  isEmptyButtonOption,
  isEmptyLinkOptions,
  isEmptySeparatorOption,
  isPlainClick,
  toHref,
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
          // A real href keeps the link in the Tab order, announced as a link,
          // and lets a modified click open it in a new tab.
          href={toHref(option.to)}
          onClick={(e) => {
            if (!option.onClick) return;
            // The handler owns a plain click, as it did before the href.
            if (isPlainClick(e)) e.preventDefault();
            option.onClick(e as React.MouseEvent<HTMLAnchorElement>);
          }}
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget || !isActivationKey(e)) return;
      e.preventDefault();
      // A real click event, so the handler receives the MouseEvent it is typed for.
      e.currentTarget.click();
    };

    return (
      <div
        id={option.key.toString()}
        className={classNames(styles.action, {
          [styles.secondary]: option.className === "secondary",
        })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
