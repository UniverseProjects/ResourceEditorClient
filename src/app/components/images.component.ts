import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {LibraryService} from '../services/library.service';
import {Image} from '../models/image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnDestroy {
  images: Image[] = [];
  onDirectoryChanged: Subscription;

  constructor(private libraryService: LibraryService) {
    this.onDirectoryChanged = libraryService.directoryChanged$.subscribe(directory => {
      if (directory) {
        this.libraryService.getImages(directory).then(images => {
          this.images = images;
        });
      } else {
        this.images.length = 0;
      }
    });
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.onDirectoryChanged.unsubscribe();
  }

  onSelect(image: Image): void {
    console.log('Attempting to select image: ' + image.url);
  }
}
