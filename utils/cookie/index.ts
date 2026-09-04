import { LANGUAGE } from "../../constants";

export function getCookie(name: string) {
  if (typeof window !== "undefined" && name === LANGUAGE) {
    const url = new URL(window.location.href);
    const culture = url.searchParams.get("culture");

    if (url.pathname === "/confirm/LinkInvite" && culture) {
      return culture;
    }
  }

  if (typeof document === "undefined") return undefined;

  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  optionsParam: { [key: string]: unknown } = {},
  disableEncoding = false,
) {
  let options: { [key: string]: unknown } = {
    path: "/",
    ...optionsParam,
  };

  if (options.expires instanceof Date) {
    options = {
      ...options,
      expires: options.expires.toUTCString(),
    };
  }

  let updatedCookie = `${encodeURIComponent(name)}=${disableEncoding ? value : encodeURIComponent(value)}`;

  Object.keys(options).forEach((optionKey) => {
    updatedCookie += "; " + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  });

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, "", {
    "max-age": -1,
  });
}
