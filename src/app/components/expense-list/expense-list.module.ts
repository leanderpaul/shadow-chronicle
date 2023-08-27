/**
 * Importing npm packages
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule, MatCardModule, MatMenuModule, CapitalizePipe, MatIconModule, IconizePipe],
  exports: [ExpenseListComponent],
})
export class ExpenseListModule {}
