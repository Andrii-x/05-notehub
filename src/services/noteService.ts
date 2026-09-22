import axios, { type AxiosResponse } from 'axios';

import type { Note, NoteTag } from '../types/note';

const API_BASE_URL = import.meta.env.VITE_NOTEHUB_API_URL || 'https://notehub-public.goit.study/api';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (token) {
  noteApi.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await noteApi.get('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  return response.data;
};

export const createNote = async (newNote: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await noteApi.post('/notes', newNote);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await noteApi.delete(`/notes/${noteId}`);

  return response.data;
};
