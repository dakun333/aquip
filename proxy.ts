import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";
  const isAdminDomain = hostname.split(".")[0] === "admin-aquip";
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // 跳过静态文件请求（例如 .ico/.png/.css/.js 等）
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 兼容把 query 参数误写成路径的场景：
  // /payment_id=260203020008&amount=1001.00&api_key=124
  if (
    pathname.startsWith("/payment_id=")
    && pathname.includes("&amount=")
    && pathname.includes("&api_key=")
  ) {
    const normalized = request.nextUrl.clone();
    normalized.pathname = "/";
    normalized.search = pathname.slice(1);
    return NextResponse.redirect(normalized);
  }

  // 根路径统一改写到默认 locale，避免 i18n 中间件循环跳转
  if (pathname === "/" && !isAdminDomain) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/${routing.defaultLocale}`;
    return NextResponse.rewrite(rewritten);
  }

  // 避免 next-intl 在 localePrefix=never 下把 /en 再重定向回 /
  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // 先让 next-intl 处理语言逻辑，获取 response
  const response = intlMiddleware(request);

  if (isProduction) {
    // 1. 识别二级域名
    if (isAdminDomain) {
      // 2. 【核心点】无论访问哪个路径，都在内部重写到 /admin 文件夹下
      // 比如：/ -> /admin,  /config -> /admin/config
      // if (!pathname.startsWith("/admin")) {
      // 获取当前请求的语言（从 URL 或 Cookie）
      const locale = request.nextUrl.locale || "zh";

      // 拼接内部真实路径：/zh/admin/xxx
      const internalPath = `/${locale}/admin${pathname === "/" ? "" : pathname}`;

      return NextResponse.rewrite(new URL(internalPath, request.url));
      // }
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
  matcher: [
    "/((?!api|trpc|_next|_vercel).*)",
    "/payment_id=:rest*",
  ],
};
