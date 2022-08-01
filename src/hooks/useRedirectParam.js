import useQueryParam from "./useQueryParam";

export default function useRedirectParam(location) {
  const redirectTarget = useQueryParam("return_to", location);

  return {
    // Convert absolute, internal URLs into paths
    url: redirectTarget ? redirectTarget.replace(location.origin, "") : null,
    internal: redirectTarget ? redirectTarget.includes(location.origin) : false,
  };
}
