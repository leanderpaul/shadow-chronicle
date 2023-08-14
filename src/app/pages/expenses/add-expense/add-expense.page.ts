/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
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
import { type Subscription } from 'rxjs';

/**
 * Importing user defined packages
 */
import { AddExpenseGQL, Currency, ExpenseCategory, ExpenseVisibiltyLevel, GetUserMetadataGQL } from '@app/graphql/operations.graphql';
import { CapitalizePipe, IconizePipe, RangePipe } from '@app/shared/pipes';
import { StoreService } from '@app/shared/services';

/**
 * Defining types
 */

interface ExpenseItem {
  name: string;
  price: number;
  qty?: number;
}

/**
 * Declaring the constants
 */
const snackbarOptions: MatSnackBarConfig = { duration: 2000, horizontalPosition: 'center', verticalPosition: 'top' };

@Component({
  selector: 'app-add-expense',
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
export class AddExpensePage implements OnDestroy {
  private paymentMethods: string[] = [];
  private subscriptions: Subscription[] = [];
  private stores: string[] = [];
  private storeLocs: string[] = [];

  readonly categories = [ExpenseCategory.UNKNOWN, ...Object.values(ExpenseCategory).filter(category => category !== ExpenseCategory.UNKNOWN)];
  readonly levels = Object.values(ExpenseVisibiltyLevel);
  filteredPaymentMethods: string[] = [];
  filteredStores: string[] = [];
  filteredStoreLocs: string[] = [];

  currency: Currency;
  expenseForm: FormGroup;
  expenseItemsForm: FormArray;
  mutating = false;

  constructor(
    private readonly storeService: StoreService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly getUserMetadataGQL: GetUserMetadataGQL,
    private readonly addExpenseGQL: AddExpenseGQL,
  ) {
    const userMetadata = this.getUserMetadataGQL.watch().valueChanges;
    const userMetadata$ = userMetadata.subscribe(({ data }) => this.setPaymentMethods(data.metadata.paymentMethods));
    this.subscriptions.push(userMetadata$);

    this.expenseForm = this.createExpense();
    this.expenseItemsForm = this.expenseForm.get('items') as FormArray;
    this.setDefaultFormValues();

    const paymentMethod = this.expenseForm.get('paymentMethod');
    if (paymentMethod) {
      const paymentMethod$ = paymentMethod.valueChanges.subscribe(value => (this.filteredPaymentMethods = this.filterResults('paymentMethods', value)));
      this.subscriptions.push(paymentMethod$);
    }

    this.stores = this.storeService.getStores();
    this.filteredStores = this.stores;
    const store = this.expenseForm.get('store');
    if (store) {
      const store$ = store.valueChanges.subscribe(value => (this.filteredStores = this.filterResults('stores', value)));
      this.subscriptions.push(store$);
    }

    this.storeLocs = this.storeService.getStoreLocations();
    this.filteredStoreLocs = this.storeLocs;
    const storeLoc = this.expenseForm.get('storeLoc');
    if (storeLoc) {
      const storeLoc$ = storeLoc.valueChanges.subscribe(value => (this.filteredStoreLocs = this.filterResults('storeLocs', value)));
      this.subscriptions.push(storeLoc$);
    }

    const currency$ = this.storeService.currency.subscribe(currency => (this.currency = currency));
    this.subscriptions.push(currency$);
  }

  private setPaymentMethods(paymentMethods: string[]): void {
    this.paymentMethods = paymentMethods;
    const paymentMethod = this.expenseForm.get('paymentMethod')?.value ?? '';
    this.filteredPaymentMethods = this.filterResults('paymentMethods', paymentMethod);
  }

  private filterResults(key: 'stores' | 'storeLocs' | 'paymentMethods', value?: string): string[] {
    return this[key].filter(option => (value ? option.toLowerCase().includes(value.toLowerCase()) : true));
  }

  private createExpense(itemOnly = false): FormGroup {
    const itemForm = this.formBuilder.group({ name: ['', Validators.required], price: ['', [Validators.required, Validators.min(0.01)]], qty: [1, [Validators.min(0.01)]] });
    if (itemOnly) return itemForm;

    return this.formBuilder.group({
      date: ['', Validators.required],
      time: [''],
      store: ['', Validators.required],
      storeLoc: [''],
      category: ['', [Validators.required, Validators.pattern(Object.values(ExpenseCategory).join('|'))]],
      level: ['', [Validators.required, Validators.pattern(Object.values(ExpenseVisibiltyLevel).join('|'))]],
      bid: [''],
      paymentMethod: [''],
      desc: [''],
      items: this.formBuilder.array([itemForm]),
    });
  }

  private setDefaultFormValues(): void {
    const now = DateTime.local();
    this.expenseForm.patchValue({
      date: now.toFormat('yyyy-MM-dd'),
      time: now.toFormat('T'),
      category: ExpenseCategory.UNKNOWN,
      level: ExpenseVisibiltyLevel.STANDARD,
    });
  }

  private getSubTotal(item: AbstractControl): number {
    const price = item.get('price')?.value ?? 0;
    const qty = item.get('qty')?.value ?? 1;
    return Math.round(price * qty * 100) / 100;
  }

  private parseExpenseItem(item: ExpenseItem): ExpenseItem {
    const expenseItem = { ...item };
    expenseItem.price = Math.round(expenseItem.price * 100);
    if (expenseItem.qty === 1) delete expenseItem.qty;
    return expenseItem;
  }

  addExpenseItem(): void {
    this.expenseItemsForm.push(this.createExpense(true));
  }

  getTotal(itemIndex?: number): string {
    const itemsForm = this.expenseForm.get('items') as FormArray;
    const items = itemIndex != undefined ? [itemsForm.at(itemIndex)] : itemsForm.controls;
    const total = items.reduce((total, item) => total + this.getSubTotal(item), 0);
    return total.toFixed(2);
  }

  addExpense(addMore?: boolean): void {
    /** Creating the expense object */
    const expense = { ...structuredClone(this.expenseForm.value), currency: this.currency };
    expense.date = parseInt(DateTime.fromFormat(expense.date, 'yyyy-MM-dd').toFormat('yyMMdd'));
    expense.time = parseInt(DateTime.fromFormat(expense.time, 'T').toFormat('HHmm'));
    expense.items = expense.items.map(this.parseExpenseItem);
    Object.keys(expense).forEach(key => typeof expense[key] === 'string' && expense[key].trim() === '' && delete expense[key]);
    this.storeService.addStore(expense.store);
    this.storeService.addStoreLocation(expense.storeLoc);

    /** Send the GraphQL mutation request */
    this.mutating = true;
    const subscription$ = this.addExpenseGQL.mutate({ expense }).subscribe({
      next: () => {
        this.mutating = false;
        this.snackBar.open('Expense added successfully', 'Close', { ...snackbarOptions, panelClass: 'success-snackbar' });
        if (addMore) {
          for (let index = 1; index < this.expenseItemsForm.length; index++) this.expenseItemsForm.removeAt(1);
          this.expenseForm.reset();
          this.setDefaultFormValues();
        } else this.router.navigate(['expenses']);
      },
      error: () => {
        this.mutating = false;
        this.snackBar.open('Failed to add expense', 'Close', { ...snackbarOptions, panelClass: 'error-snackbar' });
      },
    });
    this.subscriptions.push(subscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
