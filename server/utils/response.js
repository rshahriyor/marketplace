const sendResponse = (reply, statusCode, code, message, data = null, extraMessage) => {
    return reply.code(statusCode).send({
        status: {
            code,
            message
        },
        ...(extraMessage && { message: extraMessage }),
        data
    });
};

const responseSchema = (dataSchema) => ({
    type: 'object',
    properties: {
        status: {
            type: 'object',
            properties: {
                code: { type: 'number' },
                message: { type: 'string' }
            },
            required: ['code', 'message']
        },
        message: { type: 'string' },
        data: dataSchema
    },
    required: ['status', 'data']
});

module.exports = { sendResponse, responseSchema };