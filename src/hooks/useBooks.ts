'use client';

import { useState, useEffect, useCallback } from 'react';
import { IBook, BookStats, ApiResponse } from '@/types';
import { CreateBookInput, UpdateBookInput } from '@/schemas/book.schema';

interface UseBooksOptions {
  status?: string;
  tag?: string;
  search?: string;
}

export function useBooks(options: UseBooksOptions = {}) {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.tag) params.set('tag', options.tag);
      if (options.search) params.set('search', options.search);

      const queryString = params.toString();
      const url = `/api/books${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url);
      const data: ApiResponse<IBook[]> = await res.json();

      if (data.success && data.data) {
        setBooks(data.data);
      } else {
        setError(data.message || 'Failed to fetch books');
      }
    } catch {
      setError('Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.tag, options.search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const createBook = useCallback(async (input: CreateBookInput): Promise<IBook | null> => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: ApiResponse<IBook> = await res.json();

      if (data.success && data.data) {
        setBooks((prev) => [data.data!, ...prev]);
        return data.data;
      }
      setError(data.message || 'Failed to create book');
      return null;
    } catch {
      setError('Failed to create book');
      return null;
    }
  }, []);

  const updateBook = useCallback(async (id: string, input: UpdateBookInput): Promise<IBook | null> => {
    try {
      // Optimistic update
      setBooks((prev) =>
        prev.map((book) =>
          String(book._id) === id ? { ...book, ...input } as IBook : book
        )
      );

      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: ApiResponse<IBook> = await res.json();

      if (data.success && data.data) {
        setBooks((prev) =>
          prev.map((book) => (String(book._id) === id ? data.data! : book))
        );
        return data.data;
      }

      // Revert optimistic update on failure
      await fetchBooks();
      setError(data.message || 'Failed to update book');
      return null;
    } catch {
      await fetchBooks();
      setError('Failed to update book');
      return null;
    }
  }, [fetchBooks]);

  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Optimistic removal
      const prevBooks = books;
      setBooks((prev) => prev.filter((book) => String(book._id) !== id));

      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      const data: ApiResponse = await res.json();

      if (data.success) return true;

      // Revert on failure
      setBooks(prevBooks);
      setError(data.message || 'Failed to delete book');
      return false;
    } catch {
      await fetchBooks();
      setError('Failed to delete book');
      return false;
    }
  }, [books, fetchBooks]);

  const stats: BookStats = {
    total: books.length,
    reading: books.filter((b) => b.status === 'reading').length,
    completed: books.filter((b) => b.status === 'completed').length,
    wantToRead: books.filter((b) => b.status === 'want-to-read').length,
    completedThisMonth: books.filter((b) => {
      if (b.status !== 'completed') return false;
      const now = new Date();
      const updated = new Date(b.updatedAt);
      return (
        updated.getMonth() === now.getMonth() &&
        updated.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const allTags = [...new Set(books.flatMap((b) => b.tags))].sort();

  return {
    books,
    isLoading,
    error,
    stats,
    allTags,
    createBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  };
}
