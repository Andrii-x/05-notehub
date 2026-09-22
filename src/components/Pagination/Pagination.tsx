import ReactPaginate from 'react-paginate';

import css from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      forcePage={page - 1}
      pageCount={pageCount}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={css.container}
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      previousClassName={css.previous}
      nextClassName={css.next}
      disabledClassName={css.disabled}
      breakClassName={css.break}
      breakLabel="..."
      previousLabel="←"
      nextLabel="→"
    />
  );
}

export default Pagination;
