import { useState, useEffect, useCallback, useRef } from "react";
import { gatesService } from "../services/gatesService.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

export function useGates() {
  const { user } = useAuth();
  const [gates, setGates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingGateId, setUpdatingGateId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gatesService.getGates(user);
      if (isMountedRef.current) {
        setGates(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to fetch gates");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user]);

  const toggleGate = useCallback(
    async (gateId) => {
      setUpdatingGateId(gateId);
      try {
        const updated = await gatesService.toggleGate(gateId, user);
        if (isMountedRef.current) {
          setGates((prev) =>
            prev.map((g) => (g.id === gateId ? updated : g))
          );
          setLastUpdated(new Date());
        }
        return updated;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || "Failed to toggle gate status");
        }
        throw err;
      } finally {
        if (isMountedRef.current) {
          setUpdatingGateId(null);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    isMountedRef.current = true;

    gatesService
      .getGates(user)
      .then((data) => {
        if (isMountedRef.current) {
          setGates(data);
          setIsLoading(false);
          setLastUpdated(new Date());
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          setError(err.message || "Failed to fetch gates");
          setIsLoading(false);
        }
      });

    // Auto-refresh every 10 seconds to simulate live updates
    const interval = setInterval(async () => {
      try {
        const liveData = await gatesService.simulateLiveUpdate(user);
        if (isMountedRef.current) {
          setGates(liveData);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message);
        }
      }
    }, 10000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [user]);

  return {
    gates,
    isLoading,
    error,
    updatingGateId,
    lastUpdated,
    refresh,
    toggleGate,
  };
}
