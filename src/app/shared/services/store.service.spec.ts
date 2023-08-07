/**
 * Importing npm packages
 */
import { TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { StoreService } from './store.service';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
