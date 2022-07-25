export default function useQueryParam(parameterName, location) {
  const query = new URLSearchParams(location.search);

  return query.get(parameterName);
}
