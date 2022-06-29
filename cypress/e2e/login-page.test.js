context("/", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("should render page title", () => {
    cy.title().should("eq", "Sign In | Account Dashboard");
  });
});
