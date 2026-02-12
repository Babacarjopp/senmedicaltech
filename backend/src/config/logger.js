const winston = require("winston");
const Sentry = require("@sentry/node");

// Initialize Sentry if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ request: true, serverName: false }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
  });
  console.log("✅ Sentry initialized");
}

const isDev = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || (isDev ? "debug" : "info");

// Format personnalisé
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Transporteurs
const transports = [
  // Console (dev friendly)
  new winston.transports.Console({
    format: isDev
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
            return `${timestamp} [${level}] ${message} ${metaStr}`;
          })
        )
      : customFormat,
  }),
  // Fichiers (production)
  ...(process.env.NODE_ENV === "production"
    ? [
        new winston.transports.File({
          filename: "./logs/error.log",
          level: "error",
          format: customFormat,
        }),
        new winston.transports.File({
          filename: "./logs/combined.log",
          format: customFormat,
        }),
      ]
    : []),
  // Sentry Transport (errors uniquement)
  ...(process.env.SENTRY_DSN
    ? [
        new winston.transports.Stream({
          stream: {
            write: (message) => {
              const log = JSON.parse(message);
              if (log.level === "error") {
                Sentry.captureException(new Error(log.message), {
                  contexts: { winston: log },
                });
              }
            },
          },
          level: "error",
          format: customFormat,
        }),
      ]
    : []),
];

const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: "./logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "./logs/rejections.log" }),
  ],
});

module.exports = logger;
