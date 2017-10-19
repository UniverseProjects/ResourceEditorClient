import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerView, ExplorerService} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {ImageFrameProperties} from './image.frame.component';
import {ThumbnailProperties} from "./thumbnails.component";

@Component({
  selector: 'sprite-types-view',
  styles: [`    
    .preview-container {
      margin-bottom: 20px;
    }
  `],
  template: `
    <div class="sprites-types-view-container" *ngIf="active">
      <div *ngIf="displayThumbnails">
        <thumbnails [thumbnails]="thumbnails" (onSelected)="onThumbnailSelected($event)"></thumbnails>
        <div class="controls-bottom">
          <button class="btn btn-outline-success" (click)="showCreationDialog();">Create new sprite type</button>
        </div>
      </div>
      <div *ngIf="displaySelected">
        <div class="controls-top">
          <button class="btn btn-info btn-with-icon" (click)="clearSelected(); showThumbnails();">&#8678; Back to directory</button>
          <button class="btn btn-outline-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete this sprite type?"
                  (confirm)="deleteSpriteType()">Delete this sprite type
          </button>
        </div>
        <div class="preview-container">
          <image-frame [properties]="selectedFrameProps"></image-frame>
        </div>
        <properties [object]="selected"></properties>
        <div class="controls-bottom">
        </div>
      </div>
      <div *ngIf="displayCreationDialog">
        <sprite-type-editor (onCancel)="showThumbnails()" (onCreated)="reloadContent()"></sprite-type-editor>
      </div>
    </div>
  `,
})
export class SpriteTypesViewComponent implements OnInit, OnDestroy {
  active = false;
  spriteTypes: SpriteType[] = [];
  thumbnails: ThumbnailProperties[] = [];
  selected: SpriteType;
  selectedFrameProps: ImageFrameProperties;

  displayThumbnails = false;
  displaySelected = false;
  displayCreationDialog = false;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit() {
    this.subscription = this.explorerService.openAndReloadView$.subscribe((view) => {
      if (view === ExplorerView.SPRITE_TYPES) {
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
    this.clearSelected();

    let st = this.spriteTypes[selectedIndex];
    this.selected = st;
    this.selectedFrameProps = {
      width: st.areaWidth,
      height: st.areaHeight,
      imageUrl: st.image.gcsUrl,
      imageBorder: false,
      sectionWidth: st.areaWidth,
      sectionHeight: st.areaHeight,
      sectionX: st.areaX,
      sectionY: st.areaY,
    };

    this.showSelected();
  }

  clearAll() {
    this.clearThumbnails();
    this.clearSelected();
  }

  clearThumbnails() {
    this.spriteTypes.length = 0;
    this.thumbnails.length = 0;
  }

  clearSelected() {
    this.selected = null;
    this.selectedFrameProps = null;
  }

  showThumbnails() {
    this.displayCreationDialog = false;
    this.displaySelected = false;
    this.displayThumbnails = true;
  }

  showSelected() {
    this.displayThumbnails = false;
    this.displaySelected = true;
    this.displayCreationDialog = false;
  }

  showCreationDialog() {
    this.displayThumbnails = false;
    this.displaySelected = false;
    this.displayCreationDialog = true;
  }

  deleteSpriteType() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let treePath = this.selected.treePath;

    const operation = this.loaderService.startOperation('Deleting sprite type');
    this.spriteTypeApi.deleteSpriteType(libraryId, ApiHelper.path(treePath))
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Sprite type deleted successfully');
        this.reloadContent();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to delete sprite type (' + rejectReason + ')');
      });
  }

  private reloadContent() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let currentDir = this.directoryService.getCurrentDirectoryPath();

    const operation = this.loaderService.startOperation('Loading sprite types');
    this.spriteTypeApi.findSpriteType(libraryId, ApiHelper.path(currentDir))
      .toPromise()
      .then(response => {
        operation.stop();
        this.clearAll();
        this.spriteTypes = response.values;
        this.thumbnails = this.spriteTypes.map(st => SpriteTypesViewComponent.toThumbnail(st));
        this.showThumbnails();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to load sprite types (' + rejectReason + ')');
        this.clearAll();
        this.showThumbnails();
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

}
