const express = require("express");
const sql = require("mssql");
const path = require("path");
const clientsRouter = require("./routes/clients");
const tablesRouter = require("./routes/tables");
const config = require("./config");

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Use routers
app.use("/api", clientsRouter);
app.use("/api", tablesRouter);

app.get("/api/connection-test", async (req, res) => {
  try {
    await sql.connect(config);
    console.log("Connected to the database successfully!");
    res.send("Connected to the database successfully!");
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).send("Failed to connect to the database");
  } finally {
    await sql.close();
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
