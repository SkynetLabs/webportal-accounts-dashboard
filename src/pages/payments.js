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
