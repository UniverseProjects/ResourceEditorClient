import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerView, ExplorerService} from '../services/explorer.service';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {SpriteTypeListComponent} from './sprite.type.list.component';
import {ThumbnailProperties} from './thumbnails.component';

@Component({
  selector: 'animated-sprite-types-view',
  styles: [`    
    .preview-container {
      margin-bottom: 20px;
    }
    .preview {
      max-width: 400px;
      max-height: 400px;
    }
  `],
  template: `
    <div class="animated-sprites-types-view-container" *ngIf="active">
      <div [hidden]="selected">
        <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
      </div>
      <div *ngIf="selected">
        <div class="controls-top">
          <button class="btn btn-info btn-with-icon" (click)="returnToList()">&#8678; Return</button>
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

  private subscriptions: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private animatedSpriteTypeApi: AnimatedSpriteTypeApi,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      if (view === ExplorerView.ANIMATED_SPRITE_TYPES) {
        this.active = true;
      } else {
        this.clear();
        this.active = false;
      }
    }));

    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.ANIMATED_SPRITE_TYPES && this.active) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  onThumbnailSelected(selectedIndex: number) {
    this.selected = this.animatedSpriteTypes[selectedIndex];
  }

  returnToList() {
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
        this.thumbnails = this.animatedSpriteTypes.map(ast => SpriteTypeListComponent.toThumbnail(ast.frames[0].spriteType));
      }, (rejectReason) => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load animated sprite types (' + rejectReason + ')');
      });
  }

}
