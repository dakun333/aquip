import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // 仅在生产环境下执行域名路由分发
  if (isProduction) {
    // 判断是否为 admin 域名
    const isAdminDomain = hostname.split(".")[0] === "admin";

    if (isAdminDomain) {
      // admin 域名：根路径定位到 dashboard
      if (pathname === "/") {
        return NextResponse.rewrite(new URL("/dashboard", request.url));
      }
    } else {
      // 非 admin 域名：禁止访问 admin 群组特有的路径
      const adminPaths = ["/dashboard", "/order"];
      if (adminPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
