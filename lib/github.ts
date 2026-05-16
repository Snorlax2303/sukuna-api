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

  // Verifica se arquivo já existe (para evitar duplicidade)
  const existing = await githubRequest(filePath);
  const sha = existing.sha as string | undefined;

  const body: Record<string, string> = {
    message: commitMessage,
    content: encoded,
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
