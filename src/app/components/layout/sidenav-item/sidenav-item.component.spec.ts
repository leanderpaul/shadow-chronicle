/**
 * Importing npm packages
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

/**
 * Importing user defined packages
 */
import { SidenavItemComponent } from './sidenav-item.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

describe('SidenavItemComponent', () => {
  let component: SidenavItemComponent;
  let fixture: ComponentFixture<SidenavItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SidenavItemComponent] });
    fixture = TestBed.createComponent(SidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
