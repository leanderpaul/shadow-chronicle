/**
 * Importing npm packages
 */
import { TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { FormService } from './form.service';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
