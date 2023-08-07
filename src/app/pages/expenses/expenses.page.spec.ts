/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { ExpensesPage } from './expenses.page';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('ExpensesComponent', () => {
  let component: ExpensesPage;
  let fixture: ComponentFixture<ExpensesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ExpensesPage] });
    fixture = TestBed.createComponent(ExpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
