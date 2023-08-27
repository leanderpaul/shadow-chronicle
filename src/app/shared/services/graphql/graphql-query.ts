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

export interface QueryState<T> {
  loading: boolean;
  fetching: boolean;
  data?: T;
  error?: AppError;
}

export interface QueryOptions {
  enabled?: boolean;
}

/**
 * Declaring the constants
 */

export class GraphQLQuery<TData = unknown, TVariables = unknown> {
  private readonly state$: BehaviorSubject<QueryState<TData>>;

  constructor(
    private readonly graphqlService: GraphQLService,
    private readonly cacheKey: string[],
    private readonly operation: GraphQLOperation<TData, TVariables>,
    private readonly options: QueryOptions,
  ) {
    if (this.options.enabled === false) {
      this.state$ = new BehaviorSubject<QueryState<TData>>({ loading: false, fetching: false });
      return;
    }

    const parsedCacheKey = this.getCacheKey();
    const data = GraphQLCache.get<TData>(parsedCacheKey);
    if (!data) this.fetch(operation.variables);
    this.state$ = new BehaviorSubject<QueryState<TData>>({ loading: !data, fetching: !data, data });
  }

  private getCacheKey(variables?: TVariables): string[] {
    if (!variables) variables = this.operation.variables;
    return GraphQLUtils.parseCacheKey(this.cacheKey, variables || {});
  }

  private fetch(variables?: TVariables) {
    return this.graphqlService
      .request<TData, TVariables>(this.operation, variables)
      .pipe(tap(data => GraphQLCache.set(this.getCacheKey(variables), data)))
      .subscribe({
        next: data => this.state$.next({ loading: false, fetching: false, data }),
        error: error => this.state$.next({ loading: false, fetching: false, error }),
      });
  }

  getState(): QueryState<TData> {
    return this.state$.getValue();
  }

  getState$(): Observable<QueryState<TData>> {
    return this.state$.asObservable();
  }

  refetch(variables?: Partial<TVariables>, skipCache?: boolean): this {
    const newVariables = { ...this.operation.variables, ...variables } as TVariables;
    if (variables && !skipCache) {
      const cacheKey = this.getCacheKey(newVariables);
      const data = GraphQLCache.get<TData>(cacheKey);
      if (this.state$.getValue().data === data) return this;
      if (data) {
        this.state$.next({ loading: false, fetching: false, data });
        return this;
      }
    }
    this.state$.next({ loading: false, fetching: true });
    this.fetch(newVariables);
    return this;
  }
}
