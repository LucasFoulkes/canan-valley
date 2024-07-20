const express = require("express");
const sql = require("mssql");
const path = require("path");

const app = express();

const config = {
  server: "cananvalle.database.windows.net",
  database: "base_cananvalle",
  user: "Administrador",
  password: "Amn110**",
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

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

app.get("/api/tables", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
    `;
    console.log("Tables fetched successfully!");
    res.json(result.recordset.map((record) => record.TABLE_NAME));
  } catch (err) {
    console.error("Error fetching tables:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching table names" });
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
