import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';

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
  `],
  template: `
    <div class="animated-sprites-view-container" *ngIf="active">
      <div [hidden]="selectedAnimatedSprite">
        <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
      </div>
      <div *ngIf="selectedAnimatedSprite">
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
  thumbnailUrls: string[] = [];
  selectedAnimatedSprite: AnimatedSpriteType;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private animatedSpriteTypeApi: AnimatedSpriteTypeApi,
  ) { }

  ngOnInit(): void {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.ANIMATED_SPRITES) {
        this.loadAnimatedSprites(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadAnimatedSprites(null);
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onThumbnailSelected(selectedIndex: number): void {
    this.selectedAnimatedSprite = this.animatedSprites[selectedIndex];
  }

  deleteAnimatedSprite() {
    this.alertService.warn('Deletion not implemented yet');
  }

  private loadAnimatedSprites(directory: string): void {
    this.selectedAnimatedSprite = null;
    if (!directory) {
      this.animatedSprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }
    let libraryId = this.explorerService.getSelectedLibraryId();

    const operation = this.loaderService.startOperation('Loading animated sprites');
    this.animatedSpriteTypeApi.findAnimatedSpriteType(libraryId, ApiHelper.path(directory))
      .toPromise()
      .then(response => {
        operation.stop();
        this.animatedSprites = response.values;
        this.thumbnailUrls = this.animatedSprites.map(sprite => sprite.frames[0].spriteType.image.gcsUrl);
      }, (rejectReason) => {
        operation.stop();
        this.alertService.error('Failed to load animated sprites (' + rejectReason + ')');
      });
  }

}
