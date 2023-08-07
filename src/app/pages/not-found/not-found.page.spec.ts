/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { NotFoundPage } from './not-found.page';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('NotFoundComponent', () => {
  let component: NotFoundPage;
  let fixture: ComponentFixture<NotFoundPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotFoundPage] });
    fixture = TestBed.createComponent(NotFoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
