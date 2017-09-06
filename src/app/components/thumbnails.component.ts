import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-thumbnails',
  styles: [`
    .image-container {
      width: 100px;
      height: 100px;
      border: solid #888 1px;
      margin: 0 5px 5px 0;
      padding: 2px;
      display: inline-block;
      vertical-align: top;
      position: relative;
    }
    .image-container:hover {
      background-color: #ade4ff;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      position: absolute;
      left: 50%;
      top: 50%;
    
      -ms-transform: translate(-50%, -50%); /* IE 9 */
      -webkit-transform: translate(-50%, -50%); /* Safari */
      transform: translate(-50%, -50%);
    }
  `],
  template: `<div class="images">
    <div *ngFor="let imageUrl of imageUrls; let i = index"
         (click)="onSelect(i)"
         class="image-container" [class.selected]="false">
      <img src="{{imageUrl}}"/>
    </div>
  </div>`,
})
export class ThumbnailsComponent {
  @Input() imageUrls: string[] = [];
  @Output() onSelected = new EventEmitter<number>();

  onSelect(index: number): void {
    // console.log('Selected thumbnail index ' + index);
    this.onSelected.emit(index);
  }
}
