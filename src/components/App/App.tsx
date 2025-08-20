import { useEffect, useState } from 'react';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast from 'react-hot-toast';
import { RiQuillPenAiLine } from 'react-icons/ri';

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data && data.notes.length === 0) {
      toast.error('Notes not found');
    }
  }, [isSuccess, data]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={handlePageChange}
          />
        )}
        <button onClick={handleOpenModal} type="button" className={css.button}>
          Create note <RiQuillPenAiLine />
        </button>
      </header>

      {isSuccess && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {modalIsOpen && (
        <Modal closeModal={handleCloseModal}>
          <NoteForm closeModal={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
