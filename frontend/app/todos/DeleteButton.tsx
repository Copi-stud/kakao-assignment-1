"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ todoId }: { todoId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError("API 설정 오류가 발생했습니다.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/todos/${todoId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("삭제 실패");
      }
      router.refresh();
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="min-h-[34px] px-3 inline-flex items-center text-sm font-bold bg-[#fff0f3] text-[#c32f45] rounded-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isDeleting ? "삭제 중..." : "삭제"}
      </button>
      {error && <p className="mt-1 text-xs text-[#c32f45]">{error}</p>}
    </div>
  );
}
