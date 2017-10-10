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
  `],
  template: `
    <div class="sprites-view-container" *ngIf="active">
      <div [hidden]="selectedSprite">
        <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
      </div>
      <div *ngIf="selectedSprite">
        <div class="preview-container">
          <app-image-frame [properties]="selectedSpriteFrameProperties"></app-image-frame>
        </div>
        <app-properties [object]="selectedSprite"></app-properties>
        <div class="controls-bottom">
          <button class="btn btn-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this sprite?"
                  (confirm)="deleteSprite()">Delete this sprite
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SpritesViewComponent implements OnInit, OnDestroy {
  active = false;
  sprites: SpriteType[] = [];
  thumbnailUrls: string[] = [];
  selectedSprite: SpriteType;
  selectedSpriteFrameProperties: ImageFrameProperties;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit(): void {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.SPRITES) {
        this.reloadContent();
        this.active = true;
      } else {
        this.clear();
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onThumbnailSelected(selectedIndex: number): void {
    let sprite = this.sprites[selectedIndex];
    this.selectedSprite = sprite;
    this.selectedSpriteFrameProperties = {
      width: sprite.areaWidth,
      height: sprite.areaHeight,
      imageUrl: sprite.image.gcsUrl,
      fitFrame: true,
      sectionWidth: sprite.areaWidth,
      sectionHeight: sprite.areaHeight,
      sectionX: sprite.areaX,
      sectionY: sprite.areaY,
    }
  }

  deleteSprite() {
    this.alertService.warn('Not implemented yet!');
  }

  private clear() {
    this.sprites.length = 0;
    this.thumbnailUrls.length = 0;
    this.selectedSprite = null;
    this.selectedSpriteFrameProperties = null;
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading sprites');
    this.spriteTypeApi.findSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.sprites = response.values;
        this.thumbnailUrls = this.sprites.map(sprite => sprite.image.gcsUrl);
      }, rejectReason => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load sprites (' + rejectReason + ')');
      });
  }

}
