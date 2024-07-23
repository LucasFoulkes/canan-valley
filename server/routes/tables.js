const express = require("express");
const sql = require("mssql");
const config = require("../config");

const router = express.Router();

router.get("/tables", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
    `;
    console.log("Tables fetched successfully!");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching table names" });
  } finally {
    await sql.close();
  }
});

module.exports = router;
