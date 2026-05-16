import { CATEGORY_KEYWORDS, DEFAULT_CATEGORY } from './constants';
import type { Category } from './types';

/**
 * Detecta a categoria de uma nota baseado no conteúdo
 */
export function detectCategory(title: string, content: string, providedCategory?: string): Category | 'Misc' {
  // Se categoria foi fornecida, valide e use
  if (providedCategory && providedCategory in CATEGORY_KEYWORDS) {
    return providedCategory as Category;
  }

  // Detectar automaticamente
  const text = (title + ' ' + content).toLowerCase();
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.filter(k => text.includes(k)).length;
  }

  // Retorna categoria com mais matches
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'Misc';

  const detected = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return (detected as Category) || 'Misc';
}

/**
 * Extrai tags automáticas baseado no conteúdo
 */
export function extractTags(content: string, category: string): string[] {
  const keywords: Record<string, string[]> = {
    'dev': ['código', 'python', 'javascript', 'função', 'api', 'database', 'git', 'bug'],
    'design': ['design', 'ui', 'ux', 'color', 'layout', 'typography'],
    'pessoal': ['pessoal', 'vida', 'saúde', 'hobby', 'diversão'],
    'trabalho': ['projeto', 'sprint', 'deadline', 'reunião', 'apresentação'],
    'aprendizado': ['aprendi', 'learn', 'estudo', 'tutorial', 'artigo', 'conceito'],
  };

  const contentLower = content.toLowerCase();
  const foundTags = new Set<string>();

  // Adiciona categoria como tag
  if (category && category !== 'Misc') {
    foundTags.add(category.toLowerCase());
  }

  // Detecta tags adicionais
  for (const [tag, words] of Object.entries(keywords)) {
    if (words.some(word => contentLower.includes(word))) {
      foundTags.add(tag);
    }
  }

  return Array.from(foundTags).sort();
}

/**
 * Sanitiza nome de arquivo removendo caracteres inválidos
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Gera ID único para a nota
 */
export function generateNoteId(): string {
  return `sukuna-${Date.now()}`;
}

/**
 * Gera frontmatter YAML para a nota
 */
export interface FrontmatterOptions {
  title: string;
  category: string;
  tags: string[];
}

export function generateFrontmatter(options: FrontmatterOptions): string {
  const { title, category, tags } = options;
  const now = new Date().toISOString();
  const id = generateNoteId();

  const yaml = `---
title: ${title}
date: ${now}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: ${category}
id: ${id}
---`;

  return yaml;
}

/**
 * Gera conteúdo completo da nota com frontmatter
 */
export function generateNoteContent(
  title: string,
  content: string,
  category: string,
  tags: string[]
): string {
  const frontmatter = generateFrontmatter({ title, category, tags });
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');

  return `${frontmatter}

# ${title}

${content}

---
*Criada em: ${dateStr}*
*Pasta: ${category}/*
`;
}

/**
 * Valida dados de entrada
 */
export function validateNoteInput(title?: string, content?: string) {
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title é obrigatório e deve ser uma string não vazia');
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Content é obrigatório e deve ser uma string não vazia');
  }

  if (title && title.length > 500) {
    errors.push('Title não pode ter mais de 500 caracteres');
  }

  if (content && content.length > 50000) {
    errors.push('Content não pode ter mais de 50.000 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Formata path para OneDrive
 */
export function formatOneDrivePath(category: string, filename: string): string {
  const safePath = sanitizeFilename(category);
  const safeFilename = sanitizeFilename(filename) + '.md';
  return `/${safePath}/${safeFilename}`;
}
