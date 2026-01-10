const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getCategories = (req, reply) => {
    const categories = db.prepare(
        'SELECT * FROM categories'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', categories);
};

/**
 * GET /categories/:id
 */
const getCategory = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM categories WHERE id = ?'
    ).get(id);

    if (!item) {
        return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Category not found');
    }

    return sendResponse(reply, 200, 0, 'OK', item);
};

/**
 * POST /categories
 */
const addCategory = (req, reply) => {
    const { name, icon } = req.body;

    const result = db
        .prepare('INSERT INTO categories (name, icon) VALUES (?, ?)')
        .run(name, icon);

    return sendResponse(reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name, icon });
};

module.exports = { getCategories, getCategory, addCategory };