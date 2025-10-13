// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    now: new Date().toISOString(),
    has_SHEETS_WEBAPP_URL: Boolean(process.env.SHEETS_WEBAPP_URL),
    has_SHEETS_WEBAPP_TOKEN: Boolean(process.env.SHEETS_WEBAPP_TOKEN),
    has_TOSS_SECRET_KEY: Boolean(process.env.TOSS_SECRET_KEY),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || null,
  });
}
