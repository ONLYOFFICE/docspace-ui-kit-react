const isDocsStoryFrame = (): boolean => {
  try {
    const parent = window.frameElement?.ownerDocument;
    return (
      !!parent && new URL(parent.URL).searchParams.get("viewMode") === "docs"
    );
  } catch {
    return false;
  }
};

export const keepDocsScrollOnFocus = () => {
  if (!isDocsStoryFrame()) return;

  const focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (
    this: HTMLElement,
    options?: FocusOptions,
  ) {
    focus.call(this, { ...options, preventScroll: true });
  };
};
