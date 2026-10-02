class ZendeskAPI {
  waitingChanges: (string | object)[][] = [];

  addChanges = (...args: (string | object)[]) => {
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
