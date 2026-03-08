'use client';

import { IBook, BookStatus } from '@/types';
import Badge from '@/components/ui/Badge';

interface BookCardProps {
  book: IBook;
  onEdit: (book: IBook) => void;
  onDelete: (book: IBook) => void;
  onStatusChange: (book: IBook, status: BookStatus) => void;
}

const statusLabels: Record<BookStatus, string> = {
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
};

export default function BookCard({ book, onEdit, onDelete, onStatusChange }: BookCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Cover Color Strip */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: book.coverColor || '#BAE1FF' }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
          </div>

          {/* Actions (visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button
              onClick={() => onEdit(book)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(book)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <Badge variant={book.status}>{statusLabels[book.status]}</Badge>
        </div>

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notes preview */}
        {book.notes && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
            {book.notes}
          </p>
        )}

        {/* Quick status change */}
        <div className="pt-3 border-t border-gray-100">
          <select
            value={book.status}
            onChange={(e) => onStatusChange(book, e.target.value as BookStatus)}
            className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value="want-to-read">📋 Want to Read</option>
            <option value="reading">📖 Reading</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
