import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {PathUtil} from '../common/path.util';
import {ImageFrameProperties} from './image.frame.component';
import {ThumbnailProperties} from './thumbnails.component';

@Component({
  selector: 'images-view',
  styles: [`    
    .preview-container {
      margin-bottom: 20px;
    }
  `],
  template: `
    <div class="images-view-container" *ngIf="active">
      <div [hidden]="selected">
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
      <div *ngIf="selected">
        <div class="controls-top">
          <button type="button" class="btn btn-info btn-with-icon" (click)="clearSelection()">&#8678; Back to directory</button>
          <button type="button" class="btn btn-outline-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this image?"
                  (confirm)="deleteImage()">Delete this image
          </button>
          <button type="button" class="btn btn-outline-success" (click)="createSpriteType()">Create sprite type</button>
        </div>
        <div class="preview-container">
          <image-frame [properties]="selectedFrameProps"></image-frame>
        </div>
        <properties [object]="selected"></properties>
        <div class="controls-bottom">
        </div>
      </div>
    </div>
  `,
})
export class ImagesViewComponent implements OnInit, OnDestroy {
  active = false;
  images: Image[] = [];
  thumbnails: ThumbnailProperties[] = [];
  fileToUpload: File;
  selected: Image;
  selectedFrameProps: ImageFrameProperties;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private imageApi: ImageApi,
    private http: Http,
  ) { }

  ngOnInit() {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.IMAGES) {
        this.reloadContent();
        this.active = true;
      } else {
        this.clear();
        this.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onThumbnailSelected(selectedIndex: number) {
    let image = this.images[selectedIndex];
    this.selected = image;
    this.selectedFrameProps = {
      width: 400,
      height: 400,
      imageUrl: image.gcsUrl,
      imageBorder: true,
    }
  }

  clearSelection() {
    this.selected = null;
    this.selectedFrameProps = null;
  }

  clear() {
    this.fileToUpload = null;
    this.images.length = 0;
    this.thumbnails.length = 0;
    this.selected = null;
    this.selectedFrameProps = null;
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
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });

    const operation = this.loaderService.startOperation('Uploading file...');
    this.http.post(uploadUrl, formData, options)
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

  deleteImage() {
    if (!this.selected) {
      this.alertService.warn('Please select an image to delete');
      return;
    }

    let libraryId = this.explorerService.getSelectedLibraryId();
    let treePath = this.selected.treePath;

    let operation = this.loaderService.startOperation('Deleting image');
    this.imageApi.deleteImage(libraryId, ApiHelper.path(treePath))
      .toPromise()
      .then(() => {
          operation.stop();
          this.alertService.success('Image deleted: ' + treePath);
          this.reloadContent();
        },
        rejectReason => {
          operation.stop();
          this.alertService.error('Image deletion failed (reason: ' + rejectReason + ')');
        });
  }

  createSpriteType() {
    if (!this.selected) {
      this.alertService.warn('Please select an image to create a sprite type');
      return;
    }
    this.alertService.warn('Not implemented yet');
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading images');
    this.imageApi.findImage(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.images = response.values;
        this.thumbnails = this.images.map(img => ImagesViewComponent.toThumbnail(img));
      },rejectReason => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load images (' + rejectReason + ')');
      });
  }

  private static toThumbnail(image: Image): ThumbnailProperties {
    return {
      imageUrl: image.gcsUrl,
    };
  }

}
