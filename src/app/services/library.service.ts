import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import {Image} from '../data/image';
import {Directory} from '../data/directory';

const API_URL = 'https://www.universeprojects.com/api/v1/';
const LIBRARY_URL = API_URL + 'library/5764201201008640/';

const HEADERS = new Headers({
  // 'Content-Type': 'application/json',
});

@Injectable()
export class LibraryService {

  private directoryChangedSource = new Subject<string>();

  directoryChanged$ = this.directoryChangedSource.asObservable();

  constructor(private http: Http) {
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  /** recursive helper method */
  private buildDirectoryTree(json: any): Directory {
    const dir = new Directory();
    dir.name = json.name;
    dir.path = json.path;

    if (json.children) {
      json.children.forEach((child: any) => {
        dir.children.push(this.buildDirectoryTree(child));
      });
    }
    return dir;
  }

  changeDirectory(directory: string) {
    this.directoryChangedSource.next(directory);
  }

  getDirectoryTree(): Promise<Directory> {
    const url = LIBRARY_URL + 'tree/';
    console.log('Retrieving directory tree, URL: ' + url);

    return this.http.get(url, {headers: HEADERS})
      .toPromise()
      .then(response => {
        return this.buildDirectoryTree(response.json());
      })
      .catch(LibraryService.handleError);
  }

  getImages(directory: string): Promise<Image[]> {
    if (directory.startsWith('/')) {
      directory = directory.slice(1, directory.length);
    }
    const url = LIBRARY_URL + 'images/' + directory;
    console.log('Retrieving images for directory: ' + directory + ', URL: ' + url);

    return this.http.get(url, {headers: HEADERS})
      .toPromise()
      .then(response => {
        const images: Image[] = [];
        response.json().values.forEach((element: any) => {
          const imageUrl = element.gcsUrl;
          images.push(new Image(imageUrl));
        });
        return images;
      })
      .catch(LibraryService.handleError);
  }
}
