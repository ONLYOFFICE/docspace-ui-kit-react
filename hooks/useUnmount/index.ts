import { useEffect, useEffectEvent } from "react";

export const useUnmount = (func: VoidFunction) => {
  const onUnmount = useEffectEvent(func);

  useEffect(() => {
    return () => {
      onUnmount();
    };
  }, []);
};
