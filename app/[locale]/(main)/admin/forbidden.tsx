export default function Forbidden() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">禁止访问</h2>
        <p>你的账号权限不足以查看此管理页面。</p>
      </div>
    </main>
  );
}
