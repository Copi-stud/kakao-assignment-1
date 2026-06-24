"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  todoId: number;
  completed: boolean;
}

export default function ToggleCompleteButton({ todoId, completed }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError("API 설정 오류가 발생했습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error("요청 실패");
      router.refresh();
    } catch {
      setError("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={[
          "min-w-[104px] h-9 inline-flex items-center justify-center gap-1.5 px-3",
          "border-2 border-[#672be0] rounded-lg text-sm font-bold leading-none",
          "transition-all duration-200 cursor-pointer hover:-translate-y-0.5",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          completed ? "bg-[#672be0] text-white" : "bg-white text-[#672be0]",
        ].join(" ")}
      >
        <span
          className={[
            "w-4 h-4 inline-flex items-center justify-center rounded-full border text-[11px] leading-none shrink-0",
            completed ? "border-white" : "border-[#672be0]",
          ].join(" ")}
        >
          {completed ? "✓" : ""}
        </span>
        {isLoading ? "처리 중..." : completed ? "완료됨" : "완료하기"}
      </button>
      {error && <p className="mt-1 text-xs text-[#c32f45]">{error}</p>}
    </div>
  );
}
