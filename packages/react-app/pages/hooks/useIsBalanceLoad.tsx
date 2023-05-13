import React, { useState } from "react";
import { useEffect } from "react";

export default function useIsBalanceLoad() {
  const [balanceLoad, setBalanceLoad] = useState(false);

  useEffect(() => {
    setBalanceLoad(true);
  }, []);
  return balanceLoad;
}
