const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Snorlax2303';
const GITHUB_REPO = process.env.GITHUB_REPO || 'sukuna-vault';

async function githubRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response.json();
}

export async function createFileOnGitHub(filePath: string, content: string, commitMessage: string) {
  const encoded = Buffer.from(content, 'utf-8').toString('base64');

  const existing = await githubRequest(filePath + '?ref=main');
  const sha = existing.sha as string | undefined;

  const body: Record<string, string> = {
    message: commitMessage,
    content: encoded,
    branch: 'main',
  };

  if (sha) body.sha = sha;

  const result = await githubRequest(filePath, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  return {
    success: !result.errors,
    url: result.content?.html_url as string,
    sha: result.content?.sha as string,
  };
}

export interface GitHubNote {
  title: string;
  filename: string;
  category: string;
  path: string;
  content?: string;
  tags: string[];
  excerpt: string;
}

// Lista todas as notas do vault percorrendo as pastas de categorias
export async function listNotesFromGitHub(filterCategory?: string): Promise<GitHubNote[]> {
  const notes: GitHubNote[] = [];

  // Buscar pastas raiz do repositório
  const root = await githubRequest('?ref=main');
  if (!Array.isArray(root)) return notes;

  const folders = root.filter((item: { type: string; name: string }) =>
    item.type === 'dir' && item.name !== '.obsidian'
  );

  for (const folder of folders) {
    if (filterCategory && folder.name !== filterCategory) continue;

    const files = await githubRequest(`${folder.name}?ref=main`);
    if (!Array.isArray(files)) continue;

    for (const file of files) {
      if (!file.name.endsWith('.md')) continue;

      const title = file.name.replace('.md', '');
      notes.push({
        title,
        filename: file.name,
        category: folder.name,
        path: `/${folder.name}/${file.name}`,
        tags: [folder.name.toLowerCase()],
        excerpt: '',
      });
    }
  }

  return notes;
}

// Lê o conteúdo de uma nota específica
export async function readNoteFromGitHub(category: string, filename: string): Promise<string | null> {
  const result = await githubRequest(`${category}/${filename}?ref=main`);
  if (!result.content) return null;
  return Buffer.from(result.content, 'base64').toString('utf-8');
}

// Busca notas pelo conteúdo usando GitHub Search API
export async function searchNotesOnGitHub(query: string, category?: string): Promise<GitHubNote[]> {
  let searchQuery = `${query} repo:${GITHUB_OWNER}/${GITHUB_REPO} extension:md`;
  if (category) searchQuery += ` path:${category}`;

  const response = await fetch(
    `https://api.github.com/search/code?q=${encodeURIComponent(searchQuery)}&per_page=20`,
    {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );

  const data = await response.json();
  if (!data.items) return [];

  return data.items.map((item: { name: string; path: string }) => {
    const parts = item.path.split('/');
    const cat = parts.length > 1 ? parts[0] : 'Misc';
    const title = item.name.replace('.md', '');
    return {
      title,
      filename: item.name,
      category: cat,
      path: `/${item.path}`,
      tags: [cat.toLowerCase()],
      excerpt: `Nota encontrada em ${cat}`,
    };
  });
}
