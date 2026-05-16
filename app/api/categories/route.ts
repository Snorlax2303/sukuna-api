import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/constants';
import type { ApiResponse } from '@/lib/types';

/**
 * GET /api/categories
 *
 * Lista todas as categorias disponíveis
 * (com contagem de notas em cada uma)
 */
export async function GET(): Promise<NextResponse> {
  try {
    // TODO: Implementar contagem real do OneDrive
    const categoriesWithCount = CATEGORIES.map(category => ({
      name: category,
      count: 0, // Será preenchido com dados reais do OneDrive
      color: getCategoryColor(category)
    }));

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithCount,
        total: categoriesWithCount.length
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar categorias',
      timestamp: new Date().toISOString()
    } as ApiResponse, { status: 500 });
  }
}

/**
 * Retorna cor para cada categoria (para UI)
 */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Desenvolvimento': '#3B82F6',  // Blue
    'Design': '#F59E0B',           // Amber
    'Pessoal': '#EC4899',          // Pink
    'Trabalho': '#10B981',         // Green
    'Aprendizado': '#8B5CF6',      // Purple
    'Ideias': '#F97316',           // Orange
    'Misc': '#6B7280'              // Gray
  };

  return colors[category] || '#6B7280';
}
