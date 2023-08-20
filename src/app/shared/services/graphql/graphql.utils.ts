/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

export type NonNullJSONData = string | number | boolean | JSONData[] | { [key: string]: NonNullJSONData };

export type JSONData = string | number | boolean | null | JSONData[] | { [key: string]: JSONData };

/**
 * Declaring the constants
 */

export class GraphQLUtils {
  static getEndpoint(): string {
    return '/graphql';
  }

  static getHeaders(): Headers {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    return headers;
  }

  static substituteKey(str: string, object: object): string {
    return str.replace(/{{(.*?)}}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value: any = object; // eslint-disable-line @typescript-eslint/no-explicit-any
      for (const k of keys) {
        if (value[k]) value = value[k];
        else return match; // Retain the original placeholder if key not found
      }
      return value.toString();
    });
  }

  static parseCacheKey(cacheKey: string[], object: object): string[] {
    return cacheKey.map(key => this.substituteKey(key, object));
  }

  static trimObject<T>(input: T): T {
    const object = input as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const key in object) {
      const value = object[key];
      if (typeof value === 'object') {
        if (Array.isArray(value)) value.forEach(v => this.trimObject(v));
        else this.trimObject(value);
      } else if (typeof value === 'string') {
        object[key] = value.trim();
        if (value.trim() === '') delete object[key];
      }
    }
    return object;
  }
}
