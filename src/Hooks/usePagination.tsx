import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);
  return {
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
    totalPages: totalPages,
    paginatedItems: paginatedItems,
  };
}
