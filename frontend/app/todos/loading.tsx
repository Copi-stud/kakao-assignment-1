export default function Loading() {
  return (
    <main
      className="min-h-screen flex items-start justify-center px-3.5 py-8 sm:px-5 sm:py-16"
      style={{
        background:
          "linear-gradient(180deg, rgba(103,43,224,0.08) 0%, transparent 280px), #f7f7fb",
      }}
    >
      <div className="w-full max-w-[720px] bg-white rounded-lg border border-[#e8e5f2] shadow-[0_18px_48px_rgba(31,24,51,0.08)] p-6 sm:p-10">
        <div className="mb-7">
          <div className="h-3.5 w-20 bg-[#f1eef9] rounded-full animate-pulse mb-2" />
          <div className="h-9 w-40 bg-[#f1eef9] rounded animate-pulse mb-3" />
          <div className="h-3.5 w-56 bg-[#f1eef9] rounded-full animate-pulse" />
        </div>
        <div className="h-[42px] bg-[#f1eef9] rounded-lg animate-pulse mb-4" />
        <div className="h-[72px] bg-[#f1eef9] rounded-lg animate-pulse mb-4" />
        <div className="h-[52px] bg-[#f1eef9] rounded-lg animate-pulse mb-[18px]" />
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[62px] bg-[#f7f4ff] rounded-lg animate-pulse" />
          ))}
        </div>
        <p className="mt-4 text-sm text-[#746f80]">Todo를 불러오는 중...</p>
      </div>
    </main>
  );
}
