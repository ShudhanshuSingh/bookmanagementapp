'use client';

import { IBook, BookStatus } from '@/types';
import BookCard from './BookCard';

interface BookGridProps {
  books: IBook[];
  onEdit: (book: IBook) => void;
  onDelete: (book: IBook) => void;
  onStatusChange: (book: IBook, status: BookStatus) => void;
}

export default function BookGrid({ books, onEdit, onDelete, onStatusChange }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={String(book._id)}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
