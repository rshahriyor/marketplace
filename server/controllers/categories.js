const db = require('../data/db');

const getCategories = (req, reply) => {
    const categories = db.prepare(
        'SELECT * FROM categories'
    ).all();
    reply.send(categories);
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
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
};

/**
 * POST /categories
 */
const addCategory = (req, reply) => {
    const { name, icon } = req.body;

    const result = db
        .prepare('INSERT INTO categories (name, icon) VALUES (?, ?)')
        .run(name, icon);
    
    reply.code(201).send({
        id: result.lastInsertRowid,
        name,
        icon
    });
};

module.exports = {getCategories, getCategory, addCategory};