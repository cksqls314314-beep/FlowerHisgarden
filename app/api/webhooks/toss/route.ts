// app/api/webhooks/toss/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json(); // Toss 웹훅 페이로드
    // (선택) 이벤트 서명 검증 로직 추가 가능

    const url = process.env.SHEETS_WEBAPP_URL;
    const token = process.env.SHEETS_WEBAPP_TOKEN;

    if (url && token) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'updatePayment', payload: event }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Webhook error' }, { status: 500 });
  }
}
