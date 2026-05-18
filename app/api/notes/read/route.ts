import { NextRequest, NextResponse } from 'next/server';
import { listNotesFromGitHub, readNoteFromGitHub } from '@/lib/github';
import type { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const category = searchParams.get('category') || '';

    if (!title) {
      return NextResponse.json({
        success: false,
        error: 'Parâmetro "title" é obrigatório',
        timestamp: new Date().toISOString(),
      } as ApiResponse, { status: 400 });
    }

    // Buscar todas as notas para encontrar a correspondente
    const allNotes = await listNotesFromGitHub(category || undefined);
    const note = allNotes.find(n =>
      n.title.toLowerCase() === title.toLowerCase() ||
      n.filename.replace('.md', '').toLowerCase() === title.toLowerCase()
    );

    if (!note) {
      return NextResponse.json({
        success: false,
        error: `Nota "${title}" não encontrada`,
        timestamp: new Date().toISOString(),
      } as ApiResponse, { status: 404 });
    }

    const content = await readNoteFromGitHub(note.category, note.filename);

    return NextResponse.json({
      success: true,
      data: {
        title: note.title,
        filename: note.filename,
        category: note.category,
        path: note.path,
        tags: note.tags,
        content,
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao ler nota',
      timestamp: new Date().toISOString(),
    } as ApiResponse, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
