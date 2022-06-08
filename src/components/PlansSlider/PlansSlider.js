import React from "react";

import { usePortalSettings } from "../../contexts/portal-settings";
import Slider from "../Slider/Slider";
import { PlanSlide } from "./PlanSlide";
import { PlanPanelSkeleton } from "./PlanSlideSkeleton";

const PAID_PORTAL_BREAKPOINTS = [
  {
    name: "lg",
    scrollable: true,
    visibleSlides: 3,
  },
  {
    name: "sm",
    scrollable: true,
    visibleSlides: 2,
  },
  {
    scrollable: true,
    visibleSlides: 1,
  },
];

const FREE_PORTAL_BREAKPOINTS = [
  {
    name: "xl",
    scrollable: true,
    visibleSlides: 4,
  },
  ...PAID_PORTAL_BREAKPOINTS,
];

export const PlansSlider = ({ plans, activePlan, handleSubscribe, loading }) => {
  const { settings } = usePortalSettings();

  // This will be the base plan that we compare upload/download speeds against.
  // On will either be the user's active plan or lowest of available tiers.
  const basePlan = activePlan || plans[0];

  return (
    <Slider
      slides={plans.map((plan) => (
        <PlanSlide plan={plan} basePlan={basePlan} activePlan={activePlan} handleSubscribe={handleSubscribe} />
      ))}
      breakpoints={settings.isSubscriptionRequired ? PAID_PORTAL_BREAKPOINTS : FREE_PORTAL_BREAKPOINTS}
      className="px-8 sm:px-4 md:px-0 lg:px-0 mt-10"
      SlideSkeletonComponent={PlanPanelSkeleton}
      loading={loading}
    />
  );
};
