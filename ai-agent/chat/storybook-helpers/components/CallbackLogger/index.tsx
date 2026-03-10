import React from "react";
import { Toast } from "../../../../../components/toast";
import { ComboBox, type TOption } from "../../../../../components/combobox";
import { Button, ButtonSize } from "../../../../../components/button";
import { IconButton } from "../../../../../components/icon-button";
import Chat from "../../../index";
import type { ChatProps } from "../../../Chat.types";
import type { StoryArgs } from "../../../Chat.stories";
import styles from "./CallbackLogger.module.scss";

export const CallbackLogger = (props: StoryArgs) => {
  const [logs, setLogs] = React.useState<
    Array<{
      id: string;
      type: string;
      timestamp: string;
      data: Record<string, unknown>;
    }>
  >([]);
  const [filter, setFilter] = React.useState<string>("all");
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const logsContainerRef = React.useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = React.useRef<number>(0);

  const handleScroll = () => {
    const container = logsContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.clientHeight - container.scrollTop < 100;
      setShowScrollButton(!isNearBottom && container.scrollHeight > container.clientHeight);
    }
  };

  const scrollToBottom = () => {
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      setShowScrollButton(false);
    }
  };

  const prevFilterRef = React.useRef(filter);

  React.useEffect(() => {
    const container = logsContainerRef.current;
    if (container) {
      const filterChanged = prevFilterRef.current !== filter;
      const isContentScrollable = container.scrollHeight > container.clientHeight;

      if (filterChanged) {
        // When switching tabs, show the latest logs and hide the button
        container.scrollTop = container.scrollHeight;
        setShowScrollButton(false);
      } else {
        // Logic for tracking new logs
        const isNearBottom =
          prevScrollHeightRef.current - container.clientHeight - container.scrollTop < 150;

        if (isNearBottom) {
          container.scrollTop = container.scrollHeight;
          setShowScrollButton(false);
        } else {
          setShowScrollButton(isContentScrollable);
        }
      }

      prevScrollHeightRef.current = container.scrollHeight;
      prevFilterRef.current = filter;
    } else {
      setShowScrollButton(false);
    }
  }, [logs, filter]);

  const addLog = (type: string, data: Record<string, unknown>) => {
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        timestamp: new Date().toLocaleTimeString(),
        data,
      },
    ]);
  };

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.type === filter);

  const callbackOptions: TOption[] = React.useMemo(
    () =>
      [
        "all",
        "onSendMessage",
        "onStopStream",
        "onStreamData",
        "onNewChat",
        "onSelectChat",
      ].map((type) => ({
        label: type === "all" ? "All Events" : type,
        key: type,
      })),
    [],
  );

  const selectedOption = React.useMemo(
    () => callbackOptions.find((o) => o.key === filter) || callbackOptions[0],
    [filter, callbackOptions],
  );

  return (
    <div className={`${styles.withListenersStory} with-listeners-story`}>
      <Toast />
      <div
        style={{
          border: "4px dashed rgb(208, 213, 221)",
          flexBasis: "60%",
          minWidth: "400px",
        }}
      >
        <Chat
          {...(props as unknown as ChatProps)}
          onSendMessage={(message, files) => {
            addLog("onSendMessage", {
              message: message,
              files: files,
            });
            props.onSendMessage?.(message, files);
          }}
          onStopStream={() => {
            addLog("onStopStream", {});
            props.onStopStream?.();
          }}
          onStreamData={(chunk) => {
            addLog("onStreamData", {
              chunk,
            });
            props.onStreamData?.(chunk);
          }}
          onNewChat={() => {
            addLog("onNewChat", {});
            props.onNewChat?.();
          }}
          onSelectChat={(chatId) => {
            addLog("onSelectChat", { chatId });
            props.onSelectChat?.(chatId);
          }}
        />
      </div>

      <div className={styles.callbackPanel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Listener Events</h3>
          <ComboBox
            options={callbackOptions}
            selectedOption={selectedOption}
            onSelect={(option) => setFilter(option.key as string)}
            scaled
            scaledOptions
            displaySelectedOption
          />
        </div>

        <div
          key={filter}
          ref={logsContainerRef}
          className={styles.logsContainer}
          onScroll={handleScroll}
        >
          {filteredLogs.length === 0 ? (
            <div className={styles.emptyState}>
              {filter === "all"
                ? "No events yet. Interact with the chat to see listeners."
                : `No ${filter} events yet.`}
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logHeader}>
                  <strong className={styles.logType}>{log.type}</strong>
                  <span className={styles.logTimestamp}>{log.timestamp}</span>
                </div>
                {Object.keys(log.data).length > 0 && (
                  <pre className={styles.logData}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        <IconButton
          className={`${styles.scrollToBottomButton} ${showScrollButton ? styles.visible : ""}`}
          onClick={scrollToBottom}
          title="Scroll to bottom"
          size={20}
          isStroke
          color="white"
          iconNode={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          }
        />

        <div className={styles.panelFooter}>
          <span>
            {filteredLogs.length} event{filteredLogs.length !== 1 ? "s" : ""}
          </span>
          <Button
            size={ButtonSize.extraSmall}
            onClick={() => setLogs([])}
            className={styles.clearButton}
            label="Clear"
          />
        </div>
      </div>
    </div>
  );
};
