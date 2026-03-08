'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookSchema, CreateBookInput } from '@/schemas/book.schema';
import { IBook } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useState } from 'react';

interface BookFormProps {
  book?: IBook | null;
  onSubmit: (data: CreateBookInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookForm({ book, onSubmit, onCancel, isLoading }: BookFormProps) {
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema) as any,
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      tags: book?.tags || [],
      status: book?.status || 'want-to-read',
      notes: book?.notes || '',
    },
  });

  const tags = watch('tags');

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue('tags', [...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Enter book title"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="Author"
        placeholder="Enter author name"
        error={errors.author?.message}
        {...register('author')}
      />

      {/* Status */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-indigo-400 hover:text-indigo-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Personal notes about this book..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        {errors.notes?.message && (
          <p className="text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {book ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}
