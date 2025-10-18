export type Product = {
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  pubDate?: string;
  price?: number;      // 정가(F)
  sellPrice?: number;  // 판매가(H)
  stock?: number;      // 재고수량(I)
  cover?: string;
};

export type CartItem = {
  isbn: string;
  title: string;
  price: number; // 계산에 쓰는 단가(판매가 우선, 없으면 정가)
  qty: number;
};
