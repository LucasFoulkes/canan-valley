const express = require("express");
const sql = require("mssql");
const config = require("../config");

const router = express.Router();

router.get("/clients", async (req, res) => {
  try {
    await sql.connect(config);
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
        j.REPRESENTAN_CLE AS Representative
      FROM 
        J_CLIENTE j
      LEFT JOIN V_CLIENTE v ON j.CODIGO_CLE = v.CODIGO_CLI
      LEFT JOIN V_DETALL_CLIENT vd ON j.CODIGO_CLE = vd.codigo_cli
      ORDER BY 
        j.NOMBRE_CLE
    `;
    console.log("Client data fetched successfully!");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching client data:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching client data" });
  } finally {
    await sql.close();
  }
});

module.exports = router;
