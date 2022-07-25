import { withIconProps } from "../withIconProps";

export const CircledErrorIcon = withIconProps(({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />
    <polygon
      fill="currentColor"
      fillRule="evenodd"
      points="20.72 10.25 22.14 11.66 17.19 16.61 22.14 21.56 20.72 22.98 15.77 18.02 10.82 22.98 9.41 21.56 14.36 16.61 9.41 11.66 10.82 10.25 15.77 15.2 20.72 10.25"
    />
  </svg>
));
