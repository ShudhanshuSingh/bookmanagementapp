import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function apiResponse<T>(
  data: T | null,
  message: string,
  status: number,
  success: boolean = status >= 200 && status < 300,
  errors?: Record<string, string[]> | string
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = { success, message };

  if (data !== null && data !== undefined) body.data = data;
  if (errors) body.errors = errors;

  return NextResponse.json(body, { status });
}

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  return apiResponse(data, message, status, true);
}

export function errorResponse(message: string, status = 400, errors?: Record<string, string[]> | string) {
  return apiResponse(null, message, status, false, errors);
}
