describe('Projects flow', () => {
  it('logs in and sees projects list', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123{enter}');
    cy.url().should('include', '/projects');
    cy.contains('Projects');
  });
});
