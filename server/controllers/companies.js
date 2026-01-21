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
        c.is_active AS company_is_active,
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
        s.lunch_end_at AS schedule_lunch_end_at,
        s.is_working_day AS schedule_is_working_day,
        s.is_day_and_night AS schedule_is_day_and_night,
        s.without_breaks AS schedule_without_breaks,
        f.id AS file_id,
        f.file_name AS file_name,
        f.original_name AS file_original_name,
        f.mime_type AS file_mime_type,
        f.size AS file_size,
        f.created_at AS file_created_at,
        sm.id AS social_media_id,
        sm.name AS social_media_name,
        sma.account_url AS social_media_account_url,
        CASE WHEN fav.id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite,
        (
            SELECT COUNT(1)
            FROM favorites fav2
            WHERE fav2.company_id = c.id
        ) AS favorites_count
    FROM companies c
    JOIN categories cat ON cat.id = c.category_id
    LEFT JOIN company_tags ct ON ct.company_id = c.id
    LEFT JOIN tags t ON t.id = ct.tag_id
    LEFT JOIN regions r ON r.id = c.region_id
    LEFT JOIN cities ci ON ci.id = c.city_id
    LEFT JOIN schedules s ON s.company_id = c.id
    LEFT JOIN company_files cf ON cf.company_id = c.id
    LEFT JOIN files f ON f.id = cf.file_id
    LEFT JOIN social_media_accounts sma ON sma.company_id = c.id
    LEFT JOIN social_media sm ON sm.id = sma.social_media_id
    LEFT JOIN favorites fav ON fav.company_id = c.id AND fav.user_id = ?
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
                social_media: [],
                files: [],
                region_id: row.region_id,
                region_name: row.region_name,
                city_id: row.city_id,
                city_name: row.city_name,
                desc: row.company_desc,
                phone_number: row.company_phone_number,
                latitude: row.company_latitude,
                longitude: row.company_longitude,
                address: row.company_address,
                is_favorite: row.is_favorite,
                favorites_count: row.favorites_count,
                is_active: row.company_is_active
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
                sch.lunch_end_at === row.schedule_lunch_end_at &&
                sch.is_working_day === row.schedule_is_working_day &&
                sch.is_day_and_night === row.schedule_is_day_and_night &&
                sch.without_breaks === row.schedule_without_breaks
            );
            if (!scheduleExists) {
                company.schedules.push({
                    day_of_week: row.schedule_day_of_week,
                    start_at: row.schedule_start_at,
                    end_at: row.schedule_end_at,
                    lunch_start_at: row.schedule_lunch_start_at,
                    lunch_end_at: row.schedule_lunch_end_at,
                    is_working_day: row.schedule_is_working_day,
                    is_day_and_night: row.schedule_is_day_and_night,
                    without_breaks: row.schedule_without_breaks
                });
            }
        }

        if (row.social_media_id && !company.social_media.some(sm => sm.social_media_id === row.social_media_id)) {
            company.social_media.push({
                social_media_id: row.social_media_id,
                social_media_name: row.social_media_name,
                account_url: row.social_media_account_url
            });
        }

        if (row.file_id && !company.files.some(file => file.id === row.file_id)) {
            company.files.push({
                id: row.file_id,
                file_name: row.file_name,
                original_name: row.file_original_name,
                mime_type: row.file_mime_type,
                size: row.file_size,
                created_at: row.file_created_at
            });
        }
    }

    return [...map.values()];
};


