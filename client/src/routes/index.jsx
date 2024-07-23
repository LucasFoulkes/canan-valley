import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const DataTable = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  const headers =
    typeof data[0] === "object" ? Object.keys(data[0]) : ["Value"];

  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div className="relative w-full overflow-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="px-4 py-2">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, colIndex) => {
                const cellValue =
                  typeof item === "object"
                    ? (item[header]?.toString() ?? "N/A")
                    : (item?.toString() ?? "N/A");
                const cellKey = `${rowIndex}-${colIndex}`;
                const isHovered = hoveredCell === cellKey;

                return (
                  <TableCell
                    key={cellKey}
                    className="px-4 py-3 relative"
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span className="block max-w-[15ch] truncate">
                      {cellValue}
                    </span>
                    {isHovered && cellValue.length > 15 && (
                      <div className="absolute z-10 left-0 top-full  bg-white border border-gray-200 rounded p-2 shadow-lg">
                        {cellValue}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DataRenderer = ({ data }) => {
  if (Array.isArray(data)) {
    return <DataTable data={data} />;
  }
  if (typeof data === "object" && data !== null) {
    return (
      <>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <DataRenderer data={value} />
          </div>
        ))}
      </>
    );
  }
  return <p>{data?.toString() ?? "N/A"}</p>;
};

const HomePage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["apiData"],
    queryFn: () => fetch("/api/clients").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {error.message}</p>;

  return (
    <div className="h-full flex flex-col">
      <Card className="flex flex-col h-full">
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full">
            <DataRenderer data={data} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});
