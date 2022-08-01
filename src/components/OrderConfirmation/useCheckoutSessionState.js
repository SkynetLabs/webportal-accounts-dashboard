import { useCallback, useEffect, useState } from "react";

import accountsService from "../../services/accountsService";

const STRIPE_SUB_ACTIVE_STATUS = "active";

export const RequestState = {
  Waiting: "Waiting",
  Success: "Success",
  Failure: "Failure",
};

export const useCheckoutSessionState = (sessionId, signal) => {
  const [subscription, setSubscription] = useState(null);
  const [requestState, setRequestState] = useState(RequestState.Waiting);
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  const fetchSessionStatus = useCallback(async (sessionId, signal) => {
    try {
      const sub = await accountsService
        .get(`stripe/checkout/${sessionId}`, {
          timeout: 30_000,
          retry: 6,
          signal,
        })
        .json();
      setSubscription(sub);
      setRequestState(sub.status === STRIPE_SUB_ACTIVE_STATUS ? RequestState.Success : RequestState.Failure);
    } catch (err) {
      // We abort the request when component is unmounted.
      // We should prevent updating state if the request was aborted to avoid memory leaks.
      if (err.name !== "AbortError") {
        setRequestState(RequestState.Failure);
        setSubscription(null);
      }
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      const timer = setTimeout(() => setIsTakingTooLong(true), 5000);
      const controller = new AbortController();

      fetchSessionStatus(sessionId, controller.signal);

      return () => {
        controller.abort();
        clearTimeout(timer);
      };
    }
  }, [sessionId, fetchSessionStatus]);

  return {
    subscription,
    requestState,
    isTakingTooLong,
  };
};
