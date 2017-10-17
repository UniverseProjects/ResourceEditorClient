/** Commonly-used functions */
// TODO: see if it's possible to make these global functions (attempted once, however wasn't able to get it to work at runtime)
export class C {

  static defined(value: any): boolean {
    return value !== null && value !== undefined;
  }

  static xor(a: any, b: any): boolean {
    return (a && !b) || (!a && b);
  }

  static emptyStr(s: string): boolean {
    return !C.defined(s) || s.trim().length === 0;
  }

}
