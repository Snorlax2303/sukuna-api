import { NextRequest, NextResponse } from 'next/server';
import {
  detectCategory,
  extractTags,
  sanitizeFilename,
  generateNoteContent,
  validateNoteInput,
} from '@/lib/utils';
import { createFileOnGitHub } from '@/lib/github';
import type { CreateNoteRequest, CreateNoteResponse, FileMetadata } from '@/lib/types';

async function processFormData(request: NextRequest): Promise<Partial<CreateNoteRequest>> {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string | undefined;

  const files: FileMetadata[] = [];

  // Processar todos os arquivos
  for (const [key, value] of formData.entries()) {
    if (key === 'files' && value instanceof File) {
      const buffer = await value.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      files.push({
        name: value.name,
        size: value.size,
        type: value.type,
        base64,
        mimeType: value.type,
      });
    }
  }

  return { title, content, category, files };
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateNoteResponse>> {
  try {
    let body: Partial<CreateNoteRequest> = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else if (contentType.includes('multipart/form-data')) {
      body = await processFormData(request);
    }

    const { title, content, category, files } = body as Partial<CreateNoteRequest>;

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

    // Adicionar referências de arquivos ao conteúdo
    let noteContent = generateNoteContent(title!, content!, detectedCategory, tags);
    const attachments: { filename: string; type: string; size: number; path: string }[] = [];

    // Salvar nota principal
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

    // Salvar arquivos no GitHub (em pasta _attachments)
    if (files && files.length > 0) {
      for (const file of files) {
        const attachmentPath = `${detectedCategory}/_attachments/${sanitizeFilename(title!)}_${file.name}`;
        const attachmentGithub = await createFileOnGitHub(
          attachmentPath,
          file.base64,
          `docs: add attachment "${file.name}" to note "${title}"`,
          true // isBinary = true
        );

        if (attachmentGithub.success) {
          attachments.push({
            filename: file.name,
            type: file.mimeType,
            size: file.size,
            path: `/${attachmentPath}`,
          });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: files && files.length > 0
          ? `Nota criada com ${files.length} arquivo(s)!`
          : 'Nota criada com sucesso!',
        data: {
          filename,
          category: detectedCategory,
          tags,
          created_at: new Date().toISOString(),
          path: `/${githubPath}`,
          attachments: attachments.length > 0 ? attachments : undefined,
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

export async function PUT(request: NextRequest): Promise<NextResponse<CreateNoteResponse>> {
  try {
    let body: Partial<CreateNoteRequest> = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else if (contentType.includes('multipart/form-data')) {
      body = await processFormData(request);
    }

    const { title, content, category } = body as Partial<CreateNoteRequest>;
    const filename = title ? sanitizeFilename(title) + '.md' : '';

    const validation = validateNoteInput(title, content);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', error: validation.errors.join('; ') } as CreateNoteResponse,
        { status: 400 }
      );
    }

    const detectedCategory = detectCategory(title!, content!, category);
    const tags = extractTags(content!, detectedCategory);
    const noteContent = generateNoteContent(title!, content!, detectedCategory, tags);
    const githubPath = `${detectedCategory}/${filename}`;

    const github = await createFileOnGitHub(
      githubPath,
      noteContent,
      `docs: update note "${title}"`
    );

    if (!github.success) {
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar no GitHub', error: 'GitHub API error' } as CreateNoteResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Nota atualizada com sucesso!',
        data: {
          filename,
          category: detectedCategory,
          tags,
          created_at: new Date().toISOString(),
          path: `/${githubPath}`,
        }
      } as CreateNoteResponse,
      { status: 200 }
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
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
