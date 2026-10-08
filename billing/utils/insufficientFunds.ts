export const isInsufficientFundsError = (error: unknown) => {
  const response = (
    error as {
      response?: {
        status?: number;
        data?: { error?: { message?: string } };
      };
    } | null
  )?.response;

  return (
    response?.status === 402 &&
    (response.data?.error?.message ?? "").includes("Not enough balance")
  );
};
