import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params;
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
    const res = await fetch(`${backendUrl}/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Todo 수정에 실패했습니다." },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params;
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "서버 설정 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${backendUrl}/todos/${todoId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Todo 삭제에 실패했습니다." },
        { status: res.status }
      );
    }
    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
