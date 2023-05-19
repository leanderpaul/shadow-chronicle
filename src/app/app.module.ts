/**
 * Importing npm packages
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

/**
 * Importing user defined packages
 */
import { AppComponent } from './app.component';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const routes: Routes = [];
const AppRouteModule = RouterModule.forRoot(routes);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRouteModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
