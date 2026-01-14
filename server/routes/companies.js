const { getCompanies, getCompaniesByFilter, getCompaniesForMainPage, getCompany, getOwnCompanies, addCompany, toggleFavorite } = require('../controllers/companies');
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
        address: { type: 'string' },
        schedules: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    day_of_week: { type: 'number' },
                    start_at: { type: 'string' },
                    end_at: { type: 'string' },
                    lunch_start_at: { type: 'string' },
                    lunch_end_at: { type: 'string' },
                    is_working_day: { type: 'boolean' },
                    is_day_and_night: { type: 'boolean' },
                    without_breaks: { type: 'boolean' }
                }
            }
        },
        social_media: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    social_media_id: { type: 'number' },
                    social_media_name: { type: 'string' },
                    account_url: { type: 'string' }
                }
            }
        },
        is_favorite: { type: 'boolean' },
        favorites_count: { type: 'number' }
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
                address: { type: 'string' },
                schedules: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            day_of_week: { type: 'number' },
                            start_at: { type: 'string' },
                            end_at: { type: 'string' },
                            lunch_start_at: { type: 'string' },
                            lunch_end_at: { type: 'string' },
                            is_working_day: { type: 'boolean' },
                            is_day_and_night: { type: 'boolean' },
                            without_breaks: { type: 'boolean' }
                        }
                    },
                    minItems: 1
                },
                social_media: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            social_media_id: { type: 'number' },
                            account_url: { type: 'string' }
                        }
                    }
                }
            },
            required: ['name', 'category_id', 'tag_id', 'region_id', 'city_id', 'desc', 'phone_number', 'latitude', 'longitude', 'address', 'schedules', 'social_media']
        },
        response: {
            201: responseSchema(companySchema)
        }
    },
    handler: addCompany
};

const postToggleFavoriteOpts = {
    schema: {
        security: [
            {
                BearerAuth: []
            }
        ],
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema({
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            })
        }
    },
    handler: toggleFavorite
}

function itemRoutes(fastify, options, done) {
    fastify.addHook('preValidation', async (req, reply) => {
        if (req.headers.authorization) {
            await fastify.authenticate(req, reply);
        }
    });
    fastify.get('/companies', getCompaniesOpts);
    fastify.get('/companies/by_filter', getCompaniesByFilterOpts);
    fastify.get('/companies/for_main_page', getCompaniesForMainPageOpts);
    fastify.get('/companies/:id', getCompanyOpts);
    fastify.get('/companies/own', getOwnCompaniesOpts);
    fastify.post('/companies', postCompanyOpts);
    fastify.post('/companies/toggle_favorite/:id', postToggleFavoriteOpts);
    done();
};

module.exports = itemRoutes;