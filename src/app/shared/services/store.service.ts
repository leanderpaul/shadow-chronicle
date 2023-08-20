/**
 * Importing npm packages
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable } from 'rxjs';

/**
 * Importing user defined packages
 */
import { Currency } from '@app/shared/services';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const MAX_STORE_ARRAY_LENGTH = 100;
const CURRENCY_STORE_KEY = 'shadow-chronicle:currency';
const SHOP_STORE_KEY = 'shadow-chronicle:shop';
const STOP_LOCATIONS_STORE_KEY = 'shadow-chronicle:shop-locations';
const EXPENSE_ITEM_STORE_KEY = 'shadow-chronicle:expense-item';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly currency$: BehaviorSubject<Currency>;
  private readonly store$: BehaviorSubject<string[]>;
  private readonly storeLoc$: BehaviorSubject<string[]>;
  private readonly expenseItem$: BehaviorSubject<string[]>;

  constructor() {
    const currency = this.getStoreValue(CURRENCY_STORE_KEY, Currency.GBP);
    this.currency$ = new BehaviorSubject<Currency>(currency);

    const stores = this.getStoreValue<string[]>(SHOP_STORE_KEY, []);
    this.store$ = new BehaviorSubject<string[]>(stores);

    const storeLocs = this.getStoreValue<string[]>(STOP_LOCATIONS_STORE_KEY, []);
    this.storeLoc$ = new BehaviorSubject<string[]>(storeLocs);

    const expenseItems = this.getStoreValue<string[]>(EXPENSE_ITEM_STORE_KEY, []);
    this.expenseItem$ = new BehaviorSubject<string[]>(expenseItems);
  }

  private getStoreValue<T>(key: string, defaultValue: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      localStorage.removeItem(key);
      return defaultValue;
    }
  }

  private setStoreValue<T>(key: string, value: T): void {
    const string = JSON.stringify(value);
    localStorage.setItem(key, string);
  }

  private addStoreValue(key: string, value: string): string[] {
    const values = this.getStoreValue<string[]>(key, []);
    const updatedValues = [value, ...values.filter((item, index) => index < MAX_STORE_ARRAY_LENGTH && item && item !== value)];
    this.setStoreValue(key, updatedValues);
    return updatedValues;
  }

  getCurrency(): Currency {
    return this.currency$.getValue();
  }

  getCurrency$(): Observable<Currency> {
    return this.currency$.asObservable();
  }

  setCurrency(currency: Currency): void {
    this.currency$.next(currency);
    this.setStoreValue(CURRENCY_STORE_KEY, currency);
  }

  getStores(): string[] {
    return this.store$.getValue();
  }

  getStore$(): Observable<string[]> {
    return this.store$.asObservable();
  }

  addStore(store?: string | null): void {
    if (!store) return;
    const stores = this.addStoreValue(SHOP_STORE_KEY, store);
    this.store$.next(stores);
  }

  getStoreLocs(): string[] {
    return this.storeLoc$.getValue();
  }

  getStoreLoc$(): Observable<string[]> {
    return this.storeLoc$.asObservable();
  }

  addStoreLocation(storeLocation?: string | null): void {
    if (!storeLocation) return;
    const storeLocations = this.addStoreValue(STOP_LOCATIONS_STORE_KEY, storeLocation);
    this.storeLoc$.next(storeLocations);
  }

  getExpenseItems(): string[] {
    return this.expenseItem$.getValue();
  }

  getExpenseItem$(): Observable<string[]> {
    return this.expenseItem$.asObservable();
  }

  addExpenseItem(expenseItem?: string | null): void {
    if (!expenseItem) return;
    const expenseItems = this.addStoreValue(EXPENSE_ITEM_STORE_KEY, expenseItem);
    this.expenseItem$.next(expenseItems);
  }
}
