import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeValue} from '@angular/platform-browser';

@Component({
  selector: 'app-image-frame',
  styles:[`
    .image-frame {
      border: solid #888 1px;
      /*padding: 2px;*/
      /*background-clip: padding-box;*/
      /*background-origin: padding-box;*/
      background-repeat: no-repeat;
    }
  `],
  template:`
      <div class="image-frame"
           [style.width]="getCssWidth()"
           [style.height]="getCssHeight()"
           [style.background-image]="getCssBackgroundImage()"
           [style.background-position]="getCssBackgroundPosition()"
           [style.background-size]="getCssBackgroundSize()"
      ></div> 
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
    let p = this.properties;

    if (p.scaleToFrame === true && (p.frameX || p.frameY)) {
      throw new Error('Frame-position and scale-to-frame are not supported together');
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

  getCssBackgroundImage(): SafeValue {
    let p = this.properties;
    return this.sanitizer.bypassSecurityTrustStyle('url("'+p.imageUrl+'")');
  }

  getCssBackgroundPosition(): string {
    let p = this.properties;
    if (p.scaleToFrame === true) {
      return 'center';
    }
    else {
      let posX = -(p.frameX ? p.frameX : 0) + 'px';
      let posY = -(p.frameY ? p.frameY : 0) + 'px';
      return posX + ' ' + posY;
    }
  }

  getCssBackgroundSize(): string {
    let p = this.properties;
    if (p.scaleToFrame === true) {
      return 'contain';
    }
    else {
      return 'auto';
    }
  }

}

export interface ImageFrameProperties {
  imageUrl: string;
  scaleToFrame?: boolean;
  frameWidth?: number;
  frameHeight?: number;
  frameX?: number;
  frameY?: number;
}
