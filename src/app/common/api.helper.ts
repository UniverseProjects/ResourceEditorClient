import {PathUtil} from './path.util';
import {environment} from '../../environments/environment';
import {C} from './common';


export class ApiHelper {

  static readonly BASE_URL = 'https://www.universeprojects.com/api/v1/';

  static path(treePath: string): string {
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

  static requestOptions(): any {
    const apiKey = environment.apiKey;
    if (!C.defined(apiKey)) {
      throw new Error('API-key setting not defined in environment');
    }

    return {headers: {'API-Key': apiKey}};
  }

}
