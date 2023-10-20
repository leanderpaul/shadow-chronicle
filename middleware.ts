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
const SHADOW_ARCHIVE_DOMAIN = process.env.SHADOW_ARCHIVE_DOMAIN || 'archive.dev.shadow-apps.com';
const SHADOW_ACCOUNTS_DOMAIN = process.env.SHADOW_ACCOUNTS_DOMAIN || 'accounts.dev.shadow-apps.com';

async function getCurrentUser(headers: Headers, query: string = ''): Promise<User | null> {
  if (!headers.has('cookie')) return null;
  headers.set('x-shadow-service', 'chronicle');
  const response = await fetch(`https://${SHADOW_ARCHIVE_DOMAIN}/api/user?${query}`, { headers });
  const body = await response.json();
  return body.uid ? body : null;
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);

  /** skip middleware, if serving static resource such as .js, .css, .png, etc */
  if (url.pathname.search('[a-zA-Z0-9]\\.[a-z]{1,5}$') > 0) return next();

  /** Proxy graphql requests */
  if (request.method === 'POST' && url.pathname === '/graphql') {
    const headers = new Headers(request.headers);
    headers.set('x-shadow-service', 'chronicle');
    return rewrite(`https://${SHADOW_ARCHIVE_DOMAIN}/graphql/chronicle`, { request: { headers } });
  }

  if (request.method === 'GET' && url.pathname === '/api/user') {
    const user = await getCurrentUser(request.headers, url.searchParams.toString());
    return new Response(JSON.stringify(user), { headers: { 'content-type': 'application/json' } });
  }

  /** proceed if user is authenticated and email address is verified, else redirect to accounts */
  const user = await getCurrentUser(request.headers);
  if (user?.verified) return next();
  const query = `redirect=${encodeURIComponent(request.url)}`;
  return Response.redirect(`https://${SHADOW_ACCOUNTS_DOMAIN}/${user ? 'verify' : 'auth/signin'}?${query}`);
}
