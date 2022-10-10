require('dotenv').config({ path: __dirname + '/./../../cypress.env' });

module.exports = (on, config) => {
    config.env.apiUrl = process.env.API_URL;
    config.env.baseUrl = process.env.BASE_URL;
    config.env.adminAccount = process.env.ADMIN;
    config.env.adminPassword = process.env.PASSWORD;
    config.reporterOptions = {
        host: process.env.TEST_RAIL_HOST,
        username: process.env.TEST_RAIL_USER_NAME,
        password: process.env.TEST_RAIL_PASSWORD,
        projectId: process.env.TEST_RAIL_PROJECT_ID,
        suiteId: process.env.TEST_RAIL_SUITE_ID,
        includeAllInTestRun: false,
    };

    return config;
};
