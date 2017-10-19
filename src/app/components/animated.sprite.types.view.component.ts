import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {SpriteTypesViewComponent} from './sprite.types.view.component';
import {ThumbnailProperties} from './thumbnails.component';

@Component({
  selector: 'animated-sprite-types-view',
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
    <div class="animated-sprites-types-view-container" *ngIf="active">
      <div [hidden]="selected">
        <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
      </div>
      <div *ngIf="selected">
        <div class="controls-top">
          <button id="backBtn" class="btn btn-info" (click)="clearSelection()">&#8678; Back to directory</button>
          <button class="btn btn-outline-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this animated sprite type?"
                  (confirm)="deleteAnimatedSpriteType()">Delete this animated sprite type
          </button>
        </div>
        <div class="preview-container">
          <img class="preview" src="{{selected.frames[0].spriteType.image.gcsUrl}}"/>
        </div>
        <properties [object]="selected"></properties>
        <div class="controls-bottom">

        </div>
      </div>
    </div>
  `,
})
export class AnimatedSpriteTypesViewComponent implements OnInit, OnDestroy {
  active = false;
  animatedSpriteTypes: AnimatedSpriteType[] = [];
  thumbnails: ThumbnailProperties[] = [];
  selected: AnimatedSpriteType;

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
      if (contentType === ContentType.ANIMATED_SPRITE_TYPES) {
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
    this.selected = this.animatedSpriteTypes[selectedIndex];
  }

  clearSelection() {
    this.selected = null;
  }

  clear() {
    this.selected = null;
    this.animatedSpriteTypes.length = 0;
    this.thumbnails.length = 0;
  }

  deleteAnimatedSpriteType() {
    this.alertService.warn('Deletion not implemented yet');
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading animated sprite types');
    this.animatedSpriteTypeApi.findAnimatedSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.animatedSpriteTypes = response.values;
        this.thumbnails = this.animatedSpriteTypes.map(ast => SpriteTypesViewComponent.toThumbnail(ast.frames[0].spriteType));
      }, (rejectReason) => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load animated sprite types (' + rejectReason + ')');
      });
  }

}
