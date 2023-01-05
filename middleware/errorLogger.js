const winston = require('winston');

const logConfiguration = {
  transports: [
    new winston.transports.File({
      // Create the log directory if it does not exist
      filename: 'log/error.log',
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

module.exports = { logger };
