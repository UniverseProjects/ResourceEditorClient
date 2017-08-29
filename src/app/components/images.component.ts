import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {LibraryService} from '../services/library.service';
import {Image} from '../models/image';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent {
  images: Image[] = [];

  constructor(
    private libraryService: LibraryService,
    private alertService: AlertService,
    private loaderService: LoaderService,
  ) {
    libraryService.directoryChanged$.subscribe(directory => this.loadImages(directory));
  }

  private loadImages(directory: string): void {
    if (!directory) {
      this.images.length = 0;
      return;
    }

    const OPNAME = 'Loading images in directory ' + directory;
    this.loaderService.startOperation(OPNAME);
    this.libraryService.getImages(directory).then(images => {
      this.images = images;
      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load images (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });



  }

  onSelect(image: Image): void {
    console.log('Attempting to select image: ' + image.url);
  }
}
