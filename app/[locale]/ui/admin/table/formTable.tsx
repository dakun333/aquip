"use client";

import { DataTable, Column } from "./table";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { TableSearchForm, type SearchColumn } from "./form";

export interface FormTableColumn<T> extends Column<T> {
  hideInSearch?: boolean;
  valueType?: "text" | "select" | "date";
}

interface FormTableProps<T> {
  columns: FormTableColumn<T>[];
  request: (params: any) => Promise<{ data: T[]; total: number }>;
  rowKey?: keyof T | ((record: T) => string);
  /** 可选 zod schema，用于搜索表单校验与格式化 */
  searchSchema?: import("zod").ZodType<Record<string, unknown>>;
}

const DEFAULT_PAGE_SIZE = 10;

export function FormTable<T>({
  columns,
  request,
  rowKey,
  searchSchema,
}: FormTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const searchFormRef = useRef<import("./form").TableSearchFormRef>(null);
  const searchColumns = columns.filter(
    (col): col is FormTableColumn<T> => !col.hideInSearch
  ) as SearchColumn[];

  type FetchOverrides = {
    searchParams?: Record<string, any>;
    pageIndex?: number;
    pageSize?: number;
  };

  const fetchContent = async (overrides?: FetchOverrides) => {
    if (overrides?.searchParams !== undefined) {
      setSearchParams(overrides.searchParams);
    }
    const params = {
      ...(overrides?.searchParams ?? searchParams),
      pageIndex: overrides?.pageIndex ?? pageIndex,
      pageSize: overrides?.pageSize ?? pageSize,
    };
    setLoading(true);
    try {
      const res = await request(params);
      setData(res.data || []);
      setTotal(res.total ?? 0);
      setPageIndex(params.pageIndex);
      setPageSize(params.pageSize);
    } catch (error) {
      console.error("Fetch data failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const onSearchSubmit = (values: Record<string, unknown>) => {
    setSearchParams(values as Record<string, any>);
    fetchContent({ searchParams: values as Record<string, any>, pageIndex: 1 });
  };

  const onSearchReset = () => {
    setSearchParams({});
    fetchContent({ searchParams: {}, pageIndex: 1 });
  };

  const onPaginationChange = (newPageIndex: number, newPageSize?: number) => {
    fetchContent({
      pageIndex: newPageIndex,
      pageSize: newPageSize ?? pageSize,
    });
  };

  return (
    <div className="space-y-4">
      {searchColumns.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <TableSearchForm
              ref={searchFormRef}
              columns={searchColumns}
              schema={searchSchema}
              onSubmit={onSearchSubmit}
              onReset={onSearchReset}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey={rowKey}
        pagination={{
          total,
          pageSize,
          pageIndex,
          onChange: onPaginationChange,
        }}
      />
    </div>
  );
}
