Cypress.Commands.add('login', () => {
    const formData = new FormData();
    formData.append('Email', Cypress.env('adminAccount'));
    formData.append('Password', Cypress.env('adminPassword'));
    cy.log('admin', Cypress.env('adminAccount'));
    cy.log('pass', Cypress.env('adminPassword'));

    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/api/login`,
        body: formData,
    })
        .its('body')
        .then((res) => {
            var enc = new TextDecoder('utf-8');
            var arr = new Uint8Array(res);
            var data = JSON.parse(enc.decode(arr));
            cy.setLocalStorage('token', data.message.content);
        });
});

Cypress.Commands.add('getCy', (name) => {
    return cy.get(`[data-cy="${name}"]`);
});
