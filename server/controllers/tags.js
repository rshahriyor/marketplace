const db = require('../data/db');

const getTags = (req, reply) => {
    const tags = db.prepare(
        'SELECT * FROM tags'
    ).all();
    reply.send(tags);
};

/**
 * GET /categories/:id
 */
const getTag = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM tags WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
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

    reply.send(tags);
}

/**
 * POST /categories
 */
const addTag = (req, reply) => {
    const { name, category_id } = req.body;

    const result = db
        .prepare('INSERT INTO tags (name, category_id) VALUES (?, ?)')
        .run(name, category_id);
    
    reply.code(201).send({
        id: result.lastInsertRowid,
        name,
        category_id
    });
};

module.exports = {getTags, getTag, getTagsByCategory, addTag};