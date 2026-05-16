import { NextRequest, NextResponse } from 'next/server';
import { listNotesFromGitHub } from '@/lib/github';
import type { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const notes = await listNotesFromGitHub(category);
    const paginated = notes.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        notes: paginated,
        total: notes.length,
        limit,
        offset,
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar notas',
      timestamp: new Date().toISOString(),
    } as ApiResponse, { status: 500 });
  }
}
