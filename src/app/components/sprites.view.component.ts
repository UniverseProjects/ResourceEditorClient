import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {ImageFrameProperties} from './image.frame.component';
import {ThumbnailProperties} from "./thumbnails.component";

@Component({
  selector: 'app-sprites-view',
  styles: [`
    .controls-top {
      margin-bottom: 10px;
    }
    .controls-bottom {
      margin-top: 10px;
    }
    .preview-container {
      margin-bottom: 20px;
    }
    #backBtn {
      padding-left: 8px;
      padding-right: 10px;
    }
  `],
  template: `
    <div class="sprites-view-container" *ngIf="active">
      <div *ngIf="displayThumbnails">
        <app-thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
        <div class="controls-bottom">
          <button class="btn btn-outline-success" (click)="showNewSpriteDialog();">Create new sprite</button>
        </div>
      </div>
      <div *ngIf="displaySelectedSprite">
        <div class="controls-top">
          <button id="backBtn" class="btn btn-info" (click)="clearSelectedSprite(); showThumbnails();">&#8678; Back to directory</button>
          <button class="btn btn-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this sprite?"
                  (confirm)="deleteSprite()">Delete this sprite
          </button>
        </div>
        <div class="preview-container">
          <app-image-frame [properties]="selectedSpriteFrameProperties"></app-image-frame>
        </div>
        <app-properties [object]="selectedSprite"></app-properties>
        <div class="controls-bottom">
        </div>
      </div>
      <div *ngIf="displayNewSpriteDialog">
        <app-sprite-editor (onCancel)="showThumbnails()" (onSpriteCreated)="reloadContent()"></app-sprite-editor>
      </div>
    </div>
  `,
})
export class SpritesViewComponent implements OnInit, OnDestroy {
  active = false;
  sprites: SpriteType[] = [];

  displayThumbnails = false;
  thumbnails: ThumbnailProperties[] = [];

  displaySelectedSprite = false;
  selectedSprite: SpriteType;
  selectedSpriteFrameProperties: ImageFrameProperties;

  displayNewSpriteDialog = false;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit() {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.SPRITES) {
        this.reloadContent();
        this.active = true;
      } else {
        this.clearAll();
        this.showThumbnails();
        this.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onThumbnailSelected(selectedIndex: number) {
    this.clearSelectedSprite();

    let sprite = this.sprites[selectedIndex];
    this.selectedSprite = sprite;
    this.selectedSpriteFrameProperties = {
      width: sprite.areaWidth,
      height: sprite.areaHeight,
      imageUrl: sprite.image.gcsUrl,
      imageBorder: false,
      sectionWidth: sprite.areaWidth,
      sectionHeight: sprite.areaHeight,
      sectionX: sprite.areaX,
      sectionY: sprite.areaY,
    };

    this.showSelectedSprite();
  }

  clearAll() {
    this.clearThumbnails();
    this.clearSelectedSprite();
  }

  clearThumbnails() {
    this.sprites.length = 0;
    this.thumbnails.length = 0;
  }

  clearSelectedSprite() {
    this.selectedSprite = null;
    this.selectedSpriteFrameProperties = null;
  }

  showThumbnails() {
    this.displayNewSpriteDialog = false;
    this.displaySelectedSprite = false;
    this.displayThumbnails = true;
  }

  showSelectedSprite() {
    this.displayThumbnails = false;
    this.displaySelectedSprite = true;
    this.displayNewSpriteDialog = false;
  }

  showNewSpriteDialog() {
    this.displayThumbnails = false;
    this.displaySelectedSprite = false;
    this.displayNewSpriteDialog = true;
  }

  deleteSprite() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let treePath = this.selectedSprite.treePath;

    const operation = this.loaderService.startOperation('Deleting sprite');
    this.spriteTypeApi.deleteSpriteType(libraryId, ApiHelper.path(treePath))
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Sprite deleted successfully');
        this.reloadContent();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to delete sprite (' + rejectReason + ')');
      });
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading sprites');
    this.spriteTypeApi.findSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clearAll();
        this.sprites = response.values;
        this.thumbnails = this.sprites.map(sprite => SpritesViewComponent.toThumbnail(sprite));
        this.showThumbnails();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to load sprites (' + rejectReason + ')');
        this.clearAll();
        this.showThumbnails();
      });
  }

  static toThumbnail(sprite: SpriteType): ThumbnailProperties {
    return {
      imageUrl: sprite.image.gcsUrl,
      sectionWidth: sprite.areaWidth,
      sectionHeight: sprite.areaHeight,
      sectionX: sprite.areaX,
      sectionY: sprite.areaY,
    };
  }

}
