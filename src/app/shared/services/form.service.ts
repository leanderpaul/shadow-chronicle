/**
 * Importing npm packages
 */
import { Injectable } from '@angular/core';
import { type Observable, map, startWith, switchMap } from 'rxjs';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

@Injectable({ providedIn: 'root' })
export class FormService {
  filterByInput(source: Observable<string[]>, input: Observable<string>, defaultValue = ''): Observable<string[]> {
    return source.pipe(
      switchMap(values =>
        input.pipe(
          startWith(defaultValue),
          map(input => values.filter(value => value.toLowerCase().includes(input.toLowerCase()))),
        ),
      ),
    );
  }
}
