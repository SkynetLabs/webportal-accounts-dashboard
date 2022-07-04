import { SkynetClient } from "skynet-js";

export default new SkynetClient(`https://${process.env.PORTAL_DOMAIN}`);
