# Sukuna Note API

API profissional para criar notas no Obsidian Sukuna via OneDrive.

Deploy no Vercel com um clique! 🚀

## Características

✅ **Detecção automática de categorias**  
✅ **Tags inteligentes**  
✅ **Frontmatter YAML automático**  
✅ **Validação de dados**  
✅ **CORS habilitado**  
✅ **Health check endpoint**  
✅ **TypeScript completo**  
✅ **Pronto para produção**  

## Quick Start (Local)

### 1. Clonar/Baixar projeto

```bash
cd sukuna-api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

API estará em: `http://localhost:3000`

### 4. Testar

```bash
curl -X POST http://localhost:3000/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React - Memoization",
    "content": "Guia completo sobre useMemo e useCallback...",
    "category": "Desenvolvimento"
  }'
```

## Deploy no Vercel

### 1. Preparar repositório

```bash
# Criar repo no GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/sukuna-api.git
git push -u origin main
```

### 2. Deploy no Vercel

**Opção A: Via website**
1. Acesse https://vercel.com
2. Clique "New Project"
3. Selecione o repositório `sukuna-api`
4. Clique "Deploy"
5. Pronto! Seu API está no ar 🎉

**Opção B: Via CLI**

```bash
npm i -g vercel
vercel
```

## API Endpoints

### POST `/api/notes/create`

Criar uma nova nota.

**Request:**

```json
{
  "title": "React - Memoization",
  "content": "Guia completo sobre performance optimization...",
  "category": "Desenvolvimento" // Opcional - será detectado automaticamente
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Nota criada com sucesso!",
  "data": {
    "filename": "React - Memoization.md",
    "category": "Desenvolvimento",
    "tags": ["desenvolvimento", "react"],
    "created_at": "2024-05-16T10:30:00Z",
    "path": "/Desenvolvimento/React - Memoization.md"
  }
}
```

**Erros:**

```json
{
  "success": false,
  "message": "Dados inválidos",
  "error": "Title é obrigatório..."
}
```

### GET `/api/health`

Health check.

**Response:**

```json
{
  "status": "online",
  "service": "Sukuna Note API",
  "version": "1.0.0",
  "timestamp": "2024-05-16T10:30:00Z",
  "uptime": 3600
}
```

## Categorias Automáticas

A API detecta automaticamente a categoria baseado nas keywords:

- **Desenvolvimento** → código, python, javascript, react, api, database, sql
- **Design** → design, ui, ux, figma, color, layout
- **Pessoal** → pessoal, vida, saúde, hobby, receita, viagem
- **Trabalho** → projeto, sprint, deadline, reunião, cliente
- **Aprendizado** → aprendi, learn, estudo, tutorial, artigo
- **Ideias** → ideia, startup, negócio, inovação

## Integração com Claude

### Em Claude Code

```python
import requests

response = requests.post(
    'https://seu-api.vercel.app/api/notes/create',
    json={
        'title': 'React - Hooks Avancados',
        'content': 'Guia sobre useContext, useReducer...'
    }
)

result = response.json()
print(result['message'])
```

### Em Claude.ai (Chat)

Use a API com um formulário web ou integração custom.

## Próximos Passos

### 1. Implementar OneDrive Integration

Adicionar autenticação Microsoft Graph e escrita real no OneDrive:

```typescript
// app/api/notes/create/route.ts

import { Client } = require("@microsoft/microsoft-graph-client");

async function createNoteOnOneDrive(path: string, content: string) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, "seu-token-aqui");
    }
  });

  await client
    .api(`/me/drive/root:${path}:/content`)
    .put(content);
}
```

### 2. Adicionar Autenticação

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization');

  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

### 3. Adicionar Logging

```typescript
// lib/logger.ts
export function logRequest(method: string, path: string, statusCode: number) {
  console.log(`[${new Date().toISOString()}] ${method} ${path} - ${statusCode}`);
}
```

## Estrutura do Projeto

```
sukuna-api/
├── app/
│   └── api/
│       ├── health/
│       │   └── route.ts          # Health check
│       └── notes/
│           └── create/
│               └── route.ts       # Criar nota
├── lib/
│   ├── constants.ts              # Categorias e constantes
│   ├── types.ts                  # Tipos TypeScript
│   └── utils.ts                  # Funções utilitárias
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Environment Variables

Quando implementar OneDrive, adicione ao `.env.local`:

```
NEXT_PUBLIC_API_URL=https://seu-api.vercel.app
MICROSOFT_CLIENT_ID=seu-client-id
MICROSOFT_CLIENT_SECRET=seu-client-secret
MICROSOFT_TENANT_ID=seu-tenant-id
```

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs no Vercel dashboard
2. Teste com curl
3. Verifique as variáveis de ambiente

## License

MIT
