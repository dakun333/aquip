"use client";
import { Metadata } from "next";
import Link from "next/link";

import { AQButton } from "../../ui/button";
import { Locale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { IResponse, User } from "@/app/types/api.type";
import { authClient } from "@/lib/auth-client";

export default function My({ params }: PageProps<"/[locale]/my">) {
  const t = useTranslations("my");
  // const [user, setUser] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 1. 使用 Better-Auth 的 Hook 获取当前用户 (替代 getInfo)
  // 这会自动共享全局登录状态
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;
  // const getInfo = async () => {
  //   try {
  //     const res = await fetch("/api/users/me");
  //     const data = (await res.json()) as IResponse<User>;
  //     console.log("获取用户信息", data);
  //     if (data.code === 0) {
  //       setUser(data.data);
  //     } else {
  //       setError(data.message || "加载失败");
  //     }
  //   } catch (error) {
  //     console.error("get usr info error", error);
  //   }
  // };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/users", { cache: "no-store" });
      const data = (await resp.json()) as IResponse<User[]>;
      if (data.code === 0) {
        setUsers(data.data || []);
      } else {
        setError(data.message || t("load_failed"));
      }
    } catch (e) {
      setError(t("load_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // getInfo();
  }, []);

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center gap-2">
          <div>
            {t("id")}: {user?.id}
          </div>
          <div>
            {t("name")}: {user?.name}
          </div>
          <div>
            {t("email")}: {user?.email}
          </div>

          {user ? (
            <>
              <AQButton onClick={() => authClient.signOut()}>
                {t("logout")}
              </AQButton>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <AQButton>{t("register")}</AQButton>
              </Link>
              <Link href="/sign-in">
                <AQButton>{t("login")}</AQButton>
              </Link>
            </>
          )}
          <div className="w-full max-w-md mt-4 px-4">
            <div className="text-lg font-semibold mb-2">{t("all_users")}</div>
            {loading && (
              <div className="text-sm text-gray-500">{t("loading")}</div>
            )}
            {error && (
              <div className="text-sm text-red-500">
                {error || t("load_failed")}
              </div>
            )}
            {!loading && !error && (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="border rounded-md p-2 text-sm bg-white"
                  >
                    <div className="font-medium">{u.name}</div>
                    <div className="text-gray-600">{u.email}</div>
                    <div className="text-gray-400 text-xs">
                      {t("id")}: {u.id}
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-sm text-gray-500">{t("no_users")}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
