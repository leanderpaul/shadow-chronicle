/**
 * Importing npm packages
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

interface WithLoadingResult<T> {
  loading: boolean;
  value?: T;
  error?: Error;
}

/**
 * Declaring the constants
 */

@Pipe({
  name: 'withLoading',
  standalone: true,
})
export class WithLoadingPipe implements PipeTransform {
  transform<T>(val: Observable<T>): Observable<WithLoadingResult<T>> {
    return val.pipe(
      map((value: T) => ({ loading: false, value })),
      startWith({ loading: true }),
      catchError(error => of({ loading: false, error })),
    );
  }
}
