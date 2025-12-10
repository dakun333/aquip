import { NextResponse } from "next/server";
import type { IResponse } from "@/app/[lang]/types/api.type";

export function jsonResponse<T>(data: IResponse<T>) {
  return NextResponse.json(data);
}
