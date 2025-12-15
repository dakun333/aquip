"use client";
import { Metadata } from "next";
import Link from "next/link";

import { AQButton } from "../../ui/button";
import { Locale, useTranslations } from "next-intl";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import type { IResponse, User } from "@/app/types/api.type";

export default function My({ params }: PageProps<"/[locale]/my">) {
  const t = useTranslations("my");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getInfo = async () => {
    try {
      const res = await fetch("/api/users/me", { cache: "no-store" });
      console.log("获取用户信息", res);
    } catch (error) {
      console.error("get usr info error", error);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("/api/users", { cache: "no-store" });
        const data = (await resp.json()) as IResponse<User[]>;
        if (data.code === 0) {
          setUsers(data.data || []);
        } else {
          setError(data.message || "加载失败");
        }
      } catch (e) {
        setError("加载失败");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="shrink-0 h-16 flex justify-center items-center text-2xl font-bold border-b">
          {t("title")}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center gap-2">
          {/* <div>当前用户名：{res?.data?.user.id}</div>
          <div>当前用户名：{res?.data?.user.name}</div>
          <div>当前用户名：{res?.data?.user.email}</div> */}

          <Link href="/sign-up">
            <AQButton>注册</AQButton>
          </Link>
          <Link href="/sign-in">
            <AQButton>登录</AQButton>
          </Link>
          <div className="w-full max-w-md mt-4 px-4">
            <div className="text-lg font-semibold mb-2">所有用户</div>
            {loading && <div className="text-sm text-gray-500">加载中...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!loading && !error && (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="border rounded-md p-2 text-sm bg-white"
                  >
                    <div className="font-medium">{u.name}</div>
                    <div className="text-gray-600">{u.email}</div>
                    <div className="text-gray-400 text-xs">ID: {u.id}</div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-sm text-gray-500">暂无用户</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
