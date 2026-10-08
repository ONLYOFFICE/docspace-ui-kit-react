"use client";

import React from "react";
import { Loader, LoaderTypes } from "../loader";
import styles from "./AppLoader.module.scss";

import type { AppLoaderProps } from "./AppLoader.types";

export type { AppLoaderProps };

const AppLoader = ({
  label = "Loading content, please wait.",
}: AppLoaderProps) => {
  // The inner Loader is the role="status" region, and the label is its text;
  // the sheet itself is busy for as long as it is mounted.
  return (
    <div
      className={styles.loaderContainer}
      data-testid="app-loader"
      aria-busy="true"
    >
      <Loader
        className={styles.pageLoader}
        type={LoaderTypes.rombs}
        size="40px"
        label={label}
      />
    </div>
  );
};

export default AppLoader;
