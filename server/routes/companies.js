const {getCompanies, getCompaniesByCategories, getCompaniesForMainPage, getCompany, addCompany} = require('../controllers/companies');

const companySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        category_id: { type: 'number' },
        category_name: { type: 'string' }
    }
};

const getCompaniesOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                companies: companySchema
            }
        }
    },
    handler: getCompanies
};

const getCompaniesByCategoriesOpts = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                category_id: { type: 'number' }
            }
        },
        response: {
            200: {
                type: 'array',
                companies: companySchema
            }
        }
    },
    handler: getCompaniesByCategories
};

const getCompaniesForMainPageOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        category_id: { type: 'number' },
                        category_name: { type: 'string' },
                        companies: {
                            type: 'array',
                            companies: companySchema
                        }
                    }
                }
            }
        }
    },
    handler: getCompaniesForMainPage
}

const getCompanyOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: companySchema
        }
    },
    handler: getCompany
};

const postCompanyOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category_id: { type: 'number' }
            },
            required: ['name', 'category_id']
        },
        response: {
            201: companySchema
        }
    },
    handler: addCompany
};

function itemRoutes(fastify, options, done) {
    fastify.get('/companies', getCompaniesOpts);
    fastify.get('/companies/by_category', getCompaniesByCategoriesOpts);
    fastify.get('/companies/for_main_page', getCompaniesForMainPageOpts);
    fastify.get('/companies/:id', getCompanyOpts);
    fastify.post('/companies', postCompanyOpts)
    done();
};

module.exports = itemRoutes;