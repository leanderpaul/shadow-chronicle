/**
 * Importing npm packages
 */
import { Component, Input } from '@angular/core';

/**
 * Importing user defined packages
 */
import { type ListExpensesQuery } from '@app/shared/services';

/**
 * Defining types
 */

export type ExpenseList = ListExpensesQuery['expenses']['items'];

/**
 * Declaring the constants
 */

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent {
  @Input() expenses: ExpenseList;
}
