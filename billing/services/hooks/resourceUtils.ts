export const calculateDifference = (
  quantity: number,
  currentAllocated: number,
): number => {
  if (!quantity) return 0;

  return Math.abs(currentAllocated - quantity);
};

export const isUpgrade = (quantity: number, current: number) =>
  quantity > current;

export const isDowngrade = (quantity: number, current: number) =>
  quantity < current;

export const isExceedingLimit = (quantity: number, limit: number) =>
  quantity > limit;

export const isSamePlan = (
  quantity: number,
  hasSubscription: boolean,
  current: number,
) => hasSubscription && quantity === current;
