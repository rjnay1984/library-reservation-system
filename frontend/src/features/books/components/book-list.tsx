import { Params } from '@/features/shared/schemas/page-params-schema';
import { getAllBooks } from '../actions';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationFirst,
  PaginationPrevious,
  PaginationLast,
} from '@/components/ui/pagination';
import BookCard from './book-card';

export default async function BookList({ params }: { params: Params }) {
  const { page, perPage } = params;
  const {
    page: currentPage,
    perPage: pageSize,
    totalResults,
    totalPages,
    data: books,
  } = await getAllBooks(page, perPage);

  return (
    <>
      <h1>Book List</h1>
      <h3>Total Books: {totalResults}</h3>
      {/* Book list content will go here */}
      {books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full py-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationFirst href={`/?page=1&perPage=${pageSize}`} />
              </PaginationItem>
            )}
            <PaginationItem>
              {currentPage > 1 && (
                <PaginationPrevious
                  href={`/?page=${currentPage - 1}&perPage=${pageSize}`}
                />
              )}
            </PaginationItem>
            {/* Show ellipsis if there are pages before the previous page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Show previous page if it exists */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=${currentPage - 1}&perPage=${pageSize}`}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Show current page */}
            <PaginationItem>
              <PaginationLink
                href={`/?page=${currentPage}&perPage=${pageSize}`}
                isActive={true}
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Show next page if it exists */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={`/?page=${currentPage + 1}&perPage=${pageSize}`}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Show ellipsis if there are pages after the next page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              {currentPage < totalPages && (
                <PaginationNext
                  href={`/?page=${currentPage + 1}&perPage=${pageSize}`}
                />
              )}
            </PaginationItem>
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLast
                  href={`/?page=${totalPages}&perPage=${pageSize}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
