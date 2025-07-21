import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

vi.mock('@/components/ui/button', () => ({
  Button: () => <button data-testid="test-button">button</button>,
  buttonVariants: vi.fn(() => 'default'),
}));

describe('Pagination', () => {
  it('renders correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>Pagination Item</PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'pagination',
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'data-slot',
      'pagination-content',
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'data-slot',
      'pagination-link',
    );
  });

  it('renders the PaginationFirst and PaginationLast components', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(
      screen.getByRole('link', { name: 'Go to first page' }),
    ).toHaveAttribute('data-slot', 'pagination-link');
    expect(
      screen.getByRole('link', { name: 'Go to last page' }),
    ).toHaveAttribute('data-slot', 'pagination-link');
  });

  it('renders the PaginationPrevious and PaginationNext components', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(
      screen.getByRole('link', { name: 'Go to previous page' }),
    ).toHaveAttribute('data-slot', 'pagination-link');
    expect(
      screen.getByRole('link', { name: 'Go to next page' }),
    ).toHaveAttribute('data-slot', 'pagination-link');
  });

  it('renders the PaginationEllipsis component', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByText('More pages').parentElement).toHaveAttribute(
      'data-slot',
      'pagination-ellipsis',
    );
  });
});
