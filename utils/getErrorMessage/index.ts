type TApiErrorShape = {
  message?: string;
  response?: {
    data?: {
      error?: {
        message?: string | number;
      };
    };
  };
};

export const getErrorMessage = (err: unknown) => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as TApiErrorShape;
    const responseMessage = e.response?.data?.error?.message;
    if (typeof responseMessage === "string") return responseMessage;
    if (typeof responseMessage === "number") return String(responseMessage);
    if (typeof e.message === "string") return e.message;
  }
  return "";
};