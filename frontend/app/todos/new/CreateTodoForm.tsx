"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTodoForm({ returnHref }: { returnHref: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError("API 설정 오류가 발생했습니다.");
      return;
    }

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), due_date: dueDate || null }),
      });
      if (!res.ok) {
        throw new Error("서버 오류");
      }
      router.replace(returnHref);
    } catch {
      setError("Todo 생성에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#4c3f66] mb-1.5"
        >
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="w-full h-12 px-4 border border-[#dcd7eb] rounded-lg bg-white text-[#171321] focus:outline-none focus:border-[#672be0] focus:ring-4 focus:ring-[rgba(103,43,224,0.12)] transition-[border-color,box-shadow]"
        />
        {error && (
          <p className="mt-1.5 text-sm font-semibold text-[#c32f45]">{error}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="due-date"
          className="block text-sm font-medium text-[#4c3f66] mb-1.5"
        >
          날짜
        </label>
        <input
          id="due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full h-12 px-4 border border-[#dcd7eb] rounded-lg bg-white text-[#171321] focus:outline-none focus:border-[#672be0] focus:ring-4 focus:ring-[rgba(103,43,224,0.12)] transition-[border-color,box-shadow]"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <Link
          href={returnHref}
          className="min-h-[44px] px-5 inline-flex items-center bg-[#f1eef9] text-[#4c3f66] font-bold rounded-lg transition-transform hover:-translate-y-0.5"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-5 bg-[#672be0] text-white font-bold rounded-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? "추가 중..." : "추가하기"}
        </button>
      </div>
    </form>
  );
}
