import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { withValidation } from '@/lib/middleware';
import { registerSchema } from '@/schemas/book.schema';
import User from '@/models/User';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user account with name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Arjun
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arjun@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Internal server error
 */
export const POST = withValidation(registerSchema, async (
  _req: NextRequest,
  _context: { params: Promise<Record<string, string>> },
  data
) => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return errorResponse('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return successResponse(
      { id: user._id, name: user.name, email: user.email },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Internal server error', 500);
  }
});
