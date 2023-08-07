/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { ExpenseListItemComponent } from './expense-list-item.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('ExpenseListItemComponent', () => {
  let component: ExpenseListItemComponent;
  let fixture: ComponentFixture<ExpenseListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ExpenseListItemComponent] });
    fixture = TestBed.createComponent(ExpenseListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
