// Hooks that run synchronously inside the click handler of a dialog's
// primary button, before the dialog's own `onSubmit`. The chat library owns
// its dialogs and exposes no click-time callback for the tool-approval one,
// while some hosts need to act inside the user gesture (e.g. reserve a tab
// before the popup blocker can veto it). Interceptors are registered by
// whoever knows the dialog currently open; the footer only runs them.

type SubmitInterceptor = () => void;

const interceptors = new Set<SubmitInterceptor>();

export const addDialogSubmitInterceptor = (
  interceptor: SubmitInterceptor,
): (() => void) => {
  interceptors.add(interceptor);
  return () => {
    interceptors.delete(interceptor);
  };
};

export const runDialogSubmitInterceptors = (): void => {
  interceptors.forEach((interceptor) => {
    try {
      interceptor();
    } catch (error) {
      console.error("[dialog-footer] submit interceptor failed", error);
    }
  });
};
