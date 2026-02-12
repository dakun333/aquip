"use client";

import * as React from "react";
import { usePathname } from "@/i18n/navigation";
import { ADMIN_NAV_CONFIG } from "@/lib/admin-config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // 查找匹配的导航项
  const activeItem = ADMIN_NAV_CONFIG.find((item) => {
    if (item.url === pathname) return true;
    if (item.items) {
      return item.items.some((subItem) => subItem.url === pathname);
    }
    return false;
  });

  // 查找匹配的子项（如果有）
  const activeSubItem = activeItem?.items?.find(
    (subItem) => subItem.url === pathname,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">管理后台</BreadcrumbLink>
        </BreadcrumbItem>
        {activeItem && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {activeSubItem ? (
                <BreadcrumbLink href={activeItem.url}>
                  {activeItem.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {activeSubItem && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{activeSubItem.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
