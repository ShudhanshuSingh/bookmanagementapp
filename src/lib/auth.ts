import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { UserPayload } from '@/types';

export async function getServerSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  return verifyToken(token);
}
