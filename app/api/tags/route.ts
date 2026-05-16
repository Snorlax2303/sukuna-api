import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

/**
 * GET /api/tags
 *
 * Lista todas as tags encontradas nas notas
 * (com contagem de quantas notas usam cada tag)
 */
export async function GET(): Promise<NextResponse> {
  try {
    // TODO: Implementar busca real de tags do OneDrive
    const mockTags = [
      {
        name: 'react',
        count: 5,
        color: '#61DAFB'
      },
      {
        name: 'python',
        count: 3,
        color: '#3776AB'
      },
      {
        name: 'desenvolvimento',
        count: 12,
        color: '#FF6B6B'
      },
      {
        name: 'design',
        count: 4,
        color: '#FFD93D'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        tags: mockTags.sort((a, b) => b.count - a.count),
        total: mockTags.length
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar tags',
      timestamp: new Date().toISOString()
    } as ApiResponse, { status: 500 });
  }
}
