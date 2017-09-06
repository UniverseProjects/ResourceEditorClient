import {Component, OnInit} from '@angular/core';

import {LibraryService} from '../services/library.service';
import {Image} from '../models/image';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService, ContentType} from '../services/explorer.service';

@Component({
  selector: 'app-images',
  styles: [``],
  template: `
    <div class="app-images-container" *ngIf="active">
      <!--<h3>Images</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
})
export class ImagesComponent implements OnInit {
  active = false;
  images: Image[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private libraryService: LibraryService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.IMAGES) {
        this.loadImages(this.explorerService.getCurrentDirectory());
        this.active = true;
      } else {
        this.loadImages(null);
        this.active = false;
      }
    });
  }

  private loadImages(directory: string): void {
    if (!directory) {
      this.images.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    const OPNAME = 'Loading images in directory ' + directory;
    this.loaderService.startOperation(OPNAME);
    this.libraryService.getImages(directory).then(images => {
      this.images = images;
      this.thumbnailUrls = images.map(image => image.gcsUrl);

      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load images (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }
}
