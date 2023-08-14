/**
 * Importing npm packages
 */
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { type Event, Router, RouterModule, type Routes, Scroll } from '@angular/router';
import { filter, pairwise, skip, take } from 'rxjs';

/**
 * Importing user defined packages
 */
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundPage } from './pages/not-found/not-found.page';
import { AuthService } from './shared/services';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const routes: Routes = [
  {
    path: 'expenses',
    children: [
      { path: '', loadComponent: () => import('./pages/expenses/expenses.page').then(m => m.ExpensesPage) },
      { path: 'add', loadComponent: () => import('./pages/expenses/add-expense/add-expense.page').then(m => m.AddExpensePage) },
    ],
  },
  { path: '**', component: NotFoundPage },
];
const AppRouteModule = RouterModule.forRoot(routes);
const verifyAuth = (authService: AuthService) => () => authService.getUser().pipe(skip(1), take(1));

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRouteModule, BrowserAnimationsModule, HttpClientModule, LayoutComponent, GraphQLModule],
  providers: [
    { provide: APP_INITIALIZER, useFactory: verifyAuth, deps: [AuthService], multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    router.events
      .pipe(
        filter((e: Event): e is Scroll => e instanceof Scroll),
        pairwise(),
      )
      .subscribe((e: Scroll[]) => {
        const element = document.getElementById('app-content') as HTMLElement;
        const previous = e[0] as Scroll;
        const current = e[1] as Scroll;
        if (current.position) element.scrollTo(...current.position);
        // else if (current.anchor) element.scrollTo(current.anchor);
        else if (previous.routerEvent.url !== current.routerEvent.url) element.scrollTo(0, 0);
      });
  }
}
