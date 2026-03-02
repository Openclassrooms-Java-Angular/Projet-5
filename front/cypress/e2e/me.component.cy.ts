describe('Me page E2E', () => {
    beforeEach(() => {
        let user = {
            id: 1,
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: '2025-01-08',
            updatedAt: '2024-02-15'
        };

        cy.login({ email: 'user@example.com', password: 'Password123!', admin: false });

        cy.intercept('GET', '/api/user/1', {
            statusCode: 200,
            body: user
        }).as('getUser');

        cy.intercept('GET', '/api/me', {
            body: user
        }).as('getMe');

        cy.contains('span', 'Account').should('exist').click();
    });

    it('devrait afficher les informations de l’utilisateur', () => {
        cy.contains('John').should('exist');
        cy.contains('DOE').should('exist');
        cy.contains('user@example.com').should('exist');
        cy.contains('Create at: January 8, 2025').should('exist');
        cy.contains('Last update: February 15, 2024').should('exist');
    });
});