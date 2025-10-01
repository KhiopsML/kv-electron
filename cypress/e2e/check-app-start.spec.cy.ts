import "cypress-shadow-dom";

describe("Electron App UI", () => {
  it('should display "open a file from the menu"', () => {
    cy.visit("/");

    cy.get("khiops-visualization", { timeout: 15000 }).should("exist");
    cy.wait(3000);

    cy.get("khiops-visualization")
      .shadow()
      .find("app-home-layout", { timeout: 10000 })
      .should("exist")
      .then(($layout) => {
        cy.log(
          "App-home-layout found, text content length: " + $layout.text().length
        );
      });

    cy.get("khiops-visualization")
      .shadow()
      .find("app-home-layout")
      .contains("open a file from the menu", {
        matchCase: false,
        timeout: 10000,
      })
      .should("exist");
  });
});
