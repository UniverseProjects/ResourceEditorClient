
import {Injectable} from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Image} from '../data/image';

const API_URL = 'https://www.universeprojects.com/api/v1/';
const LIBRARY_URL = API_URL + 'library/5764201201008640/';

const HEADERS = new Headers({
  // 'Content-Type': 'application/json',
  // 'Access-Control-Allow-Origin': 'http://localhost:3000',
});

@Injectable()
export class LibraryService {

  constructor(private http: Http) {
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getImages(directory: string): Promise<Image[]> {
    console.log('Retrieving images for directory: ' + directory);
    const url = LIBRARY_URL + 'images/' + directory;

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
