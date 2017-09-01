import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-thumbnails',
  template: `<div class="images">
    <div *ngFor="let imageUrl of imageUrls; let i = index"
         (click)="onSelect(i)"
         class="image-container" [class.selected]="false">
      <img src="{{imageUrl}}"/>
    </div>
  </div>`,
  styleUrls: [`./thumbnails.component.css`],
})
export class ThumbnailsComponent {
  @Input() imageUrls: string[] = [];
  @Output() onSelected = new EventEmitter<number>();

  onSelect(index: number): void {
    // console.log('Selected thumbnail index ' + index);
    this.onSelected.emit(index);
  }
}
