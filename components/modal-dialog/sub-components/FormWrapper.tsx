import React from "react";
import classNames from "classnames";

import { ModalDialogFormWrapperProps } from "../ModalDialog.types";
import styles from "../ModalDialog.module.scss";

const FormWrapper = ({
  withForm,
  children,
  className,
  onSubmit,
}: ModalDialogFormWrapperProps) => {
  if (!withForm) return children;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(event);
  };

  return (
    <form
      className={classNames(styles.formWrapper, className)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
};

export { FormWrapper };
