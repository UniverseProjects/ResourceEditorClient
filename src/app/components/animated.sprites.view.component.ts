import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {SpritesViewComponent} from './sprites.view.component';
import {ThumbnailProperties} from './thumbnails.component';

@Component({
  selector: 'app-animated-sprites-view',
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
    .preview {
      max-width: 400px;
      max-height: 400px;
    }
    #backBtn {
      padding-left: 8px;
      padding-right: 10px;
    }
  `],
  template: `
    <div class="animated-sprites-view-container" *ngIf="active">
      <div [hidden]="selectedAnimatedSprite">
        <app-thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
      </div>
      <div *ngIf="selectedAnimatedSprite">
        <div class="controls-top">
          <button id="backBtn" class="btn btn-default" (click)="clearSelection()">&#8678; Back to directory</button>
        </div>
        <div class="preview-container">
          <img class="preview" src="{{selectedAnimatedSprite.frames[0].spriteType.image.gcsUrl}}"/>
        </div>
        <app-properties [object]="selectedAnimatedSprite"></app-properties>
        <div class="controls-bottom">
          <button class="btn btn-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this animated sprite?"
                  (confirm)="deleteAnimatedSprite()">Delete this animated sprite
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AnimatedSpritesViewComponent implements OnInit, OnDestroy {
  active = false;
  animatedSprites: AnimatedSpriteType[] = [];
  thumbnails: ThumbnailProperties[] = [];
  selectedAnimatedSprite: AnimatedSpriteType;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private animatedSpriteTypeApi: AnimatedSpriteTypeApi,
  ) { }

  ngOnInit() {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.ANIMATED_SPRITES) {
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
    this.selectedAnimatedSprite = this.animatedSprites[selectedIndex];
  }

  clearSelection() {
    this.selectedAnimatedSprite = null;
  }

  clear() {
    this.selectedAnimatedSprite = null;
    this.animatedSprites.length = 0;
    this.thumbnails.length = 0;
  }

  deleteAnimatedSprite() {
    this.alertService.warn('Deletion not implemented yet');
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading animated sprites');
    this.animatedSpriteTypeApi.findAnimatedSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.animatedSprites = response.values;
        this.thumbnails = this.animatedSprites.map(sprite => SpritesViewComponent.toThumbnail(sprite.frames[0].spriteType));
      }, (rejectReason) => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load animated sprites (' + rejectReason + ')');
      });
  }

}
