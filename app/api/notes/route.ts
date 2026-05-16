import { NextRequest, NextResponse } from 'next/server';
import { validateNoteInput } from '@/lib/utils';
import type { ApiResponse } from '@/lib/types';

/**
 * GET /api/notes
 *
 * Lista todas as notas
 *
 * Query params:
 * - category: filtrar por categoria
 * - tag: filtrar por tag
 * - limit: quantidade máxima (padrão: 100)
 * - offset: página (padrão: 0)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Implementar busca real no OneDrive
    // Por enquanto retorna mock

    const mockNotes = [
      {
        id: 'sukuna-1',
        filename: 'React - Memoization.md',
        title: 'React - Memoization',
        category: 'Desenvolvimento',
        tags: ['react', 'desenvolvimento'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        path: '/Desenvolvimento/React - Memoization.md'
      }
    ];

    const filtered = mockNotes.filter(note => {
      if (category && note.category !== category) return false;
      if (tag && !note.tags.includes(tag)) return false;
      return true;
    });

    return NextResponse.json({
      success: true,
      data: {
        notes: filtered.slice(offset, offset + limit),
        total: filtered.length,
        limit,
        offset
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar notas',
      timestamp: new Date().toISOString()
    } as ApiResponse, { status: 500 });
  }
}
