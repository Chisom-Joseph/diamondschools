const winston = require("winston");
require("winston-daily-rotate-file");

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Define a custom format for console logs
const consoleLogFormat = combine(
  colorize(), // Add color to log levels
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Custom timestamp format
  printf(({ timestamp, level, message, stack }) => {
    return `[${level}]: ${stack || message}`;
  })
);

// Define a custom format for file logs
const fileLogFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Daily rotating file transport
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Create the logger
const logger = createLogger({
  level: "info",
  format: fileLogFormat, // Use file format for all transports by default
  transports: [
    new transports.Console({
      format: consoleLogFormat, // Apply console-specific format
    }),
    dailyRotateFileTransport,
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/exceptions.log" }), // Separate file for exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: "logs/rejections.log" }), // Separate file for unhandled rejections
  ],
});

// Handle uncaught exceptions and unhandled rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection: ", { error });
});

module.exports = logger;
