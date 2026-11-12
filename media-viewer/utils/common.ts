export function loadScript(
  url: string,
  id: string,
  onLoad: (e: Event) => void,
  onError: OnErrorEventHandler,
) {
  try {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("id", id);

    if (onLoad) script.onload = onLoad;
    if (onError) script.onerror = onError;

    script.src = url;
    script.async = true;

    document.body.appendChild(script);
  } catch (e) {
    console.error(e);
  }
}

export const getFileExtension = (fileTitleParam: string) => {
  let fileTitle = fileTitleParam;
  if (!fileTitle) {
    return "";
  }
  fileTitle = fileTitle.trim();
  const posExt = fileTitle.lastIndexOf(".");
  return posExt >= 0 ? fileTitle.substring(posExt).trim().toLowerCase() : "";
};
