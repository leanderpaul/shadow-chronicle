/**
 * Importing npm packages
 */
import { next } from '@vercel/edge';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

interface User {
  uid: string;
  email: string;
  verified: boolean;
}

/**
 * Declaring the constants
 */
const ACCOUNTS_GRAPHQL_ENDPOINT = process.env['ACCOUNTS_GRAPHQL_ENDPOINT'] || 'https://archive.dev.shadow-apps.com/graphql/accounts';
const ACCOUNTS_DOMAIN = process.env['ACCOUNTS_DOMAIN'] || 'https://accounts.dev.shadow-apps.com';

async function getUser(cookie: string): Promise<User | null> {
  const query = 'query GetCurrentUser { viewer { uid email verified } }';
  const body = JSON.stringify({ query });
  const headers = { cookie, 'Content-Type': 'application/json' };
  const response = await fetch(ACCOUNTS_GRAPHQL_ENDPOINT, { method: 'post', headers, body });
  const resBody = await response.json();
  return resBody.data?.viewer || null;
}

export default async function middleware(request: Request): Promise<Response> {
  if (request.url.includes('.') || process.env['NODE_ENV'] === 'development') return next();
  if (request.url === '/graphql') return next({ headers: { 'x-vercel-method': request.method } });
  const cookie = request.headers.get('cookie');
  const user = cookie ? await getUser(cookie) : null;
  if (user) return user.verified ? next() : Response.redirect(ACCOUNTS_DOMAIN + '/verify');
  return Response.redirect(ACCOUNTS_DOMAIN + '/auth/signin');
}
