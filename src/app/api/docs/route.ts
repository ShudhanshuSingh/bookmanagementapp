import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

/**
 * @description Returns the OpenAPI JSON specification
 */
export async function GET() {
  return NextResponse.json(swaggerSpec);
}
