import { CATEGORY_KEYWORDS } from './constants';

export type Category = keyof typeof CATEGORY_KEYWORDS;

export interface CreateNoteRequest {
  title: string;
  content: string;
  category?: string;
  filename?: string;
}

export interface CreateNoteResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    category: string;
    tags: string[];
    created_at: string;
    path: string;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface NoteMetadata {
  title: string;
  date: string;
  tags: string[];
  category: string;
  id: string;
}
