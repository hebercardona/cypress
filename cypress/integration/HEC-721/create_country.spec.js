const countryName = 'Unique country';
const restrictionInput = '.react-tag-input__input';
import countryNames from '../../fixtures/admin/exportcountries/countryNames.json';

describe('Create new country', () => {
    before(() => {
        cy.login();
        cy.saveLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visit('/admin/export-countries');
        cy.wait(2000);
    });

    it('C914 should create country successfully', () => {
        cy.getCy('add-new-item').click();
        cy.contains('Add Export Country');
        cy.getCy('country-name-input')
            .type(countryName)
            .should('have.value', countryName);
        cy.get('.react-tag-input__input').type('Restriction{enter}');
        cy.get('.react-tag-input__tag').should('have.length', 1);
        cy.getCy('btn-submit').click();
        cy.wait(1000);
    });

    it('should display new country in the list', () => {
        cy.get('tr')
            .contains(countryName)
            .next()
            .children('[data-cy="custom-tag"]')
            .should('have.length', 1);
    });

    it('should remove created item after testing', () => {
        cy.get('tr')
            .contains(countryName)
            .realHover()
            .siblings('.action-column')
            .children('.fa-trash-alt')
            .click();

        cy.getCy('btn-submit').click();
    });

    it('C916 should validate country name ', () => {
        cy.getCy('add-new-item').click();
        cy.getCy('btn-submit').click();
        cy.contains('Country name is a required field');

        countryNames.forEach((item) => {
            cy.getCy('country-name-input')
                .clear()
                .type(item.value)
                .should('have.value', item.value);
            cy.getCy('btn-submit').click();
            cy.contains(item.message);
        });
    });

    it('C917 should validate restriction field', () => {
        cy.getCy('add-new-item').click();
        cy.get(restrictionInput).type('This is very long restriction{enter}');
        cy.contains('Maximum is 12 characters');

        cy.get(restrictionInput).clear().type('restriction{enter}');
        cy.get(restrictionInput).type('restriction2{enter}');
        cy.get(restrictionInput).type('restriction{enter}');
        cy.contains('Restrictions has to be unique');
        cy.get(restrictionInput).clear().type('restriction3{enter}');
        cy.get(restrictionInput).type('restriction4{enter}');
        cy.get(restrictionInput).type('restriction5{enter}');
        cy.get(restrictionInput).type('restriction6{enter}');
        cy.get(restrictionInput).type('restriction7{enter}');
        cy.get(restrictionInput).type('restriction8{enter}');
        cy.get(restrictionInput).should('not.exist');
        cy.getCy('limit-tag-msg').should('be.visible');

        cy.log('removed restriction tag');
        cy.get('.react-tag-input__tag__remove').first().click();
        cy.get('.react-tag-input__tag').should('have.length', 7);
        cy.get(restrictionInput).should('be.visible');
        cy.getCy('limit-tag-msg').should('not.exist');
    });

});
