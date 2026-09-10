type PaginationBarProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function PaginationBar(props: PaginationBarProps) {
  const pageNumbers = Array.from(
    { length: props.totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="pagination-bar">
      {pageNumbers.map((page) => {
        return (
          <button
            key={page}
            className={
              page === props.currentPage
                ? "pagination-btn active"
                : "pagination-btn"
            }
            onClick={() => props.onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
