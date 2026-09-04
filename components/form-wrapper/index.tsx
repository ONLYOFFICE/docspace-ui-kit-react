"use client";

import React from "react";
import classNames from "classnames";
import styles from "./FormWrapper.module.scss";
import { FormWrapperProps } from "./FormWrapper.types";

const FormWrapper = (props: FormWrapperProps) => {
  const { children, className, ...rest } = props;
  return (
    <div
      className={classNames(styles.wrapper, className)}
      data-testid="form-wrapper"
      {...rest}
    >
      {children}
    </div>
  );
};

export { FormWrapper };
