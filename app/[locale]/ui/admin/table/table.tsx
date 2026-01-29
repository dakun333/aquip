"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  title: string;
  dataIndex: keyof T | string;
  key: string;
  render?: (value: any, record: T) => ReactNode;
  /** 字典映射 */
  valueEnum?: Record<string | number, { text: string; status?: string }>;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
}

export function DataTable<T>({
  columns,
  data,
  loading,
  rowKey = "id" as keyof T,
}: DataTableProps<T>) {
  const getRowKey = (record: T) => {
    if (typeof rowKey === "function") return rowKey(record);
    return String(record[rowKey]);
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((record) => (
              <TableRow key={getRowKey(record)}>
                {columns.map((column) => {
                  const value = (record as any)[column.dataIndex];
                  return (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(value, record)
                        : column.valueEnum
                          ? column.valueEnum[value]?.text || value
                          : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
