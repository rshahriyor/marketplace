const {getItems, getItemsByCategories, getItemsForMainPage, getItem, addItem} = require('../controllers/items');

const itemSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category_id: { type: 'number' },
        category_name: { type: 'string' }
    }
};

const getItemsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: itemSchema
            }
        }
    },
    handler: getItems
};

const getItemsByCategoriesOpts = {
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
                items: itemSchema
            }
        }
    },
    handler: getItemsByCategories
};

const getItemsForMainPageOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        category_id: { type: 'number' },
                        category_name: { type: 'string' },
                        items: {
                            type: 'array',
                            items: itemSchema
                        }
                    }
                }
            }
        }
    },
    handler: getItemsForMainPage
}

const getItemOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id']
        },
        response: {
            200: itemSchema
        }
    },
    handler: getItem
};

const postItemOpts = {
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
            201: itemSchema
        }
    },
    handler: addItem
};

function itemRoutes(fastify, options, done) {
    fastify.get('/items', getItemsOpts);
    fastify.get('/items_by_category', getItemsByCategoriesOpts);
    fastify.get('/items_for_main_page', getItemsForMainPageOpts);
    fastify.get('/items/:id', getItemOpts);
    fastify.post('/items', postItemOpts)
    done();
};

module.exports = itemRoutes;