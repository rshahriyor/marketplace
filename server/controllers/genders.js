const db = require('../data/db');

const getGenders = (req, reply) => {
    const genders = db.prepare(
        'SELECT * FROM genders'
    ).all();
    reply.send(genders);
};


const getGender = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM genders WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
};


const addGender = (req, reply) => {
    const { name } = req.body;

    const result = db
        .prepare('INSERT INTO genders (name) VALUES (?)')
        .run(name);
    
    reply.code(201).send({
        id: result.lastInsertRowid,
        name
    });
};

module.exports = {getGenders, getGender, addGender};