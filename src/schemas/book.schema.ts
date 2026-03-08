import { z } from 'zod';

export const bookStatusEnum = z.enum(['want-to-read', 'reading', 'completed']);

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author must not exceed 100 characters')
    .trim(),
  tags: z.array(z.string().trim()).default([]),
  status: bookStatusEnum.default('want-to-read'),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional()
    .default(''),
});

export const updateBookSchema = createBookSchema.partial();

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
