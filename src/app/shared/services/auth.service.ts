/**
 * Importing npm packages
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, distinctUntilChanged, repeat, shareReplay, tap } from 'rxjs';

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
  private userSubject = new BehaviorSubject<User>({ uid: '', name: '', email: '', verified: false, csrfToken: '' });

  constructor(private readonly httpClient: HttpClient) {
    this.httpClient
      .get<User>('/api/user?csrf=true')
      .pipe(tap({ next: user => this.userSubject.next(user), error: () => this.redirectToLogin() }), delay(60 * 60 * 1000), repeat())
      .subscribe();
  }

  private redirectToLogin(): never {
    const hostname = window.location.hostname;
    const topDomain = hostname.split('.').slice(1).join('.');
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://accounts.${topDomain}/auth/signin?redirectUrl=${redirectUrl}`;
    throw new Error('Redirecting to login');
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable().pipe(shareReplay(1), distinctUntilChanged());
  }

  getCSRFToken(): string {
    return this.userSubject.value.csrfToken;
  }
}
