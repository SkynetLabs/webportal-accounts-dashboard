/// <reference types="cypress" />

context("/", () => {
  context("for guest user", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/user", (req) => {
        req.reply({
          statusCode: 401,
          body: { message: "no api key found" },
        });
      });
      cy.intercept("/__internal/do/not/use/accounts", {
        subscription_required: false,
        subscription: false,
        authenticated: true,
        enabled: true,
        auth_required: true,
      });

      cy.visit("");
    });

    it("should render page title", () => {
      cy.title().should("eq", "Sign In | Account Dashboard");
    });
  });
});
