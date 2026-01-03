const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

/**
 * GET /companies
 */
const getCompanies = (req, reply) => {
    const companies = db.prepare(
        'SELECT * FROM companies'
    ).all();

    reply.send(companies);
};

/**
 * GET /companies?category_id=xxx
 */
const getCompaniesByCategories = (req, reply) => {
    const { category_id } = req.query;

    const companies = category_id
        ? db.prepare(
            'SELECT * FROM companies WHERE category_id = ?'
        ).all(category_id)
        : db.prepare(
            'SELECT * FROM companies'
        ).all();

    reply.send(companies);
};

/**
 * GET /companies/main
 */
const getCompaniesForMainPage = (req, reply) => {
    const categories = db.prepare(
        'SELECT * FROM categories'
    ).all();

    const companies = db.prepare(
        'SELECT * FROM companies'
    ).all();

    const groupedItems = categories.map(category => ({
        category_id: category.id,
        category_name: category.name,
        companies: companies.filter(
            item => item.category_id === category.id
        )
    }));

    reply.send(groupedItems);
};

/**
 * GET /companies/:id
 */
const getCompany = (req, reply) => {
    const { id } = req.params;

    const item = db.prepare(
        'SELECT * FROM companies WHERE id = ?'
    ).get(id);

    if (!item) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(item);
};

/**
 * POST /companies
 */
const addCompany = (req, reply) => {
    const { name, category_id } = req.body;

    // проверка категории
    const categoryExists = db.prepare(
        'SELECT 1 FROM categories WHERE id = ?'
    ).get(category_id);

    if (!categoryExists) {
        return reply.status(400).send({ message: 'Invalid category_id' });
    }

    const result = db.prepare(
        'INSERT INTO companies (name, category_id) VALUES (?, ?)'
    ).run(name, category_id);

    const item = {
        id: result.lastInsertRowid,
        name,
        category_id
    };

    reply.code(201).send(item);
};

module.exports = {
    getCompanies,
    getCompaniesByCategories,
    getCompaniesForMainPage,
    getCompany,
    addCompany
};