/// <reference path="../cypress.d.ts" />

context("/", () => {
  context("when user is not authenticated", () => {
    beforeEach(() => {
      cy.mockPortalSettings("portal-auth-only");
      cy.mockUserIdentity("guest");

      cy.visit("/");
    });

    it("should redirect to the login page with a return_to query param", () => {
      cy.location("pathname").should("eq", "/auth/login");
      cy.location("search").should("contain", "return_to");
    });
  });

  context("when user is authenticated with a free account", () => {
    beforeEach(() => {
      cy.mockUserIdentity("user-free");
    });

    context("when portal allows free accounts", () => {
      beforeEach(() => {
        cy.mockPortalSettings("portal-auth-only");
        cy.visit("/");
      });

      it("should display the dashboard", () => {
        cy.title().should("eq", "Dashboard | Account Dashboard");
        cy.getByTestId("UploaderPanel").should("be.visible");
      });
    });

    context("when portal requires a paid account", () => {
      beforeEach(() => {
        cy.mockPortalSettings("portal-paid-only");
        cy.visit("/");
      });

      it("should redirect to /payments page", () => {
        cy.location("pathname").should("eq", "/payments");
      });
    });
  });

  context("when user is authenticated with a paid account", () => {
    beforeEach(() => {
      cy.mockPortalSettings("portal-paid-only");
      cy.mockUserIdentity("user-paid");
      cy.visit("/");
    });

    it("should display the dashboard", () => {
      cy.title().should("eq", "Dashboard | Account Dashboard");
      cy.getByTestId("UploaderPanel").should("be.visible");
    });
  });
});
