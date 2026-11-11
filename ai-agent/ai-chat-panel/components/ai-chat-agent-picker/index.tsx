"use client";

import { useId, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { DropDown } from "../../../../components/drop-down";
import { DropDownItem } from "../../../../components/drop-down-item";
import { Scrollbar } from "../../../../components/scrollbar";
import { Text } from "../../../../components/text";

import { useAiChatStore } from "../../../providers/ai-chat-store";

import ExpanderDownIcon from "../../../../assets/expander-down.react.svg";
import CheckIcon from "../../../../assets/check.edit.react.svg";
import AiIcon from "../../../../assets/icons/16/AI.svg";

import styles from "./AiChatAgentPicker.module.scss";

/** How many agents the menu shows before its list scrolls. */
export const VISIBLE_AGENTS_COUNT = 5;

// The menu's rows are DropDownItem's 32px.
const ROW_HEIGHT = 32;

type AiChatAgentPickerProps = {
  /** The title shown while the default agent is picked. */
  title: string;
};

/**
 * The panel title as a menu of agents: the default one, then the host's
 * agents (`AiChatStore.agentPicker`), of which the first five show and the
 * rest scroll. Picking one hands its id to the host; the title then names
 * it. The header container renders this only while the host offers at
 * least one agent, and the plain title otherwise.
 */
const AiChatAgentPicker = observer(({ title }: AiChatAgentPickerProps) => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const picker = store.agentPicker;
  if (!picker || picker.agents.length === 0) return null;

  const selected =
    picker.selectedId === null
      ? null
      : (picker.agents.find((agent) => agent.id === picker.selectedId) ?? null);

  const close = () => setIsOpen(false);

  const select = (id: string | null) => {
    close();
    if (id !== picker.selectedId) picker.onSelect(id);
  };

  const check = (isSelected: boolean) =>
    isSelected ? <CheckIcon className={styles.check} /> : null;

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        data-testid="ai-chat-agent-picker"
      >
        <Text
          as="span"
          className={styles.title}
          fontSize="16px"
          fontWeight={700}
          truncate
        >
          {selected?.name ?? title}
        </Text>
        <ExpanderDownIcon
          className={classNames(styles.expander, {
            [styles.rotated]: isOpen,
          })}
          aria-hidden
        />
      </button>

      <DropDown
        id={menuId}
        className={styles.menu}
        open={isOpen}
        forwardedRef={anchorRef}
        directionY="bottom"
        manualWidth="240px"
        clickOutsideAction={close}
        dataTestId="ai-chat-agent-picker-menu"
      >
        <DropDownItem
          isSelected={selected === null}
          onClick={() => select(null)}
          additionalElement={check(selected === null)}
          testId="ai-chat-agent-picker-default"
        >
          <span className={styles.row}>
            <span className={classNames(styles.logo, styles.defaultLogo)}>
              <AiIcon />
            </span>
            <span className={styles.name}>{t("Common:DefaultAIAgent")}</span>
          </span>
        </DropDownItem>
        <DropDownItem isSeparator />
        <div className={styles.sectionLabel}>{t("Common:Agents")}</div>
        <Scrollbar
          className={styles.agents}
          style={{ maxHeight: VISIBLE_AGENTS_COUNT * ROW_HEIGHT }}
          translateContentSizeYToHolder
          noScrollX
        >
          {picker.agents.map((agent) => (
            <DropDownItem
              key={agent.id}
              isSelected={agent.id === selected?.id}
              onClick={() => select(agent.id)}
              additionalElement={check(agent.id === selected?.id)}
              testId={`ai-chat-agent-picker-agent-${agent.id}`}
            >
              <span className={styles.row}>
                {agent.icon ? (
                  <span className={styles.logo}>{agent.icon}</span>
                ) : null}
                <span className={styles.name} title={agent.name}>
                  {agent.name}
                </span>
              </span>
            </DropDownItem>
          ))}
        </Scrollbar>
      </DropDown>
    </>
  );
});

export default AiChatAgentPicker;
