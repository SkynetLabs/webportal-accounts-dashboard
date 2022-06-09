import cn from "classnames";
import styled from "styled-components";
import humanBytes from "../../lib/humanBytes";
import { Button } from "../Button";

import { CheckmarkIcon } from "../Icons";
import { Panel } from "../Panel";

const PlanSummaryItem = ({ children }) => (
  <li className="flex items-start gap-1 my-2">
    <CheckmarkIcon size={32} className="text-primary shrink-0" />
    <div className="mt-1">{children}</div>
  </li>
);

const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
  height: 6rem;
`;

const Price = ({ price }) => (
  <div className="my-8 text-center">
    <h2>
      <sup className="text-lg -top-4">$</sup>
      {price}
    </h2>
    <p className="uppercase text-sm font-light -mt-2">per month</p>
  </div>
);

const bandwidth = (value) => `${humanBytes(value, { bits: true })}/s`;

const storage = (value) => humanBytes(value, { binary: true });

const localizedNumber = (value) => value.toLocaleString();

export const PlanSlide = ({ plan, activePlan, basePlan, handleSubscribe }) => {
  const isHigherThanCurrent = plan.tier > activePlan?.tier;
  const isCurrentPlanPaid = activePlan?.tier > 1;
  const isCurrent = plan.tier === activePlan?.tier;
  const isLower = plan.tier < activePlan?.tier;
  const speed = plan.limits.uploadBandwidth;
  const currentSpeed = basePlan?.limits?.uploadBandwidth;
  const speedChange = speed > currentSpeed ? speed / currentSpeed : currentSpeed / speed;
  const hasActivePlan = Boolean(activePlan);

  return (
    <Panel
      className={cn("min-h-[620px] px-6 py-10 flex flex-col relative h-full shadow-md", {
        "border border-primary": isCurrent,
      })}
      wrapperClassName="h-full"
    >
      {isCurrent && (
        <div className="absolute top-0 left-0 w-full h-6 bg-white px-6 rounded-t">
          <span className="font-sans uppercase font-semibold text-xs bg-palette-100 px-2 py-1.5 rounded-b-md">
            Current plan
          </span>
        </div>
      )}
      <h3>{plan.name}</h3>
      <Description>{plan.description}</Description>
      <Price price={plan.price} />

      <div className="text-center my-6">
        {(!hasActivePlan || isHigherThanCurrent) &&
          (isCurrentPlanPaid ? (
            <Button $primary as="a" href="/api/stripe/billing">
              Upgrade
            </Button>
          ) : (
            <Button $primary onClick={() => handleSubscribe(plan)}>
              Upgrade
            </Button>
          ))}
        {isCurrent && <Button disabled>Current</Button>}
        {isLower && (
          <Button as="a" href="/api/stripe/billing">
            Choose
          </Button>
        )}
      </div>
      {plan.limits && (
        <ul className="-ml-2">
          <PlanSummaryItem>Pin up to {storage(plan.limits.storageLimit)} on decentralized storage</PlanSummaryItem>
          <PlanSummaryItem>Support for up to {localizedNumber(plan.limits.maxNumberUploads)} files</PlanSummaryItem>
          <PlanSummaryItem>
            {speed === currentSpeed
              ? `${bandwidth(plan.limits.uploadBandwidth)} upload and ${bandwidth(
                  plan.limits.downloadBandwidth
                )} download`
              : `${speedChange}X ${speed > currentSpeed ? "faster" : "slower"} upload and download speeds (${bandwidth(
                  plan.limits.uploadBandwidth
                )} and ${bandwidth(plan.limits.downloadBandwidth)})`}
          </PlanSummaryItem>
          <PlanSummaryItem>
            {plan.limits.maxUploadSize === plan.limits.storageLimit
              ? "No limit to file upload size"
              : `Upload files up to ${storage(plan.limits.maxUploadSize)}`}
          </PlanSummaryItem>
        </ul>
      )}
    </Panel>
  );
};
