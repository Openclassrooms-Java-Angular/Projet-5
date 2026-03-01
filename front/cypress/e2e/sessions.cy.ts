describe('Sessions E2E', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/session', { fixture: 'sessions.json' }).as('getSessions');

        cy.login({
            email: 'yoga@studio.com',
            password: 'test!1234',
            admin: true
        });
    });

    it('devrait afficher la liste des sessions', () => {
        cy.get('.items mat-card').should('have.length', 2);
        cy.contains('Yoga débutant');
        cy.contains('Yoga avancé');
    });

    it('devrait créer une session', () => {
        cy.get('button[routerlink="create"]').click();

        cy.get('input[formControlName=name]').type('Yoga expert');

        cy.get('input[formControlName=date]').type('2026-03-22');

        cy.get('mat-select[formControlName=teacher_id]').click({ force: true });
        cy.wait(300);
        cy.get('mat-option').contains('Bob Martin').click({ force: true });

        cy.get('textarea[formControlName=description]').type('Cours pour grands pratiquants');

        cy.intercept('POST', '/api/session', { statusCode: 201, body: { id: 99 } }).as('createSession');

        cy.get('form').submit();

        cy.wait('@createSession');
        cy.url().should('include', '/sessions');
    });
});

describe('Participation session', () => {

    beforeEach(() => {
        cy.login({
            email: 'user@studio.com',
            password: 'test!1234',
            admin: false
        })
    })

    it('devrait participer à une session', () => {

        let participated = false

        cy.intercept('GET', '/api/session', {
            fixture: 'sessions.json'
        }).as('getSessions')

        cy.intercept('GET', '/api/session/1', (req) => {
            req.reply({
                body: {
                    id: 1,
                    name: 'Yoga débutant',
                    date: '2026-03-20',
                    teacher_id: 1,
                    description: 'Cours test',
                    users: participated ? [{ id: 1 }] : []
                }
            })
        }).as('getSessionDetail')

        cy.intercept('POST', '/api/session/1/participate/1', (req) => {
            participated = true
            req.reply({ statusCode: 200 })
        }).as('participate')

        cy.intercept('GET', '/api/teacher/1', {
            body: {
                id: 1,
                name: 'Bob Martin'
            }
        }).as('getTeacher')

        cy.get('mat-card')
            .first()
            .contains('button', 'Detail')
            .click()

        cy.wait('@getSessionDetail')

        cy.contains('button', 'Participate')
            .should('exist')
            .click()

        cy.wait('@participate')

        cy.wait('@getSessionDetail')
    })
});