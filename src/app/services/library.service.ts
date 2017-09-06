import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Image} from '../models/image';
import {Directory} from '../models/directory';
import {Sprite} from '../models/sprite';
import {ExplorerService} from './explorer.service';

const API_URL = 'https://www.universeprojects.com/api/v1/';

@Injectable()
export class LibraryService {

  constructor(
    private http: Http,
    private explorerService: ExplorerService,
  ) { }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message);
  }

  static checkDirectoryInput(directory: string): string {
    if (!directory) {
      throw new Error('Directory must have a value (received: ' + directory + ')');
    }
    if (directory.startsWith('/')) {
      directory = directory.slice(1, directory.length);
    }
    return directory;
  }

  private getLibraryBaseUrl(): string {
    return API_URL + 'library/' + this.explorerService.geSelectedLibraryId() + '/';
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

  getDirectoryTree(): Promise<Directory> {
    const apiUrl = this.getLibraryBaseUrl() + 'tree/';
    console.log('Retrieving directory tree, API URL: ' + apiUrl);

    return this.http.get(apiUrl, {headers: new Headers()})
      .toPromise()
      .then(response => {
        const rootDirectory = this.buildDirectoryTree(response.json());
        rootDirectory.name = 'root';
        rootDirectory.path = '/';
        return rootDirectory;
      })
      .catch(LibraryService.handleError);
  }

  getImages(directory: string): Promise<Image[]> {
    directory = LibraryService.checkDirectoryInput(directory);
    const apiUrl = this.getLibraryBaseUrl() + 'images/' + directory;
    console.log('Retrieving images in directory: ' + directory + ', API URL: ' + apiUrl);

    return this.http.get(apiUrl, {headers: new Headers()})
      .toPromise()
      .then(response => {
        const images: Image[] = [];
        response.json().values.forEach((element: any) => {
          const gcsUrl = element.gcsUrl;
          images.push(new Image(gcsUrl));
        });
        return images;
      })
      .catch(LibraryService.handleError);
  }

  getSprites(directory: string): Promise<Sprite[]> {
    directory = LibraryService.checkDirectoryInput(directory);
    const apiUrl = this.getLibraryBaseUrl() + 'spriteTypes/' + directory;
    console.log('Retrieving sprites in directory: ' + directory + ', API URL: ' + apiUrl);

    return this.http.get(apiUrl, {headers: new Headers()})
      .toPromise()
      .then(response => {
        const sprites: Sprite[] = [];
        response.json().values.forEach((element: any) => {
          const gcsUrl = element.image.gcsUrl;
          sprites.push(new Sprite(gcsUrl));
        });
        return sprites;
      })
      .catch(LibraryService.handleError);
  }

}
