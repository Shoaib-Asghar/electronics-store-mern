// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })

describe('Home Page UI Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); // Adjust if your dev server runs on a different port
  });

  it('shows main title and description', () => {
    cy.contains('Welcome to Mughal Electronics').should('be.visible');
    cy.contains('Your one-stop shop for quality gadgets and electronics.').should('be.visible');
  });

  it('displays navigation buttons with correct links', () => {
    cy.get('a[href="/shop"]').should('contain', 'Start Shopping');
    cy.get('a[href="/login"]').should('contain', 'Admin / Customer Login');
    cy.get('a[href="/register"]').should('contain', 'Register as Customer');
  });

  it('renders 3 product category cards', () => {
    cy.contains('Popular Categories').should('be.visible');
    cy.contains('Laptops').should('be.visible');
    cy.contains('Smartphones').should('be.visible');
    cy.contains('Accessories').should('be.visible');

    cy.get('.grid > div').should('have.length', 3);
  });
});