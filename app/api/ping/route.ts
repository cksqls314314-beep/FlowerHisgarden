// app/api/ping/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, pong: true, now: new Date().toISOString() });
}
