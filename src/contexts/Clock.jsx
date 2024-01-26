import React, { createContext, useState, useMemo } from 'react';

export const ClockContext = createContext(null);

export function ClockContextProvider({ children }) {
  const [clockH, setClockH] = useState(0);
  const [clockM, setClockM] = useState(0);
  const [days, setDays] = useState(0);
  const [prevClockH, setPrevClockH] = useState(0);
  const [prevClockM, setPrevClockM] = useState(0);
  const [delta, setDelta] = useState(0);

  const ClockProviderValue = useMemo(
    () => ({
      clockH,
      setClockH,
      clockM,
      setClockM,
      days,
      setDays,
      prevClockH,
      setPrevClockH,
      delta,
      setDelta,
    }),
    [
      clockH,
      setClockH,
      clockM,
      setClockM,
      days,
      setDays,
      prevClockM,
      setPrevClockM,
      delta,
      setDelta,
    ],
  );

  return <ClockContext.Provider value={ClockProviderValue}>{children}</ClockContext.Provider>;
}
