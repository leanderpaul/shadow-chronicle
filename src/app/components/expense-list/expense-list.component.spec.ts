/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { ExpenseListComponent } from './expense-list.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ExpenseListComponent] });
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
