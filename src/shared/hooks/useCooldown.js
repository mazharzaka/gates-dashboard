import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage a temporary cooldown state for actions/buttons
 * @param {number} ms Cooldown duration in milliseconds (default 5000)
 * @returns {{ isCoolingDown: boolean, start: () => void }}
 */
export function useCooldown(ms = 5000) {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setIsCoolingDown(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsCoolingDown(false);
      timerRef.current = null;
    }, ms);
  }, [ms]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { isCoolingDown, start };
}

export default useCooldown;

