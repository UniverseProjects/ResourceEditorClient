import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {AlertService} from "../services/alert.service";
import {Subscription} from 'rxjs/Subscription';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {AnimatedSpriteTypeFrame} from '../swagger/model/AnimatedSpriteTypeFrame';
import {AnimationSpriteSheet} from './animation/animation.sprite.sheet';
import {AnimationFrame} from './animation/animation.frame';

@Component({
  selector: 'animated-sprite-type-preview',
  styles: [`
    .preview-container {
      margin-bottom: 20px;
    }
    .preview-image {
      max-width: 400px;
      max-height: 400px;
    }
    .unsupported-warning {
      color: red;
    }
  `],
  template: `
    <style>

    </style>
    <div class="animated-sprite-type-preview-container" *ngIf="active">
      <div class="controls-top">
        <button class="btn btn-info btn-with-icon" (click)="returnToList()">&#8678; Return</button>
        <button class="btn btn-outline-danger"
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete this animated sprite type?"
                (confirm)="deleteAnimatedSpriteType()" focusButton="confirm">Delete this animated sprite type
        </button>
      </div>
      <div class="preview-container" *ngIf="previewImageUrl">
        <div class="unsupported-warning">* This animation type is not supported yet, showing first frame only:</div>
        <img class="preview-image" src="{{previewImageUrl}}"/>
      </div>
      <div class="preview-container" *ngIf="animationSpriteSheet">
        <animation-component [spriteSheet]="animationSpriteSheet" [width]="animationWidth" [height]="animationHeight"></animation-component>
      </div>
      <properties [object]="animatedSpriteType"></properties>
    </div>
  `,
})
export class AnimatedSpriteTypePreviewComponent implements OnInit, OnDestroy {
  active = false;
  animatedSpriteType: AnimatedSpriteType;

  animationSpriteSheet: AnimationSpriteSheet;
  animationWidth: number;
  animationHeight: number;

  previewImageUrl: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    private explorerService: ExplorerService,
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.ANIMATED_SPRITE_TYPE_PREVIEW;
    }));
    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.ANIMATED_SPRITE_TYPE_PREVIEW) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.animatedSpriteType = null;
    this.animationSpriteSheet = null;
    this.animationWidth = null;
    this.animationHeight = null;
    this.previewImageUrl = null;
  }

  reloadContent() {
    const ast = this.explorerService.getSelectedAnimatedSpriteType();
    if (!ast) {
      throw new Error('An animated-sprite-type must be selected to use this component');
    }
    this.animatedSpriteType = ast;
    if (!ast.frames || ast.frames.length === 0) {
      throw new Error('The animated-sprite-type does not have any frames');
    }

    let supportedAnimation = true;
    let lastFrame: AnimatedSpriteTypeFrame;
    let maxX = 0;
    let maxY = 0;
    let animationFrames: AnimationFrame[] = [];
    for (let fr of ast.frames) {
      if (lastFrame && lastFrame.spriteType.image.gcsUrl !== fr.spriteType.image.gcsUrl) {
        // TODO: implement support for multiple images
        supportedAnimation = false;
        break;
      }
      lastFrame = fr;

      let st = fr.spriteType;
      maxX = Math.max(maxX, fr.adjustX + st.areaWidth);
      maxY = Math.max(maxY, fr.adjustY + st.areaHeight);

      // TODO: include frame duration!
      let duration = fr.duration;

      animationFrames.push(new AnimationFrame(st.areaX, st.areaY, st.areaWidth, st.areaHeight, fr.adjustX, fr.adjustY));
    }

    if (supportedAnimation) {
      console.log('maxX = ' + maxX + ', maxY = ' + maxY);
      this.animationWidth = maxX;
      this.animationHeight = maxY;
      this.animationSpriteSheet = new AnimationSpriteSheet(lastFrame.spriteType.image.gcsUrl);
      this.animationSpriteSheet.addFrames("sequence", animationFrames);
    }
    else {
      this.alertService.warn('This type of animation is not supported yet');
      this.previewImageUrl = ast.frames[0].spriteType.image.gcsUrl;
    }

  }

  returnToList() {
    this.explorerService.clearSelectedAnimatedSpriteType();
    this.clear();
    this.explorerService.openView(ExplorerView.ANIMATED_SPRITE_TYPE_LIST);
  }

  deleteAnimatedSpriteType() {
    this.alertService.warn('Deletion not implemented yet');
  }


}
