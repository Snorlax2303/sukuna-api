import { NextRequest, NextResponse } from 'next/server';

const ANYTHINGLLM_URL = process.env.ANYTHINGLLM_URL || 'http://localhost:3001';
const ANYTHINGLLM_KEY = process.env.ANYTHINGLLM_KEY || 'ZB4ZJ4P-V9WM35K-JN1MKH2-BD76Y2V';
const WORKSPACE = process.env.ANYTHINGLLM_WORKSPACE || 'meu-workspace';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Buscar no AnythingLLM usando API
    const response = await fetch(
      `${ANYTHINGLLM_URL}/api/v1/workspace/${WORKSPACE}/chat`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ANYTHINGLLM_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          mode: 'query', // Modo de busca/query
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      query,
      results: {
        response: data.response || data.message,
        sources: data.sources || [],
        documents: data.documents || [],
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    );
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
