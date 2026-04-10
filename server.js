require("dotenv").config();

const express = require("express");
const app = express();
const routes = require("./routes");
const flash = require("connect-flash");
const session = require("express-session");
const logger = require("./utils/logger");
const compression = require("compression");
const PORT = process.env.PORT || 4728;
const db = require("./models");

// Enable gzip compression for all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6, // Compression level (1-9, 6 is a good balance
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.set("view engine", "ejs"); // Set view engine to ejs

// Serve static files with caching headers (1 year for immutable assets)
app.use(express.static("public", {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Force no caching for HTML files
    if (path.endsWith('.html') || path.endsWith('.ejs')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes); // Use Routes

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace (optional)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

logger.info("Waiting for database connection...");
db.sequelize
  .authenticate()
  .then(async () => {
    logger.info(`Database connection successful!`);
    return db.sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    const config = db.sequelize.config;
    console.table({
      dialect: config.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
    });
    app.listen(PORT, () => {
      logger.info(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => logger.error("Database connection failed!", error));
