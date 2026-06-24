import { NextResponse } from "next/server";
import {
  toServerFilter,
  validateFilter,
  validateSearch,
} from "@/app/lib/todoFilter";

export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "서버 설정 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  try {
    const requestUrl = new URL(request.url);
    const filter = validateFilter(requestUrl.searchParams.get("filter"));
    const search = validateSearch(requestUrl.searchParams.get("search"));
    const url = new URL(`${backendUrl}/todos`);
    const serverFilter = toServerFilter(filter);
    if (serverFilter) {
      url.searchParams.set("filter", serverFilter);
    }
    if (search) {
      url.searchParams.set("search", search);
    }

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Todo 목록을 불러오지 못했습니다." },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "서버 설정 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${backendUrl}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Todo 생성에 실패했습니다." },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
