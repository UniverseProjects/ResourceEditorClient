import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {C} from '../common/common';
import {ImageFrameProperties} from './image.frame.component';

@Component({
  selector: 'thumbnails',
  styles: [`
    .thumbnail-wrapper {
      display: inline-block;
      vertical-align: top;
      box-sizing: content-box;
      border: 3px solid #fff;
    }

    .thumbnail-wrapper:hover {
      background-color: #ade4ff;
      border: 3px solid #ade4ff;
    }
  `],
  template: `
    <div class="thumbnails-container">
      <div class="thumbnail-wrapper" *ngFor="let th of thumbnails; let i = index" (click)="onSelect(i)">
        <image-frame [properties]="toFrameProperties(th)"></image-frame>
      </div>
    </div>
  `,
})
export class ThumbnailsComponent implements OnInit {

  @Input() size = 100;
  @Input() thumbnails: ThumbnailProperties[];
  @Output() onSelected = new EventEmitter<number>();

  ngOnInit() {
    if (!C.defined(this.thumbnails)) {
      throw new Error('Thumbnail data must be provided');
    }
  }

  onSelect(index: number) {
    this.onSelected.emit(index);
  }

  toFrameProperties(th: ThumbnailProperties): ImageFrameProperties {
    return {
      imageUrl: th.imageUrl,
      width: this.size,
      height: this.size,
      imageBorder: false,
      sectionWidth: th.sectionWidth,
      sectionHeight: th.sectionHeight,
      sectionX: th.sectionX,
      sectionY: th.sectionY,
    }
  }
}

export interface ThumbnailProperties {
  imageUrl: string
  sectionWidth?: number
  sectionHeight?: number
  sectionX?: number
  sectionY?: number
}
