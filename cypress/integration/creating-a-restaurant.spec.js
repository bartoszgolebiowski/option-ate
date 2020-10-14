const { cyan } = require('@material-ui/core/colors');

describe('Creating a restaurant', () => {
  it('allows adding restaurant', () => {
    const restaurantId = 42;
    const restaurantName = 'Sushi Place';

    cy.server({ force404: true });
    cy.route({
      method: 'GET',
      url:
        'https://outside-in-dev-api.herokuapp.com/PYvMLubwB3pYSXmH8hPNaikkadeEtUTN/restaurants',
      response: [],
    });
    cy.route({
      method: 'POST',
      url:
        'https://outside-in-dev-api.herokuapp.com/PYvMLubwB3pYSXmH8hPNaikkadeEtUTN/restaurants',
      response: {
        id: restaurantId,
        name: restaurantName,
      },
    }).as('addRestaurant');

    cy.visit('/');
    cy.get('[placeholder="Add Restaurant"]').type(restaurantName);
    cy.contains('Add').click();

    cy.wait('@addRestaurant').its('requestBody').should('deep.equal', {
      name: restaurantName,
    });

    cy.contains(restaurantName);
  });
});
