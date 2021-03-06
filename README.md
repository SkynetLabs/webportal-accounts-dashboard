[![Release](https://github.com/SkynetLabs/webportal-accounts-dashboard/actions/workflows/ci_release.yml/badge.svg)](https://github.com/SkynetLabs/webportal-accounts-dashboard/actions/workflows/ci_release.yml)

# Skynet Account Dashboard

Code behind [account.skynetpro.net](https://account.skynetpro.net/)

## Development

This is a Gatsby application. To run it locally, all you need is:

- `yarn install`
- `yarn start`

## Accessing remote APIs

To have a fully functioning local environment, you'll need to make the browser believe you're actually on the same domain as a working API (i.e. a remote dev or production server) -- otherwise the browser will block the session cookie.
To do the trick, configure proper environment variables in the `.env.development` file.
This file allows to easily control which domain name you want to use locally and which API you'd like to access.

Example:

```env
PORTAL_DOMAIN=skynetfree.net # Use skynetfree.net APIs
GATSBY_HOST=local.skynetfree.net # [Optional] Address of your local build in case you don't want to run it on localhost.
STRIPE_PUBLISHABLE_KEY=asdf_1234
```

> It's recommended to keep the 2LD the same, so any cookies dispatched by the API work without issues.

With the file configured, run `yarn develop:secure` -- it will run `gatsby develop` with `--https -p=443` options.
If you're on macOS, you may need to `sudo` the command to successfully bind to port `443` (https).

Gatsby will automatically add a proper entry to your `/etc/hosts` file and clean it up when process exits.

## History

The original v1 dashboard can be found in the [skynet-webportal](https://github.com/SkynetLabs/skynet-webportal) [deploy-2022-05-17](https://github.com/SkynetLabs/skynet-webportal/releases/tag/deploy-2022-05-17) tag.
