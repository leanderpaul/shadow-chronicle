/**
 * Importing npm packages
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

/**
 * Importing user defined packages
 */
import { AppModule } from './app/app.module';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err)); // eslint-disable-line no-console
