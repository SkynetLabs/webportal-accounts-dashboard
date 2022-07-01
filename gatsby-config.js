require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { createProxyMiddleware } = require("http-proxy-middleware");

const { PORTAL_DOMAIN } = process.env;

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
