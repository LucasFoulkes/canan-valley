-- Search for client-related tables in SQL Server, excluding empty tables
SELECT 
    t.name AS TableName,
    s.name AS SchemaName,
    p.rows AS NumberOfRows
FROM 
    sys.tables t
INNER JOIN 
    sys.schemas s ON t.schema_id = s.schema_id
INNER JOIN 
    sys.indexes i ON t.object_id = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
WHERE 
    i.index_id <= 1
    AND (
        t.name LIKE '%CLIENT%'
        OR t.name LIKE '%CLIENTE%'
        OR t.name LIKE '%CUSTOM%'
    )
    AND p.rows > 0  -- This line excludes tables with no rows
ORDER BY 
    p.rows DESC,  -- Order by number of rows descending
    t.name;       -- Then by table name