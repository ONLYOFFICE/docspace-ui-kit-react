"use client";

import { useEffect, useId, useRef, useState } from "react";
import type React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { DropDown } from "../../../../components/drop-down";
import { DropDownItem } from "../../../../components/drop-down-item";
import { Scrollbar } from "../../../../components/scrollbar";
import { Text } from "../../../../components/text";
import { consumeKey } from "../../../../utils/consume-key";

import { useAiChatStore } from "../../../providers/ai-chat-store";
import { useSaveChatAsAgent } from "../ai-chat-panel-save";

import ExpanderDownIcon from "../../../../assets/expander-down.react.svg";
import CheckIcon from "../../../../assets/check.edit.react.svg";
import AiIcon from "../../../../assets/icons/16/AI.svg";
import PlusIcon from "../../../../assets/icons/16/plus.svg";

import styles from "./AiChatAgentPicker.module.scss";

/** How many agents the menu shows before its list scrolls. */
export const VISIBLE_AGENTS_COUNT = 5;

// The menu's rows are DropDownItem's 32px.
const ROW_HEIGHT = 32;

const OPTION_SELECTOR = '[role="option"]';

type AiChatAgentPickerProps = {
  /** The title shown while the default agent is picked. */
  title: string;
};

/**
 * The panel title as a menu of agents: the default one, then the host's
 * agents (`AiChatStore.agentPicker`), of which the first five show and the
 * rest scroll. Picking one hands its id to the host; the title then names
 * it. For a host that keeps the chat's setup as an agent
 * (`AiChatStore.onSavePreset`) the menu ends with "Save as new agent". The
 * header container renders this only while the host offers at least one
 * agent or that save, and the plain title otherwise.
 *
 * Keyboard: Enter, Space or the arrows on the title open the menu with the
 * focus on the picked agent; the arrows, Home and End move through the
 * options, Enter or Space picks one, Escape closes the menu with the focus
 * back on the title, and Tab closes it and goes on from the title. Escape
 * closes it wherever the focus is, and a click outside closes it and still
 * reaches what it was aimed at, as with the product's context menus.
 */
