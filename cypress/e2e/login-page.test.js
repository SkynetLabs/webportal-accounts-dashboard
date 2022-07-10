context("/auth/login", () => {
  context("when user is not authenticated", () => {
    beforeEach(() => {
      cy.mockPortalSettings("portal-auth-only");
      cy.mockUserIdentity("guest");

      cy.visit("/auth/login");
    });

    it("renders login form", () => {
      cy.getByTestId("LoginForm").should("be.visible");
    });

    it("allows switching to sign up form", () => {
      cy.getByTestId("SignUpLink").should("be.visible").click();

      cy.location("pathname").should("eq", "/auth/registration");
    });

    it("allows switching to password recovery form", () => {
      cy.getByTestId("ForgotPasswordLink").should("be.visible").click();

      cy.location("pathname").should("eq", "/auth/reset-password");
    });

    context("when attempts logging in ", () => {
      const mockLoginCall = (response) => {
        cy.intercept("POST", "/api/login", (req) => {
          req.reply(response);
        });
      };

      beforeEach(() => {
        // Fill the form with dummy data, we'll mock response anyway.
        cy.get("#email").type("test@skt.us");
        cy.get("#password").type("abcd1234");
      });

      context("with correct credentials", () => {
        beforeEach(() => {
          mockLoginCall({ statusCode: 204 });
          cy.mockUserIdentity("user-free");
        });

        it("redirects to the dashboard", () => {
          cy.get('button[type="submit"]').click();
          cy.location("pathname").should("eq", "/");
        });
      });

      context("with incorrect credentials", () => {
        beforeEach(() => {
          mockLoginCall({ statusCode: 401, body: { message: "invalid credentials" } });
        });

        it("shows an error message", () => {
          cy.get('button[type="submit"]').click();
          cy.getByTestId("LoginForm").should("contain.text", "invalid credentials");
        });
      });
    });
  });
});

context("/auth/login with redirect URL", () => {
  const redirectUrl = "/settings/developer-settings";

  beforeEach(() => {
    cy.mockPortalSettings("portal-auth-only");
    cy.mockUserIdentity("guest");

    cy.visit(`/auth/login?return_to=${encodeURIComponent(redirectUrl)}`);
  });

  it("redirects to specified URL after logging in", () => {
    cy.intercept("POST", "/api/login", { statusCode: 204 });

    // Fill the form
    cy.get("#email").type("test@skt.us");
    cy.get("#password").type("abcd1234");

    // Submit
    cy.get('button[type="submit"]').click();

    cy.location("pathname").should("eq", redirectUrl);
  });
});
