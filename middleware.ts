/**
 * Importing npm packages
 */
import { next, rewrite } from '@vercel/edge';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

interface User {
  uid: string;
  email: string;
  name: string;
  verified: boolean;
}

/**
 * Declaring the constants
 */
const SHADOW_ARCHIVE_HOSTNAME = process.env.SHADOW_ARCHIVE_HOSTNAME || 'archive.dev.shadow-apps.com';
const ACCOUNTS_DOMAIN = process.env.ACCOUNTS_DOMAIN || 'https://accounts.dev.shadow-apps.com';

async function getCurrentUser(headers: Headers): Promise<User | null> {
  if (!headers.has('cookie')) return null;
  headers.set('x-shadow-service', 'chronicle');
  const response = await fetch(`https://${SHADOW_ARCHIVE_HOSTNAME}/api/user`, { headers });
  const body = await response.json();
  return body.uid ? body : null;
}

export default async function middleware(request: Request): Promise<Response> {
  /** skip middleware, if serving static resource such as .js, .css, .png, etc */
  if (request.url.search('[a-zA-Z0-9]\\.[a-z]{1,5}$') > 0) return next();

  /** Proxy graphql requests */
  if (request.method === 'POST' && request.url === '/graphql') {
    const headers = new Headers(request.headers);
    headers.set('x-shadow-service', 'chronicle');
    return rewrite(`https://${SHADOW_ARCHIVE_HOSTNAME}/graphql/chronicle`, { request: { headers } });
  }

  if (request.method === 'GET' && request.url === '/api/user') {
    const user = await getCurrentUser(request.headers);
    return new Response(JSON.stringify(user), { headers: { 'content-type': 'application/json' } });
  }

  /** proceed if user is authenticated and email address is verified, else redirect to accounts */
  const user = await getCurrentUser(request.headers);
  if (user?.verified) return next();
  const url = user ? '/verify' : '/auth/signin';
  return Response.redirect(ACCOUNTS_DOMAIN + url);
}
