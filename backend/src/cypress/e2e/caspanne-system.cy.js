describe('Système Complet - Gestion des Pannes', () => {
  it('devrait afficher les données des pannes depuis l\'API', () => {
    cy.visit('/caspanne'); // Page de gestion des pannes
    
    // Intercepter l'API des pannes
    cy.intercept('GET', '/caspanne', { 
      fixture: 'pannes.json' 
    }).as('getPannes');
    
    // Vérifier l'affichage des données
    cy.get('[data-testid="pannes-list"]').should('contain', 'Camion Benne');
    cy.get('[data-testid="panne-item"]').should('have.length.at.least', 1);
  });

  it('devrait créer une nouvelle panne via le formulaire', () => {
    cy.visit('/caspanne');
    
    // Intercepter la requête POST
    cy.intercept('POST', '/caspanne', {
      statusCode: 201,
      body: {
        idCasPanne: Date.now(),
        nom: 'Nouveau Camion Test',
        marque: 'Test Marque',
        modele: 'Test Modèle',
        matricule: 'TEST' + Date.now(),
        typepanne: 'Test Panne'
      }
    }).as('createPanne');

    // Ouvrir le formulaire
    cy.get('[data-testid="nouvelle-panne-btn"]').click();
    
    // Remplir le formulaire
    cy.get('[data-testid="input-nom"]').type('Nouveau Camion Test');
    cy.get('[data-testid="input-marque"]').type('Test Marque');
    cy.get('[data-testid="input-modele"]').type('Test Modèle');
    cy.get('[data-testid="input-matricule"]').type('TEST' + Date.now());
    cy.get('[data-testid="input-typepanne"]').type('Test Panne');
    
    // Soumettre
    cy.get('[data-testid="submit-panne"]').click();

    // Vérifier la réponse
    cy.wait('@createPanne');
    cy.get('[data-testid="notification-success"]').should('be.visible');
  });
});