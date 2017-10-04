import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-sprites',
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
    <div class="app-sprites-container" *ngIf="active">
      <div [hidden]="selectedSprite">
        <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
      </div>
      <div *ngIf="selectedSprite">
        <div class="preview-container">
          <img class="preview" src="{{selectedSprite.image.gcsUrl}}"/>
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
export class SpritesComponent implements OnInit, OnDestroy {
  active = false;
  sprites: SpriteType[] = [];
  thumbnailUrls: string[] = [];
  selectedSprite: SpriteType;

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
        this.loadSprites(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadSprites(null);
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onThumbnailSelected(selectedIndex: number): void {
    this.selectedSprite = this.sprites[selectedIndex];
  }

  deleteSprite() {
    this.alertService.warn('Not implemented yet!');
  }

  private loadSprites(directory: string): void {
    this.selectedSprite = null;
    if (!directory) {
      this.sprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }
    directory = ApiHelper.verifyPath(directory);

    const operation = this.loaderService.startOperation('Loading sprites');
    this.spriteTypeApi.findSpriteType(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        operation.stop();
        this.sprites = response.values;
        this.thumbnailUrls = this.sprites.map(sprite => sprite.image.gcsUrl);
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to load sprites (' + rejectReason + ')');
      });
  }

}
