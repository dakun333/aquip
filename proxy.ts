import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // 先让 next-intl 处理语言逻辑，获取 response
  const response = intlMiddleware(request);

  if (isProduction) {
    // 1. 识别二级域名
    const isAdminDomain = hostname.split(".")[0] === "admin-aquip";

    if (isAdminDomain) {
      // 2. 【核心点】无论访问哪个路径，都在内部重写到 /admin 文件夹下
      // 比如：/ -> /admin,  /config -> /admin/config
      if (!pathname.startsWith("/admin")) {
        // 获取当前请求的语言（从 URL 或 Cookie）
        const locale = request.nextUrl.locale || "zh";

        // 拼接内部真实路径：/zh/admin/xxx
        const internalPath = `/${locale}/admin${pathname === "/" ? "" : pathname}`;

        return NextResponse.rewrite(new URL(internalPath, request.url));
      }
    } else {
      // 3. 非 admin 域名，禁止通过路径直接访问后台
      if (pathname.startsWith("/admin") || pathname.includes("/admin/")) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
