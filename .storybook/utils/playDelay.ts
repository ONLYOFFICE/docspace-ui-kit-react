import type { StoryContext } from "@storybook/react-vite";
import { instrument } from "storybook/internal/instrumenter";
import { uninstrumentedUserEvent } from "storybook/test";

const PLAY_DELAY = 300;

// `navigator.webdriver` covers Playwright's visual specs (__tests__/), which
// wait for the play function to finish and must not wait 300ms a step.
const isTestRun = (): boolean =>
  "__vitest_browser__" in globalThis ||
  /StorybookTestRunner/.test(globalThis.navigator?.userAgent ?? "") ||
  globalThis.navigator?.webdriver === true;

const accepts = (accept: string, file: File) =>
  !accept ||
  accept.split(",").some((token) => {
    const type = token.trim().toLowerCase();
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
    if (type.endsWith("/*")) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });

const pickFiles = async (
  element: Element,
  fileOrFiles: File | File[],
): Promise<void> => {
  const input = element instanceof HTMLLabelElement ? element.control : element;
  if (!(input instanceof HTMLInputElement) || input.disabled) return;

  const files = (Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles])
    .filter((file) => accepts(input.accept, file))
    .slice(0, input.multiple ? undefined : 1);

  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, PLAY_DELAY));
};

const centreOf = (element: Element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  return {
    x,
    y,
    clientX: x,
    clientY: y,
    pageX: x + scrollX,
    pageY: y + scrollY,
  };
};

const withCoords = (
  userEvent: ReturnType<typeof uninstrumentedUserEvent.setup>,
) => {
  type PointerInput = Parameters<typeof userEvent.pointer>[0];
  type PointerAction = Exclude<PointerInput, readonly unknown[]>;

  const placed = (action: PointerAction): PointerAction =>
    typeof action === "string" || !action.target || "coords" in action
      ? action
      : { ...action, coords: centreOf(action.target) };

  const isList = (input: PointerInput): input is readonly PointerAction[] =>
    Array.isArray(input);

  const pointer = (input: PointerInput) =>
    userEvent.pointer(isList(input) ? input.map(placed) : placed(input));

  const press = (element: Element, keys: string) =>
    pointer([{ target: element }, { keys, target: element }]);

  return {
    ...userEvent,
    pointer,
    hover: (element: Element) => pointer({ target: element }),
    click: (element: Element) => press(element, "[MouseLeft]"),
    dblClick: (element: Element) => press(element, "[MouseLeft][MouseLeft]"),
    tripleClick: (element: Element) =>
      press(element, "[MouseLeft][MouseLeft][MouseLeft]"),
    upload: pickFiles,
  };
};

export const slowDownPlay = (context: StoryContext) => {
  if (isTestRun()) return;

  context.userEvent = instrument(
    {
      userEvent: withCoords(
        uninstrumentedUserEvent.setup({ delay: PLAY_DELAY }),
      ),
    },
    {
      intercept: true,
      getKeys: (obj) =>
        Object.keys(obj).filter((key) => key !== "eventWrapper"),
    },
  ).userEvent;
};
