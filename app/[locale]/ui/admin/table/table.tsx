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
import { Pagination } from "./pagination";

export interface Column<T> {
  title: string;
  dataIndex: keyof T | string;
  key: string;
  render?: (value: any, record: T) => ReactNode;
  /** 字典映射 */
  valueEnum?: Record<string | number, { text: string; status?: string }>;
}

export interface PaginationConfig {
  total: number;
  pageSize: number;
  pageIndex: number;
  onChange: (pageIndex: number, pageSize?: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  /** 分页配置，传入则显示分页栏；查询/重置时应将 pageIndex 置为 1 以联动 */
  pagination?: PaginationConfig;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  rowKey = "id" as keyof T,
  pagination,
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
      {/* 分页：与表单查询/重置联动，查询或重置时由父组件将 pageIndex 置为 1 */}
      {pagination && pagination.total > 0 && (
        <Pagination
          total={pagination.total}
          pageSize={pagination.pageSize}
          pageIndex={pagination.pageIndex}
          onChange={pagination.onChange}
          loading={loading}
        />
      )}
    </div>
  );
}
