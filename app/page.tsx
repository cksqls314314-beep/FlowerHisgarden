import ProductCard from '@/components/ProductCard';
import { fetchCSV, parseCSV } from '@/lib/csv';

export const revalidate = 0; // 항상 최신 CSV

export default async function Home() {
  const url = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL!;
  const raw = await fetchCSV(url);
  const rows = parseCSV(raw);
  const header = rows[0];

  // 기대 스키마: ISBN | 제목 | 저자 | 출판사 | 출간일 | 정가 | 매입가 | 판매가 | 재고수량 | 비고
  const H = (name: string) => header.indexOf(name);
  const out = rows.slice(1).map(r => ({
    isbn: r[H('ISBN')],
    title: r[H('제목')],
    author: r[H('저자')],
    price: Number(r[H('정가')] || 0),
    sellPrice: Number(r[H('판매가')] || 0),
    stock: Number(r[H('재고수량')] || 0),
    cover: undefined as string | undefined,
  })).filter(p => p.isbn && (p.sellPrice || p.price) && (p.stock || 0) > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">중고책</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {out.map(p => (
          <ProductCard key={p.isbn} isbn={p.isbn} title={p.title} author={p.author} price={p.price} sellPrice={p.sellPrice} />
        ))}
      </div>
    </div>
  );
}
