import './commands';
import 'cypress-real-events/support';
import 'cypress-localstorage-commands';

Cypress.config('baseUrl', Cypress.env('baseUrl'));
