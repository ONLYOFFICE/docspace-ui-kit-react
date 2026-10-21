import { addons } from "storybook/manager-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";

const ADDON_ID = "docspace/reset-dragged-viewport";
const DRAGGED_SIZE = /^\d+-\d+$/;

addons.register(ADDON_ID, (api) => {
  let lastStoryId: string | undefined;

  api.on(GLOBALS_UPDATED, () => {
    const { storyId } = api.getUrlState();
    if (storyId === lastStoryId) return;

    const isFirstStory = lastStoryId === undefined;
    lastStoryId = storyId;
    if (isFirstStory) return;

    const value = api.getUserGlobals().viewport?.value;
    if (typeof value !== "string" || !DRAGGED_SIZE.test(value)) return;
    if (api.getStoryGlobals().viewport) return;

    api.updateGlobals({ viewport: { value: undefined, isRotated: false } });
  });
});
