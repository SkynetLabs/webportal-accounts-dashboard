export default function useRedirectParam(location) {
  const query = new URLSearchParams(location.search);
  const redirectTarget = query.get("return_to");

  return {
    // Convert absolute, internal URLs into paths
    url: redirectTarget ? redirectTarget.replace(location.origin, "") : null,
    internal: redirectTarget ? redirectTarget.includes(location.origin) : false,
  };
}
