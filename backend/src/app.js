const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loan.routes');
const documentRoutes = require('./routes/document.routes');
const { sendError } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use('/auth', authRoutes);
app.use('/loans', loanRoutes);
app.use(documentRoutes);

app.use((req, res) => {
  sendError(res, 404, 'Route not found');
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Malformed JSON body');
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 400, 'File must be 5MB or smaller');
  }
  if (err.message === 'Only PDF, JPG, and PNG files are allowed') {
    return sendError(res, 400, err.message);
  }
  console.error(err);
  return sendError(res, 500, 'Internal server error');
});

module.exports = app;
