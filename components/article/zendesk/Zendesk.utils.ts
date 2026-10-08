/** One `zE(...)` call: the command, then whatever it takes - a locale, a z-index, a listener, a settings object. */
type ZendeskArgs = (string | number | object)[];

class ZendeskAPI {
  waitingChanges: ZendeskArgs[] = [];

  addChanges = (...args: ZendeskArgs) => {
    if (typeof window?.document?.createElement !== "undefined" && window?.zE) {
      window?.zE?.apply(null, args);
    } else {
      // console.warn("Zendesk is not initialized yet");
      this.waitingChanges.push(args);
    }
  };

  getChanges = () => {
    return this.waitingChanges;
  };

  clearChanges = () => {
    this.waitingChanges = [];
  };
}

const zendeskAPI = new ZendeskAPI();

export { zendeskAPI };
