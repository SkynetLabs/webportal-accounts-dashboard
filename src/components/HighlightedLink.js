import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useLocation } from "react-use";
import styled from "styled-components";

const StyledLink = styled(Link).attrs({
  className: "text-primary underline-offset-2 decoration-1 decoration-dotted hover:text-primary-light hover:underline",
})``;

/**
 * This an extended version of Gatsby's <Link /> component, which
 * is also styled to match Skynet Labs' dashboard's theme.
 */
export default function HighlightedLink({ persistQueryString, to, ...props }) {
  const { search, origin } = useLocation();
  let url = to;

  if (persistQueryString) {
    const targetUrl = new URL(url, origin); // Use current origin as a base (it will be discarded it `url` is an absolute URL)
    const currentQueryParams = new URLSearchParams(search);
    currentQueryParams.forEach((value, key) => {
      // Do not override query params if they exist already
      if (!targetUrl.searchParams.has(key)) {
        targetUrl.searchParams.set(key, value);
      }
    });

    url = targetUrl.toString().replace(origin, "");
  }

  return <StyledLink to={url} {...props} />;
}

HighlightedLink.propTypes = {
  /**
   * If specified, current page's query parameters will be appended
   * to the `to` parameter this component's instance receives.
   *
   * This is useful when we want to persist the redirect URL parameter
   * across subpage's navigation (i.e. switching between login/sign up pages).
   */
  persistQueryString: PropTypes.bool,
};
