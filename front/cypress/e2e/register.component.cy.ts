describe('Register E2E', () => {
    beforeEach(() => {
        cy.visit('/register');
        cy.intercept('POST', '/api/auth/register', { statusCode: 201 }).as('register');
    });

    it('should display the registration form', () => {
        cy.get('form').should('exist');
        cy.get('input[formcontrolname="firstName"]').should('exist');
        cy.get('input[formcontrolname="lastName"]').should('exist');
        cy.get('input[formcontrolname="email"]').should('exist');
        cy.get('input[formcontrolname="password"]').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('devrait permettre l’enregistrement', () => {
        cy.get('input[formControlName=email]').type('test@example.com');
        cy.get('input[formControlName=password]').type('Password123!');
        cy.get('input[formControlName=firstName]').type('John');
        cy.get('input[formControlName=lastName]').type('Doe');

        cy.get('form').submit();

        cy.wait('@register').its('response.statusCode').should('eq', 201);
    });

    it('should mark fields as invalid', () => {
        cy.get('input[formcontrolname="firstName"]').type('test');
        cy.get('input[formcontrolname="lastName"]').type('test');
        cy.get('input[formcontrolname="email"]').type('invalid-email');
        cy.get('input[formcontrolname="password"]').type('test');

        cy.get('input[formcontrolname="firstName"]').clear();
        cy.get('input[formcontrolname="lastName"]').clear();
        cy.get('input[formcontrolname="password"]').clear();

        cy.get('input[formcontrolname="firstName"]').should('have.class', 'ng-invalid');
        cy.get('input[formcontrolname="lastName"]').should('have.class', 'ng-invalid');
        cy.get('input[formcontrolname="email"]').should('have.class', 'ng-invalid');
        cy.get('input[formcontrolname="password"]').should('have.class', 'ng-invalid');
    });

    /*
    it('should register a new user successfully', () => {
      cy.get('input[formcontrolname="firstName"]').type('firstnameuser');
      cy.get('input[formcontrolname="lastName"]').type('lastnameuser');
      cy.get('input[formcontrolname="email"]').type('testuser@example.com');
      cy.get('input[formcontrolname="password"]').type('Password123!');
      cy.get('button[type="submit"]').click();
  
      // Vérifier redirection ou message de succès
      cy.url().should('include', '/auth/login');
      cy.contains('Registration successful').should('exist');
    });
    */
});