import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import {Image} from '../models/image';
import {Directory} from '../models/directory';

const API_URL = 'https://www.universeprojects.com/api/v1/';

@Injectable()
export class LibraryService {

  private directoryChangedSource = new Subject<string>();

  directoryChanged$ = this.directoryChangedSource.asObservable();

  private selectedLibraryId = '5764201201008640'; // <-- TODO: make this selectable by the user

  constructor(private http: Http) {
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message);
  }

  private getLibraryBaseUrl(): string {
    return API_URL + 'library/' + this.selectedLibraryId + '/';
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
    const url = this.getLibraryBaseUrl() + 'tree/';
    console.log('Retrieving directory tree, API: ' + url);

    return this.http.get(url, {headers: new Headers()})
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
    const url = this.getLibraryBaseUrl() + 'images/' + directory;
    console.log('Retrieving images for directory: ' + directory + ', API: ' + url);

    return this.http.get(url, {headers: new Headers()})
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
