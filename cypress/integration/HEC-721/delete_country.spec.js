const countryName = 'Delete country test';

describe('Delete country', () => {

    it('should create country successfully', () => {
        cy.login();
        cy.wait(100);
        cy.visit('/admin/export-countries');
        cy.getCy('add-new-item').click();
        cy.contains('Add Export Country');
        cy.getCy('country-name-input')
            .type(countryName)
            .should('have.value', countryName);
        cy.get('.react-tag-input__input').type('Restriction{enter}');
        cy.get('.react-tag-input__tag').should('have.length', 1);
        cy.getCy('btn-submit').click();
        cy.wait(2000);
    });

    it('C918 should open confirm popup when click on trash button', () => {
        cy.get('tr')
            .contains(countryName)
            .realHover()
            .siblings('.action-column')
            .children('.fa-trash-alt')
            .click();

        cy.contains('Delete the export country?');

        cy.getCy('btn-submit').click();
        cy.wait(2000);
        cy.get('.MuiDialog-root').should('not.exist');
        cy.contains(countryName).should('not.exist');
    });

});
