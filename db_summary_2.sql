SELECT
    t.[name] AS TableName,
    p.[rows] AS [RowCount]
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0, 1)
WHERE t.is_ms_shipped = 0 AND p.[rows] > 0
ORDER BY p.[rows] DESC, t.[name];

