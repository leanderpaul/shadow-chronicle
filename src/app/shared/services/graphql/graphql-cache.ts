/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

type CacheValue = object | Map<string, CacheValue>;

/**
 * Declaring the constants
 */

class GraphQLCacheService {
  private readonly cache = new Map<string, CacheValue>();

  get<T>(key: string[]): T | undefined {
    let value: CacheValue | undefined = this.cache;
    for (const k of key) {
      value = (value as Map<string, CacheValue>).get(k);
      if (!value) return;
    }
    return value as T;
  }

  set<T>(key: string[], value: T): void {
    let cache = this.cache;
    for (const k of key.slice(0, -1)) {
      let nextCache = cache.get(k);
      if (!nextCache) {
        nextCache = new Map<string, CacheValue>();
        cache.set(k, nextCache);
      }
      cache = nextCache as Map<string, CacheValue>;
    }
    cache.set(key[key.length - 1] as string, value as CacheValue);
  }

  clear(key?: string[]): void {
    if (typeof key === 'undefined') return this.cache.clear();
    let cache = this.cache;
    for (const k of key.slice(0, -1)) {
      const nextCache = cache.get(k);
      if (!nextCache) return;
      cache = nextCache as Map<string, CacheValue>;
    }
    cache.delete(key[key.length - 1] as string);
  }
}

const globalRef = window as { GraphQLCacheService?: GraphQLCacheService };
export const GraphQLCache: GraphQLCacheService = globalRef.GraphQLCacheService || (globalRef.GraphQLCacheService = new GraphQLCacheService());
