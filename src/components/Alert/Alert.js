import styled from "styled-components";
import cn from "classnames";

export const Alert = styled.div.attrs(({ $variant }) => ({
  className: cn("px-3 py-2 sm:px-6 sm:py-4 rounded border", {
    "bg-blue-100 border-blue-200 text-palette-400": $variant === "info",
    "bg-red-100 border-red-200 text-error": $variant === "error",
    "bg-green-100 border-green-200 text-palette-400": $variant === "success",
    "bg-amber-100 border-amber-300 text-amber-900": $variant === "warning",
  }),
}))``;
