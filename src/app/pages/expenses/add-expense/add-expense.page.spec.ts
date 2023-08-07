/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { AddExpensePage } from './add-expense.page';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('AddExpenseComponent', () => {
  let component: AddExpensePage;
  let fixture: ComponentFixture<AddExpensePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AddExpensePage] });
    fixture = TestBed.createComponent(AddExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
