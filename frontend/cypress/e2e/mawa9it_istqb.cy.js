// mawa9it_istqb.cy.js
describe('MAWA9IT - Tests fonctionnels Boîte Noire ', {
    testIsolation: false,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 30000,
    retries: { runMode: 1, openMode: 1 }
}, () => {

    const baseUrl = 'http://localhost:5173';

    before(() => {
        cy.visit(baseUrl);
        cy.get('body', { timeout: 20000 }).should('be.visible');
    });

    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.clear();
        });
    });

    // Fonction réutilisable EXACTEMENT comme tu l'utilisais
    const createPanne = (data) => {
        cy.visit(`${baseUrl}/cas-panne`);

       
        cy.get('form', { timeout: 20000 }).should('be.visible');
        cy.get('#mechanic', { timeout: 15000 }).should('be.visible'); 

        
        cy.get('#nom').should('be.visible');
        cy.get('#marque').should('be.visible');
        cy.get('#modele').should('be.visible');
        cy.get('#matricule').should('be.visible');
        cy.get('#dropdown').should('be.visible');

        cy.get('#nom').type(data.nom, { delay: 100, force: true });
        cy.get('#marque').type(data.marque, { delay: 100, force: true });
        cy.get('#modele').type(data.modele, { delay: 100, force: true });
        cy.get('#matricule').type(data.matricule, { delay: 100, force: true });

        cy.get('#dropdown').select(data.typePanne);
        cy.get('#mechanic').select('Tous les mécaniciens');

        cy.get('button[type="submit"]').click();

        cy.url({ timeout: 20000 }).should('include', '/liste-cas-panne');
    };

    // Test FONC-001 - Création d'une panne (cas nominal)
    it('FONC-001 | Création complète d\'une panne ', () => {
        const testData = {
            nom: 'Jesser Bensaleh',
            marque: 'Mercedes-Benz',
            modele: 'Actros 2653',
            matricule: '215 TU 301',
            typePanne: 'Moteur'
        };

        createPanne(testData);

        cy.contains('td', testData.marque).should('be.visible');
    });

    // Test FONC-002 - Validation des champs obligatoires
    it('FONC-002 | Validation des champs obligatoires', () => {
        cy.visit(`${baseUrl}/cas-panne`);
        cy.get('form', { timeout: 15000 }).should('be.visible');

        cy.get('button[type="submit"]').click();

        cy.on('window:alert', (text) => {
            expect(text).to.include('remplir tous les champs');
        });
    });

    // Test CONF-001 - Modification d'une panne
    it('CONF-001 | Modification d\'une panne', () => {
        const testData = {
            nom: 'Test Modification',
            marque: 'Volvo',
            modele: 'FH16',
            matricule: 'TEST123',
            typePanne: 'Batterie'
        };

        createPanne(testData);

        cy.contains('td', testData.marque)
            .should('be.visible')
            .parent('tr')
            .within(() => {
                cy.contains('button', 'Modifier').click();
            });

        cy.get('input[name="marque"]').clear().type('Volvo Modifié', { delay: 50, force: true });
        cy.contains('button', 'Sauvegarder').click();

        cy.contains('Volvo Modifié').should('be.visible');
    });

    // Test REG-001 - Suppression d'une panne (CORRIGÉ)
    it('REG-001 | Suppression d\'une panne', () => {
        const testData = {
            nom: 'Test Suppression',
            marque: 'Renault',
            modele: 'Truck',
            matricule: 'DEL123',
            typePanne: 'Pneus'
        };

        createPanne(testData);

        cy.contains('td', testData.marque)
            .should('be.visible')
            .parent('tr')
            .within(() => {
                cy.contains('button', 'Supprimer').click(); 
            });

        cy.on('window:confirm', () => true);

        cy.contains(testData.marque).should('not.exist');
    });

    // Test MAINT-001 - Champ mécanicien
    it('MAINT-001 | Champ "Mécanicien à notifier"', () => {
        cy.visit(`${baseUrl}/cas-panne`);

        cy.get('form', { timeout: 15000 }).should('be.visible');

        cy.get('#mechanic')
            .should('be.visible')
            .and('be.enabled');

        cy.get('#mechanic').should('have.value', 'all');


        cy.get('#mechanic option').should('have.length.gte', 1);
    });
});