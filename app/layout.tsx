import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'HGCC Online Shop',
  description: 'His Garden & Commons Club – Online Used Books',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold">HGCC</Link>
            <Link href="/cart" className="ml-auto">장바구니</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-stone-500">© HGCC</footer>
      </body>
    </html>
  );
}
