import type { Note, NewNoteData, Tag } from '@/types/note';
import { nextServer } from './api';
import { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CheckSessionRequest {
  success: boolean;
}

export interface UpdateUserRequest {
  username?: string;
}

export const fetchNotes = async (
  search: string,
  page: number,
  categoryId?: Tag
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      search: search,
      page: page,
      perPage: 12,
      tag: categoryId,
    },
    headers: {},
  });

  return response.data;
};

export const createNote = async (newNote: NewNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>('/notes', newNote, {
    headers: {},
  });

  return response.data;
};

export const deleteNote = async (noteId: Note['id']): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`, {
    headers: {},
  });

  return response.data;
};

export const fetchNoteById = async (noteId: Note['id']): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${noteId}`, {
    headers: {},
  });

  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<User>('/users/me', payload);
  return res.data;
};
