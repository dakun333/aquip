"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

const PAGE_SIZE_OPTIONS = [2, 10, 20, 30, 40, 50];

export interface PaginationProps {
  /** 当前页码，从 1 开始 */
  pageIndex: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 页数或每页条数变化时回调：(pageIndex, pageSize?) */
  onChange: (pageIndex: number, pageSize?: number) => void;
  /** 加载中时禁用操作并显示加载态 */
  loading?: boolean;
}

/** 根据 total 和 pageSize 计算总页数 */
function getTotalPages(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

export function Pagination(props: PaginationProps) {
  const { pageIndex, pageSize, total, onChange, loading = false } = props;
  const t = useTranslations("admin.pagination");

  const totalPages = getTotalPages(total, pageSize);
  const currentPage = Math.min(Math.max(1, pageIndex), totalPages);

  const [jumpInput, setJumpInput] = useState("");
  const [jumpFocused, setJumpFocused] = useState(false);

  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newSize = Number(value);
      onChange(1, newSize);
    },
    [onChange]
  );

  const handleJump = useCallback(() => {
    const num = parseInt(jumpInput, 10);
    if (Number.isNaN(num) || num < 1 || num > totalPages) {
      setJumpInput(String(currentPage));
      return;
    }
    onChange(num);
    setJumpInput("");
    setJumpFocused(false);
  }, [jumpInput, totalPages, currentPage, onChange]);

  const handleJumpKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleJump();
      }
    },
    [handleJump]
  );

  const canPrevious = currentPage > 1 && !loading;
  const canNext = currentPage < totalPages && !loading;

  const jumpInputValue = jumpFocused ? jumpInput : String(currentPage);

  const handleJumpFocus = useCallback(() => {
    setJumpFocused(true);
    setJumpInput(String(currentPage));
  }, [currentPage]);

  return (
    <div className="flex justify-end p-4 border-t">
      <div className="flex items-center justify-between px-4 w-full lg:w-fit">
        <div className="flex flex-wrap items-center gap-4 lg:gap-8">
          {/* 每页条数 */}
          <div className="hidden items-center gap-2 lg:flex">
            <Label
              htmlFor="rows-per-page"
              className="text-sm font-medium whitespace-nowrap"
            >
              {t("rows_per_page")}
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
              disabled={loading}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 页码展示 + 跳转输入框 */}
          <div className="flex items-center gap-2 text-sm font-medium">
            {t("page_of", { page: currentPage, totalPages })}
            <span className="hidden sm:inline">{t("go_to_page")}</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              className="h-8 w-14 text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={jumpInputValue}
              onChange={(e) =>
                setJumpInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              onFocus={handleJumpFocus}
              onBlur={handleJump}
              onKeyDown={handleJumpKeyDown}
              disabled={loading || totalPages <= 1}
              aria-label={t("go_to_page")}
            />
          </div>

          {/* 上下页按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onChange(1)}
              disabled={!canPrevious}
              aria-label={t("first_page")}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => onChange(currentPage - 1)}
              disabled={!canPrevious}
              aria-label={t("prev_page")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => onChange(currentPage + 1)}
              disabled={!canNext}
              aria-label={t("next_page")}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => onChange(totalPages)}
              disabled={!canNext}
              aria-label={t("last_page")}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
