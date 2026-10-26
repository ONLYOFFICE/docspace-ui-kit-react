const LOADING_TAB_STYLES = `
  :root {
    color-scheme: light dark;
  }

  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: Canvas;
    color: CanvasText;
    font-family: system-ui, sans-serif;
    font-size: 14px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    border: 3px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    opacity: 0.6;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const openLoadingTab = (text: string) => {
  const tab = window.open("", "_blank");
  if (!tab) return null;

  tab.opener = null;

  const doc = tab.document;
  doc.documentElement.lang = document.documentElement.lang;
  doc.documentElement.dir = document.documentElement.dir;
  doc.title = text;

  const style = doc.createElement("style");
  style.textContent = LOADING_TAB_STYLES;

  const spinner = doc.createElement("div");
  spinner.className = "spinner";
  spinner.setAttribute("role", "status");
  spinner.setAttribute("aria-label", text);

  const label = doc.createElement("p");
  label.textContent = text;
  label.setAttribute("aria-hidden", "true");

  doc.head.append(style);
  doc.body.append(spinner, label);

  return tab;
};
