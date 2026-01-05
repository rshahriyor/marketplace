const db = require('../data/db');

const getRegions = (req, reply) => {
    const regions = db.prepare(
        'SELECT * FROM regions'
    ).all();
    reply.send(regions);
};


const getRegion = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM regions WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
};


const addRegion = (req, reply) => {
    const { name } = req.body;

    const result = db
        .prepare('INSERT INTO regions (name) VALUES (?)')
        .run(name);
    
    reply.code(201).send({
        id: result.lastInsertRowid,
        name
    });
};

module.exports = {getRegions, getRegion, addRegion};