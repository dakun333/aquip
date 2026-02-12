"use client";
import { Metadata } from "next";
import Link from "next/link";

import { AQButton } from "../../ui/button";
import { Locale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { IResponse, RechargeRecord, User } from "@/app/types/api.type";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RechargeCard from "../../ui/my/rechargeCard";
import { TestData } from "./test.data";

export default function My({ params }: PageProps<"/[locale]/my">) {
  const t = useTranslations("my");
  // const [user, setUser] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rechargeRecords, setRechargeRecords] =
    useState<RechargeRecord[]>(TestData);
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
  const fetchRechargeRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/recharge-records", { cache: "no-store" });
      const data = (await resp.json()) as IResponse<RechargeRecord[]>;
      if (data.code === 0) {
        setRechargeRecords(data.data || []);
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
    // fetchUsers();
    // getInfo();
    // fetchRechargeRecords();
  }, []);

  return (
    <>
      <div className="h-full w-full flex flex-col pt-4 px-4">
        <div className="flex-1 overflow-y-auto flex flex-col  items-stretch gap-2">
          {user ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("name")}: {user?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {t("id")}: {user?.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("email")}: {user?.email}
                  </div>
                </CardContent>
              </Card>
              <AQButton onClick={() => authClient.signOut()}>
                {t("logout")}
              </AQButton>
            </>
          ) : (
            <div className="w-full flex flex-col item-stretch gap-2 ">
              <Link href="/sign-up">
                <AQButton className="w-full">{t("register")}</AQButton>
              </Link>
              <Link href="/sign-in">
                <AQButton className="w-full">{t("login")}</AQButton>
              </Link>
            </div>
          )}
          <Card className="w-full ">
            <CardHeader>
              <CardTitle>充值记录</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {rechargeRecords.map((record) => (
                <RechargeCard key={record.id} record={record} />
              ))}
              {loading && (
                <div className="text-sm text-gray-500">加载中...</div>
              )}
              {error && <div className="text-sm text-red-500">{error}</div>}
              {!loading && !error && rechargeRecords.length === 0 && (
                <div className="text-sm text-gray-500">暂无充值记录</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
