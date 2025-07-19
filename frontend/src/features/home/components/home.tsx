import BookList from '@/features/books/components/book-list';
import { Params } from '@/features/shared/schemas/page-params-schema';

export default function Home({ searchParams }: { searchParams: Params }) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Home Page</h1>
      <BookList params={searchParams} />
    </main>
  );
}
