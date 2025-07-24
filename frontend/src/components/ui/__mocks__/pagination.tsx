// Mock for pagination.tsx

import * as React from 'react';

export function Pagination(props: React.ComponentProps<'nav'>) {
  return <nav data-testid="mock-pagination" {...props} />;
}

export function PaginationContent(props: React.ComponentProps<'ul'>) {
  return <ul data-testid="mock-pagination-content" {...props} />;
}

export function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-testid="mock-pagination-item" {...props} />;
}

export function PaginationLink(props: React.ComponentProps<'a'>) {
  return <a data-testid="mock-pagination-link" {...props} />;
}

export function PaginationFirst(props: React.ComponentProps<'a'>) {
  return <a data-testid="mock-pagination-first" {...props} />;
}

export function PaginationPrevious(props: React.ComponentProps<'a'>) {
  return <a data-testid="mock-pagination-previous" {...props} />;
}

export function PaginationNext(props: React.ComponentProps<'a'>) {
  return <a data-testid="mock-pagination-next" {...props} />;
}

export function PaginationLast(props: React.ComponentProps<'a'>) {
  return <a data-testid="mock-pagination-last" {...props} />;
}

export function PaginationEllipsis(props: React.ComponentProps<'span'>) {
  return <span data-testid="mock-pagination-ellipsis" {...props} />;
}
