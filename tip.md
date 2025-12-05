# NextRouter was not mounted.

## Solution

- 在 Next.js 13/14/15 的 App Router 模式中不能使用 next/router
- App Router（app/ 目录）使用 next/navigation API

# 获取路由参数

- const id = params.id; 这样写会报错，需要 await
- const id = (await params).id;
