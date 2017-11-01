/** Commonly-used functions */
// TODO: see if it's possible to make these global functions (attempted once, however wasn't able to get it to work at runtime)
export class C {

  static xor(a: any, b: any): boolean {
    return (a && !b) || (!a && b);
  }

  static defined(value: any): boolean {
    return value !== null && value !== undefined;
  }

  static checkDefined(value: any): any {
    if (!C.defined(value)) {
      throw new Error('Expected value to be defined')
    }
    return value;
  }

  static emptyStr(s: string): boolean {
    return !C.defined(s) || s.trim().length === 0;
  }

  static checkNotEmpty(s: string): string {
    if (C.emptyStr(s)) {
      throw new Error('Expected non-empty string value');
    }
    return s;
  }

}
