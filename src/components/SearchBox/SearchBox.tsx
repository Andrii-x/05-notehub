import css from './SearchBox.module.css';

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      value={value}
      placeholder="Search notes"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBox;
