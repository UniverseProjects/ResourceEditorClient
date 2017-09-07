export class ApiHelper {

  static checkDirectory(directory: string): string {
    if (!directory || !/^\/(\w+\/)*(\w+)?$/g.test(directory)) {
      throw new Error('Invalid directory: ' + directory);
    }
    if (directory.startsWith('/')) {
      directory = directory.slice(1, directory.length);
    }
    return directory;
  }

  static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message);
  }

}
