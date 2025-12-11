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
