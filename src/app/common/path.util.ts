export class PathUtil {

  static isValid(path: string): boolean {
    const dirRegExp = /^\/?([a-zA-Z0-9_\-]+\/)*([a-zA-Z0-9_\-]+(\/|\.[a-zA-Z0-9]{1,5})?)?$/g;
    return path && dirRegExp.test(path);
  }

  static combine(path1: string, path2: string): string {
    if (!PathUtil.isValid(path1)) {
      throw new Error('Invalid 1st path fragment: ' + path1);
    }
    if (!PathUtil.isValid(path2)) {
      throw new Error('Invalid 2nd path fragment: ' + path2);
    }
    if (!path1.endsWith('/')) {
      return path1 + '/' + path2;
    }
    else {
      return path1 + path2;
    }
  }

}
