const express = require("express");
const app = express();
const routes = require("./routes");

const PORT = process.env.PORT || 4728;

app.set("view engine", "ejs"); // Set view engine to ejs
app.use(express.static("public")); // Export Public accests
app.use(routes); // Use Routes

// Start Server
app.listen(PORT, () =>
  console.log(`Server Up and running on port http://localhost:${PORT}/`)
);
