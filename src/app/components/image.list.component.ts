import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Http} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {PathUtil} from '../common/path.util';
import {ThumbnailProperties} from './thumbnails.component';

@Component({
  selector: 'image-list',
  styles: [`
  `],
  template: `
    <div class="image-list-container" *ngIf="active">
      <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
      <div class="controls-bottom row no-gutters">
        <div class="input-group col-xs-12 col-lg-8">
          <input #fileUploadInput type="file" accept=".png, .jpg" style="opacity: 0; width: 0px;" (change)="onFileSelectionUpdate($event); fileUploadInput.value = '';">
          <input id="uploadFileName" class="form-control" type="text" readonly value="{{fileToUpload ? fileToUpload.name : null}}" placeholder="Select image to upload" (click)="fileUploadInput.click();">
          <div class="input-group-btn">
            <button id="uploadImageBtn" class="btn btn-outline-success btn-with-icon" (click)="uploadImage()">&#8679; UPLOAD</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ImageListComponent implements OnInit, OnDestroy {
  active = false;
  images: Image[] = [];
  thumbnails: ThumbnailProperties[] = [];
  fileToUpload: File;

  private subscriptions: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private imageApi: ImageApi,
    private http: Http,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.IMAGE_LIST;
    }));

    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.IMAGE_LIST) {
        this.reloadContent();
      }
    }));

    this.subscriptions.push(this.explorerService.clearView$.subscribe((view) => {
      if (view === ExplorerView.IMAGE_LIST) {
        this.clear();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.explorerService.clearSelectedImage();
    this.fileToUpload = null;
    this.images.length = 0;
    this.thumbnails.length = 0;
  }

  reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading images');
    this.imageApi.findImage(libraryId, ApiHelper.path(currentDir), null, null, null, ApiHelper.requestOptions())
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.images = response.values;
        this.thumbnails = this.images.map(img => ImageListComponent.toThumbnail(img));
      },rejectReason => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load images (' + rejectReason + ')');
      });
  }

  static toThumbnail(image: Image): ThumbnailProperties {
    return {
      imageUrl: image.gcsUrl,
    };
  }

  onThumbnailSelected(selectedIndex: number) {
    const img = this.images[selectedIndex];
    this.explorerService.setSelectedImage(img);
    this.explorerService.openAndReloadView(ExplorerView.IMAGE_PREVIEW);
  }

  onFileSelectionUpdate(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      this.fileToUpload = null;
      return;
    }
    if (fileList.length > 1) {
      this.alertService.warn('Multiple file upload not supported');
      this.fileToUpload = null;
      return;
    }
    this.fileToUpload = fileList[0];
  }

  uploadImage() {
    if (!this.fileToUpload) {
      this.alertService.warn('Please select a file to upload');
      return;
    }

    let libraryId = this.explorerService.getSelectedLibraryId();
    let directoryPath = this.directoryService.getCurrentDirectoryPath();
    let fileName = this.fileToUpload.name;
    let filePath = PathUtil.combine(directoryPath, fileName);

    for (let image of this.images) {
      if (image.name === fileName) {
        this.alertService.warn('This directory already contains an image with name \"' + fileName + '\"');
        return;
      }
    }

    /*
     * At the time of this writing, generated method ImageApi.uploadImage() is broken and can't be used.
     * GitHub issue: https://github.com/swagger-api/swagger-codegen/issues/6006
     *
     */
    const uploadUrl = ApiHelper.BASE_URL + 'library/' + libraryId + '/uploadImage/' + ApiHelper.path(filePath);

    let formData = new FormData();
    formData.append('file', this.fileToUpload, fileName);
    // let headers = new Headers();
    // let options = new RequestOptions({ headers: headers });

    const operation = this.loaderService.startOperation('Uploading file...');
    this.http.post(uploadUrl, formData, ApiHelper.requestOptions())
      .map(res => res.json())
      .toPromise()
      .then(() => {
          operation.stop();
          this.alertService.success('\"' + fileName + '\" uploaded successfully to ' + directoryPath);
          this.reloadContent();
        },
        rejectReason => {
          operation.stop();
          this.alertService.error('Image upload failed (reason: ' + rejectReason + ')');
        }
      );

  }

}
