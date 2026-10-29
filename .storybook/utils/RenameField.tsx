import React, { useState } from "react";

import CheckSvg from "../../assets/check.react.svg";
import Cross12Svg from "../../assets/icons/12/cross.react.svg";
import { Button, ButtonSize } from "../../components/button";
import { InputSize, InputType, TextInput } from "../../components/text-input";
import styles from "./RenameField.module.scss";

const buttonStyle = { width: 32, height: 32, padding: 0, flexShrink: 0 };

const RenameField = ({ title }: { title: string }) => {
  const [value, setValue] = useState(title);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        width: "100%",
        boxSizing: "border-box",
        padding: "9px 8px",
      }}
    >
      <TextInput
        type={InputType.text}
        size={InputSize.base}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        scale
        aria-label="New name"
      />
      <Button
        size={ButtonSize.small}
        minWidth="32px"
        style={buttonStyle}
        icon={<CheckSvg className={styles.icon} />}
        title="Save"
        aria-label="Save"
      />
      <Button
        size={ButtonSize.small}
        minWidth="32px"
        style={buttonStyle}
        icon={<Cross12Svg className={styles.icon} />}
        title="Cancel"
        aria-label="Cancel"
      />
    </div>
  );
};

export default RenameField;
