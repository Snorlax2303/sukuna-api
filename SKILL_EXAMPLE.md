# Como Usar a API com Skills de IA

Guia para criar skills em qualquer plataforma de IA que use a API Sukuna.

---

## Claude Code / Claude.ai

### Skill para Criar Notas

Quando o usuário menciona:
- "Cria uma nota no Sukuna sobre..."
- "Salva no Sukuna..."
- "Adiciona uma nota..."

A skill faz:

```python
import requests

def create_note_in_sukuna(title: str, content: str, category: str = None):
    """
    Cria uma nota no Sukuna Obsidian
    """
    api_url = "https://seu-api.vercel.app/api/notes/create"
    
    payload = {
        "title": title,
        "content": content
    }
    
    if category:
        payload["category"] = category
    
    response = requests.post(api_url, json=payload)
    result = response.json()
    
    if result['success']:
        return f"✅ Nota criada com sucesso!\n📁 Pasta: {result['data']['category']}\n📄 Arquivo: {result['data']['filename']}"
    else:
        return f"❌ Erro: {result['error']}"

# Usar
print(create_note_in_sukuna(
    title="React - Custom Hooks",
    content="Guia completo sobre como criar custom hooks em React..."
))
```

### Skill para Buscar Notas

Quando o usuário menciona:
- "Busca notas sobre..."
- "Encontra uma nota que fala sobre..."
- "Procura minhas notas de..."

A skill faz:

```python
import requests

def search_notes_in_sukuna(query: str, category: str = None, limit: int = 10):
    """
    Busca notas no Sukuna
    """
    api_url = "https://seu-api.vercel.app/api/search"
    
    params = {
        "q": query,
        "limit": limit
    }
    
    if category:
        params["category"] = category
    
    response = requests.get(api_url, params=params)
    result = response.json()
    
    if result['success']:
        notes = result['data']['results']
        if not notes:
            return "Nenhuma nota encontrada com esse termo"
        
        output = f"📚 Encontradas {len(notes)} notas:\n\n"
        for note in notes:
            output += f"- **{note['title']}** ({note['category']})\n"
            output += f"  📌 Tags: {', '.join(note['tags'])}\n"
            output += f"  💬 {note['excerpt']}\n\n"
        
        return output
    else:
        return f"❌ Erro: {result['error']}"

# Usar
print(search_notes_in_sukuna("react hooks", limit=5))
```

### Skill para Listar Notas por Categoria

```python
import requests

def list_notes_by_category(category: str = None):
    """
    Lista notas, opcionalmente filtradas por categoria
    """
    api_url = "https://seu-api.vercel.app/api/notes"
    
    params = {}
    if category:
        params["category"] = category
    
    response = requests.get(api_url, params=params)
    result = response.json()
    
    if result['success']:
        notes = result['data']['notes']
        
        if not notes:
            return "Nenhuma nota encontrada"
        
        output = f"📋 {result['data']['total']} notas encontradas:\n\n"
        
        # Agrupar por categoria
        by_category = {}
        for note in notes:
            cat = note['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(note)
        
        for cat, cat_notes in sorted(by_category.items()):
            output += f"\n**{cat}** ({len(cat_notes)})\n"
            for note in cat_notes:
                output += f"  - {note['title']}\n"
        
        return output
    else:
        return f"❌ Erro: {result['error']}"

# Usar
print(list_notes_by_category("Desenvolvimento"))
```

### Skill para Mostrar Categorias

```python
import requests

def show_categories():
    """
    Mostra todas as categorias e quantidade de notas em cada uma
    """
    api_url = "https://seu-api.vercel.app/api/categories"
    
    response = requests.get(api_url)
    result = response.json()
    
    if result['success']:
        categories = result['data']['categories']
        
        output = "📂 **Suas Categorias:**\n\n"
        for cat in categories:
            output += f"- **{cat['name']}** ({cat['count']} notas)\n"
        
        return output
    else:
        return f"❌ Erro: {result['error']}"

# Usar
print(show_categories())
```

---

## Estrutura de uma Skill Completa

```python
"""
Skill: Sukuna Obsidian Manager

Funcionalidades:
- Criar notas
- Buscar notas
- Listar notas
- Ver categorias
- Ver tags
"""

import requests
from typing import Optional, List

class SukunaAPI:
    def __init__(self, base_url: str = "https://seu-api.vercel.app"):
        self.base_url = base_url
    
    def create_note(self, title: str, content: str, category: Optional[str] = None) -> dict:
        """Cria uma nota"""
        url = f"{self.base_url}/api/notes/create"
        payload = {"title": title, "content": content}
        if category:
            payload["category"] = category
        
        response = requests.post(url, json=payload)
        return response.json()
    
    def search_notes(self, query: str, category: Optional[str] = None, limit: int = 10) -> dict:
        """Busca notas"""
        url = f"{self.base_url}/api/search"
        params = {"q": query, "limit": limit}
        if category:
            params["category"] = category
        
        response = requests.get(url, params=params)
        return response.json()
    
    def list_notes(self, category: Optional[str] = None, tag: Optional[str] = None, limit: int = 100) -> dict:
        """Lista notas"""
        url = f"{self.base_url}/api/notes"
        params = {"limit": limit}
        if category:
            params["category"] = category
        if tag:
            params["tag"] = tag
        
        response = requests.get(url, params=params)
        return response.json()
    
    def get_categories(self) -> dict:
        """Retorna todas as categorias"""
        url = f"{self.base_url}/api/categories"
        response = requests.get(url)
        return response.json()
    
    def get_tags(self) -> dict:
        """Retorna todas as tags"""
        url = f"{self.base_url}/api/tags"
        response = requests.get(url)
        return response.json()

# Usar a classe
api = SukunaAPI()

# Criar nota
api.create_note(
    title="Python - Async",
    content="Guia sobre async/await..."
)

# Buscar
api.search_notes("async", category="Desenvolvimento")

# Listar
api.list_notes(category="Pessoal")

# Categorias
api.get_categories()
```

