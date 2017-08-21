import {Component, OnInit} from '@angular/core';
import {ImageService} from '../services/image.service';
import {Image} from '../data/image';

@Component({
    selector: 'images-comp',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
    images: Image[] = [];

    constructor(
        private imageService: ImageService
    ) {}

    ngOnInit(): void {
        this.imageService.getImages().then(images => {
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