const getCompanies = (req, reply) => {
    const userId = req.user?.userId ?? null;
    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        ORDER BY c.id
    `).all(userId);

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const getCompaniesByFilter = (req, reply) => {
    const { category_ids, tag_ids, region_ids, city_ids, is_favorite } = req.query;
    const userId = req.user?.userId ?? null;

    let sql = BASE_COMPANY_QUERY + ' WHERE 1=1 ';
    const params = [userId];

    if (category_ids) {
        const ids = category_ids.split(',').map(Number);
        sql += ` AND c.category_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    if (tag_ids) {
        const ids = tag_ids.split(',').map(Number);
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
        const ids = region_ids.split(',').map(Number);
        sql += ` AND c.region_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    if (city_ids) {
        const ids = city_ids.split(',').map(Number);
        sql += ` AND c.city_id IN (${ids.map(() => '?').join(',')})`;
        params.push(...ids);
    }

    if (is_favorite === 'true') {
        sql += ` AND EXISTS (SELECT 1 FROM favorites f2 WHERE f2.user_id = ? AND f2.company_id = c.id)`;
        params.push(userId);
    }

    sql += ' ORDER BY c.id';

    const rows = db.prepare(sql).all(...params);

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const searchCompanies = (req, reply) => {
    const { q } = req.query;
    const userId = req.user?.userId ?? null;

    if (!q || !q.trim()) {
        return sendResponse(reply, 200, 0, 'OK', []);
    }

    const search = `%${q.trim().toLocaleLowerCase('ru-RU')}%`;

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE
            c.search_name LIKE ?
        ORDER BY c.id
    `).all(userId, search);

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const getCompaniesForMainPage = (req, reply) => {
    const userId = req.user?.userId ?? null;
    const rows = db.prepare(BASE_COMPANY_QUERY).all(userId);
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
    const userId = req.user?.userId ?? null;

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(userId, id);

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
    `).all(userId, userId);

    return sendResponse(reply, 200, 0, 'OK', mapCompanies(rows));
};


const addCompany = (req, reply) => {
    const { name, category_id, tag_id, region_id, city_id, desc, phone_number, longitude, latitude, address, schedules, social_media, is_active, file_ids } = req.body;
    const userId = req.user.userId;

    const search_name = name.toLocaleLowerCase('ru-RU');

    const transaction = db.transaction(() => {
        const result = db
            .prepare('INSERT INTO companies (name, search_name, category_id, region_id, city_id, desc, phone_number, longitude, latitude, address, created_by_user_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(name, search_name, category_id, region_id, city_id, desc, phone_number, longitude, latitude, address, userId, is_active ? 1 : 0);

        const companyId = result.lastInsertRowid;

        const stmtTag = db.prepare(
            'INSERT OR IGNORE INTO company_tags (company_id, tag_id) VALUES (?, ?)'
        );

        for (const tag of tag_id) {
            stmtTag.run(companyId, tag);
        }

        if (Array.isArray(schedules)) {
            const stmtSchedule = db.prepare(
                'INSERT INTO schedules (company_id, day_of_week, start_at, end_at, lunch_start_at, lunch_end_at, is_working_day, is_day_and_night, without_breaks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );

            for (const sch of schedules) {
                stmtSchedule.run(
                    companyId,
                    sch.day_of_week,
                    sch.start_at,
                    sch.end_at,
                    sch.lunch_start_at ?? null,
                    sch.lunch_end_at ?? null,
                    sch.is_working_day ? 1 : 0,
                    sch.is_day_and_night ? 1 : 0,
                    sch.without_breaks ? 1 : 0
                );
            }
        }

        if (Array.isArray(social_media)) {
            const stmtSocial = db.prepare(
                `INSERT INTO social_media_accounts (company_id, social_media_id, account_url) VALUES (?, ?, ?)`
            );

            for (const sm of social_media) {
                stmtSocial.run(companyId, sm.social_media_id, sm.account_url);
            }
        }

        // Save company_files relations if file_ids provided
        if (Array.isArray(file_ids)) {
            const stmtFiles = db.prepare('INSERT INTO company_files (company_id, file_id) VALUES (?, ?)');
            for (const fileId of file_ids) {
                stmtFiles.run(companyId, fileId);
            }
        }

        return companyId;
    });

    const companyId = transaction();

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(userId, companyId);

    return sendResponse(reply, 201, 0, 'CREATED', mapCompanies(rows)[0]);
};

const updateCompany = (req, reply) => {
    const { id } = req.params;
    const { name, category_id, tag_id, region_id, city_id, desc, phone_number, longitude, latitude, address, schedules, social_media, is_active, file_ids } = req.body;
    const userId = req.user.userId;

    const companyCheck = db.prepare('SELECT created_by_user_id FROM companies WHERE id = ?').get(id);
    if (!companyCheck) {
        return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Company not found');
    }
    if (companyCheck.created_by_user_id !== userId) {
        return sendResponse(reply, 403, -3, 'FORBIDDEN', null, 'You do not have permission to update this company');
    }

    const search_name = name.toLocaleLowerCase('ru-RU');

    const transaction = db.transaction(() => {
        db.prepare(`
            UPDATE companies SET
                name = ?,
                search_name = ?,
                category_id = ?,
                region_id = ?,
                city_id = ?,
                desc = ?,
                phone_number = ?,
                longitude = ?,
                latitude = ?,
                address = ?,
                is_active = ?
            WHERE id = ?
        `).run(name, search_name, category_id, region_id, city_id, desc, phone_number, longitude, latitude, address, is_active ? 1 : 0, id);

        db.prepare('DELETE FROM company_tags WHERE company_id = ?').run(id);
        if (Array.isArray(tag_id)) {
            const stmtTag = db.prepare('INSERT OR IGNORE INTO company_tags (company_id, tag_id) VALUES (?, ?)');
            for (const tag of tag_id) {
                stmtTag.run(id, tag);
            }
        }

        db.prepare('DELETE FROM schedules WHERE company_id = ?').run(id);
        if (Array.isArray(schedules)) {
            const stmtSchedule = db.prepare(
                'INSERT INTO schedules (company_id, day_of_week, start_at, end_at, lunch_start_at, lunch_end_at, is_working_day, is_day_and_night, without_breaks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            for (const sch of schedules) {
                stmtSchedule.run(
                    id,
                    sch.day_of_week,
                    sch.start_at,
                    sch.end_at,
                    sch.lunch_start_at ?? null,
                    sch.lunch_end_at ?? null,
                    sch.is_working_day ? 1 : 0,
                    sch.is_day_and_night ? 1 : 0,
                    sch.without_breaks ? 1 : 0
                );
            }
        }

        db.prepare('DELETE FROM social_media_accounts WHERE company_id = ?').run(id);
        if (Array.isArray(social_media)) {
            const stmtSocial = db.prepare(
                'INSERT INTO social_media_accounts (company_id, social_media_id, account_url) VALUES (?, ?, ?)'
            );
            for (const sm of social_media) {
                stmtSocial.run(id, sm.social_media_id, sm.account_url);
            }
        }

        // Update company_files relations: remove old and insert new if file_ids provided
        db.prepare('DELETE FROM company_files WHERE company_id = ?').run(id);
        if (Array.isArray(file_ids)) {
            const stmtFiles = db.prepare('INSERT INTO company_files (company_id, file_id) VALUES (?, ?)');
            for (const fileId of file_ids) {
                stmtFiles.run(id, fileId);
            }
        }
    });

    transaction();

    const rows = db.prepare(`
        ${BASE_COMPANY_QUERY}
        WHERE c.id = ?
    `).all(userId, id);

    return sendResponse(reply, 200, 0, 'UPDATED', mapCompanies(rows)[0]);
};

const updateCompanyStatus = (req, reply) => {
    const { id } = req.params;
    const { is_active } = req.body;
    const userId = req.user.userId;

    if (typeof is_active !== 'boolean' && is_active !== 0 && is_active !== 1) {
        return sendResponse(reply, 400, -1, 'BAD_REQUEST', null, 'is_active must be boolean');
    }

    const companyCheck = db
        .prepare('SELECT created_by_user_id FROM companies WHERE id = ?')
        .get(id);

    if (!companyCheck) {
        return sendResponse(reply, 404, -2, 'NOT_FOUND', null, 'Company not found');
    }

    if (companyCheck.created_by_user_id !== userId) {
        return sendResponse(reply, 403, -3, 'FORBIDDEN', null, 'You do not have permission to update this company');
    }

    db.prepare(`
        UPDATE companies
        SET is_active = ?
        WHERE id = ?
    `).run(is_active ? 1 : 0, id);

    return sendResponse(reply, 200, 0, 'UPDATED_STATUS');
};

const toggleFavorite = (req, reply) => {
    const userId = req.user.userId;
    const companyId = req.params.id;

    const exists = db.prepare(`
      SELECT 1 FROM favorites
      WHERE user_id = ? AND company_id = ?
    `).get(userId, companyId);

    if (exists) {
        db.prepare(`
        DELETE FROM favorites
        WHERE user_id = ? AND company_id = ?
      `).run(userId, companyId);

        return sendResponse(reply, 200, 0, 'REMOVED_FROM_FAVORITES');
    }

    db.prepare(`
      INSERT INTO favorites (user_id, company_id)
      VALUES (?, ?)
    `).run(userId, companyId);

    return sendResponse(reply, 200, 0, 'ADDED_TO_FAVORITES');
};


module.exports = {
    getCompanies,
    getCompaniesByFilter,
    getCompaniesForMainPage,
    getCompany,
    getOwnCompanies,
    addCompany,
    updateCompany,
    updateCompanyStatus,
    toggleFavorite,
    searchCompanies
};