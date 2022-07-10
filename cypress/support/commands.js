// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getByTestId", (testId) => cy.get(`[data-testid="${testId}"]`));

Cypress.Commands.add("mockPortalSettings", (fixture) =>
  cy.intercept("/__internal/do/not/use/accounts", {
    fixture: `portal/${fixture}.json`,
  })
);

Cypress.Commands.add("mockUserIdentity", (identity) =>
  cy.intercept("GET", "/api/user", {
    fixture: `user/${identity}.json`,
    statusCode: identity === "guest" ? 401 : 200,
  })
);
