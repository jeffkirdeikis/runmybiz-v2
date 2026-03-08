export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo header */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0071e3]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-[#1d1d1f]">
            RunMyBiz
          </span>
        </a>
      </div>

      {/* Centered content */}
      <div className="mx-auto max-w-2xl px-6 pb-16">{children}</div>
    </div>
  );
}
