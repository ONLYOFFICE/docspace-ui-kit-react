"use client";

import React from "react";
import classNames from "classnames";
import styles from "./FormWrapper.module.scss";
import { FormWrapperProps } from "./FormWrapper.types";

const FormWrapper = (props: FormWrapperProps) => {
  const { children, className, onSubmit, ...rest } = props;

  const wrapperProps = {
    className: classNames(styles.wrapper, className),
    "data-testid": "form-wrapper",
    ...rest,
  };

  if (onSubmit) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      // A single-page form: the handler submits, the browser does not navigate.
      event.preventDefault();
      onSubmit(event);
    };

    return (
      <form {...wrapperProps} onSubmit={handleSubmit}>
        {children}
      </form>
    );
  }

  return <div {...wrapperProps}>{children}</div>;
};

export { FormWrapper };
