/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Importing user defined packages
 */
import { CapitalizePipe, IconizePipe } from '@app/shared/pipes';

import { ExpenseListItemComponent } from './expense-list-item/expense-list-item.component';
import { ExpenseListComponent } from './expense-list.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

@NgModule({
  declarations: [ExpenseListComponent, ExpenseListItemComponent],
  imports: [CommonModule, MatCardModule, CapitalizePipe, MatIconModule, IconizePipe],
  exports: [ExpenseListComponent],
})
export class ExpenseListModule {}
