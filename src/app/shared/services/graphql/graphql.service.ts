/**
 * Importing npm packages
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, catchError, map } from 'rxjs';

/**
 * Importing user defined packages
 */
import { AppError } from '@app/shared/app-error';
import { AuthService, type GraphQLOperation } from '@app/shared/services';

import { GraphQLMutation, type MutationOptions } from './graphql-mutation';
import { GraphQLQuery, type QueryOptions } from './graphql-query';
import { type GraphQLError } from './graphql.generated';

/**
 * Defining types
 */

export type GraphQLResponse<TData> = { data: TData } | { errors: GraphQLError[] };

export interface GraphQLBody {
  query: string;
  variables?: object;
  operationName?: string;
}

/**
 * Declaring the constants
 */

@Injectable({ providedIn: 'root' })
export class GraphQLService {
  private readonly graphqlEndpoint = '/graphql';
  private readonly queries = new Map<string, WeakRef<GraphQLQuery<any, any>>>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  private counter = 0;

  constructor(private readonly httpClient: HttpClient, private readonly authService: AuthService) {}

  private addQuery<T, U>(query: GraphQLQuery<T, U>): void {
    const weakQuery = new WeakRef(query);
    this.queries.set(`${this.counter++}`, weakQuery);
    for (const [key, query] of this.queries) {
      const queryRef = query.deref();
      if (!queryRef) this.queries.delete(key);
    }
  }

  refetchQueries(): void {
    for (const [key, query] of this.queries) {
      const queryRef = query.deref();
      if (!queryRef) this.queries.delete(key);
      else queryRef.refetch();
    }
  }

  request<TData, TVariables>(operation: GraphQLOperation<TData, TVariables>, variables?: TVariables): Observable<TData> {
    const headers: Record<string, string> = {};
    if (operation.type === 'Mutation') headers['x-csrf-token'] = this.authService.getUser('csrfToken');

    const body: GraphQLBody = { query: operation.query };
    if (variables && Object.keys(variables).length) body.variables = variables;
    if (operation.name) body.operationName = operation.name;

    return this.httpClient.post<GraphQLResponse<TData>>(this.graphqlEndpoint, body, { headers }).pipe(
      catchError(error => AppError.parseError(error, true)),
      map(response => ('errors' in response ? AppError.parseGraphQLError(response.errors, true) : response.data)),
    );
  }

  query<TData, TVariables>(
    cacheKey: string | string[],
    operation: GraphQLOperation<TData, TVariables>,
    variables: TVariables | null = null,
    options: QueryOptions = {},
  ): GraphQLQuery<TData, TVariables> {
    if (typeof cacheKey === 'string') cacheKey = [cacheKey];
    if (variables) operation.variables = variables;
    const query = new GraphQLQuery<TData, TVariables>(this, cacheKey, operation, options);
    this.addQuery(query);
    return query;
  }

  mutation<TData, TVariables>(
    mutation: GraphQLOperation<TData, TVariables>,
    variables: TVariables | null = null,
    options: MutationOptions = {},
  ): GraphQLMutation<TData, TVariables> {
    if (variables) mutation.variables = variables;
    return new GraphQLMutation<TData, TVariables>(this, mutation, options);
  }
}
