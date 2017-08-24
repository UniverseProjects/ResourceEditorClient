
import {Injectable} from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Image} from '../data/image';

const BASE_URL = 'https://storage.googleapis.com/up-resource-library/import/webapp/images/';
const SOME_IMAGES: Image[] = [
    new Image(BASE_URL + 'ships/NimbleShip1.png'),
    new Image(BASE_URL + 'ships/NimbleShip2.png'),
    new Image(BASE_URL + 'ships/NimbleShip3.png'),
    new Image(BASE_URL + 'ships/Artist1GreenShip.png'),
    new Image(BASE_URL + 'ships/Artist2Ship1.png'),
    new Image(BASE_URL + 'ships/FastShip1.png'),
    new Image(BASE_URL + 'ships/JunkerShip1.png'),
    new Image(BASE_URL + 'ships/ViperMk2.png'),
    new Image(BASE_URL + 'ships/WraithShip1.png'),
];

@Injectable()
export class LibraryService {

    private headers = new Headers({
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
    });
    private imagesUrl = 'https://www.universeprojects.com/api/v1/library/5764201201008640/image';

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getImages(): Promise<Image[]> {
        // return Promise.resolve(IMAGES);
        return this.http.get(this.imagesUrl, {headers: this.headers})
            .toPromise()
            .then(response => {
                const images: Image[] = [];
                response.json().values.forEach((element: any) => {
                    const url = element.gcsUrl.replace('up-resource-library/images/', 'up-resource-library/import/webapp/images/');
                    images.push(new Image(url));
                });
                return images;
            })
            .catch(this.handleError);
    }
}
