/**
 * One sentence for a failed portal call, classified the way the connection
 * sample explains: a refusal has a status, and no status at all means the
 * browser never got an answer, which is nearly always CORS.
 *
 * `denied` completes "this identity may not ..." for a 401 or 403.
 */
export const explainPortalError = (error: unknown, denied: string) => {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  if (status === 401 || status === 403) {
    return `The portal answered ${status}: this identity may not ${denied}.`;
  }
  if (status === undefined) {
    return "No answer from the portal -- usually CORS, sometimes a wrong host.";
  }
  return `The portal answered ${status}.`;
};
