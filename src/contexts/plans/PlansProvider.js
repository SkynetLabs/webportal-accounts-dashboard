import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import freePlan from "../../lib/tiers";
import { usePortalSettings } from "../portal-settings";

import { PlansContext } from "./PlansContext";

/**
 * NOTE:  this function heavily relies on the fact that each Plan's `tier`
 *        property corresponds to the plan's index in UserLimits array in
 *        skynet-accounts code.
 *
 * @see https://github.com/SkynetLabs/skynet-accounts/blob/7337e740b71b77e6d08016db801e293b8ad81abc/database/user.go#L53-L101
 */
const aggregatePlansAndLimits = (plans, limits, { includeFreePlan }) => {
  const allPlans = includeFreePlan ? [freePlan, ...plans] : [...plans];
  const sortedPlans = allPlans.sort((planA, planB) => planA.tier - planB.tier);

  // Decorate each plan with its corresponding limits data, if available.
  if (limits?.length) {
    return limits
      .map((limitsDescriptor, index) => {
        const asssociatedPlan = sortedPlans.find((plan) => plan.tier === index);

        if (asssociatedPlan) {
          return {
            ...asssociatedPlan,
            limits: limitsDescriptor || null,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  // If we don't have the limits data yet, set just return the plans.

  return sortedPlans;
};

export const PlansProvider = ({ children }) => {
  const { settings } = usePortalSettings();
  const { data: limits, error: limitsError } = useSWRImmutable("limits");
  let { data: rawPlans, error: plansError } = useSWRImmutable("stripe/prices");

  // if the error is that stripe is not configured but portal does not require subscriptions, we can ignore it
  if (plansError?.message === "Stripe integration is not configured" && !settings.isSubscriptionRequired) {
    plansError = null;
  }

  const [plans, setPlans] = useState(settings.isSubscriptionRequired ? [] : [freePlan]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hasError = plansError || limitsError;
    const hasAllData = settings.isSubscriptionRequired ? rawPlans && limits : limits;
    const isLoading = !hasError && !hasAllData;

    setLoading(isLoading);

    if (plansError || limitsError) {
      setError(plansError || limitsError);
    } else if (rawPlans || limits) {
      setPlans(
        aggregatePlansAndLimits(rawPlans || [], limits?.userLimits, {
          includeFreePlan: !settings.isSubscriptionRequired,
        })
      );
    }
  }, [rawPlans, limits, plansError, limitsError, settings.isSubscriptionRequired]);

  return <PlansContext.Provider value={{ plans, error, loading }}>{children}</PlansContext.Provider>;
};
