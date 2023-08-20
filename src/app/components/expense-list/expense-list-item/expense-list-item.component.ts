/**
 * Importing npm packages
 */
import { Component, Input, type OnInit } from '@angular/core';

/**
 * Importing user defined packages
 */
import { type ListExpensesQuery } from '@app/shared/services';

/**
 * Defining types
 */

type Expense = ListExpensesQuery['expenses']['items'][number];

/**
 * Declaring the constants
 */

@Component({
  selector: 'app-expense-list-item',
  templateUrl: './expense-list-item.component.html',
  styleUrls: ['./expense-list-item.component.scss'],
})
export class ExpenseListItemComponent implements OnInit {
  @Input() expense: Expense;
  total: number;

  ngOnInit(): void {
    this.total = this.expense.total / 100;
  }
}
