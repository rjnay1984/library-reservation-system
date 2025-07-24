import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '../schemas/bookSchema';
import Link from 'next/link';

export default function BookCard({ book }: { book: Book }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/books/${book.id}`}>{book.title}</Link>
        </CardTitle>
        <h2>{book.author}</h2>
      </CardHeader>
    </Card>
  );
}
