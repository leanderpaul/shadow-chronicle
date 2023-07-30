/**
 * Importing npm packages
 */
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

/**
 * Importing user defined packages
 */
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthService } from './services';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const routes: Routes = [{ path: '**', component: NotFoundComponent }];
const AppRouteModule = RouterModule.forRoot(routes);
const verifyAuth = (authService: AuthService) => () => authService.verifyUser();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRouteModule, BrowserAnimationsModule, HttpClientModule, LayoutComponent],
  providers: [{ provide: APP_INITIALIZER, useFactory: verifyAuth, deps: [AuthService], multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
