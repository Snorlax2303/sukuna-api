import { NextRequest, NextResponse } from 'next/server';
import {
  detectCategory,
  extractTags,
  sanitizeFilename,
  generateNoteContent,
  validateNoteInput,
} from '@/lib/utils';
import { createFileOnGitHub } from '@/lib/github';
import type { CreateNoteRequest, CreateNoteResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<CreateNoteResponse>> {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, content, category } = body as Partial<CreateNoteRequest>;

    const validation = validateNoteInput(title, content);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', error: validation.errors.join('; ') } as CreateNoteResponse,
        { status: 400 }
      );
    }

    const detectedCategory = detectCategory(title!, content!, category);
    const tags = extractTags(content!, detectedCategory);
    const filename = sanitizeFilename(title!) + '.md';
    const noteContent = generateNoteContent(title!, content!, detectedCategory, tags);

    // Caminho no repositório: Categoria/Titulo.md
    const githubPath = `${detectedCategory}/${filename}`;

    const github = await createFileOnGitHub(
      githubPath,
      noteContent,
      `feat: add note "${title}"`
    );

    if (!github.success) {
      return NextResponse.json(
        { success: false, message: 'Erro ao salvar no GitHub', error: 'GitHub API error' } as CreateNoteResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Nota criada com sucesso!',
        data: {
          filename,
          category: detectedCategory,
          tags,
          created_at: new Date().toISOString(),
          path: `/${githubPath}`,
        }
      } as CreateNoteResponse,
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar requisição',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      } as CreateNoteResponse,
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
