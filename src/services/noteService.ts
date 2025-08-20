import type { NewNote, Note } from '../types/note';
import axios from 'axios';

const BEARER_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

interface FetchedNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string
): Promise<FetchedNotesResponse> => {
  const { data } = await axios.get<FetchedNotesResponse>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: { perPage: 12, page, search },
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    }
  );
  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',
    newNote,
    { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
  );
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
  );
  return data;
};
