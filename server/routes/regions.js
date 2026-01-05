const {getRegions, getRegion, addRegion} = require('../controllers/regions');

const regionSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

const getRegionsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: regionSchema
            }
        }
    },
    handler: getRegions
};

const getRegionOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: regionSchema
        }
    },
    handler: getRegion
};

const postRegionOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        },
        response: {
            201: regionSchema
        }
    },
    handler: addRegion
};

function itemRoutes(fastify, options, done) {
    fastify.get('/regions', getRegionsOpts);
    fastify.get('/regions/:id', getRegionOpts);
    fastify.post('/regions', postRegionOpts)
    done();
};

module.exports = itemRoutes;