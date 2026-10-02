import TrashReactSvg from "../../../assets/icons/16/trash.react.svg";
import classNames from "classnames";
import type { TTranslation } from "../../../utils";
import { TooltipContainer } from "../../tooltip";

import styles from "./ButtonDelete.module.scss";

const ButtonDelete = ({
  onClick,
  t,
  className,
}: {
  onClick: (e: React.MouseEvent) => void;
  t: TTranslation;
  className?: string;
}) => {
  return (
    <TooltipContainer
      as="div"
      className={classNames(
        "icon_cropper-delete_button",
        styles.buttonDelete,
        className,
      )}
      onClick={onClick}
      title={t("Common:Delete")}
      data-testid="cropper_delete_button"
    >
      <TrashReactSvg />
      <div
        className={classNames("icon_cropper-delete_button-text", styles.text)}
      >
        {t("Common:Delete")}
      </div>
    </TooltipContainer>
  );
};

export default ButtonDelete;
