// app/api/orders/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';

type LineItem = {
  isbn?: string;
  barcode?: string;
  code?: string;
  qty: number;
};

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, lineItems } = (await req.json()) as {
      orderId?: string;
      amount?: number;
      lineItems?: LineItem[];
    };

    if (!orderId || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { message: 'Invalid payload: orderId and lineItems are required' },
        { status: 400 }
      );
    }

    const url = process.env.SHEETS_WEBAPP_URL;
    const token = process.env.SHEETS_WEBAPP_TOKEN;

    if (!url || !token) {
      return NextResponse.json(
        {
          message:
            'Sheets Web App 환경변수 누락 (SHEETS_WEBAPP_URL / SHEETS_WEBAPP_TOKEN)',
        },
        { status: 500 }
      );
    }

    // Apps Script Web App 호출
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        action: 'recordSale',
        payload: { orderId, amount, lineItems },
      }),
    });

    // Apps Script는 상태코드를 커스텀하지 못할 수 있으므로
    // 바디의 code 값을 읽어 HTTP 상태코드로 매핑
    let data: any = null;
    try {
      data = await resp.json(); // { code?: number, ok?: boolean, ... }
    } catch {
      const txt = await resp.text();
      return NextResponse.json(
        { message: 'Invalid response from Sheets Web App', raw: txt },
        { status: 502 }
      );
    }

    const httpStatus =
      typeof data?.code === 'number' && data.code >= 100 && data.code <= 599
        ? data.code
        : resp.ok
        ? 200
        : 502;

    return NextResponse.json(data, { status: httpStatus });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || 'Server error' },
      { status: 500 }
    );
  }
}
