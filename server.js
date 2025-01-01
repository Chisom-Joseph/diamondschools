require("dotenv").config();

const express = require("express");
const app = express();
const routes = require("./routes");
const flash = require("connect-flash");
const session = require("express-session");
const logger = require("./utils/logger");
const PORT = process.env.PORT || 4728;
const db = require("./models");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.set("view engine", "ejs"); // Set view engine to ejs
app.use(express.static("public")); // Export Public accests
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
  .sync({ force: false, alter: false, benchmark: true })
  .then(({ options, config }) => {
    logger.info(`Database connection sucessfull!`);
    console.table({
      dialect: options.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
      database_protocol: config.protocol,
      database_port: config.port,
    });
    app.listen(PORT, () => {
      logger.info(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => logger.error("Database connection failed!", error));
