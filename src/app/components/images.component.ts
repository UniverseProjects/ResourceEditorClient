import {Component, OnInit} from '@angular/core';
import {LibraryService} from '../services/library.service';
import {Image} from '../data/image';

@Component({
    selector: 'app-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
    images: Image[] = [];

    constructor(
        private libraryService: LibraryService
    ) {}

    ngOnInit(): void {
        this.libraryService.getImages().then(images => {
            this.images = images;
        });
    }

    onSelect(image: Image): void {
        console.log('Attempting to select image: ' + image.url);
    }

    delete(image: Image): void {
        console.log('Attempting to delete image: ' + image.url);
    }
}
