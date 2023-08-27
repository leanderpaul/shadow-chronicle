/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { ExpenseDetailsPage } from './expense-details.page';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('ExpenseDetailsComponent', () => {
  let component: ExpenseDetailsPage;
  let fixture: ComponentFixture<ExpenseDetailsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ExpenseDetailsPage] });
    fixture = TestBed.createComponent(ExpenseDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
