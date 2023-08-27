/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DateTime } from 'luxon';
import { type Observable, combineLatest, map, tap } from 'rxjs';

/**
 * Importing user defined packages
 */
import { ExpenseListModule } from '@app/components/expense-list/expense-list.module';
import { IconizePipe } from '@app/shared/pipes';
import { type GraphQLQuery, GraphQLService, ListExpensesOperation, type ListExpensesQuery, type ListExpensesQueryVariables, StoreService } from '@app/shared/services';
import { Currency, ExpenseCategory, ExpenseVisibiltyLevel, type QueryState, SortOrder } from '@app/shared/services/graphql';

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

interface Page {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
}

/**
 * Declaring the constants
 */
const DEFAULT_PAGE_LIMIT = 25;
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
export class ExpensesPage {
  /** Constants */
  readonly categories = [ExpenseCategory.UNKNOWN, ...Object.values(ExpenseCategory).filter(category => category !== ExpenseCategory.UNKNOWN)];
  readonly levels = Object.values(ExpenseVisibiltyLevel);

  /** Observables */
  readonly currency$: Observable<Currency>;
  readonly queryParams$: Observable<Filter>;
  readonly expenseGroups$: Observable<GroupedExpense[]>;
  readonly page$: Observable<Page>;

  /** GraphQL Request */
  readonly query: GraphQLQuery<ListExpensesQuery, ListExpensesQueryVariables>;

  constructor(private readonly storeService: StoreService, private readonly router: Router, private readonly snackBar: MatSnackBar, graphqlService: GraphQLService) {
    this.query = graphqlService.query(['expenses', '{{page.limit}}-{{page.offset}}'], ListExpensesOperation, this.getQueryVariables());

    /** Setting up observables */
    const refetch = () => this.query.refetch(this.getQueryVariables());
    this.currency$ = storeService.getCurrency$().pipe(tap(refetch));
    this.queryParams$ = router.routerState.root.queryParams.pipe(tap(refetch));
    this.expenseGroups$ = this.query.getState$().pipe(map(this.groupExpenses));
    this.page$ = combineLatest([this.query.getState$(), this.queryParams$]).pipe(map(this.getPagination));
  }

  private getQueryVariables(): ListExpensesQueryVariables {
    const currency = this.storeService.getCurrency();
    const params: Filter = this.router.routerState.snapshot.root.queryParams;
    const filter: ListExpensesQueryVariables['filter'] = { currency };
    const page: ListExpensesQueryVariables['page'] = { limit: DEFAULT_PAGE_LIMIT, offset: 0 };
    const sortOrder = isSortOrder(params.sortOrder) ? params.sortOrder : SortOrder.DESC;
    if (params.store) filter.store = params.store;
    if (params.paymentMethod) filter.paymentMethod = params.paymentMethod;
    if (isCategory(params.category)) filter.category = params.category;
    if (isDate(params.fromDate)) filter.fromDate = parseInt(params.fromDate);
    if (isDate(params.toDate)) filter.toDate = parseInt(params.toDate);
    const levels = Array.isArray(params.levels) ? params.levels : [params.levels];
    if (levels.every(isLevel)) filter.levels = levels;
    if (isPositiveInteger(params.limit)) page.limit = parseInt(params.limit);
    if (isPositiveInteger(params.page)) page.offset = (parseInt(params.page) - 1) * (page.limit as number);
    return { filter, page, sortOrder };
  }

  private getPagination([query, params]: [QueryState<ListExpensesQuery>, Filter]): Page {
    const length = query.data?.expenses.totalCount ?? 0;
    const pageIndex = isPositiveInteger(params.page) ? parseInt(params.page) - 1 : 0;
    const pageSize = isPositiveInteger(params.limit) ? parseInt(params.limit) : DEFAULT_PAGE_LIMIT;
    const pageSizeOptions = [25, 50, 75, 100];
    return { length, pageIndex, pageSize, pageSizeOptions };
  }

  private groupExpenses(query: QueryState<ListExpensesQuery>): GroupedExpense[] {
    const expenses = query.data?.expenses.items ?? [];
    if (!expenses.length) return [];
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

  displayErrorMessage(component: string): void {
    this.snackBar.open(`${component} under development`, 'Dismiss', { duration: 5000, verticalPosition: 'top' });
  }

  handlePageChange(event: PageEvent): void {
    const queryParams: Filter = structuredClone(this.router.routerState.snapshot.root.queryParams);
    queryParams.page = event.pageIndex > 0 ? (event.pageIndex + 1).toString() : undefined;
    queryParams.limit = event.pageSize !== DEFAULT_PAGE_LIMIT ? event.pageSize.toString() : undefined;
    this.router.navigate([], { queryParams });
  }
}
