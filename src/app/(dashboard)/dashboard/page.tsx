'use client';

import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';
import GreetingBanner from '@/components/layout/GreetingBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, isLoading } = useBooks();

  if (isLoading) return <LoadingSpinner size="lg" />;

  const statCards = [
    {
      label: 'Total Books',
      value: stats.total,
      icon: '📚',
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Reading',
      value: stats.reading,
      icon: '📖',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: '✅',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Want to Read',
      value: stats.wantToRead,
      icon: '📋',
      color: 'bg-gray-50 text-gray-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <GreetingBanner userName={user?.name || 'Reader'} />
        {stats.completedThisMonth > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
            <span className="text-amber-600 text-sm font-medium">
              🔥 {stats.completedThisMonth} book{stats.completedThisMonth !== 1 ? 's' : ''} completed this month
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${card.color}`}
              >
                {card.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick tip */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <span className="text-xl">📗</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Add a book</p>
              <p className="text-xs text-gray-500">
                Go to My Books and click &quot;Add Book&quot; or press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">N</kbd>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <span className="text-xl">🏷️</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Organize with tags</p>
              <p className="text-xs text-gray-500">
                Add tags like &quot;fiction&quot;, &quot;sci-fi&quot;, or &quot;work&quot; to group books
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Track progress</p>
              <p className="text-xs text-gray-500">
                Change book status as you read — stats update automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
