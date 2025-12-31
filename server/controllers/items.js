const { v4: uuidv4 } = require('uuid');
let items = require('../data/items');
const categories = require('../data/categories');

const getItems = (req, reply) => {
    reply.send(items);
}

const getItemsByCategories = (req, reply) => {
    const { category_id } = req.query;
    const filteredItems = category_id ? items.filter(item => item.category_id === category_id) : items;
    reply.send(filteredItems);
}

const getItemsForMainPage = (req, reply) => {
    const groupedItems = categories.map(category => {
        const categoryItems = items.filter(item => item.category_id === category.id);
        return {
            category_id: category.id,
            category_name: category.name,
            items: categoryItems
        };
    });
    reply.send(groupedItems);
}

const getItem = (req, reply) => {
    const { id } = req.params;
    const item = items.find(i => i.id === id);
    if (item) {
        reply.send(item);
    } else {
        reply.status(404).send({ message: 'Item not found' });
    }
}

const addItem = (req, reply) => {
    const { name, category_id } = req.body;
    const categoryExists = categories.some(cat => cat.id === category_id);
    if (!categoryExists) {
        return reply.status(400).send({ message: 'Invalid category_id' });
    }

    const item = {
        id: uuidv4(),
        name,
        category_id
    };
    items = [...items, item];
    reply.code(201).send(item);
}

module.exports = { getItems, getItemsByCategories, getItemsForMainPage, getItem, addItem };