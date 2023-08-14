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
const STORES_STORE_KEY = 'shadow-chronicle:stores';
const STORE_LOCATIONS_STORE_KEY = 'shadow-chronicle:store-locations';

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

  getStores(): string[] {
    const stores = localStorage.getItem(STORES_STORE_KEY);
    return stores ? JSON.parse(stores) : [];
  }

  addStore(store: string): void {
    const stores = this.getStores();
    if (stores.includes(store)) return;
    stores.push(store);
    localStorage.setItem(STORES_STORE_KEY, JSON.stringify(stores));
  }

  getStoreLocations(): string[] {
    const storeLocations = localStorage.getItem(STORE_LOCATIONS_STORE_KEY);
    return storeLocations ? JSON.parse(storeLocations) : [];
  }

  addStoreLocation(storeLocation: string): void {
    const storeLocations = this.getStoreLocations();
    if (storeLocations.includes(storeLocation)) return;
    storeLocations.push(storeLocation);
    localStorage.setItem(STORE_LOCATIONS_STORE_KEY, JSON.stringify(storeLocations));
  }
}
