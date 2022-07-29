import * as React from "react";
import dayjs from "dayjs";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { Metadata } from "../Metadata";
import { ActionStateIcon, ArrowRightIcon } from "../Icons";
import { Panel } from "../Panel";
import HighlightedLink from "../HighlightedLink";
import { usePortalSettings } from "../../contexts/portal-settings";
import { DATE_FORMAT } from "../../lib/config";

import { PriceInfo } from "./PriceInfo";
import { useCheckoutSessionState, RequestState } from "./useCheckoutSessionState";

const TITLE_BY_STATE = {
  Waiting: "Processing payment",
  Success: "Success!",
  Failure: "Error occurred",
};

export const OrderConfirmation = ({ sessionId }) => {
  const { settings } = usePortalSettings();
  const { requestState, subscription, isTakingTooLong } = useCheckoutSessionState(sessionId);

  return (
    <Panel className="px-3">
      <Metadata>
        <title>{TITLE_BY_STATE[requestState]}</title>
      </Metadata>
      <div className="w-full mb-8 flex flex-col gap-4 px-12 items-center">
        <ActionStateIcon
          size={100}
          state={requestState}
          className="transition-colors duration-300 ease-in-out"
          waitingClass="!text-palette-200/70"
          successClass="!text-primary"
          failureClass="!text-error"
        />
        {requestState === RequestState.Waiting && (
          <div className="text-center">
            <h4>Confirming your purchase...</h4>

            {isTakingTooLong ? (
              <p className="text-palette-400">Sorry, this is taking longer than usual.</p>
            ) : (
              <p className="font-bold">Please wait...</p>
            )}
          </div>
        )}
        {requestState === RequestState.Failure && (
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
        {requestState === RequestState.Success && (
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
        {requestState !== RequestState.Waiting && (
          <p>
            <Link className="inline-flex mt-6 items-center gap-3 ease-in-out hover:brightness-90" to="/">
              <span className="bg-primary rounded-full w-[32px] h-[32px] inline-flex justify-center items-center">
                <ArrowRightIcon />
              </span>
              <span className="font-sans text-xs uppercase text-palette-400">go to the dashboard</span>
            </Link>
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
