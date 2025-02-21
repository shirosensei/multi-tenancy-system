import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Minimum log level to display
  format: combine(
    colorize(), // Add colors to logs
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    logFormat // Apply custom log format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log to a file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;