import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimatedSprite} from './animated.sprite';
import {AnimationSpriteSheet} from './animation.sprite.sheet';
import {C} from '../../common/common';

@Component({
  selector: 'animation-component',
  styles: [`
    :host {
      display: block;
    }

    .wrapper {
      position: relative;
      margin-top: 20px;
    }
    
    .animation-btn {
      position: absolute;
      right: -10px;
      top: -10px;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      color: #222222;
    }

    .animation-btn-pause {
      background-color: #FFFF00;
    }
    .animation-btn-pause:hover {
      background-color: #AAAA00;
    }

    .animation-btn-play {
      background-color: #00FF00;
    }

    .animation-btn-play:hover {
      background-color: #00AA00;
    }

    canvas {
      border: solid #888 1px;
    }
  `],
  template: `
    <div class="wrapper" [style.width.px]="width" [style.height.px]="height">
      <div class="controls">
        <button class="animation-btn animation-btn-pause" *ngIf="ready && running" (click)="pauseAnimation()">&#10074;&#10074;</button>
        <button class="animation-btn animation-btn-play" *ngIf="ready && !running" (click)="startAnimation()">&#9658;</button>
      </div>
      <canvas #canvas [width]="width" [height]="height">
      </canvas>
    </div>
  `
})
export class AnimationComponent implements OnInit, OnDestroy {

  @Input() width: number;
  @Input() height: number;
  @Input() spriteSheet: AnimationSpriteSheet;
  @Input() sequenceName = "sequence";

  ready = false;
  running = false;

  @ViewChild('canvas') canvasRef: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private sprite: AnimatedSprite;

  constructor(
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    if (!C.defined(this.width)) {
      throw new Error('Width input is required');
    }
    if (!C.defined(this.height)) {
      throw new Error('Height input is required');
    }
    if (!C.defined(this.spriteSheet)) {
      throw new Error('Sprite-sheet input is required');
    }

    this.sprite = new AnimatedSprite(this.spriteSheet, this.sequenceName);
    this.spriteSheet.loadImage(() => {
      this.ready = true;
      this.startAnimation();
    }, () => {
      console.error('Failed to load image for sprite sheet');
    });

  }

  ngOnDestroy() {
    this.running = false;
  }

  startAnimation() {
    if (!this.running) {
      this.running = true;
      this.ngZone.runOutsideAngular(() => this.paint());
    }
  }

  pauseAnimation() {
    if (this.running) {
      this.running = false
    }
  }

  private paint() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.sprite.draw(this.ctx);

    if (this.running) {
      requestAnimationFrame(() => this.paint());
    }
  }


}






