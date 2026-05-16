import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

/**
 * GET /api/search
 *
 * Busca notas por keywords, categoria, tags
 *
 * Query params:
 * - q: keywords de busca (obrigatório)
 * - category: filtrar por categoria
 * - tags: filtrar por tags (comma-separated)
 * - limit: quantidade máxima (padrão: 50)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').map(t => t.trim()) || [];
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query deve ter pelo menos 2 caracteres',
        timestamp: new Date().toISOString()
      } as ApiResponse, { status: 400 });
    }

    // TODO: Implementar busca real
    // Buscar no OneDrive/local:
    // 1. Buscar em filenames
    // 2. Buscar em conteúdo
    // 3. Filtrar por categoria
    // 4. Filtrar por tags
    // 5. Ranking por relevância

    const mockResults = [
      {
        id: 'sukuna-1',
        filename: 'React - Memoization.md',
        title: 'React - Memoization',
        category: 'Desenvolvimento',
        tags: ['react', 'desenvolvimento'],
        excerpt: 'Guia completo sobre useMemo e useCallback para otimizar...',
        relevance: 0.95,
        path: '/Desenvolvimento/React - Memoization.md'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: mockResults.slice(0, limit),
        total: mockResults.length,
        filters: { category, tags }
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar notas',
      timestamp: new Date().toISOString()
    } as ApiResponse, { status: 500 });
  }
}
