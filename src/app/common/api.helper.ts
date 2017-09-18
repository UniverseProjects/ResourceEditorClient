import {PathUtil} from './path.util';

export class ApiHelper {

  static verifyPath(treePath: string): string {
    if (!PathUtil.isValid(treePath)) {
      throw new Error('Invalid tree path: ' + treePath);
    }
    if (treePath.startsWith('/')) {
      treePath = treePath.slice(1, treePath.length);
    }
    if (treePath.endsWith('/')) {
      treePath = treePath.slice(0, treePath.length - 1);
    }
    return treePath;
  }

}
