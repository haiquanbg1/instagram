const successResponse = (res, status, message, data) => {
    return res.status(status).json({
        message,
        data
    });
}

const errorResponse = (res, status, message) => {
    return res.status(status).json({
        message
    })
}

module.exports = {
    successResponse,
    errorResponse
}