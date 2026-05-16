// Categorias e keywords para detecção automática
export const CATEGORY_KEYWORDS = {
  'Desenvolvimento': [
    'código', 'python', 'javascript', 'react', 'api', 'database', 'sql', 'git',
    'função', 'classe', 'bug', 'refactor', 'framework', 'backend', 'frontend',
    'typescript', 'node', 'java', 'golang', 'rust', 'web', 'mobile', 'devops'
  ],
  'Design': [
    'design', 'ui', 'ux', 'figma', 'color', 'layout', 'typography', 'protótipo',
    'interface', 'usuario', 'visual', 'css', 'style', 'tema', 'icone', 'marca'
  ],
  'Pessoal': [
    'pessoal', 'vida', 'saúde', 'hobby', 'diversão', 'amigo', 'família', 'receita',
    'livro', 'filme', 'viagem', 'esporte', 'música', 'casa', 'reflexão'
  ],
  'Trabalho': [
    'projeto', 'sprint', 'deadline', 'reunião', 'apresentação', 'cliente',
    'stakeholder', 'empresa', 'equipe', 'business', 'meeting', 'brainstorm',
    'planejamento', 'objetivo', 'meta'
  ],
  'Aprendizado': [
    'aprendi', 'learn', 'estudo', 'tutorial', 'artigo', 'conceito', 'entender',
    'skill', 'conhecimento', 'dica', 'lesson', 'curso', 'guia', 'insight'
  ],
  'Ideias': [
    'ideia', 'startup', 'negócio', 'business', 'oportunidade', 'inovação',
    'produto', 'serviço', 'modelo', 'estratégia', 'visão', 'conceito'
  ]
} as const;

export type Category = keyof typeof CATEGORY_KEYWORDS;
export const CATEGORIES = Object.keys(CATEGORY_KEYWORDS) as Category[];

export const DEFAULT_CATEGORY = 'Misc' as const;
