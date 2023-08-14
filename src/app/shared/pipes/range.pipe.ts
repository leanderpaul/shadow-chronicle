/**
 * Importing npm packages
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {
  transform(length: number, offset = 0): number[] {
    if (!length) return [];
    return Array.from({ length }, (_, index) => index + offset);
  }
}
