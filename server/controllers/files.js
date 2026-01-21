

const db = require('../data/db');
const { sendResponse } = require('../utils/response');
const path = require('path');
const fs = require('fs');

const getFiles = (req, reply) => {
    const files = db.prepare(
        'SELECT * FROM files'
    ).all();
    return sendResponse(reply, 200, 0, 'OK', files);
}

const deleteFile = (req, reply) => {
    const { id } = req.params;
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(id);

    if (!file) {
        return sendResponse(reply, 404, -1, 'NOT_FOUND', null, 'File not found');
    }

    // Удаляем файл с диска
    const filePath = path.join(__dirname, '..', 'uploads', file.file_name);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Удаляем запись из таблицы
    db.prepare('DELETE FROM files WHERE id = ?').run(id);

    return sendResponse(reply, 200, 0, 'DELETED', { id });
};

/**
 * POST /files/upload
 * file: photo
 */
const uploadFile = async (req, reply) => {
    const data = await req.file();

    if (!data) {
        return sendResponse(reply, 400, -1, 'BAD_REQUEST', null, 'Photo is required');
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(data.filename);
    const fileName = `file_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = await data.toBuffer();
    await fs.promises.writeFile(filePath, buffer);

    // Сохраняем запись в таблицу files
    const result = db.prepare(
        'INSERT INTO files (file_name, original_name, mime_type, size) VALUES (?, ?, ?, ?)'
    ).run(fileName, data.filename, data.mimetype || null, buffer.length);


    return sendResponse(reply, 201, 0, 'CREATED', {
        id: result.lastInsertRowid,
        file_name: fileName,
        original_name: data.filename,
        mime_type: data.mimetype || null,
        size: buffer.length
    });
};

module.exports = {
    getFiles,
    uploadFile,
    deleteFile
};