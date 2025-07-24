import { getBookById } from '@/features/books/actions';
import Link from 'next/link';

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const bookDetail = await getBookById(id);

  return (
    <main className="max-w-screen-2xl mx-auto p-5">
      <h1>{bookDetail.title}</h1>
      <h2>Author: {bookDetail.author}</h2>
      <p>{bookDetail.isbn}</p>
      {/* Additional book details can be displayed here */}
      <Link href="/">Back to books</Link>
    </main>
  );
}
