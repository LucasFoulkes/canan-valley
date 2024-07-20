const express = require("express");
const sql = require("mssql");
const router = express.Router();

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

router.get("/tables", async (req, res) => {
  try {
    await sql.connect(config);
    console.log("Connected to database");
    const result = await sql.query`
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
        `;
    console.log("Query result:", result);
    res.json(result.recordset.map((record) => record.TABLE_NAME));
  } catch (err) {
    console.error("Error details:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching table names",
        details: err.message,
      });
  } finally {
    await sql.close();
  }
});

module.exports = router;