---

## ChatGPT Custom Action

Se usar ChatGPT com Custom Actions/Plugins:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Sukuna Note API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://seu-api.vercel.app"
    }
  ],
  "paths": {
    "/api/notes/create": {
      "post": {
        "operationId": "createNote",
        "summary": "Cria uma nota no Obsidian",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": { "type": "string" },
                  "content": { "type": "string" },
                  "category": { "type": "string" }
                },
                "required": ["title", "content"]
              }
            }
          }
        }
      }
    },
    "/api/search": {
      "get": {
        "operationId": "searchNotes",
        "summary": "Busca notas",
        "parameters": [
          {
            "name": "q",
            "in": "query",
            "required": true,
            "schema": { "type": "string" }
          }
        ]
      }
    }
  }
}
```

---

## Exemplo: Skill Completa de Uso

```python
"""
SKILL: Sukuna Obsidian - Gerenciador Completo de Notas

Quando o usuário menciona:
- "cria uma nota"
- "busca notas sobre"
- "mostra minhas categorias"
- "salva no Sukuna"
- Qualquer coisa relacionada a notas/Obsidian
"""

import requests
from datetime import datetime

class SukunaSkill:
    API_URL = "https://seu-api.vercel.app"
    
    def process_request(self, user_input: str) -> str:
        """
        Processa requisição do usuário
        """
        lower = user_input.lower()
        
        # Detectar intenção
        if any(x in lower for x in ["cria", "salva", "adiciona", "escreve"]):
            return self._handle_create(user_input)
        
        elif any(x in lower for x in ["busca", "procura", "encontra"]):
            return self._handle_search(user_input)
        
        elif any(x in lower for x in ["mostra", "lista", "quais são", "categorias"]):
            return self._handle_categories()
        
        elif any(x in lower for x in ["tags", "etiquetas"]):
            return self._handle_tags()
        
        else:
            return self._handle_list()
    
    def _handle_create(self, input_str: str) -> str:
        """Criar nota"""
        # Aqui você extrairia title e content do input
        # Exemplo simplificado:
        
        title = "Nova Nota"
        content = input_str.replace("cria uma nota", "").strip()
        
        response = requests.post(
            f"{self.API_URL}/api/notes/create",
            json={"title": title, "content": content}
        )
        
        result = response.json()
        if result['success']:
            data = result['data']
            return f"""✅ **Nota criada com sucesso!**
            
📁 **Categoria:** {data['category']}
📄 **Arquivo:** {data['filename']}
🏷️ **Tags:** {', '.join(data['tags'])}
⏰ **Criada em:** {data['created_at']}"""
        else:
            return f"❌ Erro: {result.get('error', 'Desconhecido')}"
    
    def _handle_search(self, query: str) -> str:
        """Buscar notas"""
        query = query.replace("busca", "").replace("procura", "").strip()
        
        response = requests.get(
            f"{self.API_URL}/api/search",
            params={"q": query, "limit": 5}
        )
        
        result = response.json()
        if result['success'] and result['data']['results']:
            notes = result['data']['results']
            output = f"📚 **Encontradas {len(notes)} notas para '{query}':**\n\n"
            
            for note in notes:
                output += f"📖 **{note['title']}**\n"
                output += f"   📁 {note['category']} | 🏷️ {', '.join(note['tags'])}\n"
                output += f"   💬 {note['excerpt'][:100]}...\n\n"
            
            return output
        else:
            return f"❌ Nenhuma nota encontrada para '{query}'"
    
    def _handle_categories(self) -> str:
        """Mostrar categorias"""
        response = requests.get(f"{self.API_URL}/api/categories")
        result = response.json()
        
        if result['success']:
            cats = result['data']['categories']
            output = "📂 **Suas Categorias:**\n\n"
            
            for cat in cats:
                output += f"• **{cat['name']}** - {cat['count']} notas\n"
            
            return output
        return "❌ Erro ao carregar categorias"
    
    def _handle_tags(self) -> str:
        """Mostrar tags"""
        response = requests.get(f"{self.API_URL}/api/tags")
        result = response.json()
        
        if result['success']:
            tags = result['data']['tags'][:10]  # Top 10
            output = "🏷️ **Tags Mais Usadas:**\n\n"
            
            for tag in tags:
                output += f"• **{tag['name']}** ({tag['count']} notas)\n"
            
            return output
        return "❌ Erro ao carregar tags"
    
    def _handle_list(self) -> str:
        """Listar todas as notas"""
        response = requests.get(f"{self.API_URL}/api/notes?limit=10")
        result = response.json()
        
        if result['success']:
            notes = result['data']['notes']
            output = f"📋 **Você tem {result['data']['total']} notas:**\n\n"
            
            for note in notes[:10]:
                output += f"- {note['title']} ({note['category']})\n"
            
            if result['data']['total'] > 10:
                output += f"\n... e mais {result['data']['total'] - 10} notas"
            
            return output
        return "❌ Erro ao listar notas"

# Usar
skill = SukunaSkill()
print(skill.process_request("cria uma nota sobre React"))
```

---

## Teste Sua API

Teste todos os endpoints em: https://seu-api.vercel.app/api/health

Depois use os exemplos acima para integrar com sua IA favorita!
