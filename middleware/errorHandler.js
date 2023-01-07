// process error and send back response
const { logger } = require('./errorLogger');

const errorHandler = (error, req, res, next) => {
  const errStatus = error.statusCode || 500;
  const errMsg = error.message || 'Server internal error';

  logger.error({
    code: errStatus,
    message: errMsg,
    date: new Date().toISOString().slice(0, 10),
  });

  res.status(errStatus).json({
    message: errMsg,
  });
};

module.exports = errorHandler;
