# Deploy no Vercel - Instruções Rápidas

## Opção 1: Deploy Imediato (Recomendado)

### 1. Criar conta no GitHub

Se não tiver:
- Acesse https://github.com/signup
- Crie uma conta gratuita

### 2. Criar repositório

```bash
cd sukuna-api

# Inicializar git
git init
git add .
git commit -m "Initial commit: Sukuna Note API"

# Criar repositório no GitHub (manualmente ou via CLI)
# https://github.com/new

git remote add origin https://github.com/SEU-USUARIO/sukuna-api.git
git branch -M main
git push -u origin main
```

### 3. Deploy no Vercel

1. Acesse https://vercel.com/new
2. Clique "Continue with GitHub"
3. Autorize Vercel
4. Procure por "sukuna-api"
5. Clique "Import"
6. Clique "Deploy"

**Pronto! Sua API está no ar em ~2 minutos! 🎉**

URL será: `https://sukuna-api.vercel.app`

---

## Opção 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# (siga as instruções)
```

---

## Verificar Deploy

### 1. Testar Health Check

```bash
curl https://sua-api-vercel.vercel.app/api/health
```

Esperado:
```json
{
  "status": "online",
  "service": "Sukuna Note API",
  ...
}
```

### 2. Testar Criação de Nota

```bash
curl -X POST https://sua-api-vercel.vercel.app/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "content": "Conteúdo teste"
  }'
```

Esperado:
```json
{
  "success": true,
  "message": "Nota criada com sucesso!",
  "data": { ... }
}
```

---

## URLs Importantes

- **API URL**: `https://seu-projeto.vercel.app`
- **Health Check**: `https://seu-projeto.vercel.app/api/health`
- **Create Note**: `https://seu-projeto.vercel.app/api/notes/create`

**Use estas URLs em:**
- n8n webhooks
- Claude Code scripts
- Formulários web
- Qualquer integração

---

## Próximos Passos

### 1. Integrar com Claude Code

```python
import requests

response = requests.post(
    'https://seu-projeto.vercel.app/api/notes/create',
    json={
        'title': 'Sua nota',
        'content': 'Conteúdo aqui'
    }
)

print(response.json())
```

### 2. Integrar com Remotely Save

Configure um webhook no Remotely Save que envia para sua API quando sincronizar.

### 3. Adicionar OneDrive

Implemente a autenticação Microsoft Graph para escrever real no OneDrive.

---

## Troubleshooting

### Erro 404 na API

- Verifique que a URL está correta
- Aguarde alguns segundos para o deploy terminar
- Limpe cache do browser (Ctrl+Shift+Delete)

### Erro 500

- Abra Vercel Dashboard
- Vá para Deployments
- Clique no último deployment
- Vá para "Logs" para ver o erro

### Função não aparece

- Verifique que o arquivo está em `app/api/`
- Nomeie como `route.ts`
- Redeploy

---

## Dicas de Produção

### 1. Adicionar Logs

Vercel captura logs automaticamente. Use `console.log()`:

```typescript
console.log('Nota criada:', { title, category });
```

### 2. Monitorar Performance

Acesse Vercel Dashboard → Functions → Veja latência e execuções

### 3. Custom Domain (opcional)

No Vercel:
1. Settings → Domains
2. Adicione seu domínio
3. Configure DNS

---

## Depois do Deploy

Sua API está no ar! Agora:

1. ✅ Use em Claude Code
2. ✅ Integre com n8n (webhook → sua API)
3. ✅ Crie formulário web
4. ✅ Conecte ao OneDrive (próximo passo)

---

**Pronto para enviar para o ar? Siga os passos acima! 🚀**
