-- Query for V_CLIENTE with non-zero invoice counts and last invoice date
SELECT 
    v.CODIGO_CLI,
    v.NOMBRE_CLI,
    v.DIRECCION_CLI,
    v.TELEFONO1_CLI,
    v.EMAIL_CLI,
    COUNT(vf.CODIGO_CFA) as invoice_count,
    MAX(vf.FECHA_FACTU_CFA) as last_invoice_date
FROM 
    V_CLIENTE v
INNER JOIN 
    V_CABECE_FACTUR vf ON v.CODIGO_CLI = vf.CODIGO_CLI
GROUP BY 
    v.CODIGO_CLI, v.NOMBRE_CLI, v.DIRECCION_CLI, v.TELEFONO1_CLI, v.EMAIL_CLI
HAVING 
    COUNT(vf.CODIGO_CFA) > 0
ORDER BY 
    invoice_count DESC, last_invoice_date DESC;

-- Query for J_CLIENTE with non-zero invoice counts and last invoice date
SELECT 
    j.CODIGO_CLE,
    j.NOMBRE_CLE,
    j.DIRECCION_CLE,
    j.TELEFONO1_CLE,
    j.EMAIL_CLE,
    COUNT(jf.CODIGO_CFC) as invoice_count,
    MAX(jf.FECHA_ELABO_CFC) as last_invoice_date
FROM 
    J_CLIENTE j
INNER JOIN 
    J_CABECE_FACTUR jf ON j.CODIGO_CLE = jf.CODIGO_CLE
GROUP BY 
    j.CODIGO_CLE, j.NOMBRE_CLE, j.DIRECCION_CLE, j.TELEFONO1_CLE, j.EMAIL_CLE
HAVING 
    COUNT(jf.CODIGO_CFC) > 0
ORDER BY 
    invoice_count DESC, last_invoice_date DESC;