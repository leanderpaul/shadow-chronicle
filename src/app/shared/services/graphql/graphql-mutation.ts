/**
 * Importing npm packages
 */
import { BehaviorSubject, type Observable, tap } from 'rxjs';

/**
 * Importing user defined packages
 */
import { type AppError } from '@app/shared/app-error';

import { GraphQLCache } from './graphql-cache';
import { type GraphQLOperation } from './graphql.generated';
import { type GraphQLService } from './graphql.service';
import { GraphQLUtils } from './graphql.utils';

/**
 * Defining types
 */

export interface MutationState<T> {
  mutating: boolean;
  data?: T;
  error?: AppError;
}

export interface MutationOptions {
  clearCache?: string[][];
}

/**
 * Declaring the constants
 */

export class GraphQLMutation<TData = unknown, TVariables = unknown> {
  private readonly state$ = new BehaviorSubject<MutationState<TData>>({ mutating: false });

  constructor(
    private readonly graphqlService: GraphQLService,
    private readonly operation: GraphQLOperation<TData, TVariables>,
    private readonly options: MutationOptions,
  ) {}

  private clearCache(variables?: TVariables, data?: TData) {
    if (!this.options.clearCache) return;
    const obj = { ...variables, ...data };
    for (const key of this.options.clearCache) {
      const cacheKey = GraphQLUtils.parseCacheKey(key, obj);
      GraphQLCache.clear(cacheKey);
    }
    this.graphqlService.refetchQueries();
  }

  getState(): MutationState<TData> {
    return this.state$.getValue();
  }

  getState$(): Observable<MutationState<TData>> {
    return this.state$.asObservable();
  }

  mutate(variables?: TVariables): Observable<TData> {
    if (variables) variables = GraphQLUtils.trimObject(variables);
    return this.graphqlService.request<TData, TVariables>(this.operation, variables).pipe(
      tap({
        next: data => this.state$.next({ mutating: false, data }),
        error: error => this.state$.next({ mutating: false, error }),
        complete: () => this.clearCache(),
      }),
    );
  }
}
