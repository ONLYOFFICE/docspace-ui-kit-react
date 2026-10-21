import type { StoryContext } from "@storybook/react-vite";
import { instrument } from "storybook/internal/instrumenter";
import { uninstrumentedUserEvent } from "storybook/test";

const PLAY_DELAY = 300;

const isTestRun = (): boolean =>
  "__vitest_browser__" in globalThis ||
  /StorybookTestRunner/.test(globalThis.navigator?.userAgent ?? "");

export const slowDownPlay = (context: StoryContext) => {
  if (isTestRun()) return;

  context.userEvent = instrument(
    { userEvent: uninstrumentedUserEvent.setup({ delay: PLAY_DELAY }) },
    {
      intercept: true,
      getKeys: (obj) =>
        Object.keys(obj).filter((key) => key !== "eventWrapper"),
    },
  ).userEvent;
};
