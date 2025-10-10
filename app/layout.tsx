export const metadata = {
  title: "중고서점 | Used Bookshop",
  description: "대전 중고서점 재고 조회",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px" }}>
          <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <img src="/logo.svg" alt="logo" width={36} height={36} />
            <h1 style={{ margin: 0, fontSize: 22 }}>대전 중고서점</h1>
          </header>
          {children}
          <footer style={{ marginTop: 48, fontSize: 12, color: "#666" }}>
            <div>© {new Date().getFullYear()} 대전 중고서점</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
