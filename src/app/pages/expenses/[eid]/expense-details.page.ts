/**
 * Importing npm packages
 */
import { CommonModule, Location } from '@angular/common';
import { Component, type OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { type Subscription } from 'rxjs';

/**
 * Importing user defined packages
 */
import { NotFoundPage } from '@app/pages/not-found/not-found.page';
import { CapitalizePipe, FormatterPipe, IconizePipe } from '@app/shared/pipes';
import { type ExpenseItem, GetExpenseOperation, type GetExpenseQuery, type GetExpenseQueryVariables, type GraphQLQuery, GraphQLService } from '@app/shared/services';

/**
 * Defining types
 */

interface ParsedExpenseItem {
  name: string;
  qty: number;
  price: string;
  total: string;
}

/**
 * Declaring the constants
 */

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NotFoundPage,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatTableModule,
    FormatterPipe,
    CapitalizePipe,
    IconizePipe,
  ],
  templateUrl: './expense-details.page.html',
  styleUrls: ['./expense-details.page.scss'],
})
export class ExpenseDetailsPage implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private eid: string;

  readonly query: GraphQLQuery<GetExpenseQuery, GetExpenseQueryVariables>;
  readonly columns = ['name', 'qty', 'price', 'total'];

  constructor(
    readonly location: Location,
    activatedRoute: ActivatedRoute,
    graphqlService: GraphQLService,
  ) {
    this.eid = activatedRoute.snapshot.paramMap.get('eid') as string;
    this.query = graphqlService.query(['expense', '{{eid}}'], GetExpenseOperation, { eid: this.eid });

    const subscription = activatedRoute.paramMap.subscribe(paramsMap => this.getExpenseDetails(paramsMap.get('eid') as string));
    this.subscriptions.push(subscription);
  }

  private getExpenseDetails(eid?: string | null): void {
    if (!eid || !/^[0-9a-f]{24}$/.test(eid) || this.eid === eid) return;
    this.eid = eid;
    this.query.refetch({ eid });
  }

  parseExpenseItems(items: ExpenseItem[]): ParsedExpenseItem[] {
    return items.map(item => ({
      name: item.name,
      qty: item.qty,
      price: (item.price / 100).toFixed(2),
      total: ((item.qty * item.price) / 100).toFixed(2),
    }));
  }

  getTotal(items: ExpenseItem[]): string {
    const total = items.reduce((total, item) => total + item.qty * item.price, 0);
    return (total / 100).toFixed(2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
