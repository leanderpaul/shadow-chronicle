/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { type AbstractControl, type FormArray, FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, type MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DateTime } from 'luxon';
import { type Observable, map } from 'rxjs';

/**
 * Importing user defined packages
 */
import { type AppError } from '@app/shared/app-error';
import { CapitalizePipe, IconizePipe, RangePipe } from '@app/shared/pipes';
import { Currency, ExpenseCategory, ExpenseVisibiltyLevel, FormService, GraphQLService, StoreService } from '@app/shared/services';
import { AddExpenseMutation, AddExpenseOperation, type ExpenseItem, GetUserMetadataOperation, type GraphQLMutation } from '@app/shared/services/graphql';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const snackbarOptions: MatSnackBarConfig = { duration: 2000, horizontalPosition: 'center', verticalPosition: 'top' };
const validatePrice = (control: AbstractControl): { price: number } | null => {
  const value = parseFloat(control.value);
  return !isNaN(value) && value === 0 ? { price: control.value } : null;
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    CapitalizePipe,
    IconizePipe,
    RangePipe,
  ],
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage {
  /** Constants */
  readonly categories = [ExpenseCategory.UNKNOWN, ...Object.values(ExpenseCategory).filter(category => category !== ExpenseCategory.UNKNOWN)];
  readonly levels = Object.values(ExpenseVisibiltyLevel);

  /** Observables */
  readonly paymentMethods$: Observable<string[]>;
  readonly stores$: Observable<string[]>;
  readonly storeLoc$: Observable<string[]>;
  readonly currency$: Observable<Currency>;
  readonly mutating$: Observable<boolean>;

  /** Form State */
  readonly expenseForm: FormGroup;
  readonly expenseItemsForm: FormArray;

  /** GraphQL Request */
  readonly mutation: GraphQLMutation<AddExpenseMutation>;

  constructor(
    private readonly storeService: StoreService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly formService: FormService,
    graphqlService: GraphQLService,
  ) {
    /** Initializing the GraphQL requests */
    this.mutation = graphqlService.mutation(AddExpenseOperation, null, { clearCache: [['expenses']] });
    const paymentMethods = graphqlService
      .query('user-metadata', GetUserMetadataOperation)
      .getState$()
      .pipe(map(result => result.data?.metadata?.paymentMethods ?? []));

    /** Initializing the form */
    this.expenseForm = this.createExpense();
    this.expenseItemsForm = this.expenseForm.get('items') as FormArray;

    /** Initializing the observables */
    this.currency$ = storeService.getCurrency$();
    this.mutating$ = this.mutation.getState$().pipe(map(state => state.mutating));

    const paymentMethod = this.expenseForm.get('paymentMethod') as AbstractControl;
    this.paymentMethods$ = formService.filterByInput(paymentMethods, paymentMethod.valueChanges);

    const store = this.expenseForm.get('store') as AbstractControl;
    this.stores$ = formService.filterByInput(storeService.getStore$(), store.valueChanges);

    const storeLoc = this.expenseForm.get('storeLoc') as AbstractControl;
    this.storeLoc$ = formService.filterByInput(storeService.getStoreLoc$(), storeLoc.valueChanges);
  }

  private createExpense(itemOnly = false): FormGroup {
    const itemForm = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, validatePrice]],
      qty: [1, [Validators.min(0.001)]],
    });
    if (itemOnly) return itemForm;

    const now = DateTime.local();
    return this.formBuilder.nonNullable.group({
      date: [now.toFormat('yyyy-MM-dd'), Validators.required],
      time: [now.toFormat('T')],
      store: ['', Validators.required],
      storeLoc: [''],
      category: [ExpenseCategory.UNKNOWN, [Validators.required]],
      level: [ExpenseVisibiltyLevel.STANDARD, [Validators.required]],
      bid: [''],
      paymentMethod: [''],
      desc: [''],
      items: this.formBuilder.nonNullable.array([itemForm]),
    });
  }

  getExpenseItemSuggestions(itemIndex: number): Observable<string[]> {
    const item = this.expenseItemsForm.at(itemIndex).get('name') as AbstractControl;
    return this.formService.filterByInput(this.storeService.getExpenseItem$(), item.valueChanges, item.value);
  }

  addExpenseItem(): void {
    this.expenseItemsForm.push(this.createExpense(true));
  }

  getTotal(itemIndex?: number): string {
    const itemsForm = this.expenseForm.get('items') as FormArray;
    const items = itemIndex != undefined ? [itemsForm.at(itemIndex)] : itemsForm.controls;
    const total = items.reduce((total, item) => {
      const price = item.get('price')?.value ?? 0;
      const qty = item.get('qty')?.value ?? 1;
      const subTotal = Math.round(price * qty * 100) / 100;
      return total + subTotal;
    }, 0);
    return total.toFixed(2);
  }

  addExpense(addMore?: boolean): void {
    /** Creating the expense object */
    const currency = this.storeService.getCurrency();
    const expense = { ...structuredClone(this.expenseForm.value), currency };
    expense.date = parseInt(DateTime.fromFormat(expense.date, 'yyyy-MM-dd').toFormat('yyMMdd'));
    expense.time = parseInt(DateTime.fromFormat(expense.time, 'T').toFormat('HHmm'));
    expense.items = expense.items.map((item: ExpenseItem) => ({ ...item, price: Math.round(item.price * 100) }));
    this.storeService.addStore(expense.store);
    this.storeService.addStoreLocation(expense.storeLoc);
    expense.items.forEach((item: ExpenseItem) => this.storeService.addExpenseItem(item.name));

    /** Send the GraphQL mutation request */
    this.mutation.mutate({ expense }).subscribe({
      complete: () => {
        this.snackBar.open('Expense added successfully', 'Close', { ...snackbarOptions, panelClass: 'success-snackbar' });
        if (addMore) {
          for (let index = 1; index < this.expenseItemsForm.length; ) this.expenseItemsForm.removeAt(1);
          this.expenseForm.reset();
        } else this.router.navigate(['expenses']);
      },
      error: (error: AppError) => this.snackBar.open(error.message, 'Close', { ...snackbarOptions, panelClass: 'error-snackbar' }),
    });
  }
}
