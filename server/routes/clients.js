const express = require("express");
const sql = require("mssql");
const config = require("../config");

const router = express.Router();

router.get("/clients", async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool.request().query(`
      -- Merged query for V_CLIENTE and J_CLIENTE with non-zero invoice counts, ordered by latest invoice date (excluding future dates)
      SELECT 
          'V' as system,
          'CLI_' + v.CODIGO_CLI as client_code,
          v.NOMBRE_CLI as client_name,
          v.DIRECCION_CLI as client_address,
          v.TELEFONO1_CLI as client_phone,
          v.EMAIL_CLI as client_email,
          COUNT(vf.CODIGO_CFA) as invoice_count,
          MAX(vf.FECHA_FACTU_CFA) as last_invoice_date
      FROM 
          V_CLIENTE v
      INNER JOIN 
          V_CABECE_FACTUR vf ON v.CODIGO_CLI = vf.CODIGO_CLI
      WHERE
          vf.FECHA_FACTU_CFA <= GETDATE()  -- Filter out future dates
      GROUP BY 
          v.CODIGO_CLI, v.NOMBRE_CLI, v.DIRECCION_CLI, v.TELEFONO1_CLI, v.EMAIL_CLI
      HAVING 
          COUNT(vf.CODIGO_CFA) > 0

      UNION ALL

      SELECT 
          'J' as system,
          'CLE_' + j.CODIGO_CLE as client_code,
          j.NOMBRE_CLE as client_name,
          j.DIRECCION_CLE as client_address,
          j.TELEFONO1_CLE as client_phone,
          j.EMAIL_CLE as client_email,
          COUNT(jf.CODIGO_CFC) as invoice_count,
          MAX(jf.FECHA_ELABO_CFC) as last_invoice_date
      FROM 
          J_CLIENTE j
      INNER JOIN 
          J_CABECE_FACTUR jf ON j.CODIGO_CLE = jf.CODIGO_CLE
      WHERE
          jf.FECHA_ELABO_CFC <= GETDATE()  -- Filter out future dates
      GROUP BY 
          j.CODIGO_CLE, j.NOMBRE_CLE, j.DIRECCION_CLE, j.TELEFONO1_CLE, j.EMAIL_CLE
      HAVING 
          COUNT(jf.CODIGO_CFC) > 0

      ORDER BY 
          last_invoice_date DESC, invoice_count DESC;
    `);

    console.log("Client data fetched successfully!");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching client data:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching client data" });
  } finally {
    if (pool) {
      try {
        await pool.close();
        console.log("SQL connection closed.");
      } catch (err) {
        console.error("Error closing SQL connection:", err);
      }
    }
  }
});

module.exports = router;
