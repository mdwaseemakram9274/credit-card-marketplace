/**
 * Pagination Utilities
 * Helper functions for implementing cursor-based and offset-based pagination
 */

export interface PaginationParams {
  page?: number; // Current page (1-indexed)
  limit?: number; // Items per page
  offset?: number; // Alternative to page, for offset-based pagination
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculate pagination metadata from total count
 */
export function calculatePaginationMeta(params: {
  page: number;
  pageSize: number;
  total: number;
}): PaginationMeta {
  const { page, pageSize, total } = params;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return {
    currentPage: page,
    pageSize,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex,
    endIndex,
  };
}

/**
 * Convert page number to offset for database queries
 */
export function pageToOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Convert offset to page number
 */
export function offsetToPage(offset: number, pageSize: number): number {
  return Math.floor(offset / pageSize) + 1;
}

/**
 * Validate and normalize pagination parameters
 */
export function normalizePaginationParams(params: PaginationParams): {
  page: number;
  pageSize: number;
  offset: number;
} {
  let page = 1;
  let pageSize = 20;
  let offset = 0;

  if (params.page) {
    page = Math.max(1, Math.floor(params.page));
  } else if (params.offset !== undefined) {
    offset = Math.max(0, Math.floor(params.offset));
    page = offsetToPage(offset, pageSize);
  }

  if (params.limit) {
    pageSize = Math.max(1, Math.min(100, Math.floor(params.limit))); // Max 100 items per page
  }

  if (!params.offset && !params.page) {
    offset = (page - 1) * pageSize;
  } else if (params.page) {
    offset = (page - 1) * pageSize;
  }

  return { page, pageSize, offset };
}

/**
 * Generate pagination URLs for links
 */
export function generatePaginationUrls(
  baseUrl: string,
  params: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    query?: Record<string, any>;
  }
) {
  const { currentPage, totalPages, query = {} } = params;

  const buildUrl = (page: number) => {
    const queryParams = new URLSearchParams(query);
    queryParams.set('page', String(page));
    return `${baseUrl}?${queryParams.toString()}`;
  };

  return {
    first: buildUrl(1),
    last: buildUrl(totalPages),
    next: currentPage < totalPages ? buildUrl(currentPage + 1) : null,
    previous: currentPage > 1 ? buildUrl(currentPage - 1) : null,
    current: buildUrl(currentPage),
  };
}

/**
 * Generate array of page numbers for pagination controls
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | '...')[] {
  const pages: (number | '...')[] = [];

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than maxVisible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Calculate the range of pages to show around current page
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Add first page if not in range
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  return pages;
}
