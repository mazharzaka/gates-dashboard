import { useState, useEffect } from "react";
import { gatesService } from "../services/gatesService.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

export function useGateOccupants(gateId) {
  const { user } = useAuth();
  const [occupants, setOccupants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gateId) {
      return;
    }

    let isMounted = true;

    gatesService
      .getGateOccupants(gateId, user)
      .then((data) => {
        if (isMounted) {
          setOccupants(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to fetch occupants");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [gateId, user]);

  return {
    occupants: gateId ? occupants : [],
    isLoading: gateId ? isLoading : false,
    error: gateId ? error : null,
  };
}

export default useGateOccupants;
