"use client";

/**
 * 表格搜索表单组件：根据列配置自动生成表单项，支持 input、select、日期，
 * 可选 zod 校验，通过 ref 暴露 getValues、reset、validate。
 */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Search, RotateCcw } from "lucide-react";

/** 搜索列配置，用于自动生成表单项 */
export interface SearchColumn {
  key: string;
  dataIndex: string;
  title: string;
  valueType?: "text" | "select" | "date";
  valueEnum?: Record<string | number, { text: string; status?: string }>;
}

export interface TableSearchFormRef {
  /** 获取当前表单值（未校验，原始值） */
  getValues: () => Record<string, unknown>;
  /** 重置表单为默认值 */
  reset: () => void;
  /** 校验表单，返回是否通过 */
  validate: () => Promise<boolean>;
  /** 内部 form 实例，便于高级用法 */
  form: UseFormReturn<Record<string, unknown>>;
}

export interface TableSearchFormProps {
  /** 列配置，用于生成表单项（key、dataIndex、title、valueType、valueEnum） */
  columns: SearchColumn[];
  /** 可选 zod schema，传入则启用校验与格式化（与列 dataIndex 对应） */
  schema?: z.ZodTypeAny;
  /** 提交时回调（校验通过后传入格式化后的 values） */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** 点击重置时回调，组件内部会先执行 reset 再调用 onReset */
  onReset?: () => void;
  loading?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  /** 表单项栅格类，默认与 formTable 一致 */
  className?: string;
}

const defaultValuesFromColumns = (
  columns: SearchColumn[]
): Record<string, string> =>
  columns.reduce(
    (acc, col) => ({ ...acc, [col.dataIndex]: "" }),
    {} as Record<string, string>
  );

export const TableSearchForm = forwardRef<
  TableSearchFormRef,
  TableSearchFormProps
>(function TableSearchForm(
  {
    columns,
    schema,
    onSubmit,
    onReset,
    loading = false,
    submitLabel = "查询",
    resetLabel = "重置",
    className = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",
  },
  ref
) {
  const defaultValues = useMemo(
    () => defaultValuesFromColumns(columns),
    [columns]
  );

  const form = useForm<Record<string, unknown>>({
    defaultValues: defaultValues as Record<string, unknown>,
    resolver: schema ? (zodResolver(schema as any) as any) : undefined,
  });

  const formRef = useRef(form);
  formRef.current = form;

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => formRef.current.getValues() as Record<string, unknown>,
      reset: () => formRef.current.reset(defaultValues),
      validate: () => formRef.current.trigger(),
      form: formRef.current,
    }),
    [defaultValues, form]
  );

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit?.(values);
  });

  const handleReset = () => {
    form.reset(defaultValues);
    onReset?.();
  };

  if (columns.length === 0) return null;

  return (
    <form id="table-search-form" onSubmit={handleSubmit} className={className}>
      {columns.map((col) => {
        const name = col.dataIndex;
        return (
          <Controller
            key={col.key}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`search-${col.key}`}>
                  {col.title}
                </FieldLabel>
                {col.valueType === "select" && col.valueEnum ? (
                  <Select
                    value={String(field.value ?? "")}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger id={`search-${col.key}`}>
                      <SelectValue placeholder={`请选择${col.title}`} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(col.valueEnum).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : col.valueType === "date" ? (
                  <Input
                    id={`search-${col.key}`}
                    type="date"
                    value={String(field.value ?? "")}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                  />
                ) : (
                  <Input
                    id={`search-${col.key}`}
                    placeholder={`请输入${col.title}`}
                    value={String(field.value ?? "")}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={loading}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                )}
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        );
      })}
      <div className="flex items-center gap-2 justify-end md:col-span-full">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          size="sm"
          disabled={loading}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {resetLabel}
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
});
