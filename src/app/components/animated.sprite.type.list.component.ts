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
  selector: 'animated-sprite-type-list',
  styles: [`    
  `],
  template: `
    <div class="animated-sprites-type-list-container" *ngIf="active">
      <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
    </div>
  `,
})
export class AnimatedSpriteTypeListComponent implements OnInit, OnDestroy {
  active = false;
  animatedSpriteTypes: AnimatedSpriteType[] = [];
  thumbnails: ThumbnailProperties[] = [];

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
      this.active = view === ExplorerView.ANIMATED_SPRITE_TYPE_LIST;
    }));

    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.ANIMATED_SPRITE_TYPE_LIST) {
        this.reloadContent();
      }
    }));

    this.subscriptions.push(this.explorerService.clearView$.subscribe((view) => {
      if (view === ExplorerView.ANIMATED_SPRITE_TYPE_LIST) {
        this.clear();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.explorerService.clearSelectedAnimatedSpriteType();
    this.animatedSpriteTypes.length = 0;
    this.thumbnails.length = 0;
  }

  reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading animated sprite types');
    this.animatedSpriteTypeApi.findAnimatedSpriteType(libraryId, ApiHelper.path(currentDir), null, null, null, ApiHelper.requestOptions())
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

  onThumbnailSelected(selectedIndex: number) {
    const ast = this.animatedSpriteTypes[selectedIndex];
    this.explorerService.setSelectedAnimatedSpriteType(ast);
    this.explorerService.openAndReloadView(ExplorerView.ANIMATED_SPRITE_TYPE_PREVIEW);
  }

}
