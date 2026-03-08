import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { withAuth, withAuthAndValidation, AuthenticatedRequest } from '@/lib/middleware';
import { createBookSchema } from '@/schemas/book.schema';
import Book from '@/models/Book';

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     description: Returns all books for the authenticated user with optional filtering
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [want-to-read, reading, completed]
 *         description: Filter by reading status
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or author
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = { userId: req.user.userId };

    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(filter).sort({ createdAt: -1 }).lean();

    return successResponse(books, 'Books fetched successfully');
  } catch (error) {
    console.error('Get books error:', error);
    return errorResponse('Internal server error', 500);
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create a new book
 *     description: Adds a new book to the authenticated user's collection
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const POST = withAuthAndValidation(createBookSchema, async (
  req: AuthenticatedRequest,
  _context: { params: Promise<Record<string, string>> },
  data
) => {
  try {
    await connectDB();

    const book = await Book.create({
      ...data,
      userId: req.user.userId,
    });

    return successResponse(book, 'Book created successfully', 201);
  } catch (error) {
    console.error('Create book error:', error);
    return errorResponse('Internal server error', 500);
  }
});
