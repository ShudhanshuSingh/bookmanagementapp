import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { withAuth, withAuthAndValidation, AuthenticatedRequest } from '@/lib/middleware';
import { updateBookSchema } from '@/schemas/book.schema';
import Book from '@/models/Book';

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get a single book
 *     description: Returns a single book by ID for the authenticated user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
export const GET = withAuth(async (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> }
) => {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid book ID', 400);
    }

    const book = await Book.findOne({
      _id: id,
      userId: req.user.userId,
    }).lean();

    if (!book) {
      return errorResponse('Book not found', 404);
    }

    return successResponse(book, 'Book fetched successfully');
  } catch (error) {
    console.error('Get book error:', error);
    return errorResponse('Internal server error', 500);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book
 *     description: Updates an existing book by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookInput'
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
export const PUT = withAuthAndValidation(updateBookSchema, async (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> },
  data
) => {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid book ID', 400);
    }

    const book = await Book.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!book) {
      return errorResponse('Book not found', 404);
    }

    return successResponse(book, 'Book updated successfully');
  } catch (error) {
    console.error('Update book error:', error);
    return errorResponse('Internal server error', 500);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     description: Deletes a book by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 */
export const DELETE = withAuth(async (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> }
) => {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid book ID', 400);
    }

    const book = await Book.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!book) {
      return errorResponse('Book not found', 404);
    }

    return successResponse(null, 'Book deleted successfully');
  } catch (error) {
    console.error('Delete book error:', error);
    return errorResponse('Internal server error', 500);
  }
});
