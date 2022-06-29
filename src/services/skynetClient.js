import { SkynetClient } from "skynet-js";

export default new SkynetClient(
  process.env.NODE_ENV === "production" ? `https://${process.env.GATSBY_PORTAL_DOMAIN}` : ""
);
