"use client";

import { DataTable, Column } from "./table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";

export interface FormTableColumn<T> extends Column<T> {
  hideInSearch?: boolean;
  valueType?: "text" | "select" | "date";
}

interface FormTableProps<T> {
  columns: FormTableColumn<T>[];
  request: (params: any) => Promise<{ data: T[]; total: number }>;
  rowKey?: keyof T | ((record: T) => string);
}

export function FormTable<T>({ columns, request, rowKey }: FormTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  const searchColumns = columns.filter((col) => !col.hideInSearch);

  const fetchContent = async (params = searchParams) => {
    setLoading(true);
    try {
      const res = await request(params);
      setData(res.data || []);
    } catch (error) {
      console.error("Fetch data failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContent();
  };

  const onReset = () => {
    setSearchParams({});
    fetchContent({});
  };

  const renderSearchInput = (col: FormTableColumn<T>) => {
    const key = col.dataIndex as string;
    const value = searchParams[key] || "";

    if (col.valueType === "select" && col.valueEnum) {
      return (
        <Select
          value={value}
          onValueChange={(val) =>
            setSearchParams({ ...searchParams, [key]: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={`请选择${col.title}`} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(col.valueEnum).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (col.valueType === "date") {
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) =>
            setSearchParams({ ...searchParams, [key]: e.target.value })
          }
        />
      );
    }

    return (
      <Input
        placeholder={`请输入${col.title}`}
        value={value}
        onChange={(e) =>
          setSearchParams({ ...searchParams, [key]: e.target.value })
        }
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* 搜索表单 */}
      {searchColumns.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={onSearch}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {searchColumns.map((col) => (
                <div key={col.key} className="flex items-center space-x-2">
                  <label className="text-sm font-medium whitespace-nowrap w-20">
                    {col.title}
                  </label>
                  {renderSearchInput(col)}
                </div>
              ))}
              <div className="flex items-center space-x-2 justify-end md:col-span-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  size="sm"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  重置
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  查询
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey={rowKey}
      />
    </div>
  );
}
