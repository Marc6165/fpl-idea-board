import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'voterId';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function getOrSetVoterId(): string {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = uuidv4();
  store.set({
    name: COOKIE_NAME,
    value: id,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/'
  });
  return id;
} 