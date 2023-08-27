/**
 * Importing npm packages
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

export type FormatType = 'date' | 'time';

/**
 * Declaring the constants
 */

@Pipe({
  name: 'formatter',
  standalone: true,
})
export class FormatterPipe implements PipeTransform {
  transform(value: string | number | undefined | null, type: FormatType): string {
    if (!value) return '';
    if (typeof value === 'number') value = value.toString();
    if (type === 'date') return DateTime.fromFormat(value, 'yyMMdd').toFormat('dd MMM yyyy');
    if (type === 'time') return DateTime.fromFormat(value.padStart(4, '0'), 'HHmm').toFormat('hh:mm a');
    return '';
  }
}
