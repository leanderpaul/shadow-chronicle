/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { NotFoundComponent } from './not-found.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotFoundComponent] });
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
