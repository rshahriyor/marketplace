const db = require('../data/db');
const { sendResponse } = require('../utils/response');

const BASE_COMPANY_QUERY = `
    SELECT
        c.id AS company_id,
        c.name AS company_name,
        c.desc AS company_desc,
        c.latitude AS company_latitude,
        c.longitude AS company_longitude,
        c.phone_number AS company_phone_number,
        c.address AS company_address,
        c.created_by_user_id AS company_created_by_user_id,
        c.category_id,
        cat.name AS category_name,
        t.id AS tag_id,
        t.name AS tag_name,
        r.id as region_id,
        r.name as region_name,
        ci.id as city_id,
        ci.name as city_name,
        s.day_of_week AS schedule_day_of_week,
        s.start_at AS schedule_start_at,
        s.end_at AS schedule_end_at,
        s.lunch_start_at AS schedule_lunch_start_at,
        s.lunch_end_at AS schedule_lunch_end_at
    FROM companies c
    JOIN categories cat ON cat.id = c.category_id
    LEFT JOIN company_tags ct ON ct.company_id = c.id
    LEFT JOIN tags t ON t.id = ct.tag_id
    LEFT JOIN regions r ON r.id = c.region_id
    LEFT JOIN cities ci ON ci.id = c.city_id
    LEFT JOIN schedules s ON s.company_id = c.id
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
                schedules: [],
                region_id: row.region_id,
                region_name: row.region_name,
                city_id: row.city_id,
                city_name: row.city_name,
                desc: row.company_desc,
                phone_number: row.company_phone_number,
                latitude: row.company_latitude,
                longitude: row.company_longitude,
                address: row.company_address
            });
        }

        const company = map.get(row.company_id);

        if (row.tag_id && !company.tags.some(tag => tag.tag_id === row.tag_id)) {
            company.tags.push({
                tag_id: row.tag_id,
                tag_name: row.tag_name
            });
        }

        if (row.schedule_day_of_week !== null) {
            const scheduleExists = company.schedules.some(sch =>
                sch.day_of_week === row.schedule_day_of_week &&
                sch.start_at === row.schedule_start_at &&
                sch.end_at === row.schedule_end_at &&
                sch.lunch_start_at === row.schedule_lunch_start_at &&
                sch.lunch_end_at === row.schedule_lunch_end_at
            );
            if (!scheduleExists) {
                company.schedules.push({
                    day_of_week: row.schedule_day_of_week,
                    start_at: row.schedule_start_at,
                    end_at: row.schedule_end_at,
                    lunch_start_at: row.schedule_lunch_start_at,
                    lunch_end_at: row.schedule_lunch_end_at
                });
            }
        }
    }

    return [...map.values()];
};


const getCompanies = (req, reply) => {
    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        ORDER BY c.id
    `).all();

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
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
    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const getCompaniesForMainPage = (req, reply) => {
    const rows = db.prepare(BASE_COMPANY_QUERY).all();
    const companies = mapCompanies(rows);

    const day = new Date().getDay();
    const currentDayOfWeek = day === 0 ? 7 : day;

    const grouped = {};

    for (const item of companies) {
        if (!grouped[item.category_id]) {
            grouped[item.category_id] = {
                category_id: item.category_id,
                category_name: item.category_name,
                companies: []
            };
        }

        const filteredSchedules = item.schedules.filter(sch => sch.day_of_week === currentDayOfWeek);
        const companyWithFilteredSchedules = { ...item, schedules: filteredSchedules };

        grouped[item.category_id].companies.push(companyWithFilteredSchedules);
    }

    return sendResponse(reply, 200, 0, 'OK', Object.values(grouped));
};


const getCompany = (req, reply) => {
    const { id } = req.params;

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(id);

    if (!rows.length) {
        return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Company not found');
    }

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows)[0]);
};


const getOwnCompanies = (req, reply) => {
    const userId = req.user.userId;

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.created_by_user_id = ?
    `).all(userId);

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const addCompany = (req, reply) => {
    const { name, category_id, tag_id, region_id, city_id, desc, phone_number, longitude, latitude, address, schedules } = req.body;
    const userId = req.user.userId;

    const transaction = db.transaction(() => {
        const result = db
            .prepare('INSERT INTO companies (name, category_id, region_id, city_id, desc, phone_number, longitude, latitude, address, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(name, category_id, region_id, city_id, desc, phone_number, longitude, latitude, address, userId);

        const companyId = result.lastInsertRowid;

        const stmtTag = db.prepare(
            'INSERT OR IGNORE INTO company_tags (company_id, tag_id) VALUES (?, ?)'
        );

        for (const tag of tag_id) {
            stmtTag.run(companyId, tag);
        }

        if (Array.isArray(schedules)) {
            const stmtSchedule = db.prepare(
                'INSERT INTO schedules (company_id, day_of_week, start_at, end_at, lunch_start_at, lunch_end_at) VALUES (?, ?, ?, ?, ?, ?)'
            );

            for (const sch of schedules) {
                stmtSchedule.run(
                    companyId,
                    sch.day_of_week,
                    sch.start_at,
                    sch.end_at,
                    sch.lunch_start_at,
                    sch.lunch_end_at
                );
            }
        }

        return companyId;
    });

    const companyId = transaction();

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(companyId);

    return sendResponse(reply, 201, 0, 'CREATED', mapCompanies(rows)[0]);
};


module.exports = {
    getCompanies,
    getCompaniesByFilter,
    getCompaniesForMainPage,
    getCompany,
    getOwnCompanies,
    addCompany
};