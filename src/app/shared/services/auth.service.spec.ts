/**
 * Importing npm packages
 */
import { TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { AuthService } from './auth.service';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
