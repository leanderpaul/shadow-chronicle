/**
 * Importing npm packages
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Importing user defined packages
 */
import { Currency } from '@app/graphql/operations.graphql';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const CURRENCY_STORE_KEY = 'shadow-chronicle:currency';

@Injectable({ providedIn: 'root' })
export class StoreService {
  currency: BehaviorSubject<Currency>;

  constructor() {
    const currency = (localStorage.getItem(CURRENCY_STORE_KEY) as Currency) || Currency.GBP;
    this.currency = new BehaviorSubject<Currency>(currency);
  }

  setCurrency(currency: Currency): void {
    this.currency.next(currency);
    localStorage.setItem(CURRENCY_STORE_KEY, currency);
  }
}
