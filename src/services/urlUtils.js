// regexp source: https://stackoverflow.com/a/19709846
const externalUrlRegExp = /^(?:[a-z]+:)?\/\//;

export function isExternalUrl(url) {
  return externalUrlRegExp.test(url);
}

export function isInternalUrl(url) {
  return !isExternalUrl(url);
}
