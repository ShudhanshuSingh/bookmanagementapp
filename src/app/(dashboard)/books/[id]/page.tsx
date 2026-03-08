'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { IBook, BookStatus, ApiResponse } from '@/types';
import { CreateBookInput } from '@/schemas/book.schema';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import BookForm from '@/components/books/BookForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const statusLabels: Record<BookStatus, string> = {
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
};

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchBook = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/books/${id}`);
      const data: ApiResponse<IBook> = await res.json();
      if (data.success && data.data) {
        setBook(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch book:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleUpdate = async (data: CreateBookInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<IBook> = await res.json();
      if (result.success && result.data) {
        setBook(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      const data: ApiResponse = await res.json();
      if (data.success) {
        router.push('/books');
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (!book) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900">Book not found</h2>
        <p className="text-gray-500 mt-2">This book may have been deleted.</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => router.push('/books')}
        >
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Color strip */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: book.coverColor || '#BAE1FF' }}
        />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-lg text-gray-500 mt-1">by {book.author}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setIsDeleting(true)}>
                Delete
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <Badge variant={book.status}>{statusLabels[book.status]}</Badge>
          </div>

          {/* Tags */}
          {book.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {book.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                {book.notes}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="pt-6 border-t border-gray-100 text-xs text-gray-400 flex gap-6">
            <span>Added {new Date(book.createdAt).toLocaleDateString()}</span>
            <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Book"
        size="lg"
      >
        <BookForm
          book={book}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
