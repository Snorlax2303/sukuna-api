import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Health check da API
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Sukuna Note API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
