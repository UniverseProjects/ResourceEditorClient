import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {AlertService} from "../services/alert.service";
import {LoaderService} from '../services/loader.service';
import {Subscription} from 'rxjs/Subscription';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';

@Component({
  selector: 'animated-sprite-type-preview',
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
    <div class="animated-sprite-type-preview-container" *ngIf="active">
      <div class="controls-top">
        <button class="btn btn-info btn-with-icon" (click)="returnToList()">&#8678; Return</button>
        <button class="btn btn-outline-danger"
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete this animated sprite type?"
                (confirm)="deleteAnimatedSpriteType()" focusButton="confirm">Delete this animated sprite type
        </button>
      </div>
      <div class="preview-container">
        <img class="preview" src="{{previewImageUrl}}"/>
      </div>
      <properties [object]="animatedSpriteType"></properties>
    </div>
  `,
})
export class AnimatedSpriteTypePreviewComponent implements OnInit, OnDestroy {
  active = false;
  animatedSpriteType: AnimatedSpriteType;
  previewImageUrl: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private animatedSpriteTypeApi: AnimatedSpriteTypeApi,
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.ANIMATED_SPRITE_TYPE_PREVIEW;
    }));
    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (this.active && view === ExplorerView.ANIMATED_SPRITE_TYPE_PREVIEW) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.explorerService.setSelectedAnimatedSpriteType(null);
    this.animatedSpriteType = null;
    this.previewImageUrl = null;
  }

  reloadContent() {
    const ast = this.explorerService.getSelectedAnimatedSpriteType();
    if (!ast) {
      throw new Error('An animated-sprite-type must be selected to use this component');
    }
    this.animatedSpriteType = ast;
    this.previewImageUrl = ast.frames[0].spriteType.image.gcsUrl;
  }

  returnToList() {
    this.clear();
    this.explorerService.openView(ExplorerView.ANIMATED_SPRITE_TYPE_LIST);
  }

  deleteAnimatedSpriteType() {
    this.alertService.warn('Deletion not implemented yet');
  }


}
