import * as React from "react";
import { useStripe } from "@stripe/react-stripe-js";

import { useUser } from "../contexts/user";
import { PlansProvider } from "../contexts/plans/PlansProvider";
import { usePortalSettings } from "../contexts/portal-settings";
import useActivePlan from "../hooks/useActivePlan";
import DashboardLayout from "../layouts/DashboardLayout";
import { Alert } from "../components/Alert";
import HighlightedLink from "../components/HighlightedLink";
import { Metadata } from "../components/Metadata";
import accountsService from "../services/accountsService";
import { Modal } from "../components/Modal";
import { PlansSlider } from "../components/PlansSlider";

const Page = () => {
  const { user, error: userError } = useUser();
  const { plans, loading, activePlan, error: plansError } = useActivePlan(user);
  const { settings } = usePortalSettings();
  const [showPaymentError, setShowPaymentError] = React.useState(false);
  const stripe = useStripe();
  const hasError = userError || plansError;

  /**
   * It happened in the past that users subscribed via Stripe, but after coming back
   * to the dashboard they didn't see their subscription activated, so they subscribed
   * again (sometimes multiple times).
   *
   * The reason they didn't see their subscription activated in our dashboard is because
   * Stripe is notifying us about purchased subscriptions via webhook events.
   * If these events are delayed for whatever reason, dashboard has no way of knowing about
   * the purchase.
   *
   * To prevent users from attempting consecutive purchases, we'll show a warning saying
   * that the plan activation may take some time.
   *
   * We attempt to only show this warning to users this may relate to. It's not  a bullet-proof
   * check, but should take care of most situations:
   *
   *    - stripeCustomerId is populated when user accesses our Stripe checkout
   *      for the first time.
   *    - subscriptionStatus is populated only when we get a webhook call from Stripe
   *
   * We'll show the warning when stripeCustomerId was created, but subscriptionStatus is blank.
   * It may produce false positives, but we're fine with it for the time being.
   */
  const hasProbablyJustSubscribed = user.stripeCustomerId && !user.subscriptionStatus;

  const handleSubscribe = async (selectedPlan) => {
    try {
      const { sessionId } = await accountsService
        .post("stripe/checkout", {
          json: {
            price: selectedPlan.stripe,
          },
        })
        .json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      setShowPaymentError(true);
      console.error(error);
    }
  };

  return (
    <PlansProvider>
      <Metadata>
        <title>Payments</title>
      </Metadata>
      <div className="w-full mb-24">
        {settings.isSubscriptionRequired && !activePlan && (
          <Alert $variant="info" className="mb-6">
            <p className="font-semibold mt-0">This Skynet portal requires a paid subscription.</p>
            <p>
              If you're not ready for that yet, you can use your account on{" "}
              <HighlightedLink as="a" href="https://skynetfree.net">
                SkynetFree.net
              </HighlightedLink>{" "}
              to store up to 100GB for free.
            </p>
          </Alert>
        )}
        {hasProbablyJustSubscribed && (
          <Alert $variant="warning" className="mb-6">
            <p className="mt-0">
              <strong>When you subscribe</strong>, it may take a few minutes for your new plan to be activated on our
              portal.
            </p>
            {settings.supportEmail ? (
              <p>
                If it takes longer, please contact us at{" "}
                <HighlightedLink as="a" href={`mailto:${settings.supportEmail}`}>
                  {settings.supportEmail}
                </HighlightedLink>{" "}
                and we'll get this sorted out.
              </p>
            ) : (
              <p>If it takes longer, please contact us and we'll get this sorted out.</p>
            )}
          </Alert>
        )}
        {hasError && (
          <div className="flex flex-col items-center justify-center">
            <h3>Oooops!</h3>
            <p>Something went wrong, please try again later.</p>
          </div>
        )}
        <PlansSlider plans={plans} activePlan={activePlan} handleSubscribe={handleSubscribe} loading={loading} />
        {showPaymentError && (
          <Modal onClose={() => setShowPaymentError(false)}>
            <h3>Oops! 😔</h3>
            <p className="font-semibold">There was an error contacting our payments provider</p>
            <p>Please try again later</p>
          </Modal>
        )}
      </div>
    </PlansProvider>
  );
};

const PaymentsPage = () => (
  <PlansProvider>
    <Page />
  </PlansProvider>
);

PaymentsPage.Layout = DashboardLayout;

export default PaymentsPage;
