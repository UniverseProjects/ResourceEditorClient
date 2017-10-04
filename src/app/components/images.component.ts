import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Headers, Http, RequestOptions} from '@angular/http';

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
    #uploadFileName {
      width: 200px;
    }
    #uploadImageBtn {
      margin-left: 10px;
    }
    
  `],
  template: `
    <div class="app-images-container" *ngIf="active">
      <div [hidden]="selectedImage">
        <div class="controls-top">
          <div class="input-group">
            <label class="input-group-btn">
              <span class="btn btn-default">
                  Browse&hellip; <input type="file" accept=".png, .jpg" style="display: none;" (change)="onFileSelectionUpdate($event)">
              </span>
            </label>
            <input id="uploadFileName" type="text" class="form-control" readonly placeholder="Select image to upload" value="{{fileToUpload ? fileToUpload.name : null}}">
            <button id="uploadImageBtn" class="btn btn-default" (click)="uploadImage()">&#9658; UPLOAD</button>
          </div>
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
  selectedImage: Image;
  fileToUpload: File;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private imageApi: ImageApi,
    private http: Http,
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

  onFileSelectionUpdate(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      this.fileToUpload = null;
      return;
    }
    if (fileList.length > 1) {
      this.alertService.warn('Unsupported: multiple file upload');
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

    let formData:FormData = new FormData();
    formData.append('uploadFile', this.fileToUpload, this.fileToUpload.name);
    let headers = new Headers();
    /** No need to include Content-Type in Angular 4 */
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    let libraryId = this.explorerService.getSelectedLibraryId();
    let path = ApiHelper.verifyPath(this.directoryService.getCurrentDirectoryPath());
    const uploadUrl = 'https://www.universeprojects.com/api/v1/upload/' + libraryId + '/' + path;

    const operation = this.loaderService.startOperation('Uploading file...');
    this.http.post(uploadUrl, formData, options)
      .map(res => res.json())
      .toPromise()
      .then(() => {
          operation.stop();
          console.log('upload success');
        },
        rejectReason => {
          operation.stop();
          console.log('upload rejected: ' + rejectReason);
          this.alertService.error('Image upload failed (reason: ' + rejectReason + ')');
        }
      );
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
