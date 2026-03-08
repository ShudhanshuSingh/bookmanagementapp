import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signToken, getTokenMaxAge } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { withValidation } from '@/lib/middleware';
import { loginSchema } from '@/schemas/book.schema';
import User from '@/models/User';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticates user and sets JWT in httpOnly cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arjun@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in httpOnly cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export const POST = withValidation(loginSchema, async (
  _req: NextRequest,
  _context: { params: Promise<Record<string, string>> },
  data
) => {
  try {
    await connectDB();

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const response = successResponse(
      { id: user._id, name: user.name, email: user.email },
      'Login successful'
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: getTokenMaxAge(),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500);
  }
});
