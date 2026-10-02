import React, { createContext, useContext, useState, useMemo } from "react";

type PaymentContextType = {
  isWaitingCalculation: boolean;
  setIsWaitingCalculation: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialPaymentContext: PaymentContextType = {
  isWaitingCalculation: false,
  setIsWaitingCalculation: () => {},
};

const PaymentContext = createContext<PaymentContextType>(initialPaymentContext);

export const PaymentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isWaitingCalculation, setIsWaitingCalculation] = useState(false);

  const value = useMemo(
    () => ({
      isWaitingCalculation,

      setIsWaitingCalculation,
    }),
    [isWaitingCalculation],
  );

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);
