import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {LoaderService} from '../services/loader.service';
import {AlertService} from '../services/alert.service';
import {Subscription} from 'rxjs/Subscription';
import {SpriteType} from '../swagger/model/SpriteType';
import {ImageFrameProperties} from './image.frame.component';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'sprite-type-preview',
  styles: [`
    .preview-container {
      margin-bottom: 20px;
    }
  `],
  template: `
    <div class="sprite-type-preview-container" *ngIf="active">
      <div class="controls-top">
        <button class="btn btn-info btn-with-icon" (click)="returnToList();">&#8678; Return</button>
        <button class="btn btn-outline-danger"
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete this sprite type?"
                (confirm)="deleteSpriteType()" focusButton="confirm">Delete this sprite type
        </button>
      </div>
      <div class="preview-container">
        <image-frame [properties]="frameProperties"></image-frame>
      </div>
      <properties [object]="spriteType"></properties>
      <div class="controls-bottom">
      </div>
    </div>
  `,
})
export class SpriteTypePreviewComponent implements OnInit, OnDestroy {
  active = false;
  spriteType: SpriteType;
  frameProperties: ImageFrameProperties;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private spriteTypeApi: SpriteTypeApi,
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.SPRITE_TYPE_PREVIEW;
    }));
    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (this.active && view === ExplorerView.SPRITE_TYPE_PREVIEW) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.spriteType = null;
    this.frameProperties = null;
  }

  reloadContent() {
    const st = this.explorerService.getSelectedSpriteType();
    if (!st) {
      throw new Error('A sprite-type must be selected to use this component');
    }

    this.spriteType = st;
    this.frameProperties = {
      width: st.areaWidth,
      height: st.areaHeight,
      imageUrl: st.image.gcsUrl,
      imageBorder: false,
      sectionWidth: st.areaWidth,
      sectionHeight: st.areaHeight,
      sectionX: st.areaX,
      sectionY: st.areaY,
    };
  }

  returnToList() {
    this.explorerService.openView(ExplorerView.SPRITE_TYPE_LIST);
  }

  deleteSpriteType() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let treePath = this.spriteType.treePath;

    const operation = this.loaderService.startOperation('Deleting sprite type');
    this.spriteTypeApi.deleteSpriteType(libraryId, ApiHelper.path(treePath))
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Sprite type deleted successfully');
        this.clear();
        this.explorerService.openAndReloadView(ExplorerView.SPRITE_TYPE_LIST);
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to delete sprite type (' + rejectReason + ')');
      });
  }

}
