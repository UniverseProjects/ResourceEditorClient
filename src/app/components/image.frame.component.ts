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
           [style.left.px]="getContainerOffsetX()"
           [style.top.px]="getContainerOffsetY()"
           [style.transform]="getContainerTransform()" 
           [style.msTransform]="getContainerTransform()" 
           [style.webkitTransform]="getContainerTransform()">

        <img class="image" [src]="properties.imageUrl"
             [class.image-border]="properties.imageBorder"
             [class.image-fit-frame]="imageFitFrame"
             [style.left.px]="getImageOffsetX()"
             [style.top.px]="getImageOffsetY()"/>
      </div>
    </div>
  `
})
export class ImageFrameComponent implements OnInit, OnDestroy {

  @Input() properties: ImageFrameProperties;

  imageFitFrame: boolean;
  sectionDefined: boolean;
  private containerTransformScale: number = null;
  private containerTransform: SafeStyle = null;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    if (!this.properties) {
      throw new Error('Image-frame properties must be provided');
    }
    let p = this.properties;
    if (!C.defined(p.imageUrl)) {
      throw new Error('Image-url must be defined')
    }
    if (!C.defined(p.width)) {
      p.width = 200;
    }
    if (!C.defined(p.height)) {
      p.height = 200;
    }

    this.sectionDefined = C.defined(p.sectionWidth) || C.defined(p.sectionHeight);
    if (C.defined(p.sectionWidth) && !C.defined(p.sectionHeight)) {
      p.sectionHeight = p.sectionWidth;
    }
    if (!C.defined(p.sectionWidth) && C.defined(p.sectionHeight)) {
      p.sectionWidth = p.sectionHeight;
    }
    if (this.sectionDefined && !C.defined(p.sectionX)) {
      p.sectionX = 0;
    }
    if (this.sectionDefined && !C.defined(p.sectionY)) {
      p.sectionY = 0;
    }

    this.imageFitFrame = !this.sectionDefined;
  }

  ngOnDestroy() {
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

  getContainerOffsetX(): number {
    if (!this.sectionDefined) {
      return 0; // only applicable in section-mode
    }
    let p = this.properties;
    let displayWidth = p.sectionWidth * this.getTransformScale();
    return p.width > displayWidth ? (p.width - displayWidth) / 2 : 0;
  }

  getContainerOffsetY(): number {
    if (!this.sectionDefined) {
      return 0; // only applicable in section-mode
    }
    let p = this.properties;
    let displayHeight = p.sectionHeight * this.getTransformScale();
    return p.height > displayHeight ? (p.height - displayHeight) / 2 : 0;
  }

  getTransformScale(): number {
    if (this.containerTransformScale == null) {
      let p = this.properties;
      if (!this.sectionDefined) {
        // Not applicable outside of section-mode
        this.containerTransformScale = 1;
      }
      else if (p.width >= p.sectionWidth && p.height >= p.sectionHeight) {
        // Not applicable when the frame dimensions can fit the section dimensions
        this.containerTransformScale = 1;
      }
      else {
        // To support all combinations of rectangles, the result is based on which dimension has a greater discrepancy
        let widthProportion = p.width / p.sectionWidth;
        let heightProportion = p.height / p.sectionHeight;
        this.containerTransformScale = widthProportion < heightProportion ? widthProportion : heightProportion;
      }
    }
    return this.containerTransformScale;
  }

  getContainerTransform(): SafeStyle {
    if (this.containerTransform == null) {
      let transformStr = 'none';
      let scale = this.getTransformScale();
      if (scale < 1) {
        transformStr = 'translate(-50%, -50%) scale(' + scale + ', ' + scale + ') translate(50%, 50%)';
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
  width?: number;
  height?: number;
  imageBorder?: boolean;
  sectionWidth?: number;
  sectionHeight?: number;
  sectionX?: number;
  sectionY?: number;
}
