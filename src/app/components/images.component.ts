import {Component} from '@angular/core';

import {LibraryService} from '../services/library.service';
import {Image} from '../models/image';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-images',
  template: `
    <app-thumbnails [imageUrls]="imageUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
  `,
  styles: [``],
})
export class ImagesComponent {
  images: Image[] = [];
  imageUrls: string[] = [];

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
      this.imageUrls.length = 0;
      return;
    }

    const OPNAME = 'Loading images in directory ' + directory;
    this.loaderService.startOperation(OPNAME);
    this.libraryService.getImages(directory).then(images => {
      this.images = images;
      this.imageUrls = images.map(image => image.url);

      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load images (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected image index: ' + selectedIndex);
  }
}
