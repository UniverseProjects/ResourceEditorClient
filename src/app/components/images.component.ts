import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';

@Component({
  selector: 'app-images',
  styles: [`
    .controls-top {
      margin-bottom: 10px;
    }

    .controls-bottom {
      margin-top: 10px;
    }

    .image-preview-container {
      margin-bottom: 20px;
    }

    .image-preview {
      max-width: 400px;
      max-height: 400px;
    }
  `],
  template: `
    <div class="app-images-container" *ngIf="active">
      <div [hidden]="selectedImage">
        <div class="controls-top">
          <button class="btn btn-primary" (click)="uploadImage()">Upload new image</button>
        </div>
        <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
      </div>
      <div *ngIf="selectedImage">
        <div class="image-preview-container">
          <img class="image-preview" src="{{selectedImage.gcsUrl}}"/>
        </div>
        <app-properties [object]="selectedImage"></app-properties>
        <div class="controls-bottom">
          <button class="btn btn-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this image?"
                  (confirm)="deleteImage()">Delete this image</button>
        </div>
      </div>
    </div>
  `,
})
export class ImagesComponent implements OnInit {
  active = false;
  images: Image[] = [];
  thumbnailUrls: string[] = [];
  selectedImage: Image = null;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private imageApi: ImageApi,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.IMAGES) {
        this.loadImages(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadImages(null);
        this.active = false;
      }
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    this.selectedImage = this.images[selectedIndex];
  }

  uploadImage() {
    this.alertService.warn('Not implemented yet!')
  }

  deleteImage() {
    this.alertService.warn('Not implemented yet!');
  }

  private loadImages(directory: string): void {
    this.selectedImage = null;
    if (!directory) {
      this.images.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    console.log('Loading images in directory: ' + directory);
    directory = ApiHelper.verifyPath(directory);

    const operation = this.loaderService.startOperation('Loading images');
    this.imageApi.findImage(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        operation.stop();
        this.images = response.values;
        this.thumbnailUrls = this.images.map(image => image.gcsUrl);
      },rejectReason => {
        operation.stop();
        this.alertService.error('Failed to load images (' + rejectReason + ')');
      });
  }

}
