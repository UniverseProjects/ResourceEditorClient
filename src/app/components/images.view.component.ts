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

@Component({
  selector: 'app-images-view',
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
    <div class="images-view-container" *ngIf="active">
      <div [hidden]="selectedImage">
        <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
        <div class="controls-bottom">
          <div class="input-group">
            <label class="input-group-btn">
              <span class="btn btn-default">
                  Browse&hellip; <input #fileUploadInput type="file" accept=".png, .jpg" style="display: none;"
                                        (change)="onFileSelectionUpdate($event); fileUploadInput.value = '';">
              </span>
            </label>
            <input id="uploadFileName" type="text" class="form-control" readonly placeholder="Select image to upload"
                   value="{{fileToUpload ? fileToUpload.name : null}}">
            <button id="uploadImageBtn" class="btn btn-default" (click)="uploadImage()">&#9658; UPLOAD</button>
          </div>
        </div>
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
                  (confirm)="deleteImage()">Delete this image
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ImagesViewComponent implements OnInit, OnDestroy {
  active = false;
  images: Image[] = [];
  thumbnailUrls: string[] = [];
  selectedImage: Image;
  fileToUpload: File;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private imageApi: ImageApi,
    private http: Http,
  ) { }

  ngOnInit(): void {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.IMAGES) {
        this.loadImages(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadImages(null);
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    let filePath = ApiHelper.verifyPath(PathUtil.combine(directoryPath, fileName));

    /*
     * At the time of this writing, generated method ImageApi.uploadImage() is broken and can't be used.
     * GitHub issue: https://github.com/swagger-api/swagger-codegen/issues/6006
     *
     */
    const uploadUrl = ApiHelper.BASE_URL + 'library/' + libraryId + '/uploadImage/' + filePath;

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
          this.loadImages(directoryPath);
        },
        rejectReason => {
          operation.stop();
          this.alertService.error('Image upload failed (reason: ' + rejectReason + ')');
        }
      );

  }

  deleteImage() {
    if (!this.selectedImage) {
      this.alertService.warn('Please select an image to delete');
      return;
    }

    let libraryId = this.explorerService.getSelectedLibraryId();
    let directoryPath = this.directoryService.getCurrentDirectoryPath();
    let treePath = ApiHelper.verifyPath(this.selectedImage.treePath);

    let operation = this.loaderService.startOperation('Deleting image');
    this.imageApi.deleteImage(libraryId, treePath)
      .toPromise()
      .then(() => {
          operation.stop();
          this.alertService.success('Image deleted: ' + treePath);
          this.loadImages(directoryPath);
        },
        rejectReason => {
          operation.stop();
          this.alertService.error('Image deletion failed (reason: ' + rejectReason + ')');
        });
  }

  private loadImages(directory: string): void {
    this.selectedImage = null;
    this.fileToUpload = null;

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
