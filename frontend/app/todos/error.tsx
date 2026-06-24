"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-start justify-center px-3.5 py-8 sm:px-5 sm:py-16"
      style={{
        background:
          "linear-gradient(180deg, rgba(103,43,224,0.08) 0%, transparent 280px), #f7f7fb",
      }}
    >
      <div className="w-full max-w-[720px] bg-white rounded-lg border border-[#e8e5f2] shadow-[0_18px_48px_rgba(31,24,51,0.08)] p-6 sm:p-10">
        <p className="text-sm font-bold text-[#672be0] mb-2">Productivity</p>
        <h2 className="text-2xl font-extrabold text-[#171321] mb-3">
          오류가 발생했습니다
        </h2>
        <p className="text-[#746f80] mb-6">{error.message}</p>
        <button
          onClick={unstable_retry}
          className="h-11 px-5 bg-[#672be0] text-white text-sm font-bold rounded-lg transition-transform hover:-translate-y-0.5"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
