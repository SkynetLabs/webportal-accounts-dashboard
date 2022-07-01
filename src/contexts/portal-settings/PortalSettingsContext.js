import { createContext } from "react";

const { PORTAL_DOMAIN } = process.env;

export const defaultSettings = {
  supportEmail: PORTAL_DOMAIN ? `hello@${PORTAL_DOMAIN}` : null,
  areAccountsEnabled: false,
  isAuthenticationRequired: false,
  isSubscriptionRequired: false,
};

export const PortalSettingsContext = createContext(defaultSettings);
