import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {ThumbnailProperties} from "./thumbnails.component";

@Component({
  selector: 'sprite-type-list',
  styles: [`
  `],
  template: `
    <div class="sprites-type-list-container" *ngIf="active">
      <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
      <div class="controls-bottom">
        <button class="btn btn-outline-success" (click)="createNewSpriteType();">Create new sprite type</button>
      </div>
    </div>
  `,
})
export class SpriteTypeListComponent implements OnInit, OnDestroy {
  active = false;
  spriteTypes: SpriteType[] = [];
  thumbnails: ThumbnailProperties[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.SPRITE_TYPE_LIST;
    }));

    this.subscriptions.push(this.explorerService.reloadView$.subscribe( (view) => {
      if (this.active && view === ExplorerView.SPRITE_TYPE_LIST) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.spriteTypes.length = 0;
    this.thumbnails.length = 0;
  }

  reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading sprite types');
    this.spriteTypeApi.findSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clear();
        this.spriteTypes = response.values;
        this.thumbnails = this.spriteTypes.map(st => SpriteTypeListComponent.toThumbnail(st));
      }, rejectReason => {
        operation.stop();
        this.clear();
        this.alertService.error('Failed to load sprite types (' + rejectReason + ')');
      });
  }

  static toThumbnail(spriteType: SpriteType): ThumbnailProperties {
    return {
      imageUrl: spriteType.image.gcsUrl,
      sectionWidth: spriteType.areaWidth,
      sectionHeight: spriteType.areaHeight,
      sectionX: spriteType.areaX,
      sectionY: spriteType.areaY,
    };
  }

  onThumbnailSelected(selectedIndex: number) {
    const st = this.spriteTypes[selectedIndex];
    this.explorerService.setSelectedSpriteType(st);
    this.explorerService.openAndReloadView(ExplorerView.SPRITE_TYPE_PREVIEW);
  }

  createNewSpriteType() {
    this.explorerService.openAndReloadView(ExplorerView.SPRITE_TYPE_EDIT)
  }

}
