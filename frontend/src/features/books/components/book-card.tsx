import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '../schemas/bookSchema';

export default function BookCard({ book }: { book: Book }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <h2>{book.author}</h2>
      </CardHeader>
    </Card>
  );
}
