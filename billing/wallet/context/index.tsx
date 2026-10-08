import React, { createContext, useContext, useState, useMemo } from "react";

const AmountContext = createContext<{
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  isBalanceInsufficient: boolean;
  setIsBalanceInsufficient: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useAmountValue = () => {
  const context = useContext(AmountContext);
  if (!context) {
    throw new Error("useAmountValue must be used within an AmountProvider");
  }
  return context;
};

export const AmountProvider: React.FC<{
  children: React.ReactNode;
  initialAmount?: string;
}> = ({ children, initialAmount = "" }) => {
  const [amount, setAmount] = useState<string>(initialAmount);
  const [hasError, setHasError] = useState(false);
  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState(false);
  const value = useMemo(
    () => ({
      amount,
      setAmount,
      hasError,
      setHasError,
      isBalanceInsufficient,
      setIsBalanceInsufficient,
    }),
    [amount, hasError, isBalanceInsufficient],
  );

  return (
    <AmountContext.Provider value={value}>{children}</AmountContext.Provider>
  );
};
