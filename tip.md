## NextRouter was not mounted

### Solution

- 在 Next.js 13/14/15 的 App Router 模式中不能使用 `next/router`
- App Router（`app/` 目录）使用 `next/navigation` API

## 获取路由参数

- ❌ 错误写法：`const id = params.id;` （这样写会报错，需要 await）
- ✅ 正确写法：`const id = (await params).id;`

## 多语言配置

- 使用 `next-intl` 进行开发
- 需要注意的文件：
  - [proxy.ts](file://d:\Project\aquip\proxy.ts)
  - [next.config.ts](file://d:\Project\aquip\next.config.ts)
  - `i18n` 文件夹
  - `app/[locale]/layout.tsx`
  - `messages` 文件夹
  - 放置语言的 JSON 文件，在 `i18n` 文件夹中会被导入解析

## 根布局不接受除 children 的参数

- 否则构建会报错
- 错误信息：
  ```
  Type 'typeof import("D:/Project/aquip/app/layout")' does not satisfy the constraint 'LayoutConfig<"/">'.
  ```

## mainfest.ts

- 配置文件，用于生成 `manifest.json` 文件
- 里面的 name: t("name") 会影响应用安装到手机主屏幕后的名称，但不会影响浏览器标签页上显示的 <title>

## 用户登录和注册

- 用本来选用的库是 next-auth，但是发现 next-auth 在 5.0 beta 版本已经不在发布新版本，并且交由 better-auth 团队进行维护，所以更改了技术栈
- 使用 better-auth

## 如果是部署在 vercel，需要注意使用开启了 better-auth

- 开启登录之后，ssr 组件中调用本地模拟的 mock 数据的头，vercel 都会自动增加验证
- 验证失败，会返回 401，需要处理，因为要么直接访问 localhost：3000，要么时跨域
- 但是注意，vercel 在前端界面并不会显示 401，而是显示 500，所以需要在 vercel 的 logs 里面自己看
- 调用第三方服务时倒是可以直接访问的（比如 B 站）
- 所以要注意添加认证之后的修改请求
