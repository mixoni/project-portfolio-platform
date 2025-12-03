describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    // 1) NEGATIVNI: prazna forma
    it('should show validation errors when submitting empty form', () => {
      cy.get('[data-cy="login-submit"]').click();
  
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });
  
    // 2) NEGATIVNI: pogrešne kredencijale
    it('should show error message on invalid credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('loginRequest');
  
      cy.get('[data-cy="login-email"]').type('wrong@example.com');
      cy.get('[data-cy="login-password"]').type('wrong-password');
  
      cy.get('[data-cy="login-submit"]').click();
  
      cy.wait('@loginRequest');
  
      cy.get('[data-cy="login-error"]')
        .should('be.visible')
        .and('contain.text', 'Invalid credentials');
    });
  
    // 3) HAPPY PATH: uspešan login + redirect
    it('should login successfully and redirect to projects page', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          accessToken: 'fake-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      }).as('loginRequest');
  
      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"]').type('Password123!');
  
      cy.get('[data-cy="login-submit"]').click();
  
      cy.wait('@loginRequest');
  
      cy.window().then((win) => {
        const token = win.localStorage.getItem('accessToken');
        expect(token).to.eq('fake-jwt-token');
      });
  
      cy.url().should('include', '/projects');
      cy.contains('Project').should('be.visible'); // npr. H1/tekst na /projects strani
    });
  });
  