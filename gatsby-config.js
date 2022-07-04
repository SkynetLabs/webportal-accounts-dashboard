require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { createProxyMiddleware } = require("http-proxy-middleware");

const { PORTAL_DOMAIN, GATSBY_HOST } = process.env;

module.exports = {
  siteMetadata: {
    title: `Account Dashboard`,
    siteUrl: `https://account.${PORTAL_DOMAIN}`,
  },
  trailingSlash: "never",
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-provide-react",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["PORTAL_DOMAIN", "STRIPE_PUBLISHABLE_KEY"],
      },
    },
  ],
  developMiddleware: (app) => {
    // Proxy Accounts service API requests:
    app.use(
      "/api/",
      createProxyMiddleware({
        target: `https://account.${PORTAL_DOMAIN}`,
        secure: false, // Do not reject self-signed certificates.
        changeOrigin: true,
        // We need to get rid of "secure" flag in the authorization cookie:
        onProxyRes(proxyResponse, req, serverResponse) {
          const originalCookies = proxyResponse.headers["set-cookie"];

          if (Array.isArray(originalCookies)) {
            console.log("Attempt at making the cookie insecure");
            const newCookies = originalCookies.map((cookie) => {
              const attributes = cookie.split("; ");
              // Retain all cookie attributes besides "Secure" flag:
              const filtered = attributes.filter((attr) => attr.trim().toLowerCase() !== "secure");

              return filtered.join("; ");
            });

            proxyResponse.headers["set-cookie"] = newCookies;
          }
        },
        cookieDomainRewrite: {
          // Allows logging in on localhost
          [PORTAL_DOMAIN]: GATSBY_HOST || "localhost",
        },
      })
    );

    // Proxy /skynet requests (e.g. uploads)
    app.use(
      ["/skynet", "/__internal/"],
      createProxyMiddleware({
        target: `https://${PORTAL_DOMAIN}`,
        secure: false, // Do not reject self-signed certificates.
        changeOrigin: true,
        pathRewrite: {
          "^/skynet": "",
        },
      })
    );
  },
};
