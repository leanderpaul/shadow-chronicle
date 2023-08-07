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
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(str: string): string {
    return str
      .toLowerCase()
      .split(/[ _]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
