export const addLog = (log: string, category: "socket") => {
  if (!window.ClientConfig?.logs?.enableLogs) return;

  if (window.ClientConfig.logs.logsToConsole) console.log(log);
  else {
    if (!window.logs) window.logs = { socket: [] };

    if (!window.logs[category]) window.logs[category] = [];

    window.logs[category].push(log);
  }
};
