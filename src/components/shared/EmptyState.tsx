import Button from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'Your shelf is empty',
  description = 'Start with a great book. Add your first book to begin tracking your reading journey.',
  actionLabel = 'Add Your First Book',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="w-48 h-48 mb-8 relative">
        <div className="absolute inset-0 flex items-end justify-center gap-1.5">
          {/* Book spines */}
          {['#FFB3BA', '#BAFFC9', '#BAE1FF', '#E8BAFF', '#FFFFBA'].map(
            (color, i) => (
              <div
                key={i}
                className="rounded-t-sm opacity-30"
                style={{
                  backgroundColor: color,
                  width: `${18 + (i % 3) * 4}px`,
                  height: `${60 + i * 20}px`,
                }}
              />
            )
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">📚</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>

      {onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
