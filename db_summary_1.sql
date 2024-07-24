WITH TableInfo AS (
    SELECT
        t.[name] AS TableName,
        p.[rows] AS [RowCount],
        COUNT(c.[name]) AS ColumnCount,
        (SELECT STUFF((
            SELECT ', ' + c.[name]
            FROM sys.index_columns ic
            JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
            WHERE ic.object_id = t.object_id AND ic.index_id = 1
            ORDER BY ic.key_ordinal
            FOR XML PATH('')), 1, 2, '')
        ) AS PrimaryKeyColumns
    FROM sys.tables t
    INNER JOIN sys.columns c ON t.object_id = c.object_id
    INNER JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0, 1)
    WHERE t.is_ms_shipped = 0
    GROUP BY t.[name], p.[rows], t.object_id
)
SELECT
    TableName,
    [RowCount],
    ColumnCount,
    COALESCE(PrimaryKeyColumns, 'No Primary Key') AS PrimaryKeyColumns
FROM TableInfo
WHERE [RowCount] > 0
ORDER BY [RowCount] DESC, TableName;