"use client";

import React from "react";
import { Loader, LoaderTypes } from "../loader";
import styles from "./AppLoader.module.scss";

const AppLoader = () => {
  return (
    <div className={styles.loaderContainer} data-testid="app-loader">
      <Loader
        className={styles.pageLoader}
        type={LoaderTypes.rombs}
        size="40px"
      />
    </div>
  );
};

export default AppLoader;
