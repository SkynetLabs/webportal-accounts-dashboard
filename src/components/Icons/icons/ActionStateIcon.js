import cn from "classnames";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { withIconProps } from "../withIconProps";
import { CircledErrorIcon } from "./CircledErrorIcon";

const SpinnerWrapper = styled("g").attrs(({ $animated }) => ({
  className: cn("origin-center", {
    "animate-spin": $animated,
    "animate-spinningScaleDown": !$animated,
  }),
}))``;

const Spinner = forwardRef(({ animated }, ref) => (
  <SpinnerWrapper ref={ref} $animated={animated}>
    <rect fill="currentColor" x="15" y="22" width="2" height="4" />
    <rect fill="currentColor" x="8.34" y="20.66" width="4" height="2" transform="translate(-12.28 13.66) rotate(-45)" />
    <rect fill="currentColor" x="20.66" y="19.66" width="2" height="4" transform="translate(-8.97 21.66) rotate(-45)" />
    <rect fill="currentColor" x="6" y="15" width="4" height="2" />
    <rect fill="currentColor" x="22" y="15" width="4" height="2" />
    <rect fill="currentColor" x="9.34" y="8.34" width="2" height="4" transform="translate(-4.28 10.34) rotate(-45)" />
    <rect fill="currentColor" x="19.66" y="9.34" width="4" height="2" transform="translate(-0.97 18.34) rotate(-45)" />
    <rect fill="currentColor" x="15" y="6" width="2" height="4" />
  </SpinnerWrapper>
));

const Checkmark = () => (
  <polygon
    fill="currentColor"
    points="22.45 11.19 23.86 12.61 14.44 22.03 9.69 17.28 11.1 15.86 14.44 19.2 22.45 11.19"
    className="origin-center animate-spinningScaleUp"
  />
);

const State = {
  Waiting: "Waiting",
  Success: "Success",
  Failure: "Failure",
};

export const ActionStateIcon = withIconProps(
  ({ state, failure, className, waitingClass, successClass, failureClass, size, ...props }) => {
    const [transitioning, setTransitioning] = useState(false);
    const complete = state !== State.Waiting;
    const showSpinner = !complete || transitioning;
    const spinner = useRef();

    useEffect(() => {
      if (spinner.current) {
        const spinnerEl = spinner.current;
        const enterTransitioningState = () => setTransitioning(true);
        const leaveTransitioningState = () => setTransitioning(false);

        spinnerEl.addEventListener("animationstart", enterTransitioningState);
        spinnerEl.addEventListener("animationend", leaveTransitioningState);

        return () => {
          spinnerEl.removeEventListener("animationstart", enterTransitioningState);
          spinnerEl.removeEventListener("animationend", leaveTransitioningState);
        };
      }
    }, []);

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        className={cn(className, {
          [waitingClass]: state === State.Waiting,
          [successClass]: state === State.Success,
          [failureClass]: state === State.Failure,
        })}
        {...props}
      >
        <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />
        {showSpinner && <Spinner ref={spinner} animated={!complete} />}
        {state === State.Failure && <CircledErrorIcon />}
        {state === State.Success && <Checkmark />}
      </svg>
    );
  }
);

ActionStateIcon.propTypes = {
  ...ActionStateIcon.propTypes,
  /**
   * Has the action succeeded?
   */
  state: PropTypes.oneOf(Object.values(State)).isRequired,
  /**
   * Optional class names to be applied while `complete` is false.
   */
  waitingClass: PropTypes.string,
  /**
   * Optional class names to be applied while `complete` is false.
   */
  failureClass: PropTypes.string,
  /**
   * Optional class names to be applied while `complete` is true.
   */
  successClass: PropTypes.string,
};
