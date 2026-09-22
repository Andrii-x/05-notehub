import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';

import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import type { NoteTag } from '../../types/note';
import Modal from '../Modal/Modal';
import NoteForm, { type NoteFormValues } from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const ITEMS_PER_PAGE = 12;

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value.trim());
  }, 300);

  useEffect(() => {
    setPage(1);
  }, [searchInput]);

  const notesQuery = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: ITEMS_PER_PAGE,
        search: searchQuery || undefined,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const totalPages = notesQuery.data?.totalPages ?? 1;
  const notes = notesQuery.data?.notes ?? [];

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleCreateNote = async (values: NoteFormValues) => {
    await createNoteMutation.mutateAsync({
      title: values.title,
      content: values.content,
      tag: values.tag as NoteTag,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNoteMutation.mutateAsync(noteId);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination page={page} pageCount={totalPages} onPageChange={setPage} />
        )}

        <button type="button" className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notesQuery.isLoading && <p className={css.status}>Loading notes...</p>}
      {notesQuery.isError && (
        <p className={css.status}>Unable to load notes. Please try again later.</p>
      )}

      {!notesQuery.isLoading && !notesQuery.isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {!notesQuery.isLoading && !notesQuery.isError && notes.length === 0 && (
        <p className={css.empty}>No notes found for your search.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onSubmit={handleCreateNote} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default App;
