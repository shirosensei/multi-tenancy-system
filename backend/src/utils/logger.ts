import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Log level (info, warn, error, etc.)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.json() // Log in JSON format
  ),
  transports: [
    // Write all logs to a file
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'), // Log file path
    }),
  ],
});

// If not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        
        winston.format.colorize(), // Add colors to console logs

        winston.format.simple() // Simple format for console
      ),
    })
  );
}

export default logger;