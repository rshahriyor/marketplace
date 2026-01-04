const {getTags, getTag, getTagsByCategory, addTag} = require('../controllers/tags');

const tagSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        category_id: { type: 'number' }
    }
};

const getTagsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: tagSchema
            }
        }
    },
    handler: getTags
};

const getTagOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: tagSchema
        }
    },
    handler: getTag
};

const getTagsByCategoryOpts = {
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
                items: tagSchema
            }
        }
    },
    handler: getTagsByCategory
}

const postTagOpts = {
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
            201: tagSchema
        }
    },
    handler: addTag
};

function itemRoutes(fastify, options, done) {
    fastify.get('/tags', getTagsOpts);
    fastify.get('/tags/:id', getTagOpts);
    fastify.get('/tags/by_category', getTagsByCategoryOpts);
    fastify.post('/tags', postTagOpts)
    done();
};

module.exports = itemRoutes;