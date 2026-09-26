function sendSuccess(res, statusCode, message, data = null) {
  return res.status(statusCode).json({ success: true, message, data });
}

function sendError(res, statusCode, message, extras = {}) {
  return res.status(statusCode).json({ success: false, message, data: null, ...extras });
}

module.exports = { sendSuccess, sendError };
