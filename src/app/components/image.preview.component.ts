import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {Subscription} from 'rxjs/Subscription';
import {LoaderService} from '../services/loader.service';
import {AlertService} from '../services/alert.service';
import {ImageApi} from '../swagger/api/ImageApi';
import {ImageFrameProperties} from './image.frame.component';
import {Image} from '../swagger/model/Image';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'image-preview',
  styles: [`
    .preview-container {
      margin-bottom: 20px;
    }
  `],
  template: `
    <div class="image-preview-container" *ngIf="active">
      <div class="controls-top">
        <button class="btn btn-info btn-with-icon" (click)="returnToList()">&#8678; Return</button>
        <button class="btn btn-outline-danger"
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete this image?"
                (confirm)="deleteImage()">Delete this image
        </button>
        <button class="btn btn-outline-success" (click)="createSpriteType()">Create sprite type</button>
      </div>
      <div class="preview-container">
        <image-frame [properties]="frameProperties"></image-frame>
      </div>
      <properties [object]="image"></properties>
      <div class="controls-bottom">
      </div>
    </div>
  `,
})
export class ImagePreviewComponent implements OnInit, OnDestroy {
  active = false;
  image: Image;
  frameProperties: ImageFrameProperties;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private imageApi: ImageApi,
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.IMAGE_PREVIEW;
    }));
    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (this.active && view === ExplorerView.IMAGE_PREVIEW) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  reloadContent() {
    let img = this.explorerService.getSelectedImage();
    if (!img) {
      throw new Error('An image must be selected to use this component');
    }

    this.image = img;
    this.frameProperties = {
      imageUrl: img.gcsUrl,
      width: 400,
      height: 400,
      imageBorder: true,
    };
  }

  clear() {
    this.image = null;
    this.frameProperties = null;
  }

  returnToList() {
    this.explorerService.openView(ExplorerView.IMAGE_LIST);
  }

  deleteImage() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let treePath = this.image.treePath;

    let operation = this.loaderService.startOperation('Deleting image');
    this.imageApi.deleteImage(libraryId, ApiHelper.path(treePath))
      .toPromise()
      .then(() => {
          operation.stop();
          this.alertService.success('Image deleted: ' + treePath);
          this.clear();
          this.explorerService.openAndReloadView(ExplorerView.IMAGE_LIST);
        },
        rejectReason => {
          operation.stop();
          this.alertService.error('Image deletion failed (reason: ' + rejectReason + ')');
        });
  }

  createSpriteType() {
    this.explorerService.openAndReloadView(ExplorerView.SPRITE_TYPE_EDIT);
  }

}
