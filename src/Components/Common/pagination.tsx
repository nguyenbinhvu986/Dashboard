type PaginationBarProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function getPages(totalPages: number, currentPage: number) {
  const pages: (number | string)[] = [];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage >= totalPages - 2) {
    pages.push(1);
    pages.push(2);
    pages.push("...");
    pages.push(totalPages - 2);
    pages.push(totalPages - 1);
    pages.push(totalPages);
    return pages;
  }

  let start = currentPage;
  if (start < 3) {
    start = 3;
  }

  pages.push(1);
  pages.push(start - 1);
  pages.push(start);
  pages.push(start + 1);
  pages.push("...");
  pages.push(totalPages - 1);
  pages.push(totalPages);
  return pages;
}

export function PaginationBar(props: PaginationBarProps) {
  const pages = getPages(props.totalPages, props.currentPage);

  return (
    <div className="pagination-bar">
      {props.totalPages === 1 ? null : (
        <>
          <button
            className="pagination-btn"
            disabled={props.currentPage === 1}
            onClick={() => props.onPageChange(props.currentPage - 1)}
          >
            {"<"}
          </button>

          {pages.map((page, index) => {
            if (page === "...") {
              return <span key={index}>...</span>;
            }
            return (
              <button
                key={index}
                className={
                  page === props.currentPage
                    ? "pagination-btn active"
                    : "pagination-btn"
                }
                onClick={() => props.onPageChange(page as number)}
              >
                {page}
              </button>
            );
          })}

          <button
            className="pagination-btn"
            disabled={props.currentPage === props.totalPages}
            onClick={() => props.onPageChange(props.currentPage + 1)}
          >
            {">"}
          </button>
        </>
      )}
    </div>
  );
}
