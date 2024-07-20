import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const DataTable = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <p>No data available</p>;
    }

    const headers = typeof data[0] === 'object' ? Object.keys(data[0]) : ['Value'];

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {headers.map((header) => (
                            <TableCell key={header}>
                                {typeof item === 'object'
                                    ? (item[header]?.toString() ?? 'N/A')
                                    : (item?.toString() ?? 'N/A')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const DataRenderer = ({ data }) => {
    if (Array.isArray(data)) {
        return <DataTable data={data} />;
    }
    if (typeof data === 'object' && data !== null) {
        return (
            <>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                        <h2 className="text-xl font-bold mt-4 mb-2">{key}</h2>
                        <DataRenderer data={value} />
                    </div>
                ))}
            </>
        );
    }
    return <p>{data?.toString() ?? 'N/A'}</p>;
};

const HomePage = () => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['apiData'],
        queryFn: () => fetch('http://0.0.0.0:8000/payments_per_day').then((res) => res.json()),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error has occurred: {error.message}</p>;

    return (
        <div className="h-full flex flex-col">
            <Card className="flex flex-col h-full">
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full">
                        <DataRenderer data={data} />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/')({
    component: HomePage,
});