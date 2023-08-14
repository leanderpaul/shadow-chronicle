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
  [ExpenseCategory.BILLS]: 'receipt_long',
  [ExpenseCategory.CHARITY]: 'volunteer_activism',
  [ExpenseCategory.EATING_OUT]: 'dining',
  [ExpenseCategory.ENTERTAINMENT]: 'emoji_emotions',
  [ExpenseCategory.FAMILY]: 'family_restroom',
  [ExpenseCategory.GENERAL]: 'interests',
  [ExpenseCategory.GIFTS]: 'redeem',
  [ExpenseCategory.GROCERIES]: 'local_grocery_store',
  [ExpenseCategory.HOLIDAYS]: 'luggage',
  [ExpenseCategory.PERSONAL_CARE]: 'favorite',
  [ExpenseCategory.SHOPPING]: 'local_mall',
  [ExpenseCategory.TRANSPORT]: 'directions_bus',
  [ExpenseCategory.UNKNOWN]: 'menu',
};

@Pipe({
  name: 'iconize',
  standalone: true,
})
export class IconizePipe implements PipeTransform {
  private getCurrencyIcon(currency: Currency | null) {
    return currency ? CURRENCY_ICONS[currency] : CURRENCY_ICONS[Currency.GBP];
  }

  private getCategoryIcon(category: ExpenseCategory | null) {
    return category ? CATEGORY_ICONS[category] : CATEGORY_ICONS[ExpenseCategory.UNKNOWN];
  }

  transform(str: Currency | null, type: 'currency'): string;
  transform(str: ExpenseCategory | null, type: 'category'): string;
  transform(str: Currency | ExpenseCategory | null, type: 'currency' | 'category' = 'category'): string {
    return type === 'currency' ? this.getCurrencyIcon(str as Currency | null) : this.getCategoryIcon(str as ExpenseCategory | null);
  }
}
