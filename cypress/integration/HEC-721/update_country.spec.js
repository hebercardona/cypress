const countryName = 'New country';
const updatedCountryName = 'Updated country';
describe('Update country', () => {
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

    it('should create country for testing', () => {
        cy.getCy('add-new-item').click();
        cy.getCy('country-name-input').type(countryName);
        cy.get('.react-tag-input__input').type('Restriction{enter}');
        cy.get('.react-tag-input__input').type('Restriction2{enter}');
        cy.getCy('btn-submit').click();
        cy.wait(2000);
    });

    it('C919 should open update popup when click on edit button', () => {
        cy.get('tr')
            .contains(countryName)
            .realHover()
            .siblings('.action-column')
            .children('.fa-edit')
            .click();

        cy.contains('Edit Export Country');

        cy.getCy('country-name-input').should(
            'have.value',
            countryName
        );
        cy.get('.react-tag-input__tag').should('have.length', 2);
        
        cy.log('Update country name');
        cy.getCy('country-name-input')
            .clear()
            .type(updatedCountryName);

        cy.getCy('btn-submit').click();
        cy.get('.MuiDialog-root').should('not.exist');
        cy.wait(2000);
        cy.contains(countryName).should('not.exist');
        cy.get('tr').contains(updatedCountryName);
    });

    it('should remove created item after testing', () => {
        cy.get('tr')
            .contains(updatedCountryName)
            .realHover()
            .siblings('.action-column')
            .children('.fa-trash-alt')
            .click();

        cy.getCy('btn-submit').click();
    });
});
