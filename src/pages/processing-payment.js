import * as React from "react";

import { useUser } from "../contexts/user";
import { PlansProvider } from "../contexts/plans/PlansProvider";
import DashboardLayout from "../layouts/DashboardLayout";
import { Metadata } from "../components/Metadata";
import dayjs from "dayjs";
import { ContainerLoadingIndicator } from "../components/LoadingIndicator";
import { CheckmarkIcon } from "../components/Icons";

const hasSubscriptionUpdated = (oldRecord, newRecord) => dayjs(newRecord.subscribedUntil).isAfter(dayjs(oldRecord.subscribedUntil));

const State = {
  Waiting: 'Waiting',
  Success: 'Success',
};

const Page = () => {
  const { user, error: userError, mutate: reloadUserState } = useUser();
  const hasError = userError;
  const [state, setState] = React.useState(State.Waiting);
  
  // We want to persist the initial value between renders, so that we
  // know when (if) it changed.
  const oldUserData = React.useMemo(() => ({ ...user }), []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (hasSubscriptionUpdated(oldUserData, user)) {
      setState(State.Success);
    }
  }, [user, oldUserData])

  // Fetch current subscription data.
  React.useEffect(() => {
    const timer = setInterval(reloadUserState, 5000);

    return () => clearInterval(timer);
  }, [reloadUserState]);
  
  return (
    <PlansProvider>
      <Metadata>
        <title>Processing payment</title>
      </Metadata>
      <h2>We're processing your payment</h2>
      <p>Please wait</p>
      {state === State.Waiting && <ContainerLoadingIndicator className="!text-palette-200" />}
      {state === State.Success && (
        <div className="flex justify-center p-8">
          <CheckmarkIcon size={150} className="!text-primary" circled />
        </div>
      )}
    </PlansProvider>
  );
};

const ProcessingPaymentPage = () => (
  <PlansProvider>
    <Page />
  </PlansProvider>
);

ProcessingPaymentPage.Layout = DashboardLayout;

export default ProcessingPaymentPage;
