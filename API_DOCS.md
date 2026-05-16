# Sukuna Note API - Documentação Completa

API profissional para gerenciar notas no Obsidian Sukuna.

**Base URL**: `https://seu-api.vercel.app`

---

## 📋 Índice

1. [Health Check](#health-check)
2. [Criar Nota](#criar-nota)
3. [Listar Notas](#listar-notas)
4. [Buscar Notas](#buscar-notas)
5. [Categorias](#categorias)
6. [Tags](#tags)
7. [Códigos de Status](#códigos-de-status)

---

## Health Check

### GET `/api/health`

Verifica se a API está online.

**Request:**
```bash
curl https://seu-api.vercel.app/api/health
```

**Response (200):**
```json
{
  "status": "online",
  "service": "Sukuna Note API",
  "version": "1.0.0",
  "timestamp": "2024-05-16T10:30:00Z",
  "uptime": 3600
}
```

---

## Criar Nota

### POST `/api/notes/create`

Cria uma nova nota no Obsidian.

**Request:**
```bash
curl -X POST https://seu-api.vercel.app/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React - Memoization",
    "content": "Guia completo sobre useMemo e useCallback...",
    "category": "Desenvolvimento"
  }'
```

**Body Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `title` | string | ✅ | Título da nota (máx 500 caracteres) |
| `content` | string | ✅ | Conteúdo da nota (máx 50.000 caracteres) |
| `category` | string | ❌ | Categoria (será detectada automaticamente se não informada) |
| `filename` | string | ❌ | Nome customizado do arquivo |

**Categorias Disponíveis:**
- `Desenvolvimento` - código, programação
- `Design` - UI/UX, design visual
- `Pessoal` - hobby, receitas, viagens
- `Trabalho` - projetos, reuniões
- `Aprendizado` - tutoriais, conceitos
- `Ideias` - startups, negócios
- `Misc` - tudo mais

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

**Errors:**

400 - Dados inválidos:
```json
{
  "success": false,
  "message": "Dados inválidos",
  "error": "Title é obrigatório e deve ser uma string não vazia"
}
```

---

## Listar Notas

### GET `/api/notes`

Lista todas as notas com filtros opcionais.

**Request:**
```bash
# Listar todas
curl https://seu-api.vercel.app/api/notes

# Filtrar por categoria
curl https://seu-api.vercel.app/api/notes?category=Desenvolvimento

# Filtrar por tag
curl https://seu-api.vercel.app/api/notes?tag=react

# Paginação
curl https://seu-api.vercel.app/api/notes?limit=20&offset=0
```

**Query Parameters:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `category` | string | - | Filtrar por categoria |
| `tag` | string | - | Filtrar por tag |
| `limit` | number | 100 | Quantidade máxima de resultados |
| `offset` | number | 0 | Página (para paginação) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "sukuna-1",
        "filename": "React - Memoization.md",
        "title": "React - Memoization",
        "category": "Desenvolvimento",
        "tags": ["desenvolvimento", "react"],
        "created_at": "2024-05-16T10:30:00Z",
        "updated_at": "2024-05-16T10:30:00Z",
        "path": "/Desenvolvimento/React - Memoization.md"
      }
    ],
    "total": 1,
    "limit": 100,
    "offset": 0
  }
}
```

---

## Buscar Notas

### GET `/api/search`

Busca notas por keywords com busca inteligente.

**Request:**
```bash
# Busca simples
curl https://seu-api.vercel.app/api/search?q=react

# Com filtros
curl "https://seu-api.vercel.app/api/search?q=hooks&category=Desenvolvimento&tags=react,javascript"

# Com limite
curl https://seu-api.vercel.app/api/search?q=python&limit=10
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `q` | string | ✅ | Keywords de busca (mín 2 caracteres) |
| `category` | string | ❌ | Filtrar por categoria |
| `tags` | string | ❌ | Filtrar por tags (comma-separated) |
| `limit` | number | ❌ | Quantidade máxima (padrão: 50) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "query": "react",
    "results": [
      {
        "id": "sukuna-1",
        "filename": "React - Memoization.md",
        "title": "React - Memoization",
        "category": "Desenvolvimento",
        "tags": ["react", "desenvolvimento"],
        "excerpt": "Guia completo sobre useMemo e useCallback para otimizar...",
        "relevance": 0.95,
        "path": "/Desenvolvimento/React - Memoization.md"
      }
    ],
    "total": 1,
    "filters": {
      "category": "Desenvolvimento",
      "tags": ["react"]
    }
  }
}
```

**Errors:**

400 - Query muito curto:
```json
{
  "success": false,
  "error": "Query deve ter pelo menos 2 caracteres"
}
```

---

## Categorias

### GET `/api/categories`

Lista todas as categorias disponíveis.

**Request:**
```bash
curl https://seu-api.vercel.app/api/categories
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Desenvolvimento",
        "count": 12,
        "color": "#3B82F6"
      },
      {
        "name": "Pessoal",
        "count": 8,
        "color": "#EC4899"
      },
      {
        "name": "Trabalho",
        "count": 5,
        "color": "#10B981"
      }
    ],
    "total": 6
  }
}
```

---

## Tags

### GET `/api/tags`

Lista todas as tags encontradas nas notas.

**Request:**
```bash
curl https://seu-api.vercel.app/api/tags
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "name": "react",
        "count": 5,
        "color": "#61DAFB"
      },
      {
        "name": "python",
        "count": 3,
        "color": "#3776AB"
      },
      {
        "name": "desenvolvimento",
        "count": 12,
        "color": "#FF6B6B"
      }
    ],
    "total": 15
  }
}
```

---

## Códigos de Status

| Código | Significado | Descrição |
|--------|-------------|-----------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Nota criada com sucesso |
| **400** | Bad Request | Dados inválidos ou ausentes |
| **401** | Unauthorized | Autenticação necessária |
| **404** | Not Found | Recurso não encontrado |
| **500** | Server Error | Erro interno do servidor |

---

## Exemplo de Uso Completo

### Criar nota e depois buscar

```bash
# 1. Criar nota
curl -X POST https://seu-api.vercel.app/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python - Async/Await",
    "content": "Guia sobre async/await em Python..."
  }'

