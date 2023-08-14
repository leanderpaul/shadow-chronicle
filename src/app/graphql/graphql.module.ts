/**
 * Importing npm packages
 */
import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

/**
 * Importing user defined packages
 */
import { AuthService } from '@app/shared/services';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const cache = new InMemoryCache({
  typePolicies: {
    Expense: { keyFields: ['eid'] },
    ExpenseConnection: { keyFields: [] },
  },
});

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authService: AuthService) => {
        const http = httpLink.create({ uri: '/graphql' });
        const middleware = new ApolloLink((operation, forward) => {
          const csrfToken = authService.getCSRFToken();
          operation.setContext({ headers: new HttpHeaders().set('x-csrf-token', csrfToken) });
          return forward(operation);
        });
        return { link: middleware.concat(http), cache };
      },
      deps: [HttpLink, AuthService],
    },
  ],
})
export class GraphQLModule {}
