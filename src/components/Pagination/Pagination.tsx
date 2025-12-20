import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface Props {
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
