import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeValue} from '@angular/platform-browser';

@Component({
  selector: 'app-image-frame',
  styles:[`
    .image-frame {
      border: solid #888 1px;
      padding: 2px;
    }
  `],
  template:`
      <div class="image-frame"
           [style.width]="getCssWidth()"
           [style.height]="getCssHeight()"
           [style.background]="getCssBackground()"></div>
  `
})
export class ImageFrameComponent implements OnInit, OnDestroy {

  @Input() properties: ImageFrameProperties;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (!this.properties) {
      throw new Error('Properties must be provided');
    }
  }

  ngOnDestroy(): void {
  }

  getCssWidth(): string {
    let p = this.properties;
    return p.frameWidth ? p.frameWidth+'px' : 'auto';
  }

  getCssHeight(): string {
    let p = this.properties;
    return p.frameHeight ? p.frameHeight+'px' : 'auto';
  }

  getCssBackground(): SafeValue {
    let p = this.properties;
    let offsetX = (p.frameX ? p.frameX : 0) + 'px';
    let offsetY = (p.frameY ? p.frameY : 0) + 'px';
    return this.sanitizer.bypassSecurityTrustStyle('url("'+p.imageUrl+'") ' + offsetX + ' ' + offsetY);
  }

}

export interface ImageFrameProperties {
  imageUrl: string;

  frameWidth?: number;
  frameHeight?: number;
  frameX?: number;
  frameY?: number;
}
