import { ReactNode } from 'react';

type BadgeVariant = 'reading' | 'completed' | 'want-to-read' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  reading: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-green-50 text-green-700 ring-green-600/20',
  'want-to-read': 'bg-gray-50 text-gray-600 ring-gray-500/20',
  default: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium ring-1 ring-inset
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
