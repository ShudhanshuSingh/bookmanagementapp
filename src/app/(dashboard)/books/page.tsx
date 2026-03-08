'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { IBook, BookStatus } from '@/types';
import { CreateBookInput } from '@/schemas/book.schema';
import BookGrid from '@/components/books/BookGrid';
import BookFilters from '@/components/books/BookFilters';
import BookForm from '@/components/books/BookForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

export default function BooksPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<IBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { books, isLoading, allTags, createBook, updateBook, deleteBook } =
    useBooks({ status: statusFilter, tag: tagFilter, search: searchQuery });

  // Keyboard shortcut: N to open add form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'n' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        setEditingBook(null);
        setIsFormOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreate = useCallback(async (data: CreateBookInput) => {
    setIsSubmitting(true);
    const result = await createBook(data);
    setIsSubmitting(false);
    if (result) {
      setIsFormOpen(false);
    }
  }, [createBook]);

  const handleUpdate = useCallback(async (data: CreateBookInput) => {
    if (!editingBook) return;
    setIsSubmitting(true);
    const result = await updateBook(String(editingBook._id), data);
    setIsSubmitting(false);
    if (result) {
      setIsFormOpen(false);
      setEditingBook(null);
    }
  }, [editingBook, updateBook]);

  const handleDelete = useCallback(async () => {
    if (!deletingBook) return;
    setIsDeleting(true);
    await deleteBook(String(deletingBook._id));
    setIsDeleting(false);
    setDeletingBook(null);
  }, [deletingBook, deleteBook]);

  const handleStatusChange = useCallback(
    (book: IBook, status: BookStatus) => {
      updateBook(String(book._id), { status });
    },
    [updateBook]
  );

  const handleEdit = useCallback((book: IBook) => {
    setEditingBook(book);
    setIsFormOpen(true);
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditingBook(null);
    setIsFormOpen(true);
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="text-sm text-gray-500 mt-1">
            {books.length} book{books.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleOpenAdd} title="Press N to add a new book">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Book
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BookFilters
        statusFilter={statusFilter}
        tagFilter={tagFilter}
        searchQuery={searchQuery}
        allTags={allTags}
        onStatusChange={setStatusFilter}
        onTagChange={setTagFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Book Grid or Empty State */}
      {books.length === 0 ? (
        <EmptyState onAction={handleOpenAdd} />
      ) : (
        <BookGrid
          books={books}
          onEdit={handleEdit}
          onDelete={setDeletingBook}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add/Edit Modal (slide-over style) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBook(null);
        }}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        size="lg"
      >
        <BookForm
          book={editingBook}
          onSubmit={editingBook ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingBook(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
