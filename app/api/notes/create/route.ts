import { NextRequest, NextResponse } from 'next/server';
import {
  detectCategory,
  extractTags,
  sanitizeFilename,
  generateNoteContent,
  validateNoteInput,
  formatOneDrivePath
} from '@/lib/utils';
import type { CreateNoteRequest, CreateNoteResponse } from '@/lib/types';

/**
 * POST /api/notes/create
 *
 * Cria uma nota no Obsidian Sukuna
 *
 * Body:
 * {
 *   "title": "React - Memoization",
 *   "content": "Guia completo sobre useMemo e useCallback...",
 *   "category": "Desenvolvimento" (opcional - será detectado automaticamente)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Nota criada com sucesso!",
 *   "data": {
 *     "filename": "React - Memoization.md",
 *     "category": "Desenvolvimento",
 *     "tags": ["desenvolvimento", "react"],
 *     "created_at": "2024-05-16T10:30:00Z",
 *     "path": "/Desenvolvimento/React - Memoization.md"
 *   }
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateNoteResponse>> {
  try {
    // Parse do request body
    const body = await request.json().catch(() => ({}));
    const { title, content, category } = body as Partial<CreateNoteRequest>;

    // Validar inputs
    const validation = validateNoteInput(title, content);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          error: validation.errors.join('; ')
        } as CreateNoteResponse,
        { status: 400 }
      );
    }

    // Detectar categoria
    const detectedCategory = detectCategory(title!, content!, category);

    // Extrair tags
    const tags = extractTags(content!, detectedCategory);

    // Sanitizar nome do arquivo
    const filename = sanitizeFilename(title!) + '.md';

    // Gerar conteúdo da nota
    const noteContent = generateNoteContent(
      title!,
      content!,
      detectedCategory,
      tags
    );

    // Formatar path para OneDrive
    const path = formatOneDrivePath(detectedCategory, title!);

    // TODO: Aqui você implementaria a lógica de escrever no OneDrive
    // Para agora, apenas retornamos o que seria criado
    // const oneDriveResult = await createNoteOnOneDrive(path, noteContent);

    return NextResponse.json(
      {
        success: true,
        message: 'Nota criada com sucesso!',
        data: {
          filename,
          category: detectedCategory,
          tags,
          created_at: new Date().toISOString(),
          path
        }
      } as CreateNoteResponse,
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar nota:', error);

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

/**
 * OPTIONS /api/notes/create
 *
 * CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
