import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import styles from './SearchBar.module.css';

export default function SearchBar({ onHandleSubmit }) {
  const [query, setQuery] = useState('');

  const handleChangeQuery = event => {
    setQuery(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (query.trim() === '') {
      toast.info('Please enter your query!');
      return;
    }

    onHandleSubmit(query);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={query}
        autoComplete="off"
        autoFocus
        placeholder="Enter movie name..."
        onChange={handleChangeQuery}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
};