# 2. Listar todas
curl https://seu-api.vercel.app/api/notes

# 3. Buscar por keyword
curl https://seu-api.vercel.app/api/search?q=python

# 4. Listar categorias
curl https://seu-api.vercel.app/api/categories

# 5. Listar tags
curl https://seu-api.vercel.app/api/tags
```

---

## Integração com Claude

### Python (Claude Code)

```python
import requests

api_url = "https://seu-api.vercel.app"

# Criar nota
response = requests.post(
    f"{api_url}/api/notes/create",
    json={
        "title": "React - Hooks",
        "content": "Guia sobre hooks..."
    }
)

result = response.json()
if result['success']:
    print(f"Nota criada: {result['data']['filename']}")

# Buscar notas
search_response = requests.get(
    f"{api_url}/api/search",
    params={"q": "react"}
)

search_result = search_response.json()
for note in search_result['data']['results']:
    print(f"- {note['title']}")
```

### JavaScript

```javascript
const API_URL = "https://seu-api.vercel.app";

// Criar nota
async function createNote(title, content) {
  const response = await fetch(`${API_URL}/api/notes/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  
  return await response.json();
}

// Buscar notas
async function searchNotes(query) {
  const response = await fetch(
    `${API_URL}/api/search?q=${encodeURIComponent(query)}`
  );
  
  return await response.json();
}
```

---

## Rate Limits

Atualmente não há rate limits. Se implementar, será:
- **100 requisições por minuto** por IP
- **1000 requisições por hora** por IP

---

## Melhorias Futuras

- [ ] Autenticação (JWT/OAuth)
- [ ] Rate limiting
- [ ] Cache de buscas
- [ ] Integração completa com OneDrive
- [ ] Versioning de notas
- [ ] Exportação em múltiplos formatos
- [ ] Webhooks para eventos
- [ ] API GraphQL
