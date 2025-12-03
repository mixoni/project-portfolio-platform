describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('NEGATIVE TEST:should show validation errors when submitting empty form', () => {
      cy.get('[data-cy="login-submit"]').should('be.disabled');
    });
  
    it('NEGATIVE TEST: should show error message on invalid credentials', () => {
      cy.intercept('POST', '/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('loginRequest');
  
      cy.get('[data-cy="login-email"]').type('wrong@example.com');
      cy.get('[data-cy="login-password"]').type('wrong-password');
  
      cy.get('[data-cy="login-submit"]').should('be.visible');
      cy.get('[data-cy="login-submit"]').click();
  
      cy.wait('@loginRequest');
  
      cy.get('[data-cy="login-error"]')
        .should('be.visible')
        .and('contain.text', 'Invalid credentials');
    });
  
    it('HAPPY PATH: should login successfully and redirect to projects page', () => {
      cy.visit('/login');

      cy.get('[data-cy="login-email"]').type(Cypress.env('username'));
      cy.get('[data-cy="login-password"]').type(Cypress.env('password'));
      cy.get('[data-cy="login-submit"]').click();
    
      cy.url().should('include', '/projects');
    });
  });
  