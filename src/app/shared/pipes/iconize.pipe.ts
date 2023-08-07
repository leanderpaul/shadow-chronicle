/**
 * Importing npm packages
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Importing user defined packages
 */
import { Currency, ExpenseCategory } from '@app/graphql/operations.graphql';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const CURRENCY_ICONS: Record<Currency, string> = {
  [Currency.GBP]: 'currency_pound',
  [Currency.INR]: 'currency_rupee',
};
const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.Bills]: 'receipt_long',
  [ExpenseCategory.Charity]: 'volunteer_activism',
  [ExpenseCategory.EatingOut]: 'dining',
  [ExpenseCategory.Entertainment]: 'emoji_emotions',
  [ExpenseCategory.Family]: 'family_restroom',
  [ExpenseCategory.General]: 'interests',
  [ExpenseCategory.Gifts]: 'redeem',
  [ExpenseCategory.Groceries]: 'local_grocery_store',
  [ExpenseCategory.Holidays]: 'luggage',
  [ExpenseCategory.PersonalCare]: 'favorite',
  [ExpenseCategory.Shopping]: 'local_mall',
  [ExpenseCategory.Transport]: 'directions_bus',
  [ExpenseCategory.Unknown]: 'menu',
};

@Pipe({
  name: 'iconize',
  standalone: true,
})
export class IconizePipe implements PipeTransform {
  transform(str: Currency, type: 'currency'): string;
  transform(str: ExpenseCategory, type: 'category'): string;
  transform(str: Currency | ExpenseCategory, type: 'currency' | 'category' = 'category'): string {
    return type === 'currency' ? CURRENCY_ICONS[str as Currency] : CATEGORY_ICONS[str as ExpenseCategory];
  }
}
