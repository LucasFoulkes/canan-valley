const sql = require("mssql");
const config = require("./dbConfig");

async function testConnection() {
  try {
    await sql.connect(config);
    console.log("Successfully connected to the database.");

    const result = await sql.query`SELECT 1 as testColumn`;
    console.log("Test query result:", result.recordset[0].testColumn);

    await sql.close();
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
}

module.exports = { testConnection };

if (require.main === module) {
  testConnection().then((success) => {
    if (success) {
      console.log("Database connection test completed successfully.");
    } else {
      console.log("Database connection test failed.");
    }
    process.exit(0);
  });
}
