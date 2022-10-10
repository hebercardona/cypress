const { _ } = Cypress;

describe('Listing country', () => {
    before(() => {
        cy.login();
        cy.saveLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    it('C368 should show correct number of countries', () => {
        cy.intercept({
            pathname: '/api/metadata/export-countries',
        }).as('countryApi');
        cy.visit('/admin/export-countries');
        cy.wait('@countryApi').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            const numberCountry = interception.response.body.length;
            cy.get('tbody').find('tr').should('have.length', numberCountry);
            cy.getCy('header-table-total').should(
                'contain',
                numberCountry
            );
        });
    });

    it('C369 should show action icons when hover only', () => {
        cy.visit('/admin/export-countries');
        cy.wait(1000);
        cy.get('tbody').find('.icons').should('not.be.visible');
        cy.get('tbody')
            .find('tr')
            .first()
            .realHover()
            .within(() => {
                cy.get('.icons').should('be.visible');
            });
    });

    it('C370 should sort by country name ascending', () => {
        cy.visit('/admin/export-countries');
        // Get column values into string array
        const toStrings = (cells$) => _.map(cells$, 'textContent');
        cy.get('.country-column__name')
            .then(toStrings)
            .then((names) => {
                const sorted = _.sortBy(names, [name => name.toLowerCase()], ['asc']);
                expect(names).to.deep.equal(sorted);
            });
    });
});
