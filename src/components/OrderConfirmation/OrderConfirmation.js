import * as React from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import { Metadata } from "../Metadata";
import { ActionStateIcon } from "../Icons";
import { Panel } from "../Panel";
import HighlightedLink from "../HighlightedLink";

import { usePlans } from "../../contexts/plans";
import { usePortalSettings } from "../../contexts/portal-settings";
import accountsService from "../../services/accountsService";
import { DATE_FORMAT } from "../../lib/config";

import { PriceInfo } from "./PriceInfo";

const State = {
  Waiting: "Waiting",
  Success: "Success",
  Failure: "Failure",
};

const TITLE_BY_STATE = {
  Waiting: "Processing payment",
  Success: "Success!",
  Failure: "Error occurred",
};

export const OrderConfirmation = ({ sessionId }) => {
  const { settings } = usePortalSettings();
  const { getPlanById } = usePlans();
  const [state, setState] = React.useState(State.Waiting);
  const [subscription, setSubscription] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const sub = await accountsService.get(`stripe/checkout/${sessionId}`).json();
        setSubscription(sub);
        setState(sub.status === "active" ? State.Success : State.Failure);
      } catch (err) {
        setState(State.Failure);
        setSubscription(null);
        console.log(err);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, getPlanById]);

  return (
    <Panel className="px-3">
      <Metadata>
        <title>{TITLE_BY_STATE[state]}</title>
      </Metadata>
      <div className="w-full mb-8 flex flex-col gap-4 px-12 items-center">
        <ActionStateIcon
          size={100}
          state={state}
          className="transition-colors duration-300 ease-in-out"
          waitingClass="!text-palette-200/70"
          successClass="!text-primary"
          failureClass="!text-error"
        />
        {state === State.Waiting && <h4 className="text-center">Confirming your purchase...</h4>}
        {state === State.Failure && (
          <div className="text-center">
            <p className="font-bold mb-4">We encountered a problem contacting our payments provider.</p>
            <p>
              If you purchased a subscription, but don't see it on your account, please contact us at{" "}
              <HighlightedLink as="a" href={`mailto:${settings.supportEmail}`}>
                {settings.supportEmail}
              </HighlightedLink>
              .
            </p>
          </div>
        )}
        {state === State.Success && (
          <>
            <h4 className="text-center">Subscription activated!</h4>
            <div>
              <table className="table-fixed w-full sm:w-[400px]">
                <tbody>
                  <tr>
                    <td className="px-2" align="right" width="100">
                      <strong>Plan</strong>
                    </td>
                    <td className="px-2">Skynet Plus</td>
                  </tr>
                  <tr>
                    <td className="px-2" align="right" width="100">
                      <strong>Start date</strong>
                    </td>
                    <td className="px-2">{dayjs(subscription.startDate * 1000).format(DATE_FORMAT)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 align-top" align="right" width="100">
                      <strong>Price</strong>
                    </td>
                    <td className="px-2 ">
                      <PriceInfo
                        amount={subscription.plan.amount}
                        currency={subscription.plan.currency}
                        discount={subscription.discount}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        {state !== State.Waiting && (
          <p className="my-4 text-center">
            <HighlightedLink to="/">go back to the dashboard</HighlightedLink>
          </p>
        )}
      </div>
    </Panel>
  );
};

OrderConfirmation.propTypes = {
  /**
   * ID of the checkout session in Stripe
   */
  sessionId: PropTypes.string.isRequired,
};
