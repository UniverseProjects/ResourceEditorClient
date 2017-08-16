
import {Injectable} from '@angular/core';
import {Image} from '../data/image';

const IMAGES: Image[] = [
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/NimbleShip1.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/NimbleShip2.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/NimbleShip3.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/Artist1GreenShip.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/Artist2Ship1.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/FastShip1.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/JunkerShip1.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/ViperMk2.png'),
    new Image('https://storage.googleapis.com/up-resource-library/images/ships/WraithShip1.png'),
];

@Injectable()
export class ImageService {
    getImages(): Promise<Image[]> {
        return Promise.resolve(IMAGES);
    }
}
