const {getCategories, getCategory, addCategory} = require('../controllers/categories');

const categorySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

const getCategoriesOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: categorySchema
            }
        }
    },
    handler: getCategories
};

const getCategoryOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: categorySchema
        }
    },
    handler: getCategory
};

const postCategoryOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        },
        response: {
            201: categorySchema
        }
    },
    handler: addCategory
};

function itemRoutes(fastify, options, done) {
    fastify.get('/categories', getCategoriesOpts);
    fastify.get('/categories/:id', getCategoryOpts);
    fastify.post('/categories', postCategoryOpts)
    done();
};

module.exports = itemRoutes;