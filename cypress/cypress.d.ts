/// <reference types="cypress" />
export {};

type UserIdentityFixtureFile = "guest" | "user-free";
type PortalSettingsFixtureFile = "portal-auth-only";

/**
 * This is where we keep typings for custom commands added to Cypress namespace.
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Select DOM element by data-testid attribute.
       * @example cy.getByTestId("LoginForm")
       */
      getByTestId(testId: string): Cypress.Chainable<Element>;

      /**
       * Intercept requests for portal configuration and respond with a chosen fixture file.
       */
      mockPortalSettings(fixture: PortalSettingsFixtureFile): Cypress.Chainable<null>;

      /**
       * Intercept requests to GET /api/user endpoint and respond with a chosen fixture file.
       */
      mockUserIdentity(fixture: UserIdentityFixtureFile): Cypress.Chainable<null>;
    }
  }
}
