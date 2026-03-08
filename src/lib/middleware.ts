import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/lib/jwt';
import { errorResponse } from '@/lib/apiResponse';
import { UserPayload } from '@/types';

// Extended request with user payload
export interface AuthenticatedRequest extends NextRequest {
  user: UserPayload;
}

type RouteHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

type AuthRouteHandler = (
  req: AuthenticatedRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

/**
 * HOF that verifies JWT from cookies before calling the handler.
 * Attaches `user` to the request object.
 */
export function withAuth(handler: AuthRouteHandler): RouteHandler {
  return async (req: NextRequest, context) => {
    try {
      const token = req.cookies.get('token')?.value;

      if (!token) {
        return errorResponse('Authentication required', 401);
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return errorResponse('Invalid or expired token', 401);
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = payload;

      return handler(req as AuthenticatedRequest, context);
    } catch {
      return errorResponse('Authentication failed', 401);
    }
  };
}

/**
 * HOF that validates the request body against a Zod schema.
 */
export function withValidation<T extends z.ZodType>(
  schema: T,
  handler: (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> },
    validatedData: z.infer<T>
  ) => Promise<NextResponse>
): RouteHandler {
  return async (req: NextRequest, context) => {
    try {
      const body = await req.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        return errorResponse('Validation failed', 400, errors);
      }

      return handler(req, context, result.data);
    } catch {
      return errorResponse('Invalid request body', 400);
    }
  };
}

/**
 * Compose withAuth and withValidation together.
 * Usage: withAuthAndValidation(schema, handler)
 */
export function withAuthAndValidation<T extends z.ZodType>(
  schema: T,
  handler: (
    req: AuthenticatedRequest,
    context: { params: Promise<Record<string, string>> },
    validatedData: z.infer<T>
  ) => Promise<NextResponse>
): RouteHandler {
  return withAuth((req: AuthenticatedRequest, context) => {
    return withValidation(schema, (innerReq, innerContext, data) => {
      (innerReq as AuthenticatedRequest).user = req.user;
      return handler(innerReq as AuthenticatedRequest, innerContext, data);
    })(req, context);
  });
}
