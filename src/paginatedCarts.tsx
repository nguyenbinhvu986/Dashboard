type PaginationBarProps = {
  pageNumbers: number[];
  onPageChange: (page: number) => void;
};

export function PaginationBar(props: PaginationBarProps) {
  return (
    <div className="pagination-bar">
      {props.pageNumbers.map((page) => {
        return (
          <button
            key={page}
            className="pagination-btn"
            onClick={() => props.onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
