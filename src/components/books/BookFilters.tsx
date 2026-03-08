'use client';

import { BookStatus } from '@/types';

interface BookFiltersProps {
  statusFilter: string;
  tagFilter: string;
  searchQuery: string;
  allTags: string[];
  onStatusChange: (status: string) => void;
  onTagChange: (tag: string) => void;
  onSearchChange: (query: string) => void;
}

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'reading', label: '📖 Reading' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'want-to-read', label: '📋 Want to Read' },
];

export default function BookFilters({
  statusFilter,
  tagFilter,
  searchQuery,
  allTags,
  onStatusChange,
  onTagChange,
  onSearchChange,
}: BookFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
        />
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${
                statusFilter === option.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onTagChange('')}
            className={`
              px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200
              ${
                !tagFilter
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }
            `}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(tag === tagFilter ? '' : tag)}
              className={`
                px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${
                  tagFilter === tag
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
