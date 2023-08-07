/**
 * Importing npm packages
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable, distinctUntilChanged, shareReplay, tap } from 'rxjs';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */
export interface User {
  uid: string;
  name: string;
  email: string;
  verified: boolean;
  imageUrl?: string;
}

/**
 * Declaring the constants
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User>({ uid: '', name: '', email: '', verified: false });

  constructor(private readonly httpClient: HttpClient) {}

  private redirectToLogin(): never {
    const hostname = window.location.hostname;
    const topDomain = hostname.split('.').slice(1).join('.');
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://accounts.${topDomain}/auth/signin?redirectUrl=${redirectUrl}`;
    throw new Error('Redirecting to login');
  }

  verifyUser(): Observable<User> {
    return this.httpClient.get<User>('/api/user').pipe(tap({ next: user => this.userSubject.next(user), error: () => this.redirectToLogin() }), shareReplay(1));
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable().pipe(distinctUntilChanged());
  }
}
