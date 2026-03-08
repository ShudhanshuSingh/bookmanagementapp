import { verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     description: Returns the currently authenticated user from the JWT cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Not authenticated
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return errorResponse('Not authenticated', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    return successResponse(payload, 'User fetched successfully');
  } catch {
    return errorResponse('Authentication failed', 401);
  }
}
