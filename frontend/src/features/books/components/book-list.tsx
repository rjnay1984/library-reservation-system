import { Params } from '@/features/shared/schemas/page-params-schema';
import { getAllBooks } from '../actions';

export default async function BookList({ params }: { params: Params }) {
  const { page, perPage } = params;
  const books = await getAllBooks(page, perPage);
  return (
    <div>
      <h1>Book List</h1>
      {/* Book list content will go here */}
      <pre>{JSON.stringify(books, null, 2)}</pre>
    </div>
  );
}
