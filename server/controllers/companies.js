const db = require('../data/db');
const BASE_COMPANY_QUERY = `
    SELECT
        c.id AS company_id,
        c.name AS company_name,
        c.category_id,
        cat.name AS category_name,
        t.id AS tag_id,
        t.name AS tag_name,
        r.id as region_id,
        r.name as region_name,
        ci.id as city_id,
        ci.name as city_name
    FROM companies c
    JOIN categories cat ON cat.id = c.category_id
    LEFT JOIN company_tags ct ON ct.company_id = c.id
    LEFT JOIN tags t ON t.id = ct.tag_id
    LEFT JOIN regions r ON r.id = c.region_id
    LEFT JOIN cities ci ON ci.id = c.city_id
`;
const mapCompanies = (rows) => {
    const map = new Map();

    for (const row of rows) {
        if (!map.has(row.company_id)) {
            map.set(row.company_id, {
                id: row.company_id,
                name: row.company_name,
                category_id: row.category_id,
                category_name: row.category_name,
                tags: [],
                region_id: row.region_id,
                region_name: row.region_name,
                city_id: row.city_id,
                city_name: row.city_name
            });
        }

        if (row.tag_id) {
            map.get(row.company_id).tags.push({
                tag_id: row.tag_id,
                tag_name: row.tag_name
            });
        }
    }

    return [...map.values()];
};


const getCompanies = (req, reply) => {
    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        ORDER BY c.id
    `).all();

    reply.send(mapCompanies(rows));
};


const getCompaniesByFilter = (req, reply) => {
    const { category_ids, tag_ids, region_ids, city_ids } = req.query;

    let sql = BASE_COMPANY_QUERY + ' WHERE 1=1 ';
    const params = [];

    if (category_ids) {
        const ids = category_ids.split(',');
        sql += ` AND c.category_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    if (tag_ids) {
        const ids = tag_ids.split(',');

        sql += `
            AND EXISTS (
                SELECT 1
                FROM company_tags ct2
                WHERE ct2.company_id = c.id
                AND ct2.tag_id IN (${ids.map(() => '?').join(',')})
            )
        `;

        params.push(...ids);
    }

    if (region_ids) {
        const ids = region_ids.split(',');
        sql += ` AND c.region_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    if (city_ids) {
        const ids = city_ids.split(',');
        sql += ` AND c.city_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    const rows = db.prepare(sql).all(...params);
    reply.send(mapCompanies(rows));
};


const getCompaniesForMainPage = (req, reply) => {
    const rows = db.prepare(BASE_COMPANY_QUERY).all();
    const companies = mapCompanies(rows);

    const grouped = {};

    for (const item of companies) {
        if (!grouped[item.category_id]) {
            grouped[item.category_id] = {
                category_id: item.category_id,
                category_name: item.category_name,
                companies: []
            };
        }

        grouped[item.category_id].companies.push(item);
    }

    reply.send(Object.values(grouped));
};


const getCompany = (req, reply) => {
    const { id } = req.params;

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(id);

    if (!rows.length) {
        return reply.status(404).send({ message: 'Item not found' });
    }

    reply.send(mapCompanies(rows)[0]);
};


const addCompany = (req, reply) => {
    const { name, category_id, tag_id, region_id, city_id } = req.body;

    const transaction = db.transaction(() => {
        const result = db
            .prepare('INSERT INTO companies (name, category_id, region_id, city_id) VALUES (?, ?, ?, ?)')
            .run(name, category_id, region_id, city_id);

        const companyId = result.lastInsertRowid;

        const stmt = db.prepare(
            'INSERT OR IGNORE INTO company_tags (company_id, tag_id) VALUES (?, ?)'
        );

        for (const tag of tag_id) {
            stmt.run(companyId, tag);
        }

        return companyId;
    });

    const companyId = transaction();

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(companyId);

    reply.code(201).send(mapCompanies(rows)[0]);
};


module.exports = {
    getCompanies,
    getCompaniesByFilter,
    getCompaniesForMainPage,
    getCompany,
    addCompany
};