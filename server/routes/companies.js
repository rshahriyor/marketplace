const { getCompanies, getCompaniesByFilter, getCompaniesForMainPage, getCompany, getOwnCompanies, addCompany } = require('../controllers/companies');
const { responseSchema } = require('../utils/response');

const companySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        category_id: { type: 'number' },
        category_name: { type: 'string' },
        tags: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    tag_id: { type: 'number' },
                    tag_name: { type: 'string' }
                }
            }
        },
        region_id: { type: 'number' },
        region_name: { type: 'string' },
        city_id: { type: 'number' },
        city_name: { type: 'string' },
        desc: { type: 'string' },
        phone_number: { type: 'number' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        address: { type: 'string' }
    }
};

const getCompaniesOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: companySchema
            })
        }
    },
    handler: getCompanies
};

const getCompaniesByFilterOpts = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                category_ids: { type: 'string' },
                tag_ids: { type: 'string' },
                region_ids: { type: 'string' },
                city_ids: { type: 'string' }
            }
        },
        response: {
            200: responseSchema({
                type: 'array',
                items: companySchema
            })
        }
    },
    handler: getCompaniesByFilter
};

const getCompaniesForMainPageOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        category_id: { type: 'number' },
                        category_name: { type: 'string' },
                        companies: {
                            type: 'array',
                            items: companySchema
                        }
                    }
                }
            })
        }
    },
    handler: getCompaniesForMainPage
};

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
            200: responseSchema(companySchema)
        }
    },
    handler: getCompany
};

const getOwnCompaniesOpts = {
    schema: {
        security: [
            {
                BearerAuth: []
            }
        ],
        response: {
            200: responseSchema({
                type: 'array',
                items: companySchema
            })
        }
    },
    handler: getOwnCompanies
};

const postCompanyOpts = {
    schema: {
        security: [
            {
                BearerAuth: []
            }
        ],
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category_id: { type: 'number' },
                tag_id: {
                    type: 'array',
                    items: { type: 'number' },
                    minItems: 1
                },
                region_id: { type: 'number' },
                city_id: { type: 'number' },
                desc: { type: 'string' },
                phone_number: { type: 'number' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                address: { type: 'string' }
            },
            required: ['name', 'category_id', 'tag_id', 'region_id', 'city_id', 'desc', 'phone_number', 'latitude', 'longitude', 'address']
        },
        response: {
            201: responseSchema(companySchema)
        }
    },
    handler: addCompany
};

function itemRoutes(fastify, options, done) {
    fastify.get('/companies', getCompaniesOpts);
    fastify.get('/companies/by_filter', getCompaniesByFilterOpts);
    fastify.get('/companies/for_main_page', getCompaniesForMainPageOpts);
    fastify.get('/companies/:id', getCompanyOpts);
    fastify.get('/companies/own', {
        ...getOwnCompaniesOpts,
        preValidation: [fastify.authenticate]
    });
    fastify.post('/companies', {
        ...postCompanyOpts,
        preValidation: [fastify.authenticate]
    });
    done();
};

module.exports = itemRoutes;