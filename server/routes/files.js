const { uploadFile, getFiles, deleteFile } = require('../controllers/files');
const { responseSchema } = require('../utils/response');

const fileSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        file_name: { type: 'string' },
        original_name: { type: 'string' },
        mime_type: { type: 'string' },
        size: { type: 'number' },
        created_at: { type: 'string' }
    }
};

const getFilesOpts = {
    schema: {
        response: {
            200: responseSchema({
                type: 'array',
                items: fileSchema
            })
        }
    },
    handler: getFiles
};

const uploadFileOpts = {
    schema: {
        consumes: ['multipart/form-data'],
        response: {
            201: responseSchema(fileSchema)
        }
    },
    handler: uploadFile
};

const deleteFileOpts = {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'number' }
            },
            required: ['id']
        },
        response: {
            200: responseSchema({ type: 'object', properties: { id: { type: 'number' } } })
        }
    },
    handler: deleteFile
};


function fileRoutes(fastify, options, done) {
    fastify.get('/files', getFilesOpts);
    fastify.post('/files/upload', uploadFileOpts);
    fastify.delete('/files/:id', deleteFileOpts);
    done();
}

module.exports = fileRoutes;
