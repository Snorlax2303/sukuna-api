import { NextRequest, NextResponse } from 'next/server';
import { searchNotesOnGitHub } from '@/lib/github';
import type { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query deve ter pelo menos 2 caracteres',
        timestamp: new Date().toISOString(),
      } as ApiResponse, { status: 400 });
    }

    const results = await searchNotesOnGitHub(query, category);

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: results.slice(0, limit),
        total: results.length,
        filters: { category },
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar notas',
      timestamp: new Date().toISOString(),
    } as ApiResponse, { status: 500 });
  }
}
