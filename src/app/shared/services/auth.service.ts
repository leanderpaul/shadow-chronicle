/**
 * Importing npm packages
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, distinctUntilChanged, repeat, tap } from 'rxjs';

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
  csrfToken: string;
}

/**
 * Declaring the constants
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user$ = new BehaviorSubject<User>({ uid: '', name: '', email: '', verified: false, csrfToken: '' });

  constructor(private readonly httpClient: HttpClient) {
    this.httpClient
      .get<User>('/api/user?csrf=true')
      .pipe(
        catchError(() => this.redirectToLogin()),
        tap(user => this.user$.next(user)),
        delay(60 * 60 * 1000),
        repeat(),
      )
      .subscribe();
  }

  private redirectToLogin(): never {
    const hostname = window.location.hostname;
    const topDomain = hostname.split('.').slice(1).join('.');
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://accounts.${topDomain}/auth/signin?redirectUrl=${redirectUrl}`;
    throw new Error('Redirecting to login');
  }

  getUser(): User;
  getUser<T extends keyof User>(key: T): User[T];
  getUser<T extends keyof User>(key?: T): User | string | boolean | undefined {
    const value = this.user$.getValue();
    if (key) return value[key];
    return value;
  }

  getUser$(): Observable<User> {
    return this.user$.asObservable().pipe(distinctUntilChanged());
  }
}
