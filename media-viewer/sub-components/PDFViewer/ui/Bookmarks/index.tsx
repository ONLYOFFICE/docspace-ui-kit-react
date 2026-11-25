import React from "react";

import { Scrollbar } from "../../../../../components/scrollbar";

import BookmarksProps from "./Bookmarks.props";
import styles from "./Bookmarks.module.scss";

export const Bookmarks = ({ bookmarks, navigate }: BookmarksProps) => {
  return (
    <Scrollbar>
      <ul
        className={styles.list}
        aria-label="PDF bookmarks"
        data-testid="bookmarks-list"
      >
        {bookmarks.map((item, index) => {
          return (
            <li
              key={item.page}
              className={styles.item}
              data-testid={`bookmark-item-${index}`}
            >
              <p
                className={styles.text}
                onClick={() => navigate(index)}
                aria-label={`Go to bookmark: ${item.description}`}
                data-testid={`bookmark-button-${index}`}
                data-page={item.page}
              >
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>
    </Scrollbar>
  );
};
