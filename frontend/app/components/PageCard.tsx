import type { ReactNode } from "react";

export default function PageCard({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-screen flex items-start justify-center px-3.5 py-8 sm:px-5 sm:py-16"
      style={{
        background:
          "linear-gradient(180deg, rgba(103,43,224,0.08) 0%, transparent 280px), #f7f7fb",
      }}
    >
      <div className="w-full max-w-[720px] bg-white rounded-lg border border-[#e8e5f2] shadow-[0_18px_48px_rgba(31,24,51,0.08)] p-6 sm:p-10">
        {children}
      </div>
    </main>
  );
}
