import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-thumbnails',
  styles: [`
    .thumbnail-container {
      margin: 0 5px 5px 0;
      display: inline-block;
      vertical-align: top;
    }
    .thumbnail-container:hover {
      background-color: #ade4ff;
    }
  `],
  template: `
    <div class="thumbnails-container">
      <div class="thumbnail-container" *ngFor="let imageUrl of imageUrls; let i = index" (click)="onSelect(i)">
        <app-image-frame 
          [properties]="{
            imageUrl: imageUrl, 
            width: 100, 
            height: 100, 
            fitFrame: true, 
            imageBorder:false
          }"></app-image-frame>
      </div>
    </div>
  `,
})
export class ThumbnailsComponent {
  @Input() imageUrls: string[] = [];
  @Output() onSelected = new EventEmitter<number>();

  onSelect(index: number): void {
    this.onSelected.emit(index);
  }
}