const AiChatAgentPicker = observer(({ title }: AiChatAgentPickerProps) => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const [isOpen, setIsOpen] = useState(false);
  // Where the focus lands when the menu opens: the picked option, or the
  // first / last one when the menu was opened with an arrow key.
  const [initialFocus, setInitialFocus] = useState<
    "selected" | "first" | "last" | null
  >(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const agentsLabelId = useId();

  const picker = store.agentPicker;
  const hasAgents = !!picker && picker.agents.length > 0;
  const hasMenu = store.hasAgentPicker;
  const saveAsAgent = useSaveChatAsAgent();

  // The menu is a portal shown once it is laid out, so the focus moves in
  // on the next frame.
  useEffect(() => {
    if (!isOpen || !initialFocus) return undefined;
    const frame = requestAnimationFrame(() => {
      const options = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? [],
      );
      const target =
        initialFocus === "first"
          ? options[0]
          : initialFocus === "last"
            ? options[options.length - 1]
            : (options.find(
                (o) => o.getAttribute("aria-selected") === "true",
              ) ?? options[0]);
      target?.focus();
      target?.scrollIntoView?.({ block: "nearest" });
      setInitialFocus(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, initialFocus]);

  // The menu losing all it offers while it is open closes it.
  useEffect(() => {
    if (!hasMenu) setIsOpen(false);
  }, [hasMenu]);

  // Escape is taken on the window, before anything else: a click opens the
  // menu with the focus left on the title (or, in Safari, on the page),
  // where the menu's own keys never see the press. Consumed, so the page's
  // hotkeys and a dialog around the chat do not act on it too.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      consumeKey(e);
      setIsOpen(false);
      anchorRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

  if (!picker || !hasMenu) return null;

  const selected =
    picker.selectedId === null
      ? null
      : (picker.agents.find((agent) => agent.id === picker.selectedId) ?? null);

  const open = (focus: "selected" | "first" | "last" | null) => {
    picker.onOpen?.();
    setInitialFocus(focus);
    setIsOpen(true);
  };

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) anchorRef.current?.focus();
  };

  // Every pick reaches the host, the current agent's included: a pick of
  // the agent the chat already runs on is how a slower pick still on its
  // way is called off.
  const select = (id: string | null, restoreFocus = false) => {
    close(restoreFocus);
    picker.onSelect(id);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      open(e.key === "ArrowDown" ? "selected" : "last");
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? [],
    );
    const index = options.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) => {
      const option = options[(next + options.length) % options.length];
      option?.focus();
      option?.scrollIntoView?.({ block: "nearest" });
    };

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusAt(index < 0 ? options.length - 1 : index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(options.length - 1);
        break;
      case "Enter":
      case " ":
        if (index < 0) break;
        e.preventDefault();
        options[index].click();
        break;
      case "Tab":
        // The menu closes and the focus goes on from the title: it is put
        // back on the title before the browser moves it, so Tab and
        // Shift+Tab reach the title's neighbours, not whatever follows the
        // menu's portal at the end of the page.
        close(true);
        break;
      default:
        break;
    }
  };

  const check = (isSelected: boolean) =>
    isSelected ? <CheckIcon className={styles.check} aria-hidden /> : null;

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={(e) => {
          if (isOpen) return close();
          // A click by the keyboard (Enter, Space) carries no pointer
          // position: the focus then follows into the menu.
          open(e.detail === 0 ? "selected" : null);
        }}
        onKeyDown={onTriggerKeyDown}
        data-testid="ai-chat-agent-picker"
      >
        {selected?.icon ? (
          <span
            className={styles.logo}
            aria-hidden
            data-testid="ai-chat-agent-picker-logo"
          >
            {selected.icon}
          </span>
        ) : null}
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
        // No backdrop to catch the click: a press outside closes the menu
        // and goes on to its target. The title toggles the menu itself.
        withBackdrop={false}
        eventTypes={["mousedown"]}
        clickOutsideAction={(e) => {
          if (anchorRef.current?.contains(e.target as Node)) return;
          close();
        }}
        ariaLabel={t("Common:AIAgents")}
        dataTestId="ai-chat-agent-picker-menu"
      >
        {/* Keys pressed on an option bubble up here. */}
        <div ref={menuRef} role="none" onKeyDown={onMenuKeyDown}>
          <DropDownItem
            isSelected={selected === null}
            onClick={() => select(null, true)}
            additionalElement={check(selected === null)}
            testId="ai-chat-agent-picker-default"
          >
            <span className={styles.row}>
              <span className={classNames(styles.logo, styles.defaultLogo)}>
                <AiIcon aria-hidden />
              </span>
              <span className={styles.name}>{t("Common:DefaultAIAgent")}</span>
            </span>
          </DropDownItem>
          {/* A listbox owns options and groups only, so the line between
              the default agent and the agents is the group's border, not a
              separator item. */}
          <div
            role="group"
            aria-labelledby={agentsLabelId}
            className={styles.agentsGroup}
            hidden={!hasAgents}
          >
            <div id={agentsLabelId} className={styles.sectionLabel}>
              {t("Common:Agents")}
            </div>
            <Scrollbar
              className={styles.agents}
              style={{ maxHeight: VISIBLE_AGENTS_COUNT * ROW_HEIGHT }}
              translateContentSizeYToHolder
              noScrollX
              // No gutter for the track: the agents' rows, their hover fill
              // and checkmarks line up with the default agent's above.
              paddingInlineEnd="0"
            >
              {picker.agents.map((agent) => (
                <DropDownItem
                  key={agent.id}
                  isSelected={agent.id === selected?.id}
                  onClick={() => select(agent.id, true)}
                  additionalElement={check(agent.id === selected?.id)}
                  testId={`ai-chat-agent-picker-agent-${agent.id}`}
                >
                  <span className={styles.row}>
                    {agent.icon ? (
                      <span className={styles.logo} aria-hidden>
                        {agent.icon}
                      </span>
                    ) : null}
                    <span className={styles.name} title={agent.name}>
                      {agent.name}
                    </span>
                  </span>
                </DropDownItem>
              ))}
            </Scrollbar>
          </div>
          {saveAsAgent ? (
            // Divided from the rows above by its own border, as the agents
            // are from the default agent.
            <div role="none" className={styles.saveGroup}>
              <DropDownItem
                onClick={() => {
                  close(true);
                  saveAsAgent();
                }}
                testId="ai-chat-agent-picker-save"
              >
                <span className={classNames(styles.row, styles.saveRow)}>
                  <span className={styles.logo}>
                    <PlusIcon aria-hidden />
                  </span>
                  <span className={styles.name}>
                    {t("Common:SaveAsNewAgent", {
                      defaultValue: "Save as new agent",
                    })}
                  </span>
                </span>
              </DropDownItem>
            </div>
          ) : null}
        </div>
      </DropDown>
    </>
  );
});

export default AiChatAgentPicker;
