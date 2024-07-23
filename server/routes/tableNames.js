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

router.get("/client-details", async (req, res) => {
  try {
    await sql.connect(config);
    console.log("Connected to database");
    const result = await sql.query`
      SELECT 
        j.CODIGO_CLE AS ClientCode,
        j.NOMBRE_CLE AS ClientName,
        j.RUC_CLE AS TaxID,
        j.DIRECCION_CLE AS Address,
        j.TELEFONO1_CLE AS PrimaryPhone,
        j.TELEFONO2_CLE AS SecondaryPhone,
        j.EMAIL_CLE AS Email,
        j.FECHA_INGRE_CLE AS RegistrationDate,
        j.REPRESENTAN_CLE AS Representative,
        j.WEB_CLE AS Website,
        v.prioridad_cli AS Priority,
        v.farm_code_cli AS FarmCode,
        v.porce_comis_cli AS CommissionPercentage,
        COALESCE(v.modo_precio_cli, j.adicional_cle) AS PricingMode,
        vd.valor_dcl AS AdditionalDetail
      FROM 
        J_CLIENTE j
      LEFT JOIN V_CLIENTE v ON j.CODIGO_CLE = v.CODIGO_CLI
      LEFT JOIN V_DETALL_CLIENT vd ON j.CODIGO_CLE = vd.codigo_cli
      ORDER BY 
        j.NOMBRE_CLE
    `;
    console.log("Query result:", result);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).json({
      error: "An error occurred while fetching client details",
      details: err.message,
    });
  } finally {
    await sql.close();
  }
});

module.exports = router;
