import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {C} from '../common/common';

@Component({
  selector: 'app-image-frame',
  styles:[`
    .frame-container {
      border: solid #888 1px;
      box-sizing: content-box;
    }

    .image-container {
      display: inline-block;
      vertical-align: top;
      position: relative;
      overflow: hidden;
    }

    .image {
      position: absolute;
      box-sizing: content-box;
    }
    
    .image-border {
      border: solid #888 1px;
    }

    .image-fit-frame { 
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      -ms-transform: translate(-50%, -50%); /* IE 9 */
      -webkit-transform: translate(-50%, -50%); /* Safari */
      transform: translate(-50%, -50%);
    }
  `],
  template:`
    <div class="frame-container"
         [style.width.px]="getWidth()"
         [style.height.px]="getHeight()">

      <div class="image-container"
           [style.width.px]="getContainerWidth()"
           [style.height.px]="getContainerHeight()"
           [style.transform]="getContainerTransform()" [style.msTransform]="getContainerTransform()" [style.webkitTransform]="getContainerTransform()">

        <img class="image" [src]="properties.imageUrl"
             [class.image-fit-frame]="properties.fitFrame"
             [class.image-border]="properties.imageBorder"
             [style.left.px]="getImageOffsetX()"
             [style.top.px]="getImageOffsetY()"/>
      </div>
    </div>
  `
})
export class ImageFrameComponent implements OnInit, OnDestroy {

  @Input() properties: ImageFrameProperties;

  private containerTransform: SafeStyle = null;
  private sectionDefined: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (!this.properties) {
      throw new Error('Properties must be provided');
    }
    let p = this.properties;
    if (!C.defined(p.imageUrl)) {
      throw new Error('Image-url must be defined')
    }
    if (!C.defined(p.width) || !C.defined(p.height)) {
      throw new Error('Width and height must be defined');
    }
    if (C.xor(C.defined(p.sectionWidth), C.defined(p.sectionHeight))) {
      throw new Error('When using a section, both section-width and section-height must be defined');
    }
    if (C.defined(p.sectionWidth)) {
      if (!C.defined(p.sectionX)) {
        p.sectionX = 0;
      }
      if (!C.defined(p.sectionY)) {
        p.sectionY = 0;
      }
    }
    this.sectionDefined = C.defined(p.sectionWidth);
  }

  ngOnDestroy(): void {
  }

  getWidth(): number {
    return this.properties.width;
  }

  getHeight(): number {
    return this.properties.height;
  }

  getContainerWidth(): number {
    let p = this.properties;
    return this.sectionDefined ? p.sectionWidth : p.width;
  }

  getContainerHeight(): number {
    let p = this.properties;
    return this.sectionDefined ? p.sectionHeight : p.height;
  }

  getContainerTransform(): SafeStyle {
    if (this.containerTransform == null) {
      let transformStr = null;
      let p = this.properties;
      if (p.fitFrame) {
        transformStr = 'none';
      }
      else if (p.width === p.sectionWidth && p.height === p.sectionHeight) {
        transformStr = 'none';
      }
      else {
        let scaleX = p.width / p.sectionWidth;
        let scaleY = p.height / p.sectionHeight;
        transformStr = 'translate(-50%, -50%) scale(' + scaleX + ', ' + scaleY + ') translate(50%, 50%)';
      }
      this.containerTransform = this.sanitizer.bypassSecurityTrustStyle(transformStr);
    }

    return this.containerTransform;
  }

  getImageOffsetX(): number {
    let p = this.properties;
    return this.sectionDefined ? -p.sectionX : p.width/2;
  }

  getImageOffsetY(): number {
    let p = this.properties;
    return this.sectionDefined ? -p.sectionY : p.height/2;
  }

}

export interface ImageFrameProperties {
  imageUrl: string;
  width: number;
  height: number;

  sectionWidth?: number;
  sectionHeight?: number;
  sectionX?: number;
  sectionY?: number;

  fitFrame?: boolean;
  imageBorder?: boolean;
}
