export function getOAuthToken(
  tokenGetterWin: Window | string | null,
): Promise<string> {
  return new Promise((resolve, reject) => {
    localStorage.removeItem("code");
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      try {
        const code = localStorage.getItem("code");
        if (typeof tokenGetterWin !== "string") {
          if (code) {
            localStorage.removeItem("code");
            clearInterval(interval);
            resolve(code);
          } else if (tokenGetterWin?.closed) {
            clearInterval(interval);
            reject();
          }
        }
      } catch (e) {
        clearInterval(interval);
        reject(e);
      }
    }, 500);
  });
}
