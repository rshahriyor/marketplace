const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const getTags = (req, reply) => {
    const tags = db.prepare(
        'SELECT * FROM tags'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', tags);
};

/**
 * GET /categories/:id
 */
const getTag = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM tags WHERE id = ?'
    ).get(id);

    if (!item) return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Tag not found');

    return sendResponse(reply, 200, 0, 'OK', item);
};

const getTagsByCategory = (req, reply) => {
    const { category_id } = req.query;

    const tags = category_id
        ? db.prepare(
            'SELECT * FROM tags WHERE category_id = ?'
        ).all(category_id)
        : db.prepare(
            'SELECT * FROM tags'
        ).all();

    return sendResponse(reply, 200, 0, 'OK', tags);
}

/**
 * POST /categories
 */
const addTag = (req, reply) => {
    const { name, category_id } = req.body;

    const result = db
        .prepare('INSERT INTO tags (name, category_id) VALUES (?, ?)')
        .run(name, category_id);

    return sendResponse(reply, 201, 0, 'CREATED', { id: result.lastInsertRowid, name, category_id });
};

module.exports = { getTags, getTag, getTagsByCategory, addTag };