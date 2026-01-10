const {getCities, getCity, getCitiesByRegion, addCity} = require('../controllers/cities');
const { responseSchema } = require('../utils/response');

const citySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        region_id: { type: 'number' }
    }
};

const getCitiesOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: citySchema
            })
        }
    },
    handler: getCities
};

const getCityOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema(citySchema)
        }
    },
    handler: getCity
};

const getCitiesByRegionOpts = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                region_id: { type: 'number' }
            }
        },
        response: {
            200: responseSchema({
                type: 'array',
                items: citySchema
            })
        }
    },
    handler: getCitiesByRegion
};

const postCityOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                region_id: { type: 'number' }
            },
            required: ['name', 'region_id']
        },
        response: {
            201: responseSchema(citySchema)
        }
    },
    handler: addCity
};

function itemRoutes(fastify, options, done) {
    fastify.get('/cities', getCitiesOpts);
    fastify.get('/cities/:id', getCityOpts);
    fastify.get('/cities/by_region', getCitiesByRegionOpts);
    fastify.post('/cities', postCityOpts)
    done();
};

module.exports = itemRoutes;