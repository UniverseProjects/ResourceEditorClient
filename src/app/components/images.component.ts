import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'app-images',
  styles: [``],
  template: `
    <div class="app-images-container" *ngIf="active">
      <!--<h3>Images</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
  providers: [
    ImageApi,
  ],
})
export class ImagesComponent implements OnInit {
  active = false;
  images: Image[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private imageApi: ImageApi,
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

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }

  private loadImages(directory: string): void {
    if (!directory) {
      this.images.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    console.log('Loading images in directory: ' + directory);
    directory = ApiHelper.checkDirectory(directory);

    const OPNAME = 'Loading images';
    this.loaderService.startOperation(OPNAME);
    this.imageApi.findImage(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        this.images = response.values;
        this.thumbnailUrls = this.images.map(image => image.gcsUrl);

        this.loaderService.stopOperation(OPNAME);
      },rejectReason => {
        this.alertService.error('Failed to load images (' + rejectReason + ')');

        this.loaderService.stopOperation(OPNAME);
      })
      .catch(ApiHelper.handleError);
  }

}
