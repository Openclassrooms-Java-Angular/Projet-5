describe('Register E2E', () => {
    beforeEach(() => {
        cy.visit('/register');
        cy.intercept('POST', '/api/auth/register', { statusCode: 201 }).as('register');
    });

    it('devrait permettre l’enregistrement', () => {
        cy.get('input[formControlName=email]').type('test@example.com');
        cy.get('input[formControlName=password]').type('Password123!');
        cy.get('input[formControlName=firstName]').type('John');
        cy.get('input[formControlName=lastName]').type('Doe');

        cy.get('form').submit();

        cy.wait('@register').its('response.statusCode').should('eq', 201);
    });
});