import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePageNumbers } from '../../../../lib/utils/pagination';
import styles from './PaginationControls.module.css';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  showSummary?: boolean;
}

/**
 * Reusable pagination component with page numbers and navigation
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  className,
  showSummary = true,
}) => {
  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  const pageNumbers = generatePageNumbers(currentPage, totalPages, 7);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {showSummary && (
        <div className={styles.summary}>
          Showing {startIndex} to {endIndex} of {totalItems} results
        </div>
      )}

      <nav className={styles.pagination} aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.navButton}
          aria-label="Previous page"
          title="Go to previous page"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className={styles.pageNumbers}>
          {pageNumbers.map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            const isCurrentPage = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum as number)}
                className={`${styles.pageNumber} ${isCurrentPage ? styles.current : ''}`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.navButton}
          aria-label="Next page"
          title="Go to next page"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </nav>

      {/* Page Size Info */}
      <div className={styles.info}>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default PaginationControls;
