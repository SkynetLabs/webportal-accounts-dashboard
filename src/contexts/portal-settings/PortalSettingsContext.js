import { createContext } from "react";

const { GATSBY_PORTAL_DOMAIN } = process.env;

export const defaultSettings = {
  supportEmail: GATSBY_PORTAL_DOMAIN ? `hello@${GATSBY_PORTAL_DOMAIN}` : null,
  areAccountsEnabled: false,
  isAuthenticationRequired: false,
  isSubscriptionRequired: false,
};

export const PortalSettingsContext = createContext(defaultSettings);
