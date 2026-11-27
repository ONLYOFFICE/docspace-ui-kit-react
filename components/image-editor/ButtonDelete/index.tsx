import TrashReactSvg from "../../../assets/icons/16/trash.react.svg";
import classNames from "classnames";
import type { TTranslation } from "../../../utils";
import { TooltipContainer } from "../../tooltip";
import { activateOnButtonKey } from "../../../utils/keyboard-activation";

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
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
        activateOnButtonKey(e, ({ currentTarget }) => currentTarget.click())
      }
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
