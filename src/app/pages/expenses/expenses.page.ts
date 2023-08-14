/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, type OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { DateTime } from 'luxon';
import { type Observable, type Subscription, map, tap } from 'rxjs';

/**
 * Importing user defined packages
 */
import { ExpenseListModule } from '@app/components/expense-list/expense-list.module';
import {
  Currency,
  ExpenseCategory,
  ExpenseVisibiltyLevel,
  ListExpensesGQL,
  type ListExpensesQuery,
  type ListExpensesQueryVariables,
  SortOrder,
} from '@app/graphql/operations.graphql';
import { IconizePipe, WithLoadingPipe } from '@app/shared/pipes';
import { StoreService } from '@app/shared/services';

/**
 * Defining types
 */

export interface GroupedExpense {
  label: string;
  date: number;
  total: number;
  expenses: ListExpensesQuery['expenses']['items'];
}

interface Filter {
  category?: string;
  store?: string;
  fromDate?: string;
  toDate?: string;
  levels?: string | string[];
  paymentMethod?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

/**
 * Declaring the constants
 */
const isDate = (value?: string): value is string => !!value && parseInt(value) > 200101;
const isPositiveInteger = (value?: string): value is string => !!value && parseInt(value) > 0;
const isSortOrder = (value?: string): value is SortOrder => !!value && Object.values(SortOrder).includes(value as SortOrder);
const isCategory = (value?: string): value is ExpenseCategory => !!value && Object.values(ExpenseCategory).includes(value as ExpenseCategory);
const isLevel = (value?: string): value is ExpenseVisibiltyLevel => !!value && Object.values(ExpenseVisibiltyLevel).includes(value as ExpenseVisibiltyLevel);

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    WithLoadingPipe,
    ExpenseListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    IconizePipe,
    MatPaginatorModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './expenses.page.html',
})
export class ExpensesPage implements OnDestroy, OnInit {
  private subscription: Subscription[] = [];
  private query: QueryRef<ListExpensesQuery, ListExpensesQueryVariables>;

  refecting = false;

  currency: Currency;
  expenseConnection: Observable<ListExpensesQuery['expenses']>;
  groupedExpenses: GroupedExpense[] = [];

  filter: Filter = { levels: [ExpenseVisibiltyLevel.STANDARD, ExpenseVisibiltyLevel.HIDDEN] };
  page: Pick<PageEvent, 'pageIndex' | 'pageSize'> = { pageIndex: 0, pageSize: 20 };

  constructor(storeService: StoreService, private readonly listExpensesGQL: ListExpensesGQL, private readonly router: Router, private readonly snackBar: MatSnackBar) {
    const currency$ = storeService.currency.pipe(
      tap(currency => (this.currency = currency)),
      tap(() => this.refetch()),
    );
    const queryParams$ = router.routerState.root.queryParams.pipe(
      tap(query => (this.filter = { ...query })),
      tap(() => this.refetch()),
    );
    this.subscription.push(currency$.subscribe(), queryParams$.subscribe());
  }

  private getQueryVariables(): ListExpensesQueryVariables {
    const filter: ListExpensesQueryVariables['filter'] = { currency: this.currency };
    const page: ListExpensesQueryVariables['page'] = {};
    const sortOrder = isSortOrder(this.filter.sortOrder) ? this.filter.sortOrder : SortOrder.DESC;
    if (this.filter.store) filter.store = this.filter.store;
    if (this.filter.paymentMethod) filter.paymentMethod = this.filter.paymentMethod;
    if (isCategory(this.filter.category)) filter.category = this.filter.category;
    if (isDate(this.filter.fromDate)) filter.fromDate = parseInt(this.filter.fromDate);
    if (isDate(this.filter.toDate)) filter.toDate = parseInt(this.filter.toDate);
    const levels = Array.isArray(this.filter.levels) ? this.filter.levels : [this.filter.levels];
    if (levels.every(isLevel)) filter.levels = levels;
    if (isPositiveInteger(this.filter.limit)) {
      page.limit = parseInt(this.filter.limit);
      this.page.pageSize = page.limit;
    }
    if (isPositiveInteger(this.filter.page)) {
      this.page.pageIndex = parseInt(this.filter.page) - 1;
      page.offset = this.page.pageIndex * this.page.pageSize;
    }
    return { filter, page, sortOrder };
  }

  private refetch(): void {
    if (!this.query) return;
    this.refecting = true;
    const variables = this.getQueryVariables();
    this.query.refetch(variables);
  }

  private groupExpenses(expenses: ListExpensesQuery['expenses']['items']): GroupedExpense[] {
    const groupedExpenses: GroupedExpense[] = [];
    const now = DateTime.now();
    const today = now.toFormat('yyMMdd');
    const yesterday = now.minus({ days: 1 }).toFormat('yyMMdd');
    for (const expense of expenses) {
      let group = groupedExpenses.find(groupedExpense => groupedExpense.date === expense.date);
      if (!group) {
        const date = DateTime.fromFormat(expense.date.toString(), 'yyMMdd');
        let label = date.toFormat('MMMM d, yyyy');
        if (date.year === now.year) label = date.toFormat('MMMM d');
        if (expense.date.toString() === today) label = 'Today';
        if (expense.date.toString() === yesterday) label = 'Yesterday';
        group = { label, total: 0, date: expense.date, expenses: [] };
        groupedExpenses.push(group);
      }
      group.total += expense.total;
      group.expenses.push(expense);
    }
    return groupedExpenses;
  }

  ngOnInit(): void {
    const variables = this.getQueryVariables();
    this.query = this.listExpensesGQL.watch(variables, { fetchPolicy: 'no-cache' });
    this.expenseConnection = this.query.valueChanges.pipe(
      map(result => result.data.expenses),
      tap(() => (this.refecting = false)),
      tap(expenseConnection => (this.groupedExpenses = this.groupExpenses(expenseConnection?.items || []))),
    );
  }

  displayErrorMessage(component: string): void {
    this.snackBar.open(`${component} under development`, 'Dismiss', { duration: 5000, verticalPosition: 'top' });
  }

  handlePageChange(event: PageEvent): void {
    this.filter.page = event.pageIndex > 0 ? (event.pageIndex + 1).toString() : undefined;
    this.filter.limit = event.pageSize !== 20 ? event.pageSize.toString() : undefined;
    this.router.navigate([], { queryParams: { ...this.filter } });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
